/**
 * @package CREATOR-STAGING — SectionsTab
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Configurator tab — creator picks tier, section addons and feature addons with live setup + monthly total.
 */

'use client';

import { SECTIONS, FEATURES, TIERS, getTier, type SectionId, type FeatureId, type TierId } from '@/lib/site-catalog';
import { useSiteSelection } from '@/lib/hooks/useSiteSelection';

type Labels = {
  tier_heading: string;
  sections_heading: string;
  features_heading: string;
  total_setup: string;
  total_monthly: string;
  included: string;
  setup_from: string;
  monthly_from: string;
  tier_creator: string;
  tier_studio: string;
  tier_maestro: string;
  section: Record<SectionId, { label: string; description: string }>;
  feature: Record<FeatureId, { label: string; description: string }>;
};

type Props = { labels: Labels };

function fmt(eur: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

function tierLabel(id: TierId, labels: Labels): string {
  if (id === 'creator') return labels.tier_creator;
  if (id === 'studio') return labels.tier_studio;
  return labels.tier_maestro;
}

export function SectionsTab({ labels }: Props) {
  const { selection, update, toggleSection, toggleFeature, hydrated } = useSiteSelection();
  if (!hydrated) return <div className="p-4 text-xs text-[var(--text-muted)]">…</div>;

  const tier = getTier(selection.tier);

  const addonSections = selection.sections.filter((s) => !tier.included_sections.includes(s));
  const addonFeatures = selection.features.filter((f) => !tier.included_features.includes(f));

  const sectionsSetup = addonSections.reduce((sum, id) => sum + (SECTIONS.find((s) => s.id === id)?.price_setup ?? 0), 0);
  const sectionsMonthly = addonSections.reduce((sum, id) => sum + (SECTIONS.find((s) => s.id === id)?.price_monthly ?? 0), 0);
  const featuresSetup = addonFeatures.reduce((sum, id) => sum + (FEATURES.find((f) => f.id === id)?.price_setup ?? 0), 0);
  const featuresMonthly = addonFeatures.reduce((sum, id) => sum + (FEATURES.find((f) => f.id === id)?.price_monthly ?? 0), 0);

  const totalSetup = tier.setup + sectionsSetup + featuresSetup;
  const totalMonthly = tier.monthly + sectionsMonthly + featuresMonthly;

  return (
    <div className="p-3 space-y-5">
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-2">{labels.tier_heading}</h3>
        <div className="grid grid-cols-3 gap-1.5">
          {TIERS.map((t) => {
            const active = selection.tier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => update({ tier: t.id })}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  active ? 'border-[var(--accent)] bg-[var(--bg-elevated)]' : 'border-[var(--border)] hover:bg-[var(--bg-elevated)]/50'
                }`}
                aria-pressed={active}
              >
                <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-primary)]">
                  {tierLabel(t.id, labels)}
                </div>
                <div className="text-[9px] text-[var(--text-muted)] mt-0.5">{fmt(t.setup)}</div>
                <div className="text-[9px] text-[var(--text-muted)]">{fmt(t.monthly)}/mo</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-2">{labels.sections_heading}</h3>
        <div className="space-y-1">
          {SECTIONS.map((s) => {
            const included = tier.included_sections.includes(s.id);
            const checked = selection.sections.includes(s.id) || included;
            const info = labels.section[s.id];
            return (
              <label
                key={s.id}
                className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  checked ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]/40'
                } ${included ? 'opacity-70 cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={included}
                  onChange={() => !included && toggleSection(s.id)}
                  className="mt-0.5 accent-[var(--accent)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[var(--text-primary)] font-medium truncate">{info?.label ?? s.id}</span>
                    <span className="text-[9px] text-[var(--text-muted)] whitespace-nowrap">
                      {included ? labels.included : `+${fmt(s.price_setup)}${s.price_monthly > 0 ? ` +${fmt(s.price_monthly)}/mo` : ''}`}
                    </span>
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] truncate">{info?.description ?? ''}</div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-2">{labels.features_heading}</h3>
        <div className="space-y-1">
          {FEATURES.map((f) => {
            const included = tier.included_features.includes(f.id);
            const checked = selection.features.includes(f.id) || included;
            const info = labels.feature[f.id];
            return (
              <label
                key={f.id}
                className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  checked ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]/40'
                } ${included ? 'opacity-70 cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={included}
                  onChange={() => !included && toggleFeature(f.id)}
                  className="mt-0.5 accent-[var(--accent)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[var(--text-primary)] font-medium truncate">{info?.label ?? f.id}</span>
                    <span className="text-[9px] text-[var(--text-muted)] whitespace-nowrap">
                      {included ? labels.included : `+${fmt(f.price_setup)}${f.price_monthly > 0 ? ` +${fmt(f.price_monthly)}/mo` : ''}`}
                    </span>
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] truncate">{info?.description ?? ''}</div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-3 -mb-3 px-3 py-3 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border)] flex items-center justify-between gap-3">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{labels.total_setup}</div>
          <div className="text-base font-bold text-[var(--text-primary)]">{fmt(totalSetup)}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{labels.total_monthly}</div>
          <div className="text-base font-bold text-[var(--accent)]">{fmt(totalMonthly)}/mo</div>
        </div>
      </div>
    </div>
  );
}
