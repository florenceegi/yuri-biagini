/**
 * @package YURI-BIAGINI — Scene3DSwitch
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Dynamic loader for the active 3D scene — lazy loaded per scene type
 */

'use client';

import dynamic from 'next/dynamic';
import { useScene, type SceneId } from '@/lib/hooks/useScene';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const scenes: Record<Exclude<SceneId, 'none'>, ReturnType<typeof dynamic>> = {
  particles: dynamic(() => import('@/components/three/HeroScene'), { ssr: false, loading: () => <Placeholder /> }),
  'morph-sphere': dynamic(() => import('@/components/three/scenes/MorphSphere'), { ssr: false, loading: () => <Placeholder /> }),
  'wave-grid': dynamic(() => import('@/components/three/scenes/WaveGrid'), { ssr: false, loading: () => <Placeholder /> }),
  'floating-gallery': dynamic(() => import('@/components/three/scenes/FloatingGallery'), { ssr: false, loading: () => <Placeholder /> }),
  'ribbon-flow': dynamic(() => import('@/components/three/scenes/RibbonFlow'), { ssr: false, loading: () => <Placeholder /> }),
  crystal: dynamic(() => import('@/components/three/scenes/Crystal'), { ssr: false, loading: () => <Placeholder /> }),
  'noise-terrain': dynamic(() => import('@/components/three/scenes/NoiseTerrain'), { ssr: false, loading: () => <Placeholder /> }),
  aurora: dynamic(() => import('@/components/three/scenes/Aurora'), { ssr: false, loading: () => <Placeholder /> }),
  'dot-sphere': dynamic(() => import('@/components/three/scenes/DotSphere'), { ssr: false, loading: () => <Placeholder /> }),
  smoke: dynamic(() => import('@/components/three/scenes/Smoke'), { ssr: false, loading: () => <Placeholder /> }),
};

function Placeholder() {
  return <div className="absolute inset-0 bg-[var(--bg)]" />;
}

export function Scene3DSwitch() {
  const sceneId = useScene();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || sceneId === 'none') {
    return <div className="absolute inset-0 bg-[var(--bg)]" />;
  }

  const SceneComponent = scenes[sceneId];
  if (!SceneComponent) return <Placeholder />;

  return <SceneComponent />;
}
