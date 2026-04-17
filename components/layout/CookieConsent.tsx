/**
 * @package CREATOR-STAGING — Cookie Consent UI
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose GDPR banner + preferences modal — client-only, localStorage via CookieConsentContext
 */

'use client';

import { useCallback, useEffect, useId, useRef, useState, type JSX } from 'react';
import { useCookieConsent } from '@/lib/cookie-consent-context';

export interface CookieConsentLabels {
  banner_title: string;
  banner_description: string;
  accept_all: string;
  reject_non_essential: string;
  customize: string;
  modal_title: string;
  modal_description: string;
  category_essential_title: string;
  category_essential_description: string;
  category_analytics_title: string;
  category_analytics_description: string;
  category_marketing_title: string;
  category_marketing_description: string;
  save_preferences: string;
  close: string;
  always_on: string;
  privacy_policy: string;
}

export function CookieConsent({
  labels,
  privacyHref,
}: {
  labels: CookieConsentLabels;
  privacyHref: string;
}): JSX.Element | null {
  const { hasDecided, consent, showModal, acceptAll, rejectNonEssential, saveCustom, openPreferences, closePreferences } = useCookieConsent();

  const [localAnalytics, setLocalAnalytics] = useState<boolean>(consent.analytics);
  const [localMarketing, setLocalMarketing] = useState<boolean>(consent.marketing);
  const modalRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalTitleId = useId();

  useEffect(() => {
    if (showModal) {
      setLocalAnalytics(consent.analytics);
      setLocalMarketing(consent.marketing);
    }
  }, [showModal, consent]);

  useEffect(() => {
    if (!showModal) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePreferences();
      }
      if (e.key === 'Tab' && modalRef.current) {
        trapFocus(e, modalRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previousFocusRef.current?.focus();
    };
  }, [showModal, closePreferences]);

  const onSave = useCallback(() => {
    saveCustom({ analytics: localAnalytics, marketing: localMarketing });
  }, [saveCustom, localAnalytics, localMarketing]);

  if (hasDecided && !showModal) return null;

  return (
    <>
      {!hasDecided && (
        <div
          ref={bannerRef}
          role="region"
          aria-label={labels.banner_title}
          className="cookie-banner"
        >
          <div className="cookie-banner__body">
            <h2 className="cookie-banner__title">{labels.banner_title}</h2>
            <p className="cookie-banner__description">
              {labels.banner_description}
              {' '}
              <a href={privacyHref} className="cookie-banner__link">
                {labels.privacy_policy}
              </a>
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" onClick={rejectNonEssential} className="cookie-btn cookie-btn--ghost">
              {labels.reject_non_essential}
            </button>
            <button type="button" onClick={openPreferences} className="cookie-btn cookie-btn--ghost">
              {labels.customize}
            </button>
            <button type="button" onClick={acceptAll} className="cookie-btn cookie-btn--primary">
              {labels.accept_all}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="cookie-modal__backdrop"
          onClick={closePreferences}
          aria-hidden="true"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            className="cookie-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cookie-modal__header">
              <h2 id={modalTitleId} className="cookie-modal__title">{labels.modal_title}</h2>
              <button
                type="button"
                aria-label={labels.close}
                onClick={closePreferences}
                className="cookie-modal__close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="cookie-modal__description">
              {labels.modal_description}
              {' '}
              <a href={privacyHref} className="cookie-modal__link">
                {labels.privacy_policy}
              </a>
            </p>
            <div className="cookie-modal__categories">
              <CategoryRow
                title={labels.category_essential_title}
                description={labels.category_essential_description}
                checked
                disabled
                alwaysOnLabel={labels.always_on}
                onChange={() => undefined}
              />
              <CategoryRow
                title={labels.category_analytics_title}
                description={labels.category_analytics_description}
                checked={localAnalytics}
                onChange={setLocalAnalytics}
              />
              <CategoryRow
                title={labels.category_marketing_title}
                description={labels.category_marketing_description}
                checked={localMarketing}
                onChange={setLocalMarketing}
              />
            </div>
            <div className="cookie-modal__footer">
              <button type="button" onClick={rejectNonEssential} className="cookie-btn cookie-btn--ghost">
                {labels.reject_non_essential}
              </button>
              <button type="button" onClick={onSave} className="cookie-btn cookie-btn--primary">
                {labels.save_preferences}
              </button>
              <button type="button" onClick={acceptAll} className="cookie-btn cookie-btn--primary">
                {labels.accept_all}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  alwaysOnLabel,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  alwaysOnLabel?: string;
  onChange: (v: boolean) => void;
}): JSX.Element {
  const id = useId();
  return (
    <div className="cookie-category">
      <div className="cookie-category__text">
        <label htmlFor={id} className="cookie-category__title">{title}</label>
        <p className="cookie-category__description">{description}</p>
      </div>
      <div className="cookie-category__control">
        {disabled && alwaysOnLabel ? (
          <span className="cookie-category__always" aria-hidden="true">
            {alwaysOnLabel}
          </span>
        ) : null}
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="cookie-category__switch"
        />
      </div>
    </div>
  );
}

function trapFocus(e: KeyboardEvent, container: HTMLElement): void {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
