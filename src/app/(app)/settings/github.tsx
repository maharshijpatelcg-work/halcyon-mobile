/**
 * Halcyon — GitHub Integration Screen
 * 
 * OAuth connection, repo selection, branch picker, webhook status, and last sync.
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
import { getGitHubConnection, connectGitHub, disconnectGitHub, selectGitHubRepo, selectGitHubBranch } from '@/services/data/settingsService';
import type { GitHubConnection } from '@/types/settings';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function GitHubIntegrationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [github, setGithub] = useState<GitHubConnection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getGitHubConnection();
      setGithub(data);
    }
    load();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    const updated = await connectGitHub();
    setGithub(updated);
    setLoading(false);
    showToast('GitHub connected successfully!', 'success');
  };

  const handleDisconnect = async () => {
    await disconnectGitHub();
    setGithub({ connected: false });
    showToast('GitHub disconnected', 'info');
  };

  const handleSelectRepo = async (repoName: string) => {
    const updated = await selectGitHubRepo(repoName);
    setGithub(updated);
    showToast(`Active repository set to ${repoName}`, 'success');
  };

  const handleSelectBranch = async (branch: string) => {
    const updated = await selectGitHubBranch(branch);
    setGithub(updated);
    showToast(`Active branch set to ${branch}`, 'info');
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

          <Text style={styles.topBarTitle}>CODEBASE INTEGRATION</Text>
          <Text style={styles.mainTitle}>GitHub Integration</Text>
          <Text style={styles.mainSubtitle}>
            Connect your infrastructure repositories to enable automatic PR fixes & incident context.
          </Text>

          {/* Connection Status Card */}
          <Card variant="glass" style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.brandRow}>
                <Text style={styles.ghLogo}>🐙</Text>
                <View>
                  <Text style={styles.ghTitle}>GitHub OAuth Connection</Text>
                  <Text style={styles.ghSub}>
                    {github?.connected ? `@${github.username}` : 'Not connected'}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusTag, github?.connected && styles.connectedTag]}>
                <Text style={[styles.statusTagText, github?.connected && styles.connectedTagText]}>
                  {github?.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </Text>
              </View>
            </View>

            <View style={{ height: spacing.md }} />

            {!github?.connected ? (
              <Button
                title="CONNECT GITHUB ACCOUNT"
                onPress={handleConnect}
                loading={loading}
                variant="cyan"
                size="md"
              />
            ) : (
              <Button
                title="DISCONNECT GITHUB"
                onPress={handleDisconnect}
                variant="outline"
                size="sm"
              />
            )}
          </Card>

          {/* Active Repository Selection */}
          {github?.connected && (
            <>
              <SectionHeader title="CONNECTED REPOSITORIES" subtitle="Select default repository for automated AI PR generation" />
              <View style={styles.repoList}>
                {github.repositories?.map((repo) => {
                  const isSelected = github.selectedRepo === repo.name;
                  return (
                    <Pressable key={repo.id} onPress={() => handleSelectRepo(repo.name)}>
                      <Card variant="glass" style={isSelected ? [styles.repoCard, styles.selectedRepoCard] : styles.repoCard}>
                        <View style={styles.repoTop}>
                          <Text style={styles.repoName}>{repo.fullName}</Text>
                          {isSelected && (
                            <View style={styles.activeBadge}>
                              <Text style={styles.activeBadgeText}>ACTIVE</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.repoSub}>Language: {repo.language} • Branches: {repo.branches.join(', ')}</Text>

                        {isSelected && (
                          <View style={styles.branchWrap}>
                            <Text style={styles.branchLabel}>ACTIVE BRANCH:</Text>
                            <View style={styles.branchChips}>
                              {repo.branches.map((b) => (
                                <Pressable
                                  key={b}
                                  style={[styles.branchChip, github.selectedBranch === b && styles.selectedBranchChip]}
                                  onPress={() => handleSelectBranch(b)}
                                >
                                  <Text style={[styles.branchText, github.selectedBranch === b && styles.selectedBranchText]}>
                                    {b}
                                  </Text>
                                </Pressable>
                              ))}
                            </View>
                          </View>
                        )}
                      </Card>
                    </Pressable>
                  );
                })}
              </View>

              {/* Webhook Status */}
              <SectionHeader title="WEBHOOK & SYNC STATUS" />
              <Card variant="glass" style={styles.statusCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>WEBHOOK STATUS:</Text>
                  <View style={styles.greenDotRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.greenText}>ACTIVE & LISTENING</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>LAST SYNC:</Text>
                  <Text style={styles.infoVal}>{new Date(github.lastSync || Date.now()).toLocaleString()}</Text>
                </View>
              </Card>
            </>
          )}
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
  statusCard: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.lg, marginBottom: spacing.lg },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ghLogo: { fontSize: 32 },
  ghTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.base, color: colors.text.primary },
  ghSub: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary },
  statusTag: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: borderRadius.xs, paddingVertical: 2, paddingHorizontal: 6 },
  connectedTag: { backgroundColor: colors.success.bg, borderColor: colors.success.border },
  statusTagText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.secondary },
  connectedTagText: { color: colors.success.default, fontWeight: 'bold' },
  repoList: { gap: spacing.md, marginBottom: spacing.lg },
  repoCard: { backgroundColor: '#000000', borderColor: 'rgba(255, 255, 255, 0.1)', padding: spacing.md },
  selectedRepoCard: { borderColor: colors.primary[400], backgroundColor: 'rgba(52, 245, 230, 0.03)' },
  repoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  repoName: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, color: colors.text.primary },
  activeBadge: { backgroundColor: 'rgba(52, 245, 230, 0.15)', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6 },
  activeBadgeText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.primary[400], fontWeight: 'bold' },
  repoSub: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  branchWrap: { marginTop: spacing.md, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)' },
  branchLabel: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.text.tertiary, marginBottom: 4 },
  branchChips: { flexDirection: 'row', gap: spacing.xs },
  branchChip: { backgroundColor: '#1A1A1A', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8 },
  selectedBranchChip: { backgroundColor: colors.primary[400] },
  branchText: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.secondary },
  selectedBranchText: { color: '#000000', fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  infoLabel: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  infoVal: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.primary },
  greenDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success.default },
  greenText: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.success.default, fontWeight: 'bold' },
});
