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

      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-6xl font-bold cursor-pointer">
          <ScrambleText>STEVE MULYA TJENDRATAMA</ScrambleText>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.4 } }}
          className="mt-2 text-gray-400 text-sm md:text-base"
        >
          {"// SOFTWARE ENGINEER"}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, delay: 0.8 } }}
        onClick={onEnter}
        // Perbaiki posisi tombol untuk mobile
        className="absolute bottom-16 cursor-pointer"
      >
        <motion.div className="relative px-4 py-2" whileHover="hover" initial="rest">
          <motion.div 
            variants={{ hover: { scaleY: 1 }, rest: { scaleY: 0 } }}
            transition={{ duration: 0.2 }}
            style={{ originY: 1 }}
            className="absolute inset-0 bg-green-400 z-0"
          />
          {/* Tambahkan background default agar teks terlihat di mobile */}
          <span className="relative z-10 text-md md:text-lg font-bold text-black md:text-white" style={{ mixBlendMode: 'difference' }}>
            [ PORTOFOLIO ]
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}