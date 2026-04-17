/**
 * @package CREATOR-STAGING — CollectContent
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Collector funnel orchestrator — hero + available gallery + trust + journey + why + testimonials + commission + final CTA.
 */

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCreator } from '@/lib/creator-context';
import { getArtistArtworks } from '@/lib/egi/client';
import { CollectAvailableGallery, type GalleryLabels } from './CollectAvailableGallery';
import { CollectTrustStrip, type TrustStripLabels } from './CollectTrustStrip';
import { CollectTestimonials, type Testimonial } from './CollectTestimonials';
import { CollectCommissionBlock, type CommissionBlockLabels } from './CollectCommissionBlock';

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
  galleryLabels: GalleryLabels;
  trustLabels: TrustStripLabels;
  testimonialsTitle: string;
  worksLabel: string;
  testimonials: Testimonial[];
  commissionLabels: CommissionBlockLabels;
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
  galleryLabels,
  trustLabels,
  testimonialsTitle,
  worksLabel,
  testimonials,
  commissionLabels,
}: Props) {
  const { artistId, isLoading: authLoading } = useCreator();
  const [journeyImages, setJourneyImages] = useState<string[]>([]);
  const artistUrl = process.env.NEXT_PUBLIC_EGI_ARTIST_URL || 'https://art.florenceegi.com';

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      if (!artistId) {
        if (cancelled) return;
        setJourneyImages([
          'https://picsum.photos/seed/collect-j1/600/750',
          'https://picsum.photos/seed/collect-j2/600/750',
          'https://picsum.photos/seed/collect-j3/600/750',
          'https://picsum.photos/seed/collect-j4/600/750',
        ]);
        return;
      }
      try {
        const result = await getArtistArtworks(1, 4, undefined, artistId);
        if (cancelled) return;
        const urls = result.data
          .map((a) => a.main_image_url)
          .filter((u): u is string => Boolean(u));
        setJourneyImages(urls.length > 0 ? urls : []);
      } catch {
        if (!cancelled) setJourneyImages([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [artistId, authLoading]);

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-surface)] to-[var(--bg)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl font-light mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed">
            {heroSubtitle}
          </p>
          <div
            aria-hidden="true"
            className="mt-10 flex justify-center text-[var(--text-tertiary)]"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Available-now gallery (centerpiece) */}
      <CollectAvailableGallery locale={locale} labels={galleryLabels} />

      {/* Trust strip */}
      <CollectTrustStrip labels={trustLabels} />

      {/* The Journey */}
      <section className="py-24 px-6 max-w-6xl mx-auto" aria-label="Journey">
        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2">
                {journeyImages[i] ? (
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)]">
                    <Image
                      src={journeyImages[i]}
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
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center border border-[var(--accent)]/30 rounded-2xl p-8 md:p-10 bg-[var(--bg-surface)]">
          <div className="text-4xl mb-4" aria-hidden="true">&#x2B21;</div>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {blockchainBadge}
          </p>
        </div>
      </section>

      {/* Why collect */}
      <section className="py-24 px-6 max-w-6xl mx-auto" aria-labelledby="collect-why-title">
        <h2
          id="collect-why-title"
          className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-light text-center mb-16"
        >
          {whyTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {whyItems.map((item) => (
            <div key={item.title} className="text-center space-y-4">
              <div className="text-3xl text-[var(--accent)]" aria-hidden="true">{item.icon}</div>
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

      {/* Testimonials */}
      <CollectTestimonials
        title={testimonialsTitle}
        worksLabel={worksLabel}
        testimonials={testimonials}
      />

      {/* Commission block */}
      <CollectCommissionBlock locale={locale} labels={commissionLabels} />

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`/${locale}/works`}
            className="inline-block px-8 py-4 bg-[var(--accent)] text-[var(--bg)] text-sm uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors rounded font-medium text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {ctaBrowse}
          </a>
          <a
            href={artistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300 rounded font-medium text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {ctaPlatform}
          </a>
        </div>
      </section>
    </>
  );
}
