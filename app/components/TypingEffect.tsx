'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

export const TypingEffect = ({ text, className }: { text: string; className?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (i) => text.slice(0, i));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: text.length / 50, // Sesuaikan kecepatan di sini
      ease: 'linear',
    });
    return controls.stop;
  }, [text, count]);

  return <p className={className}><motion.span>{displayText}</motion.span><span className="blinking-cursor">_</span></p>;
};