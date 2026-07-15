import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/config";
import { getDashboardStats } from "../services/dashboard";
import { getHealth } from "../services/dashboard";

/**
 * Fetch aggregate dashboard statistics.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboardStats],
    queryFn: getDashboardStats,
  });
}

/**
 * Health check for API connectivity indicator.
 */
export function useHealth() {
  return useQuery({
    queryKey: [QUERY_KEYS.health],
    queryFn: getHealth,
    refetchInterval: 60_000, // poll every 60s
  });
}
