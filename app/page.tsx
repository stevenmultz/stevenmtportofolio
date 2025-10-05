'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate, useDragControls, Variants } from 'framer-motion';
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
                            <div className="card-field">
                                <span className="field-label">Name</span>
                                <span className="field-value">Steven M. Tjendratama</span>
                            </div>
                            <div className="card-field">
                                <span className="field-label">Designation</span>
                                <span className="field-value title">Software Engineer</span>
                            </div>
                            <div className="card-field">
                                <span className="field-label">ID Number</span>
                                <span className="field-value small">SMT-20251002</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="card-flip-info">
                            <span>⟳</span> FLIP FOR DETAILS
                        </div>
                        <div className="card-signature">Steven M.T.</div>
                    </div>
                </motion.div>
                <motion.div
                    className="card-back"
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: isFlipped ? 0 : -180 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="card-back-header">
                        <div className="card-mag-strip" />
                    </div>
                    <div className="card-content-back">
                        <p>This identification card is the property of Mulatama Corp. If found, please return to the nearest company office.</p>
                        <div className="card-contact-grid">
                            <a onClick={e => e.stopPropagation()} href={`mailto:${email}`}>
                                <span>EMAIL</span>
                                <div>{email}</div>
                            </a>
                            <a onClick={e => e.stopPropagation()} href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <span>WHATSAPP</span>
                                <div>+{whatsappNumber}</div>
                            </a>
                        </div>
                        <div className="card-barcode" />
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
        <div className="window-title-bar">
            <div className="window-title">MESSAGE.txt</div>
            {onClose && <button onClick={onClose} className="window-close-button">[x]</button>}
        </div>
        <div className="cover-letter-content">
            <pre>
                Hello,{"\n\n"}
                I am a passionate software engineer specializing in modern web technologies. My portfolio showcases my dedication to building clean, efficient, and user-friendly applications.{"\n\n"}
                I'm currently seeking new opportunities and would be thrilled to discuss how my skills can bring value to your team.
            </pre>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-button">
                Let's Talk
            </a>
        </div>
    </motion.div>
);

const InventoryBagIcon = ({ onToggle }: { onToggle: () => void }) => (
    <button className="inventory-bag-icon" onClick={onToggle}>
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

const MobileDetailView = ({ item, onClose }: { item: Project | Certificate, onClose: () => void }) => {
    return (
        <motion.div className="mobile-detail-view" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="mobile-detail-header">
                <button onClick={onClose} className="mobile-close-button">← BACK</button>
            </div>
            <div className="mobile-detail-content">
                <h2 className="mobile-detail-title">{isProject(item) ? item.title : item.name}</h2>
                <div className="mobile-detail-meta">
                    <span>{item.year}</span>
                    <span className="meta-divider">|</span>
                    <span>{isProject(item) ? item.type : item.institution}</span>
                    {isProject(item) && <><span className="meta-divider">|</span><span>{item.status}</span></>}
                </div>

                {isProject(item) ? (
                    <>
                        <div className="mobile-detail-section">
                            <h3 className="mobile-detail-section-title">DESCRIPTION</h3>
                            <p>{item.description}</p>
                        </div>
                        <div className="mobile-detail-section">
                            <h3 className="mobile-detail-section-title">TECH STACK</h3>
                            <div className="skills-container">
                                {item.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                            </div>
                        </div>
                        <div className="mobile-detail-section">
                            <h3 className="mobile-detail-section-title">GALLERY</h3>
                            {item.images.map(img => <Image key={img} src={img} width={500} height={300} alt="Project image" className="mobile-image" />)}
                        </div>
                    </>
                ) : (
                    <div className="mobile-detail-section">
                        <h3 className="mobile-detail-section-title">PROOF OF COMPLETION</h3>
                        <Image src={item.imageUrl} width={500} height={350} alt="Certificate image" className="mobile-image" />
                    </div>
                )}
            </div>
        </motion.div>
    );
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
    const fullText = "Hello! I'm Steven. Use the INVENTORY text to get the Control Pad, then press the Power button (⏻) to start exploring.";

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

const PreviewPanel = ({ imageUrl }: { imageUrl: string }) => (
    <motion.div
      className="preview-panel"
      key={imageUrl}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={imageUrl} alt="Preview" width={400} height={400} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
    </motion.div>
);

const FullscreenView = ({ item, onClose }: { item: Project | Certificate, onClose: () => void }) => {
    return (
        <motion.div 
            className="fullscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="fullscreen-content"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="fullscreen-header">
                    <h2 className="fullscreen-title">{isProject(item) ? item.title : item.name}</h2>
                    <button onClick={onClose} className="window-close-button">[x]</button>
                </div>
                <div className="fullscreen-body">
                    {isProject(item) ? (
                        <>
                            <div className="fullscreen-info-panel">
                                <div className="fullscreen-section">
                                    <h3>DESCRIPTION</h3>
                                    <p>{item.description}</p>
                                </div>
                                <div className="fullscreen-section">
                                    <h3>DETAILS</h3>
                                    <div className="details-grid">
                                        <span>YEAR</span><span>{item.year}</span>
                                        <span>TYPE</span><span>{item.type}</span>
                                        <span>STATUS</span><span>{item.status}</span>
                                    </div>
                                </div>
                                <div className="fullscreen-section">
                                    <h3>TECH STACK</h3>
                                    <div className="skills-container">
                                        {item.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className="fullscreen-gallery-panel">
                                <h3>GALLERY</h3>
                                <div className="gallery-grid">
                                    {item.images.map(img => <Image key={img} src={img} width={400} height={250} alt="Project image" className="gallery-image" />)}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                           <div className="fullscreen-info-panel">
                                <div className="fullscreen-section">
                                    <h3>DETAILS</h3>
                                    <div className="details-grid">
                                        <span>ISSUER</span><span>{item.institution}</span>
                                        <span>YEAR</span><span>{item.year}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="fullscreen-gallery-panel">
                                <h3>CERTIFICATE</h3>
                                <Image src={item.imageUrl} width={800} height={550} alt="Certificate image" className="gallery-image" />
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function HomePage() {
    const [isAnimating, setIsAnimating] = useState(true);
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const [section, setSection] = useState<'MENU' | 'PROJECTS' | 'CERTIFICATES'>('MENU');
    const [listIndex, setListIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState<ActiveItemType>(null);
    const [mobileDetailItem, setMobileDetailItem] = useState<Project | Certificate | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [fullscreenItem, setFullscreenItem] = useState<Project | Certificate | null>(null);

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const screenContentRef = useRef<HTMLDivElement>(null);
    const rotateY = useMotionValue(0); const rotateX = useMotionValue(0);
    const playNav = useSound('/map.mp3', 0.5); const playSelect = useSound('/map.mp3', 0.8);
    const playBack = useSound('/map.mp3', 0.6); const playPowerOn = useSound('/map.mp3', 1);
    const playPowerOff = useSound('/map.mp3', 1);
    const playPowerOnPC = useSound('/pcsound.wav', 0.5);

    const menuItems = useMemo(() => ['PROJECTS', 'CERTIFICATES'], []);
    const dataList = useMemo(() => {
        if (section === 'PROJECTS') return projects;
        if (section === 'CERTIFICATES') return certificates;
        return [];
    }, [section]);

    const iconWrapperVariants: Variants = {
        initial: { top: "50%", left: "50%", x: "-50%", y: "-50%", scale: 1.5 },
        animate: { top: "1rem", left: "1rem", x: "0%", y: "0%", scale: 1, transition: { delay: 2.7, duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
    };
    
    const iconRevealVariants: Variants = {
        initial: { clipPath: "inset(100% 0% 0% 0%)" },
        animate: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] } }
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile && isPoweredOn && (section === 'PROJECTS' || section === 'CERTIFICATES')) {
          const currentItem = dataList[listIndex];
          if (isProject(currentItem) && currentItem.images.length > 0) {
            setPreviewImageUrl(currentItem.images[0]);
          } else if (isCertificate(currentItem)) {
            setPreviewImageUrl(currentItem.imageUrl);
          } else {
            setPreviewImageUrl(null);
          }
        } else {
          setPreviewImageUrl(null);
        }
    }, [listIndex, section, isMobile, isPoweredOn, dataList]);

    useEffect(() => {
        if (section === 'MENU' || isBooting) return;
        const selectedElement = document.getElementById(`item-${listIndex}`);
        if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [listIndex, section, isBooting]);

    const handleInventorySelect = (item: 'controller' | 'namecard' | 'coverletter') => {
        const toggleOff = activeItem === item;
        setActiveItem(toggleOff ? null : item);
        setIsInventoryOpen(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isMobile || isAnimating) return;
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = mainContainerRef.current!;
        const y = (clientX - offsetWidth / 2) / offsetWidth * 25;
        const x = -(clientY - offsetHeight / 2) / offsetHeight * 15;
        animate(rotateY, y, { type: 'spring', stiffness: 200, damping: 20 });
        animate(rotateX, x, { type: 'spring', stiffness: 200, damping: 20 });
    };

    const togglePower = useCallback(() => {
        if (isAnimating) return;
        setIsPoweredOn(prev => {
            const newState = !prev;
            if (newState) {
                playPowerOn();
                playPowerOnPC();
                setIsBooting(true);
            } else {
                playPowerOff();
                setSection('MENU');
            }
            return newState;
        });
    }, [isAnimating, playPowerOn, playPowerOff, playPowerOnPC]);

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
                    setPreviewImageUrl(null);
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

    return (
        <>
            <motion.div
                className="profile-icon-wrapper"
                variants={iconWrapperVariants}
                initial="initial"
                animate="animate"
                onAnimationComplete={() => setIsAnimating(false)}
            >
                <motion.div variants={iconRevealVariants}>
                    <ProfileIcon onClick={!isAnimating ? () => setIsGuideVisible(p => !p) : () => {}} />
                </motion.div>
                <AnimatePresence>
                    {!isAnimating && (
                        <motion.div
                            className="profile-text-container"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="profile-title">STEVEN MULYA T.</h1>
                            <p className="profile-subtitle">PORTFOLIO</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
            {!isAnimating && (
                <motion.main
                    className="main-container"
                    ref={mainContainerRef}
                    onMouseMove={handleMouseMove}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="top-right-controls">
                        <InventoryBagIcon onToggle={() => setIsInventoryOpen(prev => !prev)} />
                    </div>
                    
                    <AnimatePresence>
                        {isGuideVisible && <GuidePopup onClose={() => setIsGuideVisible(false)} />}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isInventoryOpen && (
                            <>
                                <motion.div className="inventory-overlay" onClick={() => setIsInventoryOpen(false)}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                                <InventoryPanel activeItem={activeItem} onSelect={handleInventorySelect} />
                            </>
                        )}
                    </AnimatePresence>

                    <div className={`desktop-layout-container ${desktopLayoutClass}`}>
                        <CssCrtMonitor style={{ rotateX, rotateY }}>
                            {isPoweredOn ? <TerminalHUD>{renderScreenContent()}</TerminalHUD> : <div className="screen-off-overlay" />}
                        </CssCrtMonitor>
                        
                        <AnimatePresence>
                            {previewImageUrl && <PreviewPanel imageUrl={previewImageUrl} />}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {activeItem === 'controller' && <ControlPad dragConstraints={mainContainerRef} isPoweredOn={isPoweredOn} togglePower={togglePower} handleNavigation={handleNavigation} handleAction={handleAction} />}
                        {activeItem === 'namecard' && <IdCard onClose={() => setActiveItem(null)} dragConstraints={mainContainerRef} />}
                        {activeItem === 'coverletter' && <CoverLetterView onClose={() => setActiveItem(null)} />}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                        {isMobile && mobileDetailItem && <MobileDetailView item={mobileDetailItem} onClose={() => setMobileDetailItem(null)} />}
                    </AnimatePresence>

                </motion.main>
            )}
            </AnimatePresence>
            
            <AnimatePresence>
                {fullscreenItem && <FullscreenView item={fullscreenItem} onClose={() => setFullscreenItem(null)} />}
            </AnimatePresence>
        </>
    );
}