'use client';

import React from 'react';
import { DiscoverView } from '@/components/views/DiscoverView';
import { useModals } from '@/components/ClientShell';

export default function DiscoverPage() {
  const { setDetailPaper, setCitePaper, setAddToColPaper } = useModals();

  return (
    <DiscoverView
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
    />
  );
}
