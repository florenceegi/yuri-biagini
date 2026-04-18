/**
 * @package CREATOR-STAGING — ExhibitionsContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Exhibitions layout — featured next + upcoming + institutional + past archive (WCAG AA)
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

type Upcoming = {
  key: string;
  date: string;
  kind: string;
  title: string;
  venue: string;
  city: string;
  curator: string;
  description: string;
};

type Institutional = {
  key: string;
  year: string;
  kind: string;
  name: string;
  city: string;
  description: string;
};

type Past = {
  key: string;
  year: string;
  kind: string;
  title: string;
  venue: string;
  city: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  featuredLabel: string;
  upcomingHeading: string;
  upcoming: Upcoming[];
  rsvpLabel: string;
  detailsLabel: string;
  mapLabel: string;
  curatorLabel: string;
  institutionalHeading: string;
  institutionalSubheading: string;
  institutional: Institutional[];
  pastHeading: string;
  past: Past[];
  noUpcomingTitle: string;
  noUpcomingBody: string;
  archiveCtaHeading: string;
  archiveCtaBody: string;
  archiveCtaLabel: string;
};

export function ExhibitionsContent({
  eyebrow,
  title,
  subtitle,
  featuredLabel,
  upcomingHeading,
  upcoming,
  rsvpLabel,
  detailsLabel,
  mapLabel,
  curatorLabel,
  institutionalHeading,
  institutionalSubheading,
  institutional,
  pastHeading,
  past,
  noUpcomingTitle,
  noUpcomingBody,
  archiveCtaHeading,
  archiveCtaBody,
  archiveCtaLabel,
}: Props) {
  const locale = useLocale();
  const next = upcoming[0];
  const others = upcoming.slice(1);

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]';

  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      {/* HERO */}
      <header className="text-center mb-20 md:mb-24">
        <p className="ex-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="ex-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="ex-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      {/* FEATURED NEXT */}
      {next ? (
        <section
          aria-labelledby="featured-heading"
          className="ex-featured mb-24 md:mb-32 relative border border-[var(--accent)]/40 rounded-lg p-8 md:p-12 bg-[var(--bg-surface)]/60 overflow-hidden"
        >
          <span
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
            aria-hidden="true"
          />
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[var(--accent)] text-xs uppercase tracking-[0.3em]">
              {featuredLabel}
            </span>
          </div>

          <h2
            id="featured-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light leading-tight mb-4"
          >
            {next.title}
          </h2>

          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            {next.description}
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10 mb-10 text-sm">
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-widest text-[10px] mb-1">
                {next.kind}
              </dt>
              <dd className="text-[var(--text-primary)] font-medium">{next.date}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-widest text-[10px] mb-1">
                {next.venue}
              </dt>
              <dd className="text-[var(--text-primary)]">{next.city}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--text-muted)] uppercase tracking-widest text-[10px] mb-1">
                {curatorLabel}
              </dt>
              <dd className="text-[var(--text-primary)]">{next.curator}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contact?subject=rsvp-${next.key}`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--accent)] text-[var(--bg)] text-sm font-medium tracking-wide hover:bg-[var(--accent-hover)] transition-colors ${focusRing}`}
            >
              {rsvpLabel}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[var(--border)] text-[var(--text-secondary)] text-sm tracking-wide hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors ${focusRing}`}
            >
              {detailsLabel}
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[var(--border)] text-[var(--text-secondary)] text-sm tracking-wide hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors ${focusRing}`}
            >
              {mapLabel}
            </button>
          </div>
        </section>
      ) : null}

      {/* UPCOMING LIST */}
      {others.length > 0 && (
        <section aria-labelledby="upcoming-heading" className="mb-24 md:mb-32">
          <h2
            id="upcoming-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-10"
          >
            {upcomingHeading}
          </h2>
          <ul className="space-y-3">
            {others.map((ev) => (
              <li
                key={ev.key}
                className="ex-upcoming-item border border-[var(--border)] rounded-lg p-6 md:p-7 bg-[var(--bg-surface)]/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-[var(--text-secondary)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--accent)] text-[10px] uppercase tracking-[0.3em] mb-2">
                    {ev.kind} — {ev.date}
                  </p>
                  <h3 className="text-[var(--text-primary)] text-lg md:text-xl font-medium mb-1 truncate">
                    {ev.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    {ev.venue}, {ev.city}
                  </p>
                </div>
                <Link
                  href={`/${locale}/contact?subject=rsvp-${ev.key}`}
                  className={`self-start md:self-center inline-flex items-center gap-1 text-[var(--accent)] text-xs uppercase tracking-widest hover:gap-2 transition-all ${focusRing}`}
                >
                  {rsvpLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!next && (
        <section
          aria-labelledby="no-upcoming-heading"
          className="ex-featured mb-24 md:mb-32 border border-[var(--border)] rounded-lg p-10 md:p-14 bg-[var(--bg-surface)]/40 text-center"
        >
          <h2
            id="no-upcoming-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4"
          >
            {noUpcomingTitle}
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {noUpcomingBody}
          </p>
        </section>
      )}

      {/* INSTITUTIONAL */}
      {institutional.length > 0 && (
        <section aria-labelledby="institutional-heading" className="mb-24 md:mb-32">
          <header className="mb-10 md:mb-12">
            <h2
              id="institutional-heading"
              className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-3"
            >
              {institutionalHeading}
            </h2>
            <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl leading-relaxed">
              {institutionalSubheading}
            </p>
          </header>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {institutional.map((it) => (
              <li
                key={it.key}
                className="ex-institutional-card border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-surface)]/40 hover:border-[var(--accent)]/60 hover:bg-[var(--bg-surface)]/70 transition-colors"
              >
                <p className="text-[var(--accent)] text-[10px] uppercase tracking-[0.3em] mb-3">
                  {it.kind} · {it.year}
                </p>
                <h3 className="text-[var(--text-primary)] text-lg font-medium mb-1 leading-snug">
                  {it.name}
                </h3>
                <p className="text-[var(--text-muted)] text-xs mb-4">{it.city}</p>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {it.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* PAST ARCHIVE */}
      {past.length > 0 && (
        <section aria-labelledby="past-heading" className="mb-24 md:mb-32">
          <h2
            id="past-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-10"
          >
            {pastHeading}
          </h2>
          <ul className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
            {past.map((ev) => (
              <li
                key={ev.key}
                className="ex-past-item py-5 md:py-6 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6"
              >
                <span className="text-[var(--accent)] font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-none w-14 md:w-20 tabular-nums">
                  {ev.year}
                </span>
                <div className="min-w-0">
                  <p className="text-[var(--text-primary)] text-base md:text-lg font-medium truncate">
                    {ev.title}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs md:text-sm mt-0.5">
                    {ev.venue}, {ev.city}
                  </p>
                </div>
                <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-[0.3em] border border-[var(--border)] px-3 py-1 rounded self-start md:self-center hidden sm:inline-block">
                  {ev.kind}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ARCHIVE CTA */}
      <section
        aria-labelledby="archive-cta-heading"
        className="ex-archive-cta relative border border-[var(--border)] rounded-lg p-10 md:p-14 bg-[var(--bg-surface)]/40 text-center overflow-hidden"
      >
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent"
          aria-hidden="true"
        />
        <h2
          id="archive-cta-heading"
          className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4"
        >
          {archiveCtaHeading}
        </h2>
        <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          {archiveCtaBody}
        </p>
        <Link
          href={`/${locale}/press`}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-md bg-[var(--accent)] text-[var(--bg)] text-sm font-medium tracking-wide hover:bg-[var(--accent-hover)] transition-colors ${focusRing}`}
        >
          {archiveCtaLabel}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </article>
  );
}
