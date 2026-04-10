/**
 * @package YURI-BIAGINI — Sanity Shared Schema Helpers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Locale field generators for 6-language support (P0-9)
 */

const LOCALES = [
  { id: 'it', title: 'Italiano' },
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Francais' },
  { id: 'de', title: 'Deutsch' },
  { id: 'es', title: 'Espanol' },
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
