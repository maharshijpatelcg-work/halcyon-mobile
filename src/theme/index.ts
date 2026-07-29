/**
 * Halcyon Design System — Unified Export
 */

export { colors } from './colors';
export type { Colors } from './colors';

export { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacings, textStyles } from './typography';
export type { TextStyles } from './typography';

export { spacing, borderRadius, iconSizes } from './spacing';
export type { Spacing, BorderRadius } from './spacing';

export { shadows } from './shadows';
export type { Shadows, ShadowStyle } from './shadows';

export {
  durations,
  easings,
  springConfigs,
  staggerDelay,
  staggerDelaySequential,
  timingConfigs,
} from './animations';
export type { Durations, SpringConfigs } from './animations';

// Re-export the theme provider
export { ThemeProvider, useTheme } from './ThemeProvider';
