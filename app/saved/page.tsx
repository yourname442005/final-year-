'use client';

import React from 'react';
import { SavedPapersView } from '@/components/views/SavedPapersView';
import { useModals } from '@/components/ClientShell';

export default function SavedPage() {
  const { setDetailPaper, setCitePaper, setAddToColPaper } = useModals();

  return (
    <SavedPapersView
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
    />
  );
}
