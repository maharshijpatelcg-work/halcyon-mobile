/**
 * Halcyon Design System — Clean Shadows & Lighting
 * 
 * Clean shadow factory, zero outer glows or shine halos.
 */
import { Platform } from 'react-native';

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

const createShadow = (
  color: string,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: Platform.OS === 'ios' ? opacity : 1,
  shadowRadius: radius,
  elevation,
});

export const shadows = {
  none: createShadow('#000000', 0, 0, 0, 0),
  sm: createShadow('#000000', 2, 0.3, 4, 2),
  md: createShadow('#000000', 4, 0.4, 8, 4),
  lg: createShadow('#000000', 8, 0.5, 16, 8),
  xl: createShadow('#000000', 12, 0.6, 24, 12),

  // Standard card depth without glows
  glassCard: createShadow('#000000', 4, 0.4, 8, 4),
  glassCardElevated: createShadow('#000000', 8, 0.5, 16, 8),

  // Glows set to clean subtle shadows
  cyanGlow: createShadow('#000000', 0, 0, 0, 0),
  cyanGlowIntense: createShadow('#000000', 0, 0, 0, 0),
  cyanGlowSubtle: createShadow('#000000', 0, 0, 0, 0),

  blueGlow: createShadow('#000000', 0, 0, 0, 0),
  successGlow: createShadow('#000000', 0, 0, 0, 0),
  errorGlow: createShadow('#000000', 0, 0, 0, 0),
  warningGlow: createShadow('#000000', 0, 0, 0, 0),

  inputFocus: createShadow('#000000', 0, 0, 0, 0),
  buttonGlow: createShadow('#000000', 0, 0, 0, 0),
} as const;

export type Shadows = typeof shadows;
