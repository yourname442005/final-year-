'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Plus } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createWorkspaceProject } = usePlatformStore();
  const [name, setName] = useState('');
  const [field, setField] = useState('Computer Science / Artificial Intelligence');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWorkspaceProject(name.trim(), description.trim(), field);
    setName('');
    setDescription('');
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
          <FolderPlus className="w-5 h-5 text-[#d97757]" />
          <h3 className="font-sans text-lg font-bold text-[#141413]">
            Start Research Project Workspace
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adaptive Latent Gateways in Vision-Language Models"
              className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-sans text-[#141413] focus:outline-none focus:border-[#d97757]"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Research Discipline / Field
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413] focus:outline-none focus:border-[#d97757]"
            >
              <option value="Computer Science / Artificial Intelligence">Computer Science / Artificial Intelligence</option>
              <option value="Materials Science & Quantum Spectroscopy">Materials Science & Quantum Spectroscopy</option>
              <option value="Biomedical Engineering & Cancer Genomics">Biomedical Engineering & Cancer Genomics</option>
              <option value="Bioinformatics & Privacy-Preserving Systems">Bioinformatics & Privacy-Preserving Systems</option>
              <option value="Physics & Complex Dynamical Systems">Physics & Complex Dynamical Systems</option>
            </select>
          </div>

          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the research goals, methodologies, or grant milestones..."
              className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-outlined-dark text-xs py-2 px-4">
              Cancel
            </button>
            <button type="submit" className="btn-clay text-xs py-2 px-5 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Create Workspace</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
