/**
 * @package CREATOR-STAGING — Collect Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Collector's emotional funnel — thin server shell, artworks from authenticated creator
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CollectContent } from '@/components/collect/CollectContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collect' });
  return {
    title: `${t('title')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
    description: t('hero_subtitle'),
  };
}

export default async function CollectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'collect' });

  return (
    <CollectContent
      locale={locale}
      heroTitle={t('title')}
      heroSubtitle={t('hero_subtitle')}
      steps={[
        { num: '01', title: t('step1_title'), desc: t('step1_description'), accent: 'var(--accent)' },
        { num: '02', title: t('step2_title'), desc: t('step2_description'), accent: '#e8956a' },
        { num: '03', title: t('step3_title'), desc: t('step3_description'), accent: '#6ae89b' },
        { num: '04', title: t('step4_title'), desc: t('step4_description'), accent: '#6a9be8' },
      ]}
      whyTitle={t('why_title')}
      whyItems={[
        { title: t('why_authenticity'), desc: t('why_authenticity_desc'), icon: '◆' },
        { title: t('why_provenance'), desc: t('why_provenance_desc'), icon: '◈' },
        { title: t('why_direct'), desc: t('why_direct_desc'), icon: '◇' },
      ]}
      blockchainBadge={t('blockchain_badge')}
      ctaBrowse={t('cta_browse')}
      ctaPlatform={t('cta_platform')}
    />
  );
}
