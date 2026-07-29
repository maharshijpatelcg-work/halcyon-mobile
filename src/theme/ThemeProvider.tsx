/**
 * Halcyon Theme Provider
 * 
 * Provides theme values via React Context.
 * Currently dark-mode only (matching Halcyon brand).
 */

import React, { createContext, useContext, useMemo } from 'react';
import { colors } from './colors';
import { fontFamilies, fontSizes, textStyles } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';
import { durations, springConfigs, easings, timingConfigs } from './animations';

export interface Theme {
  colors: typeof colors;
  fonts: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  durations: typeof durations;
  springs: typeof springConfigs;
  easings: typeof easings;
  timingConfigs: typeof timingConfigs;
  isDark: boolean;
}

const theme: Theme = {
  colors,
  fonts: fontFamilies,
  fontSizes,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  durations,
  springs: springConfigs,
  easings,
  timingConfigs,
  isDark: true,
};

const ThemeContext = createContext<Theme>(theme);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useMemo(() => theme, []);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
