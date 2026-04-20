/**
 * @package CREATOR-STAGING — Process Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Behind-the-scenes studio — creative process, tools, techniques, rituals (SSG 7 locali)
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ProcessAnimated } from '@/components/process/ProcessAnimated';
import { ProcessContent } from '@/components/process/ProcessContent';
import { assertSectionActive } from '@/lib/active-sections';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('process_title'),
    description: t('process_description'),
  };
}

export default async function ProcessPage({ params }: Props) {
  assertSectionActive('process');
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'process' });

  return (
    <ProcessAnimated>
      <ProcessContent
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        stagesHeading={t('stages_heading')}
        stages={[
          { key: 'spark', title: t('stage_spark_title'), body: t('stage_spark_body'), duration: t('stage_spark_duration') },
          { key: 'sketch', title: t('stage_sketch_title'), body: t('stage_sketch_body'), duration: t('stage_sketch_duration') },
          { key: 'build', title: t('stage_build_title'), body: t('stage_build_body'), duration: t('stage_build_duration') },
          { key: 'refine', title: t('stage_refine_title'), body: t('stage_refine_body'), duration: t('stage_refine_duration') },
          { key: 'release', title: t('stage_release_title'), body: t('stage_release_body'), duration: t('stage_release_duration') },
        ]}
        toolsHeading={t('tools_heading')}
        tools={[
          { key: 'studio', label: t('tool_studio_label'), detail: t('tool_studio_detail') },
          { key: 'materials', label: t('tool_materials_label'), detail: t('tool_materials_detail') },
          { key: 'software', label: t('tool_software_label'), detail: t('tool_software_detail') },
          { key: 'archive', label: t('tool_archive_label'), detail: t('tool_archive_detail') },
        ]}
        ritualHeading={t('ritual_heading')}
        ritualBody={t('ritual_body')}
        ctaText={t('cta_text')}
        ctaLabel={t('cta_label')}
      />
    </ProcessAnimated>
  );
}
