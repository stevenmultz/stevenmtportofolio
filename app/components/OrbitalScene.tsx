// app/components/OrbitalScene.tsx
'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Project } from '../data/portfolioData';

// Komponen untuk satu proyek yang mengorbit
function OrbitingProject({ project, index, total, onProjectClick }: any) {
  const ref = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2; // Sudut orbit
  const radius = 5; // Jari-jari orbit

  useFrame(({ clock }) => {
    if (ref.current) {
      // Kalkulasi posisi orbit
      const x = Math.cos(clock.getElapsedTime() * 0.1 + angle) * radius;
      const z = Math.sin(clock.getElapsedTime() * 0.1 + angle) * radius;
      ref.current.position.set(x, 0, z);
      // Selalu menghadap ke kamera
      ref.current.lookAt(0, 0, 10);
    }
  });

  const textMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isHovered ? '#FFFFFF' : '#AAAAAA',
    emissive: isHovered ? '#FFFFFF' : '#000000',
    emissiveIntensity: isHovered ? 0.5 : 0,
  }), [isHovered]);

  return (
    <group
      ref={ref}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => onProjectClick(project)}
    >
      <Text
        font="/fonts/Satoshi-Bold.woff"
        fontSize={0.4}
        position={[0, 0.5, 0.1]}
        material={textMaterial}
      >
        {project.title}
      </Text>
      <RoundedBox args={[2, 0.7, 0.1]} radius={0.05}>
         <meshStandardMaterial color={isHovered ? '#FFFFFF' : '#333333'} emissive={isHovered ? '#FFFFFF' : '#000000'} emissiveIntensity={isHovered ? 0.1 : 0} />
      </RoundedBox>
    </group>
  );
}

// Komponen utama untuk scene 3D
export default function OrbitalScene({ projects, onProjectClick }: { projects: Project[], onProjectClick: (project: Project) => void }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 5, 5]} intensity={50} color="#ffffff" />
      
      {/* Partikel-partikel di background */}
      <Points />

      {projects.map((project, index) => (
        <OrbitingProject
          key={project.title}
          project={project}
          index={index}
          total={projects.length}
          onProjectClick={onProjectClick}
        />
      ))}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </>
  );
}

// Komponen untuk partikel bintang
function Points() {
    const count = 5000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    // PERBAIKAN: Pindahkan `positions` dan `3` ke dalam prop `args`
                    args={[positions, 3]} 
                />
            </bufferGeometry>
            <pointsMaterial size={0.01} color="#555555" />
        </points>
    );
}