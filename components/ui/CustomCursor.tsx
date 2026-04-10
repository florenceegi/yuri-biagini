/**
 * @package YURI-BIAGINI — CustomCursor
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Two-layer custom cursor with GSAP lag — hidden on touch devices
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion, useMediaQuery } from '@/lib/hooks/useReducedMotion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useMediaQuery('(pointer: coarse)');

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dotRef.current || !ringRef.current) return;

      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    []
  );

  const onMouseEnterInteractive = useCallback(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      scale: 1.8,
      opacity: 0.4,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const onMouseLeaveInteractive = useCallback(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;

    window.addEventListener('mousemove', onMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      gsap.killTweensOf([dotRef.current, ringRef.current]);
    };
  }, [prefersReducedMotion, isTouch, onMouseMove, onMouseEnterInteractive, onMouseLeaveInteractive]);

  if (prefersReducedMotion || isTouch) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]"
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)] opacity-60"
      />
    </div>
  );
}
