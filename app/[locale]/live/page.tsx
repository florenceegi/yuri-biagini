/**
 * @package CREATOR-STAGING — Live Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Live events / streaming schedule — upcoming + past replay (SSG 7 locali, EGI wire-up future)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { LiveAnimated } from '@/components/live/LiveAnimated';
import { LiveContent } from '@/components/live/LiveContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('live_title'),
    description: t('live_description'),
  };
}

export default async function LivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'live' });

  const upcoming = [1, 2, 3, 4].map((i) => ({
    key: `upcoming_${i}`,
    date: t(`upcoming_${i}_date`),
    time: t(`upcoming_${i}_time`),
    kind: t(`upcoming_${i}_kind`),
    title: t(`upcoming_${i}_title`),
    description: t(`upcoming_${i}_description`),
    location: t(`upcoming_${i}_location`),
  }));

  const past = [1, 2, 3].map((i) => ({
    key: `past_${i}`,
    date: t(`past_${i}_date`),
    kind: t(`past_${i}_kind`),
    title: t(`past_${i}_title`),
    duration: t(`past_${i}_duration`),
  }));

  return (
    <LiveAnimated>
      <LiveContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        nextUpLabel={t('next_up_label')}
        upcomingHeading={t('upcoming_heading')}
        upcoming={upcoming}
        addToCalendarLabel={t('add_to_calendar')}
        rsvpLabel={t('rsvp')}
        pastHeading={t('past_heading')}
        past={past}
        replayLabel={t('replay')}
        noUpcomingTitle={t('no_upcoming_title')}
        noUpcomingBody={t('no_upcoming_body')}
        notifyHeading={t('notify_heading')}
        notifyBody={t('notify_body')}
        notifyCta={t('notify_cta')}
      />
    </LiveAnimated>
  );
}
