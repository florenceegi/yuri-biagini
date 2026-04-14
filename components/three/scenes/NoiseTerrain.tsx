/**
 * @package YURI-BIAGINI — NoiseTerrain Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Generative landscape with moving dunes, top-down camera
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SIZE = 60;
const SEGMENTS = 120;

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const height =
        Math.sin(x * 0.15 + t) * Math.cos(y * 0.12 + t * 0.8) * 2 +
        Math.sin(x * 0.3 + y * 0.2 + t * 1.5) * 0.8 +
        Math.cos(x * 0.08 - t * 0.3) * Math.sin(y * 0.1 + t * 0.5) * 1.5;
      pos.setZ(i, height);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -3, 0]}>
      <meshStandardMaterial color="#8a7060" metalness={0.2} roughness={0.8} wireframe={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function NoiseTerrainScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 12, 15], fov: 50 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#0a0a0a', 10, 40]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 15, 5]} intensity={0.8} color="#c8a97e" />
        <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#667799" />
        <Terrain />
      </Canvas>
    </div>
  );
}
