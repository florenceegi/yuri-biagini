/**
 * @package CREATOR-STAGING — CollectContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-15
 * @purpose Client component for collect page — fetches featured artworks from authenticated creator
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCreator } from '@/lib/creator-context';
import { getArtistArtworks } from '@/lib/egi/client';

type Step = { num: string; title: string; desc: string; accent: string };
type WhyItem = { title: string; desc: string; icon: string };

type Props = {
  locale: string;
  heroTitle: string;
  heroSubtitle: string;
  steps: Step[];
  whyTitle: string;
  whyItems: WhyItem[];
  blockchainBadge: string;
  ctaBrowse: string;
  ctaPlatform: string;
};

export function CollectContent({
  locale,
  heroTitle,
  heroSubtitle,
  steps,
  whyTitle,
  whyItems,
  blockchainBadge,
  ctaBrowse,
  ctaPlatform,
}: Props) {
  const { artistId, isLoading: authLoading } = useCreator();
  const [featuredImages, setFeaturedImages] = useState<string[]>([]);

  const artistUrl = process.env.NEXT_PUBLIC_EGI_ARTIST_URL || 'https://art.florenceegi.com';

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (!artistId) {
        setFeaturedImages([
          'https://picsum.photos/seed/collect-1/600/750',
          'https://picsum.photos/seed/collect-2/600/750',
          'https://picsum.photos/seed/collect-3/600/750',
          'https://picsum.photos/seed/collect-4/600/750',
        ]);
        return;
      }
      try {
        const result = await getArtistArtworks(1, 4, undefined, artistId);
        const urls = result.data
          .map((a) => a.main_image_url)
          .filter((url): url is string => Boolean(url));
        setFeaturedImages(urls.length > 0 ? urls : []);
      } catch {
        setFeaturedImages([]);
      }
    }

    load();
  }, [artistId, authLoading]);

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-surface)] to-[var(--bg)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* The Journey — 4 steps */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2">
                {featuredImages[i] ? (
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)]">
                    <Image
                      src={featuredImages[i]}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]" />
                )}
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <span
                  className="text-6xl md:text-8xl font-[family-name:var(--font-serif)] font-light"
                  style={{ color: step.accent }}
                >
                  {step.num}
                </span>
                <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-light">
                  {step.title}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain badge */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center border border-[var(--accent)]/30 rounded-2xl p-8 md:p-12 bg-[var(--bg-surface)]">
          <div className="text-4xl mb-4">&#x2B21;</div>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {blockchainBadge}
          </p>
        </div>
      </section>

      {/* Why collect */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-center mb-16">
          {whyTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {whyItems.map((item) => (
            <div key={item.title} className="text-center space-y-4">
              <div className="text-3xl text-[var(--accent)]">{item.icon}</div>
              <h3 className="text-xl font-medium text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`/${locale}/works`}
            className="inline-block px-8 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors rounded font-medium text-center"
          >
            {ctaBrowse}
          </a>
          <a
            href={artistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded font-medium text-center"
          >
            {ctaPlatform}
          </a>
        </div>
      </section>
    </>
  );
}
