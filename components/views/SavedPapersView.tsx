'use client';

import React, { useState } from 'react';
import { Library, Search, Download } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper } from '@/lib/mock-data';

interface SavedPapersViewProps {
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
}

export const SavedPapersView: React.FC<SavedPapersViewProps> = ({
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection
}) => {
  const { savedPaperIds, papers } = usePlatformStore();
  const [filterQuery, setFilterQuery] = useState('');

  const savedPapers = papers.filter((p) => savedPaperIds.includes(p.id));
  const filtered = savedPapers.filter(
    (p) =>
      p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.abstract.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Library className="w-3.5 h-3.5" /> Saved Personal Bibliography
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Saved Research Papers ({savedPapers.length})
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Access your bookmarked preprints and publications. All items are synchronized across your active research sessions.
          </p>
        </div>
      </div>

      {/* Filter Input */}
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#87867f]" />
        <input
          type="text"
          placeholder="Filter saved papers by title, keyword, or author..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-serif text-[#141413] focus:outline-none"
        />
      </div>

      {/* Papers Listing */}
      <div className="space-y-6">
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

        {filtered.length === 0 && (
          <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-12 text-center space-y-3">
            <Library className="w-10 h-10 text-[#87867f] mx-auto" />
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              No saved papers found
            </h3>
            <p className="font-serif text-xs text-[#87867f] max-w-md mx-auto">
              Bookmark papers from the Feed, Semantic Search, or Paper Discovery views to build your reference library.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
