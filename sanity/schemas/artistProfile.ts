/**
 * @package YURI-BIAGINI — Sanity Schema: Artist Profile
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Singleton document for artist bio, timeline, portrait, social
 */

import { localeStringFields, localeTextField } from './shared';

export default {
  name: 'artistProfile',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', validation: (Rule: any) => Rule.required() },
    localeTextField('bio', 'Biography (long)'),
    localeStringFields('bio_short', 'Bio Short (SEO, max 160 chars)'),
    { name: 'portrait', title: 'Portrait Photo', type: 'image', options: { hotspot: true } },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'number', validation: (Rule: any) => Rule.required() },
            localeStringFields('event', 'Event Description'),
          ],
          preview: { select: { title: 'year', subtitle: 'event.en' } },
        },
      ],
    },
    { name: 'cv_pdf', title: 'CV PDF', type: 'file' },
    {
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
        { name: 'vimeo', title: 'Vimeo', type: 'url' },
        { name: 'website_old', title: 'Previous Website', type: 'url' },
      ],
    },
    { name: 'studio_address', title: 'Studio Address', type: 'string' },
    { name: 'represented_by', title: 'Represented By', type: 'array', of: [{ type: 'string' }] },
    { name: 'logo', title: 'Logo / Signature', type: 'image' },
  ],
};
