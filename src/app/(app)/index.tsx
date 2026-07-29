/**
 * Halcyon — Full Web-Identical Enterprise Telemetry Dashboard
 * 
 * Pixel-perfect mobile & desktop implementation matching the official web dashboard:
 *  - Top status bar: INCIDENT FEED - TELEMETRY LOGS | SYSTEM: STABLE
 *  - Title & Action Buttons: RESET DATABASE & SIMULATE SCENARIO
 *  - 4-Card Metrics Grid (ACTIVE INCIDENTS, RESOLUTION RATE, KNOWN ISSUES, COST SAVED)
 *  - Interactive Incident Feed Card with scenario simulation
 *  - Footer subscription badge, compliance status, and Sign Out
 *  - 100% Pure Pitch Black theme (#000000) & responsive layout.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';
import { useAnimatedEntrance } from '@/hooks/useAnimatedEntrance';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

interface IncidentItem {
  id: string;
  title: string;
  status: 'RESOLVED' | 'INVESTIGATING';
  matchPercent: number;
  matchId: string;
  solution: string;
  timestamp: string;
}

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'knowledge' | 'audit' | 'settings'>('feed');

  const topBarAnim = useAnimatedEntrance({ delay: 100, slideDistance: 12 });
  const titleAnim = useAnimatedEntrance({ delay: 250, slideDistance: 16 });
  const metricsAnim = useAnimatedEntrance({ delay: 400, slideDistance: 16 });
  const feedAnim = useAnimatedEntrance({ delay: 550, slideDistance: 16 });

  const handleSimulateScenario = () => {
    const newIncident: IncidentItem = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'CRITICAL: OutOfMemoryError in api-worker-91',
      status: 'RESOLVED',
      matchPercent: 100,
      matchId: 'INC-0045',
      solution: 'Heap size was insufficient. Increase pod limit to 4GB and adjust JVM heap flags.',
      timestamp: 'Just now',
    };
    setIncidents((prev) => [newIncident, ...prev]);
    showToast('Simulated scenario incident added and auto-resolved!', 'success');
  };

  const handleResetDatabase = () => {
    setIncidents([]);
    showToast('Telemetry database reset. System is operational.', 'info');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/landing');
    } catch (error: any) {
      showToast(error.message ?? 'Sign out failed', 'error');
    }
  };

  // Metric stats calculated dynamically
  const activeCount = incidents.filter((i) => i.status === 'INVESTIGATING').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const totalCount = incidents.length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const matchedPercent = totalCount > 0 ? 100 : 0;
  const costSaved = totalCount * 450;

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
        bounces={false}
      >
        <View style={styles.maxContainer}>
          {/* Top Header Telemetry Bar */}
          <Animated.View style={[styles.topBar, topBarAnim.animatedStyle]}>
            <View style={styles.topBarLeft}>
              <Logo size="sm" />
              <Text style={styles.topBarTitle}>INCIDENT FEED - TELEMETRY LOGS</Text>
            </View>
            <View style={styles.topBarRight}>
              <View style={styles.systemStatusBadge}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.systemStatusText}>SYSTEM: STABLE</Text>
              </View>
            </View>
          </Animated.View>

          {/* Main Title & Action Buttons Section */}
          <Animated.View style={[styles.titleSection, titleAnim.animatedStyle]}>
            <View style={styles.titleTextGroup}>
              <Text style={styles.mainTitle}>Incident Feed</Text>
              <Text style={styles.mainSubtitle}>
                Real-time NOC operational telemetry and automated crash analysis.
              </Text>
            </View>
            <View style={styles.actionButtonGroup}>
              <Pressable style={styles.resetBtn} onPress={handleResetDatabase}>
                <Text style={styles.resetBtnText}>RESET DATABASE</Text>
              </Pressable>
              <Button
                title="SIMULATE SCENARIO"
                onPress={handleSimulateScenario}
                variant="cyan"
                size="sm"
                fullWidth={false}
              />
            </View>
          </Animated.View>

          {/* 4-Card Metrics Grid */}
          <Animated.View style={[styles.metricsGrid, metricsAnim.animatedStyle]}>
            {/* Card 1: ACTIVE INCIDENTS */}
            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Text style={styles.metricCardTitle}>ACTIVE INCIDENTS</Text>
                <Text style={styles.metricIcon}>⚠️</Text>
              </View>
              <Text style={styles.metricValue}>{activeCount}</Text>
              <Text style={styles.metricSubText}>{resolvedCount} OF {totalCount} RESOLVED</Text>
            </Card>

            {/* Card 2: RESOLUTION RATE */}
            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Text style={styles.metricCardTitle}>RESOLUTION RATE</Text>
                <Text style={styles.metricIcon}>🛡️</Text>
              </View>
              <Text style={styles.metricValue}>{resolutionRate}%</Text>
              <Text style={styles.metricSubText}>INCIDENTS AUTO-RESOLVED</Text>
            </Card>

            {/* Card 3: KNOWN ISSUES MATCHED */}
            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Text style={styles.metricCardTitle}>KNOWN ISSUES MATCHED</Text>
                <Text style={styles.metricIcon}>⚙️</Text>
              </View>
              <Text style={styles.metricValue}>{matchedPercent}.0%</Text>
              <Text style={styles.metricSubText}>{totalCount} HISTORICAL MATCHES</Text>
            </Card>

            {/* Card 4: RESOLUTION COST SAVED */}
            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Text style={styles.metricCardTitle}>RESOLUTION COST SAVED</Text>
                <Text style={styles.metricIcon}>$</Text>
              </View>
              <Text style={styles.metricValue}>${costSaved.toFixed(2)}</Text>
              <Text style={styles.metricSubText}>{totalCount * 15} MINS MTTR SAVED</Text>
            </Card>
          </Animated.View>

          {/* Incident Feed Main Container */}
          <Animated.View style={[styles.feedSection, feedAnim.animatedStyle]}>
            {incidents.length === 0 ? (
              <View style={styles.emptyFeedContainer}>
                <Text style={styles.emptyFeedText}>
                  No incidents logged. System is fully operational.
                </Text>
              </View>
            ) : (
              <View style={styles.incidentList}>
                {incidents.map((item) => (
                  <Card key={item.id} variant="glass" style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                      <Text style={styles.incidentMeta}>KUBERNETES :: {item.id}</Text>
                      <View style={styles.resolvedBadge}>
                        <Text style={styles.resolvedBadgeText}>AUTO RESOLVED</Text>
                      </View>
                    </View>
                    <Text style={styles.incidentTitle}>{item.title}</Text>
                    <View style={styles.matchBadgeRow}>
                      <View style={styles.matchDot} />
                      <Text style={styles.matchText}>{item.matchPercent}% MEMORY MATCH : {item.matchId}</Text>
                    </View>
                    <Text style={styles.solutionText}>Suggested Fix: {item.solution}</Text>
                  </Card>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Footer & Operator Controls */}
          <View style={styles.dashboardFooter}>
            <View style={styles.subscriptionCard}>
              <View style={styles.subRow}>
                <Text style={styles.subTitle}>SUBSCRIPTION:</Text>
                <View style={styles.freeTierBadge}>
                  <Text style={styles.freeTierText}>FREE TIER</Text>
                </View>
              </View>
              <Text style={styles.subMeta}>Logs: {totalCount} of 500 used today</Text>
              <View style={{ height: spacing.xs }} />
              <Button title="UPGRADE TO PRO" onPress={() => showToast('Enterprise upgrade available!', 'info')} variant="outline" size="sm" />
            </View>

            <View style={styles.complianceRow}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.complianceText}>COMPLIANCE ENGINE: ONLINE</Text>
            </View>

            <Button title="[→ LOG OUT" onPress={handleSignOut} variant="outline" size="md" />

            <View style={styles.nodeMetaRow}>
              <Text style={styles.nodeMetaText}>OPERATOR: {user?.displayName || user?.email || 'ENGINEER'}</Text>
              <Text style={styles.nodeMetaText}>SECURE SANDBOX NODE #8491 | v1.0.4-PROD</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  maxContainer: {
    width: '100%',
    maxWidth: 1100, // Balanced desktop max-width matching web
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 245, 230, 0.15)',
    marginBottom: spacing.lg,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topBarTitle: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.primary,
    letterSpacing: letterSpacings.wider,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 242, 180, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 242, 180, 0.25)',
    borderRadius: borderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success.default,
    marginRight: 6,
  },
  systemStatusText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.success.default,
    letterSpacing: letterSpacings.wider,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  titleTextGroup: {
    flex: 1,
    minWidth: 260,
  },
  mainTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    color: colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  mainSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    lineHeight: fontSizes.xs * 1.5,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: '#000000',
  },
  resetBtnText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.primary,
    letterSpacing: letterSpacings.wider,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.2)',
    padding: spacing.md,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricCardTitle: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  metricIcon: {
    fontSize: 12,
    color: colors.primary[400],
  },
  metricValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    color: colors.text.primary,
    marginBottom: 2,
  },
  metricSubText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  feedSection: {
    marginBottom: spacing['2xl'],
  },
  emptyFeedContainer: {
    height: 180,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.2)',
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyFeedText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  incidentList: {
    gap: spacing.md,
  },
  incidentCard: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.25)',
    padding: spacing.md,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  incidentMeta: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    color: colors.text.tertiary,
  },
  resolvedBadge: {
    backgroundColor: colors.success.bg,
    borderWidth: 1,
    borderColor: colors.success.border,
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  resolvedBadgeText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.success.default,
    letterSpacing: letterSpacings.wider,
  },
  incidentTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.sm,
    color: colors.error.default,
    marginBottom: spacing.xs,
  },
  matchBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success.default,
    marginRight: 6,
  },
  matchText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  solutionText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    lineHeight: fontSizes.xs * 1.5,
  },
  dashboardFooter: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 245, 230, 0.15)',
  },
  subscriptionCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.2)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subTitle: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  freeTierBadge: {
    backgroundColor: 'rgba(52, 245, 230, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  freeTierText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.primary[400],
    letterSpacing: letterSpacings.wider,
  },
  subMeta: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.secondary,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  complianceText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.success.default,
    letterSpacing: letterSpacings.wider,
  },
  nodeMetaRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  nodeMetaText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
    marginBottom: 2,
  },
});
