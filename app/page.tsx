'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Hero } from '@/components/landing/Hero';
import { WhatIsSection } from '@/components/landing/WhatIsSection';
import { CapabilitiesSection } from '@/components/landing/CapabilitiesSection';
import { SemanticSearchSection } from '@/components/landing/SemanticSearchSection';
import { ResearchIntelligenceSection } from '@/components/landing/ResearchIntelligenceSection';
import { WorkspacePreviewSection } from '@/components/landing/WorkspacePreviewSection';
import { KnowledgeNetworkSection } from '@/components/landing/KnowledgeNetworkSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BuildersSection } from '@/components/landing/BuildersSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { AccessPricingSection } from '@/components/landing/AccessPricingSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-serif selection:bg-[#F5F5F3] selection:text-[#111111]">
      <LandingNavbar />
      <main>
        <Hero />
        <WhatIsSection />
        <CapabilitiesSection />
        <SemanticSearchSection />
        <ResearchIntelligenceSection />
        <WorkspacePreviewSection />
        <KnowledgeNetworkSection />
        <HowItWorksSection />
        <BuildersSection />
        <TrustSection />
        <AccessPricingSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
