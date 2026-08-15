'use client';

import React from 'react';
import { Share2, Users, FileText, Sparkles, BookOpen } from 'lucide-react';

export const KnowledgeNetworkSection: React.FC = () => {
  const nodes = [
    { label: 'Dr. Amara Nwosu', role: 'Principal Investigator', field: 'Computational Linguistics', top: '15%', left: '20%' },
    { label: 'Multimodal Routing', role: 'Research Topic', field: 'AI Architecture', top: '25%', left: '65%' },
    { label: 'Operando Spectroscopy', role: 'Paper Citation', field: 'Surface Physics', top: '60%', left: '25%' },
    { label: 'Prof. Sarah Jenkins', role: 'Co-Author', field: 'MIT CSAIL', top: '70%', left: '70%' },
    { label: 'Causal Neural Engines', role: 'Paper Citation', field: 'Quantum AI', top: '45%', left: '45%' }
  ];

  return (
    <section id="network" className="py-24 bg-[#FFFFFF] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center justify-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> Knowledge Graph
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            Interconnected research, co-authors & ideas
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Science does not happen in isolation. Map co-authorship pathways, citation influence, and cross-field methodologies.
          </p>
        </div>

        {/* Visual Graph Container */}
        <div className="relative min-h-[420px] bg-[#F5F5F3] border border-[#DDDDD8] rounded-3xl p-6 overflow-hidden flex items-center justify-center">
          {/* Subtle Canvas SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <line x1="25%" y1="20%" x2="45%" y2="50%" stroke="#8A8A84" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="65%" y1="30%" x2="45%" y2="50%" stroke="#8A8A84" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="25%" y1="65%" x2="45%" y2="50%" stroke="#8A8A84" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="70%" y1="75%" x2="45%" y2="50%" stroke="#8A8A84" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="25%" y1="20%" x2="25%" y2="65%" stroke="#8A8A84" strokeWidth="1" opacity="0.5" />
          </svg>

          {/* Node Cards */}
          <div className="w-full h-full relative min-h-[380px]">
            {nodes.map((n, idx) => (
              <div
                key={idx}
                style={{ top: n.top, left: n.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#FFFFFF] border border-[#DDDDD8] rounded-2xl p-4 shadow-xs space-y-1 hover:border-[#111111] transition-all duration-200 cursor-pointer max-w-[200px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-[#d97757]">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{n.role}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#111111] leading-tight">
                  {n.label}
                </h4>
                <span className="font-sans text-[11px] text-[#8A8A84] block">{n.field}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
