/**
 * Halcyon — Incident Data Service
 * 
 * Manages incident CRUD, search, filter, pagination.
 * Uses mock data — swap to Firebase/Firestore by replacing implementations.
 */
import type { Incident, IncidentFilter, PaginatedResult, DashboardMetrics, NotificationItem } from '@/types/incident';
import { MOCK_INCIDENTS, MOCK_NOTIFICATIONS, computeDashboardMetrics } from './mockData';

let incidents = [...MOCK_INCIDENTS];
let notifications = [...MOCK_NOTIFICATIONS];

// Simulate async delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getIncidents(
  filter?: IncidentFilter,
  page = 1,
  pageSize = 10
): Promise<PaginatedResult<Incident>> {
  await delay(300);

  let filtered = [...incidents];

  if (filter?.severity?.length) {
    filtered = filtered.filter(i => filter.severity!.includes(i.severity));
  }
  if (filter?.status?.length) {
    filtered = filtered.filter(i => filter.status!.includes(i.status));
  }
  if (filter?.source?.length) {
    filtered = filtered.filter(i => filter.source!.includes(i.source));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.service.toLowerCase().includes(q) ||
      i.tags.some(t => t.includes(q))
    );
  }

  // Sort
  switch (filter?.sortBy) {
    case 'severity': {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      filtered.sort((a, b) => order[a.severity] - order[b.severity]);
      break;
    }
    case 'status': {
      const order = { TRIGGERED: 0, INVESTIGATING: 1, ACKNOWLEDGED: 2, RESOLVED: 3 };
      filtered.sort((a, b) => order[a.status] - order[b.status]);
      break;
    }
    default:
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    total: filtered.length,
    page,
    pageSize,
    hasMore: start + pageSize < filtered.length,
  };
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  await delay(200);
  return incidents.find(i => i.id === id) ?? null;
}

export async function searchIncidents(query: string): Promise<Incident[]> {
  await delay(250);
  const q = query.toLowerCase();
  return incidents.filter(i =>
    i.title.toLowerCase().includes(q) ||
    i.id.toLowerCase().includes(q) ||
    i.aiSummary.toLowerCase().includes(q)
  );
}

const INCIDENT_TEMPLATES = [
  { title: 'CRITICAL: OutOfMemoryError in api-worker-{N}', severity: 'CRITICAL' as const, source: 'KUBERNETES', service: 'api-worker' },
  { title: 'HIGH: Redis connection timeout on cache-{N}', severity: 'HIGH' as const, source: 'AWS', service: 'cache-cluster' },
  { title: 'MEDIUM: Elevated latency on payment-service-{N}', severity: 'MEDIUM' as const, source: 'KUBERNETES', service: 'payment-service' },
  { title: 'CRITICAL: Database failover triggered on pg-{N}', severity: 'CRITICAL' as const, source: 'POSTGRESQL', service: 'pg-primary' },
  { title: 'HIGH: Certificate renewal failed for service-{N}', severity: 'HIGH' as const, source: 'SECURITY', service: 'cert-manager' },
];

export async function simulateIncident(): Promise<Incident> {
  await delay(500);
  const template = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  const id = `INC-${String(incidents.length + 1).padStart(4, '0')}`;

  const newIncident: Incident = {
    id,
    title: template.title.replace('{N}', String(num)),
    severity: template.severity,
    status: 'RESOLVED',
    source: template.source,
    service: `${template.service}-${num}`,
    timestamp: new Date().toISOString(),
    resolvedAt: new Date(Date.now() + 180000).toISOString(),
    aiSummary: `AI analysis complete for ${id}. Pattern matches historical incident with 95% confidence. Auto-resolution applied based on known solution vector.`,
    rootCause: `Automated root cause analysis identified resource constraint on ${template.service}-${num}. Historical pattern correlation found.`,
    suggestedFix: `Apply recommended configuration change based on KB match. Monitor for 15 minutes post-resolution to confirm stability.`,
    memoryMatch: { id: `INC-${String(Math.floor(Math.random() * 80)).padStart(4, '0')}`, title: `Similar ${template.source} incident`, similarity: 85 + Math.floor(Math.random() * 15), resolution: 'Applied standard remediation', resolvedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
    logs: [
      { timestamp: new Date().toISOString().slice(11, 19), level: 'ERROR', source: `${template.source.toLowerCase()}/${template.service}-${num}`, message: `Error detected in ${template.service}-${num}` },
      { timestamp: new Date(Date.now() + 180000).toISOString().slice(11, 19), level: 'INFO', source: 'halcyon/ai', message: 'Auto-resolution applied successfully' },
    ],
    timeline: [
      { id: 't1', timestamp: new Date().toISOString(), action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Incident detected' },
      { id: 't2', timestamp: new Date(Date.now() + 5000).toISOString(), action: 'AI_ANALYSIS', actor: 'AI', detail: 'Root cause identified' },
      { id: 't3', timestamp: new Date(Date.now() + 180000).toISOString(), action: 'RESOLVED', actor: 'AI', detail: 'Auto-resolution applied' },
    ],
    tags: [template.source.toLowerCase(), 'auto-resolved', 'simulated'],
    costSaved: 200 + Math.floor(Math.random() * 500),
    mttrMinutes: 1 + Math.floor(Math.random() * 15),
  };

  incidents = [newIncident, ...incidents];
  return newIncident;
}

export async function resolveIncident(id: string): Promise<Incident | null> {
  await delay(300);
  const idx = incidents.findIndex(i => i.id === id);
  if (idx === -1) return null;

  incidents[idx] = {
    ...incidents[idx],
    status: 'RESOLVED',
    resolvedAt: new Date().toISOString(),
  };
  return incidents[idx];
}

export async function resetIncidents(): Promise<void> {
  await delay(200);
  incidents = [...MOCK_INCIDENTS];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(200);
  return computeDashboardMetrics(incidents);
}

export async function getNotifications(): Promise<NotificationItem[]> {
  await delay(200);
  return [...notifications];
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(100);
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(100);
  notifications = notifications.map(n => ({ ...n, read: true }));
}
