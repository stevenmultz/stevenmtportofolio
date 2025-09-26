// app/components/Monolith.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Box } from '@react-three/drei';
import { useRef } from 'react';

const MonolithObject = () => {
  const meshRef = useRef<any>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 2, 0.2]} position={[0, 0, 0]}>
        <MeshReflectorMaterial
            color="#111"
            metalness={0.9}
            roughness={0.1}
            mirror={1}
        />
    </Box>
  );
};

export default function Monolith() {
    return (
        <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <MonolithObject />
        </Canvas>
    )
}