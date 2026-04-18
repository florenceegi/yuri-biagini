/**
 * @package CREATOR-STAGING — Exhibitions Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Exhibitions narrative — featured + upcoming + institutional + past archive (SSG 7 locali)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ExhibitionsAnimated } from '@/components/exhibitions/ExhibitionsAnimated';
import { ExhibitionsContent } from '@/components/exhibitions/ExhibitionsContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('exhibitions_title'),
    description: t('exhibitions_description'),
  };
}

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'exhibitions' });

  const upcoming = [1, 2, 3, 4].map((i) => ({
    key: `upcoming_${i}`,
    date: t(`upcoming_${i}_date`),
    kind: t(`upcoming_${i}_kind`),
    title: t(`upcoming_${i}_title`),
    venue: t(`upcoming_${i}_venue`),
    city: t(`upcoming_${i}_city`),
    curator: t(`upcoming_${i}_curator`),
    description: t(`upcoming_${i}_description`),
  }));

  const institutional = [1, 2, 3].map((i) => ({
    key: `institutional_${i}`,
    year: t(`institutional_${i}_year`),
    kind: t(`institutional_${i}_kind`),
    name: t(`institutional_${i}_name`),
    city: t(`institutional_${i}_city`),
    description: t(`institutional_${i}_description`),
  }));

  const past = [1, 2, 3, 4].map((i) => ({
    key: `past_${i}`,
    year: t(`past_${i}_year`),
    kind: t(`past_${i}_kind`),
    title: t(`past_${i}_title`),
    venue: t(`past_${i}_venue`),
    city: t(`past_${i}_city`),
  }));

  return (
    <ExhibitionsAnimated>
      <ExhibitionsContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        featuredLabel={t('featured_label')}
        upcomingHeading={t('upcoming_heading')}
        upcoming={upcoming}
        rsvpLabel={t('rsvp')}
        detailsLabel={t('details')}
        mapLabel={t('map')}
        curatorLabel={t('curator_label')}
        institutionalHeading={t('institutional_heading')}
        institutionalSubheading={t('institutional_subheading')}
        institutional={institutional}
        pastHeading={t('past_heading')}
        past={past}
        noUpcomingTitle={t('no_upcoming_title')}
        noUpcomingBody={t('no_upcoming_body')}
        archiveCtaHeading={t('archive_cta_heading')}
        archiveCtaBody={t('archive_cta_body')}
        archiveCtaLabel={t('archive_cta_label')}
      />
    </ExhibitionsAnimated>
  );
}
