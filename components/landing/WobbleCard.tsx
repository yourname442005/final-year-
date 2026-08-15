'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface WobbleCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  enableGlare?: boolean;
}

export const WobbleCard: React.FC<WobbleCardProps> = ({
  children,
  className = '',
  containerClassName = '',
  enableGlare = true
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isTouchOrReducedMotion, setIsTouchOrReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouchDevice) {
      setIsTouchOrReducedMotion(true);
    }
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 250,
    damping: 25
  });

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 250,
    damping: 25
  });

  const scale = useSpring(isHovered && !isTouchOrReducedMotion ? 1.012 : 1, {
    stiffness: 250,
    damping: 25
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchOrReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);

    if (enableGlare) {
      setGlarePos({
        x: Math.round((clientX / width) * 100),
        y: Math.round((clientY / height) * 100)
      });
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchOrReducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        isTouchOrReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              scale,
              transformStyle: 'preserve-3d'
            }
      }
      className={`relative overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#DDDDD8] shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 ${containerClassName}`}
    >
      <div className={`relative z-10 ${className}`}>{children}</div>

      {/* Subtle Neutral Glare Overlay */}
      {enableGlare && isHovered && !isTouchOrReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
};
