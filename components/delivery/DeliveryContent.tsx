/**
 * @package CREATOR-STAGING — DeliveryContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-19
 * @purpose Artist-facing delivery report — what the artist receives when commissioning a personal site (WCAG AA)
 */

'use client';

import { SECTIONS, FEATURES, type SectionId, type FeatureId } from '@/lib/site-catalog';

type Metric = { label: string; value: string; note: string };
type Deliverable = { title: string; body: string };
type StackRow = { layer: string; tech: string; rationale: string };
type Feature = { heading: string; body: string; source?: string };
type CompetitorRow = { label: string; perf: string; a11y: string; seo: string; schema: string; highlight?: boolean };
type Tier = { label: string; setup: string; monthly: string; body: string; highlight?: boolean };
type PriceBand = { band: string; kind: string; range: string };

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  leadSummary: string;
  metricsHeading: string;
  metrics: Metric[];
  metricsSource: string;

  s1Heading: string;
  s1Body: string;
  deliverablesHeading: string;
  deliverables: Deliverable[];
  configuratorHeading: string;
  configuratorBody: string;
  configuratorItems: string[];

  s2Heading: string;
  s2Body: string;
  stackHeadingLayer: string;
  stackHeadingTech: string;
  stackHeadingRationale: string;
  stack: StackRow[];
  headlessHeading: string;
  headlessBody: string;

  s3Heading: string;
  s3Body: string;
  features: Feature[];

  s4Heading: string;
  s4Body: string;
  competitorHeading: string;
  competitorHeadingPerf: string;
  competitorHeadingA11y: string;
  competitorHeadingSeo: string;
  competitorHeadingSchema: string;
  competitors: CompetitorRow[];
  competitorConclusion: string;

  s5Heading: string;
  s5Body: string;
  bandsHeading: string;
  bandsHeadingBand: string;
  bandsHeadingKind: string;
  bandsHeadingRange: string;
  bands: PriceBand[];
  tiersHeading: string;
  tiersIntro: string;
  tiers: Tier[];
  tiersDisclaimer: string;
  reductionHeading: string;
  reductionBody: string;

  catalogHeading: string;
  catalogIntro: string;
  catalogSectionsHeading: string;
  catalogFeaturesHeading: string;
  catalogColName: string;
  catalogColSetup: string;
  catalogColMonthly: string;
  sectionLabels: Record<SectionId, { label: string; description: string }>;
  featureLabels: Record<FeatureId, { label: string; description: string }>;

  s6Heading: string;
  s6Bullets: string[];
  s6Closing: string;

  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  ctaHref: string;
};

export function DeliveryContent(props: Props) {
  return (
    <article className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
      <header className="text-center mb-20 md:mb-24">
        <p className="dl-eyebrow text-[var(--accent)] text-xs md:text-sm uppercase tracking-[0.35em] mb-6">
          {props.eyebrow}
        </p>
        <h1 className="dl-title font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light leading-[1.05] mb-8">
          {props.title}
        </h1>
        <p className="dl-subtitle text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {props.subtitle}
        </p>
      </header>

      <section aria-labelledby="summary-heading" className="mb-24 md:mb-32">
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <h2
            id="summary-heading"
            className="dl-section-heading sr-only"
          >
            {props.metricsHeading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed text-center">
            {props.leadSummary}
          </p>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {props.metrics.map((m) => (
            <li
              key={m.label}
              className="dl-metric p-6 md:p-7 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40 text-center"
            >
              <p className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-2 leading-none text-[var(--accent)]">
                {m.value}
              </p>
              <p className="text-[var(--text-primary)] text-sm uppercase tracking-[0.2em] mb-1">
                {m.label}
              </p>
              <p className="text-[var(--text-muted)] text-xs">{m.note}</p>
            </li>
          ))}
        </ul>
        <p className="text-center text-[var(--text-muted)] text-xs mt-6 italic">
          {props.metricsSource}
        </p>
      </section>

      <section aria-labelledby="s1-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§1</p>
          <h2
            id="s1-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s1Heading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.s1Body}</p>
        </div>

        <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-8">
          {props.deliverablesHeading}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {props.deliverables.map((d) => (
            <li
              key={d.title}
              className="dl-card p-8 md:p-10 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40"
            >
              <h4 className="font-[family-name:var(--font-serif)] text-xl font-light mb-3 leading-snug">
                {d.title}
              </h4>
              <p className="text-[var(--text-secondary)] leading-relaxed">{d.body}</p>
            </li>
          ))}
        </ul>

        <div className="border border-[var(--accent)]/30 rounded-lg p-8 md:p-12 bg-[var(--bg-surface)]/40">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4">
            {props.configuratorHeading}
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-3xl">
            {props.configuratorBody}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {props.configuratorItems.map((item) => (
              <li
                key={item}
                className="dl-row flex items-start gap-3 text-[var(--text-secondary)]"
              >
                <span className="text-[var(--accent)] mt-1.5 shrink-0" aria-hidden="true">◆</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="s2-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§2</p>
          <h2
            id="s2-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s2Heading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.s2Body}</p>
        </div>

        <div className="overflow-x-auto mb-16 border border-[var(--border)] rounded-lg">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-[var(--bg-surface)]/60">
              <tr>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light text-[var(--text-primary)]">
                  {props.stackHeadingLayer}
                </th>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light text-[var(--text-primary)]">
                  {props.stackHeadingTech}
                </th>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light text-[var(--text-primary)]">
                  {props.stackHeadingRationale}
                </th>
              </tr>
            </thead>
            <tbody>
              {props.stack.map((row) => (
                <tr
                  key={row.layer}
                  className="dl-row border-t border-[var(--border)] hover:bg-[var(--bg-surface)]/30 transition-colors"
                >
                  <td className="p-4 md:p-5 text-[var(--text-primary)] align-top">{row.layer}</td>
                  <td className="p-4 md:p-5 text-[var(--accent)] align-top">{row.tech}</td>
                  <td className="p-4 md:p-5 text-[var(--text-secondary)] align-top leading-relaxed">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-[var(--border)] rounded-lg p-8 md:p-12 bg-[var(--bg-surface)]/30 max-w-4xl mx-auto">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4">
            {props.headlessHeading}
          </h3>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.headlessBody}</p>
        </div>
      </section>

      <section aria-labelledby="s3-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§3</p>
          <h2
            id="s3-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s3Heading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.s3Body}</p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {props.features.map((f) => (
            <li
              key={f.heading}
              className="dl-card p-8 md:p-10 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]/40"
            >
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-4 leading-snug">
                {f.heading}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">{f.body}</p>
              {f.source && (
                <p className="text-[var(--text-muted)] text-xs italic">{f.source}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="s4-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§4</p>
          <h2
            id="s4-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s4Heading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.s4Body}</p>
        </div>

        <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-6">
          {props.competitorHeading}
        </h3>
        <div className="overflow-x-auto mb-8 border border-[var(--border)] rounded-lg">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-[var(--bg-surface)]/60">
              <tr>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">—</th>
                <th scope="col" className="text-center p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.competitorHeadingPerf}</th>
                <th scope="col" className="text-center p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.competitorHeadingA11y}</th>
                <th scope="col" className="text-center p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.competitorHeadingSeo}</th>
                <th scope="col" className="text-center p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.competitorHeadingSchema}</th>
              </tr>
            </thead>
            <tbody>
              {props.competitors.map((c) => (
                <tr
                  key={c.label}
                  className={`dl-row border-t border-[var(--border)] ${
                    c.highlight ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--bg-surface)]/30'
                  }`}
                >
                  <td className={`p-4 md:p-5 align-top ${c.highlight ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-primary)]'}`}>
                    {c.label}
                  </td>
                  <td className="p-4 md:p-5 text-center text-[var(--text-secondary)] font-mono">{c.perf}</td>
                  <td className="p-4 md:p-5 text-center text-[var(--text-secondary)] font-mono">{c.a11y}</td>
                  <td className="p-4 md:p-5 text-center text-[var(--text-secondary)] font-mono">{c.seo}</td>
                  <td className="p-4 md:p-5 text-center text-[var(--text-secondary)] font-mono">{c.schema}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          {props.competitorConclusion}
        </p>
      </section>

      <section aria-labelledby="s5-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§5</p>
          <h2
            id="s5-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s5Heading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.s5Body}</p>
        </div>

        <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-light mb-6">
          {props.bandsHeading}
        </h3>
        <div className="overflow-x-auto mb-16 border border-[var(--border)] rounded-lg">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-[var(--bg-surface)]/60">
              <tr>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.bandsHeadingBand}</th>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.bandsHeadingKind}</th>
                <th scope="col" className="text-left p-4 md:p-5 font-[family-name:var(--font-serif)] font-light">{props.bandsHeadingRange}</th>
              </tr>
            </thead>
            <tbody>
              {props.bands.map((b) => (
                <tr key={b.band} className="dl-row border-t border-[var(--border)] hover:bg-[var(--bg-surface)]/30">
                  <td className="p-4 md:p-5 text-[var(--text-primary)] align-top">{b.band}</td>
                  <td className="p-4 md:p-5 text-[var(--text-secondary)] align-top leading-relaxed">{b.kind}</td>
                  <td className="p-4 md:p-5 text-[var(--accent)] align-top font-mono whitespace-nowrap">{b.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-16">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4">
            {props.tiersHeading}
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-10 max-w-3xl">{props.tiersIntro}</p>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {props.tiers.map((tier) => (
              <li
                key={tier.label}
                className={`dl-tier p-8 md:p-10 border rounded-lg flex flex-col ${
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
                <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-6">{tier.label}</p>
                <p className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-light mb-2 leading-none">
                  {tier.setup}
                </p>
                <p className="text-[var(--text-muted)] text-sm mb-6">{tier.monthly}</p>
                <p className="text-[var(--text-secondary)] leading-relaxed flex-1">{tier.body}</p>
              </li>
            ))}
          </ul>
          <p className="text-[var(--text-muted)] text-xs italic mt-6 text-center">
            {props.tiersDisclaimer}
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-lg p-8 md:p-12 bg-[var(--bg-surface)]/30 max-w-4xl mx-auto">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-4">
            {props.reductionHeading}
          </h3>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.reductionBody}</p>
        </div>
      </section>

      <section aria-labelledby="catalog-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§5.1</p>
          <h2
            id="catalog-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.catalogHeading}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{props.catalogIntro}</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-xl mb-4 text-[var(--text-primary)]">{props.catalogSectionsHeading}</h3>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2">{props.catalogColName}</th>
                    <th className="text-right px-3 py-2">{props.catalogColSetup}</th>
                    <th className="text-right px-3 py-2">{props.catalogColMonthly}</th>
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.map((s) => (
                    <tr key={s.id} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 text-[var(--text-primary)]">
                        <div className="font-medium">{props.sectionLabels[s.id]?.label ?? s.id}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{props.sectionLabels[s.id]?.description}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-[var(--text-secondary)] whitespace-nowrap">€ {s.price_setup.toLocaleString('it-IT')}</td>
                      <td className="px-3 py-2 text-right text-[var(--text-secondary)] whitespace-nowrap">
                        {s.price_monthly > 0 ? `€ ${s.price_monthly}/mo` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-xl mb-4 text-[var(--text-primary)]">{props.catalogFeaturesHeading}</h3>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2">{props.catalogColName}</th>
                    <th className="text-right px-3 py-2">{props.catalogColSetup}</th>
                    <th className="text-right px-3 py-2">{props.catalogColMonthly}</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f) => (
                    <tr key={f.id} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 text-[var(--text-primary)]">
                        <div className="font-medium">{props.featureLabels[f.id]?.label ?? f.id}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{props.featureLabels[f.id]?.description}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-[var(--text-secondary)] whitespace-nowrap">€ {f.price_setup.toLocaleString('it-IT')}</td>
                      <td className="px-3 py-2 text-right text-[var(--text-secondary)] whitespace-nowrap">
                        {f.price_monthly > 0 ? `€ ${f.price_monthly}/mo` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="s6-heading" className="mb-24 md:mb-32">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-4">§6</p>
          <h2
            id="s6-heading"
            className="dl-section-heading font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light mb-6 leading-tight"
          >
            {props.s6Heading}
          </h2>
        </div>

        <ul className="space-y-4 md:space-y-5 max-w-4xl mx-auto mb-12">
          {props.s6Bullets.map((b) => (
            <li
              key={b}
              className="dl-row flex items-start gap-4 text-[var(--text-secondary)] text-lg leading-relaxed"
            >
              <span className="text-[var(--accent)] mt-1.5 shrink-0" aria-hidden="true">◆</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <p className="text-center text-[var(--text-primary)] text-xl md:text-2xl font-[family-name:var(--font-serif)] font-light italic max-w-3xl mx-auto leading-relaxed">
          {props.s6Closing}
        </p>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="border border-[var(--accent)]/40 rounded-lg p-10 md:p-16 bg-[var(--bg-surface)]/60 text-center"
      >
        <h2
          id="cta-heading"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light mb-6"
        >
          {props.ctaHeading}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-10 max-w-2xl mx-auto">
          {props.ctaBody}
        </p>
        <a
          href={props.ctaHref}
          className="inline-block px-10 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-[0.2em] font-medium rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg)]"
        >
          {props.ctaButton}
        </a>
      </section>
    </article>
  );
}
