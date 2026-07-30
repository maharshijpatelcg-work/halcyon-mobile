/**
 * Halcyon — Audit Trail Service
 */
import type { AuditEntry, AuditFilter, CostMetrics, ApiUsageMetrics, TokenUsage, MemoryHitMetrics, AuditDashboardData } from '@/types/audit';
import { MOCK_AUDIT_ENTRIES, MOCK_COST_METRICS, MOCK_API_USAGE, MOCK_TOKEN_USAGE, MOCK_MEMORY_HIT_METRICS, MOCK_TELEMETRY } from './mockData';
import type { TelemetryMetric } from '@/types/incident';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getAuditEntries(filter?: AuditFilter, page = 1, pageSize = 20): Promise<{ data: AuditEntry[]; total: number; hasMore: boolean }> {
  await delay(300);
  let entries = [...MOCK_AUDIT_ENTRIES];

  if (filter?.action?.length) {
    entries = entries.filter(e => filter.action!.includes(e.action));
  }
  if (filter?.severity?.length) {
    entries = entries.filter(e => filter.severity!.includes(e.severity));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    entries = entries.filter(e => e.detail.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q));
  }

  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const start = (page - 1) * pageSize;
  return {
    data: entries.slice(start, start + pageSize),
    total: entries.length,
    hasMore: start + pageSize < entries.length,
  };
}

export async function getCostMetrics(): Promise<CostMetrics> {
  await delay(200);
  return { ...MOCK_COST_METRICS };
}

export async function getApiUsage(): Promise<ApiUsageMetrics> {
  await delay(200);
  return { ...MOCK_API_USAGE };
}

export async function getTokenUsage(): Promise<TokenUsage> {
  await delay(200);
  return { ...MOCK_TOKEN_USAGE };
}

export async function getMemoryHitMetrics(): Promise<MemoryHitMetrics> {
  await delay(200);
  return { ...MOCK_MEMORY_HIT_METRICS };
}

export async function getAuditDashboard(): Promise<AuditDashboardData> {
  await delay(400);
  return {
    entries: MOCK_AUDIT_ENTRIES,
    costMetrics: MOCK_COST_METRICS,
    apiUsage: MOCK_API_USAGE,
    tokenUsage: MOCK_TOKEN_USAGE,
    memoryHitMetrics: MOCK_MEMORY_HIT_METRICS,
  };
}

export async function getTelemetryTimeSeries(metric: keyof typeof MOCK_TELEMETRY): Promise<TelemetryMetric[]> {
  await delay(200);
  return MOCK_TELEMETRY[metric] || [];
}
