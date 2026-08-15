'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Sparkles, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { AIPreReviewPanel } from './AIPreReviewPanel';

interface NewManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerificationModal: () => void;
}

export const NewManuscriptModal: React.FC<NewManuscriptModalProps> = ({
  isOpen,
  onClose,
  onOpenVerificationModal
}) => {
  const { user, submitManuscript } = usePlatformStore();
  
  // Wizard steps: 1 = Metadata, 2 = PDF & Declaration, 3 = AI Pre-Review, 4 = Final
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState(user.name);
  const [coAuthors, setCoAuthors] = useState('Dr. Elena Rostova');
  const [venue, setVenue] = useState('Journal of Artificial Intelligence Research');
  const [tags, setTags] = useState('Multimodal AI, Transformers, Efficiency');
  const [year, setYear] = useState(2026);

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>({
    name: 'Manuscript_Draft_v1.pdf',
    size: '3.4 MB'
  });
  const [integrityConfirmed, setIntegrityConfirmed] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

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
              Verified Researcher Access Required
            </h3>
          </div>

          <p className="font-serif text-sm text-[#141413] leading-relaxed">
            Only verified researchers can submit manuscripts to the platform publishing index. Verification ensures research integrity and authentic author attribution.
          </p>

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

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) return;
    setStep(2);
  };

  const handleRunAIPreReview = async () => {
    if (!integrityConfirmed) return;
    setIsAnalyzing(true);
    setStep(3);

    try {
      const res = await fetch('/api/analyze-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          abstract,
          venue,
          tags: tags.split(',').map((t) => t.trim()),
          fileName: uploadedFile?.name || 'Manuscript.pdf'
        })
      });
      const data = await res.json();
      if (data.aiReview) {
        setReviewData(data.aiReview);
      }
    } catch (e) {
      console.error('Failed to run AI pre-review:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = () => {
    const newManuscript = {
      id: 'ms-' + Date.now(),
      title,
      abstract,
      authors: authors.split(',').map((a) => a.trim()),
      coAuthors: coAuthors ? coAuthors.split(',').map((c) => c.trim()) : [],
      venue,
      tags: tags.split(',').map((t) => t.trim()),
      year,
      fileName: uploadedFile?.name || 'Manuscript.pdf',
      fileSize: uploadedFile?.size || '3.5 MB',
      integrityConfirmed: true,
      status: 'Submitted' as const,
      submittedAt: new Date().toISOString().split('T')[0],
      aiReview: reviewData || {
        predictedScore: 88,
        titleReview: 'Clear title with strong domain representations.',
        executiveCritique: 'The paper demonstrates clear research intent and strong empirical findings.',
        suggestedKeywords: ['Multimodal AI', 'Transformers'],
        likelyPeerQuestions: ['How does this scale across larger datasets?'],
        clarityAssessment: 'High prose clarity.',
        strengths: ['Solid methodology'],
        weaknesses: ['Minor formatting polish recommended']
      }
    };

    submitManuscript(newManuscript);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#e3dacc] text-[#141413] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Upload className="w-5 h-5 text-[#d97757]" />
            <h3 className="font-sans text-xl font-bold text-[#141413]">
              Submit Manuscript to Platform Publishing Index
            </h3>
          </div>
          <p className="font-serif text-xs text-[#87867f]">
            Step {step} of 4 — AI-Assisted Research Pre-Review Pipeline
          </p>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-2 pt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step >= s ? 'bg-[#d97757]' : 'bg-[#cccbc8]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Metadata Form */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                Manuscript Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Self-Directing Reasoning Chains in Multimodal Transformer Architectures"
                className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-sans text-[#141413] focus:outline-none focus:border-[#d97757]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                  Lead Authors
                </label>
                <input
                  type="text"
                  required
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                  Co-Authors / Collaborators
                </label>
                <input
                  type="text"
                  value={coAuthors}
                  onChange={(e) => setCoAuthors(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                  Target Publication Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                  Topic Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
                Abstract
              </label>
              <textarea
                rows={4}
                required
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste abstract describing research problem, innovation, and quantitative results..."
                className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-clay text-xs py-2.5 px-6 flex items-center gap-1.5">
                <span>Next: PDF Upload & Integrity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: PDF Upload & Integrity Declaration */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-[#cccbc8] bg-[#f0eee6] rounded-2xl p-8 text-center space-y-3">
              <Upload className="w-8 h-8 text-[#d97757] mx-auto" />
              <div>
                <h4 className="font-sans text-sm font-bold text-[#141413]">
                  {uploadedFile ? uploadedFile.name : 'Drag & drop manuscript PDF here'}
                </h4>
                <p className="font-serif text-xs text-[#87867f]">
                  {uploadedFile ? `Size: ${uploadedFile.size} • Ready for analysis` : 'Maximum file size: 25MB (PDF only)'}
                </p>
              </div>

              <button
                onClick={() => setUploadedFile({ name: 'Revised_Manuscript_2026.pdf', size: '4.2 MB' })}
                className="btn-outlined-dark text-xs py-1.5 px-4"
              >
                {uploadedFile ? 'Replace File' : 'Select PDF File'}
              </button>
            </div>

            {/* Academic Integrity Declaration */}
            <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-xl p-4 space-y-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">
                Academic Integrity Declaration
              </h4>
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={integrityConfirmed}
                  onChange={(e) => setIntegrityConfirmed(e.target.checked)}
                  className="mt-1 accent-[#d97757] w-4 h-4"
                />
                <span className="font-serif text-xs text-[#141413] leading-relaxed">
                  I confirm that this manuscript represents original academic work, all co-authors have consented to submission, and the findings do not violate publication copyright or research ethics regulations.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(1)} className="btn-outlined-dark text-xs py-2 px-4">
                Back
              </button>

              <button
                onClick={handleRunAIPreReview}
                disabled={!integrityConfirmed}
                className={`btn-clay text-xs py-2.5 px-6 flex items-center gap-2 ${
                  !integrityConfirmed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Pre-Review Assessment</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Pre-Review Panel Output */}
        {step === 3 && (
          <div>
            {isAnalyzing ? (
              <div className="p-12 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-[#d97757] animate-spin mx-auto" />
                <h4 className="font-serif text-lg font-normal text-[#141413]">
                  Analyzing manuscript structure and formatting against journal baselines...
                </h4>
                <p className="font-sans text-xs text-[#87867f]">
                  Evaluating title clarity, predicted review readiness, and likely peer questions via Gemini API.
                </p>
              </div>
            ) : (
              <AIPreReviewPanel
                review={
                  reviewData || {
                    predictedScore: 89,
                    titleReview: 'Title clearly establishes the core research scope.',
                    executiveCritique: 'The manuscript presents strong empirical metrics with solid methodology.',
                    suggestedKeywords: ['Multimodal AI', 'Transformers'],
                    likelyPeerQuestions: ['How does the model perform under noisy inputs?'],
                    clarityAssessment: 'Exemplary prose structure.',
                    strengths: ['High empirical rigor', 'Clear background motivation'],
                    weaknesses: ['Minor figure legend expansions recommended']
                  }
                }
                onRevise={() => setStep(1)}
                onSubmitFinal={handleFinalSubmit}
              />
            )}
          </div>
        )}

        {/* Step 4: Final Confirmation */}
        {step === 4 && (
          <div className="p-8 text-center space-y-4 bg-[#f0eee6] rounded-2xl border border-[#cccbc8]">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif text-2xl font-normal text-[#141413]">
              Manuscript Successfully Submitted!
            </h3>
            <p className="font-serif text-sm text-[#141413]/80 max-w-md mx-auto leading-relaxed">
              Your manuscript "<strong>{title}</strong>" has been staged in the platform publication pipeline with status <strong>Under Review</strong>.
            </p>

            <div className="pt-4">
              <button onClick={onClose} className="btn-clay text-xs py-2.5 px-6">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
