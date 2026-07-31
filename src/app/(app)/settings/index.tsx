/**
 * Halcyon — Settings Hub Screen
 * 
 * Central control room for Profile, Workspace, GitHub Integration, Notifications, Security, and Subscription.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getNotificationPrefs, updateNotificationPrefs, getGitHubConnection } from '@/services/data/settingsService';
import type { NotificationPrefs, GitHubConnection } from '@/types/settings';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs | null>(null);
  const [github, setGithub] = useState<GitHubConnection | null>(null);

  useEffect(() => {
    async function load() {
      const p = await getNotificationPrefs();
      const g = await getGitHubConnection();
      setNotifPrefs(p);
      setGithub(g);
    }
    load();
  }, []);

  const handleTogglePush = async (val: boolean) => {
    if (!notifPrefs) return;
    const updated = await updateNotificationPrefs({ pushEnabled: val });
    setNotifPrefs(updated);
    showToast(`Push notifications ${val ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleToggleEmail = async (val: boolean) => {
    if (!notifPrefs) return;
    const updated = await updateNotificationPrefs({ emailEnabled: val });
    setNotifPrefs(updated);
    showToast(`Email alerts ${val ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (e: any) {
      showToast(e.message || 'Sign out failed', 'error');
    }
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: hPad,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxContainer}>
          <Text style={styles.topBarTitle}>SETTINGS & INTEGRATIONS</Text>
          <Text style={styles.mainTitle}>Settings Hub</Text>
          <Text style={styles.mainSubtitle}>
            Workspace permissions, GitHub OAuth webhooks, and security preferences.
          </Text>

          {/* Profile Card */}
          <Card variant="glass" style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user?.displayName?.[0] || 'E'}</Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={styles.profileName}>{user?.displayName || 'Engineer'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>ADMIN OPERATOR</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Section 1: Integrations */}
          <SectionHeader title="INTEGRATIONS & WORKSPACE" />
          <Card variant="glass" style={styles.settingsGroupCard}>
            <SettingsRow
              icon="🐙"
              title="GitHub Integration"
              subtitle={github?.connected ? `Connected as @${github.username}` : 'Connect repositories & webhooks'}
              valueText={github?.connected ? 'CONNECTED' : 'DISCONNECTED'}
              onPress={() => router.push('/(app)/settings/github' as any)}
            />
            <SettingsRow
              icon="🏢"
              title="Workspace Management"
              subtitle="Halcyon Production (us-east-1)"
              valueText="5 Members"
              onPress={() => showToast('Workspace settings opened', 'info')}
            />
            <SettingsRow
              icon="💳"
              title="Subscription Tier"
              subtitle="Free Tier • 142/500 logs today"
              valueText="FREE"
              onPress={() => router.push('/(app)/settings/subscription' as any)}
            />
          </Card>

          {/* Section 2: Notifications */}
          <SectionHeader title="NOTIFICATION PREFERENCES" />
          <Card variant="glass" style={styles.settingsGroupCard}>
            <SettingsRow
              icon="🔔"
              title="Push Notifications"
              subtitle="Instant alerts for Critical & High incidents"
              isToggle
              toggleValue={notifPrefs?.pushEnabled ?? true}
              onToggleChange={handleTogglePush}
            />
            <SettingsRow
              icon="✉️"
              title="Email Daily Digest"
              subtitle="Receive daily incident resolution summary"
              isToggle
              toggleValue={notifPrefs?.emailEnabled ?? true}
              onToggleChange={handleToggleEmail}
            />
          </Card>

          {/* Section 3: Security */}
          <SectionHeader title="SECURITY & ACCESS" />
          <Card variant="glass" style={styles.settingsGroupCard}>
            <SettingsRow
              icon="🔒"
              title="Security & 2FA"
              subtitle="Password, 2-Factor Auth, and Active Sessions"
              onPress={() => router.push('/(app)/settings/security' as any)}
            />
            <SettingsRow
              icon="🔑"
              title="API Keys"
              subtitle="1 active Production key"
              valueText="1 KEY"
              onPress={() => router.push('/(app)/settings/security' as any)}
            />
          </Card>

          {/* Section 4: Account Actions */}
          <SectionHeader title="ACCOUNT" />
          <Card variant="glass" style={styles.settingsGroupCard}>
            <SettingsRow
              icon="[→"
              title="Log Out Workspace"
              subtitle="Safely disconnect current operator session"
              onPress={handleSignOut}
              showChevron={false}
            />
            <SettingsRow
              icon="⚠️"
              title="Delete Workspace Account"
              subtitle="Permanently remove all logs & telemetry data"
              destructive
              onPress={() => showToast('Account deletion requires admin authorization', 'error')}
              showChevron={false}
            />
          </Card>

          <View style={styles.versionFooter}>
            <Text style={styles.versionText}>HALCYON AI ENGINE v1.0.4-PROD</Text>
            <Text style={styles.versionText}>BUILD 2026.07.29 • STABLE NOC NODE</Text>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5, marginBottom: 2 },
  mainSubtitle: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: spacing.lg },
  profileCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.lg, marginBottom: spacing.md },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary[400], alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { fontFamily: fontFamilies.bold, fontSize: fontSizes.xl, color: '#000000' },
  profileMeta: { flex: 1 },
  profileName: { fontFamily: fontFamilies.bold, fontSize: fontSizes.lg, color: colors.text.primary },
  profileEmail: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: 4 },
  roleBadge: { backgroundColor: 'rgba(52, 245, 230, 0.1)', borderWidth: 1, borderColor: 'rgba(52, 245, 230, 0.3)', borderRadius: borderRadius.xs, paddingVertical: 2, paddingHorizontal: 6, alignSelf: 'flex-start' },
  roleText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.primary[400], fontWeight: 'bold' },
  settingsGroupCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: 0, overflow: 'hidden', marginBottom: spacing.md },
  versionFooter: { alignItems: 'center', marginTop: spacing.xl, paddingBottom: spacing.lg },
  versionText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
});
