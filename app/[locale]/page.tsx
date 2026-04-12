/**
 * @package YURI-BIAGINI — Home Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Home page with Three.js hero, featured works section, CTA
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { HeroWrapper } from '@/components/three/HeroWrapper';
import { getArtistArtworks } from '@/lib/egi/client';
import Image from 'next/image';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'nav' });
  const tWorks = await getTranslations({ locale, namespace: 'works' });

  let featuredWorks: Awaited<ReturnType<typeof getArtistArtworks>>['data'] = [];
  try {
    const result = await getArtistArtworks(1, 6);
    featuredWorks = result.data;
  } catch {
    featuredWorks = [];
  }

  return (
    <>
      {/* Hero section — fullscreen Three.js */}
      <section
        aria-label="Hero"
        className="relative h-screen w-full overflow-hidden"
      >
        <HeroWrapper />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl lg:text-9xl font-light tracking-wide text-[var(--text-primary)] text-center">
            Yuri Biagini
          </h1>
          <p className="mt-4 text-sm md:text-base uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Artist
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Featured works — real artworks from EGI API */}
      {featuredWorks.length > 0 && (
        <section
          aria-labelledby="featured-heading"
          className="py-24 px-6 max-w-7xl mx-auto"
        >
          <h2
            id="featured-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-center mb-16"
          >
            {t('works')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorks.map((artwork) => (
              <a
                key={artwork.id}
                href={`/${locale}/works/${artwork.id}`}
                className="group block rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 bg-[var(--bg-surface)]"
              >
                {artwork.main_image_url ? (
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={artwork.main_image_url}
                      alt={artwork.title || 'Artwork'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-4">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm uppercase tracking-widest text-white">
                        {tWorks('view_on_egi')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-[var(--bg-elevated)]" />
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

          <div className="mt-16 text-center">
            <a
              href={`/${locale}/works`}
              className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
            >
              {t('works')}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
