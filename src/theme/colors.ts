/**
 * Halcyon Design System — 100% Pure Pitch Black Theme (#000000)
 * 
 * Absolute pure pitch black (#000000) everywhere, zero gray tint,
 * sharp refractive cyan borders, razor-sharp metallic cyan accents.
 */

export const colors = {
  // ─── Primary Brand Accent (Liquid Cyan / Neon Teal) ───
  primary: {
    50: '#E6FFFF',
    100: '#B3FFFF',
    200: '#80FFFE',
    300: '#4DFFFC',
    400: '#34F5E6', // ← Halcyon Liquid Cyan Accent
    500: '#20E5D5',
    600: '#13C4B5',
    700: '#0AA396',
    800: '#048278',
    900: '#016159',
  },

  // ─── Secondary Accent (Crystal Blue) ───────────────────
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#78D7FF',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // ─── Backgrounds (100% Pure Pitch Black) ──────────────
  background: {
    primary: '#000000',    // Pure Pitch Black
    secondary: '#000000',  // Pure Pitch Black
    tertiary: '#000000',   // Pure Pitch Black
    elevated: '#000000',   // Pure Pitch Black
  },

  // ─── Surfaces (100% Pure Pitch Black) ─────────────────
  surface: {
    default: '#000000',
    light: '#000000',
    lighter: '#000000',
    glass: 'rgba(0, 0, 0, 1)',
    glassCard: '#000000',
    glassElevated: '#000000',
    glassHighlight: 'rgba(52, 245, 230, 0.1)',
    glassUltra: '#000000',
  },

  // ─── Borders (Sharp Refractive Cyan) ──────────────────
  border: {
    default: 'rgba(52, 245, 230, 0.25)',
    light: 'rgba(52, 245, 230, 0.15)',
    medium: 'rgba(52, 245, 230, 0.3)',
    focus: '#34F5E6',
    error: '#FF6478',
    subtle: 'rgba(52, 245, 230, 0.2)',
    glassHighlight: 'rgba(52, 245, 230, 0.35)',
  },

  // ─── Text ──────────────────────────────────────────
  text: {
    primary: '#FFFFFF',     // Pure brilliant white
    secondary: '#B8C6D8',   // Soft blue-gray
    tertiary: '#8390A5',    // Muted obsidian
    inverse: '#000000',     // Pure black text on white
    link: '#34F5E6',        // Cyan links
    placeholder: '#4A5568', // Deep muted slate
    accent: '#78D7FF',      // Crystal blue text
  },

  // ─── Status Colors ─────────────────────────────────
  success: {
    default: '#22F2B4',
    bg: 'rgba(34, 242, 180, 0.05)',
    border: 'rgba(34, 242, 180, 0.25)',
  },

  warning: {
    default: '#FFB648',
    bg: 'rgba(255, 182, 72, 0.05)',
    border: 'rgba(255, 182, 72, 0.25)',
  },

  error: {
    default: '#FF6478',
    bg: 'rgba(255, 100, 120, 0.05)',
    border: 'rgba(255, 100, 120, 0.25)',
  },

  info: {
    default: '#78D7FF',
    bg: 'rgba(120, 215, 255, 0.05)',
    border: 'rgba(120, 215, 255, 0.25)',
  },

  // ─── Gradients & Glows ─────────────────────────────
  gradients: {
    primary: ['#34F5E6', '#78D7FF'] as const,
    accent: ['#78D7FF', '#34F5E6'] as const,
    dark: ['#000000', '#000000'] as const,
    hero: ['#000000', '#000000', '#000000'] as const,
    card: ['#000000', '#000000'] as const,
    button: ['#000000', '#000000'] as const,
    cyanGlow: ['rgba(52, 245, 230, 0.3)', 'rgba(52, 245, 230, 0)'] as const,
    glassHighlight: ['rgba(52, 245, 230, 0.15)', 'rgba(52, 245, 230, 0.02)'] as const,
  },

  // ─── Button Palette ────────────────────────────────
  button: {
    primary: '#000000',
    primaryText: '#FFFFFF',
    secondary: 'transparent',
    secondaryText: '#34F5E6',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
