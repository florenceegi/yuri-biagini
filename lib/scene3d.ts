/**
 * @package YURI-BIAGINI — 3D Scene System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose 3D scene selection — cookie > env > default. Independent from template.
 */

import { cookies } from 'next/headers';

export type SceneId = 'particles' | 'morph-sphere' | 'wave-grid' | 'floating-gallery' | 'ribbon-flow' | 'crystal' | 'noise-terrain' | 'aurora' | 'dot-sphere' | 'smoke' | 'none';

export const SCENE_NAMES: Record<SceneId, string> = {
  particles: 'Particle Field',
  'morph-sphere': 'Morphing Sphere',
  'wave-grid': 'Wave Grid',
  'floating-gallery': 'Floating Gallery',
  'ribbon-flow': 'Ribbon Flow',
  crystal: 'Crystal',
  'noise-terrain': 'Noise Terrain',
  aurora: 'Aurora',
  'dot-sphere': 'Dot Sphere',
  smoke: 'Smoke',
  none: 'No 3D',
};

const VALID: Set<string> = new Set(Object.keys(SCENE_NAMES));

export async function getScene(): Promise<SceneId> {
  try {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get('scene3d')?.value;
    if (fromCookie && VALID.has(fromCookie)) return fromCookie as SceneId;
  } catch {
    // fall through
  }

  const fromEnv = process.env.NEXT_PUBLIC_SCENE;
  if (fromEnv && VALID.has(fromEnv)) return fromEnv as SceneId;

  return 'particles';
}
