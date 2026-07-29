/**
 * Halcyon Design System — Animation Presets
 * 
 * Reanimated-compatible timing and spring configurations.
 */
import { Easing } from 'react-native-reanimated';

// ─── Timing Durations ───────────────────────────
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  splash: 2500,
} as const;

// ─── Easing Presets ─────────────────────────────
export const easings = {
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),
  sharp: Easing.bezier(0.4, 0, 0.6, 1),
} as const;

// ─── Spring Configs ─────────────────────────────
export const springConfigs = {
  snappy: {
    damping: 15,
    stiffness: 250,
    mass: 0.5,
  },
  bouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
  gentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  stiff: {
    damping: 25,
    stiffness: 400,
    mass: 0.5,
  },
} as const;

// ─── Stagger Helpers ────────────────────────────
export const staggerDelay = (index: number, baseDelay: number = 100) =>
  index * baseDelay;

export const staggerDelaySequential = (
  index: number,
  total: number,
  totalDuration: number = 600
) => (index / total) * totalDuration;

// ─── Common withTiming configs ──────────────────
export const timingConfigs = {
  fadeIn: {
    duration: durations.normal,
    easing: easings.easeOut,
  },
  fadeOut: {
    duration: durations.fast,
    easing: easings.easeIn,
  },
  slideIn: {
    duration: durations.normal,
    easing: easings.easeOut,
  },
  slideOut: {
    duration: durations.fast,
    easing: easings.easeIn,
  },
  scalePress: {
    duration: durations.instant,
    easing: easings.easeInOut,
  },
} as const;

export type Durations = typeof durations;
export type SpringConfigs = typeof springConfigs;
