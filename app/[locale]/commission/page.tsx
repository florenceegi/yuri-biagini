/**
 * @package CREATOR-STAGING — Commission Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-12
 * @purpose Request a custom artwork — the visitor describes their vision, the artist creates
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { CommissionForm } from '@/components/commission/CommissionForm';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'commission' });
  return {
    title: `${t('title')} — Yuri Biagini`,
    description: t('subtitle'),
  };
}

export default async function CommissionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'commission' });
  const tGdpr = await getTranslations({ locale, namespace: 'gdpr' });

  const steps = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <article className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light mb-6">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* How it works */}
        <div>
          <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-10">
            {t('how_it_works')}
          </h2>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-medium">
                  {i + 1}
                </div>
                <div className="pt-2">
                  <p className="text-[var(--text-primary)] leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 md:p-10">
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
        </div>
      </div>
    </article>
  );
}
