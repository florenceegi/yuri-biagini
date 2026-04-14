/**
 * @package YURI-BIAGINI — useScene Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Client-side 3D scene detection from data-scene attribute on <html>
 */

'use client';

import { useState, useEffect } from 'react';

export type SceneId = 'particles' | 'morph-sphere' | 'wave-grid' | 'floating-gallery' | 'ribbon-flow' | 'crystal' | 'noise-terrain' | 'aurora' | 'dot-sphere' | 'smoke' | 'none';

export function useScene(): SceneId {
  const [scene, setScene] = useState<SceneId>('particles');

  useEffect(() => {
    const s = document.documentElement.getAttribute('data-scene') as SceneId;
    if (s) setScene(s);
  }, []);

  return scene;
}
