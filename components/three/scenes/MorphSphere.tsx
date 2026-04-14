/**
 * @package YURI-BIAGINI — MorphSphere Scene
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Sphere deforming with Perlin noise, iridescent surface, mouse reactive
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const originalPositions = useRef<Float32Array | null>(null);

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(2.5, 64);
    originalPositions.current = new Float32Array(g.attributes.position.array);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !originalPositions.current) return;
    const t = clock.getElapsedTime() * 0.4;
    const pos = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.current;

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const ox = orig[i3], oy = orig[i3 + 1], oz = orig[i3 + 2];
      const noise = Math.sin(ox * 2 + t) * Math.cos(oy * 2 + t * 0.7) * Math.sin(oz * 2 + t * 0.5) * 0.3;
      const mouseInfluence = Math.sin(ox * mouseRef.current.x * 2 + t) * 0.15;
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const scale = 1 + noise + mouseInfluence;
      pos.array[i3] = (ox / len) * 2.5 * scale;
      pos.array[i3 + 1] = (oy / len) * 2.5 * scale;
      pos.array[i3 + 2] = (oz / len) * 2.5 * scale;
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={meshRef} geometry={geo}
      onPointerMove={(e) => { mouseRef.current = { x: e.point.x * 0.1, y: e.point.y * 0.1 }; }}>
      <meshStandardMaterial color="#c8a97e" metalness={0.7} roughness={0.2} wireframe={false} />
    </mesh>
  );
}

export default function MorphSphereScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, -3, 2]} intensity={0.4} color="#6699ff" />
        <Sphere />
      </Canvas>
    </div>
  );
}
