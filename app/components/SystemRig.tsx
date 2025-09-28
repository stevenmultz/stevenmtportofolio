'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const SystemRig = ({ isPoweredOn, children, leftPreviewUrl, rightPreviewUrl }: {
    isPoweredOn: boolean;
    children: ReactNode;
    leftPreviewUrl: string | null;
    rightPreviewUrl: string | null;
}) => {
    return (
        <svg viewBox="0 0 800 600" className="system-rig-svg" aria-hidden="true">
            {/* Wires */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path d="M 300 0 V 150 Q 310 180 350 200" className="wire" />
            <path d="M 400 0 V 180 Q 400 200 420 205" className="wire" />
            <path d="M 500 0 V 150 Q 490 180 450 200" className="wire" />

            {/* Side Screens */}
            <rect x="25" y="150" width="120" height="300" rx="10" className="side-screen-bezel" />
            <rect x="655" y="150" width="120" height="300" rx="10" className="side-screen-bezel" />

            {/* Main Monitor */}
            <path d="M 180 200 H 620 A 20 20 0 0 1 640 220 V 480 A 20 20 0 0 1 620 500 H 180 A 20 20 0 0 1 160 480 V 220 A 20 20 0 0 1 180 200 Z" className="main-monitor-bezel" />
            
            {/* Main Screen Content */}
            <foreignObject x="175" y="215" width="450" height="270">
                <div className="main-screen-content-wrapper">
                    {children}
                </div>
            </foreignObject>

            {/* Side Screen Images */}
            <foreignObject x="35" y="160" width="100" height="280">
                <motion.div className="side-screen-image" animate={{ opacity: leftPreviewUrl ? 1 : 0 }}>
                    {leftPreviewUrl && <img src={leftPreviewUrl} alt="Left project preview" />}
                </motion.div>
            </foreignObject>
            <foreignObject x="665" y="160" width="100" height="280">
                 <motion.div className="side-screen-image" animate={{ opacity: rightPreviewUrl ? 1 : 0 }}>
                    {rightPreviewUrl && <img src={rightPreviewUrl} alt="Right project preview" />}
                </motion.div>
            </foreignObject>
        </svg>
    );
};