/**
 * Halcyon — Full Web-Identical Landing Page (Default '/' Home Route)
 * 
 * Pixel-perfect implementation matching https://ai-halcyon.vercel.app/
 * Fully responsive on Mobile, Tablet, Foldables, and 4K Desktop Screens.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/AuthContext';
import { useAnimatedEntrance } from '@/hooks/useAnimatedEntrance';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Card } from '@/components/ui/Card';
import { Oscilloscope } from '@/components/ui/Oscilloscope';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, screen, borderRadius } from '@/theme/spacing';

const hPad = getHorizontalPadding();

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to default /dashboard route
  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  const logoAnim = useAnimatedEntrance({ delay: 100, slideDistance: 12 });
  const heroAnim = useAnimatedEntrance({ delay: 250, slideDistance: 20 });
  const oscilloscopeAnim = useAnimatedEntrance({ delay: 400, slideDistance: 20 });
  const howItWorksAnim = useAnimatedEntrance({ delay: 550, slideDistance: 20 });
  const architectureAnim = useAnimatedEntrance({ delay: 700, slideDistance: 20 });
  const metricsAnim = useAnimatedEntrance({ delay: 850, slideDistance: 20 });
  const ctaAnim = useAnimatedEntrance({ delay: 1000, slideDistance: 12 });

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
          {/* Top Header Logo */}
          <Animated.View style={[styles.topLogoWrap, logoAnim.animatedStyle]}>
            <Logo variant="full" size="md" />
          </Animated.View>

          {/* Hero Section */}
          <Animated.View style={[styles.heroSection, heroAnim.animatedStyle]}>
            <Text style={styles.heroTitle}>Incident memory,</Text>
            <Text style={styles.heroAccent}>calmed.</Text>
            <Text style={styles.heroSubtitle}>
              Instantly resolve system alerts by tapping into an active, self-learning institutional memory of past fixes.
            </Text>
          </Animated.View>

          {/* 1. Halcyon Core Oscilloscope Terminal Card */}
          <Animated.View style={[styles.sectionGap, oscilloscopeAnim.animatedStyle]}>
            <Oscilloscope />
          </Animated.View>

          {/* 2. How It Works In Practice Section */}
          <Animated.View style={[styles.sectionGap, howItWorksAnim.animatedStyle]}>
            <Text style={styles.sectionHeading}>How It Works In Practice</Text>
            <Text style={styles.sectionSubtitle}>
              Witness the comparison between raw CLI chaos and Halcyon's memory-matching resolution.
            </Text>

            {/* Card A: Raw CLI Chaos (Kubernetes Triggered) */}
            <Card variant="glass" noPadding style={{ ...styles.cliCard, borderColor: 'rgba(255, 100, 120, 0.3)' }}>
              <View style={styles.cliHeader}>
                <Text style={styles.cliMeta}>KUBERNETES :: release_key_pipeline</Text>
                <View style={styles.triggeredBadge}>
                  <Text style={styles.triggeredText}>TRIGGERED</Text>
                </View>
              </View>
              <View style={styles.cliBody}>
                <Text style={styles.criticalError}>
                  [CRITICAL] OutOfMemoryError: in api-worker-91
                </Text>
                <Text style={styles.cliSubText}>Scaling pod failed. Heap space exhausted on pod node-4...</Text>
              </View>
            </Card>

            {/* Card B: Halcyon Cognitive Retrieval (Auto Resolved) */}
            <Card variant="glass" noPadding style={{ ...styles.cliCard, borderColor: 'rgba(34, 242, 180, 0.3)' }}>
              <View style={styles.cliHeader}>
                <Text style={styles.cliMeta}>HALCYON COGNITIVE RETRIEVAL</Text>
                <View style={styles.resolvedBadge}>
                  <Text style={styles.resolvedText}>AUTO RESOLVED</Text>
                </View>
              </View>
              <View style={styles.cliBody}>
                <View style={styles.matchBadge}>
                  <View style={[styles.statusDot, { backgroundColor: colors.success.default }]} />
                  <Text style={styles.matchText}>100% MEMORY MATCH : INC-0045</Text>
                </View>
                <Text style={styles.solutionText}>
                  Suggested Fix: Heap size was insufficient. Increase pod limit to 4GB and adjust JVM heap flags.
                </Text>
                <Text style={styles.actionText}>
                  GENERATED ACTION: k8s-rebuild (Authorization Required)
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* 3. Cognitive Infrastructure Architecture Section */}
          <Animated.View style={[styles.sectionGap, architectureAnim.animatedStyle]}>
            <Text style={styles.sectionHeading}>Cognitive Infrastructure Architecture</Text>

            {/* Feature 1: Knowledge Base */}
            <Card variant="glass" style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Text style={styles.archIcon}>⚡</Text>
              </View>
              <Text style={styles.archTitle}>Knowledge Base</Text>
              <Text style={styles.archDesc}>
                Halcyon indexes solutions in Hindsight, a specialized long-term memory engine. When a new incident happens, we run a semantic vector query to fetch past solutions.
              </Text>
            </Card>

            {/* Feature 2: cascadeflow Routing */}
            <Card variant="glass" style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Text style={styles.archIcon}>👁</Text>
              </View>
              <Text style={styles.archTitle}>cascadeflow Routing</Text>
              <Text style={styles.archDesc}>
                cascadeflow is our model routing framework. It routes logs to a fast, cheap model first. If it passes verification, we resolve it. If not, it escalates to a reasoning model.
              </Text>
            </Card>

            {/* Feature 3: PII Security Check */}
            <Card variant="glass" style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Text style={styles.archIcon}>🔒</Text>
              </View>
              <Text style={styles.archTitle}>PII Security Check</Text>
              <Text style={styles.archDesc}>
                Sanitizes & masks PII before vector lookup. Ensures 100% data security and enterprise compliance.
              </Text>
            </Card>
          </Animated.View>

          {/* 4. Metrics Grid */}
          <Animated.View style={[styles.sectionGap, metricsAnim.animatedStyle]}>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>98%</Text>
                <Text style={styles.metricLabel}>FASTER RESOLUTION</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>100x</Text>
                <Text style={styles.metricLabel}>CHEAPER INFERENCE</Text>
              </View>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>Zero</Text>
                <Text style={styles.metricLabel}>ZERO COMPLIANCE RISKS</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: colors.primary[400] }]}>Infinite</Text>
                <Text style={styles.metricLabel}>KNOWLEDGE BASE</Text>
              </View>
            </View>
          </Animated.View>

          {/* 5. CTA Buttons Section */}
          <Animated.View style={[styles.ctaSection, ctaAnim.animatedStyle]}>
            <Button
              title="ENTER DASHBOARD →"
              onPress={() => router.push('/(auth)/login')}
              variant="cyan"
              size="lg"
            />
            <View style={{ height: spacing.sm }} />
            <Button
              title="CREATE WORKSPACE"
              onPress={() => router.push('/(auth)/register')}
              variant="outline"
              size="lg"
            />

            {/* Footer Copyright */}
            <Text style={styles.footerCopyright}>
              © 2026 Halcyon. Built for the future.
            </Text>
          </Animated.View>
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
    maxWidth: 960,
  },
  topLogoWrap: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: screen.isSmall ? fontSizes['3xl'] : fontSizes['4xl'],
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroAccent: {
    fontFamily: fontFamilies.bold,
    fontSize: screen.isSmall ? fontSizes['3xl'] : fontSizes['4xl'],
    color: colors.primary[400],
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.sm * 1.6,
    paddingHorizontal: spacing.md,
    maxWidth: 420,
  },
  sectionGap: {
    marginBottom: spacing['2xl'],
    width: '100%',
  },
  sectionHeading: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: fontSizes.xs * 1.6,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  cliCard: {
    backgroundColor: '#0A0D15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
    width: '100%',
  },
  cliHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  cliMeta: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
  },
  triggeredBadge: {
    backgroundColor: colors.error.bg,
    borderWidth: 1,
    borderColor: colors.error.border,
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  triggeredText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.error.default,
    letterSpacing: letterSpacings.wider,
  },
  resolvedBadge: {
    backgroundColor: colors.success.bg,
    borderWidth: 1,
    borderColor: colors.success.border,
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  resolvedText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.success.default,
    letterSpacing: letterSpacings.wider,
  },
  cliBody: {
    padding: spacing.md,
  },
  criticalError: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.error.default,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cliSubText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.tertiary,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  matchText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.primary,
    fontWeight: 'bold',
    letterSpacing: letterSpacings.wider,
  },
  solutionText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    lineHeight: fontSizes.xs * 1.5,
    marginBottom: spacing.xs,
  },
  actionText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.primary[400],
    letterSpacing: letterSpacings.wider,
  },
  archCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface.default,
    borderColor: colors.border.default,
    width: '100%',
  },
  archIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(52, 245, 230, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  archIcon: {
    fontSize: 16,
    color: colors.primary[400],
  },
  archTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  archDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    lineHeight: fontSizes.xs * 1.6,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
  },
  metricItem: {
    flex: 1,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    color: colors.text.primary,
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.wider,
    textAlign: 'center',
  },
  ctaSection: {
    marginTop: spacing.md,
    width: '100%',
  },
  footerCopyright: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
