/**
 * @package CREATOR-STAGING — CommissionContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Commission narrative — categories + process + investment tiers + testimonials + FAQ + form (WCAG AA)
 */

'use client';

type Category = {
  key: string;
  title: string;
  description: string;
  meta: string;
};

type Step = {
  key: string;
  title: string;
  body: string;
  duration: string;
};

type Tier = {
  key: string;
  label: string;
  range: string;
  body: string;
  highlight?: boolean;
};

type Testimonial = {
  key: string;
  quote: string;
  author: string;
  work: string;
};

type FaqItem = {
  key: string;
  q: string;
  a: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  categoriesHeading: string;
  categoriesSubheading: string;
  categories: Category[];
  processHeading: string;
  processSubheading: string;
  steps: Step[];
  tiersHeading: string;
  tiersSubheading: string;
  tiersDisclaimer: string;
  tiers: Tier[];
  timelineHeading: string;
  timelineBody: string;
  testimonialsHeading: string;
  testimonials: Testimonial[];
  faqHeading: string;
  faq: FaqItem[];
  formHeading: string;
  formBody: string;
  formSlot: React.ReactNode;
};

export function CommissionContent({
  eyebrow,
  title,
  subtitle,
  categoriesHeading,
  categoriesSubheading,
  categories,
  processHeading,
  processSubheading,
  steps,
  tiersHeading,
  tiersSubheading,
  tiersDisclaimer,
  tiers,
  timelineHeading,
  timelineBody,
  testimonialsHeading,
  testimonials,
  faqHeading,
  faq,
  formHeading,
  formBody,
  formSlot,
}: Props) {
  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      <header className="text-center mb-20 md:mb-24">
        <p className="cm-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {eyebrow}
        </p>
        <h1 className="cm-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {title}
        </h1>
        <p className="cm-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </header>

      <section aria-labelledby="categories-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h2
            id="categories-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {categoriesHeading}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {categoriesSubheading}
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <li
              key={cat.key}
              className="cm-category-card p-8 md:p-10 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40"
            >
              <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">
                {cat.meta}
              </p>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-4 leading-snug">
                {cat.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {cat.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="process-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <h2
            id="process-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {processHeading}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {processSubheading}
          </p>
        </div>
        <ol className="space-y-6 md:space-y-8">
          {steps.map((step, idx) => (
            <li
              key={step.key}
              className="cm-step grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start border border-[var(--border)] rounded-lg p-6 md:p-8 bg-[var(--bg-surface)]/30"
            >
              <div className="md:col-span-1 shrink-0">
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--accent)] text-[var(--accent)] font-mono text-lg"
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {step.body}
                </p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-[0.25em]">
                  {step.duration}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tiers-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h2
            id="tiers-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4"
          >
            {tiersHeading}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {tiersSubheading}
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tiers.map((tier) => (
            <li
              key={tier.key}
              className={`cm-tier p-8 md:p-10 border rounded-lg flex flex-col ${
                tier.highlight
                  ? 'border-[var(--accent)] bg-[var(--bg-surface)]/60 relative overflow-hidden'
                  : 'border-[var(--border)] bg-[var(--bg-surface)]/30'
              }`}
            >
              {tier.highlight && (
                <span
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                  aria-hidden="true"
                />
              )}
              <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">
                {tier.label}
              </p>
              <p className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-6 leading-none">
                {tier.range}
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed flex-1">
                {tier.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-center text-[var(--text-muted)] text-xs mt-8 italic">
          {tiersDisclaimer}
        </p>
      </section>

      <section
        aria-labelledby="timeline-heading"
        className="mb-24 md:mb-32 border border-[var(--accent)]/30 rounded-lg p-10 md:p-14 bg-[var(--bg-surface)]/40"
      >
        <h2
          id="timeline-heading"
          className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-6"
        >
          {timelineHeading}
        </h2>
        <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
          {timelineBody}
        </p>
      </section>

      <section aria-labelledby="testimonials-heading" className="mb-24 md:mb-32">
        <h2
          id="testimonials-heading"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-12 text-center"
        >
          {testimonialsHeading}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <li
              key={t.key}
              className="cm-testimonial p-8 md:p-10 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/30 flex flex-col"
            >
              <blockquote className="text-[var(--text-secondary)] text-lg md:text-xl italic leading-relaxed mb-6 flex-1">
                «{t.quote}»
              </blockquote>
              <div>
                <p className="text-[var(--text-primary)] text-base">{t.author}</p>
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] mt-1">
                  {t.work}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="mb-24 md:mb-32">
        <h2
          id="faq-heading"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-12 text-center"
        >
          {faqHeading}
        </h2>
        <ul className="divide-y divide-[var(--border)] max-w-4xl mx-auto">
          {faq.map((item) => (
            <li key={item.key} className="cm-faq-item py-6 md:py-8">
              <details className="group">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-sm">
                  <h3 className="font-[family-name:var(--font-serif)] text-lg md:text-xl font-light leading-snug pr-4">
                    {item.q}
                  </h3>
                  <span
                    className="shrink-0 text-[var(--accent)] text-2xl leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="text-[var(--text-secondary)] leading-relaxed mt-4 pr-10">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="commission-form"
        aria-labelledby="form-heading"
        className="cm-form-block border border-[var(--accent)]/40 rounded-lg p-8 md:p-14 bg-[var(--bg-surface)]/60"
      >
        <div className="max-w-3xl mx-auto">
          <h2
            id="form-heading"
            className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-4 text-center"
          >
            {formHeading}
          </h2>
          <p className="text-[var(--text-secondary)] text-center leading-relaxed mb-10 md:mb-12">
            {formBody}
          </p>
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-8 md:p-10">
            {formSlot}
          </div>
        </div>
      </section>
    </article>
  );
}
