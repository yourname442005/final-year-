'use client';

import React, { createContext, useContext, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Paper } from '@/lib/mock-data';

// Modals
import { PaperDetailModal } from '@/components/PaperDetailModal';
import { CiteModal } from '@/components/CiteModal';
import { AddToCollectionModal } from '@/components/AddToCollectionModal';
import { NewPostModal } from '@/components/NewPostModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { NewManuscriptModal } from '@/components/NewManuscriptModal';
import { VerificationModal } from '@/components/VerificationModal';

interface ModalContextType {
  detailPaper: Paper | null;
  setDetailPaper: (paper: Paper | null) => void;
  citePaper: Paper | null;
  setCitePaper: (paper: Paper | null) => void;
  addToColPaper: Paper | null;
  setAddToColPaper: (paper: Paper | null) => void;
  isNewPostOpen: boolean;
  setIsNewPostOpen: (open: boolean) => void;
  isNewProjectOpen: boolean;
  setIsNewProjectOpen: (open: boolean) => void;
  isNewManuscriptOpen: boolean;
  setIsNewManuscriptOpen: (open: boolean) => void;
  isVerificationOpen: boolean;
  setIsVerificationOpen: (open: boolean) => void;
  isHttpAccelerated: boolean;
  setIsHttpAccelerated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within ClientShell');
  }
  return context;
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [detailPaper, setDetailPaper] = useState<Paper | null>(null);
  const [citePaper, setCitePaper] = useState<Paper | null>(null);
  const [addToColPaper, setAddToColPaper] = useState<Paper | null>(null);

  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [isNewManuscriptOpen, setIsNewManuscriptOpen] = useState<boolean>(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [isHttpAccelerated, setIsHttpAccelerated] = useState<boolean>(true);

  return (
    <ModalContext.Provider
      value={{
        detailPaper,
        setDetailPaper,
        citePaper,
        setCitePaper,
        addToColPaper,
        setAddToColPaper,
        isNewPostOpen,
        setIsNewPostOpen,
        isNewProjectOpen,
        setIsNewProjectOpen,
        isNewManuscriptOpen,
        setIsNewManuscriptOpen,
        isVerificationOpen,
        setIsVerificationOpen,
        isHttpAccelerated,
        setIsHttpAccelerated
      }}
    >
      <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col font-serif selection:bg-[#f5e3c7]">
        {/* Top Navbar */}
        <Navbar
          onOpenVerification={() => setIsVerificationOpen(true)}
          isHttpAccelerated={isHttpAccelerated}
          setIsHttpAccelerated={setIsHttpAccelerated}
        />

        {/* Main Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar
            onOpenNewPost={() => setIsNewPostOpen(true)}
            onOpenNewProject={() => setIsNewProjectOpen(true)}
            onOpenNewManuscript={() => setIsNewManuscriptOpen(true)}
          />

          {/* Central Viewport Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0">
            {children}
          </main>
        </div>

        {/* Overlays and Modals */}
        <PaperDetailModal
          paper={detailPaper}
          onClose={() => setDetailPaper(null)}
          onOpenCite={setCitePaper}
          onOpenAddToCollection={setAddToColPaper}
          onSelectRelatedPaper={setDetailPaper}
        />

        <CiteModal
          paper={citePaper}
          onClose={() => setCitePaper(null)}
        />

        <AddToCollectionModal
          paper={addToColPaper}
          onClose={() => setAddToColPaper(null)}
        />

        <NewPostModal
          isOpen={isNewPostOpen}
          onClose={() => setIsNewPostOpen(false)}
          onOpenVerificationModal={() => setIsVerificationOpen(true)}
        />

        <NewProjectModal
          isOpen={isNewProjectOpen}
          onClose={() => setIsNewProjectOpen(false)}
        />

        <NewManuscriptModal
          isOpen={isNewManuscriptOpen}
          onClose={() => setIsNewManuscriptOpen(false)}
          onOpenVerificationModal={() => setIsVerificationOpen(true)}
        />

        <VerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
        />
      </div>
    </ModalContext.Provider>
  );
}
