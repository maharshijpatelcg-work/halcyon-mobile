/**
 * Halcyon — App Layout (Protected)
 * 
 * Redirects to auth if not authenticated.
 */
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/landing" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    />
  );
}
