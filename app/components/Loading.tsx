'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

// Props untuk memberitahu parent component bahwa loading sudah selesai
interface LoadingProps {
  onLoadingComplete: () => void;
}

export default function Loading({ onLoadingComplete }: LoadingProps) {
  // Motion value untuk menganimasikan angka dari 0 ke 100
  const count = useMotionValue(0);
  // Transform untuk membulatkan angka (agar tidak ada desimal)
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 3, // Durasi total animasi loading (dalam detik)
      ease: 'easeInOut',
      onComplete: () => {
        // Panggil fungsi callback setelah 0.5 detik untuk transisi
        setTimeout(onLoadingComplete, 500);
      },
    });

    // Cleanup function untuk menghentikan animasi jika komponen unmount
    return controls.stop;
  }, [count, onLoadingComplete]);

  return (
    <motion.div
      // Animasi saat komponen hilang (exit)
      exit={{ 
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        transition: { duration: 0.8, ease: 'easeOut' } 
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono"
    >
      {/* Simbol Hexagon dengan Animasi */}
      <motion.svg
        width="100"
        height="115"
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M50 2.5L97.5 30V85L50 112.5L2.5 85V30L50 2.5Z"
          stroke="#39FF14"
          strokeWidth="3"
          // Animasi "drawing"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        {/* Efek denyut/pulse pada hexagon */}
        <motion.path
          d="M50 2.5L97.5 30V85L50 112.5L2.5 85V30L50 2.5Z"
          stroke="#39FF14"
          strokeWidth="3"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </motion.svg>

      {/* Teks Status dan Counter Persentase */}
      <div className="mt-8 text-center">
        <p className="text-lg tracking-[0.2em] text-green-400/80">
          SYSTEM KERNEL INITIALIZING
        </p>
        <div className="flex items-center justify-center mt-2 text-2xl text-white">
          <motion.span>{rounded}</motion.span>
          <span>%</span>
        </div>
      </div>
    </motion.div>
  );
}