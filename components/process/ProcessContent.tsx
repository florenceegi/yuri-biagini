/**
 * @package CREATOR-STAGING — ProcessContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Creative process layout — vertical timeline stages + tools grid + ritual (WCAG AA)
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

type Stage = {
  key: string;
  title: string;
  body: string;
  duration: string;
};

type Tool = {
  key: string;
  label: string;
  detail: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stagesHeading: string;
  stages: Stage[];
  toolsHeading: string;
  tools: Tool[];
  ritualHeading: string;
  ritualBody: string;
  ctaText: string;
  ctaLabel: string;
};

export function ProcessContent({
  eyebrow,
  title,
  subtitle,
  stagesHeading,
  stages,
  toolsHeading,
  tools,
  ritualHeading,
  ritualBody,
  ctaText,
  ctaLabel,
}: Props) {
  const locale = useLocale();

  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      <header className="text-center mb-24 md:mb-32">
        <p className="process-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="process-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="process-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      <section aria-labelledby="stages-heading" className="mb-32 md:mb-40">
        <h2
          id="stages-heading"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light text-center mb-16 md:mb-20"
        >
          {stagesHeading}
        </h2>

        <ol className="relative max-w-4xl mx-auto">
          {stages.map((stage, idx) => (
            <li
              key={stage.key}
              className="process-stage relative grid grid-cols-[auto_1fr] gap-6 md:gap-10 pb-12 md:pb-16 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--accent)] text-[var(--accent)] font-mono text-sm"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {idx < stages.length - 1 && (
                  <div className="process-stage-connector flex-1 w-px bg-[var(--border)] mt-2 min-h-[3rem]" />
                )}
              </div>

              <div>
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                  <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light">
                    {stage.title}
                  </h3>
                  <span className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em]">
                    {stage.duration}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                  {stage.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tools-heading" className="mb-32 md:mb-40">
        <h2
          id="tools-heading"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light text-center mb-16 md:mb-20"
        >
          {toolsHeading}
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tools.map((tool) => (
            <li
              key={tool.key}
              className="process-tool p-8 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40 hover:border-[var(--accent)]/60 transition-colors duration-300"
            >
              <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-3">
                {tool.label}
              </h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                {tool.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="ritual-heading"
        className="process-ritual mb-24 md:mb-32 border-t border-b border-[var(--border)] py-16 md:py-24 text-center"
      >
        <h2
          id="ritual-heading"
          className="text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.3em] mb-8"
        >
          {ritualHeading}
        </h2>
        <p className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-relaxed max-w-3xl mx-auto text-[var(--text-primary)] italic">
          {ritualBody}
        </p>
      </section>

      <section className="process-cta text-center max-w-2xl mx-auto">
        <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
          {ctaText}
        </p>
        <Link
          href={`/${locale}/journal`}
          className="inline-block px-10 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.25em] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
        >
          {ctaLabel}
        </Link>
      </section>
    </article>
  );
}
