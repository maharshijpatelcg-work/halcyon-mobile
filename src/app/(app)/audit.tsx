/**
 * Halcyon — Audit Trail Screen
 * 
 * Immutable NOC telemetry execution logs & compliance audit trail.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding } from '@/theme/spacing';

const hPad = getHorizontalPadding();

export default function AuditTrailScreen() {
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
          <Text style={styles.topBarTitle}>AUDIT TRAIL - COMPLIANCE ENGINE</Text>
          <Text style={styles.mainTitle}>Audit Trail</Text>
          <Text style={styles.mainSubtitle}>
            Immutable execution logs, PII masking records, and action authorizations.
          </Text>

          <Card variant="glass" style={styles.card}>
            <View style={styles.logHeader}>
              <Text style={styles.logMeta}>TIMESTAMP: 2026-07-29T15:30:00Z</Text>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineBadgeText}>ONLINE</Text>
              </View>
            </View>
            <Text style={styles.logText}>
              [AUDIT] PII Sanitization executed on incoming payload. 0 plain-text credentials exposed.
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
  card: { backgroundColor: '#000000', borderColor: 'rgba(52, 245, 230, 0.25)', padding: spacing.md },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  logMeta: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  onlineBadge: { backgroundColor: colors.success.bg, borderWidth: 1, borderColor: colors.success.border, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6 },
  onlineBadgeText: { fontFamily: fontFamilies.mono, fontSize: 9, color: colors.success.default },
  logText: { fontFamily: fontFamilies.mono, fontSize: fontSizes.xs, color: colors.text.primary, lineHeight: fontSizes.xs * 1.5 },
});
