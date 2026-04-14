/**
 * @package YURI-BIAGINI — HeroAnimated
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Wraps any hero with entrance animation from active preset
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useAnimation } from '@/lib/hooks/useAnimation';

type Props = {
  children: ReactNode;
};

export function HeroAnimated({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const anim = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current || anim.id === 'none') return;

    const el = ref.current;
    gsap.fromTo(el, anim.hero.from, anim.hero.to);

    return () => {
      gsap.killTweensOf(el);
    };
  }, [prefersReducedMotion, anim]);

  return <div ref={ref}>{children}</div>;
}
