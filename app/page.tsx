'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate, useDragControls } from 'framer-motion';
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';
import { useSound } from '@/app/hooks/useSound';
import TerminalHUD from '@/app/components/TerminalHUD';
import AsciiTetris from '@/app/components/AsciiTetris';
import AsciiSnake from '@/app/components/AsciiSnake';

// --- Helper: Parse Contact Details ---
const emailMatch = contactDetails.match(/Email: (.*)/);
const whatsappMatch = contactDetails.match(/Whatsapp: \+([0-9]+)/);
const email = emailMatch ? emailMatch[1].trim() : '';
const whatsappNumber = whatsappMatch ? whatsappMatch[1].trim() : '';
const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';

// --- TYPE GUARDS ---
const isProject = (item: Project | Certificate | null): item is Project => !!item && 'skills' in item;
const isCertificate = (item: Project | Certificate | null): item is Certificate => !!item && 'imageUrl' in item;

// --- UTILITY TYPES ---
interface Window { id: string; title: string; type: 'INFO' | 'IMAGE'; content: Project | Certificate | string; initialPos: { x: number; y: number }; }
type ActiveItemType = 'controller' | 'namecard' | 'coverletter' | null;
type SectionType = 'MENU' | 'PROJECTS' | 'CERTIFICATES' | 'TETRIS' | 'SNAKE';

// === UI COMPONENTS ===

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [title, setTitle] = useState("██████ ██");
    const [subtitle, setSubtitle] = useState("███████ ███ ███");
    const finalTitle = "STEVEN MT";
    const finalSubtitle = "LOOKING FOR JOB";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_./\\|<>*#@!&%$";

    useEffect(() => {
        let interval: NodeJS.Timeout;
        const scramble = (targetText: string, setText: React.Dispatch<React.SetStateAction<string>>, onDone?: () => void) => {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                setText(
                    targetText.split("").map((_char, index) => {
                        if (index < iteration) return targetText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );
                if (iteration >= targetText.length) {
                    clearInterval(interval);
                    onDone?.();
                }
                iteration += 1 / 3;
            }, 50);
        };

        const subtitleTimer = setTimeout(() => {
            scramble(finalSubtitle, setSubtitle);
        }, 1200);

        scramble(finalTitle, setTitle, () => {
             setTimeout(onComplete, 1000);
        });

        return () => {
            clearInterval(interval);
            clearTimeout(subtitleTimer);
        };
    }, [onComplete]);

    return (
        <motion.div className="loading-overlay" exit={{ opacity: 0 }}>
            <div className="loading-crt-effect">
                <div className="loading-text-container">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
            </div>
        </motion.div>
    );
};

const DraggableWindow = ({ windowData, onClose }: { windowData: Window, onClose: (id: string) => void }) => {
    const dragControls = useDragControls();
    const renderContent = () => {
        if (windowData.type === 'IMAGE' && typeof windowData.content === 'string') {
            return <Image src={windowData.content} alt={windowData.title} layout="fill" objectFit="contain" className="window-image-content" />;
        }
        if (windowData.type === 'INFO') {
            if (isProject(windowData.content as Project)) {
                const p = windowData.content as Project;
                return <pre className="window-text-content">{`TITLE: ${p.title}\nYEAR: ${p.year}\nTYPE: ${p.type}\n\nDESC:\n${p.description}\n\nSKILLS: ${p.skills.join(', ')}`}</pre>;
            }
            if (isCertificate(windowData.content as Certificate)) {
                const c = windowData.content as Certificate;
                return <pre className="window-text-content">{`CERT: ${c.name}\nFROM: ${c.institution}\nYEAR: ${c.year}`}</pre>;
            }
        } return null;
    };
    return (
        <motion.div className="window-container" drag dragListener={false} dragControls={dragControls} dragMomentum={false}
            initial={{ x: windowData.initialPos.x, y: windowData.initialPos.y, opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <div className="window-title-bar" onPointerDown={(e) => dragControls.start(e)}><div className="window-title">{windowData.title}</div><button onClick={() => onClose(windowData.id)} className="window-close-button">[x]</button></div>
            <div className="window-main-content">{renderContent()}</div>
        </motion.div>
    );
};

const IdCard = ({ onClose, dragConstraints }: { onClose?: () => void, dragConstraints?: React.RefObject<HTMLElement | null> }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <motion.div 
            className="card-container"
            drag dragConstraints={dragConstraints} dragMomentum={false}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <div className="card-flipper" onClick={() => setIsFlipped(p => !p)}>
                <motion.div 
                    className="card-front"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="card-header">
                        <h3>IDENTIFICATION_</h3>
                        {onClose && <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="card-close-button">[X]</button>}
                    </div>
                    <div className="card-content-front">
                        <div className="card-photo">
                            <Image src="/user.png" alt="User Photo" width={100} height={100} />
                        </div>
                        <div className="card-info-front">
                            <h2>Steven M. T.</h2>
                            <p>Software Engineer</p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <span>[ Click to Flip ]</span>
                    </div>
                </motion.div>
                <motion.div 
                    className="card-back"
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: isFlipped ? 0 : -180 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                     <div className="card-header"><h3>CONTACT_INFO_</h3></div>
                     <div className="card-content-back">
                        <p><span>EMAIL</span><a onClick={e => e.stopPropagation()} href={`mailto:${email}`}>{email}</a></p>
                        <p><span>WAPP</span><a onClick={e => e.stopPropagation()} href={whatsappLink} target="_blank" rel="noopener noreferrer">+{whatsappNumber}</a></p>
                        <p><span>LOCATION</span>Tangerang, ID</p>
                     </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const CoverLetterView = ({ onClose }: { onClose?: () => void }) => (
    <motion.div 
        className="cover-letter-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
    >
        <div className="cover-letter-header">
            <h3>NOTE.txt</h3>
            {onClose && <button onClick={onClose} className="cover-letter-close-button">[X]</button>}
        </div>
        <div className="cover-letter-content">
            <p><strong>TO:</strong> Hiring Manager</p>
            <p><strong>SUBJECT:</strong> Software Engineer Application</p>
            <br/>
            <p>Passionate developer with expertise in React & Next.js. My portfolio showcases my ability to build clean, efficient applications. Ready to contribute to your team.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-button">
                Contact Me
            </a>
        </div>
    </motion.div>
);

const InventoryBagIcon = ({ onToggle, isOpen }: { onToggle: () => void, isOpen: boolean }) => (
    <button className={`inventory-bag-icon ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        [INVENTORY]
    </button>
);

const InventoryPanel = ({ activeItem, onSelect }: { activeItem: ActiveItemType, onSelect: (item: 'controller' | 'namecard' | 'coverletter') => void }) => (
    <motion.div 
        className="inventory-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
    >
        <button className={`inventory-slot ${activeItem === 'namecard' && 'active'}`} onClick={() => onSelect('namecard')}>ID CARD</button>
        <button className={`inventory-slot ${activeItem === 'controller' && 'active'}`} onClick={() => onSelect('controller')}>CONTROL PAD</button>
        <button className={`inventory-slot ${activeItem === 'coverletter' && 'active'}`} onClick={() => onSelect('coverletter')}>COVER LETTER</button>
    </motion.div>
);

const ItemPreview = ({ item, onAnimationComplete }: { item: ActiveItemType, onAnimationComplete: () => void }) => {
    if (!item) return null;
    return (
        <motion.div className="item-preview-overlay">
            <motion.div
                className="item-preview-content"
                initial={{ scale: 0, rotateY: 0 }}
                animate={{ scale: 1, rotateY: 360 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: "circOut" }}
                onAnimationComplete={onAnimationComplete}
            >
                {item === 'controller' ? <ControlPad isPreview /> : <IdCard />}
            </motion.div>
        </motion.div>
    );
};

const MobileDetailView = ({ item, onClose }: { item: Project | Certificate, onClose: () => void }) => {
    return (
        <motion.div className="mobile-detail-view" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ ease: 'circOut' }}>
            <div className="mobile-detail-header">
                <h3>// FILE: {isProject(item) ? item.title.toUpperCase() : item.name.toUpperCase()}</h3>
                <button onClick={onClose} className="mobile-close-button">[ B: CLOSE ]</button>
            </div>
            <div className="mobile-detail-content">
                {isProject(item) ? (
                    <>
                        <div className="detail-card">
                            <h4>PROPERTIES</h4>
                            <p><span>TYPE:</span> {item.type}</p>
                            <p><span>YEAR:</span> {item.year}</p>
                            <p><span>STATUS:</span> {item.status}</p>
                        </div>
                        <div className="detail-card">
                            <h4>DESCRIPTION</h4>
                            <p className="description">{item.description}</p>
                        </div>
                        <div className="detail-card">
                            <h4>TECH STACK</h4>
                            <p className="skills">{item.skills.join(', ')}</p>
                        </div>
                        <div className="detail-card">
                            <h4>VISUAL DATA</h4>
                            {item.images.map(img => <Image key={img} src={img} width={500} height={300} alt="Project image" className="mobile-image" />)}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="detail-card">
                            <h4>PROPERTIES</h4>
                            <p><span>FROM:</span> {item.institution}</p>
                            <p><span>YEAR:</span> {item.year}</p>
                        </div>
                        <div className="detail-card">
                            <h4>PROOF OF COMPLETION</h4>
                            <Image src={item.imageUrl} width={500} height={350} alt="Certificate image" className="mobile-image" />
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    )
};

const CssCrtMonitor = ({ children, style }: { children: ReactNode, style: object }) => (
    <motion.div className="monitor-container" style={style}>
        <div className="monitor-3d-wrapper">
            <div className="monitor-back" /><div className="monitor-stand" />
            <div className="monitor-bezel">
                <div className="monitor-screen"><div className="vignette-overlay" />{children}</div>
            </div>
        </div>
    </motion.div>
);

const ControlPad = ({ isPreview = false, dragConstraints, isPoweredOn, togglePower, handleNavigation, handleAction }: {
    isPreview?: boolean; dragConstraints?: React.RefObject<HTMLElement | null>; isPoweredOn?: boolean; togglePower?: () => void; handleNavigation?: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void; handleAction?: (action: 'SELECT' | 'BACK') => void;
}) => (
    <motion.div className="controller" 
        drag={!isPreview} dragConstraints={dragConstraints} dragMomentum={false} 
        initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
        <div className="controller-top-section"><div className="speaker-grille"></div><div className="controller-screen-deco"><div className="controller-screen-scanline"></div><span className="controller-screen-text">STEVEN MULYA TJENDRATAMA 2025</span></div></div>
        <div className="controller-mid-section">
             <div className="d-pad"><button onClick={() => handleNavigation?.('UP')}>▲</button><button onClick={() => handleNavigation?.('LEFT')}>◀</button><button onClick={() => handleNavigation?.('RIGHT')}>▶</button><button onClick={() => handleNavigation?.('DOWN')}>▼</button></div>
            <button onClick={togglePower} className={`power-button ${isPoweredOn && 'on'}`} aria-label="Power"><div></div></button>
             <div className="action-buttons"><button onClick={() => handleAction?.('SELECT')} className="action-a">A</button><button onClick={() => handleAction?.('BACK')} className="action-b">B</button></div>
        </div>
        <div className="controller-bottom-section"><div className="knob"><div className="knob-marker"></div></div><div className="knob"><div className="knob-marker"></div></div></div>
    </motion.div>
);

const ProfileIcon = ({ onClick }: { onClick: () => void }) => {
    return (
        <button className="profile-icon" onClick={onClick}>
            <div className="face">
                <div className="eye left"></div>
                <div className="eye right"></div>
                <div className="mouth"></div>
            </div>
        </button>
    )
};

const GuidePopup = ({ onClose }: { onClose: () => void }) => {
    const [text, setText] = useState("");
    const fullText = "Hello! I'm Steven. Use the [INVENTORY] button to get the Control Pad, then press the Power button (⏻) to start exploring.";

    useEffect(() => {
        setText("");
        let i = 0;
        const typing = setInterval(() => {
            if (i < fullText.length) {
                setText(prev => prev + fullText.charAt(i));
                i++;
            } else {
                clearInterval(typing);
            }
        }, 40);
        return () => clearInterval(typing);
    }, []);

    return (
        <motion.div 
            className="guide-popup"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <button onClick={onClose} className="guide-close-button">[X]</button>
            <p>{text}<span className="blinking-cursor">_</span></p>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const [section, setSection] = useState<SectionType>('MENU');
    const [listIndex, setListIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [windows, setWindows] = useState<Window[]>([]);
    const [activeItem, setActiveItem] = useState<ActiveItemType>(null);
    const [previewItem, setPreviewItem] = useState<ActiveItemType>(null);
    const [mobileDetailItem, setMobileDetailItem] = useState<Project | Certificate | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const screenContentRef = useRef<HTMLDivElement>(null);
    const rotateY = useMotionValue(0); const rotateX = useMotionValue(0);
    const playNav = useSound('/map.mp3', 0.5); const playSelect = useSound('/map.mp3', 0.8);
    const playBack = useSound('/map.mp3', 0.6); const playPowerOn = useSound('/map.mp3', 1);
    const playPowerOff = useSound('/map.mp3', 1);
    
    const menuItems = useMemo(() => ['PROJECTS', 'CERTIFICATES', 'TETRIS', 'SNAKE'], []);
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

    const handleInventorySelect = (item: 'controller' | 'namecard' | 'coverletter') => {
        const toggleOff = activeItem === item;
        if (isMobile) {
            setActiveItem(toggleOff ? null : item);
        } else if (item === 'coverletter') {
            setActiveItem(toggleOff ? null : item);
        } else {
            setActiveItem(null);
            if (!toggleOff) {
                setPreviewItem(item);
            }
        }
        setIsInventoryOpen(false);
    };

    const handlePreviewAnimationComplete = () => {
        setActiveItem(previewItem);
        setPreviewItem(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(isMobile || isLoading) return;
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = mainContainerRef.current!;
        const y = (clientX - offsetWidth / 2) / offsetWidth * 25;
        const x = -(clientY - offsetHeight / 2) / offsetHeight * 15;
        animate(rotateY, y, { type: 'spring', stiffness: 200, damping: 20 });
        animate(rotateX, x, { type: 'spring', stiffness: 200, damping: 20 });
    };

    const closeWindow = (id: string) => { setWindows(prev => prev.filter(w => w.id !== id)); };

    const togglePower = useCallback(() => {
        if (isLoading) return;
        setIsPoweredOn(prev => { 
            const newState = !prev; 
            if (newState) { playPowerOn(); setIsBooting(true); } 
            else { playPowerOff(); setSection('MENU'); setWindows([]); } 
            return newState; 
        });
    }, [isLoading, playPowerOn, playPowerOff]);
    
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
                setSection(menuItems[listIndex] as SectionType);
            } else if (section === 'PROJECTS' || section === 'CERTIFICATES') {
                const item = dataList[listIndex];
                if (!item) return;
                if (isMobile) {
                    setMobileDetailItem(item);
                } else {
                    const newWindows: Window[] = [];
                    newWindows.push({ id: isProject(item) ? item.title : item.name, title: 'INFO.TXT', type: 'INFO', content: item, initialPos: { x: window.innerWidth * 0.05, y: window.innerHeight * 0.1 } });
                    if (isProject(item) && item.images) {
                        item.images.forEach((img, i) => newWindows.push({ id: `${item.title}-img-${i}`, title: `IMG_0${i+1}.JPG`, type: 'IMAGE', content: img, initialPos: { x: window.innerWidth * (0.55 + i*0.05), y: window.innerHeight * (0.12 + i*0.05) } }));
                    } else if (isCertificate(item)) {
                        newWindows.push({ id: `${item.name}-img`, title: 'PROOF.JPG', type: 'IMAGE', content: item.imageUrl, initialPos: { x: window.innerWidth * 0.55, y: window.innerHeight * 0.12 } });
                    }
                    setWindows(newWindows);
                }
            }
        } else if (action === 'BACK') {
            playBack();
            if (isMobile && mobileDetailItem) { setMobileDetailItem(null); } 
            else if (windows.length > 0) { setWindows([]); } 
            else if (section !== 'MENU') { setSection('MENU'); }
        }
    }, [isPoweredOn, isBooting, playSelect, playBack, section, menuItems, listIndex, dataList, windows, isMobile, mobileDetailItem]);
    
    useEffect(() => { if (isBooting) { const timer = setTimeout(() => setIsBooting(false), 1200); return () => clearTimeout(timer); } }, [isBooting]);
    useEffect(() => { setListIndex(0); }, [section]);
    
    const renderScreenContent = () => {
        if (isBooting) { return ( <div className="boot-screen">BOOTING SMT-OS...</div> ); }
        
        if (section === 'TETRIS') return <AsciiTetris />;
        if (section === 'SNAKE') return <AsciiSnake />;

        const list = section === 'MENU' ? menuItems : dataList;
        return ( 
            <div className="screen-content" ref={screenContentRef}>
                <h2 className="mb-4">// DIR: {section}</h2>
                <div> 
                    {list.map((item, index) => {
                        const itemName = typeof item === 'string' ? item : (isProject(item) ? item.title : item.name);
                        return ( <p key={itemName} id={`item-${index}`} className={`truncate ${index === listIndex ? 'selected-item' : ''}`}>{listIndex === index ? '> ' : '  '}{itemName}</p> );
                    })} 
                </div>
            </div> 
        );
    };
    
    return (
        <main className="main-container" ref={mainContainerRef} onMouseMove={handleMouseMove}>
            <AnimatePresence>{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}</AnimatePresence>
            <AnimatePresence>{!isMobile && windows.map(w => <DraggableWindow key={w.id} windowData={w} onClose={closeWindow} />)}</AnimatePresence>

            {!isLoading && (
                <>
                    <ProfileIcon onClick={() => setIsGuideVisible(p => !p)} />
                    <AnimatePresence>{isGuideVisible && <GuidePopup onClose={() => setIsGuideVisible(false)} />}</AnimatePresence>
                    <InventoryBagIcon onToggle={() => setIsInventoryOpen(prev => !prev)} isOpen={isInventoryOpen} />
                    <AnimatePresence>
                        {isInventoryOpen && (
                            <>
                                <motion.div className="inventory-overlay" onClick={() => setIsInventoryOpen(false)}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                                <InventoryPanel activeItem={activeItem} onSelect={handleInventorySelect} />
                            </>
                        )}
                    </AnimatePresence>
                    
                    <CssCrtMonitor style={{ rotateX, rotateY }}>
                        {isPoweredOn ? <TerminalHUD>{renderScreenContent()}</TerminalHUD> : <div className="screen-off-overlay" />}
                    </CssCrtMonitor>
                    
                    {!isMobile && ( <AnimatePresence>{previewItem && <ItemPreview item={previewItem} onAnimationComplete={handlePreviewAnimationComplete} />}</AnimatePresence> )}

                    <AnimatePresence>
                        {activeItem === 'controller' && <ControlPad dragConstraints={mainContainerRef} isPoweredOn={isPoweredOn} togglePower={togglePower} handleNavigation={handleNavigation} handleAction={handleAction} />}
                        {activeItem === 'namecard' && <IdCard onClose={() => setActiveItem(null)} dragConstraints={mainContainerRef} />}
                        {activeItem === 'coverletter' && <CoverLetterView onClose={() => setActiveItem(null)} />}
                    </AnimatePresence>
                    
                    <AnimatePresence>{isMobile && mobileDetailItem && <MobileDetailView item={mobileDetailItem} onClose={() => setMobileDetailItem(null)} />}</AnimatePresence>
                </>
            )}
        </main>
    );
}