import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/config";
import { getIncidents, getIncident } from "../services/incidents";
import type { Severity } from "../types";

/**
 * Fetch paginated incident list with optional filters.
 */
export function useIncidents(params?: {
  page?: number;
  severity?: Severity | null;
  is_solved?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.incidents, params],
    queryFn: () =>
      getIncidents({
        page: params?.page ?? 1,
        severity: params?.severity ?? undefined,
        is_solved: params?.is_solved,
        search: params?.search,
      }),
  });
}

/**
 * Fetch a single incident by ID.
 */
export function useIncidentDetail(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.incident, id],
    queryFn: () => getIncident(id),
    enabled: id > 0,
  });
}
