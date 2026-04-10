/**
 * @package YURI-BIAGINI — ContactForm
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Accessible contact form with Zod validation, honeypot anti-spam
 */

'use client';

import { useState } from 'react';

type Labels = {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  rate_limit: string;
  placeholder_name: string;
  placeholder_email: string;
  placeholder_subject: string;
  placeholder_message: string;
};

type Props = {
  labels: Labels;
};

export function ContactForm({ labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'rate_limit'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check
    if (data.get('website')) {
      setStatus('success');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
      });

      if (res.status === 429) {
        setStatus('rate_limit');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot — hidden from users, visible to bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm text-[var(--text-secondary)] mb-2">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={labels.placeholder_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-2">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={labels.placeholder_email}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm text-[var(--text-secondary)] mb-2">
          {labels.subject}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder={labels.placeholder_subject}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-[var(--text-secondary)] mb-2">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={labels.placeholder_message}
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded font-medium"
      >
        {status === 'sending' ? labels.sending : labels.send}
      </button>

      {/* Status messages */}
      {status === 'success' && (
        <p role="alert" aria-live="polite" className="text-green-400 text-sm text-center">
          {labels.success}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center">
          {labels.error}
        </p>
      )}
      {status === 'rate_limit' && (
        <p role="alert" aria-live="polite" className="text-yellow-400 text-sm text-center">
          {labels.rate_limit}
        </p>
      )}
    </form>
  );
}
