'use client';

import { motion } from 'framer-motion';

interface StaticOverlayProps {
  isVisible: boolean;
}

const StaticOverlay = ({ isVisible }: StaticOverlayProps) => {
  return (
    <motion.div
      className="static-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 0.3 : 0 }}
      transition={{ duration: 0.1 }}
    />
  );
};

export default StaticOverlay;