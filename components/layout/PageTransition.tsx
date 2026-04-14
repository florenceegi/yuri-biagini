/**
 * @package YURI-BIAGINI — PageTransition
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Animated page transition — uses active animation preset
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useAnimation } from '@/lib/hooks/useAnimation';

type Props = {
  children: React.ReactNode;
};

export function PageTransition({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const anim = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || anim.id === 'none') return;

    const el = containerRef.current;
    gsap.fromTo(el, anim.pageTransition.from, anim.pageTransition.to);

    return () => {
      gsap.killTweensOf(el);
    };
  }, [pathname, prefersReducedMotion, anim]);

  return <div ref={containerRef}>{children}</div>;
}
