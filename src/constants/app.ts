/**
 * Halcyon — App Constants
 */

export const APP = {
  NAME: 'Halcyon',
  TAGLINE: 'Incident memory, calmed.',
  SUBTITLE: 'AI-Powered Incident Intelligence',
  DESCRIPTION: 'Instantly resolve system alerts by tapping into an active, self-learning institutional memory of past fixes.',
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.halcyon.mobile',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'halcyon_auth_token',
  REFRESH_TOKEN: 'halcyon_refresh_token',
  USER_DATA: 'halcyon_user_data',
  ONBOARDING_COMPLETE: 'halcyon_onboarding_complete',
  THEME_MODE: 'halcyon_theme_mode',
} as const;

export const TIMING = {
  SPLASH_DURATION: 2500,
  TOAST_DURATION: 3000,
  DEBOUNCE_MS: 300,
  API_TIMEOUT: 10000,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;
