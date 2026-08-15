'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DDDDD8] py-3 shadow-2xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center group-hover:bg-[#d97757] transition-colors">
            <svg className="w-5 h-5 text-[#FFFFFF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.34315 8.34315 5 10 5H15C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11H9C7.34315 11 6 12.3431 6 14C6 15.6569 7.34315 17 9 17H14C15.6569 17 17 15.6569 17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="17" cy="8" r="1.5" fill="#d97757"/>
              <circle cx="7" cy="14" r="1.5" fill="#d97757"/>
            </svg>
          </div>
          <span className="font-sans text-lg font-bold text-[#111111] lowercase tracking-tight">
            suiiiiiiii
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-xs font-medium text-[#4A4A45]">
          <a href="#features" className="hover:text-[#111111] transition-colors">
            Capabilities
          </a>
          <a href="#how-it-works" className="hover:text-[#111111] transition-colors">
            How It Works
          </a>
          <a href="#network" className="hover:text-[#111111] transition-colors">
            Knowledge Network
          </a>
          <a href="#pricing" className="hover:text-[#111111] transition-colors">
            Access
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/feed"
            className="font-sans text-xs font-semibold text-[#111111] hover:text-[#4A4A45] px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/feed"
            className="font-sans text-xs font-semibold bg-[#111111] text-[#FFFFFF] hover:bg-[#d97757] px-4 py-2 rounded-xl transition-all duration-200 shadow-xs flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
