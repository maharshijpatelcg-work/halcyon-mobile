/**
 * Halcyon — Keyboard Avoiding Wrapper
 */
import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function KeyboardAvoidingWrapper({
  children,
  style,
  contentContainerStyle,
}: KeyboardAvoidingWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
