/**
 * @package CREATOR-STAGING — Collect Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-12
 * @purpose Collector's emotional funnel: explore → fall in love → verify → purchase
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getArtistArtworks } from '@/lib/egi/client';
import Image from 'next/image';
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

export const revalidate = 60;

const ARTIST_URL = process.env.NEXT_PUBLIC_EGI_ARTIST_URL || 'https://art.florenceegi.com';

export default async function CollectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'collect' });

  let featuredImages: string[] = [];
  try {
    const result = await getArtistArtworks(1, 4);
    featuredImages = result.data
      .map((a) => a.main_image_url)
      .filter((url): url is string => Boolean(url));
  } catch {
    featuredImages = [];
  }

  const steps = [
    { num: '01', title: t('step1_title'), desc: t('step1_description'), accent: 'var(--accent)' },
    { num: '02', title: t('step2_title'), desc: t('step2_description'), accent: '#e8956a' },
    { num: '03', title: t('step3_title'), desc: t('step3_description'), accent: '#6ae89b' },
    { num: '04', title: t('step4_title'), desc: t('step4_description'), accent: '#6a9be8' },
  ];

  const whyItems = [
    { title: t('why_authenticity'), desc: t('why_authenticity_desc'), icon: '◆' },
    { title: t('why_provenance'), desc: t('why_provenance_desc'), icon: '◈' },
    { title: t('why_direct'), desc: t('why_direct_desc'), icon: '◇' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-surface)] to-[var(--bg)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* The Journey — 4 steps */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                {featuredImages[i] ? (
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)]">
                    <Image
                      src={featuredImages[i]}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]" />
                )}
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 space-y-4">
                <span
                  className="text-6xl md:text-8xl font-[family-name:var(--font-serif)] font-light"
                  style={{ color: step.accent }}
                >
                  {step.num}
                </span>
                <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light">
                  {step.title}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain badge */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center border border-[var(--accent)]/30 rounded-2xl p-8 md:p-12 bg-[var(--bg-surface)]">
          <div className="text-4xl mb-4">⬡</div>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('blockchain_badge')}
          </p>
        </div>
      </section>

      {/* Why collect */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-center mb-16">
          {t('why_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {whyItems.map((item) => (
            <div key={item.title} className="text-center space-y-4">
              <div className="text-3xl text-[var(--accent)]">{item.icon}</div>
              <h3 className="text-xl font-medium text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`/${locale}/works`}
            className="inline-block px-8 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors rounded font-medium text-center"
          >
            {t('cta_browse')}
          </a>
          <a
            href={ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded font-medium text-center"
          >
            {t('cta_platform')}
          </a>
        </div>
      </section>
    </>
  );
}
