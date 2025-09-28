'use client';
import React, { useState, useEffect, ReactNode } from 'react';

// --- Helper Functions & Static Data ---
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const AsciiRadar = () => (
    <pre className="text-center text-[10px] leading-tight">
        {`
    .        .      .      
.   .  '  .     .      ..
.   /\\     .  '      .  .
   /  \\ . .      '   .   '
  /----\\ '   .       .
 /      \\  . '   .   . .
/________\\   .   '  .  .
    || '   .  '   . . .
    ||   '   .  '   . '
`}
    </pre>
);

// --- Main HUD Component ---
const TerminalHUD = ({ children }: { children: ReactNode }) => {
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({ cpu: 67, mem: 45, net: 1.2 });

    // Effect for clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Effect for system stats fluctuation
    useEffect(() => {
        const statsTimer = setInterval(() => {
            setStats({
                cpu: getRandomInt(40, 95),
                mem: getRandomInt(30, 80),
                net: (Math.random() * 2 + 0.5),
            });
        }, 2000);
        return () => clearInterval(statsTimer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-GB');
    const formattedDate = time.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="hud-container">
            <div className="hud-header">
                <span>[ SMT-OS v5.2 | MAIN TERMINAL ]</span>
                <span>{formattedDate}</span>
            </div>

            <div className="hud-sidebar hud-sidebar-left">
                <div className="hud-panel">
                    <h3 className="hud-panel-title">SYSTEM STATUS</h3>
                    <p>CPU LOAD .: [{stats.cpu}%]</p>
                    <p>MEM USAGE : [{stats.mem}%]</p>
                    <p>NET SPEED : [{stats.net.toFixed(2)} Gb/s]</p>
                    <p>SESSION ..: [SECURE]</p>
                </div>
                <div className="hud-panel">
                    <h3 className="hud-panel-title">GEOLINK</h3>
                    <p>NODE ....: TANGERANG, ID</p>
                    <p>SIGNAL ..: STRONG</p>
                    <p>LATENCY .: [42ms]</p>
                </div>
            </div>

            <main className="hud-main-content">
                {children}
            </main>

            <div className="hud-sidebar hud-sidebar-right">
                <div className="hud-panel">
                    <h3 className="hud-panel-title">SCANNER</h3>
                    <AsciiRadar />
                </div>
                <div className="hud-panel">
                    <h3 className="hud-panel-title">INFO</h3>
                    <p>USER: GUEST</p>
                    <p>AUTH: LVL-1</p>
                </div>
            </div>

            <div className="hud-footer">
                <span>SYSTEM READY</span>
                <span>{formattedTime}</span>
            </div>
        </div>
    );
};

export default TerminalHUD;