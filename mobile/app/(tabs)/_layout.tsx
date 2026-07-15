import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTranslation } from "../../src/providers/LanguageProvider";
import { useTheme } from "../../src/providers/ThemeProvider";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: isDark ? "#6B7280" : "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboard"),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 8, padding: 4 } : { padding: 4 }}>
              <Ionicons name={focused ? "grid" : "grid-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: t("incidents"),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 8, padding: 4 } : { padding: 4 }}>
              <Ionicons name={focused ? "warning" : "warning-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: t("analyze"),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 8, padding: 4 } : { padding: 4 }}>
              <Ionicons name={focused ? "scan" : "scan-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("account"),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 8, padding: 4 } : { padding: 4 }}>
              <Ionicons name={focused ? "person" : "person-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: 8, padding: 4 } : { padding: 4 }}>
              <Ionicons name={focused ? "cog" : "cog-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
