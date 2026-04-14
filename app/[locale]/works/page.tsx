/**
 * @package CREATOR-STAGING — Works Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Gallery page fetching artworks from EGI API with ISR
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getArtistArtworks } from '@/lib/egi/client';
import { WorksGallery } from '@/components/gallery/WorksGallery';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('works_title'),
    description: t('works_description'),
  };
}

export const revalidate = 60;

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'works' });

  let artworks: Awaited<ReturnType<typeof getArtistArtworks>>['data'] = [];
  try {
    const result = await getArtistArtworks(1, 100);
    artworks = result.data;
  } catch {
    artworks = [];
  }

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {t('title')}
      </h1>

      <WorksGallery
        artworks={artworks}
        locale={locale}
        labels={{
          all: t('all'),
          view_on_egi: t('view_on_egi'),
          no_results: t('no_results'),
          no_image: t('no_image'),
        }}
      />
    </section>
  );
}
