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
  // Variants for the button animation for a cleaner structure
  const buttonParentVariants = {
    rest: {},
    hover: {},
  };
  
  const bracketVariants = {
    rest: { x: 0 },
    hover: { x: 0 }, // Will be set dynamically
  };

  const textVariants = {
    rest: { letterSpacing: '1px', color: '#a3a3a3' },
    hover: { letterSpacing: '2.5px', color: '#34D399' },
  };

  const underlineVariants = {
    rest: { scaleX: 0 },
    hover: { scaleX: 1 },
  };

  return (
    <motion.div
      exit={{ clipPath: 'inset(50% 0 50% 0)', transition: { duration: 0.8, ease: "easeOut" } }}
      className="fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black text-white p-4 md:p-8"
    >
      <div className="absolute inset-2 border-2 border-gray-700"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* === AWARDS-WORTHY BUTTON START === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.8 } }}
          onClick={onEnter}
          className="mb-8 cursor-pointer" // Increased margin for better spacing
        >
          <motion.div
            className="relative flex items-center"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={buttonParentVariants}
          >
            {/* Subtle breathing glow effect */}
            <motion.div
                className="absolute -inset-2"
                animate={{
                    textShadow: [
                        "0 0 2px rgba(52, 211, 153, 0.0)",
                        "0 0 6px rgba(52, 211, 153, 0.4)",
                        "0 0 2px rgba(52, 211, 153, 0.0)",
                    ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Left Bracket */}
            <motion.span
              className="text-lg md:text-xl font-mono"
              variants={{ ...bracketVariants, hover: { x: -8 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              [
            </motion.span>
            
            {/* Text and Underline Container */}
            <div className="relative mx-1 overflow-hidden">
                <motion.span
                className="text-md md:text-lg font-bold uppercase tracking-widest"
                variants={textVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                portofolio
                </motion.span>
                <motion.div
                className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-green-400"
                style={{ originX: 0.5 }}
                variants={underlineVariants}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                />
            </div>

            {/* Right Bracket */}
            <motion.span
              className="text-lg md:text-xl font-mono"
              variants={{ ...bracketVariants, hover: { x: 8 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              ]
            </motion.span>
          </motion.div>
        </motion.div>
        {/* === AWARDS-WORTHY BUTTON END === */}

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