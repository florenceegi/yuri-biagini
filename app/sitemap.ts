/**
 * @package CREATOR-STAGING — sitemap.xml
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Dynamic sitemap with all localized pages for SEO
 */

import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://creator-staging.florenceegi.com';

  const staticPages = ['', '/works', '/about', '/exhibitions', '/press', '/contact'];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/works' ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${page}`])
          ),
        },
      });
    }
  }

  return entries;
}
