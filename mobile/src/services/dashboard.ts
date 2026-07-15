import api from "./api";
import { MOCK_DASHBOARD_STATS, MOCK_HEALTH } from "./mockData";
import { API_CONFIG } from "../constants/config";
import type { DashboardStats, HealthResponse } from "../types";

/**
 * Fetch dashboard aggregate statistics.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await api.get<DashboardStats>("/dashboard/stats");
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to fetch stats");
    return MOCK_DASHBOARD_STATS;
  }
}

/**
 * Health check — verifies API, DB, and memory subsystems.
 */
export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await api.get<HealthResponse>("/health");
    return data;
  } catch {
    if (!API_CONFIG.USE_MOCK_FALLBACK) throw new Error("Failed to fetch health");
    return { ...MOCK_HEALTH, status: "unreachable", db: "unknown", memory: "unknown" };
  }
}
