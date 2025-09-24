'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ==================== Type Definitions ====================
// Interfaces for the core data objects.
interface Project {
  title: string;
  type: string;
  year: string;
  status: string;
  webDeveloper: string;
  uiUxDesigner: string;
  description: string;
}

interface Certificate {
  name: string;
  institution: string;
  year: string;
  imageUrl: string;
}

// Interfaces for component props to fix 'any' type errors.
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

interface ProjectSectionProps {
  handleProjectClick: (project: Project) => void;
}

interface CertificatesSectionProps {
  handleCertificateClick: (certificate: Certificate) => void;
}

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  handlePrev: () => void;
  handleNext: () => void;
}

// ==================== Data Definitions ====================
const projects: Project[] = [
  {
    title: "Gohte Architects",
    type: "Website Development",
    year: "2025",
    status: "Completed",
    webDeveloper: "Jane Doe",
    uiUxDesigner: "John Smith",
    description: "Gohte Architects adalah studio arsitektur terkemuka yang berfokus pada desain berkelanjutan. Proyek ini melibatkan pembuatan situs web portofolio yang menampilkan karya-karya mereka dengan galeri visual yang interaktif dan modern."
  },
  {
    title: "Dama Studio",
    type: "Website Development",
    year: "2025",
    status: "In Progress",
    webDeveloper: "Jane Doe",
    uiUxDesigner: "Alice Johnson",
    description: "Dama Studio adalah studio seni dan desain. Kami sedang mengembangkan situs web e-commerce untuk menjual produk-produk seni mereka, dengan integrasi keranjang belanja yang mulus dan halaman produk yang elegan."
  },
  {
    title: "Hutama Maju Sukses",
    type: "Website Development",
    year: "2024",
    status: "Completed",
    webDeveloper: "Bob Williams",
    uiUxDesigner: "John Smith",
    description: "Sebuah situs web perusahaan untuk Hutama Maju Sukses, perusahaan manufaktur terkemuka. Fokus proyek ini adalah pada presentasi layanan dan portofolio produk mereka secara profesional dan informatif."
  },
  {
    title: "Archive Delta",
    type: "Static Site",
    year: "2023",
    status: "Completed",
    webDeveloper: "Bob Williams",
    uiUxDesigner: "Alice Johnson",
    description: "Archive Delta adalah sebuah arsip digital untuk proyek-proyek seni dan sejarah. Situs statis ini dioptimalkan untuk kecepatan dan aksesibilitas, menyajikan koleksi data yang terorganisir dengan baik."
  },
  {
    title: "EcoTech Solutions",
    type: "Web Application",
    year: "2024",
    status: "Completed",
    webDeveloper: "Alice Johnson",
    uiUxDesigner: "John Smith",
    description: "Sebuah aplikasi web inovatif untuk memonitor data lingkungan. Pengguna dapat melacak konsumsi energi dan emisi karbon mereka melalui dasbor interaktif yang intuitif."
  },
  {
    title: "Aura Creative",
    type: "E-commerce Site",
    year: "2025",
    status: "In Progress",
    webDeveloper: "Bob Williams",
    uiUxDesigner: "Alice Johnson",
    description: "Aura Creative berfokus pada produk-produk kecantikan dan gaya hidup. Proyek ini membangun platform e-commerce yang menarik, dengan fitur rekomendasi produk dan ulasan pelanggan."
  },
  {
    title: "Future Labs",
    type: "Research Portal",
    year: "2024",
    status: "Completed",
    webDeveloper: "Jane Doe",
    uiUxDesigner: "Bob Williams",
    description: "Portal penelitian untuk komunitas ilmiah. Aplikasi ini menyediakan alat untuk berbagi publikasi, data, dan berkolaborasi dalam proyek-proyek penelitian, dengan antarmuka yang bersih dan mudah digunakan."
  },
  {
    title: "Pixel Perfect",
    type: "Agency Website",
    year: "2023",
    status: "Completed",
    webDeveloper: "John Smith",
    uiUxDesigner: "Jane Doe",
    description: "Situs web agensi kreatif yang menampilkan portofolio dan layanan mereka. Fokus desainnya adalah pada tipografi yang kuat dan tata letak yang minimalis untuk menyoroti konten visual."
  },
];

const certificates: Certificate[] = [
  { name: "Responsive Web Design", institution: "FreeCodeCamp", year: "2025", imageUrl: "/webresponsive.jpg" },
  { name: "Python", institution: "Kaggle", year: "2025", imageUrl: "/python.png" },
  { name: "Machine Learning Explainability", institution: "Kaggle", year: "2025", imageUrl: "/machinelearning.png" },
  { name: "AWS for Begginers", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_one.jpg" },
  { name: "AWS Fundamentals", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_two.jpg" },
  { name: "Intro to Programming", institution: "Kaggle", year: "2025", imageUrl: "/programming.png" },
  { name: "Internship NTT", institution: "NTT Indonesia Technology", year: "2024", imageUrl: "/ntt.jpg" },
];

const contactDetails = `
  Email: stevenmulya@gmail.com
  Whatsapp: +6287773298907
  Domicile: Tangerang,
`;

// ==================== Reusable Components ====================

// Project modal to display detailed project info
const ProjectModal = ({ project, onClose }: ProjectModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-black border border-green-700 rounded-lg p-6 md:p-8 w-full max-w-2xl text-white relative overflow-y-auto max-h-[90vh]"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-green-400 transition-colors duration-300 text-2xl"
      >
        &times;
      </button>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-green-400" style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}>{project.title}</h2>
      <p className="text-md md:text-lg mb-4 text-gray-400" style={{ textShadow: '0 0 3px rgba(0,255,0,0.5)' }}>{project.type} ({project.year})</p>

      <div className="mb-4 text-gray-300 text-sm md:text-base">
        <p><span className="font-bold">Status:</span> {project.status}</p>
        <p><span className="font-bold">Web Dev:</span> {project.webDeveloper}</p>
        <p><span className="font-bold">UI/UX:</span> {project.uiUxDesigner}</p>
      </div>

      <p className="text-sm md:text-base leading-relaxed text-gray-300">{project.description}</p>
    </motion.div>
  </motion.div>
);

// Certificate modal to display detailed certificate info
const CertificateModal = ({ certificate, onClose }: CertificateModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-black border border-green-700 rounded-lg p-6 md:p-8 w-full max-w-xl text-white relative overflow-y-auto max-h-[90vh]"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-green-400 transition-colors duration-300 text-2xl"
      >
        &times;
      </button>
      <img src={certificate.imageUrl} alt={`Sertifikat ${certificate.name}`} className="w-full rounded-lg mb-4" />
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-green-400" style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}>{certificate.name}</h2>
      <div className="mb-4 text-gray-300 text-sm md:text-base">
        <p><span className="font-bold">Institution:</span> {certificate.institution}</p>
        <p><span className="font-bold">Year:</span> {certificate.year}</p>
      </div>
    </motion.div>
  </motion.div>
);

// Pagination Controls component
const PaginationControls = ({ page, totalPages, handlePrev, handleNext }: PaginationControlsProps) => {
  const buttonVariants = {
    rest: { opacity: 0.7, x: 0 },
    hover: { opacity: 1, x: 0 },
  };

  const arrowVariants = {
    rest: { x: 0 },
    hover: { x: 5 },
  };

  return (
    <div className="flex justify-between mt-4 mb-8">
      <motion.button
        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
        onClick={handlePrev}
        disabled={page === 0}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <motion.span
          variants={arrowVariants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          ←
        </motion.span>
        <motion.span variants={buttonVariants}>
          PREV
        </motion.span>
      </motion.button>
      
      <span className="text-gray-500">
        {page + 1} / {totalPages}
      </span>
      
      <motion.button
        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
        onClick={handleNext}
        disabled={page === totalPages - 1}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <motion.span variants={buttonVariants}>
          NEXT
        </motion.span>
        <motion.span
          variants={arrowVariants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          →
        </motion.span>
      </motion.button>
    </div>
  );
};

// Section for displaying Projects
const ProjectSection = ({ handleProjectClick }: ProjectSectionProps) => {
  const itemsPerPage = 3;
  const [page, setPage] = useState(0);

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleNext = () => setPage((prevPage) => (prevPage + 1) % totalPages);
  const handlePrev = () => setPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);

  return (
    <motion.section
      key="projects-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PaginationControls
        page={page}
        totalPages={totalPages}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

      <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-700 text-gray-500">
        <div className="col-span-4">PROJECT</div>
        <div className="col-span-2">TYPE</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-4">CREDITS</div>
      </div>
      {projects.slice(startIndex, endIndex).map((project, index) => (
        <motion.div
          key={index}
          className="group py-6 border-b border-gray-800 cursor-pointer transition-colors duration-300 hover:border-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => handleProjectClick(project)}
        >
          <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
            <div className="col-span-4 flex items-center">
              <span
                className="font-bold text-xl md:text-3xl group-hover:text-green-400 transition-colors duration-300"
                style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}
              >
                {project.title}
              </span>
              <span className="ml-4 text-gray-500 text-lg transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </div>
            <span className="hidden md:inline col-span-2 text-gray-500">{project.type}</span>
            <span className="hidden md:inline col-span-2 text-gray-500">{project.status}</span>
            <span className="hidden md:inline col-span-4 text-gray-500">
              <p>Web Dev: {project.webDeveloper}</p>
              <p>UI/UX: {project.uiUxDesigner}</p>
            </span>
            <div className="md:hidden mt-2 text-sm text-gray-500">
              <p><span className="text-white font-bold">Type:</span> {project.type}</p>
              <p><span className="text-white font-bold">Status:</span> {project.status}</p>
              <p><span className="text-white font-bold">Web Dev:</span> {project.webDeveloper}</p>
              <p><span className="text-white font-bold">UI/UX:</span> {project.uiUxDesigner}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};

// Section for displaying Certificates
const CertificatesSection = ({ handleCertificateClick }: CertificatesSectionProps) => {
  const itemsPerPage = 3;
  const [page, setPage] = useState(0);

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(certificates.length / itemsPerPage);

  const handleNext = () => setPage((prevPage) => (prevPage + 1) % totalPages);
  const handlePrev = () => setPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);

  return (
    <motion.section
      key="certificates-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PaginationControls
        page={page}
        totalPages={totalPages}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

      <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-700 text-gray-500">
        <div className="col-span-6">CERTIFICATE NAME</div>
        <div className="col-span-4">INSTITUTION</div>
        <div className="col-span-2">YEAR</div>
      </div>
      {certificates.slice(startIndex, endIndex).map((cert, index) => (
        <motion.div
          key={index}
          className="py-6 border-b border-gray-800 cursor-pointer transition-colors duration-300 hover:border-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => handleCertificateClick(cert)}
        >
          <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
            <span
              className="col-span-6 font-bold text-lg md:text-xl text-white"
              style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}
            >
              {cert.name}
            </span>
            <span className="hidden md:inline col-span-4 text-gray-500">{cert.institution}</span>
            <span className="hidden md:inline col-span-2 text-gray-500">{cert.year}</span>
            <div className="md:hidden mt-2 text-sm text-gray-500">
                <p><span className="text-white font-bold">Institution:</span> {cert.institution}</p>
                <p><span className="text-white font-bold">Year:</span> {cert.year}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};

// Section for Contact information
const ContactSection = () => (
  <motion.section
    key="contact-section"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}>Contact Me</h2>
      <p className="text-base md:text-lg leading-relaxed text-gray-400 whitespace-pre-line">{contactDetails}</p>
    </div>
  </motion.section>
);

// ==================== Main App Component ====================
export default function Homepage() {
  const [activeSection, setActiveSection] = useState('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleProjectClick = (project: Project) => setSelectedProject(project);
  const handleCertificateClick = (certificate: Certificate) => setSelectedCertificate(certificate);

  const navItems = [
    { name: 'Projects', id: 'projects' },
    { name: 'Certificates', id: 'certificates' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="min-h-screen w-full bg-black text-white p-4 md:p-16 max-h-screen relative overflow-hidden"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      <style>{`
        @keyframes grain-animation {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 2%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-2%, 1%); }
          50% { transform: translate(2%, -1%); }
          60% { transform: translate(-1%, 2%); }
          70% { transform: translate(2%, 1%); }
          80% { transform: translate(-2%, -2%); }
          90% { transform: translate(1%, 2%); }
        }
        @keyframes flicker-animation {
          0%, 100% { opacity: 1; }
          41.99% { opacity: 1; }
          42% { opacity: 0.8; }
          42.01% { opacity: 1; }
          44.99% { opacity: 1; }
          45% { opacity: 0.8; }
          45.01% { opacity: 1; }
          48.99% { opacity: 1; }
          49% { opacity: 0.8; }
          49.01% { opacity: 1; }
        }
      `}</style>

      {/* Retro Computer Overlay - Full Screen Effect */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAAXNSR0IArs4c6QAAABJJREFUGFdjYGBgYGEAAgwMDDLAwAAAL0gC/x0fP1cAAAAASUVORK5CYII=")',
        backgroundSize: '1px 2px',
        opacity: 0.05,
        animation: 'grain-animation 0.2s steps(2) infinite'
      }}></div>
      <div className="fixed inset-0 z-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        opacity: 0.1,
      }}></div>
      <div className="fixed inset-0 z-10 pointer-events-none bg-transparent" style={{ animation: 'flicker-animation 2s infinite' }}></div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto relative z-20" style={{ boxShadow: 'inset 0px 0px 100px rgba(0,0,0,0.6)' }}>
        {/* Header Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-b border-gray-800 pb-4">
          <h1 className="text-xl md:text-2xl mb-4 md:mb-0" style={{ textShadow: '0 0 5px rgba(0,255,0,0.7)' }}>PORTOFOLIO</h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`group relative inline-block text-lg md:text-xl transition-colors duration-300 ${
                      activeSection === item.id ? 'text-green-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                    <motion.div
                      className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-400"
                      initial={{ scaleX: 0 }}
                      animate={{
                        width: activeSection === item.id ? '100%' : '0%',
                        x: '-50%'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Dynamic Content Sections */}
        <AnimatePresence mode="wait">
          {activeSection === 'projects' && <ProjectSection handleProjectClick={handleProjectClick} />}
          {activeSection === 'certificates' && <CertificatesSection handleCertificateClick={handleCertificateClick} />}
          {activeSection === 'contact' && <ContactSection />}
        </AnimatePresence>
      </div>

      {/* Modals for Details */}
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {selectedCertificate && <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />}
      </AnimatePresence>
    </motion.main>
  );
}
