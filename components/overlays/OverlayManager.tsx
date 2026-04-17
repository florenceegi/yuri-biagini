/**
 * @package CREATOR-STAGING — OverlayManager (overlays/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Single mount point for all app-level overlays (AI Companion, Search, Wishlist, Quick View). Listens to CustomEvents on window, enforces mutual exclusivity, and renders into #overlay-root via createPortal.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AICompanionDrawer, type DrawerLabels } from './AICompanionDrawer';
import { SearchOverlay } from './SearchOverlay';
import { WishlistDrawer } from './WishlistDrawer';
import { QuickViewModal } from './QuickViewModal';
import { useQuickView, type QuickViewArtwork } from '@/lib/quickview-context';

// ───────────────────────── Event names ─────────────────────────

const EVT_AI_TOGGLE = 'creator:ai:toggle';
const EVT_AI_CLOSE = 'creator:ai:close';
const EVT_SEARCH_OPEN = 'creator:search:open';
const EVT_SEARCH_CLOSE = 'creator:search:close';
const EVT_WISHLIST_OPEN = 'creator:wishlist:open';
const EVT_WISHLIST_CLOSE = 'creator:wishlist:close';
const EVT_QUICKVIEW_OPEN = 'creator:quickview:open';

// ───────────────────────── Types ─────────────────────────

type ActiveOverlay = 'ai' | 'search' | 'wishlist' | 'quickview' | null;

type QuickViewOpenEvent = CustomEvent<{ artwork: QuickViewArtwork }>;

// ───────────────────────── i18n — static labels (F3.1) ─────────────────────────
// F3.1 ships with Italian + English only for the AI drawer.
// NextIntlClientProvider is NOT wired in this app, so client components
// cannot use useTranslations yet. These maps mirror the `ai` namespace in
// messages/{it,en}.json. Keep them in sync until the provider is wired.
// Other 4 locales (fr, de, es, zh) fall back to EN until F2.2.1 batch.

const LABELS_IT: DrawerLabels = {
  title: 'La Guida',
  welcome:
    'Ciao, sono la tua guida in questo spazio. Posso raccontarti la storia dietro un\u2019opera, spiegarti la tecnica, o aiutarti a trovare quella che ti parla.',
  placeholder: 'Scrivi la tua domanda\u2026',
  send: 'Invia',
  close: 'Chiudi la Guida',
  mock_response:
    'Grazie per la tua domanda. Questa \u00e8 una versione dimostrativa \u2014 la connessione al RAG dell\u2019artista sar\u00e0 attiva presto.',
  prompt_1: 'Raccontami la storia di quest\u2019opera',
  prompt_2: 'Quali tecniche usa l\u2019artista',
  prompt_3: 'Mostrami opere simili',
  disclaimer: 'Assistente in anteprima \u2014 le risposte sono dimostrative',
  you: 'Tu',
  guide: 'La Guida',
};

const LABELS_EN: DrawerLabels = {
  title: 'The Guide',
  welcome:
    "Hi, I'm your guide in this space. I can tell you the story behind a work, explain the technique, or help you find the one that speaks to you.",
  placeholder: 'Ask me anything\u2026',
  send: 'Send',
  close: 'Close The Guide',
  mock_response:
    "Thanks for your question. This is a preview \u2014 the artist's RAG connection will be live soon.",
  prompt_1: 'Tell me the story of this work',
  prompt_2: 'What techniques does the artist use',
  prompt_3: 'Show me similar works',
  disclaimer: 'Preview assistant \u2014 responses are mock',
  you: 'You',
  guide: 'The Guide',
};

function resolveLabels(): DrawerLabels {
  if (typeof window === 'undefined') return LABELS_IT;
  // Locale is the first path segment, e.g. /it/works or /en
  const seg = window.location.pathname.split('/').filter(Boolean)[0] || 'it';
  if (seg === 'it') return LABELS_IT;
  // en / fr / de / es / zh all fall back to EN for F3.1
  return LABELS_EN;
}

// ───────────────────────── Component ─────────────────────────

export function OverlayManager() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<ActiveOverlay>(null);
  const [labels, setLabels] = useState<DrawerLabels>(LABELS_IT);
  const openerRef = useRef<HTMLElement | null>(null);

  const quickview = useQuickView();

  // Portal target — must wait for client mount (SSR-safe)
  useEffect(() => {
    setMounted(true);
    setLabels(resolveLabels());
  }, []);

  // Re-resolve labels when the URL changes within a single client session.
  useEffect(() => {
    if (!mounted) return;
    const onPop = () => setLabels(resolveLabels());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [mounted]);

  const captureOpener = useCallback(() => {
    if (typeof document !== 'undefined') {
      const el = document.activeElement;
      openerRef.current = el instanceof HTMLElement ? el : null;
    }
  }, []);

  const openOverlay = useCallback(
    (next: Exclude<ActiveOverlay, null>) => {
      captureOpener();
      setActive((prev) => {
        // Opening a non-quickview overlay while quickview is active → close quickview.
        if (prev === 'quickview' && next !== 'quickview') {
          quickview.close();
        }
        return next;
      });
    },
    [captureOpener, quickview]
  );

  const closeOverlay = useCallback(() => {
    setActive((prev) => {
      if (prev === 'quickview') {
        quickview.close();
      }
      return null;
    });
  }, [quickview]);

  // Keep state slot in sync with quickview context (bidirectional).
  // OPEN direction: context opened directly (not via event) → claim mutex slot
  // and capture opener so focus can return on close.
  // CLOSE direction: context closed externally (Esc, navigation, provider) →
  // release slot.
  useEffect(() => {
    if (quickview.isOpen && active !== 'quickview') {
      if (typeof document !== 'undefined') {
        const el = document.activeElement;
        openerRef.current = el instanceof HTMLElement ? el : null;
      }
      setActive('quickview');
    } else if (!quickview.isOpen && active === 'quickview') {
      setActive(null);
    }
  }, [quickview.isOpen, active]);

  // Event bus — listen on window
  useEffect(() => {
    if (!mounted) return;

    const onAIToggle = () => {
      setActive((prev) => {
        if (prev === 'ai') return null;
        // Opening AI while quickview is active → close quickview first.
        if (prev === 'quickview') quickview.close();
        if (typeof document !== 'undefined') {
          const el = document.activeElement;
          openerRef.current = el instanceof HTMLElement ? el : null;
        }
        return 'ai';
      });
    };
    const onAIClose = () => {
      setActive((prev) => (prev === 'ai' ? null : prev));
    };

    const onSearchOpen = () => openOverlay('search');
    const onSearchClose = () => {
      setActive((prev) => (prev === 'search' ? null : prev));
    };

    const onWishlistOpen = () => openOverlay('wishlist');
    const onWishlistClose = () => {
      setActive((prev) => (prev === 'wishlist' ? null : prev));
    };

    const onQuickViewOpen = (e: Event) => {
      const ce = e as QuickViewOpenEvent;
      const artwork = ce.detail?.artwork;
      if (
        !artwork ||
        typeof artwork.id !== 'string' ||
        artwork.id.length === 0 ||
        typeof artwork.title !== 'string' ||
        typeof artwork.imageUrl !== 'string'
      ) {
        console.warn(
          '[OverlayManager] creator:quickview:open ignored: invalid artwork payload',
          artwork
        );
        return;
      }
      captureOpener();
      quickview.open(artwork);
      setActive('quickview');
    };

    window.addEventListener(EVT_AI_TOGGLE, onAIToggle);
    window.addEventListener(EVT_AI_CLOSE, onAIClose);
    window.addEventListener(EVT_SEARCH_OPEN, onSearchOpen);
    window.addEventListener(EVT_SEARCH_CLOSE, onSearchClose);
    window.addEventListener(EVT_WISHLIST_OPEN, onWishlistOpen);
    window.addEventListener(EVT_WISHLIST_CLOSE, onWishlistClose);
    window.addEventListener(EVT_QUICKVIEW_OPEN, onQuickViewOpen);

    return () => {
      window.removeEventListener(EVT_AI_TOGGLE, onAIToggle);
      window.removeEventListener(EVT_AI_CLOSE, onAIClose);
      window.removeEventListener(EVT_SEARCH_OPEN, onSearchOpen);
      window.removeEventListener(EVT_SEARCH_CLOSE, onSearchClose);
      window.removeEventListener(EVT_WISHLIST_OPEN, onWishlistOpen);
      window.removeEventListener(EVT_WISHLIST_CLOSE, onWishlistClose);
      window.removeEventListener(EVT_QUICKVIEW_OPEN, onQuickViewOpen);
    };
  }, [mounted, openOverlay, captureOpener, quickview]);

  if (!mounted || typeof document === 'undefined') return null;

  const portalTarget = document.getElementById('overlay-root');
  if (!portalTarget) return null;

  return createPortal(
    <>
      <AICompanionDrawer
        open={active === 'ai'}
        onClose={closeOverlay}
        labels={labels}
        opener={openerRef.current}
      />
      <SearchOverlay
        open={active === 'search'}
        onClose={closeOverlay}
        opener={openerRef.current}
      />
      <WishlistDrawer
        open={active === 'wishlist'}
        onClose={closeOverlay}
        opener={openerRef.current}
      />
      <QuickViewModal
        open={active === 'quickview'}
        onClose={closeOverlay}
        opener={openerRef.current}
      />
    </>,
    portalTarget
  );
}

export default OverlayManager;
