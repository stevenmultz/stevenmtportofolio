'use client';

import { useCallback } from 'react';

export const useSound = (src: string, volume = 1.0) => {
  const playSound = useCallback(() => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(error => {
        // Mencegah error jika interaksi pengguna belum terjadi
        console.error("Audio play failed:", error);
      });
    } catch (error) {
      console.error("Failed to create audio object:", error);
    }
  }, [src, volume]);

  return playSound;
};