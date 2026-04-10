/**
 * @package YURI-BIAGINI — Sanity Schema: Series
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Art series/collection document with curatorial text
 */

import { localeStringFields, localeTextField } from './shared';

export default {
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    localeStringFields('title', 'Series Title'),
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' } },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'heroVideo', title: 'Hero Video URL (Vimeo)', type: 'url' },
    localeTextField('curatorial', 'Curatorial Text'),
    { name: 'year_start', title: 'Year Start', type: 'number' },
    { name: 'year_end', title: 'Year End (null if ongoing)', type: 'number' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
  preview: {
    select: { title: 'title.en', year: 'year_start' },
    prepare({ title, year }: { title: string; year: number }) {
      return { title: title || 'Untitled', subtitle: year ? `Since ${year}` : '' };
    },
  },
};
