'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProps {
  onLoadingComplete: () => void;
}

export default function Loading({ onLoadingComplete }: LoadingProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const [statusText, setStatusText] = useState("ACCESSING CORE...");

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 4,
      ease: 'circOut',
      onUpdate: (latest) => {
        if (latest > 30) setStatusText("DECRYPTING DATA...");
        if (latest > 70) setStatusText("RENDERING INTERFACE...");
      },
      onComplete: () => {
        setTimeout(onLoadingComplete, 500);
      },
    });

    return controls.stop;
  }, [count, onLoadingComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono"
    >
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        <motion.svg
          className="absolute w-full h-full"
          viewBox="0 0 200 200"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.circle cx="100" cy="100" r="90" stroke="rgba(57, 255, 20, 0.1)" strokeWidth="2" fill="transparent" strokeDasharray="10 15" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
          <motion.circle cx="100" cy="100" r="70" stroke="rgba(57, 255, 20, 0.2)" strokeWidth="2" fill="transparent" strokeDasharray="5 10" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
          <motion.circle cx="100" cy="100" r="50" stroke="rgba(57, 255, 20, 0.4)" strokeWidth="2" fill="transparent" />
        </motion.svg>
        <div className="relative z-10 text-center">
          <motion.span className="text-4xl md:text-5xl text-white font-bold">{rounded}</motion.span>
          <span className="text-4xl md:text-5xl text-green-400 font-light">%</span>
        </div>
      </div>
      <div className="mt-8 text-center h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-md md:text-lg tracking-[0.2em] text-green-400/80"
          >
            {statusText}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}