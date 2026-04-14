/**
 * @package CREATOR-STAGING — CommissionForm
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-12
 * @purpose Commission request form with honeypot anti-spam — reuses contact API
 */

'use client';

import { useState } from 'react';

type Labels = {
  name: string;
  email: string;
  description: string;
  budget: string;
  timeline: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  rate_limit: string;
  placeholder_name: string;
  placeholder_email: string;
  placeholder_description: string;
  placeholder_budget: string;
  placeholder_timeline: string;
  gdpr_consent: string;
  gdpr_privacy_policy: string;
  gdpr_consent_required: string;
};

type Props = {
  labels: Labels;
};

export function CommissionForm({ labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'rate_limit'>('idle');
  const [gdprError, setGdprError] = useState(false);

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

    if (data.get('website')) {
      setStatus('success');
      return;
    }

    try {
      const res = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          description: data.get('description'),
          budget: data.get('budget'),
          timeline: data.get('timeline'),
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

  const inputClass =
    'w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="commission-website">Website</label>
        <input type="text" id="commission-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="commission-name" className="block text-sm text-[var(--text-secondary)] mb-2">
            {labels.name}
          </label>
          <input id="commission-name" name="name" type="text" required placeholder={labels.placeholder_name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="commission-email" className="block text-sm text-[var(--text-secondary)] mb-2">
            {labels.email}
          </label>
          <input id="commission-email" name="email" type="email" required placeholder={labels.placeholder_email} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="commission-description" className="block text-sm text-[var(--text-secondary)] mb-2">
          {labels.description}
        </label>
        <textarea
          id="commission-description"
          name="description"
          required
          rows={6}
          placeholder={labels.placeholder_description}
          className={`${inputClass} resize-y min-h-[150px]`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="commission-budget" className="block text-sm text-[var(--text-secondary)] mb-2">
            {labels.budget}
          </label>
          <input id="commission-budget" name="budget" type="text" placeholder={labels.placeholder_budget} className={inputClass} />
        </div>
        <div>
          <label htmlFor="commission-timeline" className="block text-sm text-[var(--text-secondary)] mb-2">
            {labels.timeline}
          </label>
          <input id="commission-timeline" name="timeline" type="text" placeholder={labels.placeholder_timeline} className={inputClass} />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="commission-gdpr"
          name="gdpr_consent"
          required
          className="mt-1 accent-[var(--accent)]"
          onChange={() => setGdprError(false)}
        />
        <label htmlFor="commission-gdpr" className="text-xs text-[var(--text-muted)] leading-relaxed">
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

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded font-medium"
      >
        {status === 'sending' ? labels.sending : labels.send}
      </button>

      {status === 'success' && (
        <p role="alert" aria-live="polite" className="text-green-400 text-sm text-center">{labels.success}</p>
      )}
      {status === 'error' && (
        <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center">{labels.error}</p>
      )}
      {status === 'rate_limit' && (
        <p role="alert" aria-live="polite" className="text-yellow-400 text-sm text-center">{labels.rate_limit}</p>
      )}
    </form>
  );
}
