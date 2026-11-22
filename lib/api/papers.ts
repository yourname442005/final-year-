import { api } from './client';

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

export interface PaperFilters {
  q?: string;
  tag?: string;
  year?: number;
  minCitations?: number;
  openAccess?: boolean;
  sort?: 'relevance' | 'citations' | 'newest' | 'year';
}

export interface CitationOut {
  format: string;
  citation: string;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  nextCursor?: string | null;
}

export const papersApi = {
  list: (filters?: PaperFilters) =>
    api.get<PageResponse<Paper>>('/api/v1/papers', { params: filters as Record<string, string | number | boolean> }),

  get: (id: string) => api.get<Paper>(`/api/v1/papers/${id}`),

  getRelated: (id: string) => api.get<Paper[]>(`/api/v1/papers/${id}/related`),

  getCitation: (id: string, format: string = 'APA') =>
    api.get<CitationOut>(`/api/v1/papers/${id}/citation`, { params: { format } }),

  save: (id: string) => api.post<{ ok: boolean }>(`/api/v1/papers/${id}/save`),

  unsave: (id: string) => api.delete<{ ok: boolean }>(`/api/v1/papers/${id}/save`),

  getSaved: () => api.get<PageResponse<Paper>>('/api/v1/saved'),

  getTags: () => api.get<string[]>('/api/v1/papers/tags'),

  aiAnalysis: (id: string) => api.post<Paper>(`/api/v1/papers/${id}/ai-analysis`),
};
