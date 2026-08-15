'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Search, Compass, FolderKanban, Share2 } from 'lucide-react';
import { Particles } from './Particles';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]">
      {/* Particles Background */}
      <Particles className="absolute inset-0 z-0" quantity={45} />

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#F5F5F3] to-transparent rounded-full opacity-60 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Top Product Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F3] border border-[#DDDDD8] text-[#4A4A45] font-sans text-xs font-medium shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d97757]" />
          <span>AI-Native Research Intelligence Platform</span>
        </motion.div>

        {/* Primary Punchline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight leading-[1.08]">
            Research, <br />
            <span className="italic font-light text-[#4A4A45]">without the noise.</span>
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#8A8A84] max-w-2xl mx-auto leading-relaxed">
            <strong className="text-[#111111] font-semibold">Search. Discover. Connect. Build.</strong>
            <br />
            An intelligent research platform for finding the knowledge that matters and turning it into meaningful work.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-4 flex-wrap pt-2"
        >
          <Link
            href="/feed"
            className="btn-clay text-sm py-3.5 px-7 rounded-xl font-sans font-semibold inline-flex items-center gap-2 shadow-xs"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#features"
            className="btn-outlined-dark text-sm py-3.5 px-6 rounded-xl font-sans font-medium inline-flex items-center gap-2 bg-[#FFFFFF]"
          >
            <span>Explore the Platform</span>
          </a>
        </motion.div>

        {/* Knowledge Node Grid Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left font-sans text-xs"
        >
          <div className="p-3.5 rounded-xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-1">
            <div className="flex items-center justify-between text-[#8A8A84]">
              <span className="uppercase font-bold tracking-wider text-[10px]">Search</span>
              <Search className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <p className="font-serif text-xs text-[#111111] font-medium">Semantic Vectors</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-1">
            <div className="flex items-center justify-between text-[#8A8A84]">
              <span className="uppercase font-bold tracking-wider text-[10px]">Discover</span>
              <Compass className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <p className="font-serif text-xs text-[#111111] font-medium">Paper Relationships</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-1">
            <div className="flex items-center justify-between text-[#8A8A84]">
              <span className="uppercase font-bold tracking-wider text-[10px]">Workspace</span>
              <FolderKanban className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <p className="font-serif text-xs text-[#111111] font-medium">Time Analytics</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-1">
            <div className="flex items-center justify-between text-[#8A8A84]">
              <span className="uppercase font-bold tracking-wider text-[10px]">Network</span>
              <Share2 className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <p className="font-serif text-xs text-[#111111] font-medium">Author Graphs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
