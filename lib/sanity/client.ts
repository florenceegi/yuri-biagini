/**
 * @package YURI-BIAGINI — Sanity Client
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Sanity CMS client + GROQ queries for artist bio, exhibitions, press
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function sanityImageUrl(source: unknown) {
  return builder.image(source);
}

/** Check if Sanity is configured (project ID set) */
export function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}

// ── GROQ Queries ──────────────────────────────────────────────

export async function getArtistProfile(locale: string) {
  if (!isSanityConfigured()) return null;

  return sanityClient.fetch(
    `*[_type == "artistProfile"][0]{
      name,
      "bio": bio.${locale},
      "bio_short": bio_short.${locale},
      portrait,
      timeline[]{
        year,
        "event": event.${locale}
      },
      cv_pdf,
      social,
      studio_address,
      represented_by,
      logo
    }`
  );
}

export async function getExhibitions(locale: string) {
  if (!isSanityConfigured()) return [];

  return sanityClient.fetch(
    `*[_type == "exhibition"] | order(date_start desc) {
      _id,
      "title": title.${locale},
      venue,
      city,
      country,
      date_start,
      date_end,
      type,
      images,
      press_release,
      slug
    }`
  );
}

export async function getPressItems() {
  if (!isSanityConfigured()) return [];

  return sanityClient.fetch(
    `*[_type == "pressItem"] | order(date desc) {
      _id,
      outlet,
      outlet_logo,
      headline,
      date,
      url,
      pdf,
      featured
    }`
  );
}

export async function getSeries(locale: string) {
  if (!isSanityConfigured()) return [];

  return sanityClient.fetch(
    `*[_type == "series"] | order(order asc) {
      _id,
      "title": title.${locale},
      slug,
      heroImage,
      heroVideo,
      "curatorial": curatorial.${locale},
      year_start,
      year_end,
      order
    }`
  );
}
