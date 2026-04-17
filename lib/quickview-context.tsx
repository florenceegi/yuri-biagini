/**
 * @package CREATOR-STAGING — Quick-view Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Quick-view artwork preview state — open/close from any component
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

export interface QuickViewArtwork {
  id: string;
  title: string;
  imageUrl: string;
  year?: string;
  technique?: string;
  dimensions?: string;
  description?: string;
  price?: string;
  availability?: 'available' | 'sold' | 'reserved';
  egiUrl?: string;
}

export interface QuickViewContextValue {
  current: QuickViewArtwork | null;
  isOpen: boolean;
  open: (artwork: QuickViewArtwork) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }): JSX.Element {
  const [current, setCurrent] = useState<QuickViewArtwork | null>(null);
  const isOpen = current !== null;

  const open = useCallback((artwork: QuickViewArtwork) => {
    if (!artwork || typeof artwork.id !== 'string' || artwork.id.length === 0) return;
    setCurrent(artwork);
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
  }, []);

  // Body scroll lock + Escape listener (SSR-safe)
  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setCurrent(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const value = useMemo<QuickViewContextValue>(
    () => ({
      current,
      isOpen,
      open,
      close,
    }),
    [current, isOpen, open, close]
  );

  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
}

export function useQuickView(): QuickViewContextValue {
  const ctx = useContext(QuickViewContext);
  if (ctx === null) {
    throw new Error('useQuickView must be used within a <QuickViewProvider>.');
  }
  return ctx;
}
