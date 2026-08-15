'use client';

import React from 'react';
import { Search, Compass, FolderKanban, Clock, Users, Upload } from 'lucide-react';
import { CardHoverEffect, CardItem } from './CardHoverEffect';

const capabilities: CardItem[] = [
  {
    title: 'AI Semantic Search',
    description: 'Search literature by deep conceptual meanings, mathematical derivations, and technical queries beyond simple keyword matching.',
    icon: Search,
    badge: 'Vector Engine'
  },
  {
    title: 'Paper Discovery',
    description: 'Uncover connected papers, citation trajectories, and related methodological breakthroughs across sub-disciplines.',
    icon: Compass,
    badge: 'Taxonomy'
  },
  {
    title: 'Research Workspace',
    description: 'Organize research projects with task pipelines, dataset linkages, formula derivations, and co-author workspace invitations.',
    icon: FolderKanban,
    badge: 'Collaboration'
  },
  {
    title: 'Time Allocation Analytics',
    description: 'Visualize how your research hours are distributed across active papers with horizontal time-investment bar charts.',
    icon: Clock,
    badge: 'Analytics'
  },
  {
    title: 'Researcher Network',
    description: 'Connect with principal investigators, track citation alerts, and follow field research updates across global institutions.',
    icon: Users,
    badge: 'Network'
  },
  {
    title: 'Manuscript Publishing',
    description: 'Prepare manuscript submissions, request peer verification badges, and generate automated AI pre-review manuscript diagnostics.',
    icon: Upload,
    badge: 'Publishing'
  }
];

export const CapabilitiesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#FFFFFF] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
            Core Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight">
            Engineered for scientific rigor & clarity
          </h2>
          <p className="font-serif text-sm text-[#8A8A84] leading-relaxed">
            Every feature in suiiiiiiii is built around actual research workflows—from initial discovery to publication.
          </p>
        </div>

        {/* CardHoverEffect Grid */}
        <CardHoverEffect items={capabilities} />
      </div>
    </section>
  );
};
