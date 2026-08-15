'use client';

import React from 'react';
import { TrendingUp, Flame, Sparkles, BookOpen, BarChart3 } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

export const TrendingView: React.FC = () => {
  const { trendingTopics } = usePlatformStore();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 space-y-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> High-Growth Frontiers
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#141413]">
          Emerging Research Trends
        </h1>
        <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-2xl">
          Track citation momentum, velocity shifts, and emerging scientific clusters across global literature preprints.
        </p>
      </div>

      {/* Trending Topics Grid */}
      <div className="space-y-6">
        {trendingTopics.map((topic, index) => (
          <div
            key={topic.id}
            className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 space-y-4 hover:border-[#141413] transition-all"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs bg-[#141413] text-[#faf9f5] w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    #{index + 1}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141413]">{topic.name}</h2>
                </div>
                <span className="font-sans text-xs text-[#d97757] font-semibold">{topic.category}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#f0eee6] border border-[#cccbc8] px-3.5 py-1.5 rounded-xl text-center">
                  <span className="font-sans text-[10px] uppercase font-bold text-[#87867f] block">
                    Citations
                  </span>
                  <span className="font-mono text-lg font-bold text-emerald-800 flex items-center gap-1 justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> {topic.citationCount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#f0eee6] border border-[#cccbc8] px-3.5 py-1.5 rounded-xl text-center">
                  <span className="font-sans text-[10px] uppercase font-bold text-[#87867f] block">
                    Monthly Growth
                  </span>
                  <span className="font-mono text-lg font-bold text-[#d97757] flex items-center gap-1 justify-center">
                    <Flame className="w-4 h-4 text-[#d97757]" /> +{topic.monthlyGrowth}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Narrative Breakdown */}
            <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-xl p-4 space-y-2">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Literature Cluster Analysis
              </span>
              <p className="font-serif text-sm text-[#141413] leading-relaxed">
                {topic.aiNarrative}
              </p>
            </div>

            {/* Top Keywords / Clusters */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="font-sans text-xs text-[#87867f] font-semibold">Key Preprints & Clusters:</span>
              {topic.clusters.map((kw) => (
                <span key={kw} className="font-sans text-xs bg-[#e3dacc] text-[#141413] px-2.5 py-0.5 rounded-full font-medium">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
