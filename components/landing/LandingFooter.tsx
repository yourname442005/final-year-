'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#DDDDD8] py-12 font-sans text-xs text-[#8A8A84]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <Link href="/" className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded bg-[#111111] text-[#FFFFFF] flex items-center justify-center text-xs">
              <svg className="w-3.5 h-3.5 text-[#FFFFFF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8C7 6.34315 8.34315 5 10 5H15C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11H9C7.34315 11 6 12.3431 6 14C6 15.6569 7.34315 17 9 17H14C15.6569 17 17 15.6569 17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-[#111111] text-base lowercase tracking-tight">
              suiiiiiiii
            </span>
          </Link>
          <p className="font-serif text-xs text-[#8A8A84]">
            AI-Native Research Intelligence Platform
          </p>
        </div>

        <div className="flex items-center gap-6 text-[#4A4A45]">
          <a href="#features" className="hover:text-[#111111] transition-colors">
            Capabilities
          </a>
          <a href="#how-it-works" className="hover:text-[#111111] transition-colors">
            How It Works
          </a>
          <a href="#network" className="hover:text-[#111111] transition-colors">
            Network
          </a>
          <a href="#pricing" className="hover:text-[#111111] transition-colors">
            Access
          </a>
          <Link href="/feed" className="font-bold text-[#111111] hover:text-[#d97757] transition-colors">
            Platform App
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-[#DDDDD8]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A8A84]">
        <p>© 2026 suiiiiiiii. All rights reserved. Scientific Intelligence Field Journal.</p>
        <p className="font-mono">v1.0.0-production</p>
      </div>
    </footer>
  );
};
