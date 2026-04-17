/**
 * @package CREATOR-STAGING — Sanity Shared Schema Helpers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Locale field generators for 7 languages (P0-9 + zh + pt)
 */

const LOCALES = [
  { id: 'it', title: 'Italiano' },
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Francais' },
  { id: 'de', title: 'Deutsch' },
  { id: 'es', title: 'Espanol' },
  { id: 'pt', title: 'Portugues' },
  { id: 'zh', title: 'Chinese' },
];

export function localeStringFields(name: string, title: string) {
  return {
    name,
    title,
    type: 'object',
    fields: LOCALES.map((l) => ({
      name: l.id,
      title: l.title,
      type: 'string',
    })),
  };
}

export function localeTextField(name: string, title: string) {
  return {
    name,
    title,
    type: 'object',
    fields: LOCALES.map((l) => ({
      name: l.id,
      title: l.title,
      type: 'text',
      rows: 6,
    })),
  };
}
