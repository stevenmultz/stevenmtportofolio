'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BootSequenceLoading = ({ onComplete }: { onComplete: () => void }) => {
    const [logLines, setLogLines] = useState<string[]>([]);
    const [stage, setStage] = useState(0);

    const bootLog = useMemo(() => [
        "SMT-OS v6.0 INITIALIZING...",
        "QUANTUM CORE CALIBRATION...",
        "NEURAL LINK SYNC...",
        "COMPILING SHADERS...",
        "MEMORY INTEGRITY CHECK...",
        "ACCESSING MAIN NODE...",
        "BOOT SEQUENCE COMPLETE."
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogLines(prev => {
                if (prev.length < bootLog.length) {
                    return [...prev, bootLog[prev.length]];
                }
                clearInterval(interval);
                setTimeout(() => setStage(1), 300);
                return prev;
            });
        }, 350);
        return () => clearInterval(interval);
    }, [bootLog]);
    
    useEffect(() => {
      if (stage === 1) {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
      }
    }, [stage, onComplete]);

    return (
        <motion.div className="loading-overlay" exit={{ opacity: 0 }}>
            <div className="boot-sequence-container">
                <div className="core-animation">
                    <span className="ring ring-1">[</span>
                    <span className="ring ring-2">[</span>
                    <span className="ring ring-3">[</span>
                     CORE
                    <span className="ring ring-3">]</span>
                    <span className="ring ring-2">]</span>
                    <span className="ring ring-1">]</span>
                </div>
                <div className="boot-log">
                    {logLines.map((line, i) => <p key={i}>&gt; {line}</p>)}
                    {stage === 0 && <span className="blinking-cursor">_</span>}
                </div>
            </div>
        </motion.div>
    );
};