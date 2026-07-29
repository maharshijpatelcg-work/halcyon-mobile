/**
 * Halcyon Design System — Typography
 * 
 * Matches the Halcyon website:
 *  - Headers: Bold, large
 *  - Body: Inter Regular/Medium
 *  - Labels/Badges: Monospace, uppercase, tracking-wider
 */

export const fontFamilies = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  // Monospace for labels, badges, and technical text (system monospace)
  mono: 'SpaceMono-Regular',
} as const;

export const fontSizes = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const letterSpacings = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1.5,
  widest: 3,
};

/**
 * Pre-built text style presets matching Halcyon web
 */
export const textStyles = {
  // ─── Headings (Bold, tight tracking) ──────────
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tighter,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tighter,
  },
  h3: {
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },

  // ─── Body ─────────────────────────────────────
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },

  // ─── Monospace Labels (Halcyon signature style) ─
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    lineHeight: fontSizes['2xs'] * lineHeights.normal,
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase' as const,
  },

  // ─── Buttons (Monospace uppercase — Halcyon style) ─
  buttonLarge: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.tight,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.tight,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },
  buttonSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    lineHeight: fontSizes['2xs'] * lineHeights.tight,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },

  // ─── Caption / Meta ───────────────────────────
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  meta: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    lineHeight: fontSizes['2xs'] * lineHeights.normal,
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TextStyles = typeof textStyles;
