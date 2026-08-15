'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const AccessPricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-[#FFFFFF] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
            Platform Access
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            Start research with less noise
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Free access for individual researchers, full team workspaces for collaborative lab groups.
          </p>
        </div>

        {/* Access Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Tier */}
          <div className="p-8 rounded-3xl bg-[#F5F5F3] border border-[#DDDDD8] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A8A84]">
                Individual Researcher
              </span>
              <div>
                <h3 className="font-serif text-3xl font-bold text-[#111111]">Open Access</h3>
                <p className="font-serif text-xs text-[#8A8A84] pt-1">Ideal for independent literature discovery & notes</p>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-[#111111] pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Full AI Semantic Vector Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Personal Collections & Saved Literature</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Researcher Profile & Verification Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Real-Time Academic Activity Alerts</span>
                </div>
              </div>
            </div>

            <Link
              href="/feed"
              className="btn-outlined-dark text-xs py-3 px-6 rounded-xl font-sans font-semibold text-center w-full block bg-[#FFFFFF]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Research Lab / Team Workspace Tier */}
          <div className="p-8 rounded-3xl bg-[#111111] text-[#FFFFFF] border border-[#111111] space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
                  Lab Workspace
                </span>
                <span className="font-sans text-[10px] bg-[#d97757] text-white px-2.5 py-0.5 rounded-full font-bold">
                  Recommended
                </span>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-[#FFFFFF]">Team Intelligence</h3>
                <p className="font-serif text-xs text-[#EAEAE7]/80 pt-1">For multi-author lab groups & collaborative projects</p>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-[#EAEAE7] pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Everything in Individual Researcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Shared Research Workspace Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Research Time Allocation Chart Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d97757]" />
                  <span>Co-Author Discussion Threads & Invites</span>
                </div>
              </div>
            </div>

            <Link
              href="/feed"
              className="btn-clay text-xs py-3 px-6 rounded-xl font-sans font-semibold text-center w-full block relative z-10"
            >
              Launch Lab Workspace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
