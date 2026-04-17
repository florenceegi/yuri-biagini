/**
 * @package CREATOR-STAGING — Web Components Types
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Ambient JSX types for cross-organ web components (e.g. <lso-ecosystem>).
 *          Ambient .d.ts files are the canonical location for namespace augmentations —
 *          avoids @typescript-eslint/no-namespace in .tsx sources.
 */

import type React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lso-ecosystem': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        current?: string;
      };
    }
  }
}

export {};
