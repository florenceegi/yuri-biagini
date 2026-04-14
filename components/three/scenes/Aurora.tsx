/**
 * @package YURI-BIAGINI — Aurora Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Northern lights effect — colored light bands undulating in space
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BAND_COUNT = 4;
const POINTS_PER_BAND = 120;

function AuroraBand({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const yBase = 1 + index * 1.2;
  const phaseOffset = index * 0.8;

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(20, 2, POINTS_PER_BAND, 1);
  }, []);

  const hue = 0.45 + index * 0.12; // green → cyan → blue → purple
  const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.3 + phaseOffset;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i <= POINTS_PER_BAND; i++) {
      const x = (i / POINTS_PER_BAND - 0.5) * 20;
      const wave = Math.sin(x * 0.4 + t) * Math.cos(x * 0.15 + t * 0.5) * 1.5;
      const flutter = Math.sin(x * 2 + t * 3) * 0.15;
      pos.array[i * 6 + 1] = wave + yBase + 1 + flutter;
      pos.array[i * 6 + 2] = Math.sin(x * 0.3 + t * 0.7) * 0.5;
      pos.array[i * 6 + 4] = wave + yBase - 1 + flutter;
      pos.array[i * 6 + 5] = Math.sin(x * 0.3 + t * 0.7) * 0.5 + 0.2;
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.25 - index * 0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

export default function AuroraScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        {Array.from({ length: BAND_COUNT }, (_, i) => (
          <AuroraBand key={i} index={i} />
        ))}
      </Canvas>
    </div>
  );
}
