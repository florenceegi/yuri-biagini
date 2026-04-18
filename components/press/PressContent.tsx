/**
 * @package CREATOR-STAGING — PressContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Press narrative — featured review + reviews + interviews + catalogues + downloadable kit (WCAG AA)
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

type Review = {
  key: string;
  outlet: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
};

type Interview = {
  key: string;
  outlet: string;
  date: string;
  title: string;
  format: string;
  excerpt: string;
};

type Catalogue = {
  key: string;
  year: string;
  title: string;
  publisher: string;
  essay: string;
};

type KitAsset = {
  key: string;
  label: string;
  format: string;
  size: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  featuredLabel: string;
  featuredOutlet: string;
  featuredDate: string;
  featuredTitle: string;
  featuredExcerpt: string;
  featuredAuthor: string;
  readOnlineLabel: string;
  downloadPdfLabel: string;
  reviewsHeading: string;
  reviewsSubheading: string;
  reviews: Review[];
  interviewsHeading: string;
  interviewsSubheading: string;
  interviews: Interview[];
  cataloguesHeading: string;
  cataloguesSubheading: string;
  catalogues: Catalogue[];
  essayByLabel: string;
  kitHeading: string;
  kitBody: string;
  kitAssets: KitAsset[];
  kitCta: string;
  contactCta: string;
  contactCtaBody: string;
};

export function PressContent({
  eyebrow,
  title,
  subtitle,
  featuredLabel,
  featuredOutlet,
  featuredDate,
  featuredTitle,
  featuredExcerpt,
  featuredAuthor,
  readOnlineLabel,
  downloadPdfLabel,
  reviewsHeading,
  reviewsSubheading,
  reviews,
  interviewsHeading,
  interviewsSubheading,
  interviews,
  cataloguesHeading,
  cataloguesSubheading,
  catalogues,
  essayByLabel,
  kitHeading,
  kitBody,
  kitAssets,
  kitCta,
  contactCta,
  contactCtaBody,
}: Props) {
  const locale = useLocale();

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]';

  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      <header className="text-center mb-20 md:mb-24">
        <p className="pr-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="pr-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="pr-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      <section
        aria-labelledby="featured-review-heading"
        className="pr-featured mb-24 md:mb-32 relative border border-[var(--accent)]/40 rounded-lg p-8 md:p-14 bg-[var(--bg-surface)]/60 overflow-hidden"
      >
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          aria-hidden="true"
        />
        <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-6">
          {featuredLabel}
        </p>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
          <div className="flex-1">
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.25em] mb-4">
              {featuredOutlet} · {featuredDate}
            </p>
            <h2
              id="featured-review-heading"
              className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light leading-tight mb-6"
            >
              {featuredTitle}
            </h2>
            <blockquote className="text-[var(--text-secondary)] text-lg md:text-xl italic leading-relaxed border-l-2 border-[var(--accent)] pl-6 mb-6">
              {featuredExcerpt}
            </blockquote>
            <p className="text-[var(--text-muted)] text-sm">— {featuredAuthor}</p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <button
              type="button"
              className={`inline-flex justify-center px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-[0.25em] rounded hover:opacity-90 transition-opacity ${focusRing}`}
            >
              {readOnlineLabel}
            </button>
            <button
              type="button"
              className={`inline-flex justify-center px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] rounded hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors ${focusRing}`}
            >
              {downloadPdfLabel}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="reviews-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16">
          <h2
            id="reviews-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {reviewsHeading}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {reviewsSubheading}
          </p>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {reviews.map((rv) => (
            <li key={rv.key} className="pr-review-item py-8 md:py-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                <div className="md:col-span-3 text-[var(--text-muted)] font-mono text-sm">
                  <div className="text-[var(--accent)] uppercase tracking-[0.2em] text-xs">
                    {rv.outlet}
                  </div>
                  <div>{rv.date}</div>
                </div>
                <div className="md:col-span-7">
                  <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-3 leading-snug">
                    {rv.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-2">
                    {rv.excerpt}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em]">
                    — {rv.author}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right flex md:flex-col gap-2 md:gap-3">
                  <button
                    type="button"
                    className={`text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
                  >
                    {readOnlineLabel} →
                  </button>
                  <button
                    type="button"
                    className={`text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] border-b border-transparent hover:border-[var(--text-primary)] transition-colors rounded-sm ${focusRing}`}
                  >
                    {downloadPdfLabel} ↓
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="interviews-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16">
          <h2
            id="interviews-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {interviewsHeading}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {interviewsSubheading}
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {interviews.map((iv) => (
            <li
              key={iv.key}
              className="pr-interview-item p-6 md:p-8 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/30 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--accent)] text-xs uppercase tracking-[0.3em]">
                  {iv.outlet}
                </span>
                <span className="text-[var(--text-muted)] text-xs">{iv.format}</span>
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-3 leading-snug">
                {iv.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-6 flex-1">
                {iv.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] text-xs">{iv.date}</span>
                <button
                  type="button"
                  className={`text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
                >
                  {readOnlineLabel} →
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="catalogues-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16">
          <h2
            id="catalogues-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {cataloguesHeading}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {cataloguesSubheading}
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {catalogues.map((cat) => (
            <li
              key={cat.key}
              className="pr-catalogue-card p-6 md:p-8 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40 flex flex-col"
            >
              <p className="text-[var(--accent)] font-mono text-sm mb-3">{cat.year}</p>
              <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-4 leading-snug flex-1">
                {cat.title}
              </h3>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] mb-2">
                {cat.publisher}
              </p>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                {essayByLabel}: {cat.essay}
              </p>
              <button
                type="button"
                className={`self-start text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
              >
                {downloadPdfLabel} ↓
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="kit-heading"
        className="pr-kit border border-[var(--accent)]/30 rounded-lg p-10 md:p-16 bg-[var(--bg-surface)]/40 mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <h2
              id="kit-heading"
              className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-6"
            >
              {kitHeading}
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">{kitBody}</p>
            <button
              type="button"
              className={`inline-block px-10 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-[0.25em] hover:opacity-90 transition-all duration-300 rounded ${focusRing}`}
            >
              {kitCta}
            </button>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-[var(--border)]">
              {kitAssets.map((asset) => (
                <li
                  key={asset.key}
                  className="flex items-center justify-between py-4 gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)] text-base mb-1">
                      {asset.label}
                    </p>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em]">
                      {asset.format} · {asset.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`${downloadPdfLabel}: ${asset.label}`}
                    className={`shrink-0 text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
                  >
                    ↓
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <aside className="text-center max-w-2xl mx-auto">
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          {contactCtaBody}
        </p>
        <Link
          href={`/${locale}/contact`}
          className={`inline-block px-10 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded ${focusRing}`}
        >
          {contactCta}
        </Link>
      </aside>
    </article>
  );
}
