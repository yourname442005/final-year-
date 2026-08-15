'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WobbleCard } from './WobbleCard';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-[#F5F5F3] border-t border-[#DDDDD8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <WobbleCard containerClassName="p-10 sm:p-14 text-center shadow-lg">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> suiiiiiiii Platform Access
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#111111] tracking-tight">
                Your next discovery is waiting.
              </h2>
              <p className="font-serif text-base text-[#8A8A84] max-w-lg mx-auto leading-relaxed">
                Start exploring research with less noise and more context.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/feed"
                className="btn-clay text-sm py-3.5 px-8 rounded-xl font-sans font-semibold inline-flex items-center gap-2 shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </WobbleCard>
      </div>
    </section>
  );
};

