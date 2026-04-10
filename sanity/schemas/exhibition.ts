/**
 * @package YURI-BIAGINI — Sanity Schema: Exhibition
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Exhibition document: title, venue, dates, type, images, press release
 */

import { localeStringFields } from './shared';

export default {
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  fields: [
    localeStringFields('title', 'Title'),
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' } },
    { name: 'venue', title: 'Venue', type: 'string' },
    { name: 'city', title: 'City', type: 'string' },
    { name: 'country', title: 'Country (ISO)', type: 'string' },
    { name: 'date_start', title: 'Start Date', type: 'date' },
    { name: 'date_end', title: 'End Date', type: 'date' },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo', value: 'solo' },
          { title: 'Group', value: 'group' },
          { title: 'Fair', value: 'fair' },
          { title: 'Institutional', value: 'institutional' },
        ],
      },
    },
    { name: 'images', title: 'Installation Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'press_release', title: 'Press Release PDF', type: 'file' },
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'venue', date: 'date_start' },
    prepare({ title, subtitle, date }: { title: string; subtitle: string; date: string }) {
      return { title: title || 'Untitled', subtitle: `${subtitle || ''} — ${date || ''}` };
    },
  },
};
