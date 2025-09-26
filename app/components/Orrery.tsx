// app/components/Orrery.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const Orb = ({ radius, speed, color }: { radius: number, speed: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
};

const OrreryCore = () => (
  <group>
    <mesh>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial wireframe color="#fff" />
    </mesh>
    <Orb radius={1.5} speed={0.5} color="#00ffff" />
    <Orb radius={2.5} speed={0.3} color="#ff00ff" />
    <Orb radius={3.5} speed={0.2} color="#ffff00" />
  </group>
);

export default function Orrery() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={100} />
      <OrreryCore />
    </Canvas>
  );
}