'use client';

import React, { useState } from 'react';
import { Users, ShieldCheck, BookOpen, Award, UserPlus, Check, ExternalLink } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { Researcher } from '@/lib/mock-data';

export const NetworkView: React.FC = () => {
  const { researchers, toggleFollowResearcher } = usePlatformStore();
  const [selectedField, setSelectedField] = useState<string>('All');
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);

  const fields = ['All', 'Artificial Intelligence', 'Quantum Materials', 'Genomics & Oncology', 'Condensed Physics'];

  const filteredResearchers = researchers.filter((r) => {
    if (selectedField === 'All') return true;
    return r.field.toLowerCase().includes(selectedField.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Peer Directory
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Verified Researcher Network
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Connect with verified principle investigators, lab directors, and authors across top academic and industrial institutions.
          </p>
        </div>
      </div>

      {/* Field Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap font-sans text-xs">
        <span className="font-bold uppercase tracking-wider text-[#141413]">Discipline Filter:</span>
        {fields.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedField(f)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              selectedField === f
                ? 'bg-[#141413] text-[#faf9f5]'
                : 'bg-[#faf9f5] text-[#87867f] border border-[#cccbc8] hover:border-[#141413]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Researchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResearchers.map((r) => (
          <div
            key={r.id}
            className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 space-y-4 hover:border-[#141413] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#cccbc8]"
                />

                <button
                  onClick={() => toggleFollowResearcher(r.id)}
                  className={`btn-clay text-xs py-1.5 px-3 flex items-center gap-1 ${
                    r.isFollowed ? 'bg-[#141413] text-[#faf9f5]' : ''
                  }`}
                >
                  {r.isFollowed ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{r.isFollowed ? 'Following' : 'Follow'}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-lg font-bold text-[#141413]">{r.name}</h3>
                  {r.verified && (
                    <span title="Verified Researcher">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#87867f] font-medium">{r.title}</p>
                <p className="font-sans text-xs text-[#d97757] font-semibold">{r.institution}</p>
              </div>

              <p className="font-serif text-xs text-[#141413]/80 line-clamp-3 leading-relaxed">
                {r.bio}
              </p>
            </div>

            {/* Metrics Footer */}
            <div className="pt-3 border-t border-[#cccbc8] flex items-center justify-between text-xs font-sans text-[#87867f]">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#d97757]" /> {r.publicationsCount} Papers
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#d97757]" /> {r.citationCount.toLocaleString()} Citations
              </span>
              <span className="font-mono text-[#141413] font-bold">h-index: {r.hIndex}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
