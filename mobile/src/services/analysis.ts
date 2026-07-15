import api from "./api";
import { MOCK_SAMPLES, MOCK_SUBMIT_RESPONSE } from "./mockData";
import { API_CONFIG } from "../constants/config";
import type { IncidentSubmitRequest, IncidentSubmitResponse, SampleScenario } from "../types";

/**
 * Submit a new incident for AI analysis.
 */
export async function submitIncident(body: IncidentSubmitRequest): Promise<IncidentSubmitResponse> {
  try {
    const { data } = await api.post<IncidentSubmitResponse>("/incidents", body);
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to submit incident");
    // Simulate network delay for mock
    await new Promise((r) => setTimeout(r, 2500));
    return MOCK_SUBMIT_RESPONSE;
  }
}

/**
 * Re-run AI analysis on an existing incident.
 */
export async function reanalyzeIncident(id: number): Promise<IncidentSubmitResponse> {
  try {
    const { data } = await api.post<IncidentSubmitResponse>(`/incident/${id}/reanalyze`);
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to reanalyze incident");
    await new Promise((r) => setTimeout(r, 2000));
    return MOCK_SUBMIT_RESPONSE;
  }
}

/**
 * List available sample log scenarios.
 */
export async function getSampleScenarios(): Promise<SampleScenario[]> {
  try {
    const { data } = await api.get<{ scenarios: SampleScenario[] }>("/samples");
    return data.scenarios;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to fetch samples");
    return MOCK_SAMPLES;
  }
}

/**
 * Load and analyze a sample log scenario.
 */
export async function loadSample(scenario: string): Promise<IncidentSubmitResponse> {
  try {
    const { data } = await api.post<IncidentSubmitResponse>(`/load-sample/${scenario}`);
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to load sample");
    await new Promise((r) => setTimeout(r, 2500));
    return MOCK_SUBMIT_RESPONSE;
  }
}
