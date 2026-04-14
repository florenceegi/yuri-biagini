/**
 * @package CREATOR-STAGING — Creator Context
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose React Context for authenticated creator data — used in configurator mode
 */

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuthenticatedCreator, initSanctumCsrf, type AuthCreator } from '@/lib/egi/auth';

type SiteMode = 'configurator' | 'production';

interface CreatorContextValue {
  creator: AuthCreator | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  siteMode: SiteMode;
  artistId: number | null;
  artistName: string;
}

const CreatorContext = createContext<CreatorContextValue>({
  creator: null,
  isLoading: true,
  isAuthenticated: false,
  siteMode: 'configurator',
  artistId: null,
  artistName: '',
});

export function useCreator() {
  return useContext(CreatorContext);
}

interface CreatorProviderProps {
  children: ReactNode;
  siteMode: SiteMode;
  fallbackArtistId: string;
  fallbackArtistName: string;
}

export function CreatorProvider({
  children,
  siteMode,
  fallbackArtistId,
  fallbackArtistName,
}: CreatorProviderProps) {
  const [creator, setCreator] = useState<AuthCreator | null>(null);
  const [isLoading, setIsLoading] = useState(siteMode === 'configurator');

  useEffect(() => {
    if (siteMode !== 'configurator') return;

    async function loadCreator() {
      await initSanctumCsrf();
      const user = await getAuthenticatedCreator();
      setCreator(user);
      setIsLoading(false);
    }

    loadCreator();
  }, [siteMode]);

  const artistId = creator?.id ?? (fallbackArtistId ? Number(fallbackArtistId) : null);
  const artistName = creator?.display_name || fallbackArtistName;

  return (
    <CreatorContext.Provider
      value={{
        creator,
        isLoading,
        isAuthenticated: creator !== null,
        siteMode,
        artistId,
        artistName,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}
