// ── API Response/Request Types ─────────────────────────────────────────────
// Mirrors the Halcyon FastAPI Pydantic schemas exactly.

export interface AIAnalysisResult {
  root_cause: string;
  severity: Severity;
  fix_suggestion: string;
  summary: string;
  affected_components: string[];
  confidence_score: number;
}

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RoutingInfo {
  model_used: string;
  model_tier: string;
  cost: number;
  latency_ms: number;
  escalated: boolean;
  escalation_reason: string;
  cascadeflow_used: boolean;
  decision_trace: Record<string, unknown>;
}

export interface MemoryInfo {
  consulted: boolean;
  hit: boolean;
  match_score: number;
  match_content: string;
  source: string;
}

export interface IncidentSubmitRequest {
  alert_title: string;
  log_content: string;
  sensitive?: boolean;
}

export interface IncidentSubmitResponse {
  analysis: AIAnalysisResult;
  routing: RoutingInfo;
  memory: MemoryInfo;
  resolved_from_memory: boolean;
}

export interface SimilarIncident {
  similar_to_id: number;
  similarity_score: number;
  match_reason: string | null;
}

export interface Incident {
  id: number;
  title: string;
  log_filename: string | null;
  log_content: string;
  root_cause: string | null;
  severity: Severity | null;
  fix_suggestion: string | null;
  summary: string | null;
  affected_components: string[] | null;
  confidence_score: number | null;
  is_solved: boolean;
  solution: string | null;
  solved_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  similar_incidents: SimilarIncident[];
}

export interface IncidentListResponse {
  incidents: Incident[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface DashboardStats {
  total_incidents: number;
  solved_incidents: number;
  open_incidents: number;
  resolution_rate: number;
  by_severity: Record<string, number>;
  ai_decisions: {
    total_decisions: number;
    total_cost: number;
    memory_hits: number;
    escalations: number;
    memory_hit_rate: number;
  };
}

export interface DecisionLog {
  id: number;
  incident_id: number | null;
  model_used: string;
  model_tier: string;
  cost: number;
  latency_ms: number;
  escalated: boolean;
  escalation_reason: string | null;
  memory_consulted: boolean;
  memory_hit: boolean;
  memory_match_score: number | null;
  cascadeflow_used: boolean;
  decision_trace: Record<string, unknown> | null;
  confidence_score: number | null;
  severity: string | null;
  resolution_suggested: string | null;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  db: string;
  memory: string;
}

export interface MarkSolvedRequest {
  incident_id: number;
  solution: string;
}

export interface LogUploadResponse {
  filename: string;
  line_count: number;
  size_bytes: number;
  preview: string[];
  log_content: string;
}

export interface SampleScenario {
  name: string;
  filename: string;
  size_bytes: number;
}
