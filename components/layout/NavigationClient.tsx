/**
 * @package CREATOR-STAGING — NavigationClient
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Variant-aware navigation with primary/secondary links + utility bar
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useVariant } from '@/lib/hooks/useVariant';
import { useCreator } from '@/lib/creator-context';
import { NavigationUtility, type UtilityLabels } from './NavigationUtility';
import {
  LocaleDropdown,
  MobileDrawer,
  MoreMenu,
  type NavLink,
} from './NavigationHelpers';

// ───────────────────────── Types ─────────────────────────

type Props = {
  primaryLinks: NavLink[];
  secondaryLinks: NavLink[];
  locale: string;
  artistName: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  changeLangLabel: string;
  moreLabel: string;
  utilityLabels: UtilityLabels;
};

// ───────────────────────── Component ─────────────────────────

export function NavigationClient({
  primaryLinks,
  secondaryLinks,
  locale,
  artistName: fallbackName,
  openMenuLabel,
  closeMenuLabel,
  changeLangLabel,
  moreLabel,
  utilityLabels,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const variant = useVariant();
  const { artistName: contextName } = useCreator();
  const artistName = contextName || fallbackName;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Escape closes lang dropdown
  useEffect(() => {
    if (!isLangOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setIsLangOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isLangOpen]);

  const switchLocale = useCallback(
    (newLocale: string) => {
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      window.location.href = `/${newLocale}${pathWithoutLocale}`;
    },
    [pathname, locale]
  );

  // ───── Variant 06 Brutalist: nav at BOTTOM, accent bg ─────
  if (variant === '06') {
    return (
      <>
        <header
          role="banner"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--accent)] border-t-2 border-[var(--text-primary)]"
        >
          <nav
            aria-label="Main navigation"
            className="mx-auto max-w-7xl px-4 flex items-center justify-between h-12"
          >
            <a
              href={`/${locale}`}
              aria-label={artistName}
              className="text-sm uppercase tracking-wider text-white font-mono font-bold"
            >
              {artistName}
            </a>
            <ul className="hidden lg:flex items-center gap-0" role="list">
              {primaryLinks.map((link, i) => (
                <li key={link.href} className="flex items-center">
                  {i > 0 && <span className="text-white/50 mx-1">/</span>}
                  <a
                    href={link.href}
                    className={`text-xs uppercase tracking-wider font-mono ${
                      pathname === link.href
                        ? 'text-white font-bold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {secondaryLinks.length > 0 && (
                <li className="flex items-center">
                  <span className="text-white/50 mx-1">/</span>
                  <MoreMenu
                    label={moreLabel}
                    links={secondaryLinks}
                    pathname={pathname}
                    openUpward
                  />
                </li>
              )}
              <li className="ml-3 brutalist-utility">
                <NavigationUtility locale={locale} compact labels={utilityLabels} />
              </li>
              <li className="ml-2 relative">
                <button
                  onClick={() => setIsLangOpen((v) => !v)}
                  aria-label={changeLangLabel}
                  aria-expanded={isLangOpen}
                  className="text-xs uppercase font-mono text-white/80 hover:text-white"
                >
                  {locale.toUpperCase()}
                </button>
                {isLangOpen && (
                  <LocaleDropdown
                    localeVal={locale}
                    switchLocale={switchLocale}
                    variant="brutalist"
                  />
                )}
              </li>
            </ul>
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={isMobileOpen}
              className="lg:hidden text-white text-xs uppercase font-mono font-bold"
            >
              {isMobileOpen ? '✕' : openMenuLabel}
            </button>
          </nav>
        </header>
        {isMobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bottom-12 bg-white z-40 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col items-center justify-center min-h-full gap-4 py-10">
              {primaryLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xl uppercase font-mono font-bold text-black hover:text-[var(--accent)]"
                >
                  {link.label}
                </a>
              ))}
              {secondaryLinks.length > 0 && (
                <>
                  <span aria-hidden="true" className="block w-12 h-px bg-black/30 my-2" />
                  {secondaryLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-base uppercase font-mono text-black/70 hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </>
              )}
              <div className="mt-4">
                <NavigationUtility locale={locale} compact labels={utilityLabels} />
              </div>
            </nav>
          </div>
        )}
      </>
    );
  }

  // ───── Variant 05 Magazine: double-row ─────
  if (variant === '05') {
    return (
      <>
        <header
          role="banner"
          className="sticky top-0 z-50 bg-[var(--bg)] border-b-2 border-[var(--text-primary)]"
        >
          {/* Row 1: artist name + date + utility */}
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-12 border-b border-[var(--border)] gap-4">
            <a
              href={`/${locale}`}
              aria-label={artistName}
              className="text-2xl font-extralight text-[var(--text-primary)] tracking-wide"
              style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}
            >
              {artistName}
            </a>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider hidden md:block">
                {new Date().toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <div className="hidden md:block">
                <NavigationUtility locale={locale} labels={utilityLabels} />
              </div>
            </div>
          </div>
          {/* Row 2: centered links */}
          <nav
            aria-label="Main navigation"
            className="mx-auto max-w-7xl px-6 hidden lg:flex items-center justify-center h-10 gap-8"
          >
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--accent)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </a>
            ))}
            {secondaryLinks.length > 0 && (
              <MoreMenu
                label={moreLabel}
                links={secondaryLinks}
                pathname={pathname}
              />
            )}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen((v) => !v)}
                aria-label={changeLangLabel}
                aria-expanded={isLangOpen}
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {locale.toUpperCase()}
              </button>
              {isLangOpen && (
                <LocaleDropdown localeVal={locale} switchLocale={switchLocale} />
              )}
            </div>
          </nav>
          {/* Mobile trigger */}
          <div className="lg:hidden flex items-center justify-end px-6 h-10">
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel}
              aria-expanded={isMobileOpen}
              className="text-xs uppercase tracking-widest text-[var(--text-secondary)]"
            >
              {isMobileOpen ? closeMenuLabel : openMenuLabel}
            </button>
          </div>
        </header>
        {isMobileOpen && (
          <MobileDrawer
            primaryLinks={primaryLinks}
            secondaryLinks={secondaryLinks}
            locale={locale}
            pathname={pathname}
            switchLocale={switchLocale}
            utilityLabels={utilityLabels}
          />
        )}
      </>
    );
  }

  // ───── Default: 01/02/03/04 ─────
  const isLight = variant === '02' || variant === '04';

  const headerClasses = (() => {
    if (variant === '02') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg)] border-b border-[var(--border)] shadow-sm'
          : 'bg-[var(--bg)]'
      }`;
    }
    if (variant === '01') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-[var(--border)]'
          : 'bg-transparent'
      }`;
    }
    if (variant === '04') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--bg)]/95 backdrop-blur-sm' : 'bg-transparent'
      }`;
    }
    // 03 Immersive default
    return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
        : 'bg-transparent'
    }`;
  })();

  return (
    <>
      <header role="banner" className={headerClasses}>
        <nav
          aria-label="Main navigation"
          className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16 lg:h-20 gap-4"
        >
          <a
            href={`/${locale}`}
            aria-label={artistName}
            className={`text-xl lg:text-2xl tracking-wide text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors shrink-0 ${
              variant === '02' ? 'font-bold' : 'font-light'
            }`}
            style={{
              fontFamily:
                variant === '01' || variant === '04'
                  ? 'var(--font-serif)'
                  : 'var(--font-display, var(--font-sans))',
            }}
          >
            {artistName}
          </a>

          <ul className="hidden lg:flex items-center gap-6 xl:gap-8" role="list">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-sm uppercase tracking-widest transition-colors ${
                    pathname === link.href
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  } ${variant === '02' ? 'font-medium' : 'font-light'}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {secondaryLinks.length > 0 && (
              <li>
                <MoreMenu
                  label={moreLabel}
                  links={secondaryLinks}
                  pathname={pathname}
                />
              </li>
            )}
            <li className="relative">
              <button
                onClick={() => setIsLangOpen((v) => !v)}
                aria-label={changeLangLabel}
                aria-expanded={isLangOpen}
                className="text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {locale.toUpperCase()}
              </button>
              {isLangOpen && (
                <LocaleDropdown localeVal={locale} switchLocale={switchLocale} />
              )}
            </li>
          </ul>

          {/* Utility bar (desktop right) */}
          <div className="hidden lg:flex items-center shrink-0">
            <NavigationUtility locale={locale} labels={utilityLabels} />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? closeMenuLabel : openMenuLabel}
            aria-expanded={isMobileOpen}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={`w-6 h-0.5 bg-[var(--text-primary)] transition-transform ${
                isMobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[var(--text-primary)] transition-opacity ${
                isMobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[var(--text-primary)] transition-transform ${
                isMobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </nav>
      </header>
      {isMobileOpen && (
        <MobileDrawer
          primaryLinks={primaryLinks}
          secondaryLinks={secondaryLinks}
          locale={locale}
          pathname={pathname}
          switchLocale={switchLocale}
          utilityLabels={utilityLabels}
          isLight={isLight}
        />
      )}
    </>
  );
}
