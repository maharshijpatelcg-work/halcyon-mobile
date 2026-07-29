/**
 * Halcyon — Haptic Feedback Utilities
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

export async function lightHaptic() {
  if (isHapticsAvailable) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export async function mediumHaptic() {
  if (isHapticsAvailable) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export async function heavyHaptic() {
  if (isHapticsAvailable) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

export async function successHaptic() {
  if (isHapticsAvailable) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

export async function errorHaptic() {
  if (isHapticsAvailable) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export async function warningHaptic() {
  if (isHapticsAvailable) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

export async function selectionHaptic() {
  if (isHapticsAvailable) {
    await Haptics.selectionAsync();
  }
}
