/**
 * @package CREATOR-STAGING — Commission Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Commission narrative — visitor-centric funnel (categories + process + investment + testimonials + FAQ + form)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CommissionAnimated } from '@/components/commission/CommissionAnimated';
import { CommissionContent } from '@/components/commission/CommissionContent';
import { CommissionForm } from '@/components/commission/CommissionForm';
import { assertSectionActive } from '@/lib/active-sections';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'commission' });
  return {
    title: `${t('title')} — ${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'}`,
    description: t('subtitle'),
  };
}

export default async function CommissionPage({ params }: Props) {
  assertSectionActive('commission');
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'commission' });
  const tGdpr = await getTranslations({ locale, namespace: 'gdpr' });

  const categories = [1, 2, 3].map((i) => ({
    key: `category_${i}`,
    title: t(`category_${i}_title`),
    description: t(`category_${i}_description`),
    meta: t(`category_${i}_meta`),
  }));

  const steps = [1, 2, 3, 4].map((i) => ({
    key: `step_${i}`,
    title: t(`step_${i}_title`),
    body: t(`step_${i}_body`),
    duration: t(`step_${i}_duration`),
  }));

  const tiers = [
    { i: 1, highlight: false },
    { i: 2, highlight: true },
    { i: 3, highlight: false },
  ].map(({ i, highlight }) => ({
    key: `tier_${i}`,
    label: t(`tier_${i}_label`),
    range: t(`tier_${i}_range`),
    body: t(`tier_${i}_body`),
    highlight,
  }));

  const testimonials = [1, 2, 3, 4].map((i) => ({
    key: `testimonial_${i}`,
    quote: t(`testimonial_${i}_quote`),
    author: t(`testimonial_${i}_author`),
    work: t(`testimonial_${i}_work`),
  }));

  const faq = [1, 2, 3, 4, 5, 6].map((i) => ({
    key: `faq_${i}`,
    q: t(`faq_${i}_q`),
    a: t(`faq_${i}_a`),
  }));

  const formSlot = (
    <CommissionForm
      labels={{
        name: t('name'),
        email: t('email'),
        description: t('description'),
        budget: t('budget'),
        timeline: t('timeline'),
        send: t('send'),
        sending: t('sending'),
        success: t('success'),
        error: t('error'),
        rate_limit: t('rate_limit'),
        placeholder_name: t('placeholder_name'),
        placeholder_email: t('placeholder_email'),
        placeholder_description: t('placeholder_description'),
        placeholder_budget: t('placeholder_budget'),
        placeholder_timeline: t('placeholder_timeline'),
        gdpr_consent: t('gdpr_consent'),
        gdpr_privacy_policy: tGdpr('privacy_policy'),
        gdpr_consent_required: tGdpr('consent_required'),
      }}
    />
  );

  return (
    <CommissionAnimated>
      <CommissionContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        categoriesHeading={t('categories_heading')}
        categoriesSubheading={t('categories_subheading')}
        categories={categories}
        processHeading={t('process_heading')}
        processSubheading={t('process_subheading')}
        steps={steps}
        tiersHeading={t('tiers_heading')}
        tiersSubheading={t('tiers_subheading')}
        tiersDisclaimer={t('tiers_disclaimer')}
        tiers={tiers}
        timelineHeading={t('timeline_heading')}
        timelineBody={t('timeline_body')}
        testimonialsHeading={t('testimonials_heading')}
        testimonials={testimonials}
        faqHeading={t('faq_heading')}
        faq={faq}
        formHeading={t('form_heading')}
        formBody={t('form_body')}
        formSlot={formSlot}
      />
    </CommissionAnimated>
  );
}
