/**
 * @package CREATOR-STAGING — SiteCommissionForm
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Form with which an artist commissions FlorenceEGI WebAgency to build the personal site — prefills tier/sections/features from configurator selection and shows live setup + monthly quote.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSiteSelection } from '@/lib/hooks/useSiteSelection';
import { SECTIONS, FEATURES, TIERS, computeQuote, getTier, type SectionId, type FeatureId } from '@/lib/site-catalog';

type Labels = {
  name: string;
  email: string;
  phone: string;
  tier: string;
  tier_creator: string;
  tier_studio: string;
  tier_maestro: string;
  subdomain_wish: string;
  subdomain_suffix: string;
  timeline: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  rate_limit: string;
  placeholder_name: string;
  placeholder_email: string;
  placeholder_phone: string;
  placeholder_subdomain: string;
  placeholder_timeline: string;
  placeholder_message: string;
  current_config: string;
  gdpr_consent: string;
  gdpr_privacy_policy: string;
  gdpr_consent_required: string;
  quote_heading: string;
  quote_base_setup: string;
  quote_base_monthly: string;
  quote_addons: string;
  quote_total_setup: string;
  quote_total_monthly: string;
  addons_empty: string;
  section_label: Record<SectionId, string>;
  feature_label: Record<FeatureId, string>;
};

type Props = { labels: Labels };

const inputClass =
  'w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function fmt(eur: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

export function SiteCommissionForm({ labels }: Props) {
  const { selection, update, hydrated } = useSiteSelection();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'rate_limit'>('idle');
  const [gdprError, setGdprError] = useState(false);
  const [config, setConfig] = useState<{ template: string; animation: string; scene: string }>({
    template: '',
    animation: '',
    scene: '',
  });

  useEffect(() => {
    const template = readCookie('variant') || document.documentElement.getAttribute('data-variant') || '';
    const animation = readCookie('animation') || document.documentElement.getAttribute('data-animation') || '';
    const scene = readCookie('scene') || document.documentElement.getAttribute('data-scene') || '';
    setConfig({ template, animation, scene });
  }, []);

  const tier = getTier(selection.tier);
  const quote = useMemo(
    () => computeQuote(selection.tier, selection.sections, selection.features),
    [selection.tier, selection.sections, selection.features],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const gdprChecked = (form.elements.namedItem('gdpr_consent') as HTMLInputElement)?.checked;
    if (!gdprChecked) {
      setGdprError(true);
      return;
    }
    setGdprError(false);
    setStatus('sending');

    const data = new FormData(form);
    if (data.get('website')) { setStatus('success'); return; }

    try {
      const res = await fetch('/api/site-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') || undefined,
          tier: selection.tier,
          template: config.template || undefined,
          animation: config.animation || undefined,
          scene: config.scene || undefined,
          subdomain_wish: data.get('subdomain_wish') || undefined,
          timeline: data.get('timeline') || undefined,
          message: data.get('message') || undefined,
          sections: selection.sections,
          features: selection.features,
          gdpr_consent: true,
        }),
      });

      if (res.status === 429) { setStatus('rate_limit'); return; }
      if (!res.ok) { setStatus('error'); return; }
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const hasConfig = config.template || config.animation || config.scene;
  const addonSections = quote.addon_sections;
  const addonFeatures = quote.addon_features;
  const addonTotalSetup = quote.setup - tier.setup;
  const addonTotalMonthly = quote.monthly - tier.monthly;
  const hasAddons = addonSections.length + addonFeatures.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="sc-website">Website</label>
        <input type="text" id="sc-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-3">
        <legend className="block text-sm text-[var(--text-secondary)] mb-2">{labels.tier}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIERS.map((t) => (
            <label
              key={t.id}
              className={`cursor-pointer border rounded-lg p-4 transition-colors ${
                selection.tier === t.id
                  ? 'border-[var(--accent)] bg-[var(--bg-elevated)]'
                  : 'border-[var(--border)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              <input
                type="radio"
                name="tier"
                value={t.id}
                checked={selection.tier === t.id}
                onChange={() => update({ tier: t.id })}
                className="sr-only"
              />
              <div className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                {t.id === 'creator' && labels.tier_creator}
                {t.id === 'studio' && labels.tier_studio}
                {t.id === 'maestro' && labels.tier_maestro}
              </div>
              <div className="text-[var(--text-muted)] text-xs mt-1">{fmt(t.setup)}</div>
              <div className="text-[var(--text-muted)] text-xs">{fmt(t.monthly)}/mo</div>
            </label>
          ))}
        </div>
      </fieldset>

      {hydrated && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 space-y-3">
          <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            {labels.quote_heading}
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{labels.quote_base_setup}</span>
            <span className="text-[var(--text-primary)]">{fmt(tier.setup)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{labels.quote_base_monthly}</span>
            <span className="text-[var(--text-primary)]">{fmt(tier.monthly)}/mo</span>
          </div>
          <div className="border-t border-[var(--border)] pt-3">
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">{labels.quote_addons}</div>
            {!hasAddons && <div className="text-xs text-[var(--text-muted)] italic">{labels.addons_empty}</div>}
            {addonSections.map((id) => {
              const s = SECTIONS.find((x) => x.id === id);
              if (!s) return null;
              return (
                <div key={id} className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">{labels.section_label[id] ?? id}</span>
                  <span className="text-[var(--text-primary)]">
                    +{fmt(s.price_setup)}{s.price_monthly > 0 && ` · +${fmt(s.price_monthly)}/mo`}
                  </span>
                </div>
              );
            })}
            {addonFeatures.map((id) => {
              const f = FEATURES.find((x) => x.id === id);
              if (!f) return null;
              return (
                <div key={id} className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">{labels.feature_label[id] ?? id}</span>
                  <span className="text-[var(--text-primary)]">
                    +{fmt(f.price_setup)}{f.price_monthly > 0 && ` · +${fmt(f.price_monthly)}/mo`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[var(--border)] pt-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{labels.quote_total_setup}</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{fmt(quote.setup)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{labels.quote_total_monthly}</div>
              <div className="text-lg font-bold text-[var(--accent)]">{fmt(quote.monthly)}/mo</div>
            </div>
          </div>
          {hasAddons && (
            <div className="text-[10px] text-[var(--text-muted)] text-right">
              (addons: +{fmt(addonTotalSetup)} · +{fmt(addonTotalMonthly)}/mo)
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sc-name" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.name}</label>
          <input id="sc-name" name="name" type="text" required placeholder={labels.placeholder_name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="sc-email" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.email}</label>
          <input id="sc-email" name="email" type="email" required placeholder={labels.placeholder_email} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sc-phone" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.phone}</label>
          <input id="sc-phone" name="phone" type="tel" placeholder={labels.placeholder_phone} className={inputClass} />
        </div>
        <div>
          <label htmlFor="sc-subdomain" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.subdomain_wish}</label>
          <div className="flex items-stretch">
            <input id="sc-subdomain" name="subdomain_wish" type="text" placeholder={labels.placeholder_subdomain}
              className={`${inputClass} rounded-r-none`} pattern="[a-z0-9-]{2,40}" />
            <span className="px-3 flex items-center border border-l-0 border-[var(--border)] rounded-r-lg text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]">
              {labels.subdomain_suffix}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="sc-timeline" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.timeline}</label>
        <input id="sc-timeline" name="timeline" type="text" placeholder={labels.placeholder_timeline} className={inputClass} />
      </div>

      <div>
        <label htmlFor="sc-message" className="block text-sm text-[var(--text-secondary)] mb-2">{labels.message}</label>
        <textarea id="sc-message" name="message" rows={5} placeholder={labels.placeholder_message}
          className={`${inputClass} resize-y min-h-[120px]`} />
      </div>

      {hasConfig && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-xs text-[var(--text-muted)]">
          <div className="font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            {labels.current_config}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {config.template && <span>Template: <code className="text-[var(--text-primary)]">{config.template}</code></span>}
            {config.animation && <span>Animation: <code className="text-[var(--text-primary)]">{config.animation}</code></span>}
            {config.scene && <span>Scene: <code className="text-[var(--text-primary)]">{config.scene}</code></span>}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <input type="checkbox" id="sc-gdpr" name="gdpr_consent" required
          className="mt-1 accent-[var(--accent)]" onChange={() => setGdprError(false)} />
        <label htmlFor="sc-gdpr" className="text-xs text-[var(--text-muted)] leading-relaxed">
          {labels.gdpr_consent}{' '}
          <a href="https://art.florenceegi.com/legal/privacy" target="_blank" rel="noopener noreferrer"
             className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">
            {labels.gdpr_privacy_policy}
          </a>
        </label>
      </div>
      {gdprError && (
        <p role="alert" className="text-red-400 text-xs">{labels.gdpr_consent_required}</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="w-full px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded font-medium">
        {status === 'sending' ? labels.sending : labels.send}
      </button>

      {status === 'success' && <p role="alert" aria-live="polite" className="text-green-400 text-sm text-center">{labels.success}</p>}
      {status === 'error' && <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center">{labels.error}</p>}
      {status === 'rate_limit' && <p role="alert" aria-live="polite" className="text-yellow-400 text-sm text-center">{labels.rate_limit}</p>}
    </form>
  );
}
