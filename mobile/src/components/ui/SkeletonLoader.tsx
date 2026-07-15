import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../providers/ThemeProvider";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export function SkeletonLoader({ width = "100%", height = 16, borderRadius = 8 }: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);
  const { isDark } = useTheme();

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: isDark ? "#2A2A3C" : "#D1D5DB",
          width: typeof width === "number" ? width : undefined,
          height,
          borderRadius,
          alignSelf: typeof width === "string" ? "stretch" : undefined,
        },
        animatedStyle,
      ]}
    />
  );
}

export function SkeletonCard() {
  const { isDark } = useTheme();
  return (
    <View style={{ backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderColor: isDark ? "#2A2A3C" : "#E5E7EB", borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <SkeletonLoader width={80} height={22} borderRadius={12} />
        <SkeletonLoader width={60} height={14} />
      </View>
      <SkeletonLoader height={18} />
      <View style={{ height: 8 }} />
      <SkeletonLoader width={200} height={14} />
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonLoader width={50} height={20} borderRadius={10} />
        <SkeletonLoader width={65} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

export function SkeletonStatCard() {
  const { isDark } = useTheme();
  return (
    <View style={{ backgroundColor: isDark ? "#1A1A26" : "#FFFFFF", borderColor: isDark ? "#2A2A3C" : "#E5E7EB", borderWidth: 1, borderRadius: 16, padding: 16, flex: 1 }}>
      <SkeletonLoader width={40} height={12} />
      <View style={{ height: 8 }} />
      <SkeletonLoader width={60} height={28} />
      <View style={{ height: 4 }} />
      <SkeletonLoader width={50} height={10} />
    </View>
  );
}
