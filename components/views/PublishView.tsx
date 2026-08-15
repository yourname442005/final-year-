'use client';

import React from 'react';
import { Upload, Sparkles, FileText, CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { AIPreReviewPanel } from '../AIPreReviewPanel';

interface PublishViewProps {
  onOpenNewManuscript: () => void;
  onOpenVerification: () => void;
}

export const PublishView: React.FC<PublishViewProps> = ({
  onOpenNewManuscript,
  onOpenVerification
}) => {
  const { user, manuscripts } = usePlatformStore();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> Paper Submission Index
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Manuscript Publishing Pipeline
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Submit manuscripts for AI pre-review scoring, academic integrity checks, and index registration.
          </p>
        </div>

        <button
          onClick={onOpenNewManuscript}
          className="btn-clay py-3 px-6 text-xs font-sans flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>Submit Manuscript</span>
        </button>
      </div>

      {/* Verification Guard Notice if Unverified */}
      {!user.verified && (
        <div className="bg-[#faf9f5] border border-amber-300 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-sans text-sm font-bold text-[#141413]">
                Researcher Verification Recommended
              </h4>
              <p className="font-serif text-xs text-[#87867f]">
                Unverified accounts can run draft pre-reviews, but official index registration requires a verified badge.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVerification}
            className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Request Verification</span>
          </button>
        </div>
      )}

      {/* Manuscripts List */}
      <div className="space-y-6">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f] block px-1">
          Your Submitted Manuscripts ({manuscripts.length})
        </span>

        {manuscripts.map((ms) => (
          <div
            key={ms.id}
            className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 space-y-4 hover:border-[#141413] transition-all"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#d97757]" />
                  <h3 className="font-serif text-xl font-bold text-[#141413]">{ms.title}</h3>
                </div>
                <p className="font-sans text-xs text-[#87867f]">
                  Authors: <strong className="text-[#141413]">{ms.authors.join(', ')}</strong> • Target Venue: <strong>{ms.venue}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-sans text-xs bg-[#141413] text-[#faf9f5] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d97757]" /> {ms.status}
                </span>
                <span className="font-sans text-xs text-[#87867f]">{ms.submittedAt}</span>
              </div>
            </div>

            <p className="font-serif text-sm text-[#141413]/90 leading-relaxed line-clamp-3">
              {ms.abstract}
            </p>

            {/* AI Review Score Summary Box */}
            {ms.aiReview && (
              <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Pre-Review Assessment Summary
                  </span>
                  <span className="font-mono text-xs font-bold text-[#141413]">
                    Score: {ms.aiReview.predictedScore} / 100
                  </span>
                </div>
                <p className="font-serif text-xs text-[#141413] leading-relaxed">
                  {ms.aiReview.executiveCritique}
                </p>
              </div>
            )}
          </div>
        ))}

        {manuscripts.length === 0 && (
          <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-12 text-center space-y-3">
            <Upload className="w-10 h-10 text-[#87867f] mx-auto" />
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              No manuscripts submitted
            </h3>
            <p className="font-serif text-xs text-[#87867f] max-w-md mx-auto">
              Submit your draft PDF for AI-assisted readiness scoring and publication index staging.
            </p>
            <button onClick={onOpenNewManuscript} className="btn-clay py-2.5 px-5 text-xs font-sans">
              Start Manuscript Submission
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
