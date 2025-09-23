// app/components/Homepage.tsx
'use client';

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const projects = [
  { title: "Project Alpha", type: "Web Application", year: "2025" },
  { title: "Concept Beta", type: "Interactive UI/UX", year: "2025" },
  { title: "Experiment Gamma", type: "3D & Motion", year: "2024" },
  { title: "Archive Delta", type: "Static Site", year: "2023" },
];

export default function Homepage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Posisi mouse untuk diikuti oleh kotak detail
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Efek pegas untuk gerakan yang lebih halus
  const smoothConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, smoothConfig);
  const smoothMouseY = useSpring(mouseY, smoothConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="min-h-screen w-full bg-black text-white p-8 md:p-16"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
      onMouseMove={handleMouseMove} // Lacak mouse di seluruh halaman
    >
      {/* Kotak Detail yang Mengikuti Kursor */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ 
              translateX: smoothMouseX, 
              translateY: smoothMouseY 
            }}
            className="pointer-events-none fixed top-0 left-0 z-50 p-4 bg-green-400 text-black rounded-lg shadow-2xl"
          >
            <p className="font-bold">{projects[hoveredIndex].type}</p>
            <p className="text-sm">{projects[hoveredIndex].year}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-2xl">INDEX</h1>
        </header>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-700 text-gray-500">
            <div className="col-span-12">PROJECT_NAME</div>
          </div>
          
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group py-6 border-b border-gray-800 cursor-pointer"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl md:text-3xl group-hover:text-green-400 transition-colors duration-300">
                  {project.title}
                </span>
                <span className="hidden md:inline text-gray-500 text-lg transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </motion.main>
  );
}