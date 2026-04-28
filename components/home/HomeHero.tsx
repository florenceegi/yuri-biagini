/**
 * @package CREATOR-STAGING — HomeHero
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-28
 * @purpose Client wrapper for hero — reads authenticated creator name from context
 */

'use client';

import { useCreator } from '@/lib/creator-context';
import { HeroImmersive } from '@/components/heroes/HeroImmersive';
import { HeroCanvas } from '@/components/heroes/HeroCanvas';
import { HeroOscura } from '@/components/heroes/HeroOscura';
import { HeroScrollytelling } from '@/components/heroes/HeroScrollytelling';
import { HeroMagazine } from '@/components/heroes/HeroMagazine';
import { HeroBrutalist } from '@/components/heroes/HeroBrutalist';

type Props = {
  variant: string;
  fallbackName: string;
  tagline: string;
  scrollLabel: string;
  locale: string;
  exhibitionsLabel: string;
};

export function HomeHero({ variant, fallbackName, tagline, scrollLabel, locale, exhibitionsLabel }: Props) {
  const { artistName } = useCreator();
  const name = artistName || fallbackName;

  return (
    <>
      {variant === '01' && <HeroOscura artistName={name} tagline={tagline} />}
      {variant === '02' && <HeroCanvas artistName={name} tagline={tagline} scrollLabel={scrollLabel} locale={locale} />}
      {variant === '03' && <HeroImmersive artistName={name} subtitle={tagline} />}
      {variant === '04' && <HeroScrollytelling artistName={name} />}
      {variant === '05' && <HeroMagazine artistName={name} artworks={[]} locale={locale} latestExhibitionLabel={exhibitionsLabel} />}
      {variant === '06' && <HeroBrutalist artistName={name} locale={locale} />}
    </>
  );
}
