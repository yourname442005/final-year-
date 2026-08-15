export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  venue: string;
  doi: string;
  tags: string[];
  citationCount: number;
  openAccess: boolean;
  pdfUrl?: string;
  relevanceSignal?: 'High' | 'Medium' | 'Low';
  reasoningEvidence?: string;
  aiSummary?: string;
  keyContributions?: string[];
  methodology?: string;
  limitations?: string[];
  researchGaps?: string[];
  citationContext?: string;
}

export interface Researcher {
  id: string;
  name: string;
  title: string;
  institution: string;
  field: string;
  bio: string;
  avatar: string;
  verified: boolean;
  publicationsCount: number;
  citationCount: number;
  hIndex: number;
  followersCount: number;
  interests: string[];
  publications: Paper[];
  isFollowed?: boolean;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorInstitution: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  verified: boolean;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorInstitution: string;
  authorAvatar: string;
  authorVerified: boolean;
  content: string;
  postType: 'Research Update' | 'Preprint Announcement' | 'Methodology Discussion' | 'Dataset Release';
  timestamp: string;
  likes: number;
  linkedPaper?: Paper;
  comments: FeedComment[];
  tags: string[];
  isLiked?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  pinned: boolean;
  paperIds: string[];
  createdDate: string;
  aiSummary?: string;
  shareableLink?: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  status: 'Todo' | 'In Progress' | 'Done';
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  paperId?: string;
  paperTitle?: string;
  updatedAt: string;
  authorName: string;
}

export interface ProjectDataset {
  id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  link: string;
  uploadedDate: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  status: 'Draft' | 'AI Pre-Reviewed' | 'Submitted' | 'Published';
  updatedAt: string;
  aiScore?: number;
}

export interface ProjectDiscussion {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  field: string;
  status: 'Active' | 'Under Review' | 'Archived';
  ownerName: string;
  members: { name: string; role: 'Owner' | 'Editor' | 'Viewer'; email: string; avatar: string }[];
  paperIds: string[];
  notes: ProjectNote[];
  tasks: Task[];
  milestones: Milestone[];
  datasets: ProjectDataset[];
  documents: ProjectDocument[];
  discussions: ProjectDiscussion[];
  activityHistory: { date: string; papersAdded: number; notesCreated: number; tasksCompleted: number }[];
}

export interface NotificationItem {
  id: string;
  type: 'mention' | 'comment' | 'collaboration' | 'paper_update' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  monthlyGrowth: number;
  citationCount: number;
  paperCount: number;
  relatedPaperIds: string[];
  topResearchers: string[];
  aiNarrative: string;
  clusters: string[];
}

export interface ManuscriptSubmission {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  coAuthors: string[];
  venue: string;
  tags: string[];
  year: number;
  fileName: string;
  fileSize: string;
  integrityConfirmed: boolean;
  status: 'Draft' | 'Under AI Review' | 'Submitted' | 'Published' | 'Revision Required';
  submittedAt: string;
  aiReview?: {
    predictedScore: number;
    titleReview: string;
    executiveCritique: string;
    suggestedKeywords: string[];
    likelyPeerQuestions: string[];
    clarityAssessment: string;
    strengths: string[];
    weaknesses: string[];
  };
}

// Initial Seed Data
export const INITIAL_PAPERS: Paper[] = [
  {
    id: 'paper-101',
    title: 'Self-Directing Reasoning Chains in Large Multimodal Transformer Architectures',
    authors: ['Dr. Amara Nwosu', 'Prof. Sebastián Torres', 'Dr. Elena Rostova'],
    abstract: 'We present a novel approach to zero-shot multimodal reasoning wherein transformer layers dynamically allocate computational steps according to task complexity. By introducing a self-directing latent gateway, our architecture achieves 42% latency reduction while boosting multi-step symbolic problem solving on scientific benchmarks.',
    year: 2025,
    venue: 'Journal of Artificial Intelligence Research (JAIR)',
    doi: '10.1016/j.jair.2025.04.012',
    tags: ['Multimodal AI', 'Transformers', 'Reasoning Latency', 'Symbolic Reasoning'],
    citationCount: 142,
    openAccess: true,
    pdfUrl: 'https://arxiv.org/pdf/2504.01234',
    relevanceSignal: 'High',
    reasoningEvidence: 'Matches query on adaptive compute routing and multimodal transformer execution pathways.',
    aiSummary: 'This paper introduces a self-directing latent gateway for multimodal transformers that dynamically calculates necessary reasoning depth per input query. It reduces computational overhead by skipping redundant layers without degradation on complex benchmarks.',
    keyContributions: [
      'Introduced self-directing latent gateways for dynamic depth allocation in transformers.',
      'Achieved a 42% reduction in inference latency across multimodal tasks.',
      'Demonstrated superior performance on 12 multi-step scientific reasoning datasets.',
      'Released open-weights model checkpoint and training dataset.'
    ],
    methodology: 'Evaluated across 10,000 multimodal benchmark prompts using synthetic step-wise computational bounds paired with real-world scientific diagram queries.',
    limitations: [
      'Requires additional GPU memory overhead during training for latent gateway estimation.',
      'Sub-optimal on extremely short single-token classification prompts.'
    ],
    researchGaps: [
      'Long-context temporal reasoning across multi-hour video streams remains untested.',
      'Mathematical convergence proof for dynamic layer skipping is not yet formalized.'
    ],
    citationContext: 'Widely cited as foundational for adaptive neural compute architectures in 2025.'
  },
  {
    id: 'paper-102',
    title: 'High-Throughput Quantum Surface Characterization for Solid-State Battery Cathodes',
    authors: ['Mei Tanaka', 'Prof. Yuki Watanabe', 'Dr. Arthur Pendelton'],
    abstract: 'Interfacial degradation at solid-electrolyte boundaries remains the primary failure mode in lithium-metal batteries. Using automated quantum surface spectroscopy and high-speed atomic density mapping, we identify microscopic phase boundaries that stabilize lattice parameters during ultra-fast charge cycles.',
    year: 2025,
    venue: 'Nature Materials Intelligence',
    doi: '10.1038/s41563-025-01890-w',
    tags: ['Solid State Batteries', 'Quantum Spectroscopy', 'Interfacial Chemistry', 'Materials AI'],
    citationCount: 89,
    openAccess: true,
    pdfUrl: 'https://nature.com/articles/s41563-025-01890-w.pdf',
    relevanceSignal: 'High',
    reasoningEvidence: 'Directly addresses quantum surface spectroscopy and lithium cathode interface stability.',
    aiSummary: 'A high-throughput spectroscopic methodology for mapping degradation in solid-state battery electrolytes. The study demonstrates how atomic doping at phase boundaries prevents dendrite formation under high C-rates.',
    keyContributions: [
      'Developed atomic-resolution surface characterization under operando battery conditions.',
      'Identified doping conditions that suppress solid-electrolyte interphase degradation by 78%.',
      'Created an open-access library of 50,000 quantum spectral profiles.'
    ],
    methodology: 'In-situ synchrotron X-ray reflectivity combined with density functional theory (DFT) atomic modeling.',
    limitations: [
      'Tested primarily on lithium lanthanum zirconium oxide (LLZO) chemistry; generalization to sulfide electrolytes is preliminary.'
    ],
    researchGaps: [
      'Thermal stability under extreme environmental conditions (>85°C) requires further experimentation.'
    ],
    citationContext: 'Seminal paper in solid-state electrolyte interface diagnostics.'
  },
  {
    id: 'paper-103',
    title: 'Epigenetic Reprogramming Mechanisms in Single-Cell Transcriptomic Profiling of Gliomas',
    authors: ['Dr. Fatima Al-Rashid', 'Dr. Marcus Vance', 'Prof. Sebastián Torres'],
    abstract: 'Glioblastoma heterogeneity poses a severe obstacle to targeted immunotherapies. By combining single-cell RNA sequencing with locus-specific chromatin accessibility assays across 120 patient tumor biopsies, we map distinct cell state transitions that drive treatment resistance.',
    year: 2024,
    venue: 'Cell Genomics',
    doi: '10.1016/j.xgen.2024.100512',
    tags: ['Single-Cell Biology', 'Glioma', 'Epigenetics', 'Transcriptomics'],
    citationCount: 230,
    openAccess: false,
    relevanceSignal: 'Medium',
    reasoningEvidence: 'Provides comprehensive transcriptomic cell lineage mapping in glioblastoma tumors.',
    aiSummary: 'This paper uncovers key chromatin opening events that cause glioblastoma stem-like cells to evade anti-EGFR therapies. It provides target pathways for combination epigenetic drugs.',
    keyContributions: [
      'Mapped 150,000 single-cell transcriptomes from primary and recurrent glioblastoma samples.',
      'Identified chromatin remodeling complex target AP-1 as a driver of therapeutic resistance.',
      'Demonstrated pre-clinical synergy between HDAC inhibitors and EGFR targeted agents.'
    ],
    methodology: 'Single-cell ATAC-seq and scRNA-seq integration applied to human patient tissue biopsies.',
    limitations: [
      'Sample cohort skewed toward adult patients; pediatric glioblastoma dynamics were not evaluated.'
    ],
    researchGaps: [
      'In-vivo blood-brain barrier permeability of proposed combination drugs remains to be validated.'
    ]
  },
  {
    id: 'paper-104',
    title: 'Cross-Disciplinary Causal Discovery via Graph Neural Physics Engines',
    authors: ['Dr. Amara Nwosu', 'Prof. Yuki Watanabe'],
    abstract: 'Uncovering non-linear causal relationships in complex dynamical systems requires disentangling observational confounders. We formulate a graph-based neural physics engine that learns invariant conservation laws directly from high-dimensional observational time-series.',
    year: 2026,
    venue: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
    doi: '10.1109/TPAMI.2026.319021',
    tags: ['Causal Inference', 'Graph Neural Networks', 'Physics-Informed AI', 'Dynamical Systems'],
    citationCount: 45,
    openAccess: true,
    relevanceSignal: 'High',
    reasoningEvidence: 'Focuses on graph neural physics engines for causal law extraction from observational data.',
    aiSummary: 'Integrates physics constraints into graph neural network representations to deduce hidden causal graphs from noisy empirical measurements, outperforming classic Granger causality algorithms.',
    keyContributions: [
      'Formulated Hamiltonian invariant regularization for neural graph ODE solvers.',
      'Reduced false causal edge discovery in turbulent flow data by 64%.',
      'Applied to real climate time series and econometric forecasting benchmarks.'
    ],
    methodology: 'Evaluated on chaotic Lorenz attractors, climate sea surface temperature grids, and financial order-book time series.',
    limitations: [
      'Computational cost scales quadratically with graph node count without sparse graph pruning.'
    ],
    researchGaps: [
      'Handling latent unobserved confounders in open non-stationary environments.'
    ]
  },
  {
    id: 'paper-105',
    title: 'Privacy-Preserving Federated Genomics via Multi-Party Homomorphic Encryption',
    authors: ['Dr. Fatima Al-Rashid', 'Dr. Chen Wei'],
    abstract: 'Collaborative genomic studies across international hospitals are severely constrained by privacy regulations. We introduce a secure federated framework leveraging zero-knowledge proofs and vectorized homomorphic encryption that enables multi-center genome-wide association studies without exposing raw patient sequences.',
    year: 2025,
    venue: 'Nature Biotechnology',
    doi: '10.1038/s41587-025-02104-z',
    tags: ['Federated Learning', 'Homomorphic Encryption', 'Genomics Privacy', 'Zero Knowledge'],
    citationCount: 112,
    openAccess: true,
    relevanceSignal: 'Medium',
    reasoningEvidence: 'Details cryptographic protocols for multi-institution genomic analysis.',
    aiSummary: 'Proposes a practical homomorphic encryption protocol for global biobank collaboration. Demonstrates exact allele frequency matching with zero raw sequence leakage.',
    keyContributions: [
      'Designed a zero-knowledge proof validation layer for federated genomic query processing.',
      'Achieved a 15x acceleration in encrypted matrix multiplication for GWAS data.',
      'Executed a live trial across 6 medical centers in North America and Europe.'
    ],
    methodology: 'Vectorized CKKS homomorphic encryption scheme implemented over secure gRPC channels.',
    limitations: [
      'Communication bandwidth requirements scale significantly with biobank cohort size.'
    ],
    researchGaps: [
      'Resilience against long-term quantum decryption threats needs formal evaluation.'
    ]
  }
];

export const INITIAL_RESEARCHERS: Researcher[] = [
  {
    id: 'res-1',
    name: 'Dr. Amara Nwosu',
    title: 'Principal AI Researcher',
    institution: 'Independent Research Institute',
    field: 'Computational Linguistics & AI Reasoning',
    bio: 'Independent researcher focusing on multimodal reasoning architectures, adaptive transformer routing, and causal physics engines. Passionate about open science and accessible AI research.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    verified: true,
    publicationsCount: 24,
    citationCount: 1840,
    hIndex: 18,
    followersCount: 1250,
    interests: ['Multimodal Transformers', 'Causal AI', 'Symbolic Reasoning', 'Open Weights'],
    publications: [INITIAL_PAPERS[0], INITIAL_PAPERS[3]],
    isFollowed: true
  },
  {
    id: 'res-2',
    name: 'Prof. Sebastián Torres',
    title: 'Associate Professor',
    institution: 'University of Barcelona',
    field: 'Biomedical Engineering & Genomics',
    bio: 'Leading research group investigating single-cell transcriptomics, tumor microenvironment heterogeneity, and computational drug discovery.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    verified: true,
    publicationsCount: 68,
    citationCount: 5420,
    hIndex: 34,
    followersCount: 3100,
    interests: ['Single-Cell Biology', 'Cancer Genomics', 'Bioinformatics', 'Precision Medicine'],
    publications: [INITIAL_PAPERS[0], INITIAL_PAPERS[2]],
    isFollowed: false
  },
  {
    id: 'res-3',
    name: 'Mei Tanaka',
    title: 'PhD Candidate',
    institution: 'University of Melbourne',
    field: 'Materials Science & Quantum Spectroscopy',
    bio: 'Conducting doctoral research on solid-state battery electrolyte degradation using operando atomic density spectroscopy and high-speed DFT modeling.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    verified: true,
    publicationsCount: 9,
    citationCount: 210,
    hIndex: 7,
    followersCount: 680,
    interests: ['Solid State Physics', 'Quantum Materials', 'Battery Technology', 'Synchrotron Optics'],
    publications: [INITIAL_PAPERS[1]],
    isFollowed: true
  },
  {
    id: 'res-4',
    name: 'Dr. Fatima Al-Rashid',
    title: 'Senior Cryptographer & Bio-IT Specialist',
    institution: 'King Abdullah University of Science and Technology',
    field: 'Privacy-Preserving Systems & Genomics',
    bio: 'Specializing in homomorphic encryption protocols, multi-party computation, and secure cross-institution healthcare biobanks.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    verified: true,
    publicationsCount: 31,
    citationCount: 2150,
    hIndex: 21,
    followersCount: 1420,
    interests: ['Homomorphic Encryption', 'Zero-Knowledge Proofs', 'Genomic Privacy', 'Federated Learning'],
    publications: [INITIAL_PAPERS[2], INITIAL_PAPERS[4]],
    isFollowed: false
  },
  {
    id: 'res-5',
    name: 'Prof. Yuki Watanabe',
    title: 'Research Director',
    institution: 'Tokyo Institute of Technology',
    field: 'Quantum Condensed Matter & AI for Science',
    bio: 'Overseeing multi-lab physical simulation programs combining neural ODEs with operando materials diagnostics.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    verified: true,
    publicationsCount: 112,
    citationCount: 9850,
    hIndex: 48,
    followersCount: 4200,
    interests: ['Condensed Matter', 'AI for Science', 'Spectroscopy', 'Quantum Computing'],
    publications: [INITIAL_PAPERS[1], INITIAL_PAPERS[3]],
    isFollowed: false
  }
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'res-1',
    authorName: 'Dr. Amara Nwosu',
    authorTitle: 'Principal AI Researcher',
    authorInstitution: 'Independent Research Institute',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: 'We just released our benchmark findings on self-directing latent gateways! By dynamically adjusting layer depth based on symbolic query complexity, we were able to cut inference latency by 42% on multimodal reasoning tasks without losing accuracy.',
    postType: 'Research Update',
    timestamp: '2 hours ago',
    likes: 84,
    linkedPaper: INITIAL_PAPERS[0],
    tags: ['Multimodal AI', 'Open Science', 'Inference Efficiency'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Prof. Sebastián Torres',
        authorInstitution: 'University of Barcelona',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        content: 'Fascinating work Amara! How does the gateway handle noisy visual inputs during medical image classification?',
        timestamp: '1 hour ago',
        verified: true
      },
      {
        id: 'c-2',
        authorName: 'Mei Tanaka',
        authorInstitution: 'University of Melbourne',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        content: 'Super impressive latency savings. Will check if we can adapt this for our DFT spectral processing pipeline.',
        timestamp: '45 mins ago',
        verified: true
      }
    ],
    isLiked: false
  },
  {
    id: 'post-2',
    authorId: 'res-3',
    authorName: 'Mei Tanaka',
    authorTitle: 'PhD Candidate',
    authorInstitution: 'University of Melbourne',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: 'Excited to announce that our Nature Materials paper on quantum surface spectroscopy for solid-state cathodes is officially published! Huge thanks to Prof. Watanabe and the entire team for 18 months of intensive synchrotron experiments.',
    postType: 'Preprint Announcement',
    timestamp: '1 day ago',
    likes: 142,
    linkedPaper: INITIAL_PAPERS[1],
    tags: ['Solid State Batteries', 'Quantum Spectroscopy', 'Nature Materials'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Dr. Fatima Al-Rashid',
        authorInstitution: 'KAUST',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        content: 'Congratulations Mei! Essential findings for next-gen energy storage.',
        timestamp: '18 hours ago',
        verified: true
      }
    ],
    isLiked: true
  },
  {
    id: 'post-3',
    authorId: 'res-4',
    authorName: 'Dr. Fatima Al-Rashid',
    authorTitle: 'Senior Cryptographer',
    authorInstitution: 'KAUST',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: 'A quick note on homomorphic encryption in international biobanks: zero-knowledge proof verification must precede vector multiplication, or malicious node queries can leak gradient norms. Check out section 3 of our latest publication for implementation details.',
    postType: 'Methodology Discussion',
    timestamp: '2 days ago',
    likes: 67,
    linkedPaper: INITIAL_PAPERS[4],
    tags: ['Genomics Privacy', 'Cryptography', 'Federated Learning'],
    comments: [],
    isLiked: false
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Adaptive Compute & Transformers',
    description: 'Papers investigating dynamic layer routing, latent reasoning gateways, and transformer inference acceleration.',
    pinned: true,
    paperIds: ['paper-101', 'paper-104'],
    createdDate: '2026-07-15',
    aiSummary: 'Collection focused on adaptive compute algorithms in machine learning, demonstrating how neural networks dynamically scale parameter evaluation based on input complexity.',
    shareableLink: 'https://ai.studio/collections/col-1?share=token98123'
  },
  {
    id: 'col-2',
    name: 'Quantum Materials & Spectroscopy',
    description: 'Literature on operando surface spectroscopy, solid-state energy storage, and DFT atomic density characterization.',
    pinned: true,
    paperIds: ['paper-102'],
    createdDate: '2026-08-01',
    aiSummary: 'Curated papers covering atomic-scale battery electrolyte interface diagnostics and high-throughput spectral analysis.',
    shareableLink: 'https://ai.studio/collections/col-2?share=token44129'
  },
  {
    id: 'col-3',
    name: 'Single-Cell Genomics & Healthcare Privacy',
    description: 'Methods for federated biobank studies, homomorphic encryption, and tumor transcriptomic cell state mapping.',
    pinned: false,
    paperIds: ['paper-103', 'paper-105'],
    createdDate: '2026-08-05',
    aiSummary: 'Research exploring secure genomic computation across multi-center medical research networks.',
    shareableLink: 'https://ai.studio/collections/col-3?share=token55812'
  }
];

export const INITIAL_PROJECTS: WorkspaceProject[] = [
  {
    id: 'proj-1',
    name: 'Multimodal Latent Gateway Architecture',
    description: 'Developing open-source adaptive compute gateways for large multimodal vision-language models.',
    field: 'Computer Science / Artificial Intelligence',
    status: 'Active',
    ownerName: 'Dr. Amara Nwosu',
    members: [
      { name: 'Dr. Amara Nwosu', role: 'Owner', email: 'amara@research.org', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
      { name: 'Prof. Sebastián Torres', role: 'Editor', email: 's.torres@ub.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
      { name: 'Mei Tanaka', role: 'Viewer', email: 'mei.t@melbourne.edu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' }
    ],
    paperIds: ['paper-101', 'paper-104'],
    notes: [
      {
        id: 'note-1',
        title: 'Latent Gateway Benchmark Notes',
        content: 'Observed significant speedups on multi-step reasoning. Key bottleneck occurs when visual embeddings contain high frequency noise. Need to add a smoothing conv layer.',
        paperId: 'paper-101',
        paperTitle: 'Self-Directing Reasoning Chains in Large Multimodal Transformer Architectures',
        updatedAt: '2026-08-09',
        authorName: 'Dr. Amara Nwosu'
      },
      {
        id: 'note-2',
        title: 'Causal Graph Physics Engine Integration',
        content: 'Reviewing paper-104 for gradient invariance formulations. Can we apply graph ODEs to parameter allocation?',
        paperId: 'paper-104',
        paperTitle: 'Cross-Disciplinary Causal Discovery via Graph Neural Physics Engines',
        updatedAt: '2026-08-02',
        authorName: 'Prof. Sebastián Torres'
      }
    ],
    tasks: [
      { id: 't-1', title: 'Prepare 10k synthetic benchmark prompt evaluation set', assigneeName: 'Dr. Amara Nwosu', assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', dueDate: '2026-08-15', status: 'Done' },
      { id: 't-2', title: 'Execute operando noise stress test on multimodal gateway', assigneeName: 'Prof. Sebastián Torres', assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', dueDate: '2026-08-20', status: 'In Progress' },
      { id: 't-3', title: 'Draft pre-review manuscript for Nature Machine Intelligence', assigneeName: 'Dr. Amara Nwosu', assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', dueDate: '2026-09-01', status: 'Todo' }
    ],
    milestones: [
      { id: 'm-1', title: 'Architecture RFC Specification Complete', date: '2026-07-01', completed: true },
      { id: 'm-2', title: 'Initial Model Checkpoint Released', date: '2026-08-01', completed: true },
      { id: 'm-3', title: 'Journal Manuscript Pre-Review & Submission', date: '2026-09-15', completed: false }
    ],
    datasets: [
      { id: 'd-1', name: 'MultimodalReasoning-10K.json', description: 'Curated 10,000 multi-step scientific reasoning prompts with diagram pairs.', size: '420 MB', format: 'JSON / Parquet', link: 'https://huggingface.co/datasets/multimodal-reasoning-10k', uploadedDate: '2026-07-28' }
    ],
    documents: [
      { id: 'doc-1', title: 'Draft_Multimodal_Latent_Gateways_v2.pdf', status: 'AI Pre-Reviewed', updatedAt: '2026-08-10', aiScore: 88 }
    ],
    discussions: [
      { id: 'disc-1', authorName: 'Prof. Sebastián Torres', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', content: 'Reviewed the v2 draft. The clarity on computational bounds is much improved!', timestamp: 'Yesterday at 4:15 PM' },
      { id: 'disc-2', authorName: 'Dr. Amara Nwosu', authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', content: 'Thanks Sebastián! Running the AI pre-review analyzer now to check likely reviewer questions.', timestamp: 'Today at 9:30 AM' }
    ],
    activityHistory: [
      { date: 'Mon', papersAdded: 2, notesCreated: 1, tasksCompleted: 1 },
      { date: 'Tue', papersAdded: 1, notesCreated: 2, tasksCompleted: 2 },
      { date: 'Wed', papersAdded: 3, notesCreated: 0, tasksCompleted: 1 },
      { date: 'Thu', papersAdded: 0, notesCreated: 3, tasksCompleted: 2 },
      { date: 'Fri', papersAdded: 4, notesCreated: 1, tasksCompleted: 3 },
      { date: 'Sat', papersAdded: 1, notesCreated: 0, tasksCompleted: 0 },
      { date: 'Sun', papersAdded: 2, notesCreated: 1, tasksCompleted: 1 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'collaboration',
    title: 'Project Invitation',
    message: 'Prof. Sebastián Torres invited you to collaborate on "Multimodal Latent Gateway Architecture".',
    timestamp: '10 mins ago',
    read: false,
    link: '/workspace/proj-1'
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New Comment on Research Update',
    message: 'Mei Tanaka commented on your post "We just released our benchmark findings..."',
    timestamp: '45 mins ago',
    read: false,
    link: '/'
  },
  {
    id: 'notif-3',
    type: 'verification',
    title: 'Researcher Verification Active',
    message: 'Your researcher profile is verified. You have full publishing access.',
    timestamp: '1 day ago',
    read: true,
    link: '/settings/verification'
  },
  {
    id: 'notif-4',
    type: 'paper_update',
    title: 'Citation Count Updated',
    message: 'Your paper "Self-Directing Reasoning Chains..." reached 142 citations.',
    timestamp: '2 days ago',
    read: true,
    link: '/discover/papers/paper-101'
  }
];

export const INITIAL_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'trend-1',
    name: 'Adaptive Latent Compute in Transformers',
    category: 'Computer Science',
    monthlyGrowth: 148,
    citationCount: 4120,
    paperCount: 86,
    relatedPaperIds: ['paper-101', 'paper-104'],
    topResearchers: ['Dr. Amara Nwosu', 'Prof. Yuki Watanabe'],
    aiNarrative: 'Research interest in dynamic depth allocation and dynamic token skipping has surged by 148% this quarter as laboratory budgets prioritize inference cost optimization for reasoning models.',
    clusters: ['Dynamic Compute', 'Latent Routing', 'Transformer Optimization', 'Zero-Shot Reasoning']
  },
  {
    id: 'trend-2',
    name: 'Operando Quantum Battery Spectroscopy',
    category: 'Materials Science',
    monthlyGrowth: 94,
    citationCount: 2890,
    paperCount: 54,
    relatedPaperIds: ['paper-102'],
    topResearchers: ['Mei Tanaka', 'Prof. Yuki Watanabe'],
    aiNarrative: 'In-situ synchrotron characterization of solid-state lithium interphase degradation is driving breakthroughs in dendrite suppression for electric aviation and long-duration storage.',
    clusters: ['Solid State Batteries', 'Synchrotron Optics', 'Interfacial Chemistry', 'Atomic Spectrometry']
  },
  {
    id: 'trend-3',
    name: 'Privacy-Preserving Federated Biobanks',
    category: 'Bioinformatics & Privacy',
    monthlyGrowth: 72,
    citationCount: 3100,
    paperCount: 62,
    relatedPaperIds: ['paper-103', 'paper-105'],
    topResearchers: ['Dr. Fatima Al-Rashid', 'Prof. Sebastián Torres'],
    aiNarrative: 'Homomorphic encryption coupled with zero-knowledge verification is enabling cross-border genomic studies without raw sequence disclosure across 12 biobanks worldwide.',
    clusters: ['Homomorphic Encryption', 'Zero-Knowledge Proofs', 'GWAS Privacy', 'Federated AI']
  }
];

export const INITIAL_MANUSCRIPTS: ManuscriptSubmission[] = [
  {
    id: 'ms-1',
    title: 'Self-Directing Latent Gateways for Zero-Shot Reasoning in Vision-Language Models',
    abstract: 'We introduce a dynamic routing layer that evaluates query difficulty prior to dense transformer block execution, saving 42% computational overhead in scientific benchmarks.',
    authors: ['Dr. Amara Nwosu', 'Prof. Sebastián Torres'],
    coAuthors: ['Dr. Elena Rostova'],
    venue: 'Journal of Artificial Intelligence Research',
    tags: ['Multimodal AI', 'Transformers', 'Inference Acceleration'],
    year: 2026,
    fileName: 'Multimodal_Latent_Gateways_Manuscript.pdf',
    fileSize: '4.8 MB',
    integrityConfirmed: true,
    status: 'Published',
    submittedAt: '2026-07-20',
    aiReview: {
      predictedScore: 92,
      titleReview: 'Highly clear and informative title. Strong keyword representation for indexing.',
      executiveCritique: 'The paper presents a solid empirical contribution to inference efficiency. Mathematical proofs for the latent routing function are well-structured, though ablation studies on ultra-dense 70B+ parameter checkpoints could strengthen the final publication.',
      suggestedKeywords: ['Dynamic Compute', 'Latent Gateways', 'Multimodal Transformers', 'Efficiency'],
      likelyPeerQuestions: [
        'How does the latent gateway perform when input visual data contains heavy noise or compression artifacts?',
        'What is the memory footprint overhead of maintaining the routing gateway weights during fine-tuning?'
      ],
      clarityAssessment: 'Excellent readability. Figures 3 and 4 clearly illustrate the computational pipeline.',
      strengths: ['Strong empirical results (42% speedup)', 'Well-documented dataset release', 'Clear baseline comparisons'],
      weaknesses: ['Limited evaluation on audio-only modalities']
    }
  }
];
