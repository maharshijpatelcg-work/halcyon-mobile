/**
 * Halcyon — Live Telemetry Screen
 * 
 * Real-time performance metrics with SVG line/area charts (CPU, Memory, Network, Latency).
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { StatRing } from '@/components/charts/StatRing';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding } from '@/theme/spacing';
import { getTelemetryTimeSeries } from '@/services/data/auditService';
import type { TelemetryMetric } from '@/types/incident';

const hPad = getHorizontalPadding();

export default function TelemetryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [cpuData, setCpuData] = useState<TelemetryMetric[]>([]);
  const [memData, setMemData] = useState<TelemetryMetric[]>([]);
  const [netData, setNetData] = useState<TelemetryMetric[]>([]);
  const [latencyData, setLatencyData] = useState<TelemetryMetric[]>([]);

  useEffect(() => {
    async function load() {
      const c = await getTelemetryTimeSeries('cpuUsage');
      const m = await getTelemetryTimeSeries('memoryUsage');
      const n = await getTelemetryTimeSeries('networkIn');
      const l = await getTelemetryTimeSeries('latency');
      setCpuData(c);
      setMemData(m);
      setNetData(n);
      setLatencyData(l);
    }
    load();
  }, []);

  const latestCpu = cpuData[cpuData.length - 1]?.value || 45;
  const latestMem = memData[memData.length - 1]?.value || 62;
  const latestLat = latencyData[latencyData.length - 1]?.value || 245;

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
            <Text style={styles.backText}>← DASHBOARD</Text>
          </Pressable>

          <Text style={styles.topBarTitle}>REAL-TIME CLUSTER TELEMETRY</Text>
          <Text style={styles.mainTitle}>Live Telemetry</Text>

          {/* Quick Metrics */}
          <View style={styles.ringsRow}>
            <Card variant="glass" style={styles.ringCard}>
              <Text style={styles.ringCardTitle}>CPU USAGE</Text>
              <StatRing percent={Math.round(latestCpu)} color={colors.primary[400]} />
            </Card>
            <Card variant="glass" style={styles.ringCard}>
              <Text style={styles.ringCardTitle}>MEMORY USAGE</Text>
              <StatRing percent={Math.round(latestMem)} color={colors.secondary[300]} />
            </Card>
            <Card variant="glass" style={styles.ringCard}>
              <Text style={styles.ringCardTitle}>UPTIME</Text>
              <StatRing percent={99.97 as any} color={colors.success.default} label="SLA 99.9%" />
            </Card>
          </View>

          {/* Chart 1: Latency */}
          <SectionHeader title="API LATENCY (MS)" subtitle="24-hour time-series API response latency" />
          <Card variant="glass" style={styles.chartCard}>
            <Text style={styles.chartMetricValue}>{Math.round(latestLat)} ms</Text>
            <LineChart data={latencyData} height={180} width={340} />
          </Card>

          {/* Chart 2: CPU vs Memory */}
          <SectionHeader title="CLUSTER RESOURCE CONSUMPTION" subtitle="Aggregated node memory footprint over time" />
          <Card variant="glass" style={styles.chartCard}>
            <AreaChart data={memData} height={160} width={340} color={colors.primary[400]} />
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
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5, marginBottom: spacing.lg },
  ringsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  ringCard: { flex: 1, minWidth: 140, alignItems: 'center', backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: spacing.md },
  ringCardTitle: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: spacing.xs },
  chartCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  chartMetricValue: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: spacing.xs, alignSelf: 'flex-start' },
});
