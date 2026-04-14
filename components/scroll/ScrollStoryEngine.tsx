/**
 * @package YURI-BIAGINI — ScrollStoryEngine
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose GSAP ScrollTrigger wrapper — supports custom scenes OR auto-reveal with animation preset
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useAnimation } from '@/lib/hooks/useAnimation';

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
  };
};

type Props = {
  children: ReactNode;
  /** Custom scenes — if provided, these override the animation preset */
  scenes?: Scene[];
  /** Auto-reveal: animate all elements matching this selector on scroll */
  revealSelector?: string;
  className?: string;
};

export function ScrollStoryEngine({ children, scenes, revealSelector, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const anim = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || anim.id === 'none') return;

    const ctx = gsap.context(() => {
      // Custom scenes mode
      if (scenes && scenes.length > 0) {
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
        return;
      }

      // Auto-reveal mode — uses animation preset
      const selector = revealSelector || '[data-reveal]';
      const elements = containerRef.current!.querySelectorAll(selector);
      if (elements.length === 0) return;

      elements.forEach((el, i) => {
        gsap.fromTo(el, anim.scrollReveal.from, {
          ...anim.scrollReveal.to,
          delay: i * anim.scrollReveal.stagger,
          scrollTrigger: {
            trigger: el,
            start: anim.scrollReveal.triggerStart,
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [scenes, revealSelector, prefersReducedMotion, anim]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
