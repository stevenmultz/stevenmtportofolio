// app/components/LoadingScreen.tsx
import { motion, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (counter) {
      const controls = animate(0, 100, {
        duration: 2.5,
        ease: "easeInOut",
        onUpdate: (value) => {
          counter.textContent = Math.round(value).toString();
        },
        onComplete: onLoadingComplete,
      });
      return () => controls.stop();
    }
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="font-mono text-5xl text-white">
        <span ref={counterRef}>0</span>%
      </div>
      <p className="mt-4 text-sm uppercase tracking-widest text-neutral-400">Initializing Workstation</p>
    </motion.div>
  );
}