/**
 * @package YURI-BIAGINI — HeroBrutalist (Template 06)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Giant typography hero — name fills viewport — template 06 Brutalist Statement
 */

import Image from 'next/image';
import type { EgiArtwork } from '@/lib/egi/client';

type Props = {
  artistName: string;
  featuredWork: EgiArtwork | null;
  locale: string;
};

export function HeroBrutalist({ artistName, featuredWork, locale }: Props) {
  return (
    <>
      {/* Name fills viewport */}
      <section aria-label="Hero" className="h-screen w-full flex items-center justify-center overflow-hidden px-4">
        <h1
          className="text-[20vw] md:text-[25vw] uppercase leading-[0.85] font-black text-center text-[var(--text-primary)] select-none"
          style={{ fontFamily: 'var(--font-display, Anton, Impact, sans-serif)' }}
        >
          {artistName}
        </h1>
      </section>

      {/* First artwork — fullwidth, no padding, no decoration */}
      {featuredWork?.main_image_url && (
        <a href={`/${locale}/works/${featuredWork.id}`} className="block w-full">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={featuredWork.main_image_url}
              alt={featuredWork.title || ''}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </a>
      )}
    </>
  );
}
