export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'MITIGATED';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  durationMinutes: number;
  mttrMinutes: number;
  memoryMatchPercentage: number;
  costSavedUSD: number;
  rootCause: string;
  summary: string;
  aiSuggestedFix: string;
  affectedNodesCount: number;
  logs: string[];
  matchedFixId?: string;
  tags: string[];
}

export interface MemoryFix {
  id: string;
  title: string;
  service: string;
  resolutionTimeMs: number;
  confidenceScore: number;
  fixCommand: string;
  explanation: string;
  author: string;
  createdAt: string;
  tags: string[];
  timesApplied: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface MetricSummary {
  activeIncidents: number;
  aiConfidenceScore: number;
  averageLatencyMs: number;
  systemUptimePercentage: number;
  memoryMatchRate: number;
  totalCostSavedUSD: number;
}
