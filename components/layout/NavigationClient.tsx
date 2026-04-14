/**
 * @package CREATOR-STAGING — NavigationClient
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-13
 * @purpose Variant-aware navigation — different layout/position/style per template
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';
import { usePathname } from 'next/navigation';
import { useVariant } from '@/lib/hooks/useVariant';

type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
  locale: string;
  artistName: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  changeLangLabel: string;
};

export function NavigationClient({
  links, locale, artistName, openMenuLabel, closeMenuLabel, changeLangLabel,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const variant = useVariant();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const switchLocale = useCallback((newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  }, [pathname, locale]);

  // --- Template 06 Brutalist: nav at BOTTOM, accent bg ---
  if (variant === '06') {
    return (
      <>
        <header role="banner"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--accent)] border-t-2 border-[var(--text-primary)]">
          <nav aria-label="Main navigation"
            className="mx-auto max-w-7xl px-4 flex items-center justify-between h-12">
            <a href={`/${locale}`}
              className="text-sm uppercase tracking-wider text-white font-mono font-bold">
              {artistName}
            </a>
            <ul className="hidden lg:flex items-center gap-0" role="list">
              {links.map((link, i) => (
                <li key={link.href} className="flex items-center">
                  {i > 0 && <span className="text-white/50 mx-1">/</span>}
                  <a href={link.href}
                    className={`text-xs uppercase tracking-wider font-mono ${
                      pathname === link.href ? 'text-white font-bold' : 'text-white/80 hover:text-white'
                    }`}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="ml-4">
                <button onClick={() => setIsLangOpen(!isLangOpen)}
                  aria-label={changeLangLabel} aria-expanded={isLangOpen}
                  className="text-xs uppercase font-mono text-white/80 hover:text-white">
                  {locale.toUpperCase()}
                </button>
                {isLangOpen && (
                  <ul role="listbox" className="absolute bottom-full right-0 mb-1 bg-[var(--text-primary)] border-2 border-[var(--accent)] py-1 min-w-[100px]">
                    {locales.map((l) => (
                      <li key={l}>
                        <button role="option" aria-selected={l === locale} onClick={() => switchLocale(l)}
                          className={`w-full text-left px-3 py-1 text-xs font-mono uppercase ${
                            l === locale ? 'text-[var(--accent)]' : 'text-white hover:text-[var(--accent)]'
                          }`}>
                          {localeNames[l as Locale]}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel} aria-expanded={isMobileOpen}
              className="lg:hidden text-white text-xs uppercase font-mono font-bold">
              {isMobileOpen ? '✕' : openMenuLabel}
            </button>
          </nav>
        </header>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 bottom-12 bg-white z-40" role="dialog" aria-modal="true">
            <nav className="flex flex-col items-center justify-center h-full gap-4">
              {links.map((link) => (
                <a key={link.href} href={link.href}
                  className="text-xl uppercase font-mono font-bold text-black hover:text-[var(--accent)]">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </>
    );
  }

  // --- Template 05 Magazine: double-row nav ---
  if (variant === '05') {
    return (
      <>
        <header role="banner" className="sticky top-0 z-50 bg-[var(--bg)] border-b-2 border-[var(--text-primary)]">
          {/* Row 1: artist name + date */}
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-10 border-b border-[var(--border)]">
            <a href={`/${locale}`} className="text-2xl font-extralight text-[var(--text-primary)] tracking-wide"
               style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}>
              {artistName}
            </a>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider hidden md:block">
              {new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          {/* Row 2: centered links */}
          <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-6 hidden lg:flex items-center justify-center h-10 gap-8">
            {links.map((link) => (
              <a key={link.href} href={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  pathname === link.href ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}>
                {link.label}
              </a>
            ))}
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} aria-label={changeLangLabel}
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                {locale.toUpperCase()}
              </button>
              {isLangOpen && <LocaleDropdown localeVal={locale} switchLocale={switchLocale} />}
            </div>
          </nav>
          {/* Mobile */}
          <div className="lg:hidden flex items-center justify-end px-6 h-10">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel}
              className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              {isMobileOpen ? closeMenuLabel : openMenuLabel}
            </button>
          </div>
        </header>
        {isMobileOpen && <MobileDrawer links={links} locale={locale} pathname={pathname} switchLocale={switchLocale} />}
      </>
    );
  }

  // --- Template 02 Canvas: light, border-bottom ---
  const isLight = variant === '02' || variant === '04';

  // --- Default: 01 Oscura (blur), 02 Canvas (border), 03 Immersive (transparent), 04 Scroll ---
  const headerClasses = (() => {
    if (variant === '02') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--bg)] border-b border-[var(--border)] shadow-sm' : 'bg-[var(--bg)]'
      }`;
    }
    if (variant === '01') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[var(--bg)]/90 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-[var(--border)]' : 'bg-transparent'
      }`;
    }
    if (variant === '04') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--bg)]/95 backdrop-blur-sm' : 'bg-transparent'
      }`;
    }
    // 03 Immersive default
    return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]' : 'bg-transparent'
    }`;
  })();

  return (
    <>
      <header role="banner" className={headerClasses}>
        <nav aria-label="Main navigation"
          className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16 lg:h-20">
          <a href={`/${locale}`}
            className={`text-xl lg:text-2xl tracking-wide text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors ${
              variant === '02' ? 'font-bold' : 'font-light'
            }`}
            style={{ fontFamily: variant === '01' || variant === '04' ? 'var(--font-serif)' : 'var(--font-display, var(--font-sans))' }}>
            {artistName}
          </a>

          <ul className="hidden lg:flex items-center gap-8" role="list">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}
                  className={`text-sm uppercase tracking-widest transition-colors ${
                    pathname === link.href
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  } ${variant === '02' ? 'font-medium' : 'font-light'}`}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)}
                onBlur={() => setTimeout(() => setIsLangOpen(false), 150)}
                aria-label={changeLangLabel} aria-expanded={isLangOpen}
                className="text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                {locale.toUpperCase()}
              </button>
              {isLangOpen && <LocaleDropdown localeVal={locale} switchLocale={switchLocale} />}
            </li>
          </ul>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel} aria-expanded={isMobileOpen}
            className="lg:hidden flex flex-col gap-1.5 p-2">
            <span className={`w-6 h-0.5 bg-[var(--text-primary)] transition-transform ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-[var(--text-primary)] transition-opacity ${isMobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-[var(--text-primary)] transition-transform ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>
      </header>
      {isMobileOpen && <MobileDrawer links={links} locale={locale} pathname={pathname} switchLocale={switchLocale} isLight={isLight} />}
    </>
  );
}

function LocaleDropdown({ localeVal, switchLocale }: { localeVal: string; switchLocale: (l: string) => void }) {
  return (
    <ul role="listbox"
      className="absolute top-full right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg py-1 min-w-[140px] shadow-xl">
      {locales.map((l) => (
        <li key={l}>
          <button role="option" aria-selected={l === localeVal} onClick={() => switchLocale(l)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              l === localeVal
                ? 'text-[var(--accent)] bg-[var(--bg-surface)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }`}>
            {localeNames[l as Locale]}
          </button>
        </li>
      ))}
    </ul>
  );
}

function MobileDrawer({ links, locale, pathname, switchLocale, isLight }: {
  links: NavLink[]; locale: string; pathname: string; switchLocale: (l: string) => void; isLight?: boolean;
}) {
  return (
    <div className={`lg:hidden fixed inset-0 top-16 z-40 ${isLight ? 'bg-[var(--bg)]/98' : 'bg-[var(--bg)]/95 backdrop-blur-lg'}`}
      role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <nav className="flex flex-col items-center justify-center h-full gap-8">
        {links.map((link) => (
          <a key={link.href} href={link.href}
            className={`text-2xl uppercase tracking-widest transition-colors ${
              pathname === link.href ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}>
            {link.label}
          </a>
        ))}
        <div className="flex gap-4 mt-4">
          {locales.map((l) => (
            <button key={l} onClick={() => switchLocale(l)}
              className={`text-sm uppercase px-3 py-1 rounded border transition-colors ${
                l === locale
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
