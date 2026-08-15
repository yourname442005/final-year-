'use client';

import React from 'react';
import { SearchView } from '@/components/views/SearchView';
import { useModals } from '@/components/ClientShell';

export default function SearchPage() {
  const {
    setDetailPaper,
    setCitePaper,
    setAddToColPaper,
    isHttpAccelerated,
    setIsHttpAccelerated
  } = useModals();

  return (
    <SearchView
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
      isHttpAccelerated={isHttpAccelerated}
      setIsHttpAccelerated={setIsHttpAccelerated}
    />
  );
}
