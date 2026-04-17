/**
 * @package CREATOR-STAGING — CollectTrustStrip
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Five trust badges (blockchain, certificate, direct, payment, return).
 */

import type { ReactNode } from 'react';

export interface TrustStripLabels {
  title: string;
  blockchain_title: string;
  blockchain_desc: string;
  certificate_title: string;
  certificate_desc: string;
  direct_title: string;
  direct_desc: string;
  payment_title: string;
  payment_desc: string;
  return_title: string;
  return_desc: string;
}

interface Props {
  labels: TrustStripLabels;
}

interface Badge {
  key: string;
  title: string;
  desc: string;
  icon: ReactNode;
}

const iconClass = 'w-6 h-6';
const iconStroke = {
  stroke: 'var(--accent)',
  strokeWidth: 1.6,
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconBlockchain() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} {...iconStroke}>
      <path d="M12 2 3 7v10l9 5 9-5V7z" />
      <path d="M3 7l9 5 9-5" />
      <path d="M12 12v10" />
    </svg>
  );
}

function IconCertificate() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} {...iconStroke}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M8 8h8M8 12h5" />
      <path d="M9 17l-1 4 4-2 4 2-1-4" />
    </svg>
  );
}

function IconDirect() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} {...iconStroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconPayment() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} {...iconStroke}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

function IconReturn() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} {...iconStroke}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function CollectTrustStrip({ labels }: Props) {
  const badges: Badge[] = [
    { key: 'blockchain', title: labels.blockchain_title, desc: labels.blockchain_desc, icon: <IconBlockchain /> },
    { key: 'certificate', title: labels.certificate_title, desc: labels.certificate_desc, icon: <IconCertificate /> },
    { key: 'direct', title: labels.direct_title, desc: labels.direct_desc, icon: <IconDirect /> },
    { key: 'payment', title: labels.payment_title, desc: labels.payment_desc, icon: <IconPayment /> },
    { key: 'return', title: labels.return_title, desc: labels.return_desc, icon: <IconReturn /> },
  ];

  return (
    <section className="py-16 px-6" aria-labelledby="collect-trust-title">
      <div className="max-w-6xl mx-auto">
        <h2
          id="collect-trust-title"
          className="sr-only"
        >
          {labels.title}
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 list-none">
          {badges.map((b, idx) => (
            <li
              key={b.key}
              className={`flex flex-col items-center text-center gap-2 p-4 md:p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg)] border border-[var(--border)]"
              >
                {b.icon}
              </span>
              <h3 className="text-sm font-medium text-[var(--text-primary)]">{b.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{b.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
