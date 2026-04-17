/**
 * @package CREATOR-STAGING — FooterAccordion
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Mobile-only accordion wrapper per singola colonna del footer. Client component.
 */

'use client';

import { useId, useState, type ReactNode } from 'react';

type Props = {
  label: string;
  expandLabel: string;
  collapseLabel: string;
  children: ReactNode;
};

export function FooterAccordion({ label, expandLabel, collapseLabel, children }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-[var(--border)] md:border-b-0">
      {/* Mobile trigger — hidden on md+ */}
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? collapseLabel : expandLabel}
        className="md:hidden w-full flex items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-widest text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)]"
      >
        <span>{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
      </button>

      {/* Desktop heading — always visible md+, hidden on mobile */}
      <h3
        className="hidden md:block text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] mb-5"
      >
        {label}
      </h3>

      {/* Panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`${open ? 'block' : 'hidden'} md:block pb-4 md:pb-0`}
      >
        {children}
      </div>
    </div>
  );
}
