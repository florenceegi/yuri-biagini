/**
 * @package CREATOR-STAGING — SearchOverlay (overlays/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Full-screen search overlay. Large autofocus input, recent searches (localStorage, dedup, max 8), mock result grid (6 cards, picsum seed from query). No real backend — F3.3 stub for M-061 wiring.
 */

'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  getOverlayFocusable,
  pickOverlayLabels,
  resolveOverlayLocale,
} from '@/lib/overlay-labels';

// ───────────────────────── Types ─────────────────────────

export type SearchLabels = {
  title: string;
  placeholder: string;
  close: string;
  recent: string;
  clear_recent: string;
  results_for: string;
  empty: string;
  no_results: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  opener: HTMLElement | null;
};

type MockResult = {
  id: string;
  title: string;
  image: string;
  href: string;
};

// ───────────────────────── i18n (inline IT/EN) ─────────────────────────

const LABELS_IT: SearchLabels = {
  title: 'Cerca',
  placeholder: 'Cerca opere, serie, tecniche\u2026',
  close: 'Chiudi ricerca',
  recent: 'Ricerche recenti',
  clear_recent: 'Svuota',
  results_for: 'Risultati per',
  empty: 'Inizia a digitare per cercare',
  no_results: 'Nessun risultato',
};

const LABELS_EN: SearchLabels = {
  title: 'Search',
  placeholder: 'Search works, series, techniques\u2026',
  close: 'Close search',
  recent: 'Recent searches',
  clear_recent: 'Clear',
  results_for: 'Results for',
  empty: 'Start typing to search',
  no_results: 'No results',
};

// ───────────────────────── Recent storage ─────────────────────────

const STORAGE_KEY = 'creator-search-recent';
const RECENT_MAX = 8;

function readRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter(
      (v): v is string => typeof v === 'string' && v.trim().length > 0
    );
    // dedupe, preserve order (first wins)
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of clean) {
      const norm = s.trim();
      const key = norm.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(norm);
      }
    }
    return out.slice(0, RECENT_MAX);
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return [];
  }
}

function writeRecent(values: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    /* ignore — quota / private mode */
  }
}

// ───────────────────────── Mock result builder ─────────────────────────

function buildMockResults(query: string, locale: 'it' | 'en'): MockResult[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const slugSeed = encodeURIComponent(q.toLowerCase().slice(0, 32));
  const localePrefix = locale === 'it' ? '/it' : '/en';
  const labelIt = 'Opera su';
  const labelEn = 'Work on';
  const label = locale === 'it' ? labelIt : labelEn;
  return Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return {
      id: `mock-${n}`,
      title: `${label} "${q}" \u2014 ${n}`,
      image: `https://picsum.photos/seed/${slugSeed}-${n}/400/500`,
      href: `${localePrefix}/works/mock-${n}`,
    };
  });
}

// ───────────────────────── Component ─────────────────────────

export function SearchOverlay({ open, onClose, opener }: Props) {
  const titleId = useId();
  const listId = useId();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [labels, setLabels] = useState<SearchLabels>(LABELS_IT);
  const [locale, setLocale] = useState<'it' | 'en'>('it');
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  // Resolve locale + load recent on mount
  useEffect(() => {
    const loc = resolveOverlayLocale();
    setLocale(loc);
    setLabels(pickOverlayLabels(LABELS_IT, LABELS_EN, loc));
    setRecent(readRecent());
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

  // Body scroll lock
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus input on open; restore opener on close
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
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
      const focusables = getOverlayFocusable(overlayRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === first || !overlayRef.current?.contains(activeEl)) {
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

  const persistRecent = useCallback((q: string) => {
    const clean = q.trim();
    if (clean.length === 0) return;
    setRecent((prev) => {
      const key = clean.toLowerCase();
      const filtered = prev.filter((v) => v.toLowerCase() !== key);
      const next = [clean, ...filtered].slice(0, RECENT_MAX);
      writeRecent(next);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      persistRecent(query);
    },
    [persistRecent, query]
  );

  const handleRecentClick = useCallback(
    (value: string) => {
      setQuery(value);
      inputRef.current?.focus();
    },
    []
  );

  const handleClearRecent = useCallback(() => {
    setRecent([]);
    writeRecent([]);
  }, []);

  const results = useMemo(() => buildMockResults(query, locale), [query, locale]);
  const trimmedLen = query.trim().length;

  if (!mounted) return null;

  const transitionStyle = prefersReducedMotion
    ? 'opacity 160ms ease-out'
    : 'opacity 220ms ease-out, transform 220ms ease-out';

  const panelTransform = prefersReducedMotion
    ? 'none'
    : visible
      ? 'translateY(0)'
      : 'translateY(-12px)';

  const rootStyle = { position: 'fixed' as const, inset: 0, zIndex: 1000, pointerEvents: open ? ('auto' as const) : ('none' as const) };
  const backdropStyle = { background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', opacity: visible ? 1 : 0, transition: 'opacity 220ms ease-out' };
  const panelStyle = { transform: panelTransform, opacity: visible ? 1 : 0, transition: transitionStyle, willChange: 'transform, opacity' as const };
  const chipStyle = { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' };
  const mutedText = { color: 'rgba(255,255,255,0.6)' };

  return (
    <div aria-hidden={!open} style={rootStyle}>
      {/* Backdrop */}
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0" style={backdropStyle} />
      {/* Panel — full-screen overlay */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDownCapture}
        className="absolute inset-0 flex flex-col"
        style={panelStyle}
      >
        {/* Top bar: close + input */}
        <div className="flex items-center gap-3 px-4 sm:px-8 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus:ring-2 shrink-0"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.08)' }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <form onSubmit={handleSubmit} className="flex-1" role="search">
            <label htmlFor={titleId} className="sr-only">{labels.title}</label>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={mutedText}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                id={titleId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.placeholder}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-2xl text-base sm:text-lg focus:outline-none focus:ring-2"
                style={chipStyle}
                aria-controls={listId}
              />
            </div>
          </form>
        </div>

        {/* Body: scrollable results / recent */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6" aria-live="polite">
          {trimmedLen < 2 ? (
            <>
              {recent.length > 0 ? (
                <section className="mb-8">
                  <header className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] uppercase tracking-wider" style={mutedText}>{labels.recent}</h3>
                    <button type="button" onClick={handleClearRecent} className="text-xs underline focus:outline-none focus:ring-2 rounded px-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {labels.clear_recent}
                    </button>
                  </header>
                  <ul className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <li key={r}>
                        <button type="button" onClick={() => handleRecentClick(r)} className="text-sm px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2" style={chipStyle}>
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <div className="text-center py-10 text-sm" style={mutedText}>{labels.empty}</div>
            </>
          ) : (
            <section>
              <header className="mb-4">
                <h3 className="text-[11px] uppercase tracking-wider" style={mutedText}>{labels.results_for}</h3>
                {/* React renders as text — no XSS risk */}
                <p className="text-lg font-semibold break-words" style={{ color: '#fff' }}>{query.trim()}</p>
              </header>
              {results.length === 0 ? (
                <div className="text-center py-10 text-sm" style={mutedText}>{labels.no_results}</div>
              ) : (
                <ul id={listId} role="listbox" aria-label={labels.results_for} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((r) => (
                    <li key={r.id} role="option" aria-selected="false">
                      <a
                        href={r.href}
                        onClick={() => persistRecent(query)}
                        className="group block rounded-xl overflow-hidden transition-transform focus:outline-none focus:ring-2"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.image} alt={r.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        </div>
                        <div className="px-3 py-2 text-sm" style={{ color: '#fff' }}>{r.title}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
