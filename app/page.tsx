'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';

// =================================================================
// === STAGE 1: BOOT SEQUENCE COMPONENT (Loading Page)           ===
// =================================================================
const bootSequenceSteps = [
  "INITIALIZING BIOS...", "MEMORY CHECK: 256TB RAM... OK", "DETECTING STORAGE ARRAY... ONLINE",
  "LOADING KERNEL v2.5.25...", "MOUNTING FILE SYSTEMS...", "VIRTUAL CORE CALIBRATION... COMPLETE",
  "ACCESSING NEURAL INTERFACE...", "AUTHENTICATION SECURE...", "AWAITING OPERATOR INPUT."
];

const asciiLogo = `
███╗   ███╗████████╗
████╗ ████║╚══██╔══╝
██╔████╔██║   ██║   
██║╚██╔╝██║   ██║   
██║ ╚═╝ ██║   ██║   
╚═╝     ╚═╝   ╚═╝   
`;

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [log, setLog] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < bootSequenceSteps.length) {
      const timeout = setTimeout(() => {
        setLog(prev => [...prev, bootSequenceSteps[stepIndex]]);
        setStepIndex(stepIndex + 1);
      }, Math.random() * 150 + 50);
      return () => clearTimeout(timeout);
    } else {
      const finalTimeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(finalTimeout);
    }
  }, [stepIndex, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        {log.map((line, index) => (
          <p key={index} className="text-lg crt-text">&gt; {line}</p>
        ))}
      </div>
      {stepIndex >= bootSequenceSteps.length && (
        <motion.pre
          className="text-center text-xs md:text-sm crt-text mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {asciiLogo}
        </motion.pre>
      )}
    </div>
  );
};

// =============================================================
// === STAGE 2: LOGIN PROMPT COMPONENT (Start Page)          ===
// =============================================================
const LoginPrompt = ({ onSuccess }: { onSuccess: () => void }) => {
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>(['Type "start" to power on the system.']);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    const command = input.trim().toLowerCase();
    const newLog = [...log, `> ${command}`];

    if (command === 'start') {
      newLog.push('SYSTEM POWER ON. LOADING INTERFACE...');
      setLog(newLog);
      setTimeout(onSuccess, 1500);
    } else {
      newLog.push(`COMMAND NOT RECOGNIZED: "${command}"`);
      setLog(newLog);
    }
    setInput('');
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="w-full max-w-3xl h-64 text-lg">
        {log.map((line, index) => <p key={index} className="crt-text">{line}</p>)}
      </div>
      <div className="flex items-center text-xl mt-4 w-full max-w-3xl">
        <span className="crt-text">&gt;&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-grow bg-transparent border-none outline-none crt-text"
          autoFocus
        />
        <span className="blinking-cursor crt-text">_</span>
      </div>
    </motion.div>
  );
};

// =================================================================
// === STAGE 3: THE NEW ANALOG CONTROLLER INTERFACE              ===
// =================================================================
const AnalogController = () => {
  const [section, setSection] = useState<'PROJECTS' | 'CERTIFICATES' | 'CONTACT'>('PROJECTS');
  const [listIndex, setListIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Project | Certificate | null>(null);

  const listData = useMemo(() => {
    switch (section) {
      case 'PROJECTS': return projects;
      case 'CERTIFICATES': return certificates;
      default: return [];
    }
  }, [section]);

  // Reset index when section changes or when returning to list view
  useEffect(() => { setListIndex(0); }, [section]);
  useEffect(() => { if (selectedItem === null) setListIndex(0); }, [selectedItem]);


  const handleDPad = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (selectedItem) return; // D-pad is disabled when viewing details

    switch (direction) {
      case 'UP':
        setListIndex(prev => (prev > 0 ? prev - 1 : listData.length - 1));
        break;
      case 'DOWN':
        setListIndex(prev => (prev < listData.length - 1 ? prev + 1 : 0));
        break;
      case 'LEFT':
        setSection(prev => prev === 'PROJECTS' ? 'CONTACT' : prev === 'CERTIFICATES' ? 'PROJECTS' : 'CERTIFICATES');
        break;
      case 'RIGHT':
        setSection(prev => prev === 'PROJECTS' ? 'CERTIFICATES' : prev === 'CERTIFICATES' ? 'CONTACT' : 'PROJECTS');
        break;
    }
  };

  const handleSelect = () => {
    if (section !== 'CONTACT' && listData.length > 0) {
      setSelectedItem(listData[listIndex]);
    }
  };
  
  const handleBack = () => setSelectedItem(null);

  // Screen Content Rendering
  const renderScreenContent = () => {
    if (selectedItem) {
      // --- DETAIL VIEW ---
      const isProject = 'skills' in selectedItem;
      return (
        <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm md:text-base leading-tight">
          <pre className="whitespace-pre-wrap font-mono crt-text">
{`╔═══[ FILE: ${(isProject ? (selectedItem as Project).title : (selectedItem as Certificate).name).toUpperCase()} ]${'═'.repeat(30)}╗
║
║  NAME: ${isProject ? (selectedItem as Project).title : (selectedItem as Certificate).name}
║  TYPE: ${isProject ? (selectedItem as Project).type : (selectedItem as Certificate).institution}
║  YEAR: ${selectedItem.year}
${isProject ? `║  STATUS: ${(selectedItem as Project).status}\n` : ''}${isProject ? `║  DESC: ${(selectedItem as Project).description}\n` : ''}${isProject ? `║  SKILLS: ${(selectedItem as Project).skills.join(', ')}\n` : ''}║
╚${'═'.repeat(60)}╝`}
          </pre>
        </motion.div>
      );
    }

    if (section === 'CONTACT') {
      // --- CONTACT VIEW ---
      return (
         <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <pre className="whitespace-pre-wrap font-mono crt-text text-base md:text-lg">
{`╔═══[ CONTACT INFORMATION ]${'═'.repeat(30)}╗
║
║  Connect with SMT:
║
${contactDetails.trim().split('\n').map(line => `║  ${line.trim()}`).join('\n')}
║
╚${'═'.repeat(60)}╝`}
          </pre>
        </motion.div>
      );
    }

    // --- LIST VIEW ---
    const VISIBLE_ITEMS = 5;
    const startIndex = Math.max(0, listIndex - Math.floor(VISIBLE_ITEMS / 2));
    const visibleList = listData.slice(startIndex, startIndex + VISIBLE_ITEMS);
    
    return (
      <motion.div key={section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-lg md:text-xl crt-text mb-2">
          {`// ${section} [${listIndex + 1}/${listData.length}]`}
        </div>
        <div className="space-y-1 text-base md:text-lg">
          {visibleList.map((item, index) => {
            const actualIndex = startIndex + index;
            const isSelected = actualIndex === listIndex;
            return (
              <p key={'title' in item ? item.title : item.name} className={`transition-colors ${isSelected ? 'bg-green-900/50 crt-text' : 'text-white/40'}`}>
                {isSelected ? '>' : ' '} {'title' in item ? item.title : item.name}
              </p>
            );
          })}
        </div>
      </motion.div>
    );
  };
  
  // Controller Component
  return (
    <motion.div 
      className="p-4 w-full min-h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      <div className="w-full max-w-md md:max-w-lg device-chassis rounded-lg p-4 md:p-6 space-y-4">
        {/* Screen Area */}
        <div className="h-80 md:h-96 screen-bezel rounded flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {renderScreenContent()}
          </AnimatePresence>
        </div>
        
        {/* Controls Area */}
        <div className="grid grid-cols-3 gap-4 items-center pt-4">
          {/* D-PAD */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto">
            <button onClick={() => handleDPad('UP')} className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 ascii-button flex items-center justify-center text-xl">^</button>
            <button onClick={() => handleDPad('LEFT')} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 ascii-button flex items-center justify-center text-xl">&lt;</button>
            <button onClick={() => handleDPad('RIGHT')} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 ascii-button flex items-center justify-center text-xl">&gt;</button>
            <button onClick={() => handleDPad('DOWN')} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 ascii-button flex items-center justify-center text-xl">v</button>
          </div>
          
          {/* Section Indicator */}
          <div className="text-center">
            <p className="text-xs text-white/50">SECTION</p>
            <p className="text-lg md:text-xl crt-text">{section}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4">
            <button onClick={handleSelect} className="w-20 h-12 md:w-24 md:h-14 ascii-button rounded-full text-lg">SELECT</button>
            <button onClick={handleBack} className="w-20 h-12 md:w-24 md:h-14 ascii-button rounded-full text-lg">BACK</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================
// === MAIN PAGE CONTROLLER                                  ===
// =============================================================
export default function HomePage() {
  const [stage, setStage] = useState<'BOOTING' | 'LOGIN' | 'CONTROLLER'>('BOOTING');

  const renderStage = () => {
    switch (stage) {
      case 'BOOTING':
        return <BootSequence onComplete={() => setStage('LOGIN')} />;
      case 'LOGIN':
        return <LoginPrompt onSuccess={() => setStage('CONTROLLER')} />;
      case 'CONTROLLER':
        return <AnalogController />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-black font-mono">
      {renderStage()}
    </main>
  );
}