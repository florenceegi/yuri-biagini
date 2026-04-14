/**
 * @package YURI-BIAGINI — Smoke Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Volumetric smoke particles drifting slowly, accent colored on dark
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SMOKE_COUNT = 200;

function SmokeParticles() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    return Array.from({ length: SMOKE_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      scale: 1 + Math.random() * 3,
      speed: 0.1 + Math.random() * 0.3,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 0.03 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const mesh = child as THREE.Mesh;
      mesh.position.x = p.position[0] + Math.sin(t * p.speed + p.phase) * 0.5;
      mesh.position.y = p.position[1] + Math.cos(t * p.speed * 0.7 + p.phase) * 0.3;
      mesh.rotation.z += p.rotSpeed * 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#c8a97e" transparent opacity={p.opacity} side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function SmokeScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        <SmokeParticles />
      </Canvas>
    </div>
  );
}
