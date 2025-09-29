'use client';

import { useEffect, useRef } from 'react';

export const useSound = (src: string, volume: number = 1.0) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Cek ini memastikan audio hanya dibuat di sisi klien (browser)
        if (typeof window !== 'undefined') {
            const audio = new Audio(src);
            audio.volume = volume;
            audioRef.current = audio;
        }
    }, [src, volume]);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Mulai dari awal setiap kali
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    };

    return playSound;
};