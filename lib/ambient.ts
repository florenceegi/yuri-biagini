/**
 * @package CREATOR-STAGING — Ambient Logic
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose Ambient slot computation + next-boundary + AmbientLightSensor hook
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { getAmbientSlot, type AmbientSlot } from './theme-context';

export type { AmbientSlot };

// ───────────────────────── Pure functions ─────────────────────────

/**
 * Variante di getAmbientSlot che accetta data esplicita.
 * Utile per test e override futuri. Delega a getAmbientSlot (SSOT).
 */
export function getAmbientSlotAt(date: Date): AmbientSlot {
  return getAmbientSlot(date);
}

/**
 * Confini orari degli slot (hour, 0-23). Ordine crescente.
 * Deve restare coerente con getAmbientSlot in theme-context.tsx.
 */
const SLOT_BOUNDARIES_HOURS: readonly number[] = [5, 7, 11, 16, 18, 20, 23] as const;

/**
 * Ritorna la Date della prossima transizione slot rispetto a `date`.
 * Esempio: 16:45 → Date di oggi 18:00:00.000
 * Se non esiste un boundary successivo nella giornata → domani alle 05:00.
 */
export function getNextSlotBoundary(date: Date): Date {
  const h = date.getHours();
  const next = new Date(date);
  next.setMinutes(0, 0, 0);

  for (const boundary of SLOT_BOUNDARIES_HOURS) {
    if (boundary > h) {
      next.setHours(boundary);
      return next;
    }
  }

  // Oltre l'ultimo boundary (23) → domani alle 05:00
  next.setDate(next.getDate() + 1);
  next.setHours(5);
  return next;
}

export interface SlotDescriptor {
  label: string;
  hours: string;
  palette: string;
}

const SLOT_DESCRIPTORS: Readonly<Record<AmbientSlot, SlotDescriptor>> = {
  dawn:    { label: 'Dawn',    hours: '05:00—07:00', palette: 'Peach & rose' },
  morning: { label: 'Morning', hours: '07:00—11:00', palette: 'Ivory crisp' },
  day:     { label: 'Day',     hours: '11:00—16:00', palette: 'High contrast' },
  golden:  { label: 'Golden',  hours: '16:00—18:00', palette: 'Amber warmth' },
  sunset:  { label: 'Sunset',  hours: '18:00—20:00', palette: 'Orange to violet' },
  evening: { label: 'Evening', hours: '20:00—23:00', palette: 'Warm dark' },
  night:   { label: 'Night',   hours: '23:00—05:00', palette: 'Deep calm' },
};

/**
 * Meta-info per UI picker / tooltip slot.
 */
export function getSlotDescriptor(slot: AmbientSlot): SlotDescriptor {
  return SLOT_DESCRIPTORS[slot];
}

// ───────────────────────── AmbientLightSensor ─────────────────────

export type AmbientLightLevel = 'low' | 'medium' | 'high';

export interface UseAmbientLightResult {
  supported: boolean;
  lux: number | null;
  level: AmbientLightLevel | null;
}

// Minimal type declaration per AmbientLightSensor (non nativa in TS lib DOM)
interface AmbientLightSensorInstance {
  illuminance: number;
  start: () => void;
  stop: () => void;
  addEventListener: (type: string, cb: () => void) => void;
  removeEventListener: (type: string, cb: () => void) => void;
}

type AmbientLightSensorCtor = new () => AmbientLightSensorInstance;

function getSensorCtor(): AmbientLightSensorCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { AmbientLightSensor?: AmbientLightSensorCtor };
  return typeof w.AmbientLightSensor === 'function' ? w.AmbientLightSensor : null;
}

function categorizeLux(lux: number): AmbientLightLevel {
  if (lux < 50) return 'low';
  if (lux <= 500) return 'medium';
  return 'high';
}

const LUX_THROTTLE_MS = 500;

/**
 * Hook wrapper su AmbientLightSensor (Chrome/Edge desktop con flag).
 * Fallback pulito se API non disponibile: supported=false, lux/level=null.
 * Throttle reading ogni 500ms, categorizza level (< 50 low, 50-500 medium, > 500 high).
 * Cleanup sensor + listener su unmount.
 */
export function useAmbientLight(): UseAmbientLightResult {
  const [state, setState] = useState<UseAmbientLightResult>({
    supported: false,
    lux: null,
    level: null,
  });

  const lastReadRef = useRef<number>(0);

  useEffect(() => {
    const Ctor = getSensorCtor();
    if (!Ctor) {
      // Resta { supported: false, lux: null, level: null }
      return;
    }

    let sensor: AmbientLightSensorInstance | null = null;
    let active = true;

    setState((s) => ({ ...s, supported: true }));

    const onReading = (): void => {
      if (!active || !sensor) return;
      const now = Date.now();
      if (now - lastReadRef.current < LUX_THROTTLE_MS) return;
      lastReadRef.current = now;

      const lux = sensor.illuminance;
      if (typeof lux !== 'number' || !Number.isFinite(lux)) return;

      setState({ supported: true, lux, level: categorizeLux(lux) });
    };

    const onError = (): void => {
      if (!active) return;
      // Permessi negati o sensor indisponibile: degrada a non-supportato runtime
      setState({ supported: false, lux: null, level: null });
    };

    try {
      sensor = new Ctor();
      sensor.addEventListener('reading', onReading);
      sensor.addEventListener('error', onError);
      sensor.start();
    } catch {
      // SecurityError / NotAllowedError / ReferenceError
      active = false;
      setState({ supported: false, lux: null, level: null });
      return;
    }

    return () => {
      active = false;
      if (sensor) {
        try {
          sensor.removeEventListener('reading', onReading);
          sensor.removeEventListener('error', onError);
          sensor.stop();
        } catch {
          // swallow — unmount path
        }
        sensor = null;
      }
    };
  }, []);

  return state;
}
