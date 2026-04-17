/**
 * @package CREATOR-STAGING — StoryBehindAnimated
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Client wrapper for story-behind — scroll-driven reveals
 */

'use client';

import { ScrollStoryEngine } from '@/components/scroll/ScrollStoryEngine';

const storyScenes = [
  {
    selector: '.story-eyebrow',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.story-title',
    from: { opacity: 0, y: 40, letterSpacing: '0.5em' },
    to: { opacity: 1, y: 0, letterSpacing: '0em', duration: 1.4, ease: 'power3.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.story-subtitle',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.story-manifesto',
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.story-chapter',
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.2 },
    trigger: { start: 'top 80%' },
  },
  {
    selector: '.story-chapter-bar',
    from: { scaleX: 0, transformOrigin: 'left center' },
    to: { scaleX: 1, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 85%' },
  },
  {
    selector: '.story-quote',
    from: { opacity: 0, scale: 0.96 },
    to: { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
    trigger: { start: 'top 75%' },
  },
  {
    selector: '.story-cta',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    trigger: { start: 'top 85%' },
  },
];

type Props = {
  children: React.ReactNode;
};

export function StoryBehindAnimated({ children }: Props) {
  return <ScrollStoryEngine scenes={storyScenes}>{children}</ScrollStoryEngine>;
}
