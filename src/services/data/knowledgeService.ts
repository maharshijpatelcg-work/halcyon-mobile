/**
 * Halcyon — Knowledge Base Service
 */
import type { KnowledgeEntry, KnowledgeSearchResult, KnowledgeFilter, KnowledgeStats, KnowledgeCategory_Meta } from '@/types/knowledge';
import { MOCK_KNOWLEDGE_ENTRIES } from './mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getKnowledgeEntries(filter?: KnowledgeFilter): Promise<KnowledgeEntry[]> {
  await delay(300);
  let entries = [...MOCK_KNOWLEDGE_ENTRIES];

  if (filter?.category?.length) {
    entries = entries.filter(e => filter.category!.includes(e.category));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.solution.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q))
    );
  }
  if (filter?.minSimilarity) {
    entries = entries.filter(e => e.similarityScore >= filter.minSimilarity!);
  }

  switch (filter?.sortBy) {
    case 'recent':
      entries.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
      break;
    case 'usage':
      entries.sort((a, b) => b.incidentCount - a.incidentCount);
      break;
    default:
      entries.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  return entries;
}

export async function searchKnowledge(query: string): Promise<KnowledgeSearchResult[]> {
  await delay(350);
  const q = query.toLowerCase();
  return MOCK_KNOWLEDGE_ENTRIES
    .filter(e => e.title.toLowerCase().includes(q) || e.solution.toLowerCase().includes(q) || e.tags.some(t => t.includes(q)))
    .map(entry => ({
      entry,
      matchScore: entry.similarityScore,
      matchedFields: [
        ...(entry.title.toLowerCase().includes(q) ? ['title'] : []),
        ...(entry.solution.toLowerCase().includes(q) ? ['solution'] : []),
        ...(entry.tags.some(t => t.includes(q)) ? ['tags'] : []),
      ],
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function getKnowledgeById(id: string): Promise<KnowledgeEntry | null> {
  await delay(200);
  return MOCK_KNOWLEDGE_ENTRIES.find(e => e.id === id) ?? null;
}

export async function getCategories(): Promise<KnowledgeCategory_Meta[]> {
  await delay(200);
  const catCounts: Record<string, number> = {};
  MOCK_KNOWLEDGE_ENTRIES.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });

  const icons: Record<string, string> = {
    KUBERNETES: '☸️', AWS: '☁️', DATABASE: '🗃️', JVM: '☕', NETWORKING: '🌐',
    SECURITY: '🔒', PERFORMANCE: '⚡', STORAGE: '💾', CI_CD: '🔄', MONITORING: '📊', GENERAL: '📋',
  };

  return Object.entries(catCounts).map(([name, count]) => ({
    name: name as any,
    label: name.replace('_', '/'),
    count,
    icon: icons[name] || '📋',
  }));
}

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  await delay(200);
  const entries = MOCK_KNOWLEDGE_ENTRIES;
  const avgSim = entries.reduce((s, e) => s + e.similarityScore, 0) / entries.length;
  const totalRes = entries.reduce((s, e) => s + e.incidentCount, 0);
  const catCounts: Record<string, number> = {};
  entries.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    totalEntries: entries.length,
    totalCategories: Object.keys(catCounts).length,
    avgSimilarityScore: Math.round(avgSim * 10) / 10,
    totalResolutions: totalRes,
    topCategory: topCat as any,
  };
}
