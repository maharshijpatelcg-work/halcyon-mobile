/**
 * Halcyon — Register Screen (100% Pure Pitch Black #000000)
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
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, borderRadius, getHorizontalPadding } from '@/theme/spacing';
import { STRINGS } from '@/constants/strings';
import { isValidEmail, isValidName, validatePassword, doPasswordsMatch } from '@/utils/validation';
import { errorHaptic, successHaptic } from '@/utils/haptics';

const str = STRINGS.auth.register;
const hPad = getHorizontalPadding();

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const { showToast } = useToast();
  const { animatedStyle: shakeStyle, shake } = useShakeAnimation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordValidation = validatePassword(password);

  const header = useAnimatedEntrance({ delay: 100, slideDistance: 16 });
  const form = useAnimatedEntrance({ delay: 250, slideDistance: 16 });
  const actions = useAnimatedEntrance({ delay: 400, slideDistance: 12 });

  const validate = useCallback((): boolean => {
    let valid = true;
    if (!isValidName(name)) { setNameError('Name must be at least 2 characters'); valid = false; } else setNameError(null);
    if (!email.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setEmailError('Please enter a valid email'); valid = false; } else setEmailError(null);
    if (!passwordValidation.valid) { setPasswordError(passwordValidation.errors[0] ?? 'Invalid password'); valid = false; } else setPasswordError(null);
    if (!doPasswordsMatch(password, confirmPassword)) { setConfirmError('Passwords do not match'); valid = false; } else setConfirmError(null);
    return valid;
  }, [name, email, password, confirmPassword, passwordValidation]);

  const handleRegister = useCallback(async () => {
    if (!validate()) { shake(); await errorHaptic(); return; }
    try {
      await signUp(email.trim(), password, name.trim());
      await successHaptic();
      router.replace('/(app)');
    } catch (error: any) {
      showToast(error.message ?? 'Registration failed', 'error');
      shake(); await errorHaptic();
    }
  }, [validate, signUp, email, password, name, router, showToast, shake]);

  const handleGoogleRegister = useCallback(async () => {
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

          {/* Form List of Individual Card Enclosures */}
          <Animated.View style={[shakeStyle, form.animatedStyle]}>
            <Input
              label={str.nameLabel}
              placeholder={str.namePlaceholder}
              value={name}
              onChangeText={(t) => { setName(t); setNameError(null); }}
              error={nameError}
              autoCapitalize="words"
              autoComplete="name"
              icon={<Text style={styles.cyanIcon}>👤</Text>}
            />

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
              autoComplete="new-password"
              icon={<Text style={styles.cyanIcon}>🔒</Text>}
            />
            <PasswordStrength validation={passwordValidation} visible={password.length > 0} />

            <Input
              label={str.confirmPasswordLabel}
              placeholder={str.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setConfirmError(null); }}
              error={confirmError}
              isPassword
              autoComplete="new-password"
              icon={<Text style={styles.cyanIcon}>🔒</Text>}
            />

            {/* Cyan Security Note Container (100% Pure Pitch Black #000000) */}
            <View style={styles.securityNote}>
              <Text style={styles.securityIcon}>ⓘ</Text>
              <Text style={styles.securityText}>{str.securityNote}</Text>
            </View>

            {/* Top Cyan Glare Button */}
            <Button title={str.submitButton} onPress={handleRegister} loading={isLoading} variant="cyan" size="lg" />
          </Animated.View>

          {/* Social */}
          <Animated.View style={actions.animatedStyle}>
            <Divider text={str.orDivider} />
            <SocialButton provider="google" title={str.googleButton} onPress={handleGoogleRegister} loading={googleLoading} />
            <View style={styles.bottomLink}>
              <Text style={styles.bottomText}>{str.hasAccount} </Text>
              <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
                <Text style={styles.bottomAction}>{str.signInLink}</Text>
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
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingRight: spacing.md, marginBottom: spacing.sm },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, textTransform: 'uppercase' },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes['2xl'], color: colors.text.primary, marginTop: spacing.md, letterSpacing: -0.5 },
  subtitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.widest, textTransform: 'uppercase', marginTop: spacing.xs, textAlign: 'center' },
  cyanIcon: { fontSize: 13, color: colors.primary[400] },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(52, 245, 230, 0.25)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  securityIcon: { fontSize: 15, color: colors.primary[400], marginRight: spacing.sm, marginTop: 1 },
  securityText: { flex: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: fontSizes.xs * 1.6 },
  bottomLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl, paddingBottom: spacing.md },
  bottomText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.sm, color: colors.text.secondary },
  bottomAction: { fontFamily: fontFamilies.medium, fontSize: fontSizes.sm, color: colors.primary[400] },
});
