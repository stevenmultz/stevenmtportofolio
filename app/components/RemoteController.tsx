'use client';
import { RefObject } from 'react';
import { motion } from 'framer-motion';

export const RemoteController = ({ dragConstraints, isPoweredOn, togglePower, handleNavigation, handleAction }: {
    dragConstraints: RefObject<HTMLElement | null>;
    isPoweredOn: boolean;
    togglePower: () => void;
    handleNavigation: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
    handleAction: (action: 'SELECT' | 'BACK') => void;
}) => (
    <motion.div className="remote-control" drag dragConstraints={dragConstraints} dragMomentum={false} initial={{ y: "120%" }} animate={{ y: "0%" }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}>
        <div className="remote-top">
            <div className="d-pad-grid">
                <button onClick={() => handleNavigation('UP')} className="d-pad-up">▲</button>
                <button onClick={() => handleNavigation('LEFT')} className="d-pad-left">◀</button>
                <button onClick={() => handleNavigation('DOWN')} className="d-pad-down">▼</button>
                <button onClick={() => handleNavigation('RIGHT')} className="d-pad-right">▶</button>
            </div>
        </div>
        <div className="remote-bottom">
            <button onClick={() => handleAction('SELECT')} className="action-button-a">A</button>
            <button onClick={() => handleAction('BACK')} className="action-button-b">B</button>
            <button onClick={togglePower} className={`power-button ${isPoweredOn && 'on'}`} aria-label="Toggle Power">⏻</button>
        </div>
    </motion.div>
);