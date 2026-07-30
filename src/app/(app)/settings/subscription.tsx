/**
 * Halcyon — Subscription & Tier Upgrade Screen
 * 
 * Free vs Pro vs Enterprise tier comparison & usage meters.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getSubscription } from '@/services/data/settingsService';
import type { SubscriptionInfo } from '@/types/settings';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [sub, setSub] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getSubscription();
      setSub(data);
    }
    load();
  }, []);

  const handleUpgrade = (tier: string) => {
    showToast(`Upgrade to ${tier} initiated!`, 'info');
  };

  const logsPercent = sub ? Math.round((sub.logsUsed / sub.logsLimit) * 100) : 28;

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

          <Text style={styles.topBarTitle}>WORKSPACE SUBSCRIPTION</Text>
          <Text style={styles.mainTitle}>Subscription Plan</Text>
          <Text style={styles.mainSubtitle}>
            Current tier usage, telemetry limits, and enterprise upgrades.
          </Text>

          {/* Current Usage Meter */}
          <Card variant="glass" style={styles.usageCard}>
            <Text style={styles.cardLabel}>DAILY LOG USAGE</Text>
            <View style={styles.meterRow}>
              <Text style={styles.meterVal}>{sub?.logsUsed || 142} / {sub?.logsLimit || 500} Logs</Text>
              <Text style={styles.meterPercent}>{logsPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${logsPercent}%` }]} />
            </View>
          </Card>

          {/* Tier Cards */}
          <SectionHeader title="AVAILABLE PLANS" />
          <View style={styles.tierGrid}>
            {/* FREE TIER */}
            <Card variant="glass" style={[styles.tierCard, styles.currentTier]}>
              <Text style={styles.tierName}>FREE TIER</Text>
              <Text style={styles.tierPrice}>$0 <Text style={styles.perMonth}>/ mo</Text></Text>
              <Text style={styles.tierDesc}>For small teams monitoring single clusters.</Text>

              <View style={styles.featureList}>
                <Text style={styles.featureItem}>✓ 500 logs/day telemetry</Text>
                <Text style={styles.featureItem}>✓ 5 AI auto-resolutions/day</Text>
                <Text style={styles.featureItem}>✓ 100 Knowledge Base vectors</Text>
                <Text style={styles.featureItem}>✓ Email notifications</Text>
              </View>

              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
              </View>
            </Card>

            {/* PRO TIER */}
            <Card variant="glass" style={styles.tierCard}>
              <Text style={styles.tierName}>PRO PLAN</Text>
              <Text style={styles.tierPrice}>$49 <Text style={styles.perMonth}>/ mo</Text></Text>
              <Text style={styles.tierDesc}>For growing engineering teams requiring high-frequency AI analysis.</Text>

              <View style={styles.featureList}>
                <Text style={styles.featureItem}>✓ 50,000 logs/day telemetry</Text>
                <Text style={styles.featureItem}>✓ Unlimited AI auto-resolutions</Text>
                <Text style={styles.featureItem}>✓ Unlimited Knowledge Base</Text>
                <Text style={styles.featureItem}>✓ GitHub PR Auto-Fixes</Text>
                <Text style={styles.featureItem}>✓ Push & Slack alerts</Text>
              </View>

              <Button title="UPGRADE TO PRO" onPress={() => handleUpgrade('PRO')} variant="cyan" size="sm" />
            </Card>
          </View>
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
  usageCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.lg, marginBottom: spacing.lg },
  cardLabel: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.primary[400], letterSpacing: letterSpacings.wider, marginBottom: 4 },
  meterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  meterVal: { fontFamily: fontFamilies.bold, fontSize: fontSizes.base, color: colors.text.primary },
  meterPercent: { fontFamily: fontFamilies.mono, fontSize: fontSizes.sm, color: colors.primary[400], fontWeight: 'bold' },
  progressTrack: { height: 6, backgroundColor: '#1A1A1A', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary[400], borderRadius: 3 },
  tierGrid: { gap: spacing.md },
  tierCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: spacing.lg },
  currentTier: { borderColor: 'rgba(255, 255, 255, 0.2)' },
  tierName: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.primary[400], letterSpacing: letterSpacings.wider },
  tierPrice: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, marginVertical: 4 },
  perMonth: { fontSize: fontSizes.xs, color: colors.text.tertiary, fontFamily: fontFamilies.regular },
  tierDesc: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: spacing.md },
  featureList: { gap: 6, marginBottom: spacing.lg },
  featureItem: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.text.secondary },
  currentBadge: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, paddingVertical: 6, alignItems: 'center' },
  currentBadgeText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary, letterSpacing: letterSpacings.wider },
});
