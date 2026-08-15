'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Check, Plus } from 'lucide-react';
import { Paper } from '@/lib/mock-data';
import { usePlatformStore } from '@/lib/platform-store';

interface AddToCollectionModalProps {
  paper: Paper | null;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ paper, onClose }) => {
  const { collections, addPaperToCollection, createCollection } = usePlatformStore();
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (!paper) return null;

  const handleToggle = (colId: string) => {
    addPaperToCollection(colId, paper.id);
    setAddedIds((prev) => [...prev, colId]);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    createCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-md w-full p-6 relative shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-[#d97757]" />
          <h3 className="font-sans text-lg font-bold text-[#141413]">
            Add to Research Collection
          </h3>
        </div>

        <p className="font-serif text-xs text-[#87867f] line-clamp-1">
          {paper.title}
        </p>

        {/* Existing Collections List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
          {collections.map((col) => {
            const inCol = col.paperIds.includes(paper.id) || addedIds.includes(col.id);
            return (
              <div
                key={col.id}
                onClick={() => !inCol && handleToggle(col.id)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  inCol
                    ? 'bg-[#141413] text-[#faf9f5] border-[#141413]'
                    : 'bg-[#f0eee6] border-[#cccbc8] text-[#141413] hover:border-[#d97757]'
                }`}
              >
                <div>
                  <h4 className="font-sans text-sm font-semibold">{col.name}</h4>
                  <p className="font-serif text-xs opacity-80">{col.paperIds.length} papers saved</p>
                </div>

                <div className="flex items-center gap-1 font-sans text-xs">
                  {inCol ? (
                    <span className="flex items-center gap-1 text-[#d97757] font-semibold">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    <span className="text-[#87867f]">Click to add</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Collection Inline Form */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full btn-outlined-dark py-2 flex items-center justify-center gap-1.5 text-xs font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Collection</span>
          </button>
        ) : (
          <form onSubmit={handleCreateNew} className="bg-[#f0eee6] border border-[#cccbc8] p-3 rounded-xl space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">New Collection</h4>
            <input
              type="text"
              placeholder="Collection name (e.g., Transformer Benchmarks)"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              required
              className="w-full p-2 bg-[#faf9f5] border border-[#cccbc8] rounded-lg text-xs font-sans focus:outline-none focus:border-[#d97757]"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              className="w-full p-2 bg-[#faf9f5] border border-[#cccbc8] rounded-lg text-xs font-sans focus:outline-none focus:border-[#d97757]"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="font-sans text-xs text-[#87867f] hover:text-[#141413] px-2 py-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-clay text-xs py-1 px-3">
                Create & Add
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
