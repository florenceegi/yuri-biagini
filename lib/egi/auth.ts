/**
 * @package CREATOR-STAGING — EGI Auth Client
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Sanctum cookie auth — fetch authenticated creator from EGI API
 */

const EGI_BASE_URL =
  process.env.NEXT_PUBLIC_EGI_API_URL?.replace('/api', '') ||
  'https://art.florenceegi.com';

export interface AuthCreator {
  id: number;
  display_name: string;
  nick_name: string | null;
  email: string;
  avatar_url: string | null;
  language: string | null;
  collections_count: number;
  artworks_count: number;
}

/**
 * Fetch the authenticated creator from EGI via Sanctum cookie.
 * Must be called client-side (browser has the .florenceegi.com cookie).
 * Returns null if not authenticated.
 */
export async function getAuthenticatedCreator(): Promise<AuthCreator | null> {
  try {
    const res = await fetch(`${EGI_BASE_URL}/api/user`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;

    const user = await res.json();
    if (!user?.id) return null;

    return {
      id: user.id,
      display_name: user.display_name || user.name || '',
      nick_name: user.nick_name || null,
      email: user.email || '',
      avatar_url: user.profile_photo_url || null,
      language: user.language || null,
      collections_count: user.collections_count ?? 0,
      artworks_count: user.artworks_count ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Initialize Sanctum CSRF cookie (required before first authenticated request).
 */
export async function initSanctumCsrf(): Promise<void> {
  try {
    await fetch(`${EGI_BASE_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });
  } catch {
    // Silent fail — auth will fail gracefully
  }
}
