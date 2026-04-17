/**
 * @package CREATOR-STAGING — JSON-LD Generators
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.1.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose schema.org structured data for SEO — dynamic artist name from env + 7 locales inLanguage
 */

import type { EgiArtwork } from '@/lib/egi/client';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://creator-staging.florenceegi.com';
const ARTIST_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Artist';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ARTIST_NAME,
    url: SITE_URL,
    sameAs: [
      'https://art.florenceegi.com',
    ],
    jobTitle: 'Artist',
    worksFor: {
      '@type': 'Organization',
      name: 'FlorenceEGI',
      url: 'https://florenceegi.com',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ARTIST_NAME,
    url: SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'FlorenceEGI',
      url: 'https://florenceegi.com',
    },
    inLanguage: ['it', 'en', 'fr', 'de', 'es', 'pt', 'zh'],
  };
}

export function artworkJsonLd(artwork: EgiArtwork, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    description: artwork.description || undefined,
    image: artwork.original_image_url || artwork.main_image_url || undefined,
    url: `${SITE_URL}/${locale}/works/${artwork.id}`,
    creator: {
      '@type': 'Person',
      name: artwork.creator?.display_name || ARTIST_NAME,
    },
    isPartOf: artwork.collection
      ? {
          '@type': 'CollectionPage',
          name: artwork.collection.name,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: artwork.url,
      seller: {
        '@type': 'Organization',
        name: 'FlorenceEGI',
        url: 'https://art.florenceegi.com',
      },
    },
  };
}

export function collectionPageJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Works — ${ARTIST_NAME}`,
    url: `${SITE_URL}/${locale}/works`,
    creator: {
      '@type': 'Person',
      name: ARTIST_NAME,
    },
  };
}
