/**
 * @package CREATOR-STAGING — Collections Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Collections landing — thin server shell, data fetched client-side for authenticated creator
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CollectionsContent } from '@/components/gallery/CollectionsContent';
import { assertSectionActive } from '@/lib/active-sections';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collections' });
  return {
    title: `${t('title')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
    description: `${t('explore')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
  };
}

export default async function CollectionsPage({ params }: Props) {
  assertSectionActive('collections');
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'collections' });

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-6">
        {t('title')}
      </h1>

      <CollectionsContent
        locale={locale}
        labels={{
          uncategorized: t('uncategorized'),
          works_count: t('works_count'),
          explore: t('explore'),
          no_collections: t('no_collections'),
          placeholder_notice: t('placeholder_notice'),
        }}
      />
    </section>
  );
}
