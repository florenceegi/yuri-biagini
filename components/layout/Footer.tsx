/**
 * @package CREATOR-STAGING — Footer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Site footer with legal links, ecosystem branding, LSO web component
 */

import { getTranslations } from 'next-intl/server';

type Props = {
  locale: string;
};

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' });

  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--border)] bg-[var(--bg-surface)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {year} {process.env.NEXT_PUBLIC_SITE_NAME || 'FlorenceEGI'}
          </p>

          {/* Center: legal links */}
          <nav aria-label="Legal" className="flex gap-6">
            <a
              href="https://art.florenceegi.com/legal/collector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {t('privacy')}
            </a>
            <a
              href="https://art.florenceegi.com/legal/collector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {t('cookies')}
            </a>
            <a
              href="https://art.florenceegi.com/legal/collector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {t('terms')}
            </a>
          </nav>

          {/* Right: ecosystem branding */}
          <a
            href="https://art.florenceegi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            {t('powered_by')}
          </a>
        </div>
      </div>
    </footer>
  );
}
