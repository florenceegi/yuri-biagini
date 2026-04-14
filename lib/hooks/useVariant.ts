/**
 * @package YURI-BIAGINI — useVariant Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Client-side variant detection from data-variant attribute on <html>
 */

'use client';

import { useState, useEffect } from 'react';

export type VariantId = '01' | '02' | '03' | '04' | '05' | '06';

export function useVariant(): VariantId {
  const [variant, setVariant] = useState<VariantId>('03');

  useEffect(() => {
    const v = document.documentElement.getAttribute('data-variant') as VariantId;
    if (v) setVariant(v);
  }, []);

  return variant;
}
