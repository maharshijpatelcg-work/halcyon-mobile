/**
 * Halcyon — Mock Data Service
 * 
 * Comprehensive realistic mock data for all screens.
 * Structured for easy swap to real Firebase/Firestore backend.
 */
import type { Incident, NotificationItem, TelemetryMetric, DashboardMetrics } from '@/types/incident';
import type { KnowledgeEntry } from '@/types/knowledge';
import type { AuditEntry, CostMetrics, ApiUsageMetrics, TokenUsage, MemoryHitMetrics } from '@/types/audit';
import type { GitHubRepo, WorkspaceConfig, SubscriptionInfo, SecuritySettings, NotificationPrefs } from '@/types/settings';

// ────────────────────────────────────────────────────────────
// INCIDENTS
// ────────────────────────────────────────────────────────────

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-0001',
    title: 'CRITICAL: OutOfMemoryError in api-worker-91',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    source: 'KUBERNETES',
    service: 'api-worker-91',
    timestamp: '2026-07-29T10:15:00Z',
    resolvedAt: '2026-07-29T10:18:30Z',
    aiSummary: 'JVM heap exhaustion detected in api-worker-91 pod. Memory consumption exceeded 3.8GB threshold causing OOM kill. Pattern matches 14 previous incidents with identical heap configuration.',
    rootCause: 'Heap size was insufficient for current workload. The pod was configured with -Xmx3g but the workload requires at least 4GB during peak hours due to in-memory caching of session objects.',
    suggestedFix: 'Increase pod memory limit to 4GB and adjust JVM heap flags to -Xmx4g -Xms2g. Consider implementing Redis-based session caching to reduce heap pressure.',
    memoryMatch: { id: 'INC-0045', title: 'OOM in api-worker-72', similarity: 100, resolution: 'Increased heap to 4GB', resolvedAt: '2026-07-15T08:30:00Z' },
    logs: [
      { timestamp: '10:15:01', level: 'ERROR', source: 'k8s/api-worker-91', message: 'java.lang.OutOfMemoryError: Java heap space' },
      { timestamp: '10:15:02', level: 'ERROR', source: 'k8s/api-worker-91', message: 'Container killed due to OOM. Limit: 3Gi, Usage: 3.8Gi' },
      { timestamp: '10:15:03', level: 'WARN', source: 'k8s/scheduler', message: 'Pod api-worker-91 evicted from node-12' },
      { timestamp: '10:18:30', level: 'INFO', source: 'halcyon/ai', message: 'Auto-resolution applied: Heap increased to 4GB' },
    ],
    timeline: [
      { id: 't1', timestamp: '10:15:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'OOM detected in api-worker-91' },
      { id: 't2', timestamp: '10:15:05', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Root cause identified: insufficient heap allocation' },
      { id: 't3', timestamp: '10:15:10', action: 'MEMORY_MATCH', actor: 'AI', detail: '100% match found with INC-0045' },
      { id: 't4', timestamp: '10:18:30', action: 'RESOLVED', actor: 'AI', detail: 'Auto-resolution applied successfully' },
    ],
    tags: ['kubernetes', 'jvm', 'oom', 'heap', 'auto-resolved'],
    costSaved: 450,
    mttrMinutes: 3.5,
  },
  {
    id: 'INC-0002',
    title: 'HIGH: Redis connection pool exhausted on cache-cluster-03',
    severity: 'HIGH',
    status: 'RESOLVED',
    source: 'AWS',
    service: 'cache-cluster-03',
    timestamp: '2026-07-29T09:45:00Z',
    resolvedAt: '2026-07-29T09:52:00Z',
    aiSummary: 'Redis connection pool reached maximum capacity of 256 connections. Multiple services experiencing connection timeouts. Historical pattern indicates connection leak in payment-service during high-throughput periods.',
    rootCause: 'Connection leak in payment-service v2.4.1. Connections are not being released after timeout exceptions, causing gradual pool exhaustion during sustained traffic.',
    suggestedFix: 'Deploy payment-service v2.4.2 hotfix with connection cleanup in finally blocks. Increase pool max to 512 as interim measure. Enable connection pool monitoring alerts at 80% threshold.',
    memoryMatch: { id: 'INC-0023', title: 'Redis pool exhaustion on cache-01', similarity: 94, resolution: 'Patched connection leak in payment-service', resolvedAt: '2026-07-10T14:20:00Z' },
    logs: [
      { timestamp: '09:45:01', level: 'ERROR', source: 'redis/cache-03', message: 'Max pool size reached: 256/256 connections active' },
      { timestamp: '09:45:03', level: 'WARN', source: 'payment-svc', message: 'Connection timeout after 30s: pool exhausted' },
      { timestamp: '09:52:00', level: 'INFO', source: 'halcyon/ai', message: 'Resolution applied: pool scaled to 512, hotfix deployed' },
    ],
    timeline: [
      { id: 't1', timestamp: '09:45:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Redis pool exhausted' },
      { id: 't2', timestamp: '09:45:10', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Connection leak pattern detected' },
      { id: 't3', timestamp: '09:52:00', action: 'RESOLVED', actor: 'AI', detail: 'Hotfix deployed, pool scaled' },
    ],
    tags: ['redis', 'aws', 'connection-pool', 'payment-service'],
    costSaved: 380,
    mttrMinutes: 7,
  },
  {
    id: 'INC-0003',
    title: 'CRITICAL: PostgreSQL replication lag exceeds 30s on replica-db-02',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    source: 'POSTGRESQL',
    service: 'replica-db-02',
    timestamp: '2026-07-29T08:30:00Z',
    resolvedAt: '2026-07-29T08:40:00Z',
    aiSummary: 'Streaming replication lag on replica-db-02 has exceeded the 30-second SLA threshold. Write-ahead log (WAL) replay is falling behind due to a long-running analytical query blocking the replay process.',
    rootCause: 'Long-running analytical query on replica-db-02 acquired a conflicting lock, blocking WAL replay. The query has been running for 47 minutes and is scanning the orders table.',
    suggestedFix: 'Terminate the blocking analytical query (PID 48291). Configure hot_standby_feedback = on and max_standby_streaming_delay = 10s. Route analytical queries to a dedicated read replica.',
    memoryMatch: { id: 'INC-0067', title: 'Replication lag on replica-db-01', similarity: 97, resolution: 'Killed blocking query, configured standby feedback', resolvedAt: '2026-07-20T11:15:00Z' },
    logs: [
      { timestamp: '08:30:01', level: 'ERROR', source: 'pg/replica-02', message: 'Replication lag: 34.2s (threshold: 30s)' },
      { timestamp: '08:30:05', level: 'WARN', source: 'pg/replica-02', message: 'WAL replay blocked by PID 48291: SELECT * FROM orders WHERE...' },
      { timestamp: '08:40:00', level: 'INFO', source: 'halcyon/ai', message: 'Query terminated, replication caught up in 2.1s' },
    ],
    timeline: [
      { id: 't1', timestamp: '08:30:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Replication lag exceeded 30s SLA' },
      { id: 't2', timestamp: '08:30:15', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Blocking query identified on PID 48291' },
      { id: 't3', timestamp: '08:40:00', action: 'RESOLVED', actor: 'AI', detail: 'Query terminated, lag cleared' },
    ],
    tags: ['postgresql', 'replication', 'database', 'wal', 'blocking-query'],
    costSaved: 620,
    mttrMinutes: 10,
  },
  {
    id: 'INC-0004',
    title: 'MEDIUM: Elevated 5xx error rate on gateway-lb-01',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    source: 'KUBERNETES',
    service: 'gateway-lb-01',
    timestamp: '2026-07-29T11:00:00Z',
    aiSummary: '5xx error rate has increased to 2.3% on gateway-lb-01, primarily affecting /api/v2/users endpoint. Upstream service user-service is responding with 503 intermittently.',
    rootCause: 'user-service pod is experiencing CPU throttling due to resource limits set at 500m. The current workload requires approximately 800m during peak request processing.',
    suggestedFix: 'Increase user-service CPU limit to 1000m. Configure horizontal pod autoscaler (HPA) with target CPU utilization of 70%. Add circuit breaker in gateway for user-service calls.',
    logs: [
      { timestamp: '11:00:01', level: 'WARN', source: 'k8s/gateway-lb-01', message: '5xx rate: 2.3% (threshold: 1%)' },
      { timestamp: '11:00:05', level: 'ERROR', source: 'user-svc', message: 'CPU throttled: 500m limit reached' },
    ],
    timeline: [
      { id: 't1', timestamp: '11:00:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: '5xx error rate above threshold' },
      { id: 't2', timestamp: '11:00:30', action: 'AI_ANALYSIS', actor: 'AI', detail: 'CPU throttling detected in user-service' },
    ],
    tags: ['kubernetes', 'gateway', '5xx', 'cpu-throttle'],
    costSaved: 0,
    mttrMinutes: 0,
  },
  {
    id: 'INC-0005',
    title: 'LOW: Certificate expiry warning for api.halcyon.ai',
    severity: 'LOW',
    status: 'ACKNOWLEDGED',
    source: 'SECURITY',
    service: 'api.halcyon.ai',
    timestamp: '2026-07-29T06:00:00Z',
    aiSummary: 'TLS certificate for api.halcyon.ai will expire in 14 days. Auto-renewal via cert-manager is configured but last renewal attempt failed.',
    rootCause: 'cert-manager ACME challenge failed due to DNS propagation delay. The DNS TXT record was not visible within the 60-second timeout window.',
    suggestedFix: 'Increase ACME challenge timeout to 120s in cert-manager ClusterIssuer. Verify DNS provider API credentials. Schedule manual renewal as backup.',
    logs: [
      { timestamp: '06:00:01', level: 'WARN', source: 'cert-manager', message: 'Certificate api.halcyon.ai expires in 14 days' },
      { timestamp: '06:00:05', level: 'ERROR', source: 'cert-manager', message: 'ACME challenge failed: DNS TXT record not found within timeout' },
    ],
    timeline: [
      { id: 't1', timestamp: '06:00:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Certificate expiry warning' },
      { id: 't2', timestamp: '06:05:00', action: 'ACKNOWLEDGED', actor: 'OPERATOR', detail: 'Acknowledged by operator' },
    ],
    tags: ['security', 'tls', 'certificate', 'cert-manager'],
    costSaved: 0,
    mttrMinutes: 0,
  },
  {
    id: 'INC-0006',
    title: 'HIGH: Kafka consumer lag exceeding 100K messages',
    severity: 'HIGH',
    status: 'RESOLVED',
    source: 'KAFKA',
    service: 'event-processor-group',
    timestamp: '2026-07-28T22:15:00Z',
    resolvedAt: '2026-07-28T22:30:00Z',
    aiSummary: 'Consumer group event-processor-group has accumulated 142K messages of lag on topic incident-events. Processing throughput dropped to 200 msg/s from baseline 2000 msg/s.',
    rootCause: 'A poison pill message with malformed JSON payload caused repeated deserialization failures, triggering consumer retries and blocking partition processing.',
    suggestedFix: 'Deploy dead letter queue (DLQ) handler for malformed messages. Skip the poison pill message at offset 847291. Add JSON schema validation at producer side.',
    memoryMatch: { id: 'INC-0034', title: 'Kafka consumer lag on analytics-events', similarity: 88, resolution: 'Implemented DLQ and skipped bad offset', resolvedAt: '2026-07-05T16:45:00Z' },
    logs: [
      { timestamp: '22:15:01', level: 'ERROR', source: 'kafka/event-processor', message: 'Consumer lag: 142,391 messages on incident-events' },
      { timestamp: '22:15:05', level: 'ERROR', source: 'kafka/event-processor', message: 'Deserialization failed at offset 847291: malformed JSON' },
      { timestamp: '22:30:00', level: 'INFO', source: 'halcyon/ai', message: 'Poison pill skipped, DLQ configured, lag recovering' },
    ],
    timeline: [
      { id: 't1', timestamp: '22:15:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Consumer lag exceeded 100K threshold' },
      { id: 't2', timestamp: '22:15:20', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Poison pill message identified at offset 847291' },
      { id: 't3', timestamp: '22:30:00', action: 'RESOLVED', actor: 'AI', detail: 'DLQ handler deployed, message skipped' },
    ],
    tags: ['kafka', 'consumer-lag', 'deserialization', 'dlq'],
    costSaved: 520,
    mttrMinutes: 15,
  },
  {
    id: 'INC-0007',
    title: 'MEDIUM: S3 bucket policy misconfiguration detected',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    source: 'AWS',
    service: 'halcyon-logs-bucket',
    timestamp: '2026-07-28T18:00:00Z',
    resolvedAt: '2026-07-28T18:10:00Z',
    aiSummary: 'S3 bucket halcyon-logs-bucket has an overly permissive policy allowing s3:GetObject to principal "*". This exposes log data to public access.',
    rootCause: 'A recent Terraform apply inadvertently applied a wildcard principal to the bucket policy. The change was introduced in commit abc123 on the infrastructure repo.',
    suggestedFix: 'Restrict bucket policy to specific IAM roles. Add OPA/Rego policy to prevent wildcard principals in CI pipeline. Enable S3 Block Public Access at account level.',
    memoryMatch: { id: 'INC-0078', title: 'S3 public access on staging-assets', similarity: 92, resolution: 'Restricted policy, enabled block public access', resolvedAt: '2026-07-18T09:30:00Z' },
    logs: [
      { timestamp: '18:00:01', level: 'WARN', source: 'aws/s3-audit', message: 'Public access detected on halcyon-logs-bucket' },
      { timestamp: '18:10:00', level: 'INFO', source: 'halcyon/ai', message: 'Bucket policy restricted, public access blocked' },
    ],
    timeline: [
      { id: 't1', timestamp: '18:00:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'S3 bucket misconfiguration detected' },
      { id: 't2', timestamp: '18:02:00', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Wildcard principal in bucket policy' },
      { id: 't3', timestamp: '18:10:00', action: 'RESOLVED', actor: 'AI', detail: 'Policy corrected, public access blocked' },
    ],
    tags: ['aws', 's3', 'security', 'iam', 'terraform'],
    costSaved: 200,
    mttrMinutes: 10,
  },
  {
    id: 'INC-0008',
    title: 'CRITICAL: Node disk pressure on k8s-node-14',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    source: 'KUBERNETES',
    service: 'k8s-node-14',
    timestamp: '2026-07-28T14:20:00Z',
    resolvedAt: '2026-07-28T14:35:00Z',
    aiSummary: 'Kubernetes node k8s-node-14 reporting DiskPressure condition. Root filesystem is at 94% utilization. Container images and orphaned volumes consuming excessive space.',
    rootCause: 'Orphaned container images from failed deployments accumulated over 2 weeks. Image garbage collection threshold was set too high at 95%.',
    suggestedFix: 'Run docker system prune on affected node. Lower imageGCHighThresholdPercent to 80%. Set up CronJob for periodic image cleanup. Add PDB alerts at 80% disk usage.',
    memoryMatch: { id: 'INC-0012', title: 'Disk pressure on k8s-node-08', similarity: 96, resolution: 'Pruned images, lowered GC threshold', resolvedAt: '2026-07-01T10:00:00Z' },
    logs: [
      { timestamp: '14:20:01', level: 'ERROR', source: 'k8s/node-14', message: 'DiskPressure: root fs at 94.2% (threshold: 90%)' },
      { timestamp: '14:35:00', level: 'INFO', source: 'halcyon/ai', message: 'Pruned 12.4GB, disk usage at 71%' },
    ],
    timeline: [
      { id: 't1', timestamp: '14:20:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Node disk pressure condition' },
      { id: 't2', timestamp: '14:22:00', action: 'AI_ANALYSIS', actor: 'AI', detail: 'Orphaned images identified' },
      { id: 't3', timestamp: '14:35:00', action: 'RESOLVED', actor: 'AI', detail: 'Images pruned, disk recovered' },
    ],
    tags: ['kubernetes', 'disk-pressure', 'node', 'image-gc'],
    costSaved: 340,
    mttrMinutes: 15,
  },
  {
    id: 'INC-0009',
    title: 'LOW: Prometheus scrape failures on metrics-exporter',
    severity: 'LOW',
    status: 'RESOLVED',
    source: 'MONITORING',
    service: 'metrics-exporter',
    timestamp: '2026-07-28T12:00:00Z',
    resolvedAt: '2026-07-28T12:05:00Z',
    aiSummary: 'Prometheus is failing to scrape metrics from metrics-exporter service. 5 consecutive failures detected. Service is returning 502 Bad Gateway.',
    rootCause: 'metrics-exporter pod was restarting due to a liveness probe failure. The /healthz endpoint was timing out because of a deadlock in the metrics collection goroutine.',
    suggestedFix: 'Fix deadlock by adding timeout context to metrics collection. Increase liveness probe timeout from 5s to 15s. Add readiness probe separate from liveness.',
    logs: [
      { timestamp: '12:00:01', level: 'WARN', source: 'prometheus', message: 'Scrape failed for metrics-exporter: 502 Bad Gateway' },
      { timestamp: '12:05:00', level: 'INFO', source: 'halcyon/ai', message: 'Probe timeout increased, deadlock fix deployed' },
    ],
    timeline: [
      { id: 't1', timestamp: '12:00:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Scrape failures detected' },
      { id: 't2', timestamp: '12:05:00', action: 'RESOLVED', actor: 'AI', detail: 'Fix deployed' },
    ],
    tags: ['monitoring', 'prometheus', 'healthcheck', 'deadlock'],
    costSaved: 80,
    mttrMinutes: 5,
  },
  {
    id: 'INC-0010',
    title: 'HIGH: Memory leak detected in notification-service',
    severity: 'HIGH',
    status: 'RESOLVED',
    source: 'KUBERNETES',
    service: 'notification-service',
    timestamp: '2026-07-28T09:30:00Z',
    resolvedAt: '2026-07-28T09:50:00Z',
    aiSummary: 'notification-service memory usage growing linearly at 50MB/hour. Current usage: 2.8GB of 3GB limit. OOM kill predicted within 4 hours.',
    rootCause: 'Event listener subscriptions not being cleaned up on WebSocket disconnects. Each reconnection creates a new subscription without removing the old one.',
    suggestedFix: 'Implement proper cleanup in WebSocket disconnect handler. Add subscription tracking with WeakRef. Deploy canary with fix and monitor memory pattern.',
    memoryMatch: { id: 'INC-0056', title: 'Memory leak in chat-service', similarity: 85, resolution: 'Fixed event listener cleanup', resolvedAt: '2026-07-12T15:00:00Z' },
    logs: [
      { timestamp: '09:30:01', level: 'WARN', source: 'k8s/notification-svc', message: 'Memory: 2.8GB/3GB (93%). Linear growth detected.' },
      { timestamp: '09:50:00', level: 'INFO', source: 'halcyon/ai', message: 'Hotfix deployed, memory stabilized at 1.2GB' },
    ],
    timeline: [
      { id: 't1', timestamp: '09:30:01', action: 'TRIGGERED', actor: 'SYSTEM', detail: 'Memory leak pattern detected' },
      { id: 't2', timestamp: '09:35:00', action: 'AI_ANALYSIS', actor: 'AI', detail: 'WebSocket listener leak identified' },
      { id: 't3', timestamp: '09:50:00', action: 'RESOLVED', actor: 'AI', detail: 'Cleanup handler deployed' },
    ],
    tags: ['kubernetes', 'memory-leak', 'websocket', 'notification'],
    costSaved: 410,
    mttrMinutes: 20,
  },
];

// ────────────────────────────────────────────────────────────
// KNOWLEDGE BASE
// ────────────────────────────────────────────────────────────

export const MOCK_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'KB-001', title: 'JVM OutOfMemoryError Resolution', category: 'JVM',
    tags: ['jvm', 'oom', 'heap', 'kubernetes'],
    solution: 'Increase pod memory limit and JVM heap flags. Set -Xmx to 80% of container memory limit. Enable GC logging for monitoring. Consider switching to G1GC or ZGC for large heaps.',
    rootCause: 'JVM heap exhaustion due to insufficient memory allocation or memory-intensive operations without proper bounds.',
    similarityScore: 100, incidentCount: 14, lastUsed: '2026-07-29T10:18:30Z', createdAt: '2026-01-15T00:00:00Z',
    source: 'Auto-learned from INC-0001', severity: 'CRITICAL', relatedIncidentIds: ['INC-0001', 'INC-0045'],
  },
  {
    id: 'KB-002', title: 'Redis Connection Pool Exhaustion', category: 'DATABASE',
    tags: ['redis', 'connection-pool', 'timeout', 'leak'],
    solution: 'Identify and fix connection leaks in application code. Ensure connections are released in finally blocks. Increase pool max size as interim measure. Add pool monitoring at 80% threshold.',
    rootCause: 'Application code not properly releasing connections after exceptions or timeouts, causing gradual pool exhaustion.',
    similarityScore: 94, incidentCount: 8, lastUsed: '2026-07-29T09:52:00Z', createdAt: '2026-02-20T00:00:00Z',
    source: 'Auto-learned from INC-0002', severity: 'HIGH', relatedIncidentIds: ['INC-0002', 'INC-0023'],
  },
  {
    id: 'KB-003', title: 'PostgreSQL Replication Lag Resolution', category: 'DATABASE',
    tags: ['postgresql', 'replication', 'wal', 'blocking-query'],
    solution: 'Terminate blocking analytical queries on replicas. Configure hot_standby_feedback and max_standby_streaming_delay. Route analytical workloads to dedicated read replicas.',
    rootCause: 'Long-running queries on streaming replicas acquiring conflicting locks that block WAL replay.',
    similarityScore: 97, incidentCount: 6, lastUsed: '2026-07-29T08:40:00Z', createdAt: '2026-03-10T00:00:00Z',
    source: 'Auto-learned from INC-0003', severity: 'CRITICAL', relatedIncidentIds: ['INC-0003', 'INC-0067'],
  },
  {
    id: 'KB-004', title: 'Kubernetes Node Disk Pressure', category: 'KUBERNETES',
    tags: ['kubernetes', 'disk-pressure', 'image-gc', 'node'],
    solution: 'Prune orphaned container images and volumes. Lower imageGCHighThresholdPercent to 80%. Set up CronJob for periodic cleanup. Add disk usage alerts at 80% threshold.',
    rootCause: 'Accumulated orphaned container images from failed deployments exceeding garbage collection thresholds.',
    similarityScore: 96, incidentCount: 11, lastUsed: '2026-07-28T14:35:00Z', createdAt: '2026-01-05T00:00:00Z',
    source: 'Auto-learned from INC-0008', severity: 'CRITICAL', relatedIncidentIds: ['INC-0008', 'INC-0012'],
  },
  {
    id: 'KB-005', title: 'Kafka Consumer Lag / Poison Pill', category: 'GENERAL',
    tags: ['kafka', 'consumer-lag', 'deserialization', 'dlq'],
    solution: 'Implement dead letter queue for malformed messages. Add JSON schema validation at producer. Configure max retry with exponential backoff. Skip poison pill messages after N retries.',
    rootCause: 'Malformed messages causing repeated deserialization failures, blocking partition processing and accumulating consumer lag.',
    similarityScore: 88, incidentCount: 5, lastUsed: '2026-07-28T22:30:00Z', createdAt: '2026-04-01T00:00:00Z',
    source: 'Auto-learned from INC-0006', severity: 'HIGH', relatedIncidentIds: ['INC-0006', 'INC-0034'],
  },
  {
    id: 'KB-006', title: 'S3 Bucket Policy Misconfiguration', category: 'SECURITY',
    tags: ['aws', 's3', 'iam', 'public-access', 'terraform'],
    solution: 'Restrict bucket policies to specific IAM roles. Enable S3 Block Public Access at account level. Add OPA/Rego policies in CI to prevent wildcard principals.',
    rootCause: 'Infrastructure-as-code changes inadvertently applying overly permissive bucket policies with wildcard principals.',
    similarityScore: 92, incidentCount: 3, lastUsed: '2026-07-28T18:10:00Z', createdAt: '2026-05-15T00:00:00Z',
    source: 'Auto-learned from INC-0007', severity: 'MEDIUM', relatedIncidentIds: ['INC-0007', 'INC-0078'],
  },
  {
    id: 'KB-007', title: 'WebSocket Memory Leak Pattern', category: 'PERFORMANCE',
    tags: ['websocket', 'memory-leak', 'event-listener', 'cleanup'],
    solution: 'Implement proper cleanup in disconnect handlers. Use WeakRef for subscription tracking. Add memory monitoring dashboards. Deploy canary builds for memory regression testing.',
    rootCause: 'Event listener subscriptions not cleaned up on WebSocket disconnects, causing linear memory growth.',
    similarityScore: 85, incidentCount: 4, lastUsed: '2026-07-28T09:50:00Z', createdAt: '2026-06-01T00:00:00Z',
    source: 'Auto-learned from INC-0010', severity: 'HIGH', relatedIncidentIds: ['INC-0010', 'INC-0056'],
  },
  {
    id: 'KB-008', title: 'TLS Certificate Renewal Failure', category: 'SECURITY',
    tags: ['tls', 'certificate', 'cert-manager', 'acme', 'dns'],
    solution: 'Increase ACME challenge timeout. Verify DNS provider API credentials. Configure backup manual renewal process. Set up cert expiry monitoring at 30/14/7 day thresholds.',
    rootCause: 'DNS propagation delays causing ACME challenge timeouts during automated certificate renewal.',
    similarityScore: 90, incidentCount: 2, lastUsed: '2026-07-29T06:05:00Z', createdAt: '2026-06-20T00:00:00Z',
    source: 'Auto-learned from INC-0005', severity: 'LOW', relatedIncidentIds: ['INC-0005'],
  },
  {
    id: 'KB-009', title: 'CPU Throttling in Kubernetes Pods', category: 'KUBERNETES',
    tags: ['kubernetes', 'cpu', 'throttle', 'hpa', 'resource-limits'],
    solution: 'Increase CPU limits based on profiled workload. Configure HPA with target CPU utilization of 70%. Add circuit breakers for downstream calls during throttling. Use VPA for automated right-sizing.',
    rootCause: 'Resource limits set below actual workload requirements, causing CPU throttling during peak request processing.',
    similarityScore: 78, incidentCount: 9, lastUsed: '2026-07-29T11:00:00Z', createdAt: '2026-02-01T00:00:00Z',
    source: 'Auto-learned from INC-0004', severity: 'MEDIUM', relatedIncidentIds: ['INC-0004'],
  },
  {
    id: 'KB-010', title: 'Prometheus Scrape Failure Resolution', category: 'MONITORING',
    tags: ['prometheus', 'monitoring', 'healthcheck', 'liveness-probe'],
    solution: 'Separate liveness and readiness probes. Add timeout context to metrics collection. Increase probe timeouts appropriately. Add scrape failure alerts with 3-failure threshold.',
    rootCause: 'Liveness probe failures caused by metric collection goroutine deadlocks, triggering pod restarts.',
    similarityScore: 82, incidentCount: 3, lastUsed: '2026-07-28T12:05:00Z', createdAt: '2026-05-01T00:00:00Z',
    source: 'Auto-learned from INC-0009', severity: 'LOW', relatedIncidentIds: ['INC-0009'],
  },
];

// ────────────────────────────────────────────────────────────
// AUDIT ENTRIES
// ────────────────────────────────────────────────────────────

export const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  { id: 'AUD-001', action: 'INCIDENT_CREATED', actor: 'SYSTEM', timestamp: '2026-07-29T10:15:01Z', detail: 'Incident INC-0001 triggered: OutOfMemoryError in api-worker-91', severity: 'CRITICAL' },
  { id: 'AUD-002', action: 'AI_ANALYSIS', actor: 'AI', timestamp: '2026-07-29T10:15:05Z', detail: 'Root cause analysis completed for INC-0001. Confidence: 98%', severity: 'INFO' },
  { id: 'AUD-003', action: 'MEMORY_MATCH', actor: 'AI', timestamp: '2026-07-29T10:15:10Z', detail: '100% memory match found with INC-0045 for incident INC-0001', severity: 'INFO' },
  { id: 'AUD-004', action: 'INCIDENT_RESOLVED', actor: 'AI', timestamp: '2026-07-29T10:18:30Z', detail: 'INC-0001 auto-resolved. MTTR: 3.5 min. Cost saved: $450', severity: 'INFO' },
  { id: 'AUD-005', action: 'INCIDENT_CREATED', actor: 'SYSTEM', timestamp: '2026-07-29T09:45:01Z', detail: 'Incident INC-0002 triggered: Redis connection pool exhausted', severity: 'WARNING' },
  { id: 'AUD-006', action: 'INCIDENT_RESOLVED', actor: 'AI', timestamp: '2026-07-29T09:52:00Z', detail: 'INC-0002 auto-resolved. MTTR: 7 min. Cost saved: $380', severity: 'INFO' },
  { id: 'AUD-007', action: 'PII_SANITIZED', actor: 'SYSTEM', timestamp: '2026-07-29T09:00:00Z', detail: 'PII sanitization executed on incoming payload. 0 plain-text credentials exposed.', severity: 'INFO' },
  { id: 'AUD-008', action: 'SECURITY_SCAN', actor: 'SYSTEM', timestamp: '2026-07-29T08:00:00Z', detail: 'Security scan completed. 0 vulnerabilities found. Compliance: PASS', severity: 'INFO' },
  { id: 'AUD-009', action: 'WEBHOOK_RECEIVED', actor: 'SYSTEM', timestamp: '2026-07-29T07:30:00Z', detail: 'GitHub webhook received: push to main branch on halcyon-infra', severity: 'INFO' },
  { id: 'AUD-010', action: 'USER_LOGIN', actor: 'maharshi.j.patel.cg@gmail.com', timestamp: '2026-07-29T07:00:00Z', detail: 'User login from Chrome/Windows. IP: 203.0.113.42', severity: 'INFO' },
  { id: 'AUD-011', action: 'CONFIG_CHANGE', actor: 'maharshi.j.patel.cg@gmail.com', timestamp: '2026-07-28T23:00:00Z', detail: 'Workspace setting updated: notification threshold changed to HIGH', severity: 'WARNING' },
  { id: 'AUD-012', action: 'API_CALL', actor: 'SYSTEM', timestamp: '2026-07-28T22:00:00Z', detail: 'OpenAI API call: gpt-4o-mini. Tokens: 2,340. Latency: 1.2s', severity: 'INFO' },
];

// ────────────────────────────────────────────────────────────
// METRICS
// ────────────────────────────────────────────────────────────

export const MOCK_COST_METRICS: CostMetrics = {
  totalSaved: 3000,
  mttrSavedMinutes: 89,
  incidentsResolved: 8,
  avgCostPerIncident: 375,
  monthlySavings: [1200, 1800, 2400, 2100, 2800, 3000, 3000],
  monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
};

export const MOCK_API_USAGE: ApiUsageMetrics = {
  totalCalls: 4821,
  successRate: 99.2,
  avgLatencyMs: 245,
  dailyCalls: [
    { date: '07-23', count: 620 }, { date: '07-24', count: 710 },
    { date: '07-25', count: 680 }, { date: '07-26', count: 750 },
    { date: '07-27', count: 690 }, { date: '07-28', count: 720 },
    { date: '07-29', count: 651 },
  ],
  endpoints: [
    { name: '/api/incidents', calls: 1840, avgMs: 180 },
    { name: '/api/knowledge', calls: 1200, avgMs: 220 },
    { name: '/api/ai/analyze', calls: 980, avgMs: 1200 },
    { name: '/api/audit', calls: 801, avgMs: 95 },
  ],
};

export const MOCK_TOKEN_USAGE: TokenUsage = {
  totalTokens: 248500,
  promptTokens: 186375,
  completionTokens: 62125,
  dailyUsage: [
    { date: '07-23', tokens: 32000 }, { date: '07-24', tokens: 38000 },
    { date: '07-25', tokens: 35000 }, { date: '07-26', tokens: 41000 },
    { date: '07-27', tokens: 34000 }, { date: '07-28', tokens: 37000 },
    { date: '07-29', tokens: 31500 },
  ],
  modelBreakdown: [
    { model: 'gpt-4o-mini', tokens: 198000, cost: 29.70 },
    { model: 'text-embedding-3-small', tokens: 50500, cost: 1.01 },
  ],
};

export const MOCK_MEMORY_HIT_METRICS: MemoryHitMetrics = {
  hitRate: 87,
  totalQueries: 156,
  hits: 136,
  misses: 20,
  avgSimilarityOnHit: 91.4,
  dailyHitRate: [
    { date: '07-23', rate: 82 }, { date: '07-24', rate: 85 },
    { date: '07-25', rate: 84 }, { date: '07-26', rate: 88 },
    { date: '07-27', rate: 86 }, { date: '07-28', rate: 90 },
    { date: '07-29', rate: 87 },
  ],
};

// ────────────────────────────────────────────────────────────
// TELEMETRY TIME SERIES
// ────────────────────────────────────────────────────────────

function generateTimeSeries(baseValue: number, variance: number, count: number): TelemetryMetric[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(now - (count - i) * 5 * 60 * 1000).toISOString(),
    value: baseValue + (Math.random() - 0.5) * variance * 2,
  }));
}

export const MOCK_TELEMETRY = {
  cpuUsage: generateTimeSeries(45, 15, 24),
  memoryUsage: generateTimeSeries(62, 10, 24),
  networkIn: generateTimeSeries(340, 80, 24),
  networkOut: generateTimeSeries(210, 60, 24),
  diskIO: generateTimeSeries(28, 12, 24),
  latency: generateTimeSeries(245, 50, 24),
  requestRate: generateTimeSeries(1200, 300, 24),
  errorRate: generateTimeSeries(0.8, 0.5, 24),
};

// ────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'N-001', type: 'incident', title: 'Critical Incident Detected', message: 'OutOfMemoryError in api-worker-91', timestamp: '2026-07-29T10:15:01Z', read: false, incidentId: 'INC-0001', severity: 'CRITICAL' },
  { id: 'N-002', type: 'ai', title: 'AI Auto-Resolution', message: 'INC-0001 resolved automatically. MTTR: 3.5 min', timestamp: '2026-07-29T10:18:30Z', read: false, incidentId: 'INC-0001' },
  { id: 'N-003', type: 'incident', title: 'High Severity Incident', message: 'Redis connection pool exhausted on cache-cluster-03', timestamp: '2026-07-29T09:45:01Z', read: true, incidentId: 'INC-0002', severity: 'HIGH' },
  { id: 'N-004', type: 'system', title: 'System Health Check', message: 'All systems operational. Uptime: 99.97%', timestamp: '2026-07-29T08:00:00Z', read: true },
  { id: 'N-005', type: 'security', title: 'Security Scan Complete', message: '0 vulnerabilities found. Compliance: PASS', timestamp: '2026-07-29T08:00:00Z', read: true },
  { id: 'N-006', type: 'ai', title: 'Knowledge Base Updated', message: '2 new solution vectors indexed from resolved incidents', timestamp: '2026-07-28T23:00:00Z', read: true },
  { id: 'N-007', type: 'system', title: 'GitHub Webhook Received', message: 'Push to main on halcyon-infra repository', timestamp: '2026-07-28T22:30:00Z', read: true },
];

// ────────────────────────────────────────────────────────────
// SETTINGS / GITHUB
// ────────────────────────────────────────────────────────────

export const MOCK_WORKSPACE: WorkspaceConfig = {
  id: 'ws-halcyon-prod', name: 'Halcyon Production', region: 'us-east-1',
  memberCount: 5, createdAt: '2026-01-01T00:00:00Z', tier: 'FREE',
  logsUsedToday: 142, logsLimit: 500,
};

export const MOCK_GITHUB_REPOS: GitHubRepo[] = [
  { id: 'r1', name: 'halcyon-infra', fullName: 'maharshijpatel/halcyon-infra', private: true, branches: ['main', 'staging', 'develop'], defaultBranch: 'main', language: 'HCL', updatedAt: '2026-07-29T07:30:00Z' },
  { id: 'r2', name: 'halcyon-api', fullName: 'maharshijpatel/halcyon-api', private: true, branches: ['main', 'develop', 'feature/ai-engine'], defaultBranch: 'main', language: 'TypeScript', updatedAt: '2026-07-28T18:00:00Z' },
  { id: 'r3', name: 'halcyon-mobile', fullName: 'maharshijpatel/halcyon-mobile', private: false, branches: ['main', 'develop'], defaultBranch: 'main', language: 'TypeScript', updatedAt: '2026-07-29T10:00:00Z' },
];

export const MOCK_SUBSCRIPTION: SubscriptionInfo = {
  tier: 'FREE', startDate: '2026-01-01T00:00:00Z',
  logsUsed: 142, logsLimit: 500, apiCallsUsed: 4821, apiCallsLimit: 10000,
  features: ['Basic incident monitoring', 'AI auto-resolution (5/day)', 'Knowledge base (100 entries)', 'Email notifications', 'Single workspace'],
};

export const MOCK_NOTIFICATION_PREFS: NotificationPrefs = {
  pushEnabled: true, emailEnabled: true, severityThreshold: 'HIGH',
  quietHoursEnabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00',
};

export const MOCK_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  activeSessions: [
    { id: 's1', device: 'Chrome on Windows', location: 'Ahmedabad, IN', lastActive: '2026-07-29T12:00:00Z', current: true },
    { id: 's2', device: 'Mobile App on Android', location: 'Ahmedabad, IN', lastActive: '2026-07-28T18:00:00Z', current: false },
  ],
  apiKeys: [
    { id: 'ak1', name: 'Production API Key', prefix: 'hlcn_pk_', createdAt: '2026-06-01T00:00:00Z', lastUsed: '2026-07-29T10:15:00Z', scopes: ['incidents:read', 'knowledge:read', 'audit:read'] },
  ],
};

// ────────────────────────────────────────────────────────────
// DASHBOARD COMPUTED METRICS
// ────────────────────────────────────────────────────────────

export function computeDashboardMetrics(incidents: Incident[]): DashboardMetrics {
  const active = incidents.filter(i => i.status !== 'RESOLVED').length;
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
  const total = incidents.length;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const matched = incidents.filter(i => i.memoryMatch).length;
  const matchPercent = total > 0 ? Math.round((matched / total) * 100) : 0;
  const totalCost = incidents.reduce((sum, i) => sum + i.costSaved, 0);
  const totalMttr = incidents.reduce((sum, i) => sum + i.mttrMinutes, 0);

  return {
    activeIncidents: active,
    resolvedIncidents: resolved,
    totalIncidents: total,
    resolutionRate: rate,
    knownIssuesMatched: matchPercent,
    costSaved: totalCost,
    mttrSaved: totalMttr,
    uptime: 99.97,
    latencyMs: 245,
    aiMemoryMatch: matchPercent,
  };
}
