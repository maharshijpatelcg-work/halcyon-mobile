export const API_CONFIG = {
  /** Change this to your local network IP when testing on a physical device */
  BASE_URL: "http://127.0.0.1:8000/api",
  TIMEOUT: 15000,
  /** Use mock data when backend is unreachable */
  USE_MOCK_FALLBACK: true,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const QUERY_KEYS = {
  incidents: "incidents",
  incident: "incident",
  dashboardStats: "dashboardStats",
  health: "health",
  decisions: "decisions",
  samples: "samples",
} as const;
