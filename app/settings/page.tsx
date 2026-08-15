'use client';

import React from 'react';
import { SettingsView } from '@/components/views/SettingsView';
import { useModals } from '@/components/ClientShell';

export default function SettingsPage() {
  const { setIsVerificationOpen } = useModals();

  return <SettingsView onOpenVerification={() => setIsVerificationOpen(true)} />;
}
