/**
 * @package CREATOR-STAGING — Story Behind Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Artist narrative / manifesto — scroll-driven long form, SSG per locale
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { StoryBehindAnimated } from '@/components/story/StoryBehindAnimated';
import { StoryBehindContent } from '@/components/story/StoryBehindContent';
import { assertSectionActive } from '@/lib/active-sections';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('story_behind_title'),
    description: t('story_behind_description'),
  };
}

export default async function StoryBehindPage({ params }: Props) {
  assertSectionActive('story_behind');
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'story_behind' });

  return (
    <StoryBehindAnimated>
      <StoryBehindContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        manifesto={t('manifesto')}
        chapters={[
          { key: 'origin', title: t('origin_title'), body: t('origin_body') },
          { key: 'craft', title: t('craft_title'), body: t('craft_body') },
          { key: 'voice', title: t('voice_title'), body: t('voice_body') },
          { key: 'horizon', title: t('horizon_title'), body: t('horizon_body') },
        ]}
        quote={t('quote')}
        quoteAuthor={t('quote_author')}
        ctaText={t('cta_text')}
        ctaLabel={t('cta_label')}
      />
    </StoryBehindAnimated>
  );
}
