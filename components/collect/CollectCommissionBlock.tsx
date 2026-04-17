/**
 * @package CREATOR-STAGING — CollectCommissionBlock
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose CTA block linking to commission page ("not finding what you want?").
 */

import Link from 'next/link';

export interface CommissionBlockLabels {
  title: string;
  subtitle: string;
  cta: string;
}

interface Props {
  locale: string;
  labels: CommissionBlockLabels;
}

export function CollectCommissionBlock({ locale, labels }: Props) {
  return (
    <section
      className="py-20 px-6"
      aria-labelledby="collect-commission-title"
    >
      <div className="max-w-4xl mx-auto text-center rounded-3xl border border-[var(--accent)]/30 bg-[var(--bg-surface)] px-6 py-14 md:px-12 md:py-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent"
        />
        <div className="relative space-y-5">
          <h2
            id="collect-commission-title"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light"
          >
            {labels.title}
          </h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {labels.subtitle}
          </p>
          <div>
            <Link
              href={`/${locale}/commission`}
              className="inline-block px-8 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest rounded font-medium hover:bg-[var(--accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {labels.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
