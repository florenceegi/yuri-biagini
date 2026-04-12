/**
 * @package YURI-BIAGINI — HeroWrapper
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Client component wrapper for dynamic Three.js hero (ssr:false requires client boundary)
 */

'use client';

import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[var(--bg)]" />
  ),
});

export function HeroWrapper() {
  return <HeroScene />;
}
