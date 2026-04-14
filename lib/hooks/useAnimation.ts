/**
 * @package YURI-BIAGINI — useAnimation Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Client-side animation preset detection + GSAP config presets
 */

'use client';

import { useState, useEffect, useMemo } from 'react';

export type AnimationId = 'minimal' | 'cinematic' | 'energetic' | 'editorial' | 'fluid' | 'none';

export type AnimationPreset = {
  id: AnimationId;
  /** Hero entrance */
  hero: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
  };
  /** How sections reveal on scroll */
  scrollReveal: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
    stagger: number;
    triggerStart: string;
  };
  /** Page transition on route change */
  pageTransition: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
  };
  /** Gallery items entrance */
  gallery: {
    from: Record<string, unknown>;
    to: Record<string, unknown>;
    stagger: number;
  };
  /** Hover scale factor for interactive elements */
  hoverScale: number;
  /** Base easing for all tweens */
  easing: string;
  /** Duration multiplier (1 = normal) */
  speed: number;
};

const PRESETS: Record<AnimationId, AnimationPreset> = {
  minimal: {
    id: 'minimal',
    hero: {
      from: { opacity: 0 },
      to: { opacity: 1, duration: 0.8, ease: 'power1.out' },
    },
    scrollReveal: {
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' },
      stagger: 0.08,
      triggerStart: 'top 85%',
    },
    pageTransition: {
      from: { opacity: 0 },
      to: { opacity: 1, duration: 0.4, ease: 'power1.out' },
    },
    gallery: {
      from: { opacity: 0, y: 15 },
      to: { opacity: 1, y: 0, duration: 0.5, ease: 'power1.out' },
      stagger: 0.06,
    },
    hoverScale: 1.02,
    easing: 'power1.out',
    speed: 1,
  },

  cinematic: {
    id: 'cinematic',
    hero: {
      from: { opacity: 0, y: 40, scale: 0.97 },
      to: { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
    },
    scrollReveal: {
      from: { opacity: 0, y: 60, clipPath: 'inset(10% 0% 10% 0%)' },
      to: { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power3.out' },
      stagger: 0.15,
      triggerStart: 'top 80%',
    },
    pageTransition: {
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    },
    gallery: {
      from: { opacity: 0, y: 40, scale: 0.95 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      stagger: 0.1,
    },
    hoverScale: 1.03,
    easing: 'power3.out',
    speed: 1,
  },

  energetic: {
    id: 'energetic',
    hero: {
      from: { opacity: 0, y: -30, scale: 1.1, rotation: -2 },
      to: { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.7)' },
    },
    scrollReveal: {
      from: { opacity: 0, y: 50, scale: 0.85 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
      stagger: 0.05,
      triggerStart: 'top 90%',
    },
    pageTransition: {
      from: { opacity: 0, scale: 0.95, y: -20 },
      to: { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' },
    },
    gallery: {
      from: { opacity: 0, scale: 0.7, rotation: -3 },
      to: { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
      stagger: 0.04,
    },
    hoverScale: 1.08,
    easing: 'back.out(1.7)',
    speed: 0.8,
  },

  editorial: {
    id: 'editorial',
    hero: {
      from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      to: { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' },
    },
    scrollReveal: {
      from: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      to: { opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power4.out' },
      stagger: 0.12,
      triggerStart: 'top 75%',
    },
    pageTransition: {
      from: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      to: { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.inOut' },
    },
    gallery: {
      from: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      to: { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power3.out' },
      stagger: 0.08,
    },
    hoverScale: 1.02,
    easing: 'power4.inOut',
    speed: 1,
  },

  fluid: {
    id: 'fluid',
    hero: {
      from: { opacity: 0, y: 80, filter: 'blur(10px)' },
      to: { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out' },
    },
    scrollReveal: {
      from: { opacity: 0, y: 40, filter: 'blur(6px)' },
      to: { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' },
      stagger: 0.1,
      triggerStart: 'top 82%',
    },
    pageTransition: {
      from: { opacity: 0, y: 20, filter: 'blur(8px)' },
      to: { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out' },
    },
    gallery: {
      from: { opacity: 0, y: 30, filter: 'blur(4px)' },
      to: { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
      stagger: 0.07,
    },
    hoverScale: 1.04,
    easing: 'expo.out',
    speed: 1.2,
  },

  none: {
    id: 'none',
    hero: {
      from: { opacity: 1 },
      to: { opacity: 1, duration: 0 },
    },
    scrollReveal: {
      from: { opacity: 1 },
      to: { opacity: 1, duration: 0 },
      stagger: 0,
      triggerStart: 'top 100%',
    },
    pageTransition: {
      from: { opacity: 1 },
      to: { opacity: 1, duration: 0 },
    },
    gallery: {
      from: { opacity: 1 },
      to: { opacity: 1, duration: 0 },
      stagger: 0,
    },
    hoverScale: 1,
    easing: 'none',
    speed: 0,
  },
};

export function useAnimation(): AnimationPreset {
  const [animId, setAnimId] = useState<AnimationId>('cinematic');

  useEffect(() => {
    const a = document.documentElement.getAttribute('data-animation') as AnimationId;
    if (a && PRESETS[a]) setAnimId(a);
  }, []);

  return useMemo(() => PRESETS[animId], [animId]);
}

export { PRESETS as ANIMATION_PRESETS };
