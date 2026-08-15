'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const WhatIsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#F5F5F3] border-y border-[#DDDDD8] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-3 py-1 rounded-full border border-[#DDDDD8]">
            Unified Research Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            One intelligent environment for scientific thought
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Research shouldn&apos;t require jumping between disconnected browser tabs, PDF stores, manual notes, and static citation managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Editorial Text */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#111111] leading-snug">
                suiiiiiiii unifies discovery, analysis, and collaboration into a continuous intelligence pipeline.
              </h3>
              <p className="font-serif text-sm text-[#4A4A45] leading-relaxed">
                Rather than treating papers as static files, suiiiiiiii indexes semantic vector spaces, maps author networks, tracks research time allocation, and assists with AI-powered literature synthesis.
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs text-[#111111]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#DDDDD8]">
                <CheckCircle2 className="w-4 h-4 text-[#d97757] shrink-0" />
                <span>Semantic vector search across computational linguistics & AI reasoning</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#DDDDD8]">
                <CheckCircle2 className="w-4 h-4 text-[#d97757] shrink-0" />
                <span>Interactive workspace time analytics tracking active paper investments</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#DDDDD8]">
                <CheckCircle2 className="w-4 h-4 text-[#d97757] shrink-0" />
                <span>Peer activity center with real-time academic citations & notifications</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Comparison Box */}
          <div className="bg-[#FFFFFF] border border-[#DDDDD8] rounded-3xl p-8 space-y-6 shadow-xs">
            <div className="space-y-1 border-b border-[#DDDDD8] pb-4">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                The Traditional Fragmentation
              </span>
              <p className="font-serif text-sm text-[#8A8A84] line-through decoration-[#d97757]/60">
                Disconnected PDF folders → Manual reference tools → Isolated notes → Scattered team emails
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> The suiiiiiiii Standard
              </span>
              <h4 className="font-serif text-xl font-bold text-[#111111]">
                Connected Research Intelligence
              </h4>
              <p className="font-serif text-xs text-[#4A4A45] leading-relaxed">
                Search papers by concepts, organize active projects with task pipelines, Derivation notes, and measure research time distribution seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
