// app/components/StartScreen.tsx
import { motion } from 'framer-motion';
import Orrery from './Orrery';

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ y: '-100%', transition: { duration: 1, ease: [0.83, 0, 0.17, 1] } }}
    >
      <div className="absolute inset-0 opacity-50">
        <Orrery />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white md:text-8xl">Welcome.</h1>
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 rounded-full border border-white/20 bg-white/10 px-10 py-4 font-semibold text-white backdrop-blur-md"
        >
          Explore Studio
        </motion.button>
      </div>
    </motion.div>
  );
}