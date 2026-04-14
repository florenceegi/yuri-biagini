/**
 * @package CREATOR-STAGING — CV Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-12
 * @purpose Formal curriculum vitae — clean, printable, professional format for galleries and curators
 */

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getArtistTimeline, getArtistProfile } from '@/lib/egi/client';
import type { EgiTimelineResponse } from '@/lib/egi/client';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cv' });
  return {
    title: `${t('title')} — Yuri Biagini`,
    description: `Yuri Biagini — ${t('title')}`,
  };
}

export const revalidate = 60;

export default async function CVPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'cv' });

  let timelineData: EgiTimelineResponse = { biography: null, chapters: [] };
  let artistName = 'Yuri Biagini';

  try {
    const [timeline, profile] = await Promise.all([
      getArtistTimeline(),
      getArtistProfile(),
    ]);
    timelineData = timeline;
    artistName = profile.display_name || artistName;
  } catch {
    // Graceful degradation
  }

  const { chapters } = timelineData;

  // Group chapters by type for CV sections
  const milestones = chapters.filter((c) => c.chapter_type === 'milestone');
  const achievements = chapters.filter((c) => c.chapter_type === 'achievement');
  const standard = chapters.filter((c) => c.chapter_type === 'standard');

  return (
    <article className="py-24 px-6 max-w-4xl mx-auto">
      {/* Header — clean, formal */}
      <header className="text-center mb-16 border-b border-[var(--border)] pb-12">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light mb-4">
          {artistName}
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {t('title')}
        </p>
      </header>

      {/* Timeline sections */}
      <div className="space-y-16">
        {/* Milestones — education, key career moments */}
        {milestones.length > 0 && (
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-8 text-[var(--accent)] uppercase tracking-widest text-sm">
              {t('education')}
            </h2>
            <div className="space-y-4">
              {milestones.map((item) => (
                <div key={item.id} className="flex gap-6 items-baseline">
                  <span className="flex-shrink-0 w-32 text-sm text-[var(--text-muted)] text-right">
                    {item.date_range_display}
                  </span>
                  <div>
                    <p className="text-[var(--text-primary)]">{item.title}</p>
                    {item.content_preview && (
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                        {item.content_preview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements — awards, honors */}
        {achievements.length > 0 && (
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-8 text-[var(--accent)] uppercase tracking-widest text-sm">
              {t('awards')}
            </h2>
            <div className="space-y-4">
              {achievements.map((item) => (
                <div key={item.id} className="flex gap-6 items-baseline">
                  <span className="flex-shrink-0 w-32 text-sm text-[var(--text-muted)] text-right">
                    {item.date_range_display}
                  </span>
                  <div>
                    <p className="text-[var(--text-primary)]">{item.title}</p>
                    {item.content_preview && (
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                        {item.content_preview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Standard — exhibitions, etc. */}
        {standard.length > 0 && (
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-8 text-[var(--accent)] uppercase tracking-widest text-sm">
              {t('solo_shows')}
            </h2>
            <div className="space-y-4">
              {standard.map((item) => (
                <div key={item.id} className="flex gap-6 items-baseline">
                  <span className="flex-shrink-0 w-32 text-sm text-[var(--text-muted)] text-right">
                    {item.date_range_display}
                  </span>
                  <div>
                    <p className="text-[var(--text-primary)]">{item.title}</p>
                    {item.content_preview && (
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                        {item.content_preview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fallback if no data */}
        {chapters.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-20">
            {t('title')}
          </p>
        )}
      </div>

      {/* Download button */}
      <div className="mt-16 pt-12 border-t border-[var(--border)] text-center">
        <button
          type="button"
          className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
        >
          {t('download')}
        </button>
      </div>
    </article>
  );
}
