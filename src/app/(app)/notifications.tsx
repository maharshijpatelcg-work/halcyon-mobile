/**
 * Halcyon — Notifications Screen
 * 
 * Incident alerts, AI auto-resolutions, system updates, and security logs.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing, getHorizontalPadding, borderRadius } from '@/theme/spacing';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/data/incidentService';
import type { NotificationItem } from '@/types/incident';
import { useToast } from '@/components/ui/Toast';

const hPad = getHorizontalPadding();

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getNotifications();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const handlePressNotification = async (item: NotificationItem) => {
    if (!item.read) {
      await markNotificationRead(item.id);
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    }
    if (item.incidentId) {
      router.push(`/(app)/incidents/${item.incidentId}` as any);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backText}>← DASHBOARD</Text>
          </Pressable>

          <View style={styles.header}>
            <View>
              <Text style={styles.topBarTitle}>SYSTEM NOTIFICATIONS & ALERTS</Text>
              <Text style={styles.mainTitle}>Notifications {unreadCount > 0 && `(${unreadCount})`}</Text>
            </View>
            {unreadCount > 0 && (
              <Button title="MARK ALL READ" onPress={handleMarkAllRead} variant="outline" size="sm" />
            )}
          </View>

          <View style={styles.list}>
            {notifications.map((item) => (
              <Pressable key={item.id} onPress={() => handlePressNotification(item)}>
                <Card variant="glass" style={!item.read ? [styles.notifCard, styles.unreadCard] : styles.notifCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.typeGroup}>
                      <Text style={styles.typeIcon}>
                        {item.type === 'incident' ? '🚨' : item.type === 'ai' ? '🤖' : item.type === 'security' ? '🔒' : '⚙️'}
                      </Text>
                      <Text style={styles.typeTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.messageText}>{item.message}</Text>
                  {item.severity && (
                    <View style={{ marginTop: spacing.xs }}>
                      <SeverityBadge severity={item.severity} />
                    </View>
                  )}
                </Card>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  maxContainer: { width: '100%', maxWidth: 1100 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: spacing.xs, marginBottom: spacing.sm },
  backText: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.primary[400], letterSpacing: letterSpacings.wider },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  topBarTitle: { fontFamily: fontFamilies.mono, fontSize: fontSizes['2xs'], color: colors.text.tertiary, letterSpacing: letterSpacings.wider, marginBottom: 2 },
  mainTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes['3xl'], color: colors.text.primary, letterSpacing: -0.5 },
  list: { gap: spacing.md },
  notifCard: { backgroundColor: '#000000', borderColor: 'rgba(255, 255, 255, 0.1)', padding: spacing.md },
  unreadCard: { borderColor: colors.primary[400], backgroundColor: 'rgba(52, 245, 230, 0.03)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  typeGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  typeIcon: { fontSize: 14 },
  typeTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, color: colors.text.primary },
  timeText: { fontFamily: fontFamilies.mono, fontSize: 10, color: colors.text.tertiary },
  messageText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: fontSizes.xs * 1.5 },
});
