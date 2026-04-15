/**
 * @package CREATOR-STAGING — WorkDetail
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Client component for single artwork page — fetches from authenticated creator
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCreator } from '@/lib/creator-context';
import { getArtistArtworks, type EgiArtwork } from '@/lib/egi/client';

type Props = {
  artworkId: number;
  locale: string;
  viewOnEgiLabel: string;
  backLabel: string;
};

export function WorkDetail({ artworkId, locale, viewOnEgiLabel, backLabel }: Props) {
  const { artistId, isLoading: authLoading } = useCreator();
  const [artwork, setArtwork] = useState<EgiArtwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (!artistId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      try {
        const result = await getArtistArtworks(1, 200, undefined, artistId);
        const found = result.data.find((a) => a.id === artworkId);
        if (found) {
          setArtwork(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [artistId, artworkId, authLoading]);

  if (authLoading || isLoading) {
    return (
      <article className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg" />
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-10 bg-[var(--bg-surface)] rounded w-2/3" />
            <div className="h-4 bg-[var(--bg-surface)] rounded w-1/3" />
            <div className="h-4 bg-[var(--bg-surface)] rounded w-full mt-8" />
            <div className="h-4 bg-[var(--bg-surface)] rounded w-5/6" />
          </div>
        </div>
      </article>
    );
  }

  if (notFound || !artwork) {
    return (
      <article className="py-24 px-6 max-w-6xl mx-auto text-center">
        <p className="text-[var(--text-muted)] text-lg">Artwork not found</p>
        <a
          href={`/${locale}/works`}
          className="inline-block mt-8 px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] text-sm uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded"
        >
          &larr; {backLabel}
        </a>
      </article>
    );
  }

  const imageUrl = artwork.original_image_url || artwork.large_image_url || artwork.main_image_url;

  return (
    <article className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <figure className="relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={artwork.title || 'Artwork'}
              width={1200}
              height={1600}
              className="w-full h-auto rounded-lg"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          ) : (
            <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--text-muted)]">No Image</span>
            </div>
          )}
        </figure>

        <div className="flex flex-col justify-center">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-4">
            {artwork.title}
          </h1>

          {artwork.collection?.name && (
            <p className="text-sm uppercase tracking-widest text-[var(--accent)] mb-6">
              {artwork.collection.name}
            </p>
          )}

          {artwork.year && (
            <p className="text-[var(--text-secondary)] mb-2">{artwork.year}</p>
          )}

          {artwork.description && (
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-prose">
              {artwork.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a
              href={artwork.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors rounded"
            >
              {viewOnEgiLabel}
            </a>
            <a
              href={`/${locale}/works`}
              className="inline-flex items-center justify-center px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] text-sm uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded"
            >
              &larr; {backLabel}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
