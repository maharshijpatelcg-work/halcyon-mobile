/**
 * Halcyon — Live Incident Feed Screen
 * 
 * Filterable, searchable live incident monitoring feed with AI summary & memory matches.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChips, type FilterOption } from '@/components/ui/FilterChips';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getIncidents, simulateIncident } from '@/services/data/incidentService';
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types/incident';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

const SEVERITY_FILTERS: FilterOption[] = [
  { id: 'ALL', label: 'ALL SEVERITIES' },
  { id: 'CRITICAL', label: 'CRITICAL' },
  { id: 'HIGH', label: 'HIGH' },
  { id: 'MEDIUM', label: 'MEDIUM' },
  { id: 'LOW', label: 'LOW' },
];

export default function IncidentFeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchIncidents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (page === 1) setLoading(true);

      const filter: any = {};
      if (selectedSeverity !== 'ALL') {
        filter.severity = [selectedSeverity as IncidentSeverity];
      }
      if (searchQuery.trim()) {
        filter.search = searchQuery.trim();
      }

      const result = await getIncidents(filter, isRefresh ? 1 : page, 10);
      
      if (isRefresh || page === 1) {
        setIncidents(result.data);
      } else {
        setIncidents(prev => [...prev, ...result.data]);
      }
      setHasMore(result.hasMore);
    } catch (e) {
      showToast('Failed to fetch incident feed', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedSeverity, searchQuery, page, showToast]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleSimulate = async () => {
    try {
      const newInc = await simulateIncident();
      showToast(`Simulated ${newInc.id} added!`, 'success');
      fetchIncidents(true);
    } catch (e) {
      showToast('Simulation failed', 'error');
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchIncidents(true)}
            tintColor={colors.primary[400]}
          />
        }
      >
        <View style={styles.maxContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View>
              <Text style={styles.topBarTitle}>INCIDENT MONITORING & FEED</Text>
              <Text style={styles.mainTitle}>Incident Feed</Text>
            </View>
            <Pressable style={styles.simBtn} onPress={handleSimulate}>
              <Text style={styles.simBtnText}>+ SIMULATE</Text>
            </Pressable>
          </View>

          {/* Search & Filter controls */}
          <View style={styles.controlsWrap}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by ID, error message, service..."
            />
            <View style={{ height: spacing.xs }} />
            <FilterChips
              options={SEVERITY_FILTERS}
              selectedId={selectedSeverity}
              onSelect={setSelectedSeverity}
            />
          </View>

          <SectionHeader
            title={`INCIDENTS (${incidents.length})`}
            subtitle="Real-time stream of cluster anomalies and AI resolutions"
          />

          {/* List or Loaders */}
          {loading ? (
            <View style={styles.listGap}>
              <SkeletonLoader height={140} borderRadius={12} />
              <SkeletonLoader height={140} borderRadius={12} />
              <SkeletonLoader height={140} borderRadius={12} />
            </View>
          ) : incidents.length === 0 ? (
            <EmptyState
              icon="🚨"
              title="No Incidents Match Filter"
              subtitle="All systems operating normally. Try adjusting your search query or severity filter."
              actionTitle="RESET FILTERS"
              onAction={() => { setSelectedSeverity('ALL'); setSearchQuery(''); }}
            />
          ) : (
            <View style={styles.listGap}>
              {incidents.map((incident) => (
                <Pressable
                  key={incident.id}
                  onPress={() => router.push(`/(app)/incidents/${incident.id}` as any)}
                >
                  <Card variant="glass" style={styles.incidentCard}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.metaGroup}>
                        <SeverityBadge severity={incident.severity} />
                        <Text style={styles.sourceText}>{incident.source} :: {incident.service}</Text>
                      </View>
                      <View style={[styles.statusTag, incident.status === 'RESOLVED' && styles.statusResolved]}>
                        <Text style={[styles.statusText, incident.status === 'RESOLVED' && styles.statusTextResolved]}>
                          {incident.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.aiSummarySnippet} numberOfLines={2}>{incident.aiSummary}</Text>

                    {incident.memoryMatch && (
                      <View style={styles.matchBar}>
                        <View style={styles.greenDot} />
                        <Text style={styles.matchText}>
                          {incident.memoryMatch.similarity}% MATCH : {incident.memoryMatch.id} ({incident.memoryMatch.title})
                        </Text>
                      </View>
                    )}
                  </Card>
                </Pressable>
              ))}

              {hasMore && (
                <Pressable style={styles.loadMoreBtn} onPress={() => setPage(p => p + 1)}>
                  <Text style={styles.loadMoreText}>LOAD MORE INCIDENTS</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5 },
  simBtn: {
    backgroundColor: 'rgba(52, 245, 230, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary[400],
    borderRadius: borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  simBtnText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.primary[400],
    fontWeight: 'bold',
    letterSpacing: letterSpacings.wider,
  },
  controlsWrap: {
    marginBottom: spacing.md,
  },
  listGap: {
    gap: spacing.md,
  },
  incidentCard: {
    backgroundColor: '#000000',
    borderColor: 'rgba(52, 245, 230, 0.2)',
    padding: spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceText: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    color: colors.text.tertiary,
  },
  statusTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusResolved: {
    backgroundColor: colors.success.bg,
    borderColor: colors.success.border,
  },
  statusText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.text.secondary,
  },
  statusTextResolved: {
    color: colors.success.default,
  },
  incidentTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    marginBottom: 4,
  },
  aiSummarySnippet: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    lineHeight: fontSizes.xs * 1.5,
    marginBottom: spacing.xs,
  },
  matchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 242, 180, 0.06)',
    borderRadius: borderRadius.xs,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs + 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success.default,
    marginRight: 6,
  },
  matchText: {
    fontFamily: fontFamilies.mono,
    fontSize: 9,
    color: colors.success.default,
    fontWeight: 'bold',
  },
  loadMoreBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  loadMoreText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.primary[400],
    letterSpacing: letterSpacings.wider,
  },
});
