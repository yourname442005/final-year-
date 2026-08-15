'use client';

import React from 'react';
import { ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F5F5F3] border-y border-[#DDDDD8] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-3 py-1 rounded-full border border-[#DDDDD8]">
            Platform Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] tracking-tight">
            Designed for independent researchers & lab teams
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center font-sans">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-1 shadow-2xs">
            <Zap className="w-5 h-5 text-[#d97757] mx-auto" />
            <span className="font-mono text-2xl font-bold text-[#111111] block pt-1">70x</span>
            <span className="text-xs text-[#8A8A84]">HTTP Speed Acceleration</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-1 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#d97757] mx-auto" />
            <span className="font-mono text-2xl font-bold text-[#111111] block pt-1">Verified</span>
            <span className="text-xs text-[#8A8A84]">Researcher Badging</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-1 shadow-2xs">
            <Layers className="w-5 h-5 text-[#d97757] mx-auto" />
            <span className="font-mono text-2xl font-bold text-[#111111] block pt-1">Full Vector</span>
            <span className="text-xs text-[#8A8A84]">Semantic Literature Index</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-1 shadow-2xs">
            <Sparkles className="w-5 h-5 text-[#d97757] mx-auto" />
            <span className="font-mono text-2xl font-bold text-[#111111] block pt-1">Real-Time</span>
            <span className="text-xs text-[#8A8A84]">Academic Activity Alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
};
