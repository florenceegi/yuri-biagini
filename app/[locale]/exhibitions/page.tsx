/**
 * @package YURI-BIAGINI — Exhibitions Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Exhibitions listing — upcoming, current, past — content from Sanity CMS
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
    title: t('exhibitions_title'),
    description: t('exhibitions_description'),
  };
}

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'exhibitions' });

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {t('title')}
      </h1>

      {/* Upcoming */}
      <div className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-8">
          {t('upcoming')}
        </h2>
        <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--bg-surface)] text-center">
          <p className="text-[var(--text-muted)]">
            Exhibition data will be loaded from Sanity CMS.
          </p>
        </div>
      </div>

      {/* Past */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-8">
          {t('past')}
        </h2>
        <div className="space-y-4">
          {/* Placeholder cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="text-lg text-[var(--text-primary)]">
                  Exhibition {i}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Venue, City — 2024
                </p>
              </div>
              <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border)] px-3 py-1 rounded self-start">
                {t('solo')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
