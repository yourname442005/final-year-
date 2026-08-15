'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Check, Building, FileText, Globe } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, toggleVerificationUser, updateProfile } = usePlatformStore();
  const [orcid, setOrcid] = useState('0000-0002-1825-0097');
  const [instEmail, setInstEmail] = useState(user.email || 'amara.nwosu@research-inst.org');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Grant verification in demo mode
    setTimeout(() => {
      if (!user.verified) {
        toggleVerificationUser();
      }
      onClose();
    }, 1500);
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
          <ShieldCheck className="w-6 h-6 text-[#d97757]" />
          <h3 className="font-sans text-lg font-bold text-[#141413]">
            Researcher Profile Verification
          </h3>
        </div>

        <p className="font-serif text-sm text-[#87867f] leading-relaxed">
          Verification grants a verified badge on your profile and enables publishing research updates and manuscript submissions across the platform.
        </p>

        {/* Current Verification Badge Status Box */}
        <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f]">
              Current Account Status
            </span>
            <p className="font-serif text-base font-medium text-[#141413] flex items-center gap-1.5">
              {user.verified ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800">Verified Researcher</span>
                </>
              ) : (
                <>
                  <span className="text-amber-800">Unverified Account</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={toggleVerificationUser}
            className="btn-outlined-dark text-xs py-1.5 px-3"
          >
            Toggle ({user.verified ? 'Make Unverified' : 'Make Verified'})
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitRequest} className="space-y-3 pt-2">
            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#d97757]" /> Institutional Email
              </label>
              <input
                type="email"
                required
                value={instEmail}
                onChange={(e) => setInstEmail(e.target.value)}
                className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
              />
            </div>

            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#d97757]" /> ORCID iD / Publication Profile Link
              </label>
              <input
                type="text"
                required
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                placeholder="https://orcid.org/0000-0002-XXXX-XXXX"
                className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-outlined-dark text-xs py-2 px-4">
                Close
              </button>
              <button type="submit" className="btn-clay text-xs py-2 px-5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Verification Request</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-2 bg-[#f0eee6] rounded-2xl border border-[#cccbc8]">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-base text-[#141413]">
              Verification Approved!
            </h4>
            <p className="font-serif text-xs text-[#87867f]">
              Your institutional credentials have been verified. You now have full publishing access.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
