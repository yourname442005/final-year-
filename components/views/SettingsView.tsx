'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, User as UserIcon, Save, Bell, Sparkles } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

interface SettingsViewProps {
  onOpenVerification: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenVerification }) => {
  const { user, updateProfile, toggleVerificationUser } = usePlatformStore();
  
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [institution, setInstitution] = useState(user.institution);
  const [bio, setBio] = useState(user.bio);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, title, institution, bio });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" /> Researcher Profile
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Account & Settings
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Manage institutional credentials, academic bio, and verification status.
          </p>
        </div>
      </div>

      {/* Verification Card */}
      <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${user.verified ? 'text-emerald-600' : 'text-[#d97757]'}`} />
            <h3 className="font-serif text-lg font-bold text-[#141413]">
              Verification Status: {user.verified ? 'Verified Researcher' : 'Unverified Account'}
            </h3>
          </div>
          <p className="font-serif text-xs text-[#87867f]">
            {user.verified
              ? 'Your profile features a verified badge, allowing you to post research updates and submit manuscripts.'
              : 'Verify institutional credentials to unlock research posting and paper index submissions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleVerificationUser}
            className="btn-outlined-dark text-xs py-2 px-3"
          >
            Toggle Verification
          </button>
          <button
            onClick={onOpenVerification}
            className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Details</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 space-y-4">
        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">
          Profile Information
        </h3>

        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border border-[#cccbc8]"
          />
          <div>
            <p className="font-serif text-base font-bold text-[#141413]">{user.name}</p>
            <p className="font-sans text-xs text-[#87867f]">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
              Academic Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
            Institution / Affiliation
          </label>
          <input
            type="text"
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
          />
        </div>

        <div>
          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#87867f] block mb-1">
            Research Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-serif text-[#141413]"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="font-sans text-xs text-emerald-700 font-bold">
              ✓ Profile changes saved!
            </span>
          ) : (
            <span className="font-sans text-xs text-[#87867f]">
              Changes update immediately across the platform.
            </span>
          )}

          <button type="submit" className="btn-clay text-xs py-2 px-5 flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

    </div>
  );
};
