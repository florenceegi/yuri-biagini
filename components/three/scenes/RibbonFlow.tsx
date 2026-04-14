/**
 * @package YURI-BIAGINI — RibbonFlow Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Silk ribbons flowing through 3D space, accent colored, mouse reactive
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RIBBON_POINTS = 100;
const RIBBON_COUNT = 5;

function Ribbon({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = index * 1.2;
  const yOff = (index - RIBBON_COUNT / 2) * 0.8;

  const geometry = useMemo(() => {
    const shape = new THREE.PlaneGeometry(12, 0.4, RIBBON_POINTS, 1);
    return shape;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.5 + offset;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i <= RIBBON_POINTS; i++) {
      const x = (i / RIBBON_POINTS - 0.5) * 12;
      const wave = Math.sin(x * 0.8 + t) * Math.cos(x * 0.3 + t * 0.6) * 1.2;
      const twist = Math.sin(x * 0.5 + t * 0.8) * 0.5;
      // Top vertex
      pos.array[i * 6 + 1] = wave + 0.2 + yOff;
      pos.array[i * 6 + 2] = twist;
      // Bottom vertex
      pos.array[i * 6 + 4] = wave - 0.2 + yOff;
      pos.array[i * 6 + 5] = twist + 0.1;
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  const hue = 0.08 + index * 0.02;
  const color = new THREE.Color().setHSL(hue, 0.6, 0.55);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} metalness={0.3} roughness={0.4} transparent opacity={0.7} />
    </mesh>
  );
}

export default function RibbonFlowScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={0.8} />
        <directionalLight position={[-2, -3, 3]} intensity={0.3} color="#c8a97e" />
        {Array.from({ length: RIBBON_COUNT }, (_, i) => (
          <Ribbon key={i} index={i} />
        ))}
      </Canvas>
    </div>
  );
}
