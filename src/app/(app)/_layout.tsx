/**
 * Halcyon — Main Application Layout & Bottom Tab Navigation
 * 
 * Top-level navigator for protected dashboard screens.
 * Integrates custom TabBar for seamless switching across:
 *  1. Dashboard
 *  2. Incidents (Feed & Detail)
 *  3. Knowledge Base
 *  4. Audit Trail
 *  5. Settings
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect, Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TabBar, type TabItem } from '@/components/ui/TabBar';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/landing" />;
  }

  // Derive active tab from current route pathname
  let activeTab = 'dashboard';
  if (pathname.includes('/incidents')) activeTab = 'incidents';
  else if (pathname.includes('/knowledge')) activeTab = 'knowledge';
  else if (pathname.includes('/audit')) activeTab = 'audit';
  else if (pathname.includes('/settings')) activeTab = 'settings';

  const handleTabPress = (tab: TabItem) => {
    router.push(tab.route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
});
