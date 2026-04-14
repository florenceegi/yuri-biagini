/**
 * @package CREATOR-STAGING — ConfigPanel
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Production configurator panel — creator chooses template, animation, 3D scene, subdomain
 */

'use client';

import { useState, useCallback } from 'react';
import { useCreator } from '@/lib/creator-context';
import { useVariant, type VariantId } from '@/lib/hooks/useVariant';
import { type AnimationId } from '@/lib/hooks/useAnimation';
import { type SceneId } from '@/lib/hooks/useScene';
import { SubdomainInput } from './SubdomainInput';
import { CommissionCTA } from './CommissionCTA';

/* ── Catalogue ──────────────────────────────────────────────── */

/* Brand names — not translated (like "iPhone", "MacBook Air") */
const TEMPLATE_IDS: VariantId[] = ['01', '02', '03', '04', '05', '06'];
const TEMPLATE_NAMES: Record<VariantId, string> = {
  '01': 'Galeria Oscura', '02': 'Canvas Vivo', '03': 'Immersive 3D',
  '04': 'Scrollytelling', '05': 'Magazine Art', '06': 'Brutalist Statement',
};
const TEMPLATE_COLORS: Record<VariantId, string> = {
  '01': '#C8A96E', '02': '#C4622D', '03': '#c8a97e',
  '04': '#D4A853', '05': '#E63946', '06': '#FF0000',
};

const ANIMATION_IDS: AnimationId[] = ['minimal', 'cinematic', 'energetic', 'editorial', 'fluid', 'none'];
const ANIMATION_ICONS: Record<AnimationId, string> = {
  minimal: '○', cinematic: '◐', energetic: '⚡', editorial: '▤', fluid: '◎', none: '—',
};

const SCENE_IDS: SceneId[] = [
  'particles', 'morph-sphere', 'wave-grid', 'floating-gallery', 'ribbon-flow',
  'crystal', 'noise-terrain', 'aurora', 'dot-sphere', 'smoke', 'none',
];

type Tab = 'template' | 'animation' | '3d' | 'site';

interface ConfigPanelProps {
  locale: string;
  labels: {
    toggle: string;
    tab_template: string;
    tab_animation: string;
    tab_3d: string;
    tab_site: string;
    /* Template descriptions (i18n) */
    tpl_01: string; tpl_02: string; tpl_03: string;
    tpl_04: string; tpl_05: string; tpl_06: string;
    /* Animation names (i18n) */
    anim_minimal: string; anim_cinematic: string; anim_energetic: string;
    anim_editorial: string; anim_fluid: string; anim_none: string;
    /* Scene names (i18n) */
    scene_particles: string; scene_morph_sphere: string; scene_wave_grid: string;
    scene_floating_gallery: string; scene_ribbon_flow: string; scene_crystal: string;
    scene_noise_terrain: string; scene_aurora: string; scene_dot_sphere: string;
    scene_smoke: string; scene_none: string;
    /* Site tab */
    subdomain_title: string;
    subdomain_placeholder: string;
    subdomain_suffix: string;
    subdomain_checking: string;
    subdomain_available: string;
    subdomain_taken: string;
    commission_title: string;
    commission_description: string;
    commission_button: string;
    current_combo: string;
  };
}

export function ConfigPanel({ locale, labels }: ConfigPanelProps) {
  const { siteMode, isAuthenticated, isLoading } = useCreator();
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

  const switchTo = useCallback((type: string, value: string) => {
    window.location.href = `/api/${type}?${type.charAt(0)}=${value}&redirect=${encodeURIComponent(path)}`;
  }, [path]);

  // Only render in configurator mode for authenticated users
  if (siteMode !== 'configurator') return null;
  if (isLoading || !isAuthenticated) return null;

  const activeColor = TEMPLATE_COLORS[currentVariant] || '#c8a97e';

  return (
    <div className="fixed top-4 right-4 z-[9999]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.75)',
          borderColor: activeColor,
        }}
        aria-label={labels.toggle}
        aria-expanded={isOpen}
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: activeColor }}
        />
        <span className="text-xs text-white/80 font-medium tracking-wide uppercase">
          {isOpen ? '✕' : labels.toggle}
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-[320px] max-h-[85vh] flex flex-col rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] backdrop-blur-md">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] flex-shrink-0">
            {([
              { key: 'template' as Tab, label: labels.tab_template },
              { key: 'animation' as Tab, label: labels.tab_animation },
              { key: '3d' as Tab, label: labels.tab_3d },
              { key: 'site' as Tab, label: labels.tab_site },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 px-1 py-2.5 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                  tab === key
                    ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-1">
            {/* Templates */}
            {tab === 'template' && (
              <div className="space-y-0.5">
                {TEMPLATE_IDS.map((id) => {
                  const desc = labels[`tpl_${id}` as keyof typeof labels];
                  return (
                    <button
                      key={id}
                      onClick={() => switchTo('variant', id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                        id === currentVariant ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]/50'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-[var(--border)]"
                        style={{ backgroundColor: TEMPLATE_COLORS[id] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[var(--text-primary)] font-medium">
                          <span className="text-[var(--text-muted)] mr-1">{id}</span> {TEMPLATE_NAMES[id]}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">{desc}</div>
                      </div>
                      {id === currentVariant && <span className="text-[var(--accent)] text-xs">●</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Animations */}
            {tab === 'animation' && (
              <div className="space-y-0.5">
                {ANIMATION_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => switchTo('animation', id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                      id === currentAnimation ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]/50'
                    }`}
                  >
                    <span className="w-6 text-center text-base text-[var(--text-muted)]">{ANIMATION_ICONS[id]}</span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {labels[`anim_${id}` as keyof typeof labels]}
                    </span>
                    {id === currentAnimation && <span className="ml-auto text-[var(--accent)] text-xs">●</span>}
                  </button>
                ))}
              </div>
            )}

            {/* 3D Scenes */}
            {tab === '3d' && (
              <div className="space-y-0.5">
                {SCENE_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => switchTo('scene', id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                      id === currentScene ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]/50'
                    }`}
                  >
                    <span className="w-6 text-center text-xs text-[var(--text-muted)] font-mono">
                      {id === 'none' ? '—' : '◆'}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {labels[`scene_${id.replace('-', '_')}` as keyof typeof labels]}
                    </span>
                    {id === currentScene && <span className="ml-auto text-[var(--accent)] text-xs">●</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Site config: subdomain + commission */}
            {tab === 'site' && (
              <div className="p-3 space-y-6">
                <SubdomainInput
                  labels={{
                    title: labels.subdomain_title,
                    placeholder: labels.subdomain_placeholder,
                    suffix: labels.subdomain_suffix,
                    checking: labels.subdomain_checking,
                    available: labels.subdomain_available,
                    taken: labels.subdomain_taken,
                  }}
                />
                <CommissionCTA
                  locale={locale}
                  labels={{
                    title: labels.commission_title,
                    description: labels.commission_description,
                    button: labels.commission_button,
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer — current combo */}
          <div className="px-3 py-2 bg-[var(--bg-elevated)] border-t border-[var(--border)] text-[9px] text-[var(--text-muted)] text-center flex-shrink-0">
            {TEMPLATE_NAMES[currentVariant]} × {currentAnimation} × {currentScene}
          </div>
        </div>
      )}
    </div>
  );
}
