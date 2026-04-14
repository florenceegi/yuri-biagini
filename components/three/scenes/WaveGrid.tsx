/**
 * @package YURI-BIAGINI — WaveGrid Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Grid of dots undulating like ocean waves, viewed from above
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRID = 80;
const SPACING = 0.25;

function Grid() {
  const meshRef = useRef<THREE.Points>(null);
  const count = GRID * GRID;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const idx = (i * GRID + j) * 3;
        pos[idx] = (i - GRID / 2) * SPACING;
        pos[idx + 1] = 0;
        pos[idx + 2] = (j - GRID / 2) * SPACING;
      }
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.6;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const idx = (i * GRID + j) * 3;
        const x = (i - GRID / 2) * SPACING;
        const z = (j - GRID / 2) * SPACING;
        pos[idx + 1] = Math.sin(x * 0.8 + t) * Math.cos(z * 0.6 + t * 0.7) * 0.8
          + Math.sin(x * 1.5 + z * 0.5 + t * 1.2) * 0.3;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#c8a97e" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function WaveGridScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 8, 8], fov: 50, near: 0.1, far: 100 }} dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#0a0a0a', 8, 25]} />
        <Grid />
      </Canvas>
    </div>
  );
}
