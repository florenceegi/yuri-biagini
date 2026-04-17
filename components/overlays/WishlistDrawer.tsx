/**
 * @package CREATOR-STAGING — WishlistDrawer (overlays/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Right-side wishlist drawer (420px desktop, full-width mobile). Consumes WishlistContext. Header with count badge + close. List of saved items with remove. Footer: Clear all + "View on FlorenceEGI" primary CTA. Focus trap, Esc, backdrop, scroll-lock, reduced-motion.
 */

'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useWishlist } from '@/lib/wishlist-context';
import { getOverlayFocusable, pickOverlayLabels } from '@/lib/overlay-labels';

// ───────────────────────── Types ─────────────────────────

export type WishlistLabels = {
  title: string;
  empty_title: string;
  empty_description: string;
  remove: string;
  clear_all: string;
  view_on_egi: string;
  close: string;
  items_count_one: string;
  items_count_other: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  opener: HTMLElement | null;
};

// ───────────────────────── i18n (inline IT/EN) ─────────────────────────

const LABELS_IT: WishlistLabels = {
  title: 'La tua Wishlist',
  empty_title: 'Ancora nulla di salvato',
  empty_description:
    'Tocca il cuore sulle opere che ami per salvarle qui.',
  remove: 'Rimuovi',
  clear_all: 'Svuota tutto',
  view_on_egi: 'Vedi su FlorenceEGI',
  close: 'Chiudi wishlist',
  items_count_one: '1 opera',
  items_count_other: '{count} opere',
};

const LABELS_EN: WishlistLabels = {
  title: 'Your Wishlist',
  empty_title: 'Nothing saved yet',
  empty_description: 'Heart the works you love to save them here.',
  remove: 'Remove',
  clear_all: 'Clear all',
  view_on_egi: 'View on FlorenceEGI',
  close: 'Close wishlist',
  items_count_one: '1 work',
  items_count_other: '{count} works',
};

// ───────────────────────── Helpers ─────────────────────────

function formatCount(n: number, labels: WishlistLabels): string {
  if (n === 1) return labels.items_count_one;
  return labels.items_count_other.replace('{count}', String(n));
}

function resolveEgiWishlistUrl(): string {
  const envUrl =
    typeof process !== 'undefined' && process.env
      ? process.env.NEXT_PUBLIC_EGI_ARTIST_URL
      : undefined;
  const base = envUrl && envUrl.length > 0 ? envUrl : 'https://art.florenceegi.com';
  const trimmed = base.replace(/\/+$/, '');
  return `${trimmed}/wishlist`;
}

// ───────────────────────── Component ─────────────────────────

export function WishlistDrawer({ open, onClose, opener }: Props) {
  const titleId = useId();
  const countId = useId();

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [labels, setLabels] = useState<WishlistLabels>(LABELS_IT);

  const wishlist = useWishlist();
  const { items, count, remove, clear } = wishlist;

  // Resolve locale on mount
  useEffect(() => {
    setLabels(pickOverlayLabels(LABELS_IT, LABELS_EN));
  }, []);

  // Detect reduced motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mql.matches);
    onChange();
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  // Open/close lifecycle
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const transitionMs = prefersReducedMotion ? 0 : 320;
    const t = window.setTimeout(() => setMounted(false), transitionMs);
    return () => window.clearTimeout(t);
  }, [open, prefersReducedMotion]);

  // Body scroll lock
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus + restore
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 60);
    return () => {
      window.clearTimeout(t);
      if (opener && typeof opener.focus === 'function') {
        try {
          opener.focus();
        } catch {
          /* noop */
        }
      }
    };
  }, [open, opener]);

  // Esc + Tab trap
  const onKeyDownCapture = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = getOverlayFocusable(drawerRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === first || !drawerRef.current?.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  const transitionStyle = prefersReducedMotion
    ? 'opacity 180ms ease-out'
    : 'transform 300ms ease-out, opacity 300ms ease-out';

  const drawerTransform = prefersReducedMotion
    ? 'none'
    : visible
      ? 'translateX(0)'
      : 'translateX(100%)';

  const egiUrl = resolveEgiWishlistUrl();

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/40"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={countId}
        onKeyDown={onKeyDownCapture}
        className="absolute top-0 right-0 h-full w-full sm:w-[420px] flex flex-col"
        style={{
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-24px 0 48px rgba(0,0,0,0.25)',
          transform: drawerTransform,
          opacity: visible ? 1 : 0,
          transition: transitionStyle,
          willChange: 'transform, opacity',
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <h2
              id={titleId}
              className="text-base font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {labels.title}
            </h2>
            <span
              id={countId}
              aria-live="polite"
              className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-semibold"
              style={{
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              <span aria-hidden="true">{count}</span>
              <span className="sr-only">{formatCount(count, labels)}</span>
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none focus:ring-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" aria-live="polite">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12"
                style={{ color: 'var(--text-muted)' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h3
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {labels.empty_title}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-[280px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {labels.empty_description}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-start gap-3 px-5 py-4"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="shrink-0 overflow-hidden rounded-md bg-black"
                    style={{ width: '80px', height: '100px' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-snug break-words"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {it.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    aria-label={`${labels.remove} — ${it.title}`}
                    className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {count > 0 ? (
          <div
            className="px-5 py-4 flex flex-col gap-2"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <a
              href={egiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity focus:outline-none focus:ring-2"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {labels.view_on_egi}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M7 17L17 7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <button
              type="button"
              onClick={clear}
              className="text-xs underline focus:outline-none focus:ring-2 rounded self-center px-1 py-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {labels.clear_all}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default WishlistDrawer;
