/**
 * @package YURI-BIAGINI — Animation Preset System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Animation presets independent from template — any combo works
 */

import { cookies } from 'next/headers';

export type AnimationId = 'minimal' | 'cinematic' | 'energetic' | 'editorial' | 'fluid' | 'none';

export const ANIMATION_NAMES: Record<AnimationId, string> = {
  minimal: 'Minimal',
  cinematic: 'Cinematic',
  energetic: 'Energetic',
  editorial: 'Editorial',
  fluid: 'Fluid',
  none: 'No Animation',
};

export const ANIMATION_DESCRIPTIONS: Record<AnimationId, string> = {
  minimal: 'Subtle fades, clean entrances',
  cinematic: 'Slow reveals, parallax, curtain effects',
  energetic: 'Bouncy, fast stagger, scale pops',
  editorial: 'Clip-path reveals, text masks, geometric',
  fluid: 'Smooth morphs, wave staggers, soft easing',
  none: 'Zero animations, instant display',
};

const VALID: Set<string> = new Set(['minimal', 'cinematic', 'energetic', 'editorial', 'fluid', 'none']);

export async function getAnimation(): Promise<AnimationId> {
  try {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get('animation')?.value;
    if (fromCookie && VALID.has(fromCookie)) return fromCookie as AnimationId;
  } catch {
    // fall through
  }

  const fromEnv = process.env.NEXT_PUBLIC_ANIMATION;
  if (fromEnv && VALID.has(fromEnv)) return fromEnv as AnimationId;

  return 'cinematic';
}
