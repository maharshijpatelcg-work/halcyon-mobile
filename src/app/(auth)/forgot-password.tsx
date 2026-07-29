/**
 * Halcyon — Forgot Password Screen (100% Responsive)
 * 
 * Centered max-width (480px) form card for desktop & mobile.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/AuthContext';
import { useAnimatedEntrance } from '@/hooks/useAnimatedEntrance';
import { useShakeAnimation } from '@/hooks/useShakeAnimation';
import { useToast } from '@/components/ui/Toast';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { KeyboardAvoidingWrapper } from '@/components/ui/KeyboardAvoidingWrapper';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, borderRadius, getHorizontalPadding } from '@/theme/spacing';
import { STRINGS } from '@/constants/strings';
import { isValidEmail } from '@/utils/validation';
import { errorHaptic, successHaptic } from '@/utils/haptics';

const str = STRINGS.auth.forgotPassword;
const hPad = getHorizontalPadding();

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();
  const { animatedStyle: shakeStyle, shake } = useShakeAnimation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const header = useAnimatedEntrance({ delay: 100, slideDistance: 16 });
  const form = useAnimatedEntrance({ delay: 250, slideDistance: 16 });
  const successAnim = useAnimatedEntrance({ delay: 0, autoStart: false });

  const handleReset = useCallback(async () => {
    if (!email.trim()) { setEmailError('Email is required'); shake(); await errorHaptic(); return; }
    if (!isValidEmail(email)) { setEmailError('Please enter a valid email'); shake(); await errorHaptic(); return; }
    setEmailError(null);
    try {
      await resetPassword(email.trim());
      setSent(true); successAnim.start(); await successHaptic();
    } catch (error: any) {
      showToast(error.message ?? 'Failed to send reset email', 'error');
      shake(); await errorHaptic();
    }
  }, [email, resetPassword, showToast, shake, successAnim]);

  if (sent) {
    return (
      <GradientBackground variant="auth">
        <View style={[styles.successWrap, { paddingTop: insets.top + spacing['3xl'], paddingHorizontal: hPad, paddingBottom: insets.bottom + spacing.lg }]}>
          <Animated.View style={[styles.successContent, successAnim.animatedStyle, { maxWidth: 480, width: '100%', alignSelf: 'center' }]}>
            <View style={styles.successCircle}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{str.successTitle}</Text>
            <Text style={styles.successMsg}>{str.successMessage}</Text>
            <View style={{ height: spacing.xl }} />
            <Button title={str.backToLogin} onPress={() => router.push('/(auth)/login')} variant="outline" size="lg" />
          </Animated.View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="auth">
      <KeyboardAvoidingWrapper
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.lg,
          paddingHorizontal: hPad,
        }}
      >
        <View style={styles.maxContainer}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backText}>{STRINGS.common.back}</Text>
          </Pressable>

          {/* Header */}
          <Animated.View style={[styles.header, header.animatedStyle]}>
            <Logo variant="icon" size="md" animated />
            <Text style={styles.title}>{str.title}</Text>
            <Text style={styles.subtitle}>{str.subtitle}</Text>
          </Animated.View>

          <Animated.View style={header.animatedStyle}>
            <Text style={styles.desc}>{str.description}</Text>
          </Animated.View>

          {/* Form Card (Centered, max 480px width) */}
          <Animated.View style={[shakeStyle, form.animatedStyle]}>
            <View style={styles.formCard}>
              <Input label={str.emailLabel} placeholder={str.emailPlaceholder} value={email}
                onChangeText={(t) => { setEmail(t); setEmailError(null); }} error={emailError}
                keyboardType="email-address" autoCapitalize="none" autoComplete="email" icon={<Text style={styles.ico}>✉</Text>} />
              <Button title={str.submitButton} onPress={handleReset} loading={isLoading} size="lg" />
            </View>
          </Animated.View>

          <Animated.View style={[styles.backLink, form.animatedStyle]}>
            <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
              <Text style={styles.backLinkText}>{str.backToLogin}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingWrapper>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  maxContainer: {
    width: '100%',
    maxWidth: 480, // Sleek, centered card layout on desktop and tablet
  },
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingRight: spacing.md, marginBottom: spacing.md },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, textTransform: 'uppercase' },
  header: { alignItems: 'center', marginBottom: spacing.md },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, letterSpacing: -0.5, marginTop: spacing.sm },
  subtitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.widest, textTransform: 'uppercase', marginTop: spacing.xs },
  desc: { fontFamily: fontFamilies.regular, fontSize: fontSizes.sm, color: colors.text.secondary, lineHeight: fontSizes.sm * 1.7, textAlign: 'center', marginBottom: spacing.xl, paddingHorizontal: spacing.md },
  formCard: { backgroundColor: colors.surface.default, borderWidth: 1, borderColor: colors.border.default, borderRadius: borderRadius.md, padding: spacing.base },
  ico: { fontSize: 13, color: colors.text.tertiary },
  backLink: { alignItems: 'center', marginTop: spacing.xl },
  backLinkText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.sm, color: colors.primary[400] },
  // Success state
  successWrap: { flex: 1, alignItems: 'center' },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.success.bg, borderWidth: 1, borderColor: colors.success.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  successCheck: { fontSize: 32, color: colors.primary[400] },
  successTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginBottom: spacing.sm },
  successMsg: { fontFamily: fontFamilies.regular, fontSize: fontSizes.sm, color: colors.text.secondary, lineHeight: fontSizes.sm * 1.7, textAlign: 'center', paddingHorizontal: spacing.md },
});
