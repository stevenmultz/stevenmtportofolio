'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, RefObject } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';
import { useSound } from '@/app/hooks/useSound';
import TerminalHUD from '@/app/components/TerminalHUD';

// --- TYPE GUARD ---
const isProject = (item: Project | Certificate | null): item is Project => !!item && 'skills' in item;

// --- LOADING SCREEN ---
const SimpleLoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const catFrames = useMemo(() => ['(^.^)', '(-.-)', '(^.^)'], []);
    const [frameIndex, setFrameIndex] = useState(0);
    useEffect(() => {
        const blinkInterval = setInterval(() => setFrameIndex(prev => (prev + 1) % catFrames.length), 800);
        const timer = setTimeout(onComplete, 2800);
        return () => { clearInterval(blinkInterval); clearTimeout(timer); };
    }, [catFrames, onComplete]);
    return (
        <motion.div className="loading-overlay" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
            <div className="flex flex-col items-center justify-center crt-text">
                <pre className="text-4xl md:text-6xl mb-4 text-shadow-matrix-green">{catFrames[frameIndex]}</pre>
                <p className="text-xl">Loading...</p>
            </div>
        </motion.div>
    );
};

// === WIRES REVERTED TO SVG for natural curves ===
const BackgroundWires = () => (
    <div className="wires-container">
        <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
            <path className="wire" d="M 20% 0 Q 22% 20% 40% 42%" />
            <path className="wire" d="M 35% 0 Q 30% 35% 45% 48%" />
            <path className="wire" d="M 60% 0 Q 65% 25% 55% 48%" />
            <path className="wire" d="M 80% 0 Q 75% 15% 58% 44%" />
        </svg>
    </div>
);

// --- SIMPLE FULL SCREEN FOOTER ---
const FullScreenFooter = ({ onClose }: { onClose: () => void }) => (
    <motion.footer className="footer-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button onClick={onClose} className="footer-close-button" aria-label="Close">[ CLOSE ]</button>
        <div className="footer-content">
            <h3 className="text-2xl md:text-4xl crt-text mb-6">// CONTACT_INFORMATION</h3>
            <pre className="text-lg md:text-xl whitespace-pre-wrap font-mono crt-text">{contactDetails.trim()}</pre>
        </div>
    </motion.footer>
);


// --- HOLOGRAPHIC IMAGE PREVIEW ---
const ProjectImagePreview = ({ imageUrl, position }: { imageUrl: string | null, position: 'left' | 'right' }) => (
    <div className={`image-preview-pane ${position === 'left' ? 'left-preview' : 'right-preview'}`}>
        <AnimatePresence>
            {imageUrl && (
                <motion.div className="image-preview-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
                    <Image src={imageUrl} alt="Project preview" layout="fill" objectFit="cover" />
                    <div className="hologram-overlay" />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


// --- REDESIGNED DRAGGABLE CONTROLLER ---
const Controller = ({ dragConstraints, isPoweredOn, togglePower, handleNavigation, handleAction }: {
    dragConstraints: RefObject<HTMLElement | null>;
    isPoweredOn: boolean;
    togglePower: () => void;
    handleNavigation: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
    handleAction: (action: 'SELECT' | 'BACK') => void;
}) => (
    <motion.div className="remote-control" drag dragConstraints={dragConstraints} dragMomentum={false} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}>
        <button onClick={togglePower} className={`power-button ${isPoweredOn && 'on'}`} aria-label="Toggle Power">⏻</button>
        <div className="d-pad">
            <button onClick={() => handleNavigation('UP')} className="d-pad-up">▲</button>
            <button onClick={() => handleNavigation('LEFT')} className="d-pad-left">◀</button>
            <button onClick={() => handleNavigation('RIGHT')} className="d-pad-right">▶</button>
            <button onClick={() => handleNavigation('DOWN')} className="d-pad-down">▼</button>
        </div>
        <div className="action-buttons">
            <button onClick={() => handleAction('BACK')} className="action-button-b">B</button>
            <button onClick={() => handleAction('SELECT')} className="action-button-a">A</button>
        </div>
    </motion.div>
);


// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const [section, setSection] = useState<'MENU' | 'PROJECTS' | 'CERTIFICATES'>('MENU');
    const [listIndex, setListIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<Project | Certificate | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [previewImageUrls, setPreviewImageUrls] = useState<{left: string | null; right: string | null}>({ left: null, right: null });

    const mainContainerRef = useRef<HTMLElement | null>(null);
    const screenContentRef = useRef<HTMLDivElement>(null);
    const rotateY = useMotionValue(-10);
    const rotateX = useMotionValue(5);

    const playNav = useSound('/map.mp3', 0.5);
    const playSelect = useSound('/map.mp3', 0.8);
    const playBack = useSound('/map.mp3', 0.6);
    const playPowerOn = useSound('/map.mp3', 1);
    const playPowerOff = useSound('/map.mp3', 1);

    const menuItems = useMemo(() => ['PROJECTS', 'CERTIFICATES'], []);
    const dataList = useMemo(() => {
        if (section === 'PROJECTS') return projects;
        if (section === 'CERTIFICATES') return certificates;
        return [];
    }, [section]);

    useEffect(() => {
        if (section === 'PROJECTS' && dataList.length > 0 && !selectedItem) {
            const currentProject = dataList[listIndex];
            if (isProject(currentProject)) {
                setPreviewImageUrls({
                    left: currentProject.images[0] || null,
                    right: currentProject.images[1] || currentProject.images[0] || null,
                });
            }
        } else {
            setPreviewImageUrls({ left: null, right: null });
        }
    }, [listIndex, section, dataList, selectedItem]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile(); window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsFooterVisible(false); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => { setListIndex(0); }, [section]);
    useEffect(() => { if (isBooting) { const timer = setTimeout(() => setIsBooting(false), 1200); return () => clearTimeout(timer); } }, [isBooting]);

    const handleLoadingComplete = useCallback(() => setIsLoading(false), []);
    
    const handleWheel = (e: React.WheelEvent) => {
        if (isLoading || isMobile) return;
        const { deltaX, deltaY } = e;
        if (isFooterVisible) {
            if (deltaY < -5) setIsFooterVisible(false);
        } else {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const newRotation = rotateY.get() + deltaX * 0.05;
                const clampedRotation = Math.max(-35, Math.min(35, newRotation));
                animate(rotateY, clampedRotation, { type: "spring", stiffness: 300, damping: 30 });
            } else if (deltaY > 5) {
                setIsFooterVisible(true);
            }
        }
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

    const handleNavigation = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
        if (!isPoweredOn || isBooting) return;
        playNav();
        if (isProject(selectedItem) && (direction === 'LEFT' || direction === 'RIGHT')) {
            const imageCount = selectedItem.images.length;
            if (imageCount > 1) {
                setImageIndex(prev => direction === 'LEFT' ? (prev > 0 ? prev - 1 : imageCount - 1) : (prev < imageCount - 1 ? prev + 1 : 0));
            }
        } else if (direction === 'UP' || direction === 'DOWN') {
            if (selectedItem && screenContentRef.current) {
                screenContentRef.current.scrollBy({ top: direction === 'UP' ? -100 : 100, behavior: 'smooth' });
            } else {
                const list = section === 'MENU' ? menuItems : dataList;
                setListIndex(prev => direction === 'UP' ? (prev > 0 ? prev - 1 : list.length - 1) : (prev < list.length - 1 ? prev + 1 : 0));
            }
        }
    }, [isPoweredOn, isBooting, playNav, selectedItem, section, menuItems, dataList]);

    const handleAction = useCallback((action: 'SELECT' | 'BACK') => {
        if (!isPoweredOn || isBooting) return;
        if (action === 'SELECT') {
            playSelect();
            if (section === 'MENU') setSection(menuItems[listIndex] as 'PROJECTS' | 'CERTIFICATES');
            else if (dataList.length > 0) {
                setSelectedItem(dataList[listIndex]);
                setImageIndex(0);
            }
        } else if (action === 'BACK') {
            playBack();
            if (selectedItem) setSelectedItem(null);
            else if (section !== 'MENU') setSection('MENU');
        }
    }, [isPoweredOn, isBooting, playSelect, playBack, section, menuItems, listIndex, dataList, selectedItem]);
    
    const renderScreenContent = () => {
        if (isBooting) { return ( <motion.div key="booting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-2xl crt-text"><p>CONNECTING TO MAINFRAME...</p><p className="mt-2 text-4xl blinking-cursor">[ ]</p></motion.div> ); }
        const key = section + (selectedItem ? (isProject(selectedItem) ? selectedItem.title : selectedItem.name) : '');
        return ( <AnimatePresence mode="wait"><motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="screen-content" ref={screenContentRef}>{selectedItem ? ( <div> <h2 className="text-xl md:text-2xl underline">DECRYPTING FILE: {isProject(selectedItem) ? selectedItem.title : selectedItem.name}</h2><pre className="mt-4 text-sm md:text-base whitespace-pre-wrap">{isProject(selectedItem) ? `{'>'} TYPE        : ${selectedItem.type}\n{'>'} YEAR        : ${selectedItem.year}\n{'>'} STATUS      : ${selectedItem.status}\n{'>'} DEVELOPER   : ${selectedItem.webDeveloper}\n{'>'} DESIGNER    : ${selectedItem.uiUxDesigner}\n\n{'>'} DESCRIPTION :\n${selectedItem.description}\n\n{'>'} SKILLS      : ${selectedItem.skills.join(', ')}` : `{'>'} INSTITUTION : ${selectedItem.institution}\n{'>'} YEAR        : ${selectedItem.year}`}</pre>{isProject(selectedItem) && selectedItem.images.length > 0 && ( <div className="mt-4"><h3 className="text-base md:text-lg">{`> VISUAL DATA: [${imageIndex + 1}/${selectedItem.images.length}]`}</h3><AnimatePresence mode="wait"><motion.div key={imageIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}><Image src={selectedItem.images[imageIndex]} alt="Project image" width={400} height={250} className="image-asset mt-2" /></motion.div></AnimatePresence></div> )}{!isProject(selectedItem) && ( <div className="mt-4"><h3 className="text-base md:text-lg">{'>'} PROOF:</h3><div className="mt-2"><Image src={selectedItem.imageUrl} alt="Certificate image" width={400} height={280} className="image-asset" /></div></div> )}</div> ) : section === 'MENU' ? ( <div><h2 className="text-2xl md:text-3xl mb-4">// ROOT_DIRECTORY</h2><div>{menuItems.map((item, index) => ( <p key={item} className={`text-xl md:text-2xl ${listIndex === index ? 'selected-item' : ''}`}>{listIndex === index ? <> &gt; </> : '   '}{item}</p>))}</div></div> ) : ( <div><h2 className="text-2xl md:text-3xl mb-4">// DIR {'>'} {section}</h2><div>{dataList.map((item, index) => ( <p key={isProject(item) ? item.title : item.name} className={`text-lg md:text-xl truncate ${index === listIndex ? 'selected-item' : ''}`}>{listIndex === index ? <> &gt; </> : '   '}{isProject(item) ? item.title : item.name}</p>))}</div></div> )}</motion.div></AnimatePresence> );
    };
    
    return (
        <main className="main-container" ref={mainContainerRef} onWheel={handleWheel}>
            <BackgroundWires />
            <ProjectImagePreview imageUrl={previewImageUrls.left} position="left" />
            <ProjectImagePreview imageUrl={previewImageUrls.right} position="right" />
            <AnimatePresence>{isLoading && <SimpleLoadingScreen onComplete={handleLoadingComplete} />}</AnimatePresence>
            
            {!isLoading && (
                <>
                    <motion.div className="portfolio-rig" initial={{ scale: isMobile ? 1 : 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
                        <motion.div className="pc-monitor-container" style={!isMobile ? { rotateX, rotateY } : {}}>
                            <div className="pc-monitor-bezel">
                                <div className="pc-monitor-screen">
                                    {isPoweredOn ? <TerminalHUD>{renderScreenContent()}</TerminalHUD> : <div className="screen-off-overlay" />}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    <Controller dragConstraints={mainContainerRef} isPoweredOn={isPoweredOn} togglePower={togglePower} handleNavigation={handleNavigation} handleAction={handleAction}/>
                </>
            )}

            <AnimatePresence>{isFooterVisible && !isMobile && <FullScreenFooter onClose={() => setIsFooterVisible(false)} />}</AnimatePresence>
        </main>
    );
}