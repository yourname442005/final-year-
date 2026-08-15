'use client';

import React from 'react';
import { FeedView } from '@/components/views/FeedView';
import { useModals } from '@/components/ClientShell';

export default function FeedPage() {
  const { setDetailPaper, setCitePaper, setAddToColPaper, setIsNewPostOpen } = useModals();

  return (
    <FeedView
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
      onOpenNewPost={() => setIsNewPostOpen(true)}
    />
  );
}
