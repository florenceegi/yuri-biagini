/**
 * @package CREATOR-STAGING — EGI API Client
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-10
 * @purpose Read-only client for EGI public API — artworks, artist profile, collections
 */

const EGI_API_URL =
  process.env.NEXT_PUBLIC_EGI_API_URL || 'https://art.florenceegi.com/api';

const DEFAULT_ARTIST_ID = process.env.NEXT_PUBLIC_ARTIST_ID || '';

/** Resolve artist ID: explicit param > env var. Throws if neither available. */
function resolveArtistId(artistId?: number | string): string {
  const id = artistId?.toString() || DEFAULT_ARTIST_ID;
  if (!id) throw new Error('No artist ID available — set NEXT_PUBLIC_ARTIST_ID or pass artistId');
  return id;
}

export interface EgiArtwork {
  id: number;
  title: string;
  description: string | null;
  year: number | null;
  main_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  thumbnail_image_url: string | null;
  original_image_url: string | null;
  blurhash: string | null;
  is_published: boolean;
  collection: {
    id: number;
    name: string;
  } | null;
  creator: {
    id: number;
    display_name: string;
  } | null;
  url: string;
}

export interface EgiArtistProfile {
  id: number;
  display_name: string;
  avatar_url: string | null;
  language: string | null;
  collections_count: number;
  artworks_count: number;
  profile_url: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

async function egiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${EGI_API_URL}${path}`, {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`EGI API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'EGI API returned success: false');
  }

  return json;
}

export async function getArtistProfile(artistId?: number | string): Promise<EgiArtistProfile> {
  const id = resolveArtistId(artistId);
  const res = await egiGet<{ success: boolean; data: EgiArtistProfile }>(
    `/public/artists/${id}`
  );
  return res.data;
}

export async function getArtistArtworks(
  page = 1,
  perPage = 24,
  collectionId?: number,
  artistId?: number | string
): Promise<{ data: EgiArtwork[]; meta: PaginationMeta }> {
  const id = resolveArtistId(artistId);
  let path = `/public/artists/${id}/artworks?page=${page}&per_page=${perPage}`;
  if (collectionId) {
    path += `&collection_id=${collectionId}`;
  }
  const res = await egiGet<{
    success: boolean;
    data: EgiArtwork[];
    meta: PaginationMeta;
  }>(path);
  return { data: res.data, meta: res.meta };
}

export interface EgiCollection {
  id: number;
  name: string;
  description: string | null;
  type: string;
  image_banner: string | null;
  image_card: string | null;
  creator: { id: number; display_name: string } | null;
  artworks: EgiArtwork[];
  artworks_meta: PaginationMeta;
  url: string;
}

export interface EgiBiography {
  title: string;
  content: string;
  excerpt: string | null;
}

export interface EgiTimelineItem {
  id: number;
  title: string;
  content_preview: string | null;
  date_from: string | null;
  date_to: string | null;
  is_ongoing: boolean;
  chapter_type: 'standard' | 'milestone' | 'achievement';
  date_range_display: string;
  duration_formatted: string;
  icon: string;
}

export interface EgiTimelineResponse {
  artist?: { display_name: string | null; avatar_url: string | null };
  biography: EgiBiography | null;
  chapters: EgiTimelineItem[];
}

export async function getArtistTimeline(artistId?: number | string): Promise<EgiTimelineResponse> {
  const id = resolveArtistId(artistId);
  const res = await egiGet<{
    success: boolean;
    data: EgiTimelineResponse | EgiTimelineItem[];
  }>(`/public/artists/${id}/timeline`);

  // Handle both old format (array) and new format (object with biography+chapters)
  if (Array.isArray(res.data)) {
    return { biography: null, chapters: res.data };
  }
  return res.data;
}

export async function getCollection(id: number): Promise<EgiCollection> {
  const res = await egiGet<{ success: boolean; data: EgiCollection }>(
    `/public/collections/${id}`
  );
  return res.data;
}
