// app/page.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    
    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // PERBAIKAN: Menambahkan fungsi cleanup
    // Fungsi ini akan berjalan saat komponen di-unmount (atau saat Fast Refresh terjadi)
    // Ini akan menghentikan loop animasi dan membersihkan instance lenis,
    // sehingga tidak ada konflik saat komponen baru dibuat.
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="h-screen w-screen bg-black">
      <Canvas>
        <color attach="background" args={['#000000']} />
        <ScrollControls pages={5} damping={0.3} horizontal>
          <Experience />
          <Scroll html>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </main>
  );
}