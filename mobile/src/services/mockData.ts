import type {
  DashboardStats,
  HealthResponse,
  Incident,
  IncidentListResponse,
  IncidentSubmitRequest,
  IncidentSubmitResponse,
  MarkSolvedRequest,
  SampleScenario,
  Severity,
} from "../types";

// ── Mock Incidents ────────────────────────────────────────────────────────────

const NOW = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200000).toISOString();
const dayAgo = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();
const weekAgo = new Date(Date.now() - 604800000).toISOString();

function makeIncident(
  id: number,
  title: string,
  severity: Severity,
  isSolved: boolean,
  summary: string,
  rootCause: string,
  fix: string,
  components: string[],
  confidence: number,
  tags: string[],
  createdAt: string,
): Incident {
  return {
    id,
    title,
    log_filename: null,
    log_content: `[${severity}] Sample log content for: ${title}`,
    root_cause: rootCause,
    severity,
    fix_suggestion: fix,
    summary,
    affected_components: components,
    confidence_score: confidence,
    is_solved: isSolved,
    solution: isSolved ? "Issue resolved by applying the suggested fix." : null,
    solved_at: isSolved ? NOW : null,
    created_at: createdAt,
    updated_at: createdAt,
    tags,
    similar_incidents: [],
  };
}

export const MOCK_INCIDENTS: Incident[] = [
  makeIncident(1, "PostgreSQL Connection Pool Exhausted", "CRITICAL", false,
    "Database connection pool reached 95% capacity, causing cascading timeouts across payment services.",
    "Connection pool exhaustion due to long-running queries holding connections. Max pool size of 20 is insufficient for current load of 150 req/s.",
    "1. Increase max_connections to 50 in postgresql.conf\n2. Add PgBouncer connection pooler\n3. Optimize the slow ORDER BY query in payment_transactions\n4. Add connection timeout of 30s",
    ["postgresql", "payment-service", "api-gateway"], 0.95, ["database", "critical", "production"], hourAgo),

  makeIncident(2, "Kubernetes Pod CrashLoopBackOff", "CRITICAL", false,
    "Payment service pods entering CrashLoopBackOff after latest deployment, 3/5 replicas down.",
    "OOMKilled — container memory limit of 512Mi exceeded due to memory leak in invoice PDF generation module introduced in v2.4.1.",
    "1. Increase memory limit to 1Gi as immediate mitigation\n2. Roll back to v2.4.0\n3. Profile memory usage in PDF generation\n4. Add memory-aware pagination for large invoice batches",
    ["kubernetes", "payment-service", "deployment"], 0.92, ["k8s", "oom", "deployment"], twoHoursAgo),

  makeIncident(3, "Redis Cluster Failover Storm", "HIGH", false,
    "Redis sentinel triggered 12 failovers in 30 minutes, causing session cache instability.",
    "Network partition between Redis master and sentinel nodes due to misconfigured keepalive in AWS VPC peering connection.",
    "1. Fix VPC peering route tables\n2. Increase sentinel down-after-milliseconds to 10000\n3. Add Redis cluster health to monitoring dashboard\n4. Configure client-side retry with exponential backoff",
    ["redis", "sentinel", "session-cache"], 0.88, ["redis", "networking", "aws"], dayAgo),

  makeIncident(4, "TLS Certificate Expiration Warning", "HIGH", true,
    "Wildcard TLS certificate for *.api.sentinel.io expires in 48 hours.",
    "Certificate auto-renewal via cert-manager failed silently due to DNS-01 challenge timeout. ACME account key rotation happened without updating cert-manager secret.",
    "1. Manually renew certificate via certbot\n2. Update cert-manager ACME secret\n3. Add certificate expiry alerting at 14d/7d/3d thresholds\n4. Test renewal in staging monthly",
    ["cert-manager", "ingress-nginx", "dns"], 0.91, ["tls", "security", "resolved"], twoDaysAgo),

  makeIncident(5, "MongoDB WiredTiger Cache Pressure", "HIGH", false,
    "MongoDB WiredTiger cache utilization at 98%, read latency spiked to 450ms.",
    "WiredTiger eviction rate cannot keep up with working set growth after adding full-text search indexes on user_profiles collection (340GB).",
    "1. Increase wiredTigerCacheSizeGB from 4 to 8\n2. Move full-text search to Elasticsearch\n3. Archive profiles older than 2 years\n4. Add cache pressure alerting at 80%",
    ["mongodb", "database", "search-service"], 0.87, ["mongodb", "performance"], dayAgo),

  makeIncident(6, "API Rate Limiter Misconfiguration", "MEDIUM", true,
    "Rate limiter blocking legitimate traffic — 15% of requests returning 429.",
    "Global rate limit was set to 100 req/min instead of per-user. Deployed config change without canary validation.",
    "1. Switch to per-user rate limiting using X-User-ID header\n2. Increase global fallback to 10000 req/min\n3. Add rate limit config to canary deployment checklist\n4. Implement graduated response (warn → throttle → block)",
    ["api-gateway", "rate-limiter", "nginx"], 0.93, ["config", "resolved", "api"], threeDaysAgo),

  makeIncident(7, "Elasticsearch Index Corruption", "MEDIUM", false,
    "Search index for products catalog showing stale results, 2-hour lag detected.",
    "Elasticsearch primary shard relocated during rolling restart, causing index inconsistency. Replica promotion happened before flush completed.",
    "1. Force merge corrupted index\n2. Reindex from PostgreSQL source of truth\n3. Add index health check to restart procedure\n4. Implement search result freshness indicator",
    ["elasticsearch", "search-service", "catalog"], 0.82, ["search", "data-integrity"], twoDaysAgo),

  makeIncident(8, "Kafka Consumer Lag Spike", "MEDIUM", true,
    "Order processing consumer group lag reached 50K messages, causing 10-minute delay.",
    "Consumer rebalancing storm triggered by flaky health checks. 3 consumers repeatedly joining/leaving the group, causing partition reassignment overhead.",
    "1. Increase session.timeout.ms to 45s\n2. Set heartbeat.interval.ms to 10s\n3. Enable static group membership\n4. Add consumer lag alerting at 10K threshold",
    ["kafka", "order-service", "consumer-group"], 0.89, ["kafka", "resolved", "messaging"], weekAgo),

  makeIncident(9, "Disk Space Warning on Log Aggregator", "LOW", true,
    "Log aggregator node disk at 82%, projected to fill in 5 days.",
    "Log rotation cron job disabled during last maintenance window and not re-enabled. Application debug logging accidentally left on in production.",
    "1. Re-enable logrotate cron\n2. Set log level to WARN in production\n3. Add disk usage alerting at 70%\n4. Implement log sampling for high-volume endpoints",
    ["logstash", "disk", "monitoring"], 0.94, ["disk", "resolved", "logging"], weekAgo),

  makeIncident(10, "DNS Resolution Latency", "LOW", false,
    "Internal DNS resolution latency increased to 200ms, adding 400ms to P99 API response time.",
    "CoreDNS pods memory limited, causing cache eviction under load. ndots:5 setting in pod resolv.conf generating excessive DNS queries.",
    "1. Increase CoreDNS memory to 256Mi\n2. Set ndots:2 in pod DNS config\n3. Enable DNS caching sidecar\n4. Add DNS latency to SLI dashboard",
    ["coredns", "kubernetes", "networking"], 0.78, ["dns", "performance"], threeDaysAgo),

  makeIncident(11, "gRPC Deadline Exceeded on Auth Service", "HIGH", false,
    "Authentication service returning DEADLINE_EXCEEDED for 8% of requests during peak hours.",
    "Token validation involves synchronous call to external OIDC provider with 500ms timeout. Provider latency spiked to 2s during their maintenance window.",
    "1. Cache JWKS keys locally with 1h TTL\n2. Increase gRPC deadline to 3s for auth calls\n3. Add circuit breaker for OIDC provider\n4. Implement local token validation fallback",
    ["auth-service", "grpc", "oidc-provider"], 0.86, ["auth", "grpc", "latency"], dayAgo),

  makeIncident(12, "S3 Bucket Policy Misconfiguration", "MEDIUM", false,
    "Customer data export bucket temporarily accessible without authentication for 4 hours.",
    "Terraform apply modified bucket policy during infrastructure migration. Policy condition key had typo (aws:SourceIP vs aws:SourceIp) causing policy to be ignored.",
    "1. Fix bucket policy condition key casing\n2. Enable S3 Block Public Access at account level\n3. Add OPA policy check to CI pipeline\n4. Rotate any exposed credentials",
    ["s3", "terraform", "security"], 0.90, ["security", "s3", "iam"], twoDaysAgo),
];

// ── Mock Dashboard Stats ──────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_incidents: 12,
  solved_incidents: 4,
  open_incidents: 8,
  resolution_rate: 33.3,
  by_severity: {
    CRITICAL: 2,
    HIGH: 4,
    MEDIUM: 4,
    LOW: 2,
  },
  ai_decisions: {
    total_decisions: 18,
    total_cost: 0.004782,
    memory_hits: 5,
    escalations: 3,
    memory_hit_rate: 27.8,
  },
};

// ── Mock Health ───────────────────────────────────────────────────────────────

export const MOCK_HEALTH: HealthResponse = {
  status: "ok",
  version: "1.0.0",
  db: "ok",
  memory: "ok",
};

// ── Mock Submit Response ──────────────────────────────────────────────────────

export const MOCK_SUBMIT_RESPONSE: IncidentSubmitResponse = {
  analysis: {
    root_cause: "Connection pool exhaustion detected. The database server is rejecting new connections due to max_connections limit being reached.",
    severity: "HIGH",
    fix_suggestion: "1. Increase max_connections in database config\n2. Implement connection pooling with PgBouncer\n3. Review and optimize long-running queries\n4. Add connection monitoring alerts",
    summary: "Database connection limit reached causing service degradation across multiple components.",
    affected_components: ["database", "api-service", "worker-queue"],
    confidence_score: 0.89,
  },
  routing: {
    model_used: "llama-3.3-70b-versatile",
    model_tier: "verifier",
    cost: 0.000345,
    latency_ms: 2340,
    escalated: true,
    escalation_reason: "Quality validation triggered escalation to verifier model",
    cascadeflow_used: true,
    decision_trace: {
      draft_model: "llama-3.1-8b-instant",
      verifier_model: "llama-3.3-70b-versatile",
      escalated: true,
      savings_percentage: 0,
    },
  },
  memory: {
    consulted: true,
    hit: false,
    match_score: 0.42,
    match_content: "",
    source: "hindsight",
  },
  resolved_from_memory: false,
};

// ── Mock Samples ──────────────────────────────────────────────────────────────

export const MOCK_SAMPLES: SampleScenario[] = [
  { name: "database-connection-timeout", filename: "database-connection-timeout.log", size_bytes: 2048 },
  { name: "kubernetes-crashloop", filename: "kubernetes-crashloop.log", size_bytes: 3072 },
  { name: "mongodb-memory-exhaustion", filename: "mongodb-memory-exhaustion.log", size_bytes: 1536 },
  { name: "cpu-overload", filename: "cpu-overload.log", size_bytes: 1024 },
  { name: "disk-full", filename: "disk-full.log", size_bytes: 2560 },
];
