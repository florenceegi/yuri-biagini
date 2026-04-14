/**
 * @package CREATOR-STAGING — Collections Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-12
 * @purpose Each collection is a world — landing pages per series with hero image and description
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getArtistArtworks } from '@/lib/egi/client';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { EgiArtwork } from '@/lib/egi/client';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collections' });
  return {
    title: `${t('title')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
    description: `${t('explore')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
  };
}

export const revalidate = 60;

type CollectionGroup = {
  name: string;
  artworks: EgiArtwork[];
  heroImage: string | null;
};

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'collections' });

  let allArtworks: EgiArtwork[] = [];
  try {
    const result = await getArtistArtworks(1, 200);
    allArtworks = result.data;
  } catch {
    allArtworks = [];
  }

  // Group artworks by collection
  const collectionsMap = new Map<string, CollectionGroup>();
  for (const artwork of allArtworks) {
    const name = artwork.collection?.name || 'Uncategorized';
    if (!collectionsMap.has(name)) {
      collectionsMap.set(name, {
        name,
        artworks: [],
        heroImage: artwork.main_image_url,
      });
    }
    collectionsMap.get(name)!.artworks.push(artwork);
  }

  const collections = Array.from(collectionsMap.values()).filter(
    (c) => c.name !== 'Uncategorized'
  );

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-6">
        {t('title')}
      </h1>

      {collections.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-20">
          {t('no_collections')}
        </p>
      ) : (
        <div className="space-y-16 mt-16">
          {collections.map((collection) => (
            <a
              key={collection.name}
              href={`/${locale}/works?collection=${encodeURIComponent(collection.name)}`}
              className="group block relative rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-500"
            >
              {/* Hero image — first artwork of collection */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                {collection.heroImage ? (
                  <Image
                    src={collection.heroImage}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--bg-elevated)]" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Collection info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-white mb-3">
                  {collection.name}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm uppercase tracking-widest">
                    {collection.artworks.length} {t('works_count')}
                  </span>
                  <span className="text-[var(--accent)] text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('explore')} →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
