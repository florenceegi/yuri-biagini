/**
 * @package YURI-BIAGINI — HeroWrapper
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Renders the active 3D scene — switchable via cookie/switcher
 */

'use client';

import { Scene3DSwitch } from '@/components/three/Scene3DSwitch';

export function HeroWrapper() {
  return <Scene3DSwitch />;
}
