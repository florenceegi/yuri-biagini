/**
 * @package CREATOR-STAGING — About Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Artist biography — thin server shell, data fetched client-side from authenticated creator
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { AboutAnimated } from '@/components/about/AboutAnimated';
import { AboutContent } from '@/components/about/AboutContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('about_title'),
    description: t('about_description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <AboutAnimated>
      <AboutContent
        titleLabel={t('title')}
        portraitAlt={t('portrait_alt')}
        bioPlaceholder={t('bio_placeholder')}
        timelineLabel={t('timeline')}
        ongoingLabel={t('ongoing')}
        cvDownloadLabel={t('cv_download')}
      />
    </AboutAnimated>
  );
}
