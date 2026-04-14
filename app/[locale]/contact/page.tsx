/**
 * @package CREATOR-STAGING — Contact Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Contact form with client-side validation, accessible labels
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('contact_title'),
    description: t('contact_description'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const tGdpr = await getTranslations({ locale, namespace: 'gdpr' });

  return (
    <section className="py-24 px-6 max-w-2xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {t('title')}
      </h1>

      <ContactForm
        labels={{
          name: t('name'),
          email: t('email'),
          subject: t('subject'),
          message: t('message'),
          send: t('send'),
          sending: t('sending'),
          success: t('success'),
          error: t('error'),
          rate_limit: t('rate_limit'),
          placeholder_name: t('placeholder_name'),
          placeholder_email: t('placeholder_email'),
          placeholder_subject: t('placeholder_subject'),
          placeholder_message: t('placeholder_message'),
          gdpr_consent: t('gdpr_consent'),
          gdpr_privacy_policy: tGdpr('privacy_policy'),
          gdpr_consent_required: tGdpr('consent_required'),
        }}
      />
    </section>
  );
}
