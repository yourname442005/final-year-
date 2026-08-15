'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export interface CardItem {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

interface CardHoverEffectProps {
  items: CardItem[];
  className?: string;
}

export const CardHoverEffect: React.FC<CardHoverEffectProps> = ({ items, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-[#F5F5F3] border border-[#DDDDD8] rounded-2xl block"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 }
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.05 }
                  }}
                />
              )}
            </AnimatePresence>

            <div className="rounded-2xl h-full w-full p-6 bg-[#FFFFFF] border border-[#DDDDD8] relative z-10 space-y-3 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#111111]/30 group-hover:shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#DDDDD8] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-[#FFFFFF] transition-colors duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                {item.badge && (
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="font-serif text-lg font-bold text-[#111111] group-hover:text-[#000000] transition-colors">
                  {item.title}
                </h3>
                <p className="font-serif text-xs text-[#8A8A84] leading-relaxed group-hover:text-[#4A4A45] transition-colors">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
