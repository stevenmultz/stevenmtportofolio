'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
}

const TextScramble = ({ text, className, duration = 1 }: TextScrambleProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (i) => {
    return text
      .split('')
      .map((char, index) => {
        if (index < i) {
          return text[index];
        }
        if (char === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
  });

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: duration,
      ease: 'easeIn',
    });
    return controls.stop;
  }, [text, duration, count]);

  return <motion.span className={className}>{displayText}</motion.span>;
};

export default TextScramble;