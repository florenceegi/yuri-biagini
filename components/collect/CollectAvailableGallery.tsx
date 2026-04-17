/**
 * @package CREATOR-STAGING — CollectAvailableGallery
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Available-now gallery with QuickFilters (availability/price/technique) + QuickView + wishlist.
 */

'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { useCreator } from '@/lib/creator-context';
import { getArtistArtworks, type EgiArtwork } from '@/lib/egi/client';
import { useWishlist } from '@/lib/wishlist-context';
import type { QuickViewArtwork } from '@/lib/quickview-context';

export type AvailabilityFilter = 'all' | 'available' | 'reserved' | 'sold';
export type PriceFilter = 'all' | 'under_1k' | '1k_5k' | '5k_10k' | 'over_10k';

export interface GalleryLabels {
  title: string;
  subtitle: string;
  filter_all: string;
  filter_available: string;
  filter_reserved: string;
  filter_sold: string;
  filter_availability_group: string;
  filter_price: string;
  filter_technique: string;
  filter_under_1k: string;
  filter_1k_5k: string;
  filter_5k_10k: string;
  filter_over_10k: string;
  filter_reset: string;
  no_results: string;
  quickview_cta: string;
  price_on_request: string;
  wishlist_add: string;
  wishlist_remove: string;
  badge_available: string;
  badge_reserved: string;
  badge_sold: string;
}

interface Props {
  locale: string;
  labels: GalleryLabels;
}

type AugmentedArtwork = EgiArtwork & {
  _price?: number;
  _technique: string;
  _availability: 'available' | 'reserved' | 'sold';
};

const TECHNIQUES = [
  'Olio su tela',
  'Acrilico',
  'Tecnica mista',
  'Digitale',
  'Scultura',
  'Fotografia',
];

const PRICE_BUCKETS = [450, 800, 1200, 2400, 3800, 5600, 7500, 9200, 12000, 15000];

function hashId(id: number): number {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function augment(a: EgiArtwork): AugmentedArtwork {
  const h = hashId(a.id);
  const technique = TECHNIQUES[h % TECHNIQUES.length];
  const priceRoll = h % 10;
  // ~15% "price on request", ~15% reserved/sold distribution
  const _price = priceRoll === 0 ? undefined : PRICE_BUCKETS[priceRoll];
  const availRoll = (h >>> 3) % 10;
  const _availability: AugmentedArtwork['_availability'] =
    availRoll < 7 ? 'available' : availRoll < 9 ? 'reserved' : 'sold';
  return { ...a, _price, _technique: technique, _availability };
}

function makePlaceholders(count: number): EgiArtwork[] {
  const titles = [
    'Luce del mattino',
    'Silenzio urbano',
    'Ritratto di memoria',
    'Volo interiore',
    'Confini porosi',
    'Geometria sospesa',
    'Radici e cielo',
    'Danza immobile',
    'Frammento d’estate',
    'Quiete profonda',
    'Orizzonte aperto',
    'Soglia di vetro',
  ];
  return Array.from({ length: count }, (_, i) => {
    const id = 10_000 + i;
    return {
      id,
      title: titles[i % titles.length],
      description: null,
      year: 2020 + (i % 6),
      main_image_url: `https://picsum.photos/seed/collect-${i + 1}/800/1000`,
      medium_image_url: null,
      large_image_url: null,
      thumbnail_image_url: null,
      original_image_url: null,
      blurhash: null,
      is_published: true,
      collection: null,
      creator: null,
      url: '#',
    };
  });
}

function formatPrice(locale: string, price?: number, fallback = ''): string {
  if (typeof price !== 'number') return fallback;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `€${price}`;
  }
}

function toQuickView(a: AugmentedArtwork, priceLabel: string): QuickViewArtwork {
  return {
    id: String(a.id),
    title: a.title,
    imageUrl: a.main_image_url || `https://picsum.photos/seed/qv-${a.id}/800/1000`,
    year: a.year ? String(a.year) : undefined,
    technique: a._technique,
    description: a.description ?? undefined,
    price: priceLabel || undefined,
    availability: a._availability,
    egiUrl: a.url && a.url !== '#' ? a.url : undefined,
  };
}

export function CollectAvailableGallery({ locale, labels }: Props) {
  const { artistId, isLoading: authLoading } = useCreator();
  const { isInWishlist, toggle } = useWishlist();

  const [items, setItems] = useState<AugmentedArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<AvailabilityFilter>('available');
  const [price, setPrice] = useState<PriceFilter>('all');
  const [technique, setTechnique] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (artistId) {
          const result = await getArtistArtworks(1, 12, undefined, artistId);
          if (cancelled) return;
          const list = result.data.length > 0 ? result.data : makePlaceholders(12);
          setItems(list.map(augment));
        } else {
          if (cancelled) return;
          setItems(makePlaceholders(12).map(augment));
        }
      } catch {
        if (cancelled) return;
        setItems(makePlaceholders(12).map(augment));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [artistId, authLoading]);

  const techniques = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i._technique));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((a) => {
      if (availability !== 'all' && a._availability !== availability) return false;
      if (technique !== 'all' && a._technique !== technique) return false;
      if (price !== 'all') {
        const p = a._price;
        if (typeof p !== 'number') return false;
        if (price === 'under_1k' && p >= 1000) return false;
        if (price === '1k_5k' && (p < 1000 || p >= 5000)) return false;
        if (price === '5k_10k' && (p < 5000 || p >= 10000)) return false;
        if (price === 'over_10k' && p < 10000) return false;
      }
      return true;
    });
  }, [items, availability, price, technique]);

  const reset = useCallback(() => {
    setAvailability('all');
    setPrice('all');
    setTechnique('all');
  }, []);

  const openQuickView = useCallback(
    (a: AugmentedArtwork) => {
      if (typeof window === 'undefined') return;
      const priceLabel = formatPrice(locale, a._price, labels.price_on_request);
      const detail = toQuickView(a, priceLabel);
      window.dispatchEvent(new CustomEvent('creator:quickview:open', { detail: { artwork: detail } }));
    },
    [locale, labels.price_on_request]
  );

  const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
    { value: 'all', label: labels.filter_all },
    { value: 'available', label: labels.filter_available },
    { value: 'reserved', label: labels.filter_reserved },
    { value: 'sold', label: labels.filter_sold },
  ];

  const priceOptions: { value: PriceFilter; label: string }[] = [
    { value: 'all', label: labels.filter_all },
    { value: 'under_1k', label: labels.filter_under_1k },
    { value: '1k_5k', label: labels.filter_1k_5k },
    { value: '5k_10k', label: labels.filter_5k_10k },
    { value: 'over_10k', label: labels.filter_over_10k },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" aria-labelledby="collect-available-title">
      <header className="text-center mb-12 space-y-3">
        <h2
          id="collect-available-title"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light"
        >
          {labels.title}
        </h2>
        <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto">
          {labels.subtitle}
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-4 mb-10">
        <div role="radiogroup" aria-label={labels.filter_availability_group} className="flex flex-wrap gap-2 justify-center">
          {availabilityOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={availability === o.value}
              onClick={() => setAvailability(o.value)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                availability === o.value
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div role="radiogroup" aria-label={labels.filter_price} className="flex flex-wrap gap-2 justify-center">
          <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] self-center mr-1">
            {labels.filter_price}
          </span>
          {priceOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={price === o.value}
              onClick={() => setPrice(o.value)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                price === o.value
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {techniques.length > 0 && (
          <div role="radiogroup" aria-label={labels.filter_technique} className="flex flex-wrap gap-2 justify-center">
            <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] self-center mr-1">
              {labels.filter_technique}
            </span>
            <button
              type="button"
              role="radio"
              aria-checked={technique === 'all'}
              onClick={() => setTechnique('all')}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                technique === 'all'
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {labels.filter_all}
            </button>
            {techniques.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={technique === t}
                onClick={() => setTechnique(t)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  technique === t
                    ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid / states */}
      {loading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <p className="text-[var(--text-secondary)] text-lg">{labels.no_results}</p>
          <button
            type="button"
            onClick={reset}
            className="inline-block px-6 py-3 border border-[var(--accent)] text-[var(--accent)] rounded text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {labels.filter_reset}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none">
          {filtered.map((a) => {
            const img =
              a.main_image_url || `https://picsum.photos/seed/collect-${a.id}/800/1000`;
            const priceLabel = formatPrice(locale, a._price, labels.price_on_request);
            const inWish = isInWishlist(String(a.id));
            const badgeText =
              a._availability === 'available'
                ? labels.badge_available
                : a._availability === 'reserved'
                  ? labels.badge_reserved
                  : labels.badge_sold;
            const badgeColor =
              a._availability === 'available'
                ? 'bg-[var(--accent)] text-[var(--bg)]'
                : a._availability === 'reserved'
                  ? 'bg-[var(--bg)]/70 text-[var(--text-primary)] border border-[var(--border)]'
                  : 'bg-[var(--bg)]/70 text-[var(--text-tertiary)] border border-[var(--border)]';

            return (
              <li
                key={a.id}
                className="group relative flex flex-col bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                  <button
                    type="button"
                    aria-label={inWish ? labels.wishlist_remove : labels.wishlist_add}
                    onClick={() =>
                      toggle({ id: String(a.id), title: a.title, imageUrl: img })
                    }
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--bg)]/80 backdrop-blur flex items-center justify-center border border-[var(--border)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill={inWish ? 'var(--accent)' : 'none'}
                      stroke={inWish ? 'var(--accent)' : 'currentColor'}
                      strokeWidth="1.8"
                    >
                      <path d="M12 21s-7-4.35-9.5-9.03C1.13 9.12 2.5 6 5.5 6c1.74 0 3.41.81 4.5 2.09C11.09 6.81 12.76 6 14.5 6c3 0 4.37 3.12 3 5.97C19 16.65 12 21 12 21z" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2">
                  <h3 className="font-[family-name:var(--font-serif)] text-lg font-light text-[var(--text-primary)] line-clamp-1">
                    {a.title}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
                    {a._technique}
                    {a.year ? ` · ${a.year}` : ''}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-auto">
                    {priceLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => openQuickView(a)}
                    aria-label={`${labels.quickview_cta}: ${a.title}`}
                    className="mt-2 w-full px-3 py-2 rounded border border-[var(--border)] text-xs uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {labels.quickview_cta}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
