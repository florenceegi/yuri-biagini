/**
 * @package CREATOR-STAGING — ProcessAnimated
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Client wrapper for /process — scroll-driven reveals
 */

'use client';

import { ScrollStoryEngine } from '@/components/scroll/ScrollStoryEngine';

const processScenes = [
  {
    selector: '.process-eyebrow',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.process-title',
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.process-subtitle',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.process-stage',
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.15 },
    trigger: { start: 'top 82%' },
  },
  {
    selector: '.process-stage-connector',
    from: { scaleY: 0, transformOrigin: 'top center' },
    to: { scaleY: 1, duration: 1.0, ease: 'power2.out', stagger: 0.15 },
    trigger: { start: 'top 82%' },
  },
  {
    selector: '.process-tool',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.process-ritual',
    from: { opacity: 0, scale: 0.96 },
    to: { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.process-cta',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
];

type Props = {
  children: React.ReactNode;
};

export function ProcessAnimated({ children }: Props) {
  return <ScrollStoryEngine scenes={processScenes}>{children}</ScrollStoryEngine>;
}
