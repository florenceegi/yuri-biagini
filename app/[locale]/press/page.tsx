/**
 * @package CREATOR-STAGING — Press Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Press narrative — featured review + reviews + interviews + catalogues + kit (SSG 7 locali)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PressAnimated } from '@/components/press/PressAnimated';
import { PressContent } from '@/components/press/PressContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('press_title'),
    description: t('press_description'),
  };
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'press' });

  const reviews = [1, 2, 3, 4].map((i) => ({
    key: `review_${i}`,
    outlet: t(`review_${i}_outlet`),
    date: t(`review_${i}_date`),
    title: t(`review_${i}_title`),
    excerpt: t(`review_${i}_excerpt`),
    author: t(`review_${i}_author`),
  }));

  const interviews = [1, 2, 3, 4].map((i) => ({
    key: `interview_${i}`,
    outlet: t(`interview_${i}_outlet`),
    date: t(`interview_${i}_date`),
    title: t(`interview_${i}_title`),
    format: t(`interview_${i}_format`),
    excerpt: t(`interview_${i}_excerpt`),
  }));

  const catalogues = [1, 2, 3].map((i) => ({
    key: `catalogue_${i}`,
    year: t(`catalogue_${i}_year`),
    title: t(`catalogue_${i}_title`),
    publisher: t(`catalogue_${i}_publisher`),
    essay: t(`catalogue_${i}_essay`),
  }));

  const kitAssets = [1, 2, 3, 4, 5].map((i) => ({
    key: `kit_${i}`,
    label: t(`kit_${i}_label`),
    format: t(`kit_${i}_format`),
    size: t(`kit_${i}_size`),
  }));

  return (
    <PressAnimated>
      <PressContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        featuredLabel={t('featured_label')}
        featuredOutlet={t('featured_outlet')}
        featuredDate={t('featured_date')}
        featuredTitle={t('featured_title')}
        featuredExcerpt={t('featured_excerpt')}
        featuredAuthor={t('featured_author')}
        readOnlineLabel={t('read_online')}
        downloadPdfLabel={t('download_pdf')}
        reviewsHeading={t('reviews_heading')}
        reviewsSubheading={t('reviews_subheading')}
        reviews={reviews}
        interviewsHeading={t('interviews_heading')}
        interviewsSubheading={t('interviews_subheading')}
        interviews={interviews}
        cataloguesHeading={t('catalogues_heading')}
        cataloguesSubheading={t('catalogues_subheading')}
        catalogues={catalogues}
        essayByLabel={t('essay_by')}
        kitHeading={t('kit_heading')}
        kitBody={t('kit_body')}
        kitAssets={kitAssets}
        kitCta={t('kit_cta')}
        contactCta={t('contact_cta')}
        contactCtaBody={t('contact_cta_body')}
      />
    </PressAnimated>
  );
}
