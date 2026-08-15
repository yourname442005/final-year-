'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { PaperCard } from '@/components/PaperCard';

// Modals
import { PaperDetailModal } from '@/components/PaperDetailModal';
import { CiteModal } from '@/components/CiteModal';
import { AddToCollectionModal } from '@/components/AddToCollectionModal';
import { NewPostModal } from '@/components/NewPostModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { NewManuscriptModal } from '@/components/NewManuscriptModal';
import { VerificationModal } from '@/components/VerificationModal';

// Views
import { FeedView } from '@/components/views/FeedView';
import { SearchView } from '@/components/views/SearchView';
import { DiscoverView } from '@/components/views/DiscoverView';
import { WorkspaceView } from '@/components/views/WorkspaceView';
import { CollectionsView } from '@/components/views/CollectionsView';
import { SavedPapersView } from '@/components/views/SavedPapersView';
import { NetworkView } from '@/components/views/NetworkView';
import { TrendingView } from '@/components/views/TrendingView';
import { NotificationsView } from '@/components/views/NotificationsView';
import { PublishView } from '@/components/views/PublishView';
import { SettingsView } from '@/components/views/SettingsView';

import { Paper } from '@/lib/mock-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [isHttpAccelerated, setIsHttpAccelerated] = useState<boolean>(true);

  // Modals state
  const [detailPaper, setDetailPaper] = useState<Paper | null>(null);
  const [citePaper, setCitePaper] = useState<Paper | null>(null);
  const [addToColPaper, setAddToColPaper] = useState<Paper | null>(null);

  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [isNewManuscriptOpen, setIsNewManuscriptOpen] = useState<boolean>(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col font-serif selection:bg-[#f5e3c7]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenVerification={() => setIsVerificationOpen(true)}
        isHttpAccelerated={isHttpAccelerated}
        setIsHttpAccelerated={setIsHttpAccelerated}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          onOpenNewPost={() => setIsNewPostOpen(true)}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenNewManuscript={() => setIsNewManuscriptOpen(true)}
        />

        {/* Central Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0">
          {activeTab === 'feed' && (
            <FeedView
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
              onOpenNewPost={() => setIsNewPostOpen(true)}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
              isHttpAccelerated={isHttpAccelerated}
              setIsHttpAccelerated={setIsHttpAccelerated}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverView
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
            />
          )}

          {activeTab === 'workspace' && (
            <WorkspaceView
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
            />
          )}

          {activeTab === 'collections' && (
            <CollectionsView
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
            />
          )}

          {activeTab === 'saved' && (
            <SavedPapersView
              onOpenPaperDetail={setDetailPaper}
              onOpenCite={setCitePaper}
              onOpenAddToCollection={setAddToColPaper}
            />
          )}

          {activeTab === 'network' && <NetworkView />}

          {activeTab === 'trending' && <TrendingView />}

          {activeTab === 'notifications' && <NotificationsView />}

          {activeTab === 'publish' && (
            <PublishView
              onOpenNewManuscript={() => setIsNewManuscriptOpen(true)}
              onOpenVerification={() => setIsVerificationOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView onOpenVerification={() => setIsVerificationOpen(true)} />
          )}
        </main>
      </div>

      {/* Overlays and Modals */}

      {/* 1. Paper Detail Modal */}
      <PaperDetailModal
        paper={detailPaper}
        onClose={() => setDetailPaper(null)}
        onOpenCite={setCitePaper}
        onOpenAddToCollection={setAddToColPaper}
        onSelectRelatedPaper={setDetailPaper}
      />

      {/* 2. Cite Modal */}
      <CiteModal
        paper={citePaper}
        onClose={() => setCitePaper(null)}
      />

      {/* 3. Add To Collection Modal */}
      <AddToCollectionModal
        paper={addToColPaper}
        onClose={() => setAddToColPaper(null)}
      />

      {/* 4. New Research Post Modal */}
      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onOpenVerificationModal={() => setIsVerificationOpen(true)}
      />

      {/* 5. New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />

      {/* 6. New Manuscript Submission Modal */}
      <NewManuscriptModal
        isOpen={isNewManuscriptOpen}
        onClose={() => setIsNewManuscriptOpen(false)}
        onOpenVerificationModal={() => setIsVerificationOpen(true)}
      />

      {/* 7. Verification Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />

    </div>
  );
}
