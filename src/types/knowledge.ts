/**
 * Halcyon — Knowledge Base Types
 * 
 * Data structures for the AI memory engine and knowledge retrieval system.
 */

export type KnowledgeCategory =
  | 'KUBERNETES'
  | 'AWS'
  | 'DATABASE'
  | 'JVM'
  | 'NETWORKING'
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'STORAGE'
  | 'CI_CD'
  | 'MONITORING'
  | 'GENERAL';

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: KnowledgeCategory;
  tags: string[];
  solution: string;
  rootCause: string;
  similarityScore: number; // 0–100
  incidentCount: number; // times this solution was applied
  lastUsed: string;
  createdAt: string;
  source: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  relatedIncidentIds: string[];
}

export interface KnowledgeSearchResult {
  entry: KnowledgeEntry;
  matchScore: number;
  matchedFields: string[];
}

export interface KnowledgeCategory_Meta {
  name: KnowledgeCategory;
  label: string;
  count: number;
  icon: string;
}

export interface KnowledgeFilter {
  category?: KnowledgeCategory[];
  search?: string;
  minSimilarity?: number;
  sortBy?: 'relevance' | 'recent' | 'usage';
}

export interface KnowledgeStats {
  totalEntries: number;
  totalCategories: number;
  avgSimilarityScore: number;
  totalResolutions: number;
  topCategory: KnowledgeCategory;
}
