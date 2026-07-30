/**
 * Halcyon — Audit Trail Types
 * 
 * Data structures for audit logging, cost analytics, and compliance.
 */

export type AuditAction =
  | 'INCIDENT_CREATED'
  | 'INCIDENT_RESOLVED'
  | 'INCIDENT_ACKNOWLEDGED'
  | 'AI_ANALYSIS'
  | 'MEMORY_MATCH'
  | 'EXPORT_PDF'
  | 'EXPORT_CSV'
  | 'CONFIG_CHANGE'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'API_CALL'
  | 'WEBHOOK_RECEIVED'
  | 'PII_SANITIZED'
  | 'SECURITY_SCAN';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actor: string; // 'SYSTEM' | 'AI' | user email
  timestamp: string;
  detail: string;
  severity: AuditSeverity;
  metadata?: Record<string, string | number>;
}

export interface CostMetrics {
  totalSaved: number;
  mttrSavedMinutes: number;
  incidentsResolved: number;
  avgCostPerIncident: number;
  monthlySavings: number[];
  monthLabels: string[];
}

export interface ApiUsageMetrics {
  totalCalls: number;
  successRate: number;
  avgLatencyMs: number;
  dailyCalls: { date: string; count: number }[];
  endpoints: { name: string; calls: number; avgMs: number }[];
}

export interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  dailyUsage: { date: string; tokens: number }[];
  modelBreakdown: { model: string; tokens: number; cost: number }[];
}

export interface MemoryHitMetrics {
  hitRate: number; // 0–100
  totalQueries: number;
  hits: number;
  misses: number;
  avgSimilarityOnHit: number;
  dailyHitRate: { date: string; rate: number }[];
}

export interface AuditFilter {
  action?: AuditAction[];
  severity?: AuditSeverity[];
  dateRange?: { start: string; end: string };
  search?: string;
}

export interface AuditDashboardData {
  entries: AuditEntry[];
  costMetrics: CostMetrics;
  apiUsage: ApiUsageMetrics;
  tokenUsage: TokenUsage;
  memoryHitMetrics: MemoryHitMetrics;
}
