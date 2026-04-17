/**
 * @package CREATOR-STAGING — Newsletter Signup
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Newsletter subscription form — 2 variants (inline/block), mock backend pending M-061
 */

'use client';

import { useEffect, useRef, useState } from 'react';

type Labels = {
  heading?: string;
  description?: string;
  email_placeholder: string;
  submit: string;
  success: string;
  error_generic: string;
  error_email: string;
  privacy_note: string;
};

type Props = {
  variant?: 'inline' | 'block';
  labels: Labels;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup({ variant = 'block', labels }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;

    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value;

    // Silent success for bots
    if (honeypot) {
      setStatus('success');
      setEmail('');
      return;
    }

    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg(labels.error_email);
      setStatus('error');
      return;
    }

    setErrorMsg(null);
    setStatus('loading');

    try {
      // TODO M-061: replace mock submit with real API call to /api/newsletter/subscribe
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStatus('success');
      setEmail('');

      successTimer.current = setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (err) {
      // UEM-lite: dev warn, user-facing generic message
      console.warn('[NewsletterSignup] submit failed', err);
      setErrorMsg(labels.error_generic);
      setStatus('error');
    }
  }

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const emailInvalid = isError && !!errorMsg;

  const inputBase =
    'w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-colors disabled:opacity-60';

  const buttonBase =
    'bg-[var(--accent)] text-[var(--bg)] uppercase tracking-widest hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60';

  const Honeypot = (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <label htmlFor="newsletter-website">Website</label>
      <input type="text" id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );

  const StatusMessage = (
    <div aria-live="polite" role="status" className="min-h-[1.25rem]">
      {isSuccess && (
        <p className="flex items-center gap-2 text-green-400 text-sm">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
          </svg>
          {labels.success}
        </p>
      )}
      {isError && errorMsg && (
        <p className="text-red-400 text-sm" id="newsletter-error">
          {errorMsg}
        </p>
      )}
    </div>
  );

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        {Honeypot}
        <label htmlFor="newsletter-email-inline" className="sr-only">
          {labels.email_placeholder}
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="newsletter-email-inline"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (isError) setStatus('idle');
            }}
            placeholder={labels.email_placeholder}
            disabled={isLoading}
            aria-invalid={emailInvalid}
            aria-describedby="newsletter-privacy-inline newsletter-error"
            className={`${inputBase} px-4 py-2.5 text-sm flex-1`}
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className={`${buttonBase} px-5 py-2.5 text-xs inline-flex items-center justify-center gap-2 whitespace-nowrap`}
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <>
                {labels.submit}
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
        <p id="newsletter-privacy-inline" className="mt-2 text-[0.7rem] text-[var(--text-muted)] leading-snug">
          {labels.privacy_note}
        </p>
        <div className="mt-1">{StatusMessage}</div>
      </form>
    );
  }

  // block variant
  return (
    <section className="w-full max-w-xl">
      {labels.heading && (
        <h3 className="text-xl sm:text-2xl text-[var(--text-primary)] font-medium mb-2">
          {labels.heading}
        </h3>
      )}
      {labels.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
          {labels.description}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {Honeypot}
        <label htmlFor="newsletter-email-block" className="sr-only">
          {labels.email_placeholder}
        </label>
        <input
          id="newsletter-email-block"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isError) setStatus('idle');
          }}
          placeholder={labels.email_placeholder}
          disabled={isLoading}
          aria-invalid={emailInvalid}
          aria-describedby="newsletter-privacy-block newsletter-error"
          className={`${inputBase} px-4 py-3 text-base`}
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`${buttonBase} w-full px-6 py-3 text-sm inline-flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span className="sr-only">{labels.submit}</span>
            </>
          ) : (
            labels.submit
          )}
        </button>
        <p id="newsletter-privacy-block" className="text-xs text-[var(--text-muted)] leading-relaxed">
          {labels.privacy_note}
        </p>
        {StatusMessage}
      </form>
    </section>
  );
}
