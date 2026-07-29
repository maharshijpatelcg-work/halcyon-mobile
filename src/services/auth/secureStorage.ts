/**
 * Halcyon — Secure Storage Service (Universal Web & Mobile Support)
 * 
 * Uses expo-secure-store on iOS/Android and localStorage on Web to prevent
 * "getValueWithKeyAsync is not a function" errors in web previews.
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
    // Silently ignore fallback issues
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
    // Silently ignore cleanup errors
  }
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([
    deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN),
    deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
    deleteSecureItem(STORAGE_KEYS.USER_DATA),
  ]);
}

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

// Aliases for universal session handling
export const saveUserSession = saveUserData;
export const getUserSession = getUserData;
export const clearUserSession = clearAuthStorage;
