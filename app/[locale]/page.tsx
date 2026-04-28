/**
 * @package CREATOR-STAGING — Home Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Home page — variant-aware hero + featured works from authenticated creator (client-side)
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getVariant } from '@/lib/variant';
import { getScene } from '@/lib/scene3d';

import { HeroAnimated } from '@/components/heroes/HeroAnimated';
import { HeroWrapper } from '@/components/three/HeroWrapper';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeFeaturedWorks } from '@/components/home/HomeContent';

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

  const fallbackName = process.env.NEXT_PUBLIC_SITE_NAME || 'Creator Staging';

  return (
    <>
      {/* Hero — variant-aware, reads creator name from auth context (client-side) */}
      <HeroAnimated>
      <div className="relative">
        {has3D && (
          <div className="absolute inset-0 z-0">
            <HeroWrapper />
          </div>
        )}
        <div className={has3D ? 'relative z-10' : ''}>
          <HomeHero
            variant={variant}
            fallbackName={fallbackName}
            tagline={tHero('tagline')}
            scrollLabel={tWorks('view_on_egi')}
            locale={locale}
            exhibitionsLabel={t('exhibitions')}
          />
        </div>
      </div>
      </HeroAnimated>

      {/* Featured works — client-side, uses authenticated creator ID */}
      <HomeFeaturedWorks
        variant={variant}
        locale={locale}
        worksLabel={t('works')}
        viewOnEgiLabel={tWorks('view_on_egi')}
      />
    </>
  );
}
