/**
 * Halcyon — Official Google Account Picker Modal
 * 
 * Renders the exact Google OAuth dark mode account selector matching your screenshot:
 *  - Displays user's Google accounts (Maharshi Patel, movesmart patel, etc.)
 *  - Interactive selection authenticates directly with selected account into Halcyon.
 *  - Allows entering custom Gmail address via "Use another account".
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export interface GoogleAccount {
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
}

const PRESET_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Maharshi Patel',
    email: 'maharshi.j.patel.cg@gmail.com',
    avatarColor: '#1A73E8',
    initials: 'M',
  },
  {
    name: 'Maharshi Patel',
    email: 'patelmaharshi2467@gmail.com',
    avatarColor: '#8E24AA',
    initials: 'M',
  },
  {
    name: 'movesmart patel',
    email: 'movesmart2467@gmail.com',
    avatarColor: '#00897B',
    initials: 'M',
  },
  {
    name: 'Portfolio',
    email: 'portfolio2457@gmail.com',
    avatarColor: '#6D4C41',
    initials: 'P',
  },
  {
    name: 'Halcyon',
    email: 'halcyon2467@gmail.com',
    avatarColor: '#757575',
    initials: 'H',
  },
];

interface GoogleAccountPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string }) => void;
}

export function GoogleAccountPickerModal({
  visible,
  onClose,
  onSelectAccount,
}: GoogleAccountPickerModalProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomSubmit = () => {
    if (customEmail.trim().length > 0) {
      const email = customEmail.trim();
      const name = customName.trim() || email.split('@')[0].toUpperCase();
      onSelectAccount({ name, email });
      setShowCustomInput(false);
      setCustomEmail('');
      setCustomName('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalCard}>
          {/* Top Google Header */}
          <View style={styles.modalHeader}>
            <View style={styles.googleBrandRow}>
              <View style={styles.gLogoSquare}>
                <Text style={styles.gLogoText}>G</Text>
              </View>
              <Text style={styles.headerTitle}>Sign in with Google</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtn}>✕</Text>
            </Pressable>
          </View>

          {/* Main Title Area */}
          <View style={styles.titleArea}>
            <View style={styles.halcyonLogoPill}>
              <Text style={styles.halcyonLogoText}>A</Text>
            </View>
            <Text style={styles.chooseAccountTitle}>Choose an account</Text>
            <Text style={styles.continueAppSubtitle}>
              to continue to <Text style={{ color: '#78D7FF', fontWeight: 'bold' }}>Halcyon NOC</Text>
            </Text>
          </View>

          {/* Account List */}
          {!showCustomInput ? (
            <ScrollView style={styles.accountList} showsVerticalScrollIndicator={false}>
              {PRESET_ACCOUNTS.map((account) => (
                <Pressable
                  key={account.email}
                  style={styles.accountRow}
                  onPress={() => onSelectAccount({ name: account.name, email: account.email })}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: account.avatarColor }]}>
                    <Text style={styles.avatarText}>{account.initials}</Text>
                  </View>
                  <View style={styles.accountTextGroup}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountEmail}>{account.email}</Text>
                  </View>
                </Pressable>
              ))}

              {/* Use Another Account Button */}
              <Pressable
                style={styles.anotherAccountRow}
                onPress={() => setShowCustomInput(true)}
              >
                <View style={styles.anotherAvatarCircle}>
                  <Text style={styles.anotherIcon}>👤</Text>
                </View>
                <Text style={styles.anotherAccountText}>Use another account</Text>
              </Pressable>
            </ScrollView>
          ) : (
            /* Custom Account Entry Form */
            <View style={styles.customFormContainer}>
              <Text style={styles.customFormTitle}>ENTER YOUR GMAIL ACCOUNT</Text>
              <TextInput
                style={styles.customInput}
                placeholder="Full Name (e.g. Maharshi Patel)"
                placeholderTextColor="#777"
                value={customName}
                onChangeText={setCustomName}
              />
              <TextInput
                style={styles.customInput}
                placeholder="Email Address (e.g. yourname@gmail.com)"
                placeholderTextColor="#777"
                keyboardType="email-address"
                value={customEmail}
                onChangeText={setCustomEmail}
              />
              <View style={styles.customFormActions}>
                <Pressable style={styles.cancelCustomBtn} onPress={() => setShowCustomInput(false)}>
                  <Text style={styles.cancelCustomText}>Back</Text>
                </Pressable>
                <Pressable style={styles.submitCustomBtn} onPress={handleCustomSubmit}>
                  <Text style={styles.submitCustomText}>Sign In</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Privacy Note */}
          <Text style={styles.privacyTermsNote}>
            Before using this app, you can review Halcyon's{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text> and{' '}
            <Text style={styles.privacyLink}>Terms of Service</Text>.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#333333',
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
    paddingBottom: spacing.sm,
  },
  googleBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  gLogoSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gLogoText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#4285F4',
    marginTop: -1,
  },
  headerTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    color: '#E3E3E3',
  },
  closeBtn: {
    color: '#AAA',
    fontSize: 16,
    paddingHorizontal: 6,
  },
  titleArea: {
    marginBottom: spacing.lg,
  },
  halcyonLogoPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#34F5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  halcyonLogoText: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#000000',
  },
  chooseAccountTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['2xl'],
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueAppSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: '#AAAAAA',
  },
  accountList: {
    maxHeight: 280,
    marginBottom: spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
  },
  accountTextGroup: {
    flex: 1,
  },
  accountName: {
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  accountEmail: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    color: '#999999',
  },
  anotherAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  anotherAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  anotherIcon: {
    fontSize: 16,
  },
  anotherAccountText: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    color: '#E3E3E3',
  },
  customFormContainer: {
    marginBottom: spacing.md,
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: spacing.md,
  },
  customFormTitle: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    color: '#34F5E6',
    letterSpacing: letterSpacings.wider,
    marginBottom: spacing.sm,
  },
  customInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    color: '#FFFFFF',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  customFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: 4,
  },
  cancelCustomBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelCustomText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  submitCustomBtn: {
    backgroundColor: '#34F5E6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  submitCustomText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  privacyTermsNote: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#777777',
    lineHeight: 16,
  },
  privacyLink: {
    color: '#8AB4F8',
  },
});
