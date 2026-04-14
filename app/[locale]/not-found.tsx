/**
 * @package CREATOR-STAGING — 404 Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Custom 404 page with link back to works
 */

import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations({ namespace: 'errors' });

  return (
    <section className="py-32 px-6 max-w-2xl mx-auto text-center">
      <h1 className="font-[family-name:var(--font-serif)] text-8xl md:text-9xl font-light text-[var(--accent)] mb-8">
        404
      </h1>
      <p className="text-xl text-[var(--text-secondary)] mb-4">
        {t('not_found_title')}
      </p>
      <p className="text-[var(--text-muted)] mb-12">
        {t('not_found_description')}
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
      >
        {t('not_found_cta')}
      </a>
    </section>
  );
}
