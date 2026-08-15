'use client';

import React from 'react';
import { CollectionsView } from '@/components/views/CollectionsView';
import { useModals } from '@/components/ClientShell';

export default function CollectionsPage() {
  const { setDetailPaper, setCitePaper, setAddToColPaper } = useModals();

  return (
    <CollectionsView
      onOpenPaperDetail={setDetailPaper}
      onOpenCite={setCitePaper}
      onOpenAddToCollection={setAddToColPaper}
    />
  );
}
