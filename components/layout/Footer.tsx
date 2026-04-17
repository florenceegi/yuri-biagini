/**
 * @package CREATOR-STAGING — Footer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.1 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose World-class 5-col footer + lso-ecosystem + newsletter + legal microrow.
 *          JSX augmentation per <lso-ecosystem> spostata in types/web-components.d.ts.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { NewsletterSignup } from './NewsletterSignup';
import { FooterAccordion } from './FooterAccordion';

type Props = {
  locale: string;
};

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
  todo?: boolean;
};

// ------------------------------------------------------------------
// Social icons (inline SVG, no deps, no emoji)
// ------------------------------------------------------------------

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true as const,
};

const SocialIcons = {
  instagram: (
    <svg {...iconProps}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 01-1.38-.9 3.71 3.71 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.14 0-3.51.01-4.75.07-.98.05-1.51.21-1.86.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.34 1.86-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.04.98.2 1.51.34 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.86.34 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.98-.05 1.51-.21 1.86-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.34-1.86.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75a5.14 5.14 0 00-.34-1.86 3.1 3.1 0 00-.75-1.15 3.1 3.1 0 00-1.15-.75c-.35-.14-.88-.3-1.86-.34-1.24-.06-1.61-.07-4.75-.07zm0 2.76a5.46 5.46 0 110 10.92 5.46 5.46 0 010-10.92zm0 1.62a3.84 3.84 0 100 7.68 3.84 3.84 0 000-7.68zm5.65-2.87a1.27 1.27 0 110 2.55 1.27 1.27 0 010-2.55z" />
    </svg>
  ),
  linkedin: (
    <svg {...iconProps}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.33V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.37 4.28 5.46zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  youtube: (
    <svg {...iconProps}>
      <path d="M23.5 6.2a3 3 0 00-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 00.5 6.2C0 8.12 0 12 0 12s0 3.88.5 5.8a3 3 0 002.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 002.11-2.13c.5-1.92.5-5.8.5-5.8s0-3.88-.5-5.8zM9.6 15.6V8.4L15.82 12 9.6 15.6z" />
    </svg>
  ),
  x: (
    <svg {...iconProps}>
      <path d="M18.9 2H22l-7.5 8.58L23.4 22h-7.05l-5.52-7.23L4.47 22H1.37l8.03-9.18L.9 2H8.1l5 6.6L18.9 2zm-1.23 18.05h1.72L6.46 3.85H4.6L17.67 20.05z" />
    </svg>
  ),
};

// ------------------------------------------------------------------
// Main Footer
// ------------------------------------------------------------------

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const year = new Date().getFullYear();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'FlorenceEGI';
  const legalBase = 'https://art.florenceegi.com/legal';

  // Link groups -----------------------------------------------------
  const exploreLinks: LinkItem[] = [
    { label: t('works'), href: `/${locale}/works` },
    { label: t('collections_link'), href: `/${locale}/collections` },
    { label: t('exhibitions'), href: `/${locale}/exhibitions` },
    { label: t('press_link'), href: `/${locale}/press` },
    { label: t('cv_link'), href: `/${locale}/cv` },
  ];

  const collectLinks: LinkItem[] = [
    { label: t('available_now'), href: `/${locale}/available-now`, todo: true },
    { label: t('commission'), href: `/${locale}/commission`, todo: true },
    { label: t('certificates'), href: `/${locale}/certificates`, todo: true },
    { label: t('shipping'), href: `/${locale}/shipping`, todo: true },
  ];

  const aboutLinks: LinkItem[] = [
    { label: t('story'), href: `/${locale}/story`, todo: true },
    { label: t('process'), href: `/${locale}/process`, todo: true },
    { label: t('journal'), href: `/${locale}/journal`, todo: true },
    { label: t('studio'), href: `/${locale}/studio`, todo: true },
  ];

  const legalLinks: LinkItem[] = [
    { label: t('privacy'), href: `${legalBase}/collector`, external: true },
    { label: t('cookies'), href: `${legalBase}/collector`, external: true },
    { label: t('terms'), href: `${legalBase}/collector`, external: true },
    {
      label: t('accessibility_statement'),
      href: `/${locale}/accessibility-statement`,
      todo: true,
    },
    { label: t('gdpr_rights'), href: `/${locale}/gdpr`, todo: true },
  ];

  const socials = [
    { name: t('social_instagram'), icon: SocialIcons.instagram, href: '#' },
    { name: t('social_linkedin'), icon: SocialIcons.linkedin, href: '#' },
    { name: t('social_youtube'), icon: SocialIcons.youtube, href: '#' },
    { name: t('social_x'), icon: SocialIcons.x, href: '#' },
  ];

  // ----------------------------------------------------------------
  // Link renderer
  // ----------------------------------------------------------------
  const renderLink = (item: LinkItem) => {
    const className =
      'text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] rounded-sm';

    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link href={item.href} className={className}>
        {item.label}
        {/* TODO: page to be created in FASE 6 */}
      </Link>
    );
  };

  const renderColumn = (
    id: string,
    ariaLabel: string,
    label: string,
    items: LinkItem[],
    extra?: ReactNode,
  ) => (
    <FooterAccordion
      label={label}
      expandLabel={t('mobile_expand')}
      collapseLabel={t('mobile_collapse')}
    >
      <nav aria-label={ariaLabel} id={id}>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={`${id}-${item.label}`}>{renderLink(item)}</li>
          ))}
        </ul>
        {extra}
      </nav>
    </FooterAccordion>
  );

  // ----------------------------------------------------------------
  // Connect column extras (newsletter, social, language)
  // ----------------------------------------------------------------
  const connectExtra = (
    <div className="mt-6 flex flex-col gap-6">
      {/* Newsletter */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
          {t('newsletter_heading')}
        </p>
        <NewsletterSignup
          variant="inline"
          labels={{
            email_placeholder: t('newsletter_email_placeholder'),
            submit: t('newsletter_submit'),
            success: t('newsletter_success'),
            error_generic: t('newsletter_error'),
            error_email: t('newsletter_error_email'),
            privacy_note: t('newsletter_privacy_note'),
          }}
        />
      </div>

      {/* Social */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
          {t('social')}
        </p>
        <ul className="flex items-center gap-4">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)]"
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <footer
      role="contentinfo"
      className="relative border-t border-[var(--border)] bg-[var(--bg-surface)]"
    >
      {/* LSO Ecosystem Web Component — script loaded in layout.tsx (F2.5) */}
      <lso-ecosystem current="creator-staging" />

      {/* Columns */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-0 md:gap-y-10">
          {renderColumn(
            'footer-col-explore',
            t('col_explore_label'),
            t('explore'),
            exploreLinks,
          )}
          {renderColumn(
            'footer-col-collect',
            t('col_collect_label'),
            t('collect'),
            collectLinks,
          )}
          {renderColumn(
            'footer-col-connect',
            t('col_connect_label'),
            t('connect'),
            [{ label: t('contact_link'), href: `/${locale}/contact` }],
            connectExtra,
          )}
          {renderColumn(
            'footer-col-about',
            t('col_about_label'),
            t('about'),
            aboutLinks,
          )}
          {renderColumn(
            'footer-col-legal',
            t('col_legal_label'),
            t('legal'),
            legalLinks,
          )}
        </div>
      </div>

      {/* Legal microrow */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <p>
            &copy; {year} {siteName}
          </p>
          <p className="flex items-center gap-2">
            <a
              href="https://art.florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] rounded-sm"
            >
              {t('powered_by')}
            </a>
            <span aria-hidden="true">·</span>
            <span>{t('made_in_italy')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
