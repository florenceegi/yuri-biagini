/**
 * @package CREATOR-STAGING — Journal Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Artist journal / studio diary — tag-filterable post feed (SSG 7 locali, EGI wire-up future)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { JournalAnimated } from '@/components/journal/JournalAnimated';
import { JournalContent } from '@/components/journal/JournalContent';
import { assertSectionActive } from '@/lib/active-sections';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('journal_title'),
    description: t('journal_description'),
  };
}

export default async function JournalPage({ params }: Props) {
  assertSectionActive('journal');
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'journal' });

  const tags = ['studio', 'process', 'exhibition', 'reflection'];

  const posts = [1, 2, 3, 4, 5, 6].map((i) => ({
    key: `post_${i}`,
    date: t(`post_${i}_date`),
    tag: t(`post_${i}_tag`),
    title: t(`post_${i}_title`),
    excerpt: t(`post_${i}_excerpt`),
    readTime: t(`post_${i}_read_time`),
  }));

  return (
    <JournalAnimated>
      <JournalContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        allLabel={t('filter_all')}
        tagsLabel={t('filter_tags_label')}
        tags={tags.map((key) => ({ key, label: t(`filter_${key}`) }))}
        posts={posts}
        readMoreLabel={t('read_more')}
        emptyStateTitle={t('empty_title')}
        emptyStateBody={t('empty_body')}
        newsletterHeading={t('newsletter_heading')}
        newsletterBody={t('newsletter_body')}
        newsletterCta={t('newsletter_cta')}
      />
    </JournalAnimated>
  );
}
