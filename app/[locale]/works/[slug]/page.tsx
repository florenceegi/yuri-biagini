/**
 * @package CREATOR-STAGING — Work Detail Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Single artwork page — thin server shell, data from authenticated creator (client-side)
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { WorkDetail } from '@/components/gallery/WorkDetail';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artworkId = parseInt(slug, 10);
  if (isNaN(artworkId)) return { title: 'Not Found' };
  return {
    title: `Artwork #${artworkId}`,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const artworkId = parseInt(slug, 10);
  const t = await getTranslations({ locale, namespace: 'works' });

  if (isNaN(artworkId)) {
    return (
      <div className="py-24 px-6 text-center">
        <p className="text-[var(--text-muted)]">Not Found</p>
      </div>
    );
  }

  return (
    <WorkDetail
      artworkId={artworkId}
      locale={locale}
      viewOnEgiLabel={t('view_on_egi')}
      backLabel={t('title')}
    />
  );
}
