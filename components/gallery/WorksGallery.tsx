/**
 * @package CREATOR-STAGING — WorksGallery
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Masonry gallery grid with lazy loading, hover effects, links to EGI
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { EgiArtwork } from '@/lib/egi/client';

type Props = {
  artworks: EgiArtwork[];
  locale: string;
  labels: {
    all: string;
    view_on_egi: string;
    no_results: string;
    no_image: string;
  };
};

export function WorksGallery({ artworks, locale, labels }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  const collections = Array.from(
    new Set(
      artworks
        .map((a) => a.collection?.name)
        .filter((n): n is string => Boolean(n))
    )
  );

  const filtered = filter
    ? artworks.filter((a) => a.collection?.name === filter)
    : artworks;

  return (
    <div>
      {/* Filter bar */}
      {collections.length > 1 && (
        <nav
          aria-label="Filter works by collection"
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 text-sm uppercase tracking-wider rounded border transition-colors ${
              !filter
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
            }`}
          >
            {labels.all}
          </button>
          {collections.map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`px-4 py-2 text-sm uppercase tracking-wider rounded border transition-colors ${
                filter === name
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              }`}
            >
              {name}
            </button>
          ))}
        </nav>
      )}

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-20">
          {labels.no_results}
        </p>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((artwork) => (
            <a
              key={artwork.id}
              href={`/${locale}/works/${artwork.id}`}
              className="group block break-inside-avoid rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 bg-[var(--bg-surface)]"
            >
              {artwork.main_image_url ? (
                <div className="relative overflow-hidden">
                  <Image
                    src={artwork.main_image_url}
                    alt={artwork.title || 'Artwork'}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm uppercase tracking-widest text-white">
                      {labels.view_on_egi}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] bg-[var(--bg-elevated)] flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">{labels.no_image}</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {artwork.title}
                </h3>
                {artwork.collection?.name && (
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {artwork.collection.name}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
