/**
 * @package YURI-BIAGINI — Root Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-10
 * @purpose Minimal root layout — locale layout handles providers and chrome
 */

import type { Metadata } from 'next';
import { Space_Grotesk, Cormorant_Garamond } from 'next/font/google';
import { getVariant } from '@/lib/variant';
import './globals.css';
import './variants.css';

const sansFont = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const serifFont = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://yuri-biagini.florenceegi.com'
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const variant = getVariant();

  return (
    <html className={`${sansFont.variable} ${serifFont.variable}`} data-variant={variant}>
      <body>{children}</body>
    </html>
  );
}
