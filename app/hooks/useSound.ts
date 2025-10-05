// app/hooks/useSound.ts

import { useMemo, useCallback } from 'react';

// 🔄 Hook diperbarui untuk menerima 'options' object (volume, loop)
export const useSound = (
  url: string,
  options: { volume?: number; loop?: boolean } = {}
) => {
  const { volume = 1, loop = false } = options;

  const audio = useMemo(() => {
    // Pastikan kode ini hanya berjalan di sisi client
    if (typeof window === 'undefined') {
      return null;
    }
    const audioInstance = new Audio(url);
    audioInstance.volume = volume;
    audioInstance.loop = loop;
    return audioInstance;
  }, [url, volume, loop]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio]);

  return { play, stop };
};