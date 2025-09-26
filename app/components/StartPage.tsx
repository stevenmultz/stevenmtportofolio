'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Komponen ScrambleText untuk judul utama (tidak diubah)
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

// =============================================================
// === Komponen Ornamen untuk Estetika Tambahan ===
// =============================================================

// 1. Ornamen Pojok UI (HUD Corners)
const CornerBrackets = () => {
  const bracketVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (delay: number) => ({
      opacity: [0, 0.5, 0.3],
      scale: 1,
      transition: { 
        delay, 
        duration: 1, 
        repeat: Infinity, 
        repeatType: "mirror" as const,
        ease: "easeInOut" as const, // <--- FIX DI SINI
      },
    }),
  };
  return (
    <>
      <motion.div variants={bracketVariants} initial="hidden" animate="visible" custom={0.5} className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-400/50" />
      <motion.div variants={bracketVariants} initial="hidden" animate="visible" custom={0.7} className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-400/50" />
      <motion.div variants={bracketVariants} initial="hidden" animate="visible" custom={0.9} className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-400/50" />
      <motion.div variants={bracketVariants} initial="hidden" animate="visible" custom={1.1} className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-400/50" />
    </>
  );
};

// 2. Ornamen Teks Kode yang "Jatuh"
const CodeWaterfall = () => {
  const randomCode = "01101000 01100101 01101100 01101100 01101111 00100000 01110111 01101111 01110010 01101100 01100100 0x3A4B2C 0x5E6D8F #include <iostream> int main() { return 0; }";
  return (
    <div className="absolute top-0 right-6 h-full w-20 overflow-hidden pointer-events-none">
      <motion.p
        className="font-mono text-green-400/20 text-xs break-all"
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {Array(20).fill(randomCode).join(' ')}
      </motion.p>
    </div>
  );
};

// 3. Ornamen Garis Pemindai (Scanline)
const Scanline = () => (
  <motion.div
    className="absolute left-0 w-full h-1 bg-green-400/10 pointer-events-none"
    style={{ top: 0, boxShadow: '0px 0px 10px rgba(52, 211, 153, 0.5)' }}
    animate={{ top: '100%' }}
    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
  />
);


interface StartPageProps {
  onEnter: () => void;
}

export default function StartPage({ onEnter }: StartPageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const textAndBracketsVariants = {
    rest: { color: '#a3a3a3' },
    hover: { color: '#34D399' },
  };

  return (
    <motion.div
      exit={{ clipPath: 'inset(50% 0 50% 0)', transition: { duration: 0.8, ease: "easeOut" } }}
      className="fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black text-white p-4 md:p-8 overflow-hidden" // Tambahkan overflow-hidden
    >
      {/* === ORNAMEN START === */}
      <CornerBrackets />
      <CodeWaterfall />
      <Scanline />
      {/* 4. Ornamen Status Sistem */}
      <motion.div 
        className="absolute bottom-4 left-16 font-mono text-xs text-green-400/50 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span>SYSTEM STATUS: </span>
        <span className="text-green-400/80 ml-2">ONLINE</span>
        <motion.div 
          className="w-2 h-3 bg-green-400/80 ml-2"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      {/* === ORNAMEN END === */}
      
      <div className="absolute inset-2 border-2 border-gray-700/50"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.8 } }}
          onClick={onEnter}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mb-8 cursor-pointer"
        >
          <motion.div
            className="relative flex items-center font-mono"
            animate={isHovered ? "hover" : "rest"}
          >
            <motion.span className="text-lg md:text-xl" variants={textAndBracketsVariants}>[</motion.span>
            <motion.span className="relative mx-2 text-md md:text-lg font-bold uppercase tracking-widest" variants={textAndBracketsVariants}>
              portofolio
            </motion.span>
            <motion.span className="text-lg md:text-xl" variants={textAndBracketsVariants}>]</motion.span>
          </motion.div>
        </motion.div>

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
      </div>
    </motion.div>
  );
}