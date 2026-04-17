/**
 * @package CREATOR-STAGING — StoryBehindContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Story / manifesto content — editorial long-form layout, WCAG AA
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

type Chapter = {
  key: string;
  title: string;
  body: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  manifesto: string;
  chapters: Chapter[];
  quote: string;
  quoteAuthor: string;
  ctaText: string;
  ctaLabel: string;
};

export function StoryBehindContent({
  eyebrow,
  title,
  subtitle,
  manifesto,
  chapters,
  quote,
  quoteAuthor,
  ctaText,
  ctaLabel,
}: Props) {
  const locale = useLocale();

  return (
    <article className="py-24 md:py-32 px-6 max-w-5xl mx-auto">
      <header className="text-center mb-24 md:mb-32">
        <p className="story-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="story-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="story-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      <section aria-labelledby="manifesto-heading" className="mb-24 md:mb-32">
        <h2 id="manifesto-heading" className="sr-only">
          {eyebrow}
        </h2>
        <p className="story-manifesto font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-relaxed text-[var(--text-primary)] text-center max-w-3xl mx-auto">
          {manifesto}
        </p>
      </section>

      <section aria-labelledby="chapters-heading" className="space-y-20 md:space-y-28">
        <h2 id="chapters-heading" className="sr-only">
          {title}
        </h2>
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.key}
            className={`story-chapter grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 ${
              idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="md:col-span-4 flex flex-col">
              <span className="text-[var(--text-muted)] font-mono text-sm mb-3">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="story-chapter-bar h-px bg-[var(--accent)] mb-4 w-16" />
              <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light leading-tight">
                {chapter.title}
              </h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed whitespace-pre-line">
                {chapter.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <blockquote className="story-quote my-32 md:my-40 border-l-2 border-[var(--accent)] pl-8 md:pl-12 max-w-3xl mx-auto">
        <p className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light italic leading-relaxed text-[var(--text-primary)] mb-6">
          {quote}
        </p>
        <footer className="text-[var(--text-muted)] text-sm uppercase tracking-[0.3em]">
          — {quoteAuthor}
        </footer>
      </blockquote>

      <section className="story-cta text-center max-w-2xl mx-auto">
        <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
          {ctaText}
        </p>
        <Link
          href={`/${locale}/works`}
          className="inline-block px-10 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
        >
          {ctaLabel}
        </Link>
      </section>
    </article>
  );
}
