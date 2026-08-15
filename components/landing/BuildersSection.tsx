'use client';

import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const BuildersSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#FFFFFF] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Built For Research Rigor
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight max-w-2xl mx-auto">
            Built by researchers and builders who wanted a better way to work with knowledge.
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] max-w-xl mx-auto leading-relaxed">
            We designed suiiiiiiii to eliminate friction in literature discovery, paper synthesis, task pipelines, and author networking.
          </p>
        </div>

        {/* Core Principles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left font-serif text-xs">
          <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-2">
            <h4 className="font-bold text-[#111111] text-sm">Open & Verifiable</h4>
            <p className="text-[#4A4A45] leading-relaxed">
              Every paper citation link, dataset reference, and AI synthesis is grounded directly in verified source literature.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-2">
            <h4 className="font-bold text-[#111111] text-sm">Privacy & Security</h4>
            <p className="text-[#4A4A45] leading-relaxed">
              Workspace project notes, team discussion threads, and manuscript drafts remain strictly isolated to authorized co-authors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-2">
            <h4 className="font-bold text-[#111111] text-sm">Performance Focused</h4>
            <p className="text-[#4A4A45] leading-relaxed">
              High-performance HTTP search acceleration ensures sub-second responses across large vector spaces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
