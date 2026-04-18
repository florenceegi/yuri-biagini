/**
 * @package CREATOR-STAGING — Navigation
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.1.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Server component — primary funnel + secondary "Discover" dropdown (7 narrative pages)
 */

import { getTranslations } from 'next-intl/server';
import { NavigationClient } from './NavigationClient';
import type { UtilityLabels } from './NavigationUtility';

type Props = {
  locale: string;
};

export async function Navigation({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tA11y = await getTranslations({ locale, namespace: 'a11y' });
  const tCfg = await getTranslations({ locale, namespace: 'configurator' });

  // Primary = funnel emotivo (visitor-centric): opere → colleziona → commissiona
  const primaryLinks = [
    { href: `/${locale}/works`, label: t('works') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/collect`, label: t('collect') },
    { href: `/${locale}/commission`, label: t('commission') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  // Secondary = narrative deep dive (dropdown "Discover"): 7 pagine narrative
  const secondaryLinks = [
    { href: `/${locale}/story-behind`, label: t('story_behind') },
    { href: `/${locale}/process`, label: t('process') },
    { href: `/${locale}/journal`, label: t('journal') },
    { href: `/${locale}/live`, label: t('live') },
    { href: `/${locale}/exhibitions`, label: t('exhibitions') },
    { href: `/${locale}/press`, label: t('press') },
    { href: `/${locale}/cv`, label: t('cv') },
  ];

  // PreferencesMenu labels (namespace: configurator — F2.2.1 will batch-add missing keys).
  // next-intl returns the key name as fallback when a key is missing, so this is safe now.
  const utilityLabels: UtilityLabels = {
    search: t('search'),
    wishlist: t('wishlist'),
    ai_companion: t('ai_companion'),
    prefs: {
      preferences: tCfg('preferences'),
      theme: tCfg('theme'),
      theme_dark: tCfg('theme_dark'),
      theme_light: tCfg('theme_light'),
      theme_ambient: tCfg('theme_ambient'),
      theme_auto: tCfg('theme_auto'),
      language: tCfg('language'),
      accessibility: tCfg('accessibility'),
      a11y_high_contrast: tCfg('a11y_high_contrast'),
      a11y_dyslexia: tCfg('a11y_dyslexia'),
      a11y_reduced_motion: tCfg('a11y_reduced_motion'),
      current_slot: tCfg('current_slot'),
      close: tCfg('close'),
    },
  };

  return (
    <NavigationClient
      primaryLinks={primaryLinks}
      secondaryLinks={secondaryLinks}
      locale={locale}
      artistName={process.env.NEXT_PUBLIC_SITE_NAME || 'Creator Staging'}
      openMenuLabel={tA11y('open_menu')}
      closeMenuLabel={tA11y('close_menu')}
      changeLangLabel={tA11y('change_language')}
      moreLabel={t('discover')}
      utilityLabels={utilityLabels}
    />
  );
}
