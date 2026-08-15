'use client';

import React from 'react';
import { FileText, Sparkles, Cpu, GitMerge } from 'lucide-react';

export const ResearchIntelligenceSection: React.FC = () => {
  const steps = [
    {
      icon: FileText,
      step: '01',
      title: 'Literature Ingestion',
      description: 'Import papers, manuscripts, or search queries directly into vector index space.'
    },
    {
      icon: Cpu,
      step: '02',
      title: 'Deep AI Analysis',
      description: 'Extract methodological claims, dataset sources, formula derivations, and clarity scores.'
    },
    {
      icon: Sparkles,
      step: '03',
      title: 'Synthesis & Insights',
      description: 'Generate workspace AI analysis across saved collections and active project notes.'
    },
    {
      icon: GitMerge,
      step: '04',
      title: 'Network Connections',
      description: 'Map co-authorship paths, citation lineage, and related research groups globally.'
    }
  ];

  return (
    <section className="py-24 bg-[#FFFFFF] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
            Intelligence Pipeline
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            From raw literature to structured research intelligence
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Every manuscript ingested undergoes automated vector extraction and relational synthesis.
          </p>
        </div>

        {/* Horizontal Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-4 relative group hover:border-[#111111]/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#d97757] uppercase tracking-wider">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#DDDDD8] flex items-center justify-center text-[#111111]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h3 className="font-serif text-base font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="font-serif text-xs text-[#8A8A84] leading-relaxed">
                    {item.description}
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
