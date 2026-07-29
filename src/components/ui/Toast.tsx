/**
 * Halcyon — Official Brand Toast System
 * 
 * Floating glass notification pills with official shield icon and accent borders.
 */
import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { durations, easings } from '@/theme/animations';
import { TIMING } from '@/constants/app';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

const SHIELD_ASSET = require('../../assets/logo/halcyon-icon.png');

const TOAST_CONFIG: Record<ToastType, { bg: string; border: string; accentColor: string }> = {
  success: { bg: 'rgba(13, 17, 26, 0.95)', border: colors.success.border, accentColor: colors.success.default },
  error: { bg: 'rgba(13, 17, 26, 0.95)', border: colors.error.border, accentColor: colors.error.default },
  warning: { bg: 'rgba(13, 17, 26, 0.95)', border: colors.warning.border, accentColor: colors.warning.default },
  info: { bg: 'rgba(13, 17, 26, 0.95)', border: colors.border.subtle, accentColor: colors.primary[400] },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);
  const config = TOAST_CONFIG[toast.type];

  useEffect(() => {
    translateY.value = withTiming(0, { duration: durations.normal, easing: easings.easeOut });
    opacity.value = withTiming(1, { duration: durations.normal });

    const timeout = toast.duration ?? TIMING.TOAST_DURATION;
    translateY.value = withDelay(
      timeout,
      withTiming(-80, { duration: durations.fast, easing: easings.easeIn })
    );
    opacity.value = withDelay(timeout, withTiming(0, { duration: durations.fast }, () => {
      runOnJS(onDismiss)(toast.id);
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.toast, { backgroundColor: config.bg, borderColor: config.border }, animatedStyle]}>
      <View style={[styles.toastIconBox, { borderColor: config.border }]}>
        <Image source={SHIELD_ASSET} style={styles.shieldImg} resizeMode="contain" />
      </View>
      <Text style={styles.toastText} numberOfLines={2}>{toast.message}</Text>
      <Pressable onPress={() => onDismiss(toast.id)} hitSlop={12}>
        <Text style={styles.toastDismiss}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const insets = useSafeAreaInsets();
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast_${++counter.current}`;
    setToasts(prev => [...prev.slice(-2), { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={[styles.container, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - spacing.base * 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  toastIconBox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  shieldImg: {
    width: 18,
    height: 18,
  },
  toastText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    lineHeight: fontSizes.sm * 1.4,
  },
  toastDismiss: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
