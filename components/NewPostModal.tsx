'use client';

import React, { useState } from 'react';
import { X, Send, Paperclip, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Paper } from '@/lib/mock-data';
import { usePlatformStore } from '@/lib/platform-store';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerificationModal: () => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onOpenVerificationModal
}) => {
  const { user, createPost, papers } = usePlatformStore();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'Research Update' | 'Preprint Announcement' | 'Methodology Discussion' | 'Dataset Release'>('Research Update');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('');

  if (!isOpen) return null;

  if (!user.verified) {
    return (
      <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-md w-full p-6 relative shadow-2xl space-y-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-sans text-lg font-bold text-[#141413]">
              Researcher Verification Required
            </h3>
          </div>

          <p className="font-serif text-sm text-[#141413] leading-relaxed">
            Publishing research updates and preprint announcements is restricted to verified researchers to maintain network academic signal.
          </p>

          <div className="bg-[#f0eee6] p-3 rounded-xl border border-[#cccbc8] font-sans text-xs text-[#87867f]">
            Standard accounts can search literature, organize collections, use research workspaces, and comment on updates.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-outlined-dark text-xs py-2 px-4">
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenVerificationModal();
              }}
              className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Verification</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const linkedPaper = papers.find((p) => p.id === selectedPaperId);
    createPost(content, postType, linkedPaper);
    setContent('');
    setSelectedPaperId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-lg w-full p-6 relative shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d97757]" />
          <h3 className="font-sans text-lg font-bold text-[#141413]">
            Publish Research Update
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Update Category
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as any)}
              className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413] focus:outline-none focus:border-[#d97757]"
            >
              <option value="Research Update">Research Update</option>
              <option value="Preprint Announcement">Preprint Announcement</option>
              <option value="Methodology Discussion">Methodology Discussion</option>
              <option value="Dataset Release">Dataset Release</option>
            </select>
          </div>

          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Post Content
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share benchmark findings, preprint releases, or scientific methodologies..."
              required
              className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-[#d97757]" /> Link Research Paper (Optional)
            </label>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413] focus:outline-none focus:border-[#d97757]"
            >
              <option value="">No paper linked</option>
              {papers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.year})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-sans text-xs text-[#87867f]">
              Posting as: <strong className="text-[#141413]">{user.name}</strong>
            </span>

            <button type="submit" className="btn-clay text-xs py-2 px-5 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
