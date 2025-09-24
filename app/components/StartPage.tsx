// app/components/StartPage.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Komponen untuk efek scramble text on hover
const ScrambleText = ({ children }: { children: string }) => {
  const [text, setText] = useState(children);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const scramble = () => {
    let i = 0;
    const interval = setInterval(() => {
      setText(
        children
          .split("")
          .map((char, index) => {
            if (i > index) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (i >= children.length) clearInterval(interval);
      i += 1 / 3;
    }, 30);
  };

  return <span onMouseEnter={scramble} onTouchStart={scramble}>{text}</span>;
};

interface StartPageProps {
  onEnter: () => void;
}

export default function StartPage({ onEnter }: StartPageProps) {
  return (
    <motion.div
      exit={{ clipPath: 'inset(50% 0 50% 0)', transition: { duration: 0.8, ease: "easeOut" } }}
      className="fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black text-white p-4 md:p-8"
    >
      <div className="absolute inset-2 border-2 border-gray-700"></div>

      {/* Kontainer untuk teks dan tombol */}
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-6xl font-bold cursor-pointer">
          <ScrambleText>STEVEN MULYA TJENDRATAMA</ScrambleText>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.4 } }}
          className="mt-2 text-gray-400 text-sm md:text-base"
        >
          {"// SOFTWARE ENGINEER"}
        </motion.p>

        {/* --- TOMBOL DIPINDAHKAN KE SINI --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.8 } }}
          onClick={onEnter}
          // --- UBAH CLASS INI ---
          // mt-8: Memberi jarak atas di mobile
          // md:absolute: Menjadi absolute HANYA di layar medium ke atas
          // md:bottom-16: Posisi bawah HANYA di layar medium ke atas
          className="mt-10 cursor-pointer md:absolute md:bottom-16 md:left-0 md:right-0"
        >
          <motion.div className="relative inline-block px-4 py-2" whileHover="hover" initial="rest">
            <motion.div 
              variants={{ hover: { scaleY: 1 }, rest: { scaleY: 0 } }}
              transition={{ duration: 0.2 }}
              style={{ originY: 1 }}
              className="absolute inset-0 bg-green-400 z-0"
            />
            <span className="relative z-10 text-md md:text-lg font-bold mix-blend-difference">
              [ PORTOFOLIO ]
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Tombol yang lama dihapus dari sini */}
    </motion.div>
  );
}