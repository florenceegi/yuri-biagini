/**
 * @package CREATOR-STAGING — Accessibility Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose A11y settings — font-size / contrast / reduced-motion / dyslexia-font with localStorage persistence (creator-a11y-*)
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

export type A11yFontSize = 'normal' | 'large' | 'xlarge';
export type A11yContrast = 'normal' | 'high';
export type A11yReducedMotion = 'system' | 'on' | 'off';
export type A11yDyslexiaFont = 'off' | 'on';

export interface A11ySettings {
  fontSize: A11yFontSize;
  contrast: A11yContrast;
  reducedMotion: A11yReducedMotion;
  dyslexiaFont: A11yDyslexiaFont;
}

export interface A11yContextValue extends A11ySettings {
  setFontSize: (v: A11yFontSize) => void;
  setContrast: (v: A11yContrast) => void;
  setReducedMotion: (v: A11yReducedMotion) => void;
  setDyslexiaFont: (v: A11yDyslexiaFont) => void;
  reset: () => void;
}

const STORAGE_KEYS = {
  fontSize: 'creator-a11y-font-size',
  contrast: 'creator-a11y-contrast',
  reducedMotion: 'creator-a11y-reduced-motion',
  dyslexiaFont: 'creator-a11y-dyslexia-font',
} as const;

const DEFAULTS: A11ySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  reducedMotion: 'system',
  dyslexiaFont: 'off',
};

const VALID = {
  fontSize: ['normal', 'large', 'xlarge'] as const,
  contrast: ['normal', 'high'] as const,
  reducedMotion: ['system', 'on', 'off'] as const,
  dyslexiaFont: ['off', 'on'] as const,
};

function readStored<K extends keyof A11ySettings>(key: K): A11ySettings[K] {
  if (typeof window === 'undefined') return DEFAULTS[key];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS[key]);
    const allowed = VALID[key] as readonly string[];
    if (raw && allowed.includes(raw)) {
      return raw as A11ySettings[K];
    }
  } catch {
    // localStorage disabled / quota / SecurityError → fallback silenzioso
  }
  return DEFAULTS[key];
}

function persist<K extends keyof A11ySettings>(key: K, value: A11ySettings[K]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {
    // ignore storage errors
  }
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }): JSX.Element {
  const [fontSize, setFontSizeState] = useState<A11yFontSize>(() => readStored('fontSize'));
  const [contrast, setContrastState] = useState<A11yContrast>(() => readStored('contrast'));
  const [reducedMotion, setReducedMotionState] = useState<A11yReducedMotion>(() => readStored('reducedMotion'));
  const [dyslexiaFont, setDyslexiaFontState] = useState<A11yDyslexiaFont>(() => readStored('dyslexiaFont'));

  useEffect(() => {
    setFontSizeState(readStored('fontSize'));
    setContrastState(readStored('contrast'));
    setReducedMotionState(readStored('reducedMotion'));
    setDyslexiaFontState(readStored('dyslexiaFont'));
    // single mount hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.a11yFontSize = fontSize;
    root.dataset.a11yContrast = contrast;
    root.dataset.a11yReducedMotion = reducedMotion;
    root.dataset.a11yDyslexiaFont = dyslexiaFont;
  }, [fontSize, contrast, reducedMotion, dyslexiaFont]);

  const setFontSize = useCallback((v: A11yFontSize) => {
    if (!(VALID.fontSize as readonly string[]).includes(v)) return;
    setFontSizeState(v);
    persist('fontSize', v);
  }, []);

  const setContrast = useCallback((v: A11yContrast) => {
    if (!(VALID.contrast as readonly string[]).includes(v)) return;
    setContrastState(v);
    persist('contrast', v);
  }, []);

  const setReducedMotion = useCallback((v: A11yReducedMotion) => {
    if (!(VALID.reducedMotion as readonly string[]).includes(v)) return;
    setReducedMotionState(v);
    persist('reducedMotion', v);
  }, []);

  const setDyslexiaFont = useCallback((v: A11yDyslexiaFont) => {
    if (!(VALID.dyslexiaFont as readonly string[]).includes(v)) return;
    setDyslexiaFontState(v);
    persist('dyslexiaFont', v);
  }, []);

  const reset = useCallback(() => {
    setFontSizeState(DEFAULTS.fontSize);
    setContrastState(DEFAULTS.contrast);
    setReducedMotionState(DEFAULTS.reducedMotion);
    setDyslexiaFontState(DEFAULTS.dyslexiaFont);
    persist('fontSize', DEFAULTS.fontSize);
    persist('contrast', DEFAULTS.contrast);
    persist('reducedMotion', DEFAULTS.reducedMotion);
    persist('dyslexiaFont', DEFAULTS.dyslexiaFont);
  }, []);

  const value = useMemo<A11yContextValue>(
    () => ({
      fontSize,
      contrast,
      reducedMotion,
      dyslexiaFont,
      setFontSize,
      setContrast,
      setReducedMotion,
      setDyslexiaFont,
      reset,
    }),
    [fontSize, contrast, reducedMotion, dyslexiaFont, setFontSize, setContrast, setReducedMotion, setDyslexiaFont, reset]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (ctx === null) {
    throw new Error('useA11y must be used within an <A11yProvider>.');
  }
  return ctx;
}
