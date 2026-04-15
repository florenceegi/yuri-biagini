/**
 * @package CREATOR-STAGING — AboutContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Client component for about page — fetches timeline from authenticated creator
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { useCreator } from '@/lib/creator-context';
import { getArtistTimeline, type EgiTimelineResponse } from '@/lib/egi/client';

const dotColors: Record<string, string> = {
  milestone: 'bg-yellow-400 border-yellow-400/40',
  achievement: 'bg-emerald-400 border-emerald-400/40',
  standard: 'bg-[var(--accent)] border-[var(--accent)]/40',
};

function TimelineDot({ type }: { type: string }) {
  const color = dotColors[type] || dotColors.standard;
  return (
    <div
      className={`absolute -left-[41px] w-4 h-4 rounded-full border-2 timeline-dot ${color}`}
    />
  );
}

type Props = {
  titleLabel: string;
  portraitAlt: string;
  bioPlaceholder: string;
  timelineLabel: string;
  ongoingLabel: string;
  cvDownloadLabel: string;
};

export function AboutContent({
  titleLabel,
  portraitAlt,
  bioPlaceholder,
  timelineLabel,
  ongoingLabel,
  cvDownloadLabel,
}: Props) {
  const { artistId, isLoading: authLoading } = useCreator();
  const [data, setData] = useState<EgiTimelineResponse>({ biography: null, chapters: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (!artistId) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await getArtistTimeline(artistId);
        setData(result);
      } catch {
        // Graceful degradation
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [artistId, authLoading]);

  if (authLoading || isLoading) {
    return (
      <article className="py-24 px-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-[var(--bg-surface)] rounded w-1/3 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg" />
            <div className="md:col-span-2 space-y-4">
              <div className="h-4 bg-[var(--bg-surface)] rounded w-full" />
              <div className="h-4 bg-[var(--bg-surface)] rounded w-5/6" />
              <div className="h-4 bg-[var(--bg-surface)] rounded w-4/6" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  const { artist, biography, chapters } = data;

  return (
    <article className="py-24 px-6 max-w-6xl mx-auto">
      <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl font-light text-center mb-16">
        {titleLabel}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
        {/* Portrait */}
        <div className="md:col-span-1 about-portrait">
          <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] overflow-hidden">
            {artist?.avatar_url ? (
              <Image
                src={artist.avatar_url}
                alt={artist.display_name || portraitAlt}
                width={400}
                height={533}
                className="w-full h-full object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--text-muted)] text-sm">{portraitAlt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio text */}
        <div className="md:col-span-2 space-y-6">
          {biography ? (
            <div
              className="about-bio-text text-[var(--text-secondary)] leading-relaxed text-lg prose prose-invert max-w-none prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:text-lg"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(biography.content) }}
            />
          ) : (
            <p className="about-bio-text text-[var(--text-secondary)] leading-relaxed text-lg">
              {bioPlaceholder}
            </p>
          )}
        </div>
      </div>

      {/* Timeline */}
      {chapters.length > 0 && (
        <section aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-light mb-12 about-bio-text"
          >
            {timelineLabel}
          </h2>

          <div className="border-l-2 border-[var(--border)] pl-8 space-y-10">
            {chapters.map((item) => (
              <div key={item.id} className="relative timeline-item">
                <TimelineDot type={item.chapter_type} />
                <p className="text-[var(--accent)] text-sm uppercase tracking-widest mb-2">
                  {item.date_range_display}
                  {item.is_ongoing && (
                    <span className="ml-2 text-xs font-medium text-emerald-400 normal-case tracking-normal">
                      {ongoingLabel}
                    </span>
                  )}
                </p>
                <p className="text-[var(--text-primary)] font-medium">
                  {item.title}
                </p>
                {item.content_preview && (
                  <p className="text-[var(--text-secondary)] text-sm mt-1">
                    {item.content_preview}
                  </p>
                )}
                {item.duration_formatted && (
                  <p className="text-[var(--text-muted)] text-xs mt-1 italic">
                    {item.duration_formatted}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CV Download */}
      <div className="mt-16 text-center">
        <button
          type="button"
          className="inline-block px-8 py-3 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded"
        >
          {cvDownloadLabel}
        </button>
      </div>
    </article>
  );
}
