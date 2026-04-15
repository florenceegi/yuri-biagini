/**
 * @package CREATOR-STAGING — CVContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Client component for CV page — fetches timeline + profile from authenticated creator
 */

'use client';

import { useEffect, useState } from 'react';
import { useCreator } from '@/lib/creator-context';
import { getArtistTimeline, getArtistProfile, type EgiTimelineResponse } from '@/lib/egi/client';

type Props = {
  titleLabel: string;
  educationLabel: string;
  awardsLabel: string;
  soloShowsLabel: string;
  downloadLabel: string;
};

export function CVContent({
  titleLabel,
  educationLabel,
  awardsLabel,
  soloShowsLabel,
  downloadLabel,
}: Props) {
  const { artistId, artistName, isLoading: authLoading } = useCreator();
  const [displayName, setDisplayName] = useState(artistName);
  const [chapters, setChapters] = useState<EgiTimelineResponse['chapters']>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (!artistId) {
        setIsLoading(false);
        return;
      }
      try {
        const [timeline, profile] = await Promise.all([
          getArtistTimeline(artistId),
          getArtistProfile(artistId),
        ]);
        setChapters(timeline.chapters);
        setDisplayName(profile.display_name || artistName);
      } catch {
        // Graceful degradation
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [artistId, authLoading, artistName]);

  if (authLoading || isLoading) {
    return (
      <article className="py-24 px-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-[var(--bg-surface)] rounded w-1/3 mx-auto" />
          <div className="h-4 bg-[var(--bg-surface)] rounded w-1/4 mx-auto" />
          <div className="space-y-4 mt-16">
            <div className="h-4 bg-[var(--bg-surface)] rounded w-full" />
            <div className="h-4 bg-[var(--bg-surface)] rounded w-5/6" />
            <div className="h-4 bg-[var(--bg-surface)] rounded w-4/6" />
          </div>
        </div>
      </article>
    );
  }

  const milestones = chapters.filter((c) => c.chapter_type === 'milestone');
  const achievements = chapters.filter((c) => c.chapter_type === 'achievement');
  const standard = chapters.filter((c) => c.chapter_type === 'standard');

  function renderSection(items: typeof chapters, label: string) {
    if (items.length === 0) return null;
    return (
      <section>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-8 text-[var(--accent)] uppercase tracking-widest text-sm">
          {label}
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
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
    );
  }

  return (
    <article className="py-24 px-6 max-w-4xl mx-auto">
      <header className="text-center mb-16 border-b border-[var(--border)] pb-12">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light mb-4">
          {displayName}
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {titleLabel}
        </p>
      </header>

      <div className="space-y-16">
        {renderSection(milestones, educationLabel)}
        {renderSection(achievements, awardsLabel)}
        {renderSection(standard, soloShowsLabel)}

        {chapters.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-20">
            {titleLabel}
          </p>
        )}
      </div>

      <div className="mt-16 pt-12 border-t border-[var(--border)] text-center">
        <button
          type="button"
          className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
        >
          {downloadLabel}
        </button>
      </div>
    </article>
  );
}
