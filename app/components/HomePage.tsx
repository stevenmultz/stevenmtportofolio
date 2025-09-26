'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
// Pastikan path ke data Anda sudah benar
import { projects, certificates, contactDetails, Project, Certificate } from '@/app/data/portfolioData';

// =============================================================
// === TYPE DEFINITIONS ===
// =============================================================
interface ProjectModalProps { project: Project; onClose: () => void; }
interface CertificateModalProps { certificate: Certificate; onClose: () => void; }
interface ProjectSectionProps { handleProjectClick: (project: Project) => void; }
interface CertificatesSectionProps { handleCertificateClick: (certificate: Certificate) => void; }

// =============================================================
// === BACKGROUND & DECORATIVE COMPONENTS ===
// =============================================================

const MATRIX_CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

const GridBackground = () => (
  <div className="absolute inset-0 z-0 h-full w-full bg-transparent">
    <div className="absolute inset-0 h-full w-full bg-black [background:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:3rem_3rem]"></div>
  </div>
);

const SubtleDataStream = () => {
  const columns = useMemo(() => Array(40).fill(0).map((_, i) => ({
    id: i,
    chars: Array(20).fill(0).map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join(''),
    duration: Math.random() * 20 + 25,
    delay: Math.random() * 15,
  })), []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {columns.map(col => (
        <motion.p
          key={col.id}
          className="font-mono text-green-400/5 text-sm break-all absolute leading-tight"
          style={{ left: `${(100 / columns.length) * col.id}%`, writingMode: 'vertical-rl', textOrientation: 'upright' }}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{ duration: col.duration, delay: col.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// =============================================================
// === MODAL COMPONENTS ===
// =============================================================

const ProjectModal = ({ project, onClose }: ProjectModalProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-[#0A0A0A] border border-green-400/30 rounded-lg p-6 md:p-8 w-full max-w-4xl text-white relative overflow-y-auto max-h-[90vh] font-mono custom-scrollbar"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl z-20">&times;</button>
      <h2 className="text-2xl md:text-3xl font-bold mb-1 text-green-400">{project.title}</h2>
      <p className="text-md md:text-lg mb-6 text-white/60">{project.type} ({project.year})</p>
      <p className="text-base leading-relaxed text-white/80 mb-6">{project.description}</p>
      <h3 className="font-bold mb-3 text-white/60 text-sm uppercase tracking-wider">Skills Acquired</h3>
      <div className="flex flex-wrap gap-2 mb-6">{project.skills.map(skill => <span key={skill} className="bg-green-400/10 text-green-300 text-xs px-3 py-1 rounded-full">{skill}</span>)}</div>
      <h3 className="font-bold mb-3 text-white/60 text-sm uppercase tracking-wider">Project Links</h3>
      <div className="flex flex-wrap gap-4 items-center mb-6">{project.links.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{link.label} &rarr;</a>)}</div>
      <h3 className="font-bold mb-3 text-white/60 text-sm uppercase tracking-wider">Gallery</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.images.map((img, index) => (
          <div key={index} className="relative w-full aspect-video">
            <Image 
              src={img} 
              alt={`${project.title} screenshot ${index + 1}`} 
              layout="fill"
              objectFit="cover"
              className="rounded-md border border-white/10" 
            />
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

const CertificateModal = ({ certificate, onClose }: CertificateModalProps) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-[#0A0A0A] border border-green-400/30 rounded-lg p-6 md:p-8 w-full max-w-2xl text-white relative overflow-y-auto max-h-[90vh] font-mono custom-scrollbar"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl z-20">&times;</button>
      <div className="relative w-full aspect-video mb-6">
        <Image 
            src={certificate.imageUrl} 
            alt={`Certificate for ${certificate.name}`} 
            layout="fill"
            objectFit="contain"
            className="rounded-lg border border-white/10"
        />
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-green-400">{certificate.name}</h2>
      <p className="text-md md:text-lg text-white/60">{certificate.institution} ({certificate.year})</p>
    </motion.div>
  </motion.div>
);


// =============================================================
// === CONTENT SECTION COMPONENTS ===
// =============================================================

const ProjectListItem = ({ project, onClick }: { project: Project, onClick: (p: Project) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="group relative cursor-pointer py-5 md:py-6 border-b border-white/10 transition-transform duration-300 md:hover:scale-[1.01]"
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl md:text-2xl text-white/80 group-hover:text-white transition-colors duration-300">{project.title}</h3>
          <p className="text-sm md:text-base text-white/40 group-hover:text-white/60 transition-colors duration-300">{project.type} // {project.year}</p>
        </div>
        <motion.span className="text-3xl text-green-400 transition-transform duration-300 opacity-0 group-hover:opacity-100" animate={{ x: isHovered ? 10 : 0 }}>→</motion.span>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-green-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
};

const ProjectSection = ({ handleProjectClick }: ProjectSectionProps) => (
  <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
    {projects.map(project => <ProjectListItem key={project.title} project={project} onClick={handleProjectClick} />)}
  </motion.div>
);

const CertificatesSection = ({ handleCertificateClick }: CertificatesSectionProps) => (
  <motion.div key="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
    {certificates.map(cert => (
      <motion.div key={cert.name} className="group relative cursor-pointer py-5 md:py-6 border-b border-white/10" onClick={() => handleCertificateClick(cert)}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-xl text-white/80 group-hover:text-white transition-colors">{cert.name}</h3>
            <p className="text-sm md:text-base text-white/40 group-hover:text-white/60 transition-colors">{cert.institution} // {cert.year}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const ContactSection = () => (
  <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
    <h2 className="text-3xl md:text-4xl text-white font-bold mb-4 tracking-wider">Get In Touch</h2>
    <p className="text-md md:text-lg leading-relaxed text-white/70 whitespace-pre-line max-w-2xl">{contactDetails}</p>
  </motion.div>
);


// =============================================================
// === MAIN HOMEPAGE COMPONENT ===
// =============================================================
export default function Homepage() {
  const [activeSection, setActiveSection] = useState('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Projects', id: 'projects' },
    { name: 'Certificates', id: 'certificates' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      className="min-h-screen w-full bg-black text-white/90 font-mono relative"
    >
      <GridBackground />
      <SubtleDataStream />
      <div className="absolute inset-0 bg-black/80 z-0" />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(57, 255, 20, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #39FF14; }
      `}</style>

      {/* === MOBILE HEADER === */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b border-green-400/20">
        <h1 className="text-lg font-bold tracking-wider text-white">SMT</h1>
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-2xl">
          {isNavOpen ? '×' : '≡'}
        </button>
      </header>
      
      {/* === MOBILE NAVIGATION OVERLAY === */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-20 bg-black/80 backdrop-blur-lg flex flex-col justify-center items-center"
          >
            <nav>
              <ul className="flex flex-col space-y-8 text-center">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button onClick={() => { setActiveSection(item.id); setIsNavOpen(false); }} className="text-3xl text-white/80 hover:text-white">{item.name}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-10 grid grid-cols-1 md:grid-cols-4 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* === DESKTOP SIDEBAR === */}
        <aside className="hidden md:flex col-span-1 p-8 border-r border-green-400/20 flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">STEVEN MULYA</h1>
            <p className="text-sm text-green-400 tracking-[0.2em]">NODE: SMT-01</p>
            <motion.div className="mt-4 h-px w-full bg-green-400/30" initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:0.8, delay: 0.5}} style={{transformOrigin: 'left'}}/>
          </div>
          <nav className="relative">
            <ul className="flex flex-col space-y-4">
              {navItems.map(item => (
                <li key={item.id}>
                  <button onClick={() => setActiveSection(item.id)} className="group relative flex items-center text-xl w-full text-left">
                    {activeSection === item.id && (
                      <motion.div layoutId="nav-indicator" className="absolute -left-5 h-full w-1 bg-green-400" />
                    )}
                    <span className={`transition-colors duration-300 ${activeSection === item.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-xs text-white/40 space-y-1">
            <p>STATUS: <span className="text-green-400">SECURE</span></p>
            <p>GEO-LINK: TGR-IDN</p>
            <p>SESSION TIME: {currentTime}</p>
          </div>
        </aside>

        {/* === MAIN CONTENT PANEL === */}
        <div className="col-span-1 md:col-span-3 p-4 pt-20 md:p-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: '100vh' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'projects' && <ProjectSection handleProjectClick={setSelectedProject} />}
            {activeSection === 'certificates' && <CertificatesSection handleCertificateClick={setSelectedCertificate} />}
            {activeSection === 'contact' && <ContactSection />}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {selectedCertificate && <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />}
      </AnimatePresence>
    </motion.main>
  );
}