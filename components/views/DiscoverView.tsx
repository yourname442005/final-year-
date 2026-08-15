'use client';

import React, { useState } from 'react';
import { Compass, Grid, List, Filter, RotateCcw } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper } from '@/lib/mock-data';

interface DiscoverViewProps {
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection
}) => {
  const { papers } = usePlatformStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'citations' | 'newest'>('relevance');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(papers.flatMap((p) => p.tags)));

  let filtered = papers.filter((p) => {
    if (selectedTag !== 'All' && !p.tags.includes(selectedTag)) return false;
    if (openAccessOnly && !p.openAccess) return false;
    return true;
  });

  if (sortBy === 'citations') {
    filtered.sort((a, b) => b.citationCount - a.citationCount);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => b.year - a.year);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 space-y-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" /> Paper Corpus Index
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#141413]">
          Explore Literature & Preprints
        </h1>
        <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-2xl">
          Browse indexed publications, filter by scientific discipline, and inspect AI-generated intelligence breakdowns.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
        {/* Tags filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold uppercase tracking-wider text-[#141413]">Discipline / Tag:</span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              selectedTag === 'All'
                ? 'bg-[#141413] text-[#faf9f5]'
                : 'bg-[#f0eee6] text-[#87867f] border border-[#cccbc8] hover:border-[#141413]'
            }`}
          >
            All
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-[#141413] text-[#faf9f5]'
                  : 'bg-[#f0eee6] text-[#87867f] border border-[#cccbc8] hover:border-[#141413]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Sort & Layout Toggles */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[#87867f]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f0eee6] border border-[#cccbc8] rounded-lg p-1.5 text-xs text-[#141413] font-medium"
            >
              <option value="relevance">Relevance</option>
              <option value="citations">Citation Count</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#141413]">
            <input
              type="checkbox"
              checked={openAccessOnly}
              onChange={(e) => setOpenAccessOnly(e.target.checked)}
              className="accent-[#d97757]"
            />
            <span>Open Access</span>
          </label>

          <div className="flex items-center border border-[#cccbc8] rounded-lg p-0.5 bg-[#f0eee6]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#faf9f5] shadow-xs' : 'text-[#87867f]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#faf9f5] shadow-xs' : 'text-[#87867f]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Paper Listing */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
        {filtered.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            onOpenDetail={onOpenPaperDetail}
            onOpenCite={onOpenCite}
            onOpenAddToCollection={onOpenAddToCollection}
            showRelevanceSignal={false}
          />
        ))}
      </div>

    </div>
  );
};
