import type { Severity } from "../types";

export const SEVERITY_COLORS: Record<Severity, { text: string; bg: string; dot: string }> = {
  CRITICAL: { text: "#EF4444", bg: "rgba(239, 68, 68, 0.12)", dot: "#EF4444" },
  HIGH:     { text: "#F97316", bg: "rgba(249, 115, 22, 0.12)", dot: "#F97316" },
  MEDIUM:   { text: "#FBBF24", bg: "rgba(251, 191, 36, 0.12)", dot: "#FBBF24" },
  LOW:      { text: "#34D399", bg: "rgba(52, 211, 153, 0.12)", dot: "#34D399" },
};

export const COLORS = {
  bg:            "#0A0A0F",
  surface:       "#12121A",
  card:          "#1A1A26",
  border:        "#2A2A3C",
  borderLight:   "#3A3A50",
  accent:        "#6366F1",
  accentLight:   "#818CF8",
  accentGlow:    "rgba(99, 102, 241, 0.15)",
  text:          "#F1F1F4",
  textSecondary: "#9CA3AF",
  textMuted:     "#6B7280",
  online:        "#34D399",
  offline:       "#EF4444",
  warning:       "#FBBF24",
} as const;

export const GRADIENTS = {
  cardBorder:  ["rgba(99, 102, 241, 0.3)", "rgba(99, 102, 241, 0.0)"],
  accentFade:  ["#6366F1", "#4F46E5"],
  darkOverlay: ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.95)"],
} as const;
