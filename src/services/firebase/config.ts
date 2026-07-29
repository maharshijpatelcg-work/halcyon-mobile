/**
 * Halcyon — Firebase Configuration
 * 
 * Uses @react-native-firebase which auto-reads configuration from
 * google-services.json (Android) and GoogleService-Info.plist (iOS).
 * 
 * This module lazy-loads Firebase to avoid crash when config files
 * are missing (e.g., running in Expo Go or web preview).
 */

export function getFirebaseAuth() {
  try {
    const auth = require('@react-native-firebase/auth').default;
    return auth();
  } catch (e) {
    console.warn('[Firebase] Not configured or not available in this environment:', e);
    return null;
  }
}
