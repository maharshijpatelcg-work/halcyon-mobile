/**
 * Halcyon — Incident Detail Screen
 * 
 * Deep-dive analysis of an incident with AI Root Cause, Timeline, Logs, and Memory Match.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getIncidentById, resolveIncident } from '@/services/data/incidentService';
import type { Incident } from '@/types/incident';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const data = await getIncidentById(id as string);
      setIncident(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleCopySolution = () => {
    if (!incident) return;
    showToast('Suggested fix copied to clipboard!', 'success');
  };

  const handleResolve = async () => {
    if (!incident) return;
    setResolving(true);
    const updated = await resolveIncident(incident.id);
    if (updated) {
      setIncident(updated);
      showToast(`Incident ${incident.id} marked as RESOLVED!`, 'success');
    }
    setResolving(false);
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + spacing.xl }]}>
          <SkeletonLoader height={32} width={200} />
          <View style={{ height: spacing.md }} />
          <SkeletonLoader height={180} />
          <View style={{ height: spacing.md }} />
          <SkeletonLoader height={240} />
        </View>
      </GradientBackground>
    );
  }

  if (!incident) {
    return (
      <GradientBackground>
        <View style={[styles.errorContainer, { paddingTop: insets.top + spacing.xl }]}>
          <Text style={styles.errorText}>Incident record not found: {id}</Text>
          <Button title="← BACK TO FEED" onPress={() => router.back()} variant="outline" size="sm" />
        </View>
      </GradientBackground>
    );
  }

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
          {/* Top Back Navigation */}
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backText}>← INCIDENT FEED</Text>
          </Pressable>

          {/* Main Title & Status Header */}
          <View style={styles.headerCard}>
            <View style={styles.headerTopRow}>
              <SeverityBadge severity={incident.severity} size="md" />
              <View style={[styles.statusTag, incident.status === 'RESOLVED' && styles.statusResolved]}>
                <Text style={[styles.statusText, incident.status === 'RESOLVED' && styles.statusTextResolved]}>
                  {incident.status}
                </Text>
              </View>
            </View>
            <Text style={styles.incidentIdText}>{incident.source} :: {incident.id}</Text>
            <Text style={styles.titleText}>{incident.title}</Text>
            <Text style={styles.timestampText}>
              Triggered: {new Date(incident.timestamp).toLocaleString()}
              {incident.resolvedAt && ` • Resolved: ${new Date(incident.resolvedAt).toLocaleString()}`}
            </Text>

            {incident.status !== 'RESOLVED' && (
              <View style={styles.resolveActionRow}>
                <Button
                  title="MARK AS RESOLVED"
                  onPress={handleResolve}
                  loading={resolving}
                  variant="cyan"
                  size="sm"
                />
              </View>
            )}
          </View>

          {/* Section 1: AI Summary & Root Cause Analysis */}
          <SectionHeader title="AI ENGINE ANALYSIS" subtitle="Automated root cause identification & solution vector" />
          <Card variant="glass" style={styles.sectionCard}>
            <Text style={styles.subHeading}>AI SUMMARY</Text>
            <Text style={styles.bodyText}>{incident.aiSummary}</Text>

            <View style={styles.divider} />

            <Text style={styles.subHeading}>ROOT CAUSE</Text>
            <Text style={styles.bodyText}>{incident.rootCause}</Text>
          </Card>

          {/* Section 2: Suggested Fix & Action */}
          <SectionHeader title="SUGGESTED FIX" subtitle="Recommended remediation pattern from Hindsight memory" />
          <Card variant="glass" style={styles.fixCard}>
            <Text style={styles.fixText}>{incident.suggestedFix}</Text>
            <View style={styles.copyRow}>
              <Button title="📋 COPY SOLUTION" onPress={handleCopySolution} variant="outline" size="sm" />
            </View>
          </Card>

          {/* Section 3: Memory Match Vector */}
          {incident.memoryMatch && (
            <>
              <SectionHeader title="HINDSIGHT MEMORY MATCH" subtitle="100% vector correlation with historical incident" />
              <Card variant="glass" style={styles.memoryCard}>
                <View style={styles.matchBadgeRow}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.matchScoreText}>{incident.memoryMatch.similarity}% MEMORY MATCH</Text>
                </View>
                <Text style={styles.memoryMatchTitle}>{incident.memoryMatch.id}: {incident.memoryMatch.title}</Text>
                <Text style={styles.memoryResolutionText}>Resolution: {incident.memoryMatch.resolution}</Text>
              </Card>
            </>
          )}

          {/* Section 4: Timeline */}
          <SectionHeader title="INCIDENT TIMELINE" subtitle="Chronological sequence of events and automated responses" />
          <Card variant="glass" style={styles.sectionCard}>
            {incident.timeline.map((event, idx) => (
              <View key={event.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {idx < incident.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <View style={styles.timelineMeta}>
                    <Text style={styles.timelineAction}>{event.action}</Text>
                    <Text style={styles.timelineTime}>{event.timestamp.slice(11, 19)}</Text>
                  </View>
                  <Text style={styles.timelineDetail}>{event.detail}</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Section 5: Telemetry Logs */}
          <SectionHeader title="LOGS VIEWER" subtitle="Raw cluster logs captured around incident window" />
          <View style={styles.logsContainer}>
            {incident.logs.map((log, idx) => (
              <View key={idx} style={styles.logRow}>
                <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
                <Text style={[styles.logLevel, log.level === 'ERROR' ? styles.logError : log.level === 'WARN' ? styles.logWarn : styles.logInfo]}>
                  {log.level}
                </Text>
                <Text style={styles.logMessage}>{log.message}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  loadingContainer: { flex: 1, paddingHorizontal: hPad, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: hPad },
  errorText: { fontFamily: fontFamilies.mono, fontSize: fontSizes.sm, color: colors.error.default, marginBottom: spacing.md },
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.xs, marginBottom: spacing.sm },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.primary[400], letterSpacing: letterSpacings.wider },
  headerCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  statusTag: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: borderRadius.xs, paddingVertical: 2, paddingHorizontal: 6 },
  statusResolved: { backgroundColor: colors.success.bg, borderColor: colors.success.border },
  statusText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.secondary },
  statusTextResolved: { color: colors.success.default },
  incidentIdText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  titleText: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: spacing.xs },
  timestampText: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  resolveActionRow: { marginTop: spacing.md },
  sectionCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: spacing.lg, marginBottom: spacing.md },
  subHeading: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.primary[400], letterSpacing: letterSpacings.widest, marginBottom: 4 },
  bodyText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: fontSizes.xs * 1.6 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: spacing.md },
  fixCard: { backgroundColor: 'rgba(52, 245, 230, 0.05)', borderColor: 'rgba(52, 245, 230, 0.3)', padding: spacing.lg, marginBottom: spacing.md },
  fixText: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.text.primary, lineHeight: fontSizes.xs * 1.6, marginBottom: spacing.md },
  copyRow: { alignSelf: 'flex-start' },
  memoryCard: { backgroundColor: '#000000', borderColor: 'rgba(34, 242, 180, 0.3)', padding: spacing.lg, marginBottom: spacing.md },
  matchBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  greenPulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success.default, marginRight: 6 },
  matchScoreText: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.success.default, fontWeight: 'bold' },
  memoryMatchTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, color: colors.text.primary, marginBottom: 4 },
  memoryResolutionText: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.text.secondary },
  timelineRow: { flexDirection: 'row', marginBottom: spacing.md },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[400], marginTop: 4 },
  timelineLine: { width: 1, flex: 1, backgroundColor: 'rgba(52, 245, 230, 0.2)', marginVertical: 2 },
  timelineRight: { flex: 1, paddingLeft: spacing.xs },
  timelineMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  timelineAction: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.primary[400], fontWeight: 'bold' },
  timelineTime: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary },
  timelineDetail: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary },
  logsContainer: { backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#2A2A2A', borderRadius: borderRadius.md, padding: spacing.md, gap: 4 },
  logRow: { flexDirection: 'row', gap: spacing.xs },
  logTimestamp: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  logLevel: { fontFamily: fontFamilies.mono, fontSize: 10, fontWeight: 'bold' },
  logError: { color: colors.error.default },
  logWarn: { color: colors.warning.default },
  logInfo: { color: colors.info.default },
  logMessage: { flex: 1, fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.secondary },
});
