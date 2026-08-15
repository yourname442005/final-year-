'use client';

import React from 'react';
import { WorkspaceView } from '@/components/views/WorkspaceView';
import { useModals } from '@/components/ClientShell';

export default function WorkspacePage() {
  const { setIsNewProjectOpen, setDetailPaper, setCitePaper, setAddToColPaper } = useModals();

  return (
    <WorkspaceView
      onOpenNewProject={() => setIsNewProjectOpen(true)}
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
    />
  );
}
