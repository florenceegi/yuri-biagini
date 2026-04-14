/**
 * @package YURI-BIAGINI — CustomCursor
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Variant-aware custom cursor — ring/dot/cross/square per template
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion, useMediaQuery } from '@/lib/hooks/useReducedMotion';
import { useVariant } from '@/lib/hooks/useVariant';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useMediaQuery('(pointer: coarse)');
  const variant = useVariant();

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dotRef.current) return;
      const lagDuration = variant === '06' ? 0 : 0.1;
      gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: lagDuration, ease: 'power2.out' });

      if (ringRef.current) {
        const ringLag = variant === '06' ? 0 : 0.4;
        gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: ringLag, ease: 'power2.out' });
      }
    },
    [variant]
  );

  const onMouseEnterInteractive = useCallback(() => {
    if (!ringRef.current && !dotRef.current) return;
    if (variant === '06') {
      if (dotRef.current) gsap.to(dotRef.current, { rotation: 45, duration: 0 });
    } else if (ringRef.current) {
      gsap.to(ringRef.current, { scale: 1.8, opacity: 0.4, duration: 0.3, ease: 'power2.out' });
    }
  }, [variant]);

  const onMouseLeaveInteractive = useCallback(() => {
    if (variant === '06') {
      if (dotRef.current) gsap.to(dotRef.current, { rotation: 0, duration: 0 });
    } else if (ringRef.current) {
      gsap.to(ringRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
  }, [variant]);

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;
    window.addEventListener('mousemove', onMouseMove);
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
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

  // 02 Canvas: dot only, no ring
  if (variant === '02') {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
        <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      </div>
    );
  }

  // 04 Scrollytelling: minimal dot
  if (variant === '04') {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
        <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      </div>
    );
  }

  // 05 Magazine: square ring
  if (variant === '05') {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
        <div ref={dotRef} className="fixed top-0 left-0 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
        <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[var(--accent)] opacity-60" />
      </div>
    );
  }

  // 06 Brutalist: crosshair
  if (variant === '06') {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
        <div ref={dotRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-0.5 bg-[var(--accent)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-0.5 h-6 bg-[var(--accent)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  // 01 Oscura & 03 Immersive: two-layer ring + dot with glow
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
      <div ref={dotRef} className="fixed top-0 left-0 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      <div ref={ringRef}
        className={`fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)] opacity-60 ${
          variant === '01' ? 'shadow-[0_0_12px_var(--accent)]' : ''
        }`}
      />
    </div>
  );
}
