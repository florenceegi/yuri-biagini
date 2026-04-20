/**
 * @package CREATOR-STAGING — useSiteSelection hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Client-side persisted selection (tier, sections, features) for configurator and commission form.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { SectionId, FeatureId, TierId } from '@/lib/site-catalog';

const STORAGE_KEY = 'creator-staging:site-selection:v1';

export interface SiteSelection {
  tier: TierId;
  sections: SectionId[];
  features: FeatureId[];
}

const DEFAULT: SiteSelection = { tier: 'studio', sections: [], features: [] };

function read(): SiteSelection {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        tier: (parsed.tier as TierId) || DEFAULT.tier,
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        features: Array.isArray(parsed.features) ? parsed.features : [],
      };
    }
  } catch {
    /* noop */
  }
  return DEFAULT;
}

function write(selection: SiteSelection) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    window.dispatchEvent(new CustomEvent('site-selection:changed', { detail: selection }));
  } catch {
    /* noop */
  }
}

export function useSiteSelection() {
  const [selection, setSelection] = useState<SiteSelection>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelection(read());
    setHydrated(true);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<SiteSelection>).detail;
      if (detail) setSelection(detail);
    };
    window.addEventListener('site-selection:changed', onChange);
    return () => window.removeEventListener('site-selection:changed', onChange);
  }, []);

  const update = useCallback((patch: Partial<SiteSelection>) => {
    setSelection((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const toggleSection = useCallback((id: SectionId) => {
    setSelection((prev) => {
      const has = prev.sections.includes(id);
      const next = {
        ...prev,
        sections: has ? prev.sections.filter((s) => s !== id) : [...prev.sections, id],
      };
      write(next);
      return next;
    });
  }, []);

  const toggleFeature = useCallback((id: FeatureId) => {
    setSelection((prev) => {
      const has = prev.features.includes(id);
      const next = {
        ...prev,
        features: has ? prev.features.filter((f) => f !== id) : [...prev.features, id],
      };
      write(next);
      return next;
    });
  }, []);

  return { selection, hydrated, update, toggleSection, toggleFeature };
}
