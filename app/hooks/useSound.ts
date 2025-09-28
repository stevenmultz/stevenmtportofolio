'use client';

import { useCallback } from 'react';

export const useSound = (src: string, volume = 0.5) => {
  const play = useCallback(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [src, volume]);

  return play;
};