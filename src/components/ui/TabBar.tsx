/**
 * Halcyon — Custom TabBar Component
 * 
 * Bottom navigation bar matching Halcyon pitch-black obsidian theme.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export const TABS: TabItem[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: '⚡', route: '/(app)/dashboard' },
  { id: 'incidents', label: 'INCIDENTS', icon: '🚨', route: '/(app)/incidents' },
  { id: 'knowledge', label: 'MEMORY', icon: '🧠', route: '/(app)/knowledge' },
  { id: 'audit', label: 'AUDIT', icon: '📈', route: '/(app)/audit' },
  { id: 'settings', label: 'SETTINGS', icon: '⚙️', route: '/(app)/settings' },
];

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: TabItem) => void;
}

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeGlowLine} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 245, 230, 0.2)',
    paddingTop: spacing.xs + 2,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    position: 'relative',
    flex: 1,
  },
  tabButtonActive: {},
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  tabLabelActive: {
    color: colors.primary[400],
    fontFamily: fontFamilies.bold,
  },
  activeGlowLine: {
    position: 'absolute',
    top: -6,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: colors.primary[400],
    borderRadius: 1,
    shadowColor: colors.primary[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
