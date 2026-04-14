/**
 * @package YURI-BIAGINI — DotSphere Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Sphere made of thousands of dots, rotates, disperses on mouse hover
 */

'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DOT_COUNT = 4000;

function Dots() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const disperseRef = useRef(0);

  const { positions, originals } = useMemo(() => {
    const pos = new Float32Array(DOT_COUNT * 3);
    const orig = new Float32Array(DOT_COUNT * 3);

    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3;
      const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
      const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
      const r = 2.5;
      pos[i3] = orig[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = orig[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = orig[i3 + 2] = r * Math.cos(phi);
    }
    return { positions: pos, originals: orig };
  }, []);

  const onPointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    disperseRef.current = 1;
  }, []);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;

    disperseRef.current *= 0.98; // decay
    const d = disperseRef.current;

    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3;
      const ox = originals[i3], oy = originals[i3 + 1], oz = originals[i3 + 2];
      const noise = Math.sin(ox * 2 + t * 0.5) * 0.1 * d;
      pos[i3] = ox + ox * noise * d * 0.5;
      pos[i3 + 1] = oy + oy * noise * d * 0.5;
      pos[i3 + 2] = oz + oz * noise * d * 0.5;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <points ref={meshRef} onPointerMove={onPointerMove}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#c8a97e" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function DotSphereScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        <Dots />
      </Canvas>
    </div>
  );
}
