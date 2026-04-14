/**
 * @package YURI-BIAGINI — FloatingGallery Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Artwork cards floating in 3D space, slowly rotating, subtle parallax
 */

'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CARD_COUNT = 8;

function FloatingCard({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / CARD_COUNT) * Math.PI * 2;
  const radius = 3.5;
  const yOffset = (Math.random() - 0.5) * 2;
  const phase = index * 0.7;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.2 + phase;
    meshRef.current.position.x = Math.cos(angle + t * 0.3) * radius;
    meshRef.current.position.z = Math.sin(angle + t * 0.3) * radius;
    meshRef.current.position.y = yOffset + Math.sin(t + phase) * 0.3;
    meshRef.current.rotation.y = -(angle + t * 0.3) + Math.PI;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
  });

  // Different subtle tones for each card
  const hue = 0.06 + (index * 0.01);
  const color = new THREE.Color().setHSL(hue, 0.3, 0.4 + index * 0.03);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.6, 2.2]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CardFrames() {
  return (
    <group>
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <FloatingCard key={i} index={i} />
      ))}
    </group>
  );
}

export default function FloatingGalleryScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#0a0a0a', 5, 18]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={0.4} color="#c8a97e" />
        <CardFrames />
      </Canvas>
    </div>
  );
}
