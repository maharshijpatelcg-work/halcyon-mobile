/**
 * Halcyon — Knowledge Base Screen
 * 
 * Hindsight semantic memory engine index matching official website design.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';

const hPad = getHorizontalPadding();

export default function KnowledgeBaseScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.topBarTitle}>KNOWLEDGE BASE - HINDSIGHT ENGINE</Text>
          <Text style={styles.mainTitle}>Knowledge Base</Text>
          <Text style={styles.mainSubtitle}>
            Institutional solution vectors indexed in Hindsight semantic memory.
          </Text>

          <Card variant="glass" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🧠</Text>
              <Text style={styles.cardTitle}>HINDSIGHT VECTORS INDEXED</Text>
            </View>
            <Text style={styles.cardValue}>1,284 Solutions</Text>
            <Text style={styles.cardDesc}>
              Automated vector search active for Kubernetes, JVM heap flags, Redis pool scale, and PostgreSQL failovers.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: spacing.sm },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5, marginBottom: 4 },
  mainSubtitle: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, marginBottom: spacing.xl },
  card: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  cardIcon: { fontSize: 20, marginRight: spacing.sm },
  cardTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.primary[400], letterSpacing: letterSpacings.wider },
  cardValue: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: spacing.xs },
  cardDesc: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: fontSizes.xs * 1.6 },
});
