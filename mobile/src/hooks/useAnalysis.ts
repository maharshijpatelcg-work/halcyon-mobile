import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/config";
import { submitIncident, reanalyzeIncident, loadSample } from "../services/analysis";
import { resolveIncident } from "../services/incidents";
import type { IncidentSubmitRequest, MarkSolvedRequest } from "../types";

/**
 * Mutation to submit a new incident for AI analysis.
 */
export function useSubmitAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: IncidentSubmitRequest) => submitIncident(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
}

/**
 * Mutation to re-analyze an existing incident.
 */
export function useReanalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reanalyzeIncident(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incident, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
    },
  });
}

/**
 * Mutation to load and analyze a sample scenario.
 */
export function useLoadSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scenario: string) => loadSample(scenario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
}

/**
 * Mutation to mark an incident as resolved.
 */
export function useResolveIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MarkSolvedRequest) => resolveIncident(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incident, variables.incident_id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
}
