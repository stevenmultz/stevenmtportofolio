// app/components/Experience.tsx
'use client';
import { useThree, useFrame } from '@react-three/fiber';
import { useScroll, Float, Sparkles } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const TimeMarker = () => {
  return (
    <Float speed={2} floatIntensity={1}>
        <mesh>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={2} toneMapped={false} />
        </mesh>
    </Float>
  );
};

export function Experience() {
  const { viewport } = useThree();
  const scroll = useScroll();
  const timeMarkerRef = useRef<THREE.Group>(null);

  // Membuat jalur 3D untuk pergerakan kamera
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(5, 0, -20),
      new THREE.Vector3(-5, 0, -30),
      new THREE.Vector3(0, 0, -40),
    ]);
  }, []);

  useFrame((state, delta) => {
    const scrollOffset = scroll.offset;
    
    // Mendapatkan posisi di jalur berdasarkan scroll
    const currentPoint = curve.getPoint(scrollOffset);
    if(timeMarkerRef.current) {
        timeMarkerRef.current.position.copy(currentPoint);
    }
    
    // Kamera mengikuti Time Marker dengan sedikit jeda (lerp)
    state.camera.position.lerp(new THREE.Vector3(currentPoint.x, currentPoint.y + 0.5, currentPoint.z + 5), delta * 1.5);
    state.camera.lookAt(currentPoint);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <group ref={timeMarkerRef}>
        <TimeMarker />
      </group>
      <Sparkles count={200} scale={[20, 20, 10]} size={1} speed={0.5} />
    </>
  );
}