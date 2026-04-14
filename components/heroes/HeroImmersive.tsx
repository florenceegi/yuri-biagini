/**
 * @package YURI-BIAGINI — HeroImmersive (Template 03)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Fullscreen Three.js particle hero — template 03 Immersive 3D
 */

import { HeroWrapper } from '@/components/three/HeroWrapper';

type Props = {
  artistName: string;
  subtitle: string;
};

export function HeroImmersive({ artistName, subtitle }: Props) {
  return (
    <section aria-label="Hero" className="relative h-screen w-full overflow-hidden">
      <HeroWrapper />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl lg:text-9xl font-light tracking-wide text-[var(--text-primary)] text-center">
          {artistName}
        </h1>
        <p className="mt-4 text-sm md:text-base uppercase tracking-[0.3em] text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
