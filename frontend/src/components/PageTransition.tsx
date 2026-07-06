import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.99, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -15, scale: 0.99, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Vercel cubic-bezier easing
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};
