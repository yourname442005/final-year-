'use client';

import React, { useState } from 'react';
import { Bookmark, FolderPlus, Sparkles, Share2, Trash2, BookOpen } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper } from '@/lib/mock-data';

interface CollectionsViewProps {
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection
}) => {
  const { collections, papers, createCollection, deleteCollection, removePaperFromCollection } = usePlatformStore();
  
  const [selectedColId, setSelectedColId] = useState<string>(collections[0]?.id || '');
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const collection = collections.find((c) => c.id === selectedColId) || collections[0];
  const colPapers = collection ? papers.filter((p) => collection.paperIds.includes(p.id)) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    createCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setIsCreating(false);
  };

  const handleGenerateAISynthesis = async () => {
    if (colPapers.length === 0) return;
    setIsSummarizing(true);
    try {
      const firstPaper = colPapers[0];
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: collection.name,
          abstract: collection.description + ' Papers in collection: ' + colPapers.map((p) => p.title).join('; ')
        })
      });
      const data = await res.json();
      if (data.executiveSummary) {
        setAiSummary(data.executiveSummary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" /> Curated Reading Lists
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Research Collections
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Group related preprints, generate AI cross-paper synthesis overviews, and export citation packs.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-clay py-3 px-5 text-xs font-sans flex items-center gap-1.5"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-3">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">
            Create Research Collection
          </h3>
          <input
            type="text"
            required
            placeholder="Collection Title (e.g. Vision-Language Transformers)"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
          />
          <input
            type="text"
            placeholder="Description / Field Focus..."
            value={newColDesc}
            onChange={(e) => setNewColDesc(e.target.value)}
            className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsCreating(false)} className="btn-outlined-dark text-xs py-1.5 px-3">
              Cancel
            </button>
            <button type="submit" className="btn-clay text-xs py-1.5 px-4">
              Create Collection
            </button>
          </div>
        </form>
      )}

      {/* Grid: Collections Selector Sidebar + Collection Paper View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Collections List */}
        <div className="space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f] block px-1">
            Your Saved Collections ({collections.length})
          </span>

          {collections.map((col) => {
            const isSelected = col.id === (collection?.id || '');
            return (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedColId(col.id);
                  setAiSummary('');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-[#141413] text-[#faf9f5] border-[#141413] shadow-md'
                    : 'bg-[#faf9f5] text-[#141413] border-[#cccbc8] hover:border-[#141413]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold">{col.name}</h4>
                  <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-[#d97757] text-white' : 'bg-[#e3dacc] text-[#141413]'
                  }`}>
                    {col.paperIds.length} papers
                  </span>
                </div>
                <p className={`font-serif text-xs line-clamp-2 ${isSelected ? 'opacity-80' : 'text-[#87867f]'}`}>
                  {col.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Collection Detail */}
        <div className="md:col-span-2 space-y-6">
          {collection ? (
            <div className="space-y-6">
              
              <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="font-serif text-2xl font-normal text-[#141413]">
                    {collection.name}
                  </h2>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateAISynthesis}
                      disabled={isSummarizing || colPapers.length === 0}
                      className="btn-clay text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSummarizing ? 'Synthesizing...' : 'AI Collection Overview'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete collection "${collection.name}"?`)) {
                          deleteCollection(collection.id);
                        }
                      }}
                      className="p-2 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="font-serif text-sm text-[#87867f]">
                  {collection.description}
                </p>

                {/* AI Collection Synthesis Box */}
                {aiSummary && (
                  <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-xl p-4 space-y-2 font-serif text-sm text-[#141413]">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Cross-Paper Synthesis
                    </span>
                    <p className="leading-relaxed">{aiSummary}</p>
                  </div>
                )}
              </div>

              {/* Papers List in Collection */}
              <div className="space-y-4">
                {colPapers.map((paper) => (
                  <div key={paper.id} className="relative group">
                    <PaperCard
                      paper={paper}
                      onOpenDetail={onOpenPaperDetail}
                      onOpenCite={onOpenCite}
                      onOpenAddToCollection={onOpenAddToCollection}
                      showRelevanceSignal={false}
                    />
                    <button
                      onClick={() => removePaperFromCollection(collection.id, paper.id)}
                      className="absolute top-4 right-4 text-xs font-sans text-rose-700 hover:underline bg-[#faf9f5] border border-[#cccbc8] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove from Collection
                    </button>
                  </div>
                ))}

                {colPapers.length === 0 && (
                  <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-8 text-center space-y-2">
                    <p className="font-serif text-sm text-[#87867f]">This collection is currently empty.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-8 text-center">
              <p className="font-serif text-sm text-[#87867f]">Select a collection from the sidebar to view papers.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
