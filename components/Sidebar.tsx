'use client';

import React from 'react';
import {
  Rss,
  Search,
  Compass,
  FolderKanban,
  Bookmark,
  Library,
  Users,
  TrendingUp,
  Upload,
  Settings,
  Sparkles,
  Plus
} from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenNewPost: () => void;
  onOpenNewProject: () => void;
  onOpenNewManuscript: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  onOpenNewPost,
  onOpenNewProject,
  onOpenNewManuscript
}) => {
  const { user } = usePlatformStore();

  const navItems = [
    { id: 'feed', label: 'Research Feed', icon: Rss, badge: null },
    { id: 'search', label: 'AI Semantic Search', icon: Search, badge: null },
    { id: 'discover', label: 'Paper Discovery', icon: Compass, badge: null },
    { id: 'workspace', label: 'Research Workspace', icon: FolderKanban, badge: null },
    { id: 'collections', label: 'Collections', icon: Bookmark, badge: null },
    { id: 'saved', label: 'Saved Papers', icon: Library, badge: null },
    { id: 'network', label: 'Researcher Network', icon: Users, badge: null },
    { id: 'trending', label: 'Trending Research', icon: TrendingUp, badge: null },
    { id: 'publish', label: 'Paper Publishing', icon: Upload, badge: user.verified ? 'Verified' : null },
    { id: 'settings', label: 'Settings & Profile', icon: Settings, badge: null }
  ];

  return (
    <>
      {/* Desktop & Tablet Compact Icon-First Sidebar Rail */}
      <aside className="hidden md:block w-[68px] shrink-0 min-h-[calc(100vh-61px)] relative z-30">
        <div className="absolute top-0 left-0 bottom-0 w-[68px] hover:w-64 lg:hover:w-72 transition-all duration-200 ease-in-out bg-[#f0eee6] border-r border-[#cccbc8] p-3 flex flex-col justify-between overflow-x-hidden group/sidebar shadow-none hover:shadow-xl z-30">
          
          {/* Navigation Section */}
          <div className="space-y-4">
            
            {/* Top Branding Mark */}
            <div
              onClick={() => onNavigate('feed')}
              className="flex items-center gap-3 cursor-pointer group/logo py-1 px-1 border-b border-[#cccbc8]/60 pb-3"
              title="suiiiiiiii"
            >
              <div className="w-9 h-9 rounded-xl bg-[#141413] text-[#faf9f5] flex items-center justify-center shrink-0 group-hover/logo:bg-[#d97757] transition-colors">
                <svg className="w-5 h-5 text-[#faf9f5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 8C7 6.34315 8.34315 5 10 5H15C16.6569 5 18 6.34315 18 8C18 9.65685 16.6569 11 15 11H9C7.34315 11 6 12.3431 6 14C6 15.6569 7.34315 17 9 17H14C15.6569 17 17 15.6569 17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="17" cy="8" r="1.5" fill="#d97757"/>
                  <circle cx="7" cy="14" r="1.5" fill="#d97757"/>
                </svg>
              </div>
              <span className="font-sans text-base font-bold text-[#141413] lowercase tracking-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                suiiiiiiii
              </span>
            </div>

            {/* Quick Action CTAs */}
            <div className="space-y-2">
              <button
                onClick={onOpenNewPost}
                title="New Research Update"
                className="w-full btn-clay py-2 px-2 text-xs font-sans flex items-center justify-center gap-2 shadow-xs cursor-pointer rounded-xl"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                  New Research Update
                </span>
              </button>

              <div className="hidden group-hover/sidebar:grid group-hover/sidebar:grid-cols-2 gap-1.5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                <button
                  onClick={onOpenNewProject}
                  className="btn-outlined-dark py-1.5 px-2 text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer"
                  title="Create Workspace Project"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
                  <span className="whitespace-nowrap">Project</span>
                </button>

                <button
                  onClick={onOpenNewManuscript}
                  className="btn-outlined-dark py-1.5 px-2 text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer"
                  title="Submit Manuscript"
                >
                  <Upload className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
                  <span className="whitespace-nowrap">Manuscript</span>
                </button>
              </div>
            </div>

            {/* Nav List */}
            <nav className="space-y-1">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#87867f] px-2 block mb-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Platform Modules
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={item.label}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl font-sans text-xs font-medium transition-all cursor-pointer group/item ${
                      isActive
                        ? 'bg-[#141413] text-[#faf9f5] font-semibold'
                        : 'text-[#141413] hover:bg-[#e3dacc]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#d97757]' : 'text-[#87867f] group-hover/item:text-[#141413]'}`} />
                        {item.badge !== null && (
                          <span className="group-hover/sidebar:hidden absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#d97757]" />
                        )}
                      </div>
                      <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-200 translate-x-1 group-hover/sidebar:translate-x-0">
                        {item.label}
                      </span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 ${
                          isActive
                            ? 'bg-[#d97757] text-white'
                            : 'bg-[#e3dacc] text-[#141413]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Paper-like Note */}
          <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-2xl p-3 space-y-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#d97757] block whitespace-nowrap">
              Scientific Field Journal
            </span>
            <p className="font-serif text-xs text-[#141413]/90 leading-snug">
              Research intelligence flows across discovery, organization, collaboration, and publication.
            </p>
          </div>

        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f0eee6] border-t border-[#cccbc8] px-2 py-2 flex items-center justify-around">
        {[
          { id: 'feed', label: 'Feed', icon: Rss },
          { id: 'search', label: 'Search', icon: Search },
          { id: 'discover', label: 'Papers', icon: Compass },
          { id: 'workspace', label: 'Workspace', icon: FolderKanban },
          { id: 'publish', label: 'Publish', icon: Upload }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-sans font-medium transition-colors ${
                isActive ? 'text-[#d97757] font-bold' : 'text-[#87867f]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
