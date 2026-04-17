/**
 * @package CREATOR-STAGING — NavigationHelpers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Shared nav helpers — LocaleDropdown, MobileDrawer, MoreMenu
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
import { locales, localeNames, type Locale } from '@/lib/i18n/config';
import { NavigationUtility, type UtilityLabels } from './NavigationUtility';

export type NavLink = { href: string; label: string };

// ───────────────────────── LocaleDropdown ─────────────────────────

type LocaleDropdownProps = {
  localeVal: string;
  switchLocale: (l: string) => void;
  variant?: 'default' | 'brutalist' | 'magazine';
};

export function LocaleDropdown({
  localeVal,
  switchLocale,
  variant = 'default',
}: LocaleDropdownProps) {
  if (variant === 'brutalist') {
    return (
      <ul
        role="listbox"
        className="absolute bottom-full right-0 mb-1 bg-[var(--text-primary)] border-2 border-[var(--accent)] py-1 min-w-[100px]"
      >
        {locales.map((l) => (
          <li key={l}>
            <button
              role="option"
              aria-selected={l === localeVal}
              onClick={() => switchLocale(l)}
              className={`w-full text-left px-3 py-1 text-xs font-mono uppercase ${
                l === localeVal
                  ? 'text-[var(--accent)]'
                  : 'text-white hover:text-[var(--accent)]'
              }`}
            >
              {localeNames[l as Locale]}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      role="listbox"
      className="absolute top-full right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg py-1 min-w-[140px] shadow-xl z-[60]"
    >
      {locales.map((l) => (
        <li key={l}>
          <button
            role="option"
            aria-selected={l === localeVal}
            onClick={() => switchLocale(l)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              l === localeVal
                ? 'text-[var(--accent)] bg-[var(--bg-surface)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            {localeNames[l as Locale]}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── MobileDrawer ─────────────────────────

type MobileDrawerProps = {
  primaryLinks: NavLink[];
  secondaryLinks: NavLink[];
  locale: string;
  pathname: string;
  switchLocale: (l: string) => void;
  utilityLabels: UtilityLabels;
  isLight?: boolean;
};

export function MobileDrawer({
  primaryLinks,
  secondaryLinks,
  locale,
  pathname,
  switchLocale,
  utilityLabels,
  isLight,
}: MobileDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap within drawer (basic tab cycle)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const arr = Array.from(focusables);
      if (arr.length === 0) return;
      const first = arr[0];
      const last = arr[arr.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`lg:hidden fixed inset-0 top-16 z-40 overflow-y-auto ${
        isLight ? 'bg-[var(--bg)]/98' : 'bg-[var(--bg)]/95 backdrop-blur-lg'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <nav className="flex flex-col items-center pt-8 pb-16 gap-6">
        {/* Primary */}
        <ul role="list" className="flex flex-col items-center gap-4 w-full">
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-2xl uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Secondary */}
        {secondaryLinks.length > 0 && (
          <>
            <span
              aria-hidden="true"
              className="block w-12 h-px bg-[var(--border)]"
            />
            <ul role="list" className="flex flex-col items-center gap-3">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm uppercase tracking-widest transition-colors ${
                      pathname === link.href
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Utility bar (compact) */}
        <div className="mt-2">
          <NavigationUtility locale={locale} compact labels={utilityLabels} />
        </div>

        {/* Locale grid */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`text-xs uppercase px-3 py-1 rounded border transition-colors ${
                l === locale
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ───────────────────────── MoreMenu ─────────────────────────

type MoreMenuProps = {
  label: string;
  links: NavLink[];
  pathname: string;
  className?: string;
};

export function MoreMenu({
  label,
  links,
  pathname,
  className = '',
}: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  // Outside click
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  // Escape close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const onTriggerKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => {
          panelRef.current?.querySelector<HTMLElement>('a')?.focus();
        });
      }
    },
    []
  );

  if (links.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="inline-flex items-center gap-1 text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded"
      >
        <span>{label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="5 8 10 13 15 8" />
        </svg>
      </button>
      {isOpen && (
        <ul
          ref={panelRef}
          id={menuId}
          role="menu"
          className="absolute top-full right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg py-1 min-w-[180px] shadow-xl z-[60]"
        >
          {links.map((link) => (
            <li key={link.href} role="none">
              <a
                role="menuitem"
                href={link.href}
                className={`block px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--accent)] bg-[var(--bg-surface)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
