/**
 * Halcyon — Knowledge Base Screen
 * 
 * Hindsight AI Memory Engine index with semantic search & similarity vector scores.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChips, type FilterOption } from '@/components/ui/FilterChips';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatRing } from '@/components/charts/StatRing';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getKnowledgeEntries, getCategories, getKnowledgeStats } from '@/services/data/knowledgeService';
import type { KnowledgeEntry, KnowledgeStats, KnowledgeCategory_Meta } from '@/types/knowledge';

const hPad = getHorizontalPadding();

export default function KnowledgeBaseScreen() {
  const insets = useSafeAreaInsets();

  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory_Meta[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchKnowledge = useCallback(async () => {
    setLoading(true);
    const filter: any = {};
    if (selectedCategory !== 'ALL') filter.category = [selectedCategory];
    if (searchQuery.trim()) filter.search = searchQuery.trim();

    const data = await getKnowledgeEntries(filter);
    const cats = await getCategories();
    const st = await getKnowledgeStats();

    setEntries(data);
    setCategories(cats);
    setStats(st);
    setLoading(false);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const catOptions: FilterOption[] = [
    { id: 'ALL', label: 'ALL CATEGORIES', count: stats?.totalEntries },
    ...categories.map(c => ({ id: c.name, label: `${c.icon} ${c.name}`, count: c.count })),
  ];

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
          <Text style={styles.topBarTitle}>HINDSIGHT AI MEMORY ENGINE</Text>
          <Text style={styles.mainTitle}>Knowledge Base</Text>
          <Text style={styles.mainSubtitle}>
            Institutional solution vectors indexed in Hindsight semantic memory.
          </Text>

          {/* AI Memory Stats Card */}
          <Card variant="glass" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>INDEXED VECTORS</Text>
                <Text style={styles.statVal}>{stats?.totalEntries || 10} Solutions</Text>
                <Text style={styles.statDesc}>Automated vector correlation active</Text>
              </View>
              <View style={styles.ringWrap}>
                <StatRing percent={Math.round(stats?.avgSimilarityScore || 91)} size={70} strokeWidth={6} label="AVG MATCH" />
              </View>
            </View>
          </Card>

          {/* Search & Categories */}
          <View style={styles.searchSection}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search solutions, tags, root causes..."
            />
            <View style={{ height: spacing.xs }} />
            <FilterChips
              options={catOptions}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </View>

          <SectionHeader
            title={`SOLUTION VECTORS (${entries.length})`}
            subtitle="Ranked by semantic match relevance & historical application"
          />

          {loading ? (
            <View style={styles.listGap}>
              <SkeletonLoader height={120} borderRadius={12} />
              <SkeletonLoader height={120} borderRadius={12} />
            </View>
          ) : entries.length === 0 ? (
            <EmptyState
              icon="🧠"
              title="No Solution Vectors Found"
              subtitle="Try searching for a different keyword or resetting category filters."
              actionTitle="RESET SEARCH"
              onAction={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            />
          ) : (
            <View style={styles.listGap}>
              {entries.map((entry) => (
                <Card key={entry.id} variant="glass" style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{entry.category}</Text>
                    </View>
                    <View style={styles.simBadge}>
                      <Text style={styles.simText}>{entry.similarityScore}% SIMILARITY</Text>
                    </View>
                  </View>

                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.solutionText}>{entry.solution}</Text>

                  <View style={styles.tagRow}>
                    {entry.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>Applied {entry.incidentCount} times</Text>
                    <Text style={styles.metaText}>Source: {entry.source}</Text>
                  </View>
                </Card>
              ))}
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
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5, marginBottom: 2 },
  mainSubtitle: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: spacing.lg },
  statsCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.lg, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statCol: { flex: 1 },
  statLabel: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.primary[400], letterSpacing: letterSpacings.wider, marginBottom: 2 },
  statVal: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: 2 },
  statDesc: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary },
  ringWrap: { marginLeft: spacing.md },
  searchSection: { marginBottom: spacing.md },
  listGap: { gap: spacing.md },
  entryCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.2)', padding: spacing.md },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  catBadge: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: borderRadius.xs, paddingVertical: 2, paddingHorizontal: 6 },
  catBadgeText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.secondary },
  simBadge: { backgroundColor: colors.success.bg, borderWidth: 1, borderColor: colors.success.border, borderRadius: borderRadius.xs, paddingVertical: 2, paddingHorizontal: 6 },
  simText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.success.default, fontWeight: 'bold' },
  entryTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, color: colors.text.primary, marginBottom: 4 },
  solutionText: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: fontSizes.xs * 1.5, marginBottom: spacing.xs },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: spacing.xs },
  tag: { backgroundColor: 'rgba(52, 245, 230, 0.06)', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6 },
  tagText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.primary[400] },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)' },
  metaText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary },
});
