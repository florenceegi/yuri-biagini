/**
 * @package CREATOR-STAGING — Collect Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Collector funnel (Opzione B) — hero + available gallery + trust + journey + why + testimonials + commission + CTA.
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CollectContent } from '@/components/collect/CollectContent';
import type { Testimonial } from '@/components/collect/CollectTestimonials';
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

  const testimonials: Testimonial[] = [
    {
      name: 'Marta Ricci',
      location: 'Milano',
      worksCount: 7,
      quote: t('testimonial_1_quote'),
    },
    {
      name: 'Giovanni Rossi',
      location: 'Roma',
      worksCount: 3,
      quote: t('testimonial_2_quote'),
    },
    {
      name: 'Anne Meyer',
      location: 'Berlino',
      worksCount: 12,
      quote: t('testimonial_3_quote'),
    },
  ];

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
      galleryLabels={{
        title: t('available_now_title'),
        subtitle: t('available_now_subtitle'),
        filter_all: t('filter_all'),
        filter_available: t('filter_available'),
        filter_reserved: t('filter_reserved'),
        filter_sold: t('filter_sold'),
        filter_availability_group: t('filter_availability_group'),
        filter_price: t('filter_price'),
        filter_technique: t('filter_technique'),
        filter_under_1k: t('filter_under_1k'),
        filter_1k_5k: t('filter_1k_5k'),
        filter_5k_10k: t('filter_5k_10k'),
        filter_over_10k: t('filter_over_10k'),
        filter_reset: t('filter_reset'),
        no_results: t('no_results'),
        quickview_cta: t('quickview_cta'),
        price_on_request: t('price_on_request'),
        wishlist_add: t('wishlist_add'),
        wishlist_remove: t('wishlist_remove'),
        badge_available: t('filter_available'),
        badge_reserved: t('filter_reserved'),
        badge_sold: t('filter_sold'),
      }}
      trustLabels={{
        title: t('trust_title'),
        blockchain_title: t('trust_blockchain_title'),
        blockchain_desc: t('trust_blockchain_desc'),
        certificate_title: t('trust_certificate_title'),
        certificate_desc: t('trust_certificate_desc'),
        direct_title: t('trust_direct_title'),
        direct_desc: t('trust_direct_desc'),
        payment_title: t('trust_payment_title'),
        payment_desc: t('trust_payment_desc'),
        return_title: t('trust_return_title'),
        return_desc: t('trust_return_desc'),
      }}
      testimonialsTitle={t('testimonials_title')}
      worksLabel={t('testimonials_works_label')}
      testimonials={testimonials}
      commissionLabels={{
        title: t('commission_not_found'),
        subtitle: t('commission_subtitle'),
        cta: t('commission_cta'),
      }}
    />
  );
}
