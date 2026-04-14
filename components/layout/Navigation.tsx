/**
 * @package CREATOR-STAGING — Navigation
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Responsive navigation bar with locale switcher and mobile drawer
 */

import { getTranslations } from 'next-intl/server';
import { NavigationClient } from './NavigationClient';

type Props = {
  locale: string;
};

export async function Navigation({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tA11y = await getTranslations({ locale, namespace: 'a11y' });

  const links = [
    { href: `/${locale}/works`, label: t('works') },
    { href: `/${locale}/collections`, label: t('collections') },
    { href: `/${locale}/collect`, label: t('collect') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/exhibitions`, label: t('exhibitions') },
    { href: `/${locale}/commission`, label: t('commission') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <NavigationClient
      links={links}
      locale={locale}
      artistName={process.env.NEXT_PUBLIC_SITE_NAME || 'Creator Staging'}
      openMenuLabel={tA11y('open_menu')}
      closeMenuLabel={tA11y('close_menu')}
      changeLangLabel={tA11y('change_language')}
    />
  );
}
