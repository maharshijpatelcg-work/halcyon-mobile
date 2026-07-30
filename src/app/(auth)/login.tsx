/**
 * Halcyon — Login Screen
 * 
 * Real Google OAuth integration — opens actual Google Account Chooser.
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
import { SocialButton } from '@/components/ui/SocialButton';
import { Divider } from '@/components/ui/Divider';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { STRINGS } from '@/constants/strings';
import { isValidEmail } from '@/utils/validation';
import { errorHaptic } from '@/utils/haptics';

const str = STRINGS.auth.login;
const hPad = 24;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  const { showToast } = useToast();
  const { animatedStyle: shakeStyle, shake } = useShakeAnimation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const header = useAnimatedEntrance({ delay: 100, slideDistance: 16 });
  const form = useAnimatedEntrance({ delay: 250, slideDistance: 16 });
  const actions = useAnimatedEntrance({ delay: 400, slideDistance: 12 });

  const validate = useCallback((): boolean => {
    let valid = true;
    if (!email.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setEmailError('Please enter a valid email'); valid = false; }
    else setEmailError(null);

    if (!password) { setPasswordError('Password is required'); valid = false; }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); valid = false; }
    else setPasswordError(null);

    return valid;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validate()) { shake(); await errorHaptic(); return; }
    try {
      await signIn(email.trim(), password);
      router.replace('/(app)');
    } catch (error: any) {
      showToast(error.message ?? 'Login failed', 'error');
      shake();
      await errorHaptic();
    }
  }, [email, password, validate, signIn, router, showToast, shake]);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(app)');
    } catch (error: any) {
      showToast(error.message ?? 'Google sign-in failed', 'error');
    } finally { setGoogleLoading(false); }
  }, [signInWithGoogle, router, showToast]);

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
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backText}>{STRINGS.common.back}</Text>
          </Pressable>

          {/* Header */}
          <Animated.View style={[styles.header, header.animatedStyle]}>
            <Logo variant="icon" size="lg" animated />
            <Text style={styles.title}>{str.title}</Text>
            <Text style={styles.subtitle}>{str.subtitle}</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[shakeStyle, form.animatedStyle]}>
            <Input
              label={str.emailLabel}
              placeholder={str.emailPlaceholder}
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(null); }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              icon={<Text style={styles.cyanIcon}>✉</Text>}
            />
            <Input
              label={str.passwordLabel}
              placeholder={str.passwordPlaceholder}
              value={password}
              onChangeText={(t) => { setPassword(t); setPasswordError(null); }}
              error={passwordError}
              isPassword
              autoComplete="password"
              icon={<Text style={styles.cyanIcon}>🔒</Text>}
            />
            <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{str.forgotPassword}</Text>
            </Pressable>
            <Button title={str.submitButton} onPress={handleLogin} loading={isLoading} variant="cyan" size="lg" />
          </Animated.View>

          {/* Social — Opens REAL Google Account Chooser */}
          <Animated.View style={actions.animatedStyle}>
            <Divider text={str.orDivider} />
            <SocialButton
              provider="google"
              title={str.googleButton}
              onPress={handleGoogleLogin}
              loading={googleLoading}
            />
            <View style={styles.bottomLink}>
              <Text style={styles.bottomText}>{str.noAccount} </Text>
              <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
                <Text style={styles.bottomAction}>{str.signUpLink}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingWrapper>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  maxContainer: {
    width: '100%',
    maxWidth: 480,
  },
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingRight: spacing.md, marginBottom: spacing.md },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, textTransform: 'uppercase' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginTop: spacing.md, letterSpacing: -0.5 },
  subtitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.widest, textTransform: 'uppercase', marginTop: spacing.xs },
  cyanIcon: { fontSize: 13, color: colors.primary[400] },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.md, marginTop: -spacing.xs },
  forgotText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.primary[400] },
  bottomLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl, paddingBottom: spacing.md },
  bottomText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.sm, color: colors.text.secondary },
  bottomAction: { fontFamily: fontFamilies.medium, fontSize: fontSizes.sm, color: colors.primary[400] },
});
