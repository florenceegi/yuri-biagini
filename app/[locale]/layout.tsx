/**
 * @package YURI-BIAGINI — Locale Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Locale-aware layout with navigation, footer, skip-to-content, FEAnalytics
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { LenisProvider } from '@/components/layout/LenisProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { PageTransition } from '@/components/layout/PageTransition';
import { VariantSwitcher } from '@/components/ui/VariantSwitcher';
import { personJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      default: t('title'),
      template: `%s — Yuri Biagini`,
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`,
      siteName: 'Yuri Biagini',
    },
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <LenisProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <a href="#main-content" className="skip-to-content">
        {t('skip_to_content')}
      </a>
      <CustomCursor />
      <VariantSwitcher />
      <Navigation locale={locale} />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer locale={locale} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.FEAnalyticsConfig={siteId:'yuri-biagini',endpoint:'https://hub.florenceegi.com/api/analytics/collect',requireConsent:false};`,
        }}
      />
      <script
        src="https://hub.florenceegi.com/build/tracker/analytics-tracker.js"
        defer
      />
    </LenisProvider>
  );
}
