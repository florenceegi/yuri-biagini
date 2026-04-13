/**
 * @package YURI-BIAGINI — Variant System
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Template variant detection — used to load correct CSS theme
 */

export type VariantId = '01' | '02' | '03' | '04' | '05' | '06';

export const VARIANT_NAMES: Record<VariantId, string> = {
  '01': 'Galeria Oscura',
  '02': 'Canvas Vivo',
  '03': 'Immersive 3D',
  '04': 'Scrollytelling',
  '05': 'Magazine Art',
  '06': 'Brutalist Statement',
};

export function getVariant(): VariantId {
  return (process.env.NEXT_PUBLIC_VARIANT as VariantId) || '03';
}
