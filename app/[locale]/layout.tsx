/**
 * @package CREATOR-STAGING — Locale Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
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
import { ConfigPanel } from '@/components/configurator/ConfigPanel';
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

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Creator Staging';

  return {
    title: {
      default: t('title'),
      template: `%s — ${siteName}`,
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
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
  const tCfg = await getTranslations({ locale, namespace: 'configurator' });

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
      <ConfigPanel
        locale={locale}
        labels={{
          toggle: tCfg('toggle'),
          tab_template: tCfg('tab_template'),
          tab_animation: tCfg('tab_animation'),
          tab_3d: tCfg('tab_3d'),
          tab_site: tCfg('tab_site'),
          tpl_01: tCfg('tpl_01'), tpl_02: tCfg('tpl_02'), tpl_03: tCfg('tpl_03'),
          tpl_04: tCfg('tpl_04'), tpl_05: tCfg('tpl_05'), tpl_06: tCfg('tpl_06'),
          anim_minimal: tCfg('anim_minimal'), anim_cinematic: tCfg('anim_cinematic'),
          anim_energetic: tCfg('anim_energetic'), anim_editorial: tCfg('anim_editorial'),
          anim_fluid: tCfg('anim_fluid'), anim_none: tCfg('anim_none'),
          scene_particles: tCfg('scene_particles'), scene_morph_sphere: tCfg('scene_morph_sphere'),
          scene_wave_grid: tCfg('scene_wave_grid'), scene_floating_gallery: tCfg('scene_floating_gallery'),
          scene_ribbon_flow: tCfg('scene_ribbon_flow'), scene_crystal: tCfg('scene_crystal'),
          scene_noise_terrain: tCfg('scene_noise_terrain'), scene_aurora: tCfg('scene_aurora'),
          scene_dot_sphere: tCfg('scene_dot_sphere'), scene_smoke: tCfg('scene_smoke'),
          scene_none: tCfg('scene_none'),
          subdomain_title: tCfg('subdomain_title'),
          subdomain_placeholder: tCfg('subdomain_placeholder'),
          subdomain_suffix: tCfg('subdomain_suffix'),
          subdomain_checking: tCfg('subdomain_checking'),
          subdomain_available: tCfg('subdomain_available'),
          subdomain_taken: tCfg('subdomain_taken'),
          commission_title: tCfg('commission_title'),
          commission_description: tCfg('commission_description'),
          commission_button: tCfg('commission_button'),
          current_combo: '',
        }}
      />
      <Navigation locale={locale} />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer locale={locale} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.FEAnalyticsConfig=${JSON.stringify({
            siteId: process.env.NEXT_PUBLIC_FE_ANALYTICS_SITE_ID || 'creator-staging',
            endpoint: process.env.NEXT_PUBLIC_FE_ANALYTICS_ENDPOINT || 'https://hub.florenceegi.com/api/analytics/collect',
            requireConsent: false,
          })};`,
        }}
      />
      <script
        src="https://hub.florenceegi.com/build/tracker/analytics-tracker.js"
        defer
      />
    </LenisProvider>
  );
}
