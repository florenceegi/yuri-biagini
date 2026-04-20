/**
 * @package CREATOR-STAGING — Active Sections
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Runtime gate for addon section routes — env-driven allowlist (NEXT_PUBLIC_ACTIVE_SECTIONS), 404 on disabled routes.
 */

import { notFound } from 'next/navigation';
import { SECTIONS, type SectionId } from './site-catalog';

const ENV_VALUE = process.env.NEXT_PUBLIC_ACTIVE_SECTIONS ?? '';

const ACTIVE_SET: ReadonlySet<string> = new Set(
  ENV_VALUE.split(',').map((s) => s.trim()).filter(Boolean),
);

export function isSectionActive(id: SectionId): boolean {
  return ACTIVE_SET.has(id);
}

export function isRouteActive(route: string): boolean {
  const section = SECTIONS.find((s) => s.route === route);
  return section ? ACTIVE_SET.has(section.id) : false;
}

export function getActiveSectionIds(): SectionId[] {
  return SECTIONS.filter((s) => ACTIVE_SET.has(s.id)).map((s) => s.id);
}

export function getActiveSectionRoutes(): string[] {
  return SECTIONS.filter((s) => ACTIVE_SET.has(s.id)).map((s) => s.route);
}

export function assertSectionActive(id: SectionId): void {
  if (!isSectionActive(id)) notFound();
}
