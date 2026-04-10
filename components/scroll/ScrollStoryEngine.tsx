/**
 * @package YURI-BIAGINI — ScrollStoryEngine
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose GSAP ScrollTrigger wrapper for scroll-driven animations — kills on unmount (R3)
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type Scene = {
  selector: string;
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  trigger?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
  };
};

type Props = {
  children: ReactNode;
  scenes: Scene[];
  className?: string;
};

export function ScrollStoryEngine({ children, scenes, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      scenes.forEach((scene) => {
        const elements = containerRef.current!.querySelectorAll(scene.selector);
        if (elements.length === 0) return;

        gsap.fromTo(elements, scene.from, {
          ...scene.to,
          scrollTrigger: {
            trigger: elements[0],
            start: scene.trigger?.start || 'top 80%',
            end: scene.trigger?.end || 'bottom 20%',
            scrub: scene.trigger?.scrub ?? false,
            pin: scene.trigger?.pin ?? false,
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [scenes, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
