/**
 * @package CREATOR-STAGING — Cookie Consent Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose GDPR/TTDSG cookie consent — 3 categories (essential/analytics/marketing), localStorage persistence, no backend
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentRecord {
  version: number;
  timestamp: number;
  consent: CookieConsent;
}

export interface CookieConsentContextValue {
  hasDecided: boolean;
  consent: CookieConsent;
  showModal: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustom: (c: Pick<CookieConsent, 'analytics' | 'marketing'>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'creator-cookie-consent';
const CURRENT_VERSION = 1;

const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
};

function readRecord(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>;
    if (
      typeof parsed.version !== 'number' ||
      typeof parsed.timestamp !== 'number' ||
      typeof parsed.consent !== 'object' ||
      parsed.consent === null
    ) {
      return null;
    }
    if (parsed.version !== CURRENT_VERSION) {
      return null;
    }
    const c = parsed.consent as Partial<CookieConsent>;
    return {
      version: parsed.version,
      timestamp: parsed.timestamp,
      consent: {
        essential: true,
        analytics: Boolean(c.analytics),
        marketing: Boolean(c.marketing),
      },
    };
  } catch {
    return null;
  }
}

function writeRecord(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  try {
    const record: CookieConsentRecord = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      consent,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // ignore quota / security errors
  }
}

function clearRecord(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }): JSX.Element {
  const [consent, setConsentState] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [hasDecided, setHasDecided] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const rec = readRecord();
    if (rec) {
      setConsentState(rec.consent);
      setHasDecided(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.cookieAnalytics = consent.analytics ? 'on' : 'off';
    root.dataset.cookieMarketing = consent.marketing ? 'on' : 'off';
    root.dataset.cookieDecided = hasDecided ? 'on' : 'off';
  }, [consent, hasDecided]);

  const acceptAll = useCallback(() => {
    const next: CookieConsent = { essential: true, analytics: true, marketing: true };
    setConsentState(next);
    setHasDecided(true);
    setShowModal(false);
    writeRecord(next);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const next: CookieConsent = { essential: true, analytics: false, marketing: false };
    setConsentState(next);
    setHasDecided(true);
    setShowModal(false);
    writeRecord(next);
  }, []);

  const saveCustom = useCallback((c: Pick<CookieConsent, 'analytics' | 'marketing'>) => {
    const next: CookieConsent = {
      essential: true,
      analytics: Boolean(c.analytics),
      marketing: Boolean(c.marketing),
    };
    setConsentState(next);
    setHasDecided(true);
    setShowModal(false);
    writeRecord(next);
  }, []);

  const openPreferences = useCallback(() => {
    setShowModal(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowModal(false);
  }, []);

  const reset = useCallback(() => {
    setConsentState(DEFAULT_CONSENT);
    setHasDecided(false);
    setShowModal(false);
    clearRecord();
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      hasDecided: mounted && hasDecided,
      consent,
      showModal,
      acceptAll,
      rejectNonEssential,
      saveCustom,
      openPreferences,
      closePreferences,
      reset,
    }),
    [
      mounted,
      hasDecided,
      consent,
      showModal,
      acceptAll,
      rejectNonEssential,
      saveCustom,
      openPreferences,
      closePreferences,
      reset,
    ]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (ctx === null) {
    throw new Error('useCookieConsent must be used within a <CookieConsentProvider>.');
  }
  return ctx;
}
