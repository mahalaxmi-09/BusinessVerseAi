import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Trailing ring spring physics (adds smooth delay/follow effect)
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 220 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 220 });

  useEffect(() => {
    // Check prefers-reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleMove = (e: MouseEvent) => {
      // Offset inner dot to center
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
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

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible]);

  if (reducedMotion || typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <>
          {/* Outer Trailing Glowing Lens (delayed spring movement) */}
          <motion.div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              x: ringX,
              y: ringY,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            animate={{
              width: hovered ? 46 : 28,
              height: hovered ? 46 : 28,
              borderColor: hovered ? 'rgba(168, 85, 247, 0.8)' : 'rgba(6, 182, 212, 0.4)',
              backgroundColor: hovered ? 'rgba(168, 85, 247, 0.05)' : 'rgba(6, 182, 212, 0.01)',
              boxShadow: hovered 
                ? '0 0 15px rgba(168, 85, 247, 0.3), inset 0 0 8px rgba(168, 85, 247, 0.2)'
                : '0 0 8px rgba(6, 182, 212, 0.1)',
              scale: isClicking ? 0.85 : 1,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="rounded-full border border-solid hidden md:block backdrop-blur-[0.5px]"
          />

          {/* Inner Glowing Core Dot & Crosshair Scanner (instant response) */}
          <motion.div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              x: mouseX,
              y: mouseY,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            animate={{
              scale: hovered ? 2.5 : 1,
              backgroundColor: hovered ? '#ffffff' : '#06B6D4',
              boxShadow: hovered 
                ? '0 0 10px #ffffff, 0 0 20px rgba(168, 85, 247, 0.6)'
                : '0 0 8px rgba(6, 182, 212, 0.8)',
            }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.15 }}
            className="w-1.5 h-1.5 rounded-full hidden md:block flex items-center justify-center relative"
          >
            {/* Holographic scanning ticks shown on hover */}
            {hovered && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute text-[8px] font-black text-purple-400 select-none pointer-events-none"
              >
                +
              </motion.span>
            )}
          </motion.div>
        </>
      )}
    </>
  );
};
