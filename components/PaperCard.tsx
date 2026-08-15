'use client';

import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Quote, FolderPlus, Sparkles, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { Paper } from '@/lib/mock-data';
import { usePlatformStore } from '@/lib/platform-store';

interface PaperCardProps {
  paper: Paper;
  onOpenDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
  showRelevanceSignal?: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  onOpenDetail,
  onOpenCite,
  onOpenAddToCollection,
  showRelevanceSignal = true
}) => {
  const { savedPaperIds, toggleSavePaper } = usePlatformStore();
  const isSaved = savedPaperIds.includes(paper.id);

  return (
    <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 hover:border-[#141413] transition-all flex flex-col justify-between space-y-4">
      <div>
        {/* Header Tags & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs tracking-tight bg-[#e3dacc] text-[#141413] px-2.5 py-1 rounded-full font-medium">
              {paper.venue}
            </span>
            <span className="font-sans text-xs text-[#87867f] font-medium">
              {paper.year}
            </span>
            {paper.openAccess && (
              <span className="font-sans text-xs text-[#d97757] font-semibold border border-[#d97757]/30 px-2 py-0.5 rounded-full">
                Open Access
              </span>
            )}
          </div>

          {/* Relevance Signal Indicator */}
          {showRelevanceSignal && paper.relevanceSignal && (
            <div className="flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 rounded-full bg-[#f0eee6] border border-[#cccbc8]">
              <span
                className={`w-2 h-2 rounded-full ${
                  paper.relevanceSignal === 'High'
                    ? 'bg-emerald-600'
                    : paper.relevanceSignal === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="font-semibold text-[#141413]">{paper.relevanceSignal} Signal</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(paper)}
          className="font-serif text-xl md:text-2xl font-normal text-[#141413] hover:text-[#d97757] cursor-pointer transition-colors leading-tight mb-2"
        >
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="font-sans text-xs text-[#87867f] mb-3">
          By {paper.authors.join(', ')}
        </p>

        {/* Abstract Excerpt */}
        <p className="font-serif text-sm text-[#141413]/85 line-clamp-3 leading-relaxed mb-4">
          {paper.abstract}
        </p>

        {/* Reasoning Evidence Box if search query match */}
        {paper.reasoningEvidence && (
          <div className="bg-[#f0eee6] border-l-2 border-[#d97757] p-3 rounded-r-lg mb-4 text-xs font-sans text-[#141413]/90">
            <span className="font-semibold text-[#d97757] flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3" /> AI Reasoning Match:
            </span>
            {paper.reasoningEvidence}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-[11px] text-[#87867f] bg-[#f0eee6] px-2 py-0.5 rounded border border-[#cccbc8]/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-[#cccbc8]/60 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4 text-xs font-sans text-[#87867f]">
          <span>Citations: <strong className="text-[#141413] font-semibold">{paper.citationCount}</strong></span>
          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noreferrer"
              className="link-editorial flex items-center gap-1 text-[#141413]"
            >
              DOI <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            onClick={() => toggleSavePaper(paper.id)}
            title={isSaved ? 'Saved in library' : 'Save paper'}
            className={`p-2 rounded-lg border text-xs font-sans flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-[#141413] text-[#faf9f5] border-[#141413]'
                : 'border-[#87867f] text-[#141413] hover:bg-[#e3dacc]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#d97757]" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Cite Button */}
          <button
            onClick={() => onOpenCite(paper)}
            title="Copy citation"
            className="p-2 rounded-lg border border-[#87867f] text-[#141413] hover:bg-[#e3dacc] text-xs font-sans flex items-center gap-1.5 transition-colors"
          >
            <Quote className="w-4 h-4" />
            <span>Cite</span>
          </button>

          {/* Add to Collection Button */}
          <button
            onClick={() => onOpenAddToCollection(paper)}
            title="Add to Collection"
            className="p-2 rounded-lg border border-[#87867f] text-[#141413] hover:bg-[#e3dacc] text-xs font-sans flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
          </button>

          {/* Read Detail */}
          <button
            onClick={() => onOpenDetail(paper)}
            className="btn-clay text-xs py-2 px-3.5 flex items-center gap-1"
          >
            <span>Read Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
