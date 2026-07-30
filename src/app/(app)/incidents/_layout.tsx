/**
 * Halcyon — Incidents Stack Layout
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function IncidentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    />
  );
}
