/**
 * @package CREATOR-STAGING — What You Get (Delivery) Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-19
 * @purpose Artist-facing delivery report — what you receive when commissioning a personal site from FlorenceEGI WebAgency
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DeliveryAnimated } from '@/components/delivery/DeliveryAnimated';
import { DeliveryContent } from '@/components/delivery/DeliveryContent';
import type { SectionId, FeatureId } from '@/lib/site-catalog';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'delivery' });
  return {
    title: `${t('title')} — FlorenceEGI WebAgency`,
    description: t('subtitle'),
  };
}

export default async function WhatYouGetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'delivery' });
  const tCat = await getTranslations({ locale, namespace: 'site_catalog' });

  const sectionIds: SectionId[] = ['collections', 'exhibitions', 'press', 'cv', 'story_behind', 'process', 'journal', 'live', 'commission'];
  const featureIds: FeatureId[] = ['newsletter', 'brand_driven', 'own_domain'];
  const sectionLabels = Object.fromEntries(
    sectionIds.map((id) => [id, { label: tCat(`section_${id}_label`), description: tCat(`section_${id}_description`) }]),
  ) as Record<SectionId, { label: string; description: string }>;
  const featureLabels = Object.fromEntries(
    featureIds.map((id) => [id, { label: tCat(`feature_${id}_label`), description: tCat(`feature_${id}_description`) }]),
  ) as Record<FeatureId, { label: string; description: string }>;

  const metrics = [
    { label: t('metric_perf_label'), value: t('metric_perf_value'), note: t('metric_perf_note') },
    { label: t('metric_a11y_label'), value: t('metric_a11y_value'), note: t('metric_a11y_note') },
    { label: t('metric_bp_label'), value: t('metric_bp_value'), note: t('metric_bp_note') },
    { label: t('metric_seo_label'), value: t('metric_seo_value'), note: t('metric_seo_note') },
  ];

  const deliverables = [1, 2, 3, 4, 5, 6].map((i) => ({
    title: t(`deliverable_${i}_title`),
    body: t(`deliverable_${i}_body`),
  }));

  const configuratorItems = [1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
    t(`configurator_item_${i}`)
  );

  const stack = [1, 2, 3, 4, 5, 6, 7].map((i) => ({
    layer: t(`stack_${i}_layer`),
    tech: t(`stack_${i}_tech`),
    rationale: t(`stack_${i}_rationale`),
  }));

  const features = [1, 2, 3, 4, 5].map((i) => ({
    heading: t(`feature_${i}_heading`),
    body: t(`feature_${i}_body`),
    source: t(`feature_${i}_source`),
  }));

  const competitors = [
    { label: t('competitor_us_label'), perf: '88–94', a11y: '100', seo: '92–100', schema: '6', highlight: true },
    { label: t('competitor_a_label'), perf: '42', a11y: '62', seo: '78', schema: '0' },
    { label: t('competitor_b_label'), perf: '38', a11y: '71', seo: '76', schema: '1' },
    { label: t('competitor_c_label'), perf: '55', a11y: '68', seo: '84', schema: '0' },
    { label: t('competitor_d_label'), perf: '48', a11y: '74', seo: '81', schema: '1' },
    { label: t('competitor_e_label'), perf: '61', a11y: '79', seo: '88', schema: '2' },
    { label: t('competitor_avg_label'), perf: '48', a11y: '71', seo: '81', schema: '0.8' },
  ];

  const bands = [1, 2, 3, 4, 5].map((i) => ({
    band: t(`band_${i}_band`),
    kind: t(`band_${i}_kind`),
    range: t(`band_${i}_range`),
  }));

  const tiers = [
    { label: 'CREATOR', setup: '€ 3.500', monthly: t('tier_monthly'), body: t('tier_creator_body'), highlight: false },
    { label: 'STUDIO', setup: '€ 6.500', monthly: t('tier_monthly'), body: t('tier_studio_body'), highlight: true },
    { label: 'MAESTRO', setup: '€ 12.000', monthly: t('tier_monthly'), body: t('tier_maestro_body'), highlight: false },
  ];

  const s6Bullets = [1, 2, 3, 4, 5, 6, 7].map((i) => t(`conclusion_bullet_${i}`));

  return (
    <DeliveryAnimated>
      <DeliveryContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        leadSummary={t('lead_summary')}
        metricsHeading={t('metrics_heading')}
        metrics={metrics}
        metricsSource={t('metrics_source')}
        s1Heading={t('s1_heading')}
        s1Body={t('s1_body')}
        deliverablesHeading={t('deliverables_heading')}
        deliverables={deliverables}
        configuratorHeading={t('configurator_heading')}
        configuratorBody={t('configurator_body')}
        configuratorItems={configuratorItems}
        s2Heading={t('s2_heading')}
        s2Body={t('s2_body')}
        stackHeadingLayer={t('stack_heading_layer')}
        stackHeadingTech={t('stack_heading_tech')}
        stackHeadingRationale={t('stack_heading_rationale')}
        stack={stack}
        headlessHeading={t('headless_heading')}
        headlessBody={t('headless_body')}
        s3Heading={t('s3_heading')}
        s3Body={t('s3_body')}
        features={features}
        s4Heading={t('s4_heading')}
        s4Body={t('s4_body')}
        competitorHeading={t('competitor_heading')}
        competitorHeadingPerf={t('competitor_heading_perf')}
        competitorHeadingA11y={t('competitor_heading_a11y')}
        competitorHeadingSeo={t('competitor_heading_seo')}
        competitorHeadingSchema={t('competitor_heading_schema')}
        competitors={competitors}
        competitorConclusion={t('competitor_conclusion')}
        s5Heading={t('s5_heading')}
        s5Body={t('s5_body')}
        bandsHeading={t('bands_heading')}
        bandsHeadingBand={t('bands_heading_band')}
        bandsHeadingKind={t('bands_heading_kind')}
        bandsHeadingRange={t('bands_heading_range')}
        bands={bands}
        tiersHeading={t('tiers_heading')}
        tiersIntro={t('tiers_intro')}
        tiers={tiers}
        tiersDisclaimer={t('tiers_disclaimer')}
        reductionHeading={t('reduction_heading')}
        reductionBody={t('reduction_body')}
        catalogHeading={tCat('catalog_heading')}
        catalogIntro={tCat('catalog_intro')}
        catalogSectionsHeading={tCat('sections_heading')}
        catalogFeaturesHeading={tCat('features_heading')}
        catalogColName={tCat('col_name')}
        catalogColSetup={tCat('col_setup')}
        catalogColMonthly={tCat('col_monthly')}
        sectionLabels={sectionLabels}
        featureLabels={featureLabels}
        s6Heading={t('s6_heading')}
        s6Bullets={s6Bullets}
        s6Closing={t('s6_closing')}
        ctaHeading={t('cta_heading')}
        ctaBody={t('cta_body')}
        ctaButton={t('cta_button')}
        ctaHref={`/${locale}/get-my-site`}
      />
    </DeliveryAnimated>
  );
}
