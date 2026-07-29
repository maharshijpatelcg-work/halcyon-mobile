/**
 * Halcyon — Auth Stack Layout
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
