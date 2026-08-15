'use client';

import React, { useState } from 'react';
import { X, Check, Copy, BookOpen } from 'lucide-react';
import { Paper } from '@/lib/mock-data';

interface CiteModalProps {
  paper: Paper | null;
  onClose: () => void;
}

export const CiteModal: React.FC<CiteModalProps> = ({ paper, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'APA' | 'MLA' | 'BibTeX' | 'RIS'>('APA');
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const authorsStr = paper.authors.join(', ');
  const firstAuthorLast = paper.authors[0] ? paper.authors[0].split(' ').pop() : 'Author';

  const citations = {
    APA: `${authorsStr} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`,
    MLA: `${authorsStr}. "${paper.title}." ${paper.venue}, ${paper.year}. DOI: ${paper.doi}.`,
    BibTeX: `@article{${firstAuthorLast?.toLowerCase()}${paper.year}${paper.id.replace('-', '')},
  title = {${paper.title}},
  author = {${paper.authors.join(' and ')}},
  journal = {${paper.venue}},
  year = {${paper.year}},
  doi = {${paper.doi}}
}`,
    RIS: `TY  - JOUR
TI  - ${paper.title}
AU  - ${paper.authors.join('\nAU  - ')}
JO  - ${paper.venue}
PY  - ${paper.year}
DO  - ${paper.doi}
ER  -`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeFormat]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-xl w-full p-6 relative shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#d97757]" />
          <h3 className="font-sans text-lg font-bold text-[#141413]">
            Export Citation
          </h3>
        </div>

        <p className="font-serif text-sm text-[#87867f] line-clamp-1">
          {paper.title}
        </p>

        {/* Format Selector */}
        <div className="flex border-b border-[#cccbc8] gap-2">
          {(['APA', 'MLA', 'BibTeX', 'RIS'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`font-sans text-xs px-3 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
                activeFormat === fmt
                  ? 'border-[#d97757] text-[#d97757]'
                  : 'border-transparent text-[#87867f] hover:text-[#141413]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-xl p-4 font-mono text-xs text-[#141413] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48">
          {citations[activeFormat]}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-sans text-xs text-[#87867f]">
            Format: {activeFormat}
          </span>

          <button
            onClick={handleCopy}
            className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
