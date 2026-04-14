/**
 * @package CREATOR-STAGING — Home Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-13
 * @purpose Home page — variant-aware hero with featured works section
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getArtistArtworks } from '@/lib/egi/client';
import { getVariant } from '@/lib/variant';
import { getScene } from '@/lib/scene3d';
import Image from 'next/image';

import { HeroImmersive } from '@/components/heroes/HeroImmersive';
import { HeroCanvas } from '@/components/heroes/HeroCanvas';
import { HeroOscura } from '@/components/heroes/HeroOscura';
import { HeroScrollytelling } from '@/components/heroes/HeroScrollytelling';
import { HeroMagazine } from '@/components/heroes/HeroMagazine';
import { HeroBrutalist } from '@/components/heroes/HeroBrutalist';
import { HeroAnimated } from '@/components/heroes/HeroAnimated';
import { HeroWrapper } from '@/components/three/HeroWrapper';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'nav' });
  const tWorks = await getTranslations({ locale, namespace: 'works' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const variant = await getVariant();
  const sceneId = await getScene();
  const has3D = sceneId !== 'none';

  let featuredWorks: Awaited<ReturnType<typeof getArtistArtworks>>['data'] = [];
  try {
    const result = await getArtistArtworks(1, 6);
    featuredWorks = result.data;
  } catch {
    featuredWorks = [];
  }

  const artistName = 'Yuri Biagini';

  return (
    <>
      {/* Hero — radically different per variant, animated by preset */}
      {/* 3D scene as background layer on ANY template when active */}
      <HeroAnimated>
      <div className="relative">
        {has3D && (
          <div className="absolute inset-0 z-0">
            <HeroWrapper />
          </div>
        )}
        <div className={has3D ? 'relative z-10' : ''}>
          {variant === '01' && (
            <HeroOscura
              artistName={artistName}
              tagline={tHero('tagline')}
              featuredWork={has3D ? null : (featuredWorks[0] || null)}
            />
          )}
          {variant === '02' && (
            <HeroCanvas
              artistName={artistName}
              tagline={tHero('tagline')}
              scrollLabel={tWorks('view_on_egi')}
              featuredWork={featuredWorks[0] || null}
              locale={locale}
            />
          )}
          {variant === '03' && (
            <HeroImmersive artistName={artistName} subtitle={tHero('tagline')} />
          )}
          {variant === '04' && (
            <HeroScrollytelling artistName={artistName} birthYear="1990" />
          )}
          {variant === '05' && (
            <HeroMagazine
              artistName={artistName}
              artworks={featuredWorks}
              locale={locale}
              latestExhibitionLabel={t('exhibitions')}
            />
          )}
          {variant === '06' && (
            <HeroBrutalist
              artistName={artistName}
              featuredWork={featuredWorks[0] || null}
              locale={locale}
            />
          )}
        </div>
      </div>
      </HeroAnimated>

      {/* Featured works grid — varies by template */}
      {featuredWorks.length > 0 && variant !== '05' && variant !== '06' && (
        <section
          aria-labelledby="featured-heading"
          className="py-24 px-6 max-w-7xl mx-auto"
        >
          <h2
            id="featured-heading"
            className={`text-3xl md:text-5xl font-light text-center mb-16 ${
              variant === '04' ? 'font-[family-name:var(--font-serif)]' : 'font-[family-name:var(--font-serif)]'
            }`}
          >
            {t('works')}
          </h2>

          {/* 01 Oscura: tight grid, 2px gap, overlay on hover */}
          {variant === '01' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-0.5">
              {featuredWorks.map((artwork) => (
                <a key={artwork.id} href={`/${locale}/works/${artwork.id}`}
                   className="group relative aspect-square overflow-hidden">
                  {artwork.main_image_url ? (
                    <>
                      <Image src={artwork.main_image_url} alt={artwork.title || ''} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="33vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg tracking-widest text-white"
                              style={{ fontFamily: 'var(--font-serif)' }}>
                          {artwork.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#111]" />
                  )}
                </a>
              ))}
            </div>
          )}

          {/* 02 Canvas: cards with visible titles, shadow on hover */}
          {variant === '02' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {featuredWorks.map((artwork) => (
                <a key={artwork.id} href={`/${locale}/works/${artwork.id}`}
                   className="group block break-inside-avoid bg-[var(--bg-surface)] p-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                  {artwork.main_image_url ? (
                    <Image src={artwork.main_image_url} alt={artwork.title || ''} width={600} height={800}
                      className="w-full h-auto" loading="lazy" sizes="33vw" />
                  ) : (
                    <div className="aspect-[3/4] bg-[var(--bg-elevated)]" />
                  )}
                  <div className="p-3 pt-4">
                    <h3 className="text-base font-medium text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {artwork.title}
                    </h3>
                    {artwork.collection?.name && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                        {artwork.collection.name}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* 03 Immersive: standard masonry with glow border */}
          {variant === '03' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredWorks.map((artwork) => (
                <a key={artwork.id} href={`/${locale}/works/${artwork.id}`}
                   className="group block rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 bg-[var(--bg-surface)]">
                  {artwork.main_image_url ? (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image src={artwork.main_image_url} alt={artwork.title || ''} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="33vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-4">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm uppercase tracking-widest text-white">
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
                      <p className="text-sm text-[var(--text-muted)] mt-1">{artwork.collection.name}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* 04 Scrollytelling: vertical narrative list, alternating image/text */}
          {variant === '04' && (
            <div className="max-w-5xl mx-auto space-y-24">
              {featuredWorks.map((artwork, i) => (
                <a key={artwork.id} href={`/${locale}/works/${artwork.id}`}
                   className={`group flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
                  {artwork.main_image_url ? (
                    <div className="md:w-1/2 overflow-hidden">
                      <Image src={artwork.main_image_url} alt={artwork.title || ''} width={600} height={800}
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" sizes="50vw" />
                    </div>
                  ) : (
                    <div className="md:w-1/2 aspect-[3/4] bg-[var(--bg-elevated)]" />
                  )}
                  <div className="md:w-1/2 space-y-4">
                    <div className="w-12 h-px bg-[var(--accent)]" />
                    <h3 className="text-2xl md:text-3xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {artwork.title}
                    </h3>
                    {artwork.collection?.name && (
                      <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider">{artwork.collection.name}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <a href={`/${locale}/works`}
               className={`inline-block px-8 py-3 text-sm uppercase tracking-widest transition-all duration-300 ${
                 variant === '01'
                   ? 'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]'
                   : variant === '02'
                   ? 'bg-[var(--accent)] text-white hover:opacity-90 shadow-sm'
                   : variant === '04'
                   ? 'border-b-2 border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] pb-1'
                   : 'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] rounded'
               }`}
            >
              {t('works')}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
