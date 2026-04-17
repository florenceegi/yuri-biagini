/**
 * @package CREATOR-STAGING — Theme Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Theme mode state + ambient slot auto-calc + localStorage persistence
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';

export type ThemeMode = 'dark' | 'light' | 'ambient' | 'auto';

export type AmbientSlot =
  | 'dawn'
  | 'morning'
  | 'day'
  | 'golden'
  | 'sunset'
  | 'evening'
  | 'night';

export interface ThemeContextValue {
  mode: ThemeMode;
  ambientSlot: AmbientSlot;
  resolvedTheme: string;
  setMode: (m: ThemeMode) => void;
  isAmbientActive: boolean;
}

const STORAGE_KEY = 'creator-theme-mode';
const AMBIENT_RECALC_MS = 5 * 60 * 1000; // 5 minuti
const DEFAULT_MODE: ThemeMode = 'dark';
const VALID_MODES: readonly ThemeMode[] = ['dark', 'light', 'ambient', 'auto'];

/**
 * Calcola ambient slot corrente da ora di sistema.
 * Mapping (hours, 0-23):
 *   5-6   → dawn
 *   7-10  → morning
 *   11-15 → day
 *   16-17 → golden
 *   18-19 → sunset
 *   20-22 → evening
 *   23 / 0-4 → night
 */
export function getAmbientSlot(date: Date = new Date()): AmbientSlot {
  const h = date.getHours();
  if (h >= 5 && h < 7) return 'dawn';
  if (h >= 7 && h < 11) return 'morning';
  if (h >= 11 && h < 16) return 'day';
  if (h >= 16 && h < 18) return 'golden';
  if (h >= 18 && h < 20) return 'sunset';
  if (h >= 20 && h < 23) return 'evening';
  return 'night'; // 23, 0, 1, 2, 3, 4
}

/**
 * Risolve il data-theme effettivo a partire dal mode e dallo slot ambient.
 */
function computeResolvedTheme(mode: ThemeMode, slot: AmbientSlot): string {
  switch (mode) {
    case 'ambient':
      return `ambient-${slot}`;
    case 'light':
      return 'light';
    case 'auto':
      return 'auto';
    case 'dark':
    default:
      return 'dark';
  }
}

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && (VALID_MODES as readonly string[]).includes(raw)) {
      return raw as ThemeMode;
    }
  } catch {
    // localStorage disabilitato / quota / SecurityError → fallback silenzioso
  }
  return DEFAULT_MODE;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // Lazy init SSR-safe: server-side restituisce DEFAULT_MODE, client legge storage
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [ambientSlot, setAmbientSlot] = useState<AmbientSlot>(() => getAmbientSlot());

  // Hydration: riallinea mode dopo mount (caso SSR → client mismatch)
  useEffect(() => {
    const stored = readStoredMode();
    if (stored !== mode) {
      setModeState(stored);
    }
    // intenzionalmente senza deps aggiuntive: solo su mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-calc ambient slot ogni 5 minuti, SOLO se mode === 'ambient'
  useEffect(() => {
    if (mode !== 'ambient') return;

    // aggiorna subito per garantire slot fresco al cambio modalità
    setAmbientSlot(getAmbientSlot());

    const intervalId = window.setInterval(() => {
      setAmbientSlot(getAmbientSlot());
    }, AMBIENT_RECALC_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [mode]);

  const resolvedTheme = useMemo(
    () => computeResolvedTheme(mode, ambientSlot),
    [mode, ambientSlot]
  );

  // Applica data-theme al <html> e persiste mode
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignora errori storage (quota, private mode, SecurityError)
    }
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    if (!(VALID_MODES as readonly string[]).includes(m)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[ThemeContext] Invalid mode "${m}" ignored.`);
      }
      return;
    }
    setModeState(m);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      ambientSlot,
      resolvedTheme,
      setMode,
      isAmbientActive: mode === 'ambient',
    }),
    [mode, ambientSlot, resolvedTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return ctx;
}
