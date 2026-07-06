import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check accessibility reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.closest('.cursor-pointer') ||
        target.closest('.building-node') ||
        target.closest('input[type="range"]');
      
      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide cursor on touch devices or if prefers-reduced-motion is active
  if (reducedMotion || typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <motion.div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: cursorXSpring,
            y: cursorYSpring,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          animate={{
            scale: hovered ? 1.5 : 1,
            backgroundColor: hovered ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            borderColor: hovered ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.4)',
            width: hovered ? 36 : 24,
            height: hovered ? 36 : 24,
            borderWidth: 1.5,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
          className="rounded-full border hidden md:block"
        />
      )}
      
      {isVisible && (
        <motion.div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: cursorX,
            y: cursorY,
            pointerEvents: 'none',
            zIndex: 9999,
            // center dot offset
            marginLeft: 10,
            marginTop: 10,
          }}
          className="w-1 h-1 bg-purple-500 rounded-full hidden md:block"
        />
      )}
    </>
  );
};
