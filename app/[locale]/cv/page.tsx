/**
 * @package CREATOR-STAGING — CV Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Formal curriculum vitae — thin server shell, data from authenticated creator
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CVContent } from '@/components/cv/CVContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cv' });
  return {
    title: `${t('title')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
    description: `${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'} — ${t('title')}`,
  };
}

export default async function CVPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'cv' });

  return (
    <CVContent
      titleLabel={t('title')}
      educationLabel={t('education')}
      awardsLabel={t('awards')}
      soloShowsLabel={t('solo_shows')}
      downloadLabel={t('download')}
    />
  );
}
