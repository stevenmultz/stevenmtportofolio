// app/components/Loading.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Teks boot sequence yang lebih realistis
const bootSequence = `
INITIATING KERNEL V5.8.1-MULATAMA
MEMORY CHECK: 2048MB RAM... OK
DETECTING HARDWARE...
  > CPU: INTEL CORE I9 @ 3.60GHZ
  > GPU: NVIDIA RTX 4090
  > STORAGE: 1TB NVME SSD
LOADING ASSETS... [||||||||||||||||||||] 100%
DECRYPTING DATA... COMPLETE

SYSTEM READY. AWAITING COMMAND...
>> EXECUTING: MULATAMA.EXE
`;

export default function Loading() {
  const [log, setLog] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i < bootSequence.length) {
        setLog(bootSequence.substring(0, i + 1));
        i++;
        setTimeout(type, 10); // Kecepatan mengetik (lebih cepat)
      } else {
        // Hentikan kedipan saat selesai untuk kursor solid
        setShowCursor(false); 
      }
    };
    type();

    // Pastikan kursor berkedip lagi setelah selesai mengetik
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 800); // Kecepatan kedip kursor

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
      // Optimasi untuk mobile: menggunakan p-4 (default) dan md:p-8
      className="fixed inset-0 z-50 flex items-start justify-start bg-black p-4 md:p-8 overflow-hidden"
    >
      <pre 
        // Menggunakan text-sm (default) untuk mobile dan md:text-base untuk desktop
        // Gunakan `leading-snug` untuk jarak antar baris yang lebih rapat
        className="text-sm md:text-base font-normal text-green-400 leading-snug"
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        {log}
        {/* Kursor yang berkedip */}
        <motion.span
          // Animasi kursor hanya jika showCursor bernilai true
          animate={{ opacity: showCursor ? [0, 1, 0] : 1 }}
          transition={{ duration: 0.8, repeat: Infinity }}
          // Ukuran kursor disesuaikan dengan ukuran teks
          className="bg-green-400 w-2 h-4 md:w-3 md:h-5 inline-block"
        >
          &nbsp;
        </motion.span>
      </pre>
    </motion.div>
  );
}