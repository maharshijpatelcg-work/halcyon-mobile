/**
 * Halcyon — 404 Not Found
 */
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Route Not Found</Text>
        <Text style={styles.subtitle}>REQUESTED ENDPOINT DOES NOT EXIST</Text>
        <View style={{ height: spacing['2xl'] }} />
        <Button
          title="← RETURN HOME"
          onPress={() => router.replace('/')}
          variant="outline"
          fullWidth={false}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: 72,
    color: colors.text.primary,
    letterSpacing: letterSpacings.wider,
    opacity: 0.15,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['2xl'],
    color: colors.text.primary,
    marginTop: -spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes['2xs'],
    color: colors.text.tertiary,
    letterSpacing: letterSpacings.widest,
    marginTop: spacing.sm,
  },
});
