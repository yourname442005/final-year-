'use client';

import React, { useState } from 'react';
import { Search, Zap, Sparkles, ArrowRight, Check } from 'lucide-react';
import { WobbleCard } from './WobbleCard';

export const SemanticSearchSection: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState('multimodal reasoning transformers for causal physics');

  const exampleQueries = [
    'multimodal reasoning transformers for causal physics',
    'quantum surface spectroscopy operando noise',
    'homomorphic encryption genomics privacy'
  ];

  return (
    <section className="py-24 bg-[#F5F5F3] border-y border-[#DDDDD8] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-3 py-1 rounded-full border border-[#DDDDD8]">
            AI Vector Search
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            Semantic search built for complex scientific queries
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Move beyond keywords. Find literature based on conceptual intent, mathematical models, and experimental methodologies.
          </p>
        </div>

        {/* Interactive Search UI Demo */}
        <WobbleCard containerClassName="p-6 sm:p-8 shadow-xs">
          {/* Search Bar Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-sans text-[#8A8A84]">
              <span className="font-bold text-[#111111] uppercase tracking-wider text-[10px]">
                Interactive Semantic Demo
              </span>
              <div className="flex items-center gap-2 bg-[#F5F5F3] border border-[#DDDDD8] px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-[#d97757]" />
                <span className="text-[#111111] font-semibold">HTTP Speed Mode: 70x</span>
              </div>
            </div>

            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#8A8A84] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#F5F5F3] border border-[#DDDDD8] rounded-2xl text-sm font-serif text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Quick Query Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1 font-sans text-xs">
              <span className="text-[#8A8A84]">Sample Queries:</span>
              {exampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuery(q)}
                  className={`px-3 py-1 rounded-full border transition-colors cursor-pointer text-[11px] ${
                    activeQuery === q
                      ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                      : 'bg-[#F5F5F3] text-[#4A4A45] border-[#DDDDD8] hover:border-[#111111]'
                  }`}
                >
                  {q.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {/* Sample Result Cards */}
          <div className="space-y-3 pt-2">
            <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-sans text-[11px] font-bold text-[#d97757] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#DDDDD8]">
                  98% Vector Match
                </span>
                <span className="font-sans text-xs text-[#8A8A84]">Dr. Amara Nwosu et al. • 2026</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#111111]">
                Multimodal Reasoning & Adaptive Transformer Routing for Causal Physics
              </h4>
              <p className="font-serif text-xs text-[#4A4A45] leading-relaxed">
                Demonstrates a dual-head attention architecture mapping vision-language vectors to Newtonian state equations, achieving 94.2% accuracy in trajectory prediction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDDDD8] space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-sans text-[11px] font-bold text-[#4A4A45] bg-[#F5F5F3] px-2.5 py-0.5 rounded-full border border-[#DDDDD8]">
                  92% Vector Match
                </span>
                <span className="font-sans text-xs text-[#8A8A84]">Prof. Sarah Jenkins et al. • 2025</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#111111]">
                Symbolic Latent Alignment in Large Physics-Informed Neural Networks
              </h4>
              <p className="font-serif text-xs text-[#4A4A45] leading-relaxed">
                Formulates symbolic constraint integration directly within continuous transformer latent vectors, preserving physical conservation laws during inference.
              </p>
            </div>
          </div>
        </WobbleCard>
      </div>
    </section>
  );
};
