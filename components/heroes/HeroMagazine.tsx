/**
 * @package YURI-BIAGINI — HeroMagazine (Template 05)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Bento grid fullscreen hero — template 05 Magazine Art
 */

import Image from 'next/image';
import type { EgiArtwork } from '@/lib/egi/client';

type Props = {
  artistName: string;
  artworks: EgiArtwork[];
  locale: string;
  latestExhibitionLabel: string;
};

export function HeroMagazine({ artistName, artworks, locale, latestExhibitionLabel }: Props) {
  const featured = artworks[0];
  const recent = artworks.slice(1, 5);

  return (
    <section aria-label="Hero" className="min-h-screen w-full p-3 md:p-4">
      <div className="h-[calc(100vh-2rem)] grid grid-cols-4 grid-rows-3 gap-3 md:gap-4">
        {/* Large cell — featured artwork (60% width, full height top 2 rows) */}
        <div className="col-span-4 md:col-span-3 row-span-2 relative overflow-hidden group">
          {featured?.main_image_url ? (
            <a href={`/${locale}/works/${featured.id}`} className="block h-full">
              <Image
                src={featured.main_image_url}
                alt={featured.title || 'Featured'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="75vw"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold"
                      style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}>
                  {featured.collection?.name || latestExhibitionLabel}
                </span>
                <h2 className="text-2xl md:text-3xl text-white mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
                  {featured.title}
                </h2>
              </div>
            </a>
          ) : (
            <div className="h-full bg-[var(--bg-surface)]" />
          )}
        </div>

        {/* Artist name cell */}
        <div className="hidden md:flex col-span-1 row-span-1 bg-[var(--bg-surface)] items-center justify-center p-4">
          <h1 className="text-3xl lg:text-4xl font-extralight leading-tight text-center text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}>
            {artistName}
          </h1>
        </div>

        {/* Recent works vertical list */}
        <div className="hidden md:flex col-span-1 row-span-1 bg-[var(--bg-elevated)] flex-col justify-center p-4 gap-2">
          {recent.map((w) => (
            <a key={w.id} href={`/${locale}/works/${w.id}`}
               className="text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors truncate">
              {w.title}
            </a>
          ))}
        </div>

        {/* Bottom row — 3 small cells on mobile: just artist name */}
        <div className="col-span-4 md:col-span-2 row-span-1 bg-[var(--bg-surface)] flex items-center px-6">
          <h1 className="md:hidden text-3xl font-extralight text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}>
            {artistName}
          </h1>
          <div className="hidden md:flex gap-4">
            {recent.slice(0, 2).map((w) => (
              <a key={w.id} href={`/${locale}/works/${w.id}`} className="group relative flex-1 aspect-square overflow-hidden">
                {w.main_image_url && (
                  <Image src={w.main_image_url} alt={w.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex col-span-2 row-span-1 bg-[var(--accent)] items-center justify-center px-6">
          <a href={`/${locale}/works`} className="text-sm uppercase tracking-[0.3em] text-white font-bold hover:opacity-80 transition-opacity">
            View All Works →
          </a>
        </div>
      </div>
    </section>
  );
}
