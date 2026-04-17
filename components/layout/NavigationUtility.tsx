/**
 * @package CREATOR-STAGING — NavigationUtility
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Navigation utility bar — search, wishlist counter, AI Companion, Preferences
 */

'use client';

import { useCallback } from 'react';
import { useWishlist } from '@/lib/wishlist-context';
import { PreferencesMenu } from './PreferencesMenu';

// ───────────────────────── Types ─────────────────────────

export type PreferencesLabels = {
  preferences: string;
  theme: string;
  theme_dark: string;
  theme_light: string;
  theme_ambient: string;
  theme_auto: string;
  language: string;
  accessibility: string;
  a11y_high_contrast: string;
  a11y_dyslexia: string;
  a11y_reduced_motion: string;
  current_slot: string;
  close: string;
};

export type UtilityLabels = {
  search: string;
  wishlist: string;
  ai_companion: string;
  prefs: PreferencesLabels;
};

type Props = {
  locale: string;
  compact?: boolean;
  labels: UtilityLabels;
};

// ───────────────────────── Events (UI triggers, no backend) ─────────────────────────

const SEARCH_EVENT = 'creator:search:open';
const AI_EVENT = 'creator:ai:toggle';

function dispatchUIEvent(name: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name));
}

// ───────────────────────── Component ─────────────────────────

export function NavigationUtility({ locale, compact = false, labels }: Props) {
  const { count } = useWishlist();

  const size = compact ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';
  const badgeSize = compact ? 'min-w-[14px] h-[14px] text-[9px]' : 'min-w-[18px] h-[18px] text-[10px]';
  const gap = compact ? 'gap-1' : 'gap-2';

  const onSearchClick = useCallback(() => dispatchUIEvent(SEARCH_EVENT), []);
  const onAIClick = useCallback(() => dispatchUIEvent(AI_EVENT), []);

  const btnBase =
    'relative inline-flex items-center justify-center rounded-full ' +
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors';

  return (
    <div className={`flex items-center ${gap}`} role="group" aria-label={labels.prefs.preferences}>
      {/* Search */}
      <button
        type="button"
        onClick={onSearchClick}
        aria-label={labels.search}
        className={`${btnBase} ${size}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconSize}
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Wishlist */}
      <a
        href={`/${locale}/wishlist`}
        aria-label={count > 0 ? `${labels.wishlist} (${count})` : labels.wishlist}
        className={`${btnBase} ${size}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconSize}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {count > 0 && (
          <span
            aria-hidden="true"
            className={`absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full px-1 font-medium leading-none ${badgeSize}`}
            style={{ background: 'var(--accent)', color: 'var(--bg, #000)' }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </a>

      {/* AI Companion */}
      <button
        type="button"
        onClick={onAIClick}
        aria-label={labels.ai_companion}
        className={`${btnBase} ${size}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconSize}
        >
          <path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9L12 3z" />
          <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8L19 14z" />
          <path d="M5 14l.6 1.4 1.4.6-1.4.6L5 18l-.6-1.4L3 16l1.4-.6L5 14z" />
        </svg>
      </button>

      {/* Preferences (theme/lang/a11y) */}
      <PreferencesMenu locale={locale} labels={labels.prefs} />
    </div>
  );
}
