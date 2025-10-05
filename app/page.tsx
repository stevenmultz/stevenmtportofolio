'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';
import { useSound } from '@/app/hooks/useSound';
import TerminalHUD from '@/app/components/TerminalHUD';

const emailMatch = contactDetails.match(/Email: (.*)/);
const whatsappMatch = contactDetails.match(/Whatsapp: \+([0-9]+)/);
const email = emailMatch ? emailMatch[1].trim() : '';
const whatsappNumber = whatsappMatch ? whatsappMatch[1].trim() : '';
const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';

const isProject = (item: Project | Certificate | null): item is Project => !!item && 'skills' in item;
const isCertificate = (item: Project | Certificate | null): item is Certificate => !!item && 'imageUrl' in item;

type ActiveItemType = 'controller' | 'namecard' | 'coverletter' | null;

const InitializationLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 25);

        return () => clearInterval(progressInterval);
    }, [onComplete]);

    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <motion.h1 
                    className="loader-logo-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    STEVEN MT
                </motion.h1>
                <div className="loader-status-container">
                    <p className="loader-status-text">LOADING PORTFOLIO...</p>
                    <div className="loader-progress-bar">
                        <motion.div
                            className="loader-progress-bar-fill"
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                    </div>
                    <p className="loader-percentage-text">{progress}%</p>
                </div>
            </div>
        </div>
    );
};

const IdCard = ({ onClose, dragConstraints, playPaper }: { onClose?: () => void, dragConstraints?: React.RefObject<HTMLElement | null>, playPaper: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        playPaper();
        setIsFlipped(p => !p);
    };

    return (
        <motion.div className="card-container" style={{ x: '-50%', y: '-50%' }} drag dragConstraints={dragConstraints} dragMomentum={false} initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
            <div className="card-flipper" onClick={handleFlip}>
                <motion.div className="card-front" animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    <div className="card-hologram"></div>
                    <div className="card-header">
                        <span className="card-issuer">MULATAMA CORP.</span>
                        {onClose && <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="card-close-button">[X]</button>}
                    </div>
                    <div className="card-body">
                        <div className="card-photo-col">
                            <div className="card-photo">
                                <Image src="/user.png" alt="User Photo" width={100} height={100} />
                            </div>
                        </div>
                        <div className="card-info-col">
                            <div className="card-field"><span className="field-label">Name</span><span className="field-value">Steven M. Tjendratama</span></div>
                            <div className="card-field"><span className="field-label">Designation</span><span className="field-value title">Software Engineer</span></div>
                            <div className="card-field"><span className="field-label">ID Number</span><span className="field-value small">SMT-20251002</span></div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="card-flip-info"><span>⟳</span> FLIP FOR DETAILS</div>
                        <div className="card-signature">Steven M.T.</div>
                    </div>
                </motion.div>
                <motion.div className="card-back" initial={{ rotateY: -180 }} animate={{ rotateY: isFlipped ? 0 : -180 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    <div className="card-back-header"><div className="card-mag-strip" /></div>
                    <div className="card-content-back">
                        <p>This identification card is the property of Mulatama Corp. If found, please return to the nearest company office.</p>
                        <div className="card-contact-grid">
                            <a onClick={e => e.stopPropagation()} href={`mailto:${email}`}><span>EMAIL</span><div>{email}</div></a>
                            <a onClick={e => e.stopPropagation()} href={whatsappLink} target="_blank" rel="noopener noreferrer"><span>WHATSAPP</span><div>+{whatsappNumber}</div></a>
                        </div>
                        <div className="card-barcode" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const CoverLetterView = ({ onClose, isMobile }: { onClose?: () => void; isMobile: boolean; }) => {
    const desktopAnimation = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };
    const mobileAnimation = {
        initial: { y: 200, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 200, opacity: 0 },
    };
    const animation = isMobile ? mobileAnimation : desktopAnimation;

    return(
        <motion.div 
            className="paper-note-container" 
            style={{ x: '-50%', y: '-50%' }}
            {...animation}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }} 
            drag 
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        >
            <button onClick={onClose} className="paper-note-close">[x]</button>
            <p className="paper-note-text">Interested in my work?</p>
            <p className="paper-note-text hire-me">Click the link below</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="paper-note-link">Let's Talk</a>
            <span className="paper-note-signature">- Steven</span>
        </motion.div>
    );
};

const InventoryBagIcon = ({ onToggle }: { onToggle: () => void }) => (
    <button className="inventory-bag-icon" onClick={onToggle}>
        [INVENTORY]
    </button>
);

const GameInventory = ({ activeItem, onSelect, isMobile, playPip }: { activeItem: ActiveItemType; onSelect: (item: ActiveItemType) => void; isMobile: boolean; playPip: () => void; }) => {
    const inventoryItems = [
        { id: 'namecard', label: 'ID CARD', icon: '[ID]' },
        { id: 'controller', label: 'CONTROL PAD', icon: '✜' },
        { id: 'coverletter', label: 'NOTE', icon: '✉' },
    ] as const;

    const variants = {
        hidden: isMobile ? { y: '100%' } : { opacity: 0, y: -20 },
        visible: isMobile ? { y: '0%' } : { opacity: 1, y: 0 },
    };

    const handleSlotClick = (item: ActiveItemType) => {
        playPip();
        onSelect(item);
    };

    return (
        <motion.div className="inventory-bar" variants={variants} initial="hidden" animate="visible" exit="hidden" transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
            {inventoryItems.map(item => (
                <div key={item.id} className={`inventory-slot ${activeItem === item.id ? 'active' : ''}`} onClick={() => handleSlotClick(item.id)}>
                    <div className="slot-icon">{item.icon}</div>
                    <div className="slot-label">{item.label}</div>
                </div>
            ))}
        </motion.div>
    );
};

const MobileDetailView = ({ item, onClose }: { item: Project | Certificate, onClose: () => void }) => {
    return (
        <motion.div className="dossier-container is-mobile" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="dossier-header">
                <div className="dossier-tab">{isProject(item) ? 'PROJECT' : 'CERT.'}</div>
                <h2 className="dossier-title">{isProject(item) ? item.title : item.name}</h2>
                <button onClick={onClose} className="dossier-close-button">[ BACK ]</button>
            </div>
            <div className="dossier-body">
                {isProject(item) ? (
                    <><div className="dossier-section"><h3>I. OVERVIEW</h3><p>{item.description}</p></div><div className="dossier-section"><h3>II. TECHNICAL SPECS</h3><div className="skills-container">{item.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div></div><div className="dossier-section"><h3>III. FILE DETAILS</h3><div className="details-grid"><span>YEAR</span><span>{item.year}</span><span>TYPE</span><span>{item.type}</span><span>STATUS</span><span>{item.status}</span></div></div><div className="dossier-section"><h3>IV. EVIDENCE</h3><div className="dossier-gallery">{item.images.map(img => <Image key={img} src={img} width={500} height={300} alt="Project image" className="gallery-image" />)}</div></div></>
                ) : (
                    <><div className="dossier-section"><h3>ISSUER DETAILS</h3><div className="details-grid"><span>INSTITUTION</span><span>{item.institution}</span><span>YEAR</span><span>{item.year}</span></div></div><div className="dossier-section"><h3>PROOF OF COMPLETION</h3><div className="certificate-image-container"><Image src={item.imageUrl} width={800} height={550} alt="Certificate image" className="gallery-image" /></div></div></>
                )}
            </div>
        </motion.div>
    );
};
const CssCrtMonitor = ({ children, style }: { children: ReactNode, style: object }) => (<motion.div className="monitor-container" style={style}><div className="monitor-3d-wrapper"><div className="monitor-back" /><div className="monitor-stand" /><div className="monitor-bezel"><div className="monitor-screen"><div className="vignette-overlay" />{children}</div></div></div></motion.div>);

const ControlPad = ({ isPreview = false, dragConstraints, isPoweredOn, togglePower, handleNavigation, handleAction }: { isPreview?: boolean; dragConstraints?: React.RefObject<HTMLElement | null>; isPoweredOn?: boolean; togglePower?: () => void; handleNavigation?: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void; handleAction?: (action: 'SELECT' | 'BACK') => void; }) => {
    const [isInteracting, setIsInteracting] = useState(false);
    const interactionTimer = useRef<NodeJS.Timeout | null>(null);

    const handlePress = (callback: () => void) => {
        if (interactionTimer.current) clearTimeout(interactionTimer.current);
        setIsInteracting(true);
        callback();
        interactionTimer.current = setTimeout(() => {
            setIsInteracting(false);
        }, 300);
    };

    return (
        <motion.div className="controller" style={{ x: '-50%', y: '-50%' }} drag={!isPreview} dragConstraints={dragConstraints} dragMomentum={false} initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <div className="controller-top-section">
                <div className="speaker-grille"></div>
                <div className="controller-screen-deco">
                    <div className="controller-screen-scanline"></div>
                    {isInteracting ? (
                        <div className="radio-wave">
                            <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
                        </div>
                    ) : (
                        <span className="controller-screen-text">stevenmulya@gmail.com</span>
                    )}
                </div>
            </div>
            <div className="controller-mid-section">
                <div className="d-pad">
                    <button onClick={() => handlePress(() => handleNavigation?.('UP'))}>▲</button>
                    <button onClick={() => handlePress(() => handleNavigation?.('LEFT'))}>◀</button>
                    <button onClick={() => handlePress(() => handleNavigation?.('RIGHT'))}>▶</button>
                    <button onClick={() => handlePress(() => handleNavigation?.('DOWN'))}>▼</button>
                </div>
                <button onClick={togglePower} className={`power-button ${isPoweredOn && 'on'}`} aria-label="Power"><div></div></button>
                <div className="action-buttons">
                    <button onClick={() => handlePress(() => handleAction?.('SELECT'))} className="action-a">A</button>
                    <button onClick={() => handlePress(() => handleAction?.('BACK'))} className="action-b">B</button>
                </div>
            </div>
            <div className="controller-bottom-section"><div className="knob"><div className="knob-marker"></div></div><div className="knob"><div className="knob-marker"></div></div></div>
        </motion.div>
    );
};

const ProfileIcon = ({ onClick }: { onClick: () => void }) => {
    return (
        <button className="profile-icon" onClick={onClick}>
            <div className="profile-icon-text">?</div>
        </button>
    );
};

const GuidePopup = ({ onClose, playPip }: { onClose: () => void; playPip: () => void; }) => {
    const [text, setText] = useState("");
    const fullText = "Hello! I'm Steven. Use the INVENTORY button to get the Control Pad, then press the Power button (⏻) to start exploring.";
    useEffect(() => { setText(""); let i = 0; const typing = setInterval(() => { if (i < fullText.length) { setText(prev => prev + fullText.charAt(i)); i++; } else { clearInterval(typing); } }, 40); return () => clearInterval(typing); }, []);
    return (<motion.div className="guide-popup" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><button onClick={() => { playPip(); onClose(); }} className="guide-close-button">[X]</button><p>{text}<span className="blinking-cursor">_</span></p></motion.div>);
};
const FullscreenView = ({ item, onClose }: { item: Project | Certificate, onClose: () => void }) => {
    return (<motion.div className="fullscreen-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="dossier-container" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }}><div className="dossier-header"><div className="dossier-tab">{isProject(item) ? 'PROJECT FILE' : 'CERTIFICATE'}</div><h2 className="dossier-title">{isProject(item) ? item.title : item.name}</h2><button onClick={onClose} className="dossier-close-button">[ CLOSE ]</button></div>{isProject(item) ? (<div className="dossier-body project"><div className="dossier-section"><h3>I. OVERVIEW</h3><p>{item.description}</p></div><div className="dossier-section"><h3>II. TECHNICAL SPECIFICATIONS</h3><div className="skills-container">{item.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div></div><div className="dossier-section"><h3>III. FILE DETAILS</h3><div className="details-grid"><span>YEAR</span><span>{item.year}</span><span>TYPE</span><span>{item.type}</span><span>STATUS</span><span>{item.status}</span></div></div><div className="dossier-section"><h3>IV. EVIDENCE</h3><div className="dossier-gallery">{item.images.map(img => (<div key={img} className="gallery-item"><Image src={img} width={400} height={250} alt="Project image" className="gallery-image" /></div>))}</div></div></div>) : (<div className="dossier-body certificate"><div className="dossier-section"><h3>ISSUER DETAILS</h3><div className="details-grid"><span>INSTITUTION</span><span>{item.institution}</span><span>YEAR</span><span>{item.year}</span></div></div><div className="dossier-section"><h3>PROOF OF COMPLETION</h3><div className="certificate-image-container"><Image src={item.imageUrl} width={800} height={550} alt="Certificate image" className="gallery-image" /></div></div></div>)}</motion.div></motion.div>);
};

export default function HomePage() {
    const [isInitializing, setIsInitializing] = useState(true);
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const [section, setSection] = useState<'MENU' | 'PROJECTS' | 'CERTIFICATES'>('MENU');
    const [listIndex, setListIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState<ActiveItemType>(null);
    const [mobileDetailItem, setMobileDetailItem] = useState<Project | Certificate | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [fullscreenItem, setFullscreenItem] = useState<Project | Certificate | null>(null);

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const screenContentRef = useRef<HTMLDivElement>(null);
    const rotateY = useMotionValue(0); const rotateX = useMotionValue(0);
    
    const { play: playNav } = useSound('/map.mp3', { volume: 0.5 });
    const { play: playSelect } = useSound('/map.mp3', { volume: 0.8 });
    const { play: playBack } = useSound('/map.mp3', { volume: 0.6 });
    const { play: playPowerOn } = useSound('/map.mp3', { volume: 1 });
    const { play: playPowerOff } = useSound('/map.mp3', { volume: 1 });
    const { play: playPowerOnPC, stop: stopPowerOnPC } = useSound('/pcsound.wav', { volume: 0.5, loop: true });
    const { play: playPip } = useSound('/pip.wav', { volume: 0.7 });
    const { play: playPaper } = useSound('/paper.wav', { volume: 0.8 });

    const menuItems = useMemo(() => ['PROJECTS', 'CERTIFICATES'], []);
    const dataList = useMemo(() => {
        if (section === 'PROJECTS') return projects;
        if (section === 'CERTIFICATES') return certificates;
        return [];
    }, [section]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (section === 'MENU' || isBooting) return;
        const selectedElement = document.getElementById(`item-${listIndex}`);
        if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [listIndex, section, isBooting]);

    const handleInventorySelect = (item: ActiveItemType) => {
        const toggleOff = activeItem === item;
        setActiveItem(toggleOff ? null : item);
        setIsInventoryOpen(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isMobile || isInitializing) return;
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = mainContainerRef.current!;
        const y = (clientX - offsetWidth / 2) / offsetWidth * 50;
        const x = -(clientY - offsetHeight / 2) / offsetHeight * 30;
        animate(rotateY, y, { type: 'spring', stiffness: 100, damping: 30 });
        animate(rotateX, x, { type: 'spring', stiffness: 100, damping: 30 });
    };

    const togglePower = useCallback(() => {
        if (isInitializing) return;
        setIsPoweredOn(prev => {
            const newState = !prev;
            if (newState) {
                playPowerOn();
                playPowerOnPC();
                setIsBooting(true);
            } else {
                playPowerOff();
                stopPowerOnPC();
                setSection('MENU');
            }
            return newState;
        });
    }, [isInitializing, playPowerOn, playPowerOff, playPowerOnPC, stopPowerOnPC]);

    const handleNavigation = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
        if (!isPoweredOn || isBooting) return; playNav();
        const list = section === 'MENU' ? menuItems : dataList;
        setListIndex(prev => {
            if (direction === 'UP') return prev > 0 ? prev - 1 : list.length - 1;
            if (direction === 'DOWN') return prev < list.length - 1 ? prev + 1 : 0;
            return prev;
        });
    }, [isPoweredOn, isBooting, playNav, section, menuItems, dataList]);

    const handleAction = useCallback((action: 'SELECT' | 'BACK') => {
        if (!isPoweredOn || isBooting) return;
        if (action === 'SELECT') {
            playSelect();
            if (section === 'MENU') {
                setSection(menuItems[listIndex] as 'PROJECTS' | 'CERTIFICATES');
            } else {
                const item = dataList[listIndex];
                if (!item) return;
                if (isMobile) {
                    setMobileDetailItem(item);
                } else {
                    setFullscreenItem(item);
                }
            }
        } else if (action === 'BACK') {
            playBack();
            if (fullscreenItem) {
                setFullscreenItem(null);
            } else if (isMobile && mobileDetailItem) {
                setMobileDetailItem(null);
            } else if (section !== 'MENU') {
                setSection('MENU');
            }
        }
    }, [isPoweredOn, isBooting, playSelect, playBack, section, menuItems, listIndex, dataList, isMobile, mobileDetailItem, fullscreenItem]);

    useEffect(() => { if (isBooting) { const timer = setTimeout(() => setIsBooting(false), 1200); return () => clearTimeout(timer); } }, [isBooting]);
    useEffect(() => { setListIndex(0); }, [section]);

    const renderScreenContent = () => {
        if (isBooting) { return (<div className="boot-screen">BOOTING SMT-OS...</div>); }
        const list = section === 'MENU' ? menuItems : dataList;
        return (
            <div className="screen-content" ref={screenContentRef}>
                <h2 className="mb-4">// DIR: {section}</h2>
                <div>
                    {list.map((item, index) => {
                        const itemName = typeof item === 'string' ? item : (isProject(item) ? item.title : item.name);
                        return (<p key={itemName} id={`item-${index}`} className={`truncate ${index === listIndex ? 'selected-item' : ''}`}>{listIndex === index ? '> ' : '  '}{itemName}</p>);
                    })}
                </div>
            </div>
        );
    };
    
    const desktopLayoutClass = useMemo(() => {
        if(isMobile) return '';
        if(section === 'PROJECTS') return 'projects-view';
        if(section === 'CERTIFICATES') return 'certificates-view';
        return 'menu-view';
    }, [isMobile, section]);

    if (isInitializing) {
        return <InitializationLoader onComplete={() => setIsInitializing(false)} />;
    }

    return (
        <div>
            <AnimatePresence>
                {!isInitializing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="profile-icon-wrapper">
                            <ProfileIcon onClick={() => { playPip(); setIsGuideVisible(p => !p); }} />
                            <div className="profile-text-container">
                                <h1 className="profile-title">STEVEN MULYA T.</h1>
                                <p className="profile-subtitle">PORTFOLIO</p>
                            </div>
                        </div>

                        <main className="main-container" ref={mainContainerRef} onMouseMove={handleMouseMove}>
                            <div className="top-right-controls">
                                <InventoryBagIcon onToggle={() => { playPip(); setIsInventoryOpen(prev => !prev); }} />
                            </div>
                            
                            <AnimatePresence>
                                {isGuideVisible && <GuidePopup onClose={() => setIsGuideVisible(false)} playPip={playPip} />}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isInventoryOpen && (
                                    <>
                                        <motion.div className="inventory-overlay" onClick={() => { playPip(); setIsInventoryOpen(false); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                                        <GameInventory 
                                            activeItem={activeItem} 
                                            onSelect={handleInventorySelect} 
                                            isMobile={isMobile}
                                            playPip={playPip}
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            <div className={`desktop-layout-container ${desktopLayoutClass}`}>
                                <CssCrtMonitor style={{ rotateX, rotateY }}>
                                    {isPoweredOn ? <TerminalHUD>{renderScreenContent()}</TerminalHUD> : <div className="screen-off-overlay" />}
                                </CssCrtMonitor>
                            </div>

                            <AnimatePresence>
                                {activeItem === 'controller' && <ControlPad dragConstraints={mainContainerRef} isPoweredOn={isPoweredOn} togglePower={togglePower} handleNavigation={handleNavigation} handleAction={handleAction} />}
                                {activeItem === 'namecard' && <IdCard onClose={() => { playPaper(); setActiveItem(null); }} dragConstraints={mainContainerRef} playPaper={playPaper} />}
                                {activeItem === 'coverletter' && <CoverLetterView onClose={() => { playPaper(); setActiveItem(null); }} isMobile={isMobile} />}
                            </AnimatePresence>
                            
                            <AnimatePresence>
                                {isMobile && mobileDetailItem && <MobileDetailView item={mobileDetailItem} onClose={() => { playPaper(); setMobileDetailItem(null); }} />}
                            </AnimatePresence>

                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {fullscreenItem && <FullscreenView item={fullscreenItem} onClose={() => { playPaper(); setFullscreenItem(null); }} />}
            </AnimatePresence>
        </div>
    );
}