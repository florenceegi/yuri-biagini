/**
 * @package YURI-BIAGINI — Variant System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Template variant detection — cookie > env > default. Switcher reads cookie.
 */

import { cookies } from 'next/headers';

export type VariantId = '01' | '02' | '03' | '04' | '05' | '06';

export const VARIANT_NAMES: Record<VariantId, string> = {
  '01': 'Galeria Oscura',
  '02': 'Canvas Vivo',
  '03': 'Immersive 3D',
  '04': 'Scrollytelling',
  '05': 'Magazine Art',
  '06': 'Brutalist Statement',
};

const VALID: Set<string> = new Set(['01', '02', '03', '04', '05', '06']);

export async function getVariant(): Promise<VariantId> {
  // 1. Cookie (set by /api/variant or by switcher)
  try {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get('variant')?.value;
    if (fromCookie && VALID.has(fromCookie)) return fromCookie as VariantId;
  } catch {
    // cookies() not available in edge/build — fall through
  }

  // 2. Env variable
  const fromEnv = process.env.NEXT_PUBLIC_VARIANT;
  if (fromEnv && VALID.has(fromEnv)) return fromEnv as VariantId;

  // 3. Default
  return '03';
}
