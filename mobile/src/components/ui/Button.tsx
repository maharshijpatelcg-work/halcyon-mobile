import React from "react";
import { Pressable, Text, ActivityIndicator, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../../providers/ThemeProvider";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Premium button with spring press animation, loading state, multiple variants.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const { isDark } = useTheme();

  const VARIANT_STYLES: Record<ButtonVariant, { bg: string; border: string; textColor: string }> = {
    primary:   { bg: "#6366F1", border: "transparent",          textColor: "#FFFFFF" },
    secondary: { bg: isDark ? "#1A1A26" : "#F0F0F5", border: isDark ? "#2A2A3C" : "#D1D5DB", textColor: isDark ? "#F1F1F4" : "#111827" },
    ghost:     { bg: "transparent", border: "transparent",       textColor: "#818CF8" },
    danger:    { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.2)", textColor: "#EF4444" },
  };

  const vs = VARIANT_STYLES[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: vs.bg,
          borderColor: vs.border,
          borderWidth: vs.border === "transparent" ? 0 : 1,
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 14,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.textColor} />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: vs.textColor,
              fontSize: 14,
              fontWeight: "600",
              marginLeft: icon ? 8 : 0,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
