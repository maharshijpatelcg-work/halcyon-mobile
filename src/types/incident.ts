/**
 * Halcyon — Incident Types
 * 
 * Core data structures for the incident management system.
 */

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'TRIGGERED' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string; // 'SYSTEM' | 'AI' | 'OPERATOR'
  detail: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  source: string;
  message: string;
}

export interface MemoryMatch {
  id: string;
  title: string;
  similarity: number; // 0–100
  resolution: string;
  resolvedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: string; // 'KUBERNETES' | 'AWS' | 'POSTGRESQL' | etc.
  service: string;
  timestamp: string;
  resolvedAt?: string;
  aiSummary: string;
  rootCause: string;
  suggestedFix: string;
  memoryMatch?: MemoryMatch;
  logs: LogEntry[];
  timeline: TimelineEvent[];
  tags: string[];
  costSaved: number;
  mttrMinutes: number;
}

export interface TelemetryMetric {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TelemetryDataSet {
  name: string;
  unit: string;
  data: TelemetryMetric[];
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface DashboardMetrics {
  activeIncidents: number;
  resolvedIncidents: number;
  totalIncidents: number;
  resolutionRate: number;
  knownIssuesMatched: number;
  costSaved: number;
  mttrSaved: number;
  uptime: number;
  latencyMs: number;
  aiMemoryMatch: number;
}

export interface IncidentFilter {
  severity?: IncidentSeverity[];
  status?: IncidentStatus[];
  source?: string[];
  search?: string;
  sortBy?: 'newest' | 'severity' | 'status';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'incident' | 'system' | 'ai' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  incidentId?: string;
  severity?: IncidentSeverity;
}
