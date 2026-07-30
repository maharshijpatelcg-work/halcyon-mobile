/**
 * Halcyon — Security & Access Control Screen
 * 
 * 2FA configuration, active operator sessions, and API keys.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getSecuritySettings, toggleTwoFactor } from '@/services/data/settingsService';
import type { SecuritySettings } from '@/types/settings';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [security, setSecurity] = useState<SecuritySettings | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getSecuritySettings();
      setSecurity(data);
    }
    load();
  }, []);

  const handle2FAToggle = async () => {
    const updated = await toggleTwoFactor();
    setSecurity(updated);
    showToast(`2-Factor Authentication ${updated.twoFactorEnabled ? 'enabled' : 'disabled'}`, 'info');
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
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backText}>← SETTINGS</Text>
          </Pressable>

          <Text style={styles.topBarTitle}>SECURITY & COMPLIANCE</Text>
          <Text style={styles.mainTitle}>Security Settings</Text>
          <Text style={styles.mainSubtitle}>
            Manage multi-factor authentication, active operator sessions, and workspace API keys.
          </Text>

          {/* Section 1: Authentication */}
          <SectionHeader title="AUTHENTICATION & 2FA" />
          <Card variant="glass" style={styles.cardGroup}>
            <SettingsRow
              icon="🛡️"
              title="Two-Factor Authentication (2FA)"
              subtitle="Require authenticator app code on login"
              isToggle
              toggleValue={security?.twoFactorEnabled ?? false}
              onToggleChange={handle2FAToggle}
            />
            <SettingsRow
              icon="🔑"
              title="Change Password"
              subtitle="Update your workspace account password"
              onPress={() => showToast('Password reset link sent to your email', 'info')}
            />
          </Card>

          {/* Section 2: API Keys */}
          <SectionHeader title="WORKSPACE API KEYS" actionTitle="+ CREATE KEY" onAction={() => showToast('API Key generated!', 'success')} />
          <Card variant="glass" style={styles.cardGroup}>
            {security?.apiKeys.map((key) => (
              <View key={key.id} style={styles.keyRow}>
                <View>
                  <Text style={styles.keyName}>{key.name}</Text>
                  <Text style={styles.keyPrefix}>{key.prefix}•••••••••••••</Text>
                </View>
                <View style={styles.keyMeta}>
                  <Text style={styles.keyDate}>Created {new Date(key.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Section 3: Active Sessions */}
          <SectionHeader title="ACTIVE OPERATOR SESSIONS" />
          <Card variant="glass" style={styles.cardGroup}>
            {security?.activeSessions.map((s) => (
              <View key={s.id} style={styles.sessionRow}>
                <View>
                  <Text style={styles.deviceText}>{s.device} {s.current && '(CURRENT)'}</Text>
                  <Text style={styles.locText}>{s.location} • Last active {new Date(s.lastActive).toLocaleTimeString()}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.xs, marginBottom: spacing.sm },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.primary[400], letterSpacing: letterSpacings.wider },
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5, marginBottom: 2 },
  mainSubtitle: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: spacing.lg },
  cardGroup: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: 0, overflow: 'hidden', marginBottom: spacing.md },
  keyRow: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.06)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  keyName: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, color: colors.text.primary },
  keyPrefix: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.primary[400] },
  keyMeta: { alignItems: 'flex-end' },
  keyDate: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary },
  sessionRow: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.06)' },
  deviceText: { fontFamily: fontFamilies.bold, fontSize: fontSizes.xs, color: colors.text.primary },
  locText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary },
});
