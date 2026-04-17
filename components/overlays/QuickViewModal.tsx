/**
 * @package CREATOR-STAGING — QuickViewModal (overlays/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Centered quick-view modal for a single artwork. Reads the current artwork from QuickViewContext. Left side: image (~60% desktop). Right side: title, year, technique, dimensions, availability, description, CTAs (View on FlorenceEGI external + Add/Remove from wishlist). Mobile: stacked. Focus trap, Esc, backdrop, scroll-lock, reduced-motion.
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
import { useQuickView, type QuickViewArtwork } from '@/lib/quickview-context';
import { useWishlist } from '@/lib/wishlist-context';
import { getOverlayFocusable, pickOverlayLabels } from '@/lib/overlay-labels';

// ───────────────────────── Types ─────────────────────────

export type QuickViewLabels = {
  close: string;
  year: string;
  technique: string;
  dimensions: string;
  availability: string;
  view_on_egi: string;
  add_to_wishlist: string;
  remove_from_wishlist: string;
  no_description: string;
  available: string;
  sold: string;
  reserved: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  opener: HTMLElement | null;
};

// ───────────────────────── i18n (inline IT/EN) ─────────────────────────

const LABELS_IT: QuickViewLabels = {
  close: 'Chiudi',
  year: 'Anno',
  technique: 'Tecnica',
  dimensions: 'Dimensioni',
  availability: 'Disponibilita\u2019',
  view_on_egi: 'Vedi su FlorenceEGI',
  add_to_wishlist: 'Aggiungi alla wishlist',
  remove_from_wishlist: 'Rimuovi dalla wishlist',
  no_description: 'Nessuna descrizione disponibile',
  available: 'Disponibile',
  sold: 'Venduto',
  reserved: 'Riservato',
};

const LABELS_EN: QuickViewLabels = {
  close: 'Close',
  year: 'Year',
  technique: 'Technique',
  dimensions: 'Dimensions',
  availability: 'Availability',
  view_on_egi: 'View on FlorenceEGI',
  add_to_wishlist: 'Add to wishlist',
  remove_from_wishlist: 'Remove from wishlist',
  no_description: 'No description available',
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
};

function availabilityLabel(
  av: QuickViewArtwork['availability'] | undefined,
  labels: QuickViewLabels
): string | null {
  if (!av) return null;
  if (av === 'available') return labels.available;
  if (av === 'sold') return labels.sold;
  if (av === 'reserved') return labels.reserved;
  return null;
}

function availabilityColor(av: QuickViewArtwork['availability'] | undefined): string {
  if (av === 'sold') return '#c44';
  if (av === 'reserved') return '#c89'; // accent subdued
  return '#2a8'; // available / default
}

// ───────────────────────── Component ─────────────────────────

export function QuickViewModal({ open, onClose, opener }: Props) {
  const titleId = useId();
  const descId = useId();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [labels, setLabels] = useState<QuickViewLabels>(LABELS_IT);

  const quickview = useQuickView();
  const wishlist = useWishlist();
  const artwork = quickview.current;

  // Resolve locale once on mount
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
    const transitionMs = prefersReducedMotion ? 0 : 220;
    const t = window.setTimeout(() => setMounted(false), transitionMs);
    return () => window.clearTimeout(t);
  }, [open, prefersReducedMotion]);

  // scroll-lock handled by QuickViewProvider (single source of truth)

  // Focus management
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
      const focusables = getOverlayFocusable(modalRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === first || !modalRef.current?.contains(activeEl)) {
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

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);

  const handleWishlistToggle = useCallback(() => {
    if (!artwork) return;
    wishlist.toggle({
      id: artwork.id,
      title: artwork.title,
      imageUrl: artwork.imageUrl,
    });
  }, [artwork, wishlist]);

  if (!mounted || !artwork) return null;

  const inWishlist = wishlist.isInWishlist(artwork.id);
  const avLabel = availabilityLabel(artwork.availability, labels);
  const avColor = availabilityColor(artwork.availability);

  const transitionStyle = prefersReducedMotion
    ? 'opacity 160ms ease-out'
    : 'transform 220ms ease-out, opacity 220ms ease-out';

  const modalTransform = prefersReducedMotion
    ? 'none'
    : visible
      ? 'scale(1)'
      : 'scale(0.96)';

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
        onClick={handleBackdropClick}
        aria-hidden="true"
        className="absolute inset-0 bg-black/55"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease-out',
        }}
      />
      {/* Modal */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          onKeyDown={onKeyDownCapture}
          className="relative w-full max-w-[1200px] max-h-[90vh] overflow-hidden rounded-2xl flex flex-col sm:flex-row"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            boxShadow: '0 32px 96px rgba(0,0,0,0.45)',
            transform: modalTransform,
            opacity: visible ? 1 : 0,
            transition: transitionStyle,
            willChange: 'transform, opacity',
            pointerEvents: 'auto',
          }}
        >
          {/* Close button (floats top-right, always visible) */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              backdropFilter: 'blur(6px)',
            }}
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

          {/* Image pane */}
          <div
            className="w-full sm:w-3/5 bg-black flex items-center justify-center overflow-hidden"
            style={{ minHeight: '260px', maxHeight: '90vh' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-contain"
              style={{ maxHeight: '90vh' }}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Metadata pane */}
          <div
            className="w-full sm:w-2/5 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 flex flex-col gap-4"
            style={{ borderLeft: '1px solid var(--border)' }}
          >
            <h2
              id={titleId}
              className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug pr-10"
              style={{ color: 'var(--text-primary)' }}
            >
              {artwork.title}
            </h2>

            <dl className="flex flex-col gap-2 text-sm">
              {artwork.year ? (
                <div className="flex gap-2">
                  <dt
                    className="min-w-[110px] uppercase tracking-wider text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {labels.year}
                  </dt>
                  <dd style={{ color: 'var(--text-primary)' }}>
                    {artwork.year}
                  </dd>
                </div>
              ) : null}
              {artwork.technique ? (
                <div className="flex gap-2">
                  <dt
                    className="min-w-[110px] uppercase tracking-wider text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {labels.technique}
                  </dt>
                  <dd style={{ color: 'var(--text-primary)' }}>
                    {artwork.technique}
                  </dd>
                </div>
              ) : null}
              {artwork.dimensions ? (
                <div className="flex gap-2">
                  <dt
                    className="min-w-[110px] uppercase tracking-wider text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {labels.dimensions}
                  </dt>
                  <dd style={{ color: 'var(--text-primary)' }}>
                    {artwork.dimensions}
                  </dd>
                </div>
              ) : null}
              {avLabel ? (
                <div className="flex gap-2 items-center">
                  <dt
                    className="min-w-[110px] uppercase tracking-wider text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {labels.availability}
                  </dt>
                  <dd>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        background: `${avColor}22`,
                        color: avColor,
                        border: `1px solid ${avColor}55`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: avColor }}
                      />
                      {avLabel}
                    </span>
                  </dd>
                </div>
              ) : null}
            </dl>

            <p
              id={descId}
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {artwork.description && artwork.description.trim().length > 0
                ? artwork.description
                : labels.no_description}
            </p>

            <div className="mt-auto flex flex-col gap-2 pt-4">
              {artwork.egiUrl ? (
                <a
                  href={artwork.egiUrl}
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
              ) : null}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-pressed={inWishlist}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  background: inWishlist ? 'var(--border)' : 'transparent',
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill={inWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {inWishlist ? labels.remove_from_wishlist : labels.add_to_wishlist}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
