/**
 * @package CREATOR-STAGING — Press Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Press coverage listing — articles, PDFs — content from Sanity CMS
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
    title: t('press_title'),
    description: t('press_description'),
  };
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'press' });

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {t('title')}
      </h1>

      {/* Press items — will be populated from Sanity CMS */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h2 className="text-lg text-[var(--text-primary)]">
                {t('article_placeholder')} {i}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {t('publication_placeholder')} — 2024
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer">
                {t('read_online')}
              </span>
              <span className="text-[var(--text-muted)]">|</span>
              <span className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                {t('download_pdf')}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
