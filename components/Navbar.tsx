'use client';

import React from 'react';
import { Sparkles, Bell, ShieldCheck, Zap, User as UserIcon } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenVerification: () => void;
  isHttpAccelerated: boolean;
  setIsHttpAccelerated: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenVerification,
  isHttpAccelerated,
  setIsHttpAccelerated
}) => {
  const { user, notifications } = usePlatformStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#f0eee6] border-b border-[#cccbc8] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onNavigate('feed')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#141413] text-[#faf9f5] flex items-center justify-center group-hover:bg-[#d97757] transition-colors">
            <svg className="w-5 h-5 text-[#faf9f5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.34315 8.34315 5 10 5H15C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11H9C7.34315 11 6 12.3431 6 14C6 15.6569 7.34315 17 9 17H14C15.6569 17 17 15.6569 17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="17" cy="8" r="1.5" fill="#d97757"/>
              <circle cx="7" cy="14" r="1.5" fill="#d97757"/>
            </svg>
          </div>
          <div>
            <span className="font-sans text-base font-bold text-[#141413] lowercase tracking-tight">
              suiiiiiiii
            </span>
          </div>
        </div>

        {/* Verification Status Pill */}
        <button
          onClick={onOpenVerification}
          className={`hidden sm:flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
            user.verified
              ? 'bg-[#faf9f5] text-emerald-800 border-emerald-300 hover:bg-emerald-50'
              : 'bg-[#f5e3c7] text-[#141413] border-[#cccbc8] hover:bg-[#e3dacc]'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${user.verified ? 'text-emerald-600' : 'text-[#d97757]'}`} />
          <span>{user.verified ? 'Verified Researcher' : 'Unverified (Get Badge)'}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* High-Performance HTTP Search Toggle (Benchmark status) */}
        <button
          onClick={() => setIsHttpAccelerated(!isHttpAccelerated)}
          title="Toggle High-Performance HTTP Search Acceleration (~70x speed mode)"
          className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
            isHttpAccelerated
              ? 'bg-[#141413] text-[#faf9f5] border-[#141413]'
              : 'bg-[#faf9f5] text-[#87867f] border-[#cccbc8] hover:border-[#141413]'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isHttpAccelerated ? 'text-[#d97757] animate-pulse' : ''}`} />
          <span className="hidden md:inline font-medium">HTTP Speed Mode</span>
          <span className="text-[10px] px-1 bg-[#d97757] text-white rounded font-bold">
            {isHttpAccelerated ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl border border-[#cccbc8] bg-[#faf9f5] hover:bg-[#e3dacc] text-[#141413] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d97757] text-white text-[10px] font-sans font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Quick Access */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-[#cccbc8] bg-[#faf9f5] hover:bg-[#e3dacc] transition-colors cursor-pointer"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="hidden lg:inline font-sans text-xs font-semibold text-[#141413]">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
