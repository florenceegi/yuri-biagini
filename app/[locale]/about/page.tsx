/**
 * @package YURI-BIAGINI — About Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Artist biography with scroll-driven animations — Sanity CMS ready
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { AboutAnimated } from '@/components/about/AboutAnimated';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('about_title'),
    description: t('about_description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <AboutAnimated>
      <article className="py-24 px-6 max-w-4xl mx-auto">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
          {t('title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {/* Portrait */}
          <div className="md:col-span-1 about-portrait">
            <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] flex items-center justify-center overflow-hidden">
              <span className="text-[var(--text-muted)] text-sm">Portrait</span>
            </div>
          </div>

          {/* Bio text */}
          <div className="md:col-span-2 space-y-6">
            <p className="about-bio-text text-[var(--text-secondary)] leading-relaxed text-lg">
              Biography content will be loaded from Sanity CMS.
            </p>
            <p className="about-bio-text text-[var(--text-secondary)] leading-relaxed text-lg">
              Second paragraph placeholder for extended biography.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-12 about-bio-text"
          >
            {t('timeline')}
          </h2>

          <div className="border-l-2 border-[var(--border)] pl-8 space-y-10">
            {[2024, 2023, 2022, 2021, 2020].map((year) => (
              <div key={year} className="relative timeline-item">
                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--bg)] timeline-dot" />
                <p className="text-[var(--accent)] text-sm uppercase tracking-widest mb-2">
                  {year}
                </p>
                <p className="text-[var(--text-primary)] font-medium">
                  Timeline event title
                </p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">
                  Event description placeholder — Sanity CMS
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CV Download */}
        <div className="mt-16 text-center">
          <button
            type="button"
            className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
          >
            {t('cv_download')}
          </button>
        </div>
      </article>
    </AboutAnimated>
  );
}
