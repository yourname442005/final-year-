'use client';

import React from 'react';
import { Search, Cpu, FolderKanban, Compass } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Search',
      description: 'Query literature by vector concepts, mathematical derivations, or natural language intent.',
      icon: Search
    },
    {
      num: '02',
      title: 'Analyze',
      description: 'Extract automated AI pre-review manuscript insights, methodologies, and clarity evaluations.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'Organize',
      description: 'Group papers into workspace projects, derive formula notes, and track time investment analytics.',
      icon: FolderKanban
    },
    {
      num: '04',
      title: 'Discover',
      description: 'Uncover connected author networks, citation trajectories, and emerging research fields.',
      icon: Compass
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F5F5F3] border-y border-[#DDDDD8] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-3 py-1 rounded-full border border-[#DDDDD8]">
            Simple Step-by-Step Flow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            How suiiiiiiii powers research
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Four simple phases transforming fragmented literature reading into structured scientific productivity.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-4 shadow-2xs hover:border-[#111111] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-[#111111]">{s.num}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F3] border border-[#DDDDD8] flex items-center justify-center text-[#d97757]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <h3 className="font-serif text-lg font-bold text-[#111111]">{s.title}</h3>
                  <p className="font-serif text-xs text-[#8A8A84] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
