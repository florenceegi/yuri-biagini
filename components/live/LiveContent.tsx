/**
 * @package CREATOR-STAGING — LiveContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Live events layout — featured next-up + upcoming list + past replay (WCAG AA)
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

type Upcoming = {
  key: string;
  date: string;
  time: string;
  kind: string;
  title: string;
  description: string;
  location: string;
};

type Past = {
  key: string;
  date: string;
  kind: string;
  title: string;
  duration: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  nextUpLabel: string;
  upcomingHeading: string;
  upcoming: Upcoming[];
  addToCalendarLabel: string;
  rsvpLabel: string;
  pastHeading: string;
  past: Past[];
  replayLabel: string;
  noUpcomingTitle: string;
  noUpcomingBody: string;
  notifyHeading: string;
  notifyBody: string;
  notifyCta: string;
};

export function LiveContent({
  eyebrow,
  title,
  subtitle,
  nextUpLabel,
  upcomingHeading,
  upcoming,
  addToCalendarLabel,
  rsvpLabel,
  pastHeading,
  past,
  replayLabel,
  noUpcomingTitle,
  noUpcomingBody,
  notifyHeading,
  notifyBody,
  notifyCta,
}: Props) {
  const locale = useLocale();
  const next = upcoming[0];
  const others = upcoming.slice(1);

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]';

  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      <header className="text-center mb-20 md:mb-24">
        <p className="live-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="live-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="live-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      {next ? (
        <section
          aria-labelledby="next-up-heading"
          className="live-next-up mb-24 md:mb-32 relative border border-[var(--accent)]/40 rounded-lg p-8 md:p-12 bg-[var(--bg-surface)]/60 overflow-hidden"
        >
          <span
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
            aria-hidden="true"
          />
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span className="text-[var(--accent)] text-xs uppercase tracking-[0.3em]">
              {nextUpLabel}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10">
            <div className="flex-1">
              <p className="text-[var(--text-muted)] text-sm uppercase tracking-[0.2em] mb-2">
                {next.kind}
              </p>
              <h2
                id="next-up-heading"
                className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light leading-tight mb-4"
              >
                {next.title}
              </h2>
              <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed mb-6">
                {next.description}
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs mb-1">
                    {upcomingHeading}
                  </dt>
                  <dd className="text-[var(--text-primary)]">{next.date}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs mb-1">
                    {nextUpLabel}
                  </dt>
                  <dd className="text-[var(--text-primary)]">{next.time}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs mb-1">
                    {next.kind}
                  </dt>
                  <dd className="text-[var(--text-primary)]">{next.location}</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href={`/${locale}/contact`}
                className={`inline-flex justify-center px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-[0.25em] rounded hover:opacity-90 transition-opacity ${focusRing}`}
              >
                {rsvpLabel}
              </Link>
              <button
                type="button"
                className={`inline-flex justify-center px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] rounded hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors ${focusRing}`}
              >
                {addToCalendarLabel}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="no-upcoming-heading"
          className="mb-24 text-center max-w-xl mx-auto"
        >
          <h2
            id="no-upcoming-heading"
            className="font-[family-name:var(--font-serif)] text-3xl font-light mb-4"
          >
            {noUpcomingTitle}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">{noUpcomingBody}</p>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="upcoming-heading" className="mb-24 md:mb-32">
          <h2
            id="upcoming-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-12"
          >
            {upcomingHeading}
          </h2>
          <ul className="divide-y divide-[var(--border)]">
            {others.map((ev) => (
              <li key={ev.key} className="live-upcoming-item py-8 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                  <div className="md:col-span-3 text-[var(--text-muted)] font-mono text-sm">
                    <div>{ev.date}</div>
                    <div className="text-[var(--accent)]">{ev.time}</div>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] mb-2">
                      {ev.kind} · {ev.location}
                    </p>
                    <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <Link
                      href={`/${locale}/contact`}
                      className={`inline-block text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
                    >
                      {rsvpLabel} →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section aria-labelledby="past-heading" className="mb-24 md:mb-32">
          <h2
            id="past-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-12"
          >
            {pastHeading}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {past.map((ev) => (
              <li
                key={ev.key}
                className="live-past-item p-6 md:p-8 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/30"
              >
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] mb-3">
                  {ev.kind} · {ev.date}
                </p>
                <h3 className="font-[family-name:var(--font-serif)] text-lg md:text-xl font-light mb-4 leading-snug">
                  {ev.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] text-xs">{ev.duration}</span>
                  <Link
                    href={`/${locale}/journal`}
                    className={`text-sm uppercase tracking-[0.2em] text-[var(--accent)] border-b border-transparent hover:border-[var(--accent)] transition-colors rounded-sm ${focusRing}`}
                  >
                    {replayLabel} →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside
        aria-labelledby="notify-heading"
        className="live-notify border border-[var(--accent)]/30 rounded-lg p-10 md:p-16 text-center max-w-3xl mx-auto bg-[var(--bg-surface)]/40"
      >
        <h2
          id="notify-heading"
          className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4"
        >
          {notifyHeading}
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">{notifyBody}</p>
        <Link
          href={`/${locale}/contact`}
          className={`inline-block px-10 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded ${focusRing}`}
        >
          {notifyCta}
        </Link>
      </aside>
    </article>
  );
}
