'use client';

import React from 'react';
import { PublishView } from '@/components/views/PublishView';
import { useModals } from '@/components/ClientShell';

export default function PublishPage() {
  const { setIsNewManuscriptOpen, setIsVerificationOpen } = useModals();

  return (
    <PublishView
      onOpenNewManuscript={() => setIsNewManuscriptOpen(true)}
      onOpenVerification={() => setIsVerificationOpen(true)}
    />
  );
}
