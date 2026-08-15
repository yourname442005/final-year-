'use client';

import React, { useState } from 'react';
import { X, Sparkles, Bookmark, BookmarkCheck, Quote, FolderPlus, ExternalLink, RefreshCw, Layers, Check, AlertCircle } from 'lucide-react';
import { Paper } from '@/lib/mock-data';
import { usePlatformStore } from '@/lib/platform-store';

interface PaperDetailModalProps {
  paper: Paper | null;
  onClose: () => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
  onSelectRelatedPaper?: (paper: Paper) => void;
}

export const PaperDetailModal: React.FC<PaperDetailModalProps> = ({
  paper,
  onClose,
  onOpenCite,
  onOpenAddToCollection,
  onSelectRelatedPaper
}) => {
  const { savedPaperIds, toggleSavePaper, papers } = usePlatformStore();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [currentInsights, setCurrentInsights] = useState<{
    keyContributions?: string[];
    methodology?: string;
    limitations?: string[];
    researchGaps?: string[];
    citationContext?: string;
  } | null>(null);

  if (!paper) return null;

  const isSaved = savedPaperIds.includes(paper.id);
  const summaryText = currentSummary || paper.aiSummary || paper.abstract;
  const contributions = currentInsights?.keyContributions || paper.keyContributions || [
    'Introduced novel computational framework for high-throughput evaluation.',
    'Achieved significant performance benchmarks compared to traditional baselines.',
    'Provided open replication data and methodological definitions.'
  ];
  const methodology = currentInsights?.methodology || paper.methodology || 'Quantitative statistical modeling combined with controlled empirical evaluations.';
  const limitations = currentInsights?.limitations || paper.limitations || [
    'Experimental validation constrained to standard reference benchmarks.',
    'Requires additional compute resources during peak training epochs.'
  ];
  const gaps = currentInsights?.researchGaps || paper.researchGaps || [
    'Cross-disciplinary domain generalization remains untested.',
    'Formal theoretical convergence bounds under noisy non-stationary inputs.'
  ];

  const handleRefreshAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const resSum = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.authors,
          venue: paper.venue
        })
      });
      const dataSum = await resSum.json();
      if (dataSum.summary) {
        setCurrentSummary(dataSum.summary);
      }

      const resIns = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.authors,
          tags: paper.tags
        })
      });
      const dataIns = await resIns.json();
      if (dataIns.keyContributions) {
        setCurrentInsights(dataIns);
      }
    } catch (e) {
      console.error('Failed to regenerate AI insights:', e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const relatedPapers = papers.filter((p) => p.id !== paper.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Paper Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs bg-[#e3dacc] text-[#141413] font-medium px-3 py-1 rounded-full">
              {paper.venue} ({paper.year})
            </span>
            {paper.openAccess && (
              <span className="font-sans text-xs text-[#d97757] font-semibold border border-[#d97757]/30 px-2.5 py-0.5 rounded-full">
                Open Access
              </span>
            )}
            <span className="font-sans text-xs text-[#87867f]">
              Citations: <strong className="text-[#141413]">{paper.citationCount}</strong>
            </span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#141413] leading-tight">
            {paper.title}
          </h2>

          <p className="font-sans text-sm text-[#87867f]">
            Authors: <span className="text-[#141413] font-medium">{paper.authors.join(', ')}</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {paper.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-xs text-[#87867f] bg-[#f0eee6] px-2.5 py-0.5 rounded border border-[#cccbc8]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 py-3 border-y border-[#cccbc8]">
          <button
            onClick={() => toggleSavePaper(paper.id)}
            className={`btn-signature-ivory py-2 px-4 flex items-center gap-2 ${
              isSaved ? 'bg-[#141413] text-[#faf9f5]' : ''
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#d97757]" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved in Library' : 'Save to Library'}</span>
          </button>

          <button
            onClick={() => onOpenCite(paper)}
            className="btn-outlined-dark text-xs py-2 px-4 flex items-center gap-2"
          >
            <Quote className="w-4 h-4" />
            <span>Copy Citation</span>
          </button>

          <button
            onClick={() => onOpenAddToCollection(paper)}
            className="btn-outlined-dark text-xs py-2 px-4 flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add to Collection</span>
          </button>

          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outlined-dark text-xs py-2 px-4 flex items-center gap-2 no-underline"
            >
              <span>View DOI</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* AI Intelligence Header Bar */}
        <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#141413]">
              <span className="bg-[#d97757] text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                AI Generated
              </span>
              <span>Research Intelligence Analysis</span>
            </div>

            <button
              onClick={handleRefreshAISummary}
              disabled={isGeneratingSummary}
              className="font-sans text-xs text-[#141413] hover:text-[#d97757] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
              <span>{isGeneratingSummary ? 'Analyzing...' : 'Re-analyze with Gemini'}</span>
            </button>
          </div>

          <p className="font-sans text-xs text-[#87867f] italic">
            Note: All insights below are generated by server-side AI models to assist literature review. Verified metadata is preserved above.
          </p>
        </div>

        {/* AI Summary Section */}
        <div className="space-y-2">
          <h3 className="font-sans text-sm font-semibold tracking-wider text-[#141413] uppercase">
            AI Plain-Language Summary
          </h3>
          <div className="bg-[#f0eee6]/60 border border-[#cccbc8] rounded-xl p-4 font-serif text-base text-[#141413] leading-relaxed">
            {summaryText}
          </div>
        </div>

        {/* Key Contributions & Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f0eee6]/60 border border-[#cccbc8] rounded-xl p-4 space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Key Contributions
            </h4>
            <ul className="list-disc list-inside font-serif text-sm text-[#141413] space-y-1.5">
              {contributions.map((c, idx) => (
                <li key={idx} className="leading-snug">{c}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#f0eee6]/60 border border-[#cccbc8] rounded-xl p-4 space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#141413] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#d97757]" />
              Methodology
            </h4>
            <p className="font-serif text-sm text-[#141413] leading-relaxed">
              {methodology}
            </p>
          </div>
        </div>

        {/* Limitations & Research Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f0eee6]/60 border border-[#cccbc8] rounded-xl p-4 space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#87867f] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Limitations
            </h4>
            <ul className="list-disc list-inside font-serif text-sm text-[#141413] space-y-1.5">
              {limitations.map((l, idx) => (
                <li key={idx} className="leading-snug">{l}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#f0eee6]/60 border border-[#cccbc8] rounded-xl p-4 space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#d97757] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d97757]" />
              Open Research Gaps
            </h4>
            <ul className="list-disc list-inside font-serif text-sm text-[#141413] space-y-1.5">
              {gaps.map((g, idx) => (
                <li key={idx} className="leading-snug">{g}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full Abstract Original */}
        <div className="space-y-2 pt-2 border-t border-[#cccbc8]">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f]">
            Original Abstract
          </h3>
          <p className="font-serif text-sm text-[#141413]/90 leading-relaxed italic">
            "{paper.abstract}"
          </p>
        </div>

        {/* Related Papers */}
        {relatedPapers.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#cccbc8]">
            <h3 className="font-sans text-sm font-semibold tracking-wider text-[#141413] uppercase">
              Related Research Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {relatedPapers.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedPaper?.(rel)}
                  className="bg-[#f0eee6] border border-[#cccbc8] rounded-xl p-3 hover:border-[#d97757] cursor-pointer transition-colors space-y-1"
                >
                  <span className="font-sans text-[11px] text-[#87867f] block">
                    {rel.venue} ({rel.year})
                  </span>
                  <h5 className="font-serif text-sm text-[#141413] font-medium line-clamp-2">
                    {rel.title}
                  </h5>
                  <span className="font-sans text-xs text-[#d97757] font-semibold block pt-1">
                    Explore Paper →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
