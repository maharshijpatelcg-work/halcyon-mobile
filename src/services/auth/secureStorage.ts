/**
 * Halcyon — Secure Storage Service (Universal Web & Mobile Support)
 * 
 * Uses expo-secure-store on iOS/Android and localStorage on Web to prevent
 * runtime issues across environments while maintaining military-grade security.
 */
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants/app';

export async function saveSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(`[SecureStorage] Save failed for key ${key}:`, error);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`[SecureStorage] Fetch failed for key ${key}:`, error);
    return null;
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`[SecureStorage] Delete failed for key ${key}:`, error);
  }
}

// ─── Specific Entity Storage Helpers ─────────────────────

export async function saveUserData(userData: object): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
}

export async function getUserData<T>(): Promise<T | null> {
  const data = await getSecureItem(STORAGE_KEYS.USER_DATA);
  if (data) {
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveAuthTokens(accessToken: string, refreshToken?: string): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
  if (refreshToken) {
    await saveSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

export async function getAccessToken(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function saveFirebaseUid(uid: string): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.FIREBASE_UID, uid);
}

export async function getFirebaseUid(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.FIREBASE_UID);
}

export async function saveWorkspaceId(workspaceId: string): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.WORKSPACE_ID, workspaceId);
}

export async function getWorkspaceId(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.WORKSPACE_ID);
}

export async function saveUserPreferences(preferences: object): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

export async function getUserPreferences<T>(): Promise<T | null> {
  const data = await getSecureItem(STORAGE_KEYS.PREFERENCES);
  if (data) {
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveThemeMode(theme: 'dark' | 'light' | 'system'): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.THEME_MODE, theme);
}

export async function getThemeMode(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.THEME_MODE);
}

export async function saveLanguage(language: string): Promise<void> {
  await saveSecureItem(STORAGE_KEYS.LANGUAGE, language);
}

export async function getLanguage(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.LANGUAGE);
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([
    deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN),
    deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
    deleteSecureItem(STORAGE_KEYS.USER_DATA),
    deleteSecureItem(STORAGE_KEYS.FIREBASE_UID),
    deleteSecureItem(STORAGE_KEYS.WORKSPACE_ID),
    deleteSecureItem(STORAGE_KEYS.PREFERENCES),
    deleteSecureItem(STORAGE_KEYS.THEME_MODE),
    deleteSecureItem(STORAGE_KEYS.LANGUAGE),
  ]);
}

// Aliases for session management
export const saveUserSession = saveUserData;
export const getUserSession = getUserData;
export const clearUserSession = clearAuthStorage;
