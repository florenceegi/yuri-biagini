/**
 * @package YURI-BIAGINI — About Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Artist biography page — content from Sanity CMS when available
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
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
    <article className="py-24 px-6 max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {t('title')}
      </h1>

      {/* Bio content — will be populated from Sanity CMS */}
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Portrait placeholder */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] flex items-center justify-center">
              <span className="text-[var(--text-muted)] text-sm">Portrait</span>
            </div>
          </div>

          {/* Bio text placeholder */}
          <div className="md:col-span-2 space-y-6">
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
              {/* Placeholder — Sanity CMS will provide localized bio */}
              Biography content will be loaded from Sanity CMS.
            </p>
          </div>
        </div>

        {/* Timeline section */}
        <section aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-8"
          >
            {t('timeline')}
          </h2>

          {/* Timeline placeholder — will be populated from Sanity */}
          <div className="border-l-2 border-[var(--border)] pl-8 space-y-8">
            {[2024, 2023, 2022].map((year) => (
              <div key={year} className="relative">
                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--bg)]" />
                <p className="text-[var(--accent)] text-sm uppercase tracking-widest mb-1">
                  {year}
                </p>
                <p className="text-[var(--text-secondary)]">
                  Timeline event placeholder
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
