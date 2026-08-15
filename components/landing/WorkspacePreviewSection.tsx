'use client';

import React from 'react';
import Link from 'next/link';
import { FolderKanban, Clock, CheckSquare, Plus, ArrowRight } from 'lucide-react';
import { WobbleCard } from './WobbleCard';

export const WorkspacePreviewSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#F5F5F3] border-y border-[#DDDDD8] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#4A4A45] bg-[#EAEAE7] px-3 py-1 rounded-full border border-[#DDDDD8]">
            Product Preview
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            The Research Workspace & Time Analytics
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Manage projects, co-author invitations, dataset files, and track how your research hours are distributed across active papers.
          </p>
        </div>

        {/* Browser Frame Window Preview with WobbleCard 3D tilt */}
        <div className="max-w-5xl mx-auto">
          <WobbleCard containerClassName="p-4 sm:p-6 shadow-xl">
            {/* Browser Window Bar */}
            <div className="flex items-center justify-between border-b border-[#DDDDD8] pb-3 font-sans text-xs text-[#8A8A84]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#DDDDD8]" />
                <span className="w-3 h-3 rounded-full bg-[#DDDDD8]" />
                <span className="w-3 h-3 rounded-full bg-[#DDDDD8]" />
                <span className="font-mono text-[11px] text-[#4A4A45] ml-2">suiiiiiiii.app/workspace</span>
              </div>
              <span className="bg-[#F5F5F3] border border-[#DDDDD8] px-2.5 py-0.5 rounded text-[10px] font-bold text-[#111111]">
                Live Preview
              </span>
            </div>

            {/* Inner Mock Workspace UI Preview */}
            <div className="bg-[#faf9f5] border border-[#DDDDD8] rounded-2xl p-6 space-y-6 text-left mt-4">
              {/* Top Workspace Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#DDDDD8] pb-4">
                <div className="space-y-1">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#d97757]">
                    Active Research Workspace
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#111111]">
                    Multimodal Transformer Routing & Physics Engine
                  </h3>
                </div>
                <Link
                  href="/workspace"
                  className="btn-clay text-xs py-2 px-4 font-sans inline-flex items-center gap-1.5"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Time Allocation Chart Preview Card */}
              <div className="bg-[#FFFFFF] border border-[#DDDDD8] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Time Analytics
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#111111]">Research Time Allocation</h4>
                  </div>
                  <span className="font-sans text-xs text-[#8A8A84]">Total: <strong className="text-[#111111]">31 hrs</strong></span>
                </div>

                {/* Horizontal Bar Chart Preview */}
                <div className="space-y-2.5 font-sans text-xs pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif text-[#111111] font-medium">Multimodal Transformer Routing</span>
                      <span className="font-bold text-[#d97757]">15 hrs</span>
                    </div>
                    <div className="w-full bg-[#F5F5F3] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#d97757] h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif text-[#111111] font-medium">Operando Spectroscopic Surface Analysis</span>
                      <span className="font-bold text-[#c86847]">10 hrs</span>
                    </div>
                    <div className="w-full bg-[#F5F5F3] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#c86847] h-full rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-serif text-[#111111] font-medium">Causal Physics Reasoning Engines</span>
                      <span className="font-bold text-[#b85837]">6 hrs</span>
                    </div>
                    <div className="w-full bg-[#F5F5F3] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#b85837] h-full rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
};

