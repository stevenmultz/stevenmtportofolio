'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// =============================================================
// === UTILITIES & SUB-COMPONENTS ===
// =============================================================

const MATRIX_CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

// --- Latar Belakang Grid ---
const GridBackground = () => (
  <div className="absolute inset-0 z-0 h-full w-full bg-transparent">
    <div
      className="absolute inset-0 h-full w-full bg-black [background:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]"
    ></div>
  </div>
);


// --- Aliran Data Subtil ---
const SubtleDataStream = () => {
  const columns = useMemo(() => Array(30).fill(0).map((_, i) => ({
    id: i,
    chars: Array(20).fill(0).map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join(''),
    duration: Math.random() * 20 + 25,
    delay: Math.random() * 15,
  })), []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {columns.map(col => (
        <motion.p
          key={col.id}
          className="font-mono text-green-400/5 text-sm break-all absolute leading-tight"
          style={{ left: `${(100 / columns.length) * col.id}%`, writingMode: 'vertical-rl', textOrientation: 'upright' }}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{ duration: col.duration, delay: col.delay, repeat: Infinity, ease: 'linear' }}
        >
          {col.chars}
        </motion.p>
      ))}
    </div>
  );
};


// --- Sekuens Inisialisasi Sistem ---
const InitSequence = ({ onComplete }: { onComplete: () => void }) => {
  const steps = ["SYSTEM KERNEL: ONLINE", "ACCESSING NODE: SMT-01", "INITIALIZING INTERFACE..."];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete, steps.length]);

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-black flex items-center justify-center font-mono"
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          className="text-center text-lg tracking-[0.3em] text-green-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {steps[currentStep]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

// --- Efek Dekripsi Teks ---
const DecryptingText = ({ children, delay = 0 }: { children: string, delay?: number }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    const targetText = children.toUpperCase();
    let interval: NodeJS.Timeout;
    setTimeout(() => {
      let iteration = 0;
      interval = setInterval(() => {
        setText(
          targetText.split("").map((_, index) => {
            if (index < iteration) return targetText[index];
            if (targetText[index] === ' ') return ' ';
            return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }).join("")
        );
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1;
      }, 50);
    }, delay);
    return () => clearInterval(interval);
  }, [children, delay]);
  return <>{text}</>;
};

// =============================================================
// === KOMPONEN UTAMA: StartPage ===
// =============================================================
interface StartPageProps {
  onEnter: () => void;
}

export default function StartPage({ onEnter }: StartPageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const lineVariants = {
    rest: { scaleX: 0 },
    hover: { 
      scaleX: 1, 
      transition: { 
        duration: 0.4, 
        ease: 'easeOut' as const // <--- FIX DI SINI
      } 
    },
  };

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black text-green-400 p-4 font-mono"
    >
      <GridBackground />
      <SubtleDataStream />
      <div className="absolute inset-0 bg-black/80" />

      <AnimatePresence>
        {!isInitialized && <InitSequence onComplete={() => setIsInitialized(true)} />}
      </AnimatePresence>
      
      {isInitialized && (
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white/90">
            <DecryptingText delay={500}>Steven Mulya Tjendratama</DecryptingText>
          </h1>
          <p className="mt-4 text-lg tracking-[0.2em] text-white/60">
            SOFTWARE ENGINEER
          </p>

          <motion.div
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="mt-20 cursor-pointer relative flex flex-col items-center justify-center w-64 h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.span 
              className={`text-2xl tracking-[0.4em] transition-colors duration-300 ${isHovered ? 'text-white' : 'text-green-400'}`}
            >
              ENTER
            </motion.span>
            
            <div className="absolute bottom-4 w-32 h-px">
              <motion.div
                className="absolute inset-0 bg-green-400"
                style={{ originX: 0.5 }}
                variants={lineVariants}
                initial="rest"
                animate={isHovered ? "hover" : "rest"}
              />
            </div>
            
             <div className="absolute top-4 w-32 h-px">
              <motion.div
                className="absolute inset-0 bg-green-400"
                style={{ originX: 0.5 }}
                variants={lineVariants}
                initial="rest"
                animate={isHovered ? "hover" : "rest"}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}