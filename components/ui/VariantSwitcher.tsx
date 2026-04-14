/**
 * @package YURI-BIAGINI — VariantSwitcher
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Floating dev panel — switch template + animation + 3D scene live
 */

'use client';

import { useState } from 'react';
import { useVariant, type VariantId } from '@/lib/hooks/useVariant';
import { type AnimationId } from '@/lib/hooks/useAnimation';
import { type SceneId } from '@/lib/hooks/useScene';

const VARIANT_NAMES: Record<VariantId, string> = {
  '01': 'Galeria Oscura', '02': 'Canvas Vivo', '03': 'Immersive 3D',
  '04': 'Scrollytelling', '05': 'Magazine Art', '06': 'Brutalist Statement',
};
const VARIANT_COLORS: Record<VariantId, string> = {
  '01': '#C8A96E', '02': '#C4622D', '03': '#c8a97e',
  '04': '#D4A853', '05': '#E63946', '06': '#FF0000',
};

const ANIMATION_LIST: { id: AnimationId; name: string; desc: string; icon: string }[] = [
  { id: 'minimal', name: 'Minimal', desc: 'Subtle fades', icon: '○' },
  { id: 'cinematic', name: 'Cinematic', desc: 'Slow reveals, parallax', icon: '◐' },
  { id: 'energetic', name: 'Energetic', desc: 'Bouncy, fast, pops', icon: '⚡' },
  { id: 'editorial', name: 'Editorial', desc: 'Clip-path, masks', icon: '▤' },
  { id: 'fluid', name: 'Fluid', desc: 'Blur morphs, smooth', icon: '◎' },
  { id: 'none', name: 'No Animation', desc: 'Instant display', icon: '—' },
];

const SCENE_LIST: { id: SceneId; name: string; desc: string }[] = [
  { id: 'particles', name: 'Particle Field', desc: 'Floating particles, mouse reactive' },
  { id: 'morph-sphere', name: 'Morphing Sphere', desc: 'Perlin noise deformation' },
  { id: 'wave-grid', name: 'Wave Grid', desc: 'Ocean-like dot grid' },
  { id: 'floating-gallery', name: 'Floating Gallery', desc: 'Cards orbiting in space' },
  { id: 'ribbon-flow', name: 'Ribbon Flow', desc: 'Silk ribbons flowing' },
  { id: 'crystal', name: 'Crystal', desc: 'Refractive rotating gem' },
  { id: 'noise-terrain', name: 'Noise Terrain', desc: 'Generative landscape dunes' },
  { id: 'aurora', name: 'Aurora', desc: 'Northern lights bands' },
  { id: 'dot-sphere', name: 'Dot Sphere', desc: 'Sphere of dots, disperses' },
  { id: 'smoke', name: 'Smoke', desc: 'Volumetric drift' },
  { id: 'none', name: 'No 3D', desc: 'Plain background' },
];

type Tab = 'template' | 'animation' | '3d';

export function VariantSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('template');
  const currentVariant = useVariant();

  const getAttr = (name: string, fallback: string) => {
    if (typeof document === 'undefined') return fallback;
    return document.documentElement.getAttribute(name) || fallback;
  };

  const currentAnimation = getAttr('data-animation', 'cinematic');
  const currentScene = getAttr('data-scene', 'particles');
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  const switchVariant = (v: VariantId) => {
    window.location.href = `/api/variant?v=${v}&redirect=${encodeURIComponent(path)}`;
  };
  const switchAnimation = (a: AnimationId) => {
    window.location.href = `/api/animation?a=${a}&redirect=${encodeURIComponent(path)}`;
  };
  const switchScene = (s: SceneId) => {
    window.location.href = `/api/scene?s=${s}&redirect=${encodeURIComponent(path)}`;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: VARIANT_COLORS[currentVariant] }}
        aria-label="Open switcher">
        {currentVariant}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-[280px] max-h-[80vh] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {(['template', 'animation', '3d'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 px-2 py-2 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                  tab === t ? 'text-gray-900 bg-gray-50' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {t === '3d' ? '3D Scene' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Content — scrollable */}
          <div className="overflow-y-auto flex-1">
            {tab === 'template' && (
              <div>
                {(Object.entries(VARIANT_NAMES) as [VariantId, string][]).map(([id, name]) => (
                  <button key={id} onClick={() => switchVariant(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                      id === currentVariant ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
                    }`}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-300"
                      style={{ backgroundColor: VARIANT_COLORS[id] }} />
                    <span className="text-gray-800">
                      <span className="text-gray-400 mr-1">{id}</span> {name}
                    </span>
                    {id === currentVariant && <span className="ml-auto text-[10px] text-gray-400">●</span>}
                  </button>
                ))}
              </div>
            )}

            {tab === 'animation' && (
              <div>
                {ANIMATION_LIST.map(({ id, name, desc, icon }) => (
                  <button key={id} onClick={() => switchAnimation(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      id === currentAnimation ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
                    }`}>
                    <span className="w-5 text-center text-base text-gray-500">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800">{name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{desc}</div>
                    </div>
                    {id === currentAnimation && <span className="text-[10px] text-gray-400">●</span>}
                  </button>
                ))}
              </div>
            )}

            {tab === '3d' && (
              <div>
                {SCENE_LIST.map(({ id, name, desc }) => (
                  <button key={id} onClick={() => switchScene(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      id === currentScene ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
                    }`}>
                    <span className="w-5 text-center text-xs text-gray-400 font-mono">
                      {id === 'none' ? '—' : '◆'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800">{name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{desc}</div>
                    </div>
                    {id === currentScene && <span className="text-[10px] text-gray-400">●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current combo */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-[9px] text-gray-400 text-center flex-shrink-0">
            {VARIANT_NAMES[currentVariant]} × {currentAnimation} × {currentScene}
          </div>
        </div>
      )}
    </div>
  );
}
