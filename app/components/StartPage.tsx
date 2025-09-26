'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Props
interface StartPageProps {
  onEnter: () => void;
}

export default function StartPage({ onEnter }: StartPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 100 };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      if (!canvas) return;
      particles.length = 0;
      const particleCount = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < particleCount; i++) {
        // FIX: Mengganti 'let' menjadi 'const'
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouseMoveHandler = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', mouseMoveHandler);

    class Particle {
      x: number; y: number; size: number; baseX: number; baseY: number; density: number; color: string;
      constructor(x: number, y: number) { this.x = x; this.y = y; this.size = Math.random() * 1.5 + 1; this.baseX = this.x; this.baseY = this.y; this.density = (Math.random() * 30) + 1; this.color = 'rgba(57, 255, 20, 0.8)'; }
      draw() { if (!ctx) return; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill(); }
      update() {
        const dx = mouse.x - this.x; const dy = mouse.y - this.y; const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance; const forceDirectionY = dy / distance; const maxDistance = mouse.radius; const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density; const directionY = forceDirectionY * force * this.density;
          this.x -= directionX; this.y -= directionY;
        } else {
          if (this.x !== this.baseX) { const dx = this.x - this.baseX; this.x -= dx / 10; }
          if (this.y !== this.baseY) { const dy = this.y - this.baseY; this.y -= dy / 10; }
        }
      }
    }

    const connect = () => {
      if (!ctx || !canvas) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            const opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `rgba(57, 255, 20, ${opacityValue})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const lineVariants = {
    rest: { scaleX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 1.5 } }} className="fixed inset-0 z-40 bg-black flex items-center justify-center font-mono">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <motion.div className="relative z-10 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white/90 text-center">STEVEN MULYA TJENDRATAMA</h1>
        <p className="mt-4 text-lg tracking-[0.2em] text-white/60">SOFTWARE ENGINEER</p>
        <motion.div
          onClick={onEnter}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-20 cursor-pointer relative flex flex-col items-center justify-center w-64 h-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.span className={`text-2xl tracking-[0.4em] transition-colors duration-300 ${isHovered ? 'text-white' : 'text-green-400'}`}>ENTER</motion.span>
          <div className="absolute bottom-4 w-32 h-px"><motion.div className="absolute inset-0 bg-green-400" style={{ originX: 0.5 }} variants={lineVariants} initial="rest" animate={isHovered ? "hover" : "rest"} /></div>
          <div className="absolute top-4 w-32 h-px"><motion.div className="absolute inset-0 bg-green-400" style={{ originX: 0.5 }} variants={lineVariants} initial="rest" animate={isHovered ? "hover" : "rest"} /></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}