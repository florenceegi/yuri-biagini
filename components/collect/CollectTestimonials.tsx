/**
 * @package CREATOR-STAGING — CollectTestimonials
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Three collector testimonials (avatar + name + collection + quote).
 */

export interface Testimonial {
  name: string;
  location: string;
  worksCount: number;
  quote: string;
}

export interface TestimonialsLabels {
  title: string;
  works_label: string;
}

interface Props {
  title: string;
  worksLabel: string;
  testimonials: Testimonial[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase() || '·';
}

export function CollectTestimonials({ title, worksLabel, testimonials }: Props) {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto" aria-labelledby="collect-testimonials-title">
      <h2
        id="collect-testimonials-title"
        className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-center mb-16"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <figure
            key={`${t.name}-${i}`}
            className="flex flex-col gap-5 p-6 md:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] h-full"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] font-[family-name:var(--font-serif)] text-lg"
              >
                {initials(t.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {t.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest">
                  {t.location} · {t.worksCount} {worksLabel}
                </p>
              </div>
            </div>

            <blockquote className="text-base leading-relaxed text-[var(--text-secondary)] flex-1">
              <span aria-hidden="true" className="text-3xl leading-none text-[var(--accent)] mr-1 align-top">
                &ldquo;
              </span>
              {t.quote}
              <cite className="sr-only">{t.name}, {t.location}</cite>
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
