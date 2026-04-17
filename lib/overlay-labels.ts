/**
 * @package CREATOR-STAGING — Overlay Shared Helpers (lib/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Shared helpers for F3.x overlay components: (1) locale resolution (IT/EN inline labels while NextIntlClientProvider is not yet wired client-side), (2) focus-trap selector + helper used by QuickViewModal, SearchOverlay, WishlistDrawer and AICompanionDrawer. Keeping both in one tiny file avoids file-count bloat — neither is meaningful without overlays.
 */
'use client';

export type OverlayLocale = 'it' | 'en';

/**
 * Resolve the active locale from the URL (first path segment).
 * SSR-safe: returns 'it' on the server to keep hydration stable with
 * Italian as the default UX locale. Client re-runs this after mount.
 */
export function resolveOverlayLocale(): OverlayLocale {
  if (typeof window === 'undefined') return 'it';
  const seg = window.location.pathname.split('/').filter(Boolean)[0] || 'it';
  if (seg === 'it') return 'it';
  // en / fr / de / es / zh → EN fallback
  return 'en';
}

/**
 * Pick between an IT and EN dictionary based on the resolved locale.
 * Keep the generic loose so each overlay can supply its own label shape.
 */
export function pickOverlayLabels<T>(it: T, en: T, locale?: OverlayLocale): T {
  const l = locale ?? resolveOverlayLocale();
  return l === 'it' ? it : en;
}

// ───────────────────────── Focus trap helpers ─────────────────────────

export const OVERLAY_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Return the focusable descendants of `root`, skipping hidden / off-screen nodes.
 * Used by each overlay to implement the Tab / Shift+Tab focus wrap.
 */
export function getOverlayFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const nodes = root.querySelectorAll<HTMLElement>(OVERLAY_FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter(
    (el) => !el.hasAttribute('hidden') && el.offsetParent !== null
  );
}
