/**
 * @package CREATOR-STAGING — Wishlist Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Visitor wishlist state + localStorage persistence (no account required)
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface WishlistItem {
  id: string;
  title: string;
  imageUrl: string;
  addedAt: number;
}

export interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isInWishlist: (id: string) => boolean;
  add: (item: Omit<WishlistItem, 'addedAt'>) => void;
  remove: (id: string) => void;
  toggle: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clear: () => void;
}

const STORAGE_KEY = 'creator-wishlist';
const MAX_ITEMS = 50;

function isValidItem(raw: unknown): raw is WishlistItem {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    o.id.length > 0 &&
    typeof o.title === 'string' &&
    typeof o.imageUrl === 'string' &&
    typeof o.addedAt === 'number' &&
    Number.isFinite(o.addedAt)
  );
}

function readStoredItems(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isValidItem);
    // dedup by id (keep first)
    const seen = new Set<string>();
    const unique: WishlistItem[] = [];
    for (const it of valid) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        unique.push(it);
      }
    }
    return unique.slice(-MAX_ITEMS);
  } catch {
    // corrotto / quota / SecurityError → reset silenzioso
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return [];
  }
}

function writeStoredItems(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota / private mode / SecurityError → ignore
  }
}

function buildItem(item: Omit<WishlistItem, 'addedAt'>): WishlistItem {
  return {
    id: item.id,
    title: typeof item.title === 'string' ? item.title : '',
    imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
    addedAt: Date.now(),
  };
}

function appendWithEviction(prev: WishlistItem[], next: WishlistItem): WishlistItem[] {
  const merged = [...prev, next];
  // FIFO auto-eviction oltre MAX_ITEMS (rimuove i più vecchi in testa)
  return merged.length > MAX_ITEMS ? merged.slice(merged.length - MAX_ITEMS) : merged;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }): JSX.Element {
  // SSR-safe: server restituisce [], client legge storage
  const [items, setItems] = useState<WishlistItem[]>(() => readStoredItems());

  // Hydration: riallinea dopo mount (SSR → client)
  useEffect(() => {
    const stored = readStoredItems();
    setItems(stored);
    // solo al mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist ogni cambio
  useEffect(() => {
    writeStoredItems(items);
  }, [items]);

  const isInWishlist = useCallback(
    (id: string) => items.some((it) => it.id === id),
    [items]
  );

  const add = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    if (!item || typeof item.id !== 'string' || item.id.length === 0) return;
    setItems((prev) =>
      prev.some((it) => it.id === item.id) ? prev : appendWithEviction(prev, buildItem(item))
    );
  }, []);

  const remove = useCallback((id: string) => {
    if (typeof id !== 'string' || id.length === 0) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const toggle = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    if (!item || typeof item.id !== 'string' || item.id.length === 0) return;
    setItems((prev) =>
      prev.some((it) => it.id === item.id)
        ? prev.filter((it) => it.id !== item.id)
        : appendWithEviction(prev, buildItem(item))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isInWishlist,
      add,
      remove,
      toggle,
      clear,
    }),
    [items, isInWishlist, add, remove, toggle, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (ctx === null) {
    throw new Error('useWishlist must be used within a <WishlistProvider>.');
  }
  return ctx;
}
