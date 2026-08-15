'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Zap, Filter, RotateCcw, ArrowRight, History, ShieldAlert } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper } from '@/lib/mock-data';

interface SearchViewProps {
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
  isHttpAccelerated: boolean;
  setIsHttpAccelerated: (val: boolean) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection,
  isHttpAccelerated,
  setIsHttpAccelerated
}) => {
  const { papers, searchHistory, addSearchHistory } = usePlatformStore();
  
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword' | 'hybrid'>('semantic');
  const [isLoading, setIsLoading] = useState(false);
  const [searchLatency, setSearchLatency] = useState<number | null>(null);
  const [queryUnderstanding, setQueryUnderstanding] = useState<string>('');
  const [results, setResults] = useState<Paper[]>(papers);
  const [suggestedSearches, setSuggestedSearches] = useState<string[]>([
    'self-directing reasoning chains in transformers',
    'quantum surface spectroscopy for solid-state cathodes',
    'single-cell transcriptomics in glioblastoma'
  ]);

  // Filters
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [minCitations, setMinCitations] = useState(0);
  const [yearFilter, setYearFilter] = useState<'All' | '2026' | '2025' | '2024'>('All');

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    addSearchHistory(searchQuery);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          mode: searchMode,
          papers,
          isHttpAccelerated
        })
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        setSearchLatency(data.latencyMs);
        setQueryUnderstanding(data.queryUnderstanding || '');
        if (data.suggestedSearches) {
          setSuggestedSearches(data.suggestedSearches);
        }
      }
    } catch (e) {
      console.error('Search API error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  // Filter client-side
  const filteredResults = results.filter((p) => {
    if (openAccessOnly && !p.openAccess) return false;
    if (p.citationCount < minCitations) return false;
    if (yearFilter !== 'All' && String(p.year) !== yearFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Semantic Retrieval Layer
            </span>
            {isHttpAccelerated && (
              <span className="font-sans text-xs bg-[#141413] text-[#faf9f5] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#d97757]" /> HTTP Accelerated
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#141413]">
            Ask Natural Language Research Questions
          </h1>
          <p className="font-serif text-sm text-[#87867f] leading-relaxed">
            Search conceptual research questions directly. The semantic engine ranks papers by intent rather than exact keyword matches.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              maxLength={500}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What methods reduce latency in multi-step multimodal transformer reasoning?"
              className="w-full p-4 pl-12 pr-28 bg-[#f0eee6] border border-[#cccbc8] rounded-2xl font-serif text-base text-[#141413] focus:outline-none focus:border-[#d97757] shadow-inner"
            />
            <Search className="w-5 h-5 text-[#87867f] absolute left-4" />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-clay absolute right-2 py-2 px-5 text-xs flex items-center gap-1.5"
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <span>Search</span>}
            </button>
          </div>

          {/* Character counter & Mode Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3 font-sans text-xs text-[#87867f]">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#141413]">Search Mode:</span>
              {(['semantic', 'keyword', 'hybrid'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSearchMode(m)}
                  className={`capitalize px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    searchMode === m
                      ? 'bg-[#141413] text-[#faf9f5]'
                      : 'bg-[#f0eee6] text-[#87867f] hover:text-[#141413]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span>{query.length} / 500 chars</span>
              {searchLatency !== null && (
                <span className="font-mono text-[#d97757] font-semibold">
                  Latency: {searchLatency}ms
                </span>
              )}
            </div>
          </div>
        </form>

        {/* Benchmark Note Notice */}
        <div className="bg-[#f0eee6] border border-[#cccbc8] p-3 rounded-xl font-sans text-[11px] text-[#87867f] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#d97757] shrink-0" />
            <span>
              <strong>Note on Acceleration:</strong> High-Performance HTTP Search layer is active. Benchmark metrics are tracked for system performance validation.
            </span>
          </div>
          <button
            onClick={() => setIsHttpAccelerated(!isHttpAccelerated)}
            className="text-[#141413] font-semibold underline cursor-pointer"
          >
            {isHttpAccelerated ? 'Disable HTTP Mode' : 'Enable HTTP Mode'}
          </button>
        </div>

        {/* In-Session Search History Chips */}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#cccbc8]">
            <span className="font-sans text-xs text-[#87867f] font-medium flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> Recent Queries:
            </span>
            {searchHistory.slice(0, 5).map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q);
                  executeSearch(q);
                }}
                className="font-sans text-xs bg-[#f0eee6] hover:bg-[#e3dacc] text-[#141413] px-2.5 py-1 rounded-full border border-[#cccbc8] transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Query Understanding Callout */}
      {queryUnderstanding && (
        <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-2xl p-4 font-serif text-sm text-[#141413]">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] block mb-1">
            Query Intent Understanding
          </span>
          "{queryUnderstanding}"
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold uppercase tracking-wider text-[#141413] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters
          </span>

          {/* Year Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[#87867f]">Year:</span>
            {(['All', '2026', '2025', '2024'] as const).map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  yearFilter === y
                    ? 'bg-[#141413] text-[#faf9f5] border-[#141413]'
                    : 'bg-[#f0eee6] text-[#87867f] border-[#cccbc8] hover:border-[#141413]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Open Access Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#141413]">
            <input
              type="checkbox"
              checked={openAccessOnly}
              onChange={(e) => setOpenAccessOnly(e.target.checked)}
              className="accent-[#d97757]"
            />
            <span>Open Access Only</span>
          </label>

          {/* Citations Slider/Select */}
          <div className="flex items-center gap-1">
            <span className="text-[#87867f]">Min Citations:</span>
            <select
              value={minCitations}
              onChange={(e) => setMinCitations(Number(e.target.value))}
              className="bg-[#f0eee6] border border-[#cccbc8] rounded-lg p-1 text-xs text-[#141413]"
            >
              <option value={0}>Any</option>
              <option value={50}>≥ 50</option>
              <option value={100}>≥ 100</option>
              <option value={200}>≥ 200</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setYearFilter('All');
            setOpenAccessOnly(false);
            setMinCitations(0);
          }}
          className="text-[#87867f] hover:text-[#141413] flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Suggested Search Chips */}
      {suggestedSearches.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap font-sans text-xs">
          <span className="text-[#87867f] font-semibold">Suggested Alternative Searches:</span>
          {suggestedSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s);
                executeSearch(s);
              }}
              className="bg-[#f0eee6] hover:bg-[#e3dacc] text-[#141413] px-3 py-1 rounded-full border border-[#cccbc8] transition-colors flex items-center gap-1"
            >
              <span>{s}</span>
              <ArrowRight className="w-3 h-3 text-[#d97757]" />
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between font-sans text-xs text-[#87867f]">
        <span>Found {filteredResults.length} relevant research papers</span>
        <span>Sorted by Semantic Relevance Signal</span>
      </div>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-6">
          {filteredResults.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onOpenDetail={onOpenPaperDetail}
              onOpenCite={onOpenCite}
              onOpenAddToCollection={onOpenAddToCollection}
              showRelevanceSignal={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-12 text-center space-y-3">
          <Search className="w-10 h-10 text-[#87867f] mx-auto" />
          <h3 className="font-serif text-xl font-normal text-[#141413]">
            No matching papers found
          </h3>
          <p className="font-serif text-xs text-[#87867f] max-w-md mx-auto">
            Try broadening your natural language research query or resetting active filters.
          </p>
        </div>
      )}

    </div>
  );
};
