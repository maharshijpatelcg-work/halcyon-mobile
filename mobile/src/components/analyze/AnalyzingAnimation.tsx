import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../providers/ThemeProvider";

export function AnalyzingAnimation() {
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);
  const { colors } = useTheme();

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1, true,
    );
    rotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);
  }, [pulse, rotation]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1.4 - pulse.value,
  }));
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80, backgroundColor: colors.background }}>
      <View style={{ width: 112, height: 112, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[
            { position: "absolute", width: 96, height: 96, borderRadius: 48, backgroundColor: "rgba(99,102,241,0.2)", borderWidth: 1, borderColor: "rgba(99,102,241,0.3)" },
            pulseStyle,
          ]}
        />
        <Animated.View
          style={[
            { position: "absolute", width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(129,140,248,0.5)" },
            rotateStyle,
          ]}
        />
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff" }} />
        </View>
      </View>
      <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginTop: 32, marginBottom: 8 }}>
        HALCYON Analyzing
      </Text>
      <Text style={{ fontSize: 12, color: colors.textMuted, textAlign: "center", maxWidth: 280, lineHeight: 18 }}>
        Consulting hindsight memory and running cascadeflow routing pipeline...
      </Text>
    </View>
  );
}
