/**
 * @package CREATOR-STAGING — Preferences Menu
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Unified preferences dropdown — theme + language + accessibility
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
import { usePathname } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';
import { useTheme, type ThemeMode } from '@/lib/theme-context';
import { getSlotDescriptor } from '@/lib/ambient';

// ───────────────────────── Types ─────────────────────────

type Props = {
  locale: string;
  labels: {
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
};

type A11yPrefs = {
  highContrast: boolean;
  dyslexia: boolean;
  reducedStim: boolean;
};

// ───────────────────────── Constants ─────────────────────────

const A11Y_STORAGE_KEY = 'creator-a11y-prefs';
const A11Y_DEFAULTS: A11yPrefs = { highContrast: false, dyslexia: false, reducedStim: false };
const A11Y_CLASS_MAP: Record<keyof A11yPrefs, string> = {
  highContrast: 'a11y-high-contrast',
  dyslexia: 'a11y-dyslexia',
  reducedStim: 'a11y-reduced-stim',
};

const THEME_MODES: ReadonlyArray<{ value: ThemeMode; labelKey: keyof Props['labels'] }> = [
  { value: 'dark', labelKey: 'theme_dark' },
  { value: 'light', labelKey: 'theme_light' },
  { value: 'ambient', labelKey: 'theme_ambient' },
  { value: 'auto', labelKey: 'theme_auto' },
] as const;

// ───────────────────────── Helpers ─────────────────────────

function readStoredA11y(): A11yPrefs {
  if (typeof window === 'undefined') return A11Y_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return A11Y_DEFAULTS;
    const p = JSON.parse(raw) as Partial<A11yPrefs>;
    return {
      highContrast: Boolean(p.highContrast),
      dyslexia: Boolean(p.dyslexia),
      reducedStim: Boolean(p.reducedStim),
    };
  } catch {
    return A11Y_DEFAULTS;
  }
}

function applyA11yClasses(prefs: A11yPrefs): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  (Object.keys(A11Y_CLASS_MAP) as (keyof A11yPrefs)[]).forEach((k) => {
    const cls = A11Y_CLASS_MAP[k];
    prefs[k] ? root.classList.add(cls) : root.classList.remove(cls);
  });
}

// ───────────────────────── Component ─────────────────────────

export function PreferencesMenu({ locale, labels }: Props): JSX.Element {
  const { mode, setMode, isAmbientActive, ambientSlot } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [a11y, setA11y] = useState<A11yPrefs>(A11Y_DEFAULTS);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const headingId = `${panelId}-heading`;

  // Hydrate a11y prefs from storage (SSR-safe lazy init)
  useEffect(() => {
    const stored = readStoredA11y();
    setA11y(stored);
    applyA11yClasses(stored);
    setMounted(true);
  }, []);

  // Persist + apply on change
  useEffect(() => {
    if (!mounted) return;
    applyA11yClasses(a11y);
    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(a11y));
    } catch {
      /* quota / private mode / SecurityError: degrade silently */
    }
  }, [a11y, mounted]);

  // Close on outside click
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

  // Close on Escape (+ restore focus)
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

  // Close on focus leaving the panel (tab-out)
  const onPanelBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next) return;
    if (panelRef.current && !panelRef.current.contains(next) && next !== triggerRef.current) {
      setIsOpen(false);
    }
  }, []);

  const switchLocale = useCallback((newLocale: string) => {
    const rest = pathname.replace(`/${locale}`, '') || '/';
    window.location.href = `/${newLocale}${rest}`;
  }, [pathname, locale]);

  const toggleA11y = useCallback((key: keyof A11yPrefs) => {
    setA11y((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const onTriggerKeyDown = useCallback((e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLElement>('[role="radio"]')?.focus();
      });
    }
  }, []);

  const slotDescriptor = isAmbientActive ? getSlotDescriptor(ambientSlot) : null;

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-label={labels.preferences}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          onBlur={onPanelBlur}
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-2xl z-[60]"
          style={{ animation: a11y.reducedStim ? 'none' : 'preferences-fade 160ms ease-out' }}
        >
          <h2 id={headingId} className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
            {labels.preferences}
          </h2>

          {/* Theme */}
          <section aria-labelledby={`${panelId}-theme`} className="mb-4">
            <h3 id={`${panelId}-theme`} className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              {labels.theme}
            </h3>
            <div role="radiogroup" aria-labelledby={`${panelId}-theme`} className="grid grid-cols-2 gap-1.5">
              {THEME_MODES.map(({ value, labelKey }) => {
                const selected = mode === value;
                return (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setMode(value)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      selected
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <span className="truncate">{labels[labelKey]}</span>
                  </button>
                );
              })}
            </div>
            {slotDescriptor && (
              <p className="mt-2 text-[11px] text-[var(--text-muted)]" role="status">
                {labels.current_slot.replace('{slot}', slotDescriptor.label)}
              </p>
            )}
          </section>

          {/* Language */}
          <section aria-labelledby={`${panelId}-lang`} className="mb-4">
            <h3 id={`${panelId}-lang`} className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              {labels.language}
            </h3>
            <ul role="listbox" aria-labelledby={`${panelId}-lang`} className="grid grid-cols-2 gap-1">
              {locales.map((l) => {
                const selected = l === locale;
                return (
                  <li key={l}>
                    <button
                      role="option"
                      aria-selected={selected}
                      onClick={() => switchLocale(l)}
                      className={`w-full px-2.5 py-1.5 rounded-md text-xs text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        selected
                          ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-medium'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {localeNames[l as Locale]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Accessibility */}
          <section aria-labelledby={`${panelId}-a11y`}>
            <h3 id={`${panelId}-a11y`} className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              {labels.accessibility}
            </h3>
            <ul className="space-y-1.5">
              <A11yToggle label={labels.a11y_high_contrast} checked={a11y.highContrast} onToggle={() => toggleA11y('highContrast')} />
              <A11yToggle label={labels.a11y_dyslexia} checked={a11y.dyslexia} onToggle={() => toggleA11y('dyslexia')} />
              <A11yToggle label={labels.a11y_reduced_motion} checked={a11y.reducedStim} onToggle={() => toggleA11y('reducedStim')} />
            </ul>
          </section>
        </div>
      )}

      <style jsx>{`
        @keyframes preferences-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ───────────────────────── Subcomponent ─────────────────────────

function A11yToggle({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }): JSX.Element {
  return (
    <li>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-md text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
      >
        <span className="truncate text-left">{label}</span>
        <span
          aria-hidden="true"
          className={`relative inline-block w-8 h-4 rounded-full transition-colors flex-shrink-0 ${
            checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
              checked ? 'translate-x-[18px]' : 'translate-x-0.5'
            }`}
          />
        </span>
      </button>
    </li>
  );
}
