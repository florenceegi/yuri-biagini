/**
 * @package YURI-BIAGINI — AboutAnimated
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Client wrapper for about page with scroll-driven reveal animations
 */

'use client';

import { ScrollStoryEngine } from '@/components/scroll/ScrollStoryEngine';

const aboutScenes = [
  {
    selector: '.about-portrait',
    from: { opacity: 0, x: -40, clipPath: 'inset(0 100% 0 0)' },
    to: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 75%' },
  },
  {
    selector: '.about-bio-text',
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.timeline-item',
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2 },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.timeline-dot',
    from: { scale: 0 },
    to: { scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.2 },
    trigger: { start: 'top 85%' },
  },
];

type Props = {
  children: React.ReactNode;
};

export function AboutAnimated({ children }: Props) {
  return (
    <ScrollStoryEngine scenes={aboutScenes}>
      {children}
    </ScrollStoryEngine>
  );
}
