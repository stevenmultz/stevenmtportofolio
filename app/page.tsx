'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';
import { useSound } from '@/app/hooks/useSound';

// --- TYPE GUARD ---
const isProject = (item: Project | Certificate): item is Project => 'skills' in item;

// --- LOADING SCREEN COMPONENT ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const asciiLogo = `
      ███████╗███╗   ███╗████████╗
     ██╔════╝████╗ ████║╚══██╔══╝
     ███████╗██╔████╔██║   ██║   
     ╚════██║██║╚██╔╝██║   ██║   
     ███████║██║ ╚═╝ ██║   ██║   
     ╚══════╝╚═╝     ╚═╝   ╚═╝   
    `;
    useEffect(() => {
        const timer = setTimeout(onComplete, 2800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="loading-overlay"
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
            <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.8, times: [0, 0.2, 0.8, 1], ease: "easeInOut", repeat: Infinity }}
                className="text-green-500 text-xs md:text-sm crt-text"
            >
                {asciiLogo}
            </motion.pre>
        </motion.div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const [section, setSection] = useState<'MENU' | 'PROJECTS' | 'CERTIFICATES' | 'CONTACT'>('MENU');
    const [listIndex, setListIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<Project | Certificate | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const screenContentRef = useRef<HTMLDivElement>(null);
    const rotateY = useMotionValue(0);
    const rotateX = useMotionValue(5);

    const playNav = useSound('/map.mp3', 0.5);
    const playSelect = useSound('/map.mp3', 0.8);
    const playBack = useSound('/map.mp3', 0.6);
    const playPowerOn = useSound('/map.mp3', 1);
    const playPowerOff = useSound('/map.mp3', 1);

    const menuItems = useMemo(() => ['PROJECTS', 'CERTIFICATES', 'CONTACT'], []);
    const dataList = useMemo(() => {
        if (section === 'PROJECTS') return projects;
        if (section === 'CERTIFICATES') return certificates;
        return [];
    }, [section]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => { setListIndex(0); }, [section]);
    useEffect(() => {
        if (isBooting) {
            const timer = setTimeout(() => setIsBooting(false), 1200);
            return () => clearTimeout(timer);
        }
    }, [isBooting]);
    
    const handleLoadingComplete = () => setIsLoading(false);
    
    const handleWheel = (e: React.WheelEvent) => {
        if (isLoading || isMobile) return;
        const scrollDelta = e.deltaX || e.deltaY;
        const currentRotation = rotateY.get();
        const newRotation = currentRotation + scrollDelta * 0.1;
        const clampedRotation = Math.max(-45, Math.min(45, newRotation));
        animate(rotateY, clampedRotation, { type: "spring", stiffness: 400, damping: 30, mass: 1 });
    };

    const togglePower = useCallback(() => {
        if (isLoading) return;
        setIsPoweredOn(prev => {
            const newState = !prev;
            if (newState) { playPowerOn(); setIsBooting(true); } 
            else { playPowerOff(); setSelectedItem(null); setSection('MENU'); }
            return newState;
        });
    }, [isLoading, playPowerOn, playPowerOff]);

    const handleNavigation = useCallback((direction: 'UP' | 'DOWN') => {
        if (!isPoweredOn || isBooting) return;
        playNav();
        if (selectedItem && screenContentRef.current) {
            const scrollAmount = 100;
            screenContentRef.current.scrollBy({ top: direction === 'UP' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        } else {
            const list = section === 'MENU' ? menuItems : dataList;
            if (direction === 'UP') setListIndex(prev => (prev > 0 ? prev - 1 : list.length - 1));
            if (direction === 'DOWN') setListIndex(prev => (prev < list.length - 1 ? prev + 1 : 0));
        }
    }, [isPoweredOn, isBooting, playNav, selectedItem, section, menuItems, dataList]);

    const handleAction = useCallback((action: 'SELECT' | 'BACK') => {
        if (!isPoweredOn || isBooting) return;
        if (action === 'SELECT') {
            playSelect();
            if (section === 'MENU') setSection(menuItems[listIndex] as 'PROJECTS' | 'CERTIFICATES' | 'CONTACT');
            else if (dataList.length > 0) setSelectedItem(dataList[listIndex]);
        } else if (action === 'BACK') {
            playBack();
            if (selectedItem) setSelectedItem(null);
            else if (section !== 'MENU') setSection('MENU');
        }
    }, [isPoweredOn, isBooting, playSelect, playBack, section, menuItems, listIndex, dataList, selectedItem]);
    
    const renderScreenContent = () => {
      if (isBooting) { return ( <motion.div key="booting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-3xl crt-text"><p>SMT-OS v5.1</p><p className="mt-2 text-xl blinking-cursor">BOOTING SYSTEM...</p></motion.div> ); }
      return ( <AnimatePresence mode="wait"><motion.div key={section + (selectedItem ? (isProject(selectedItem) ? selectedItem.title : selectedItem.name) : '')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-4 w-full h-full" ref={screenContentRef}>{selectedItem ? ( <div> <h2 className="text-xl md:text-2xl underline crt-text">FILE: {isProject(selectedItem) ? selectedItem.title : selectedItem.name}</h2><pre className="mt-2 md:mt-4 text-xs md:text-base whitespace-pre-wrap font-mono crt-text">{isProject(selectedItem) ? `TYPE        : ${selectedItem.type}\nYEAR        : ${selectedItem.year}\nSTATUS      : ${selectedItem.status}\nDEVELOPER   : ${selectedItem.webDeveloper}\nDESIGNER    : ${selectedItem.uiUxDesigner}\n\nDESCRIPTION :\n${selectedItem.description}\n\nSKILLS      : ${selectedItem.skills.join(', ')}` : `INSTITUTION : ${selectedItem.institution}\nYEAR        : ${selectedItem.year}`}</pre>{isProject(selectedItem) && selectedItem.images.length > 0 && ( <div className="mt-2 md:mt-4"><h3 className="text-base md:text-lg crt-text">PROJECT GALLERY:</h3><div className="grid grid-cols-2 gap-2 md:gap-4 mt-2">{selectedItem.images.map(img => <Image key={img} src={img} alt="Project image" width={300} height={200} className="border-2 border-green-900/50" />)}</div></div> )}{!isProject(selectedItem) && ( <div className="mt-2 md:mt-4"><h3 className="text-base md:text-lg crt-text">CERTIFICATE PROOF:</h3><div className="mt-2"><Image src={selectedItem.imageUrl} alt="Certificate image" width={400} height={280} className="border-2 border-green-900/50" /></div></div> )}</div> ) : section === 'MENU' ? ( <div><h2 className="text-2xl md:text-3xl crt-text mb-4">// MAIN MENU</h2><div className="space-y-2">{menuItems.map((item, index) => ( <p key={item} className={`text-xl md:text-2xl ${listIndex === index ? 'bg-green-900/50 crt-text' : 'text-white/40'}`}>{listIndex === index ? '» ' : '  '}{item}</p>))}</div></div> ) : section === 'CONTACT' ? ( <div><h2 className="text-2xl md:text-3xl crt-text mb-4">// CONTACT SMT</h2><pre className="text-lg md:text-xl whitespace-pre-wrap font-mono crt-text">{contactDetails.trim()}</pre></div> ) : ( <div><h2 className="text-2xl md:text-3xl crt-text mb-4">{`// ${section}`}</h2><div className="space-y-1">{dataList.map((item, index) => ( <p key={isProject(item) ? item.title : item.name} className={`text-lg md:text-xl truncate ${index === listIndex ? 'bg-green-900/50 crt-text' : 'text-white/40'}`}>{index === listIndex ? '» ' : '  '}{isProject(item) ? item.title : item.name}</p>))}</div></div> )}</motion.div></AnimatePresence> );
    };
    const RemoteController = () => {
      return ( <div className="remote-control"><button onClick={togglePower} className={`power-button ${isPoweredOn && 'on'}`}><svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1z"/></svg></button><div className="d-pad"><button onClick={() => handleNavigation('UP')} className="d-pad-button d-pad-up"><svg viewBox="0 0 24 24"><path d="M12 8l-6 6h12z"/></svg></button><button onClick={() => {}} className="d-pad-button d-pad-right"><svg viewBox="0 0 24 24"><path d="M16 12l-6 6V6z"/></svg></button><button onClick={() => handleNavigation('DOWN')} className="d-pad-button d-pad-down"><svg viewBox="0 0 24 24"><path d="M12 16l6-6H6z"/></svg></button><button onClick={() => {}} className="d-pad-button d-pad-left"><svg viewBox="0 0 24 24"><path d="M8 12l6-6v12z"/></svg></button></div><div className="action-buttons"><button onClick={() => handleAction('BACK')} className="action-button">B</button><button onClick={() => handleAction('SELECT')} className="action-button">A</button></div></div> );
    };
    const MobileController = () => (
        <div className="mobile-controller">
            <div className="mobile-d-pad">
                <button onClick={() => handleNavigation('UP')} className="mobile-d-pad-button">▲</button>
                <button onClick={() => handleNavigation('DOWN')} className="mobile-d-pad-button">▼</button>
            </div>
            <div className="mobile-actions">
                <button onClick={togglePower} className={`mobile-power-button ${isPoweredOn && 'on'}`}>⏻</button>
                <button onClick={() => handleAction('BACK')} className="mobile-action-button">B</button>
                <button onClick={() => handleAction('SELECT')} className="mobile-action-button">A</button>
            </div>
        </div>
    );

    return (
        <motion.main 
            className="main-container" 
            onWheel={handleWheel}
        >
            <AnimatePresence>
                {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            </AnimatePresence>
            
            {!isLoading && (
                <motion.div
                    className="portfolio-rig"
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div 
                        className="pc-monitor-container"
                        style={!isMobile ? { rotateX, rotateY } : {}}
                    >
                        <div className="pc-monitor-3d-wrapper">
                            <div className="pc-monitor-bezel">
                                <div className="pc-monitor-screen crt-effect">
                                    {isPoweredOn ? renderScreenContent() : <div className="w-full h-full bg-black" />}
                                </div>
                            </div>
                            <div className="pc-monitor-back"></div>
                        </div>
                    </motion.div>
                    
                    <div className="desk">
                        <div className="desk-reflection"></div>
                    </div>

                    {isMobile ? <MobileController /> : <RemoteController />}
                </motion.div>
            )}
        </motion.main>
    );
}