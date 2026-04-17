/**
 * @package CREATOR-STAGING — Accessibility Panel
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Floating a11y panel — font-size / contrast / reduced-motion / dyslexia-font (WCAG 2.1 AA)
 */

'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useA11y, type A11yFontSize, type A11yContrast, type A11yReducedMotion, type A11yDyslexiaFont } from '@/lib/a11y-context';

export interface A11yPanelLabels {
  title: string;
  trigger: string;
  close: string;
  font_size: string;
  font_normal: string;
  font_large: string;
  font_xlarge: string;
  contrast: string;
  contrast_normal: string;
  contrast_high: string;
  motion: string;
  motion_system: string;
  motion_on: string;
  motion_off: string;
  dyslexia: string;
  dyslexia_off: string;
  dyslexia_on: string;
  reset: string;
}

export function A11yPanel({ labels }: { labels: A11yPanelLabels }): JSX.Element {
  const a11y = useA11y();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const headingId = `${panelId}-heading`;

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, [isOpen, close]);

  const onTriggerKey = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    },
    []
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={labels.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={onTriggerKey}
        className="a11y-panel-trigger"
      >
        <span aria-hidden="true" className="a11y-panel-trigger__icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="8" r="1.2" fill="currentColor" />
            <path d="M12 11v7" />
            <path d="M9 13l3 2 3-2" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          className="a11y-panel"
        >
          <div className="a11y-panel__header">
            <h2 id={headingId} className="a11y-panel__title">{labels.title}</h2>
            <button
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="a11y-panel__close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="a11y-panel__body">
            <Fieldset
              legend={labels.font_size}
              options={[
                { value: 'normal', label: labels.font_normal },
                { value: 'large', label: labels.font_large },
                { value: 'xlarge', label: labels.font_xlarge },
              ]}
              current={a11y.fontSize}
              onChange={(v) => a11y.setFontSize(v as A11yFontSize)}
              name="a11y-font-size"
            />
            <Fieldset
              legend={labels.contrast}
              options={[
                { value: 'normal', label: labels.contrast_normal },
                { value: 'high', label: labels.contrast_high },
              ]}
              current={a11y.contrast}
              onChange={(v) => a11y.setContrast(v as A11yContrast)}
              name="a11y-contrast"
            />
            <Fieldset
              legend={labels.motion}
              options={[
                { value: 'system', label: labels.motion_system },
                { value: 'on', label: labels.motion_on },
                { value: 'off', label: labels.motion_off },
              ]}
              current={a11y.reducedMotion}
              onChange={(v) => a11y.setReducedMotion(v as A11yReducedMotion)}
              name="a11y-motion"
            />
            <Fieldset
              legend={labels.dyslexia}
              options={[
                { value: 'off', label: labels.dyslexia_off },
                { value: 'on', label: labels.dyslexia_on },
              ]}
              current={a11y.dyslexiaFont}
              onChange={(v) => a11y.setDyslexiaFont(v as A11yDyslexiaFont)}
              name="a11y-dyslexia"
            />
          </div>
          <div className="a11y-panel__footer">
            <button type="button" onClick={a11y.reset} className="a11y-panel__reset">
              {labels.reset}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Fieldset({
  legend,
  options,
  current,
  onChange,
  name,
}: {
  legend: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  current: string;
  onChange: (v: string) => void;
  name: string;
}): JSX.Element {
  return (
    <fieldset className="a11y-panel__fieldset">
      <legend className="a11y-panel__legend">{legend}</legend>
      <div role="radiogroup" className="a11y-panel__radiogroup">
        {options.map((opt) => {
          const checked = current === opt.value;
          return (
            <label key={opt.value} className={`a11y-panel__radio${checked ? ' is-checked' : ''}`}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
