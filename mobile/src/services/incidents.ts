import api from "./api";
import { MOCK_INCIDENTS } from "./mockData";
import { API_CONFIG } from "../constants/config";
import type { Incident, IncidentListResponse, MarkSolvedRequest } from "../types";

/**
 * Fetch paginated list of incidents.
 */
export async function getIncidents(params?: {
  page?: number;
  page_size?: number;
  severity?: string;
  is_solved?: boolean;
  search?: string;
}): Promise<IncidentListResponse> {
  try {
    const { data } = await api.get<IncidentListResponse>("/history", { params });
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to fetch incidents");
    // Mock fallback with filtering
    let filtered = [...MOCK_INCIDENTS];
    if (params?.severity) {
      filtered = filtered.filter((i) => i.severity === params.severity);
    }
    if (params?.is_solved !== undefined) {
      filtered = filtered.filter((i) => i.is_solved === params.is_solved);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (i) => i.title.toLowerCase().includes(q) || i.summary?.toLowerCase().includes(q),
      );
    }
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 20;
    const start = (page - 1) * pageSize;
    return {
      incidents: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      page_size: pageSize,
      pages: Math.ceil(filtered.length / pageSize),
    };
  }
}

/**
 * Fetch a single incident by ID.
 */
export async function getIncident(id: number): Promise<Incident> {
  try {
    const { data } = await api.get<Incident>(`/incident/${id}`);
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to fetch incident");
    const incident = MOCK_INCIDENTS.find((i) => i.id === id);
    if (!incident) throw new Error("Incident not found");
    return incident;
  }
}

/**
 * Mark an incident as resolved.
 */
export async function resolveIncident(body: MarkSolvedRequest): Promise<Incident> {
  try {
    const { data } = await api.post<Incident>(`/incidents/${body.incident_id}/resolve`, body);
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to resolve incident");
    const incident = MOCK_INCIDENTS.find((i) => i.id === body.incident_id);
    if (!incident) throw new Error("Incident not found");
    return { ...incident, is_solved: true, solution: body.solution, solved_at: new Date().toISOString() };
  }
}

/**
 * Delete an incident.
 */
export async function deleteIncident(id: number): Promise<void> {
  try {
    await api.delete(`/incident/${id}`);
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to delete incident");
  }
}
