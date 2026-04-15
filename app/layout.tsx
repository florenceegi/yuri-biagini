/**
 * @package CREATOR-STAGING — Root Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-13
 * @purpose Root layout — loads all variant fonts, applies variant theme via data attribute
 */

import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Cormorant_Garamond, DM_Sans, DM_Serif_Display, Syne, Libre_Baskerville, Space_Mono } from 'next/font/google';
import { getVariant } from '@/lib/variant';
import { getAnimation } from '@/lib/animation';
import { getScene } from '@/lib/scene3d';
import { CreatorProvider } from '@/lib/creator-context';
import './globals.css';
import './variants.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://creator-staging.florenceegi.com'
  ),
};

const SITE_MODE = (process.env.SITE_MODE || 'configurator') as 'configurator' | 'production';
const FALLBACK_ARTIST_NAME = process.env.NEXT_PUBLIC_SITE_NAME || '';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const variant = await getVariant();
  const animation = await getAnimation();
  const scene = await getScene();

  const fontClasses = [
    spaceGrotesk.variable,
    cormorant.variable,
    dmSans.variable,
    dmSerif.variable,
    syne.variable,
    libreBaskerville.variable,
    spaceMono.variable,
  ].join(' ');

  return (
    <html className={fontClasses} data-variant={variant} data-animation={animation} data-scene={scene}>
      <body>
        <CreatorProvider
          siteMode={SITE_MODE}
          fallbackArtistName={FALLBACK_ARTIST_NAME}
        >
          {children}
        </CreatorProvider>
      </body>
    </html>
  );
}
