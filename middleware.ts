/**
 * @package CREATOR-STAGING — Middleware
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.1 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose next-intl middleware for locale routing and detection (7 locales: it/en/fr/de/es/pt/zh)
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(it|en|fr|de|es|pt|zh)/:path*'],
};
