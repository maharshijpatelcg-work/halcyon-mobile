/**
 * Halcyon — Settings Screen
 * 
 * NOC telemetry node configuration, compliance settings, and profile controls.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding } from '@/theme/spacing';

const hPad = getHorizontalPadding();

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/landing');
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
          <Text style={styles.topBarTitle}>SETTINGS - NOC NODE CONFIGURATION</Text>
          <Text style={styles.mainTitle}>Settings</Text>
          <Text style={styles.mainSubtitle}>
            Manage telemetry workspace permissions and security compliance rules.
          </Text>

          <Card variant="glass" style={styles.card}>
            <Text style={styles.cardHeader}>OPERATOR PROFILE</Text>
            <Text style={styles.profileName}>{user?.displayName || 'Engineer'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </Card>

          <View style={{ height: spacing.lg }} />
          <Button title="[→ LOG OUT WORKSPACE" onPress={handleSignOut} variant="outline" size="lg" />
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
  cardHeader: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.widest, marginBottom: spacing.xs },
  profileName: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: 2 },
  profileEmail: { fontFamily: fontFamilies.regular, fontSize: fontSizes.sm, color: colors.text.secondary },
});
