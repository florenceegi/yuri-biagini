/**
 * @package CREATOR-STAGING — ExhibitionsAnimated
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-18
 * @purpose Client wrapper for /exhibitions — scroll-driven reveals for institutional social proof
 */

'use client';

import { ScrollStoryEngine } from '@/components/scroll/ScrollStoryEngine';

const exhibitionsScenes = [
  {
    selector: '.ex-eyebrow',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.ex-title',
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.ex-subtitle',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.ex-featured',
    from: { opacity: 0, scale: 0.96 },
    to: { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.ex-upcoming-item',
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.ex-institutional-card',
    from: { opacity: 0, y: 24 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.14 },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.ex-past-item',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.ex-archive-cta',
    from: { opacity: 0, scale: 0.97 },
    to: { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
];

type Props = {
  children: React.ReactNode;
};

export function ExhibitionsAnimated({ children }: Props) {
  return <ScrollStoryEngine scenes={exhibitionsScenes}>{children}</ScrollStoryEngine>;
}
