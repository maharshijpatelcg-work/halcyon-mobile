/**
 * Halcyon Design System — Liquid Obsidian Layout & Spacing
 * 
 * 4px base grid system with 16-24px rounded glass card corners.
 */
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE = 4;

export const spacing = {
  '2xs': BASE,       // 4
  xs: BASE * 2,      // 8
  sm: BASE * 3,      // 12
  md: BASE * 4,      // 16
  base: BASE * 5,    // 20
  lg: BASE * 6,      // 24
  xl: BASE * 8,      // 32
  '2xl': BASE * 10,  // 40
  '3xl': BASE * 12,  // 48
  '4xl': BASE * 16,  // 64
} as const;

export const borderRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 16,     // 16px (Liquid Glass card standard)
  lg: 20,     // 20px (Elevated Obsidian card)
  xl: 24,     // 24px (Large Crystal panel)
  '2xl': 32,
  full: 9999,
} as const;

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
} as const;

export function scale(size: number): number {
  const scaleRatio = SCREEN_WIDTH / 375;
  const newSize = size * scaleRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function moderateScale(size: number, factor: number = 0.5): number {
  return size + (scale(size) - size) * factor;
}

export function getHorizontalPadding(): number {
  if (screen.isTablet) return spacing['2xl'];
  if (screen.isLarge) return spacing.lg;
  return spacing.base;
}

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type IconSizes = typeof iconSizes;
