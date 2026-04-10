/**
 * @package YURI-BIAGINI — Sanity Schema: Press Item
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Press coverage document: outlet, headline, date, URL/PDF
 */

export default {
  name: 'pressItem',
  title: 'Press Item',
  type: 'document',
  fields: [
    { name: 'outlet', title: 'Publication Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'outlet_logo', title: 'Publication Logo', type: 'image' },
    { name: 'headline', title: 'Article Headline', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'date', title: 'Publication Date', type: 'date', validation: (Rule: any) => Rule.required() },
    { name: 'url', title: 'Article URL', type: 'url' },
    { name: 'pdf', title: 'PDF Scan', type: 'file' },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ],
  preview: {
    select: { title: 'headline', subtitle: 'outlet', date: 'date' },
    prepare({ title, subtitle, date }: { title: string; subtitle: string; date: string }) {
      return { title, subtitle: `${subtitle} — ${date || ''}` };
    },
  },
};
