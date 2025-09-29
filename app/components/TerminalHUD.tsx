'use client';
import React, { useState, useEffect, ReactNode } from 'react';

// --- Helper Function ---
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Main HUD Component ---
const TerminalHUD = ({ children }: { children: ReactNode }) => {
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({ cpu: 67, mem: 45, net: 1.2 });

    // Effect for clock and stats fluctuation
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setStats({
                cpu: getRandomInt(40, 95),
                mem: getRandomInt(30, 80),
                net: (Math.random() * 2 + 0.5),
            });
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formattedDate = time.toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' });

    return (
        <div className="hud-container">
            {/* Decorative Corners */}
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            
            {/* Header */}
            <div className="hud-header">
                <span>SMT-OS [v5.4]</span>
                <span className="rec-light">REC</span>
                <span>{formattedDate}</span>
            </div>
            
            {/* Main Content */}
            <main className="hud-main-content">
                {children}
            </main>
            
            {/* Footer / Status Bar */}
            <div className="hud-status-bar">
                <span>CPU: {stats.cpu}%</span>
                <span>MEM: {stats.mem}%</span>
                <span>NET: {stats.net.toFixed(1)}Gb/s</span>
                <span className="status-ok">STATUS: OK</span>
                <span className="flex-grow"></span>
                <span>{formattedTime}</span>
            </div>
        </div>
    );
};

export default TerminalHUD;