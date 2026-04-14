/**
 * @package YURI-BIAGINI — Crystal Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Slowly rotating crystalline geometry with refraction and reflections
 */

'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

function CrystalObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.2;
      innerRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      {/* Outer crystal */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshPhysicalMaterial
          color="#e8d5c4"
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={1.5}
          ior={2.4}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Inner glow */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#c8a97e" emissive="#c8a97e" emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function CrystalScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-3, -2, 4]} intensity={0.5} color="#c8a97e" />
        <spotLight position={[0, 8, 0]} intensity={0.6} angle={0.4} penumbra={1} />
        <Environment preset="studio" />
        <CrystalObject />
      </Canvas>
    </div>
  );
}
