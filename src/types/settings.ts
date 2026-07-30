/**
 * Halcyon — Settings & Configuration Types
 * 
 * Data structures for user profile, workspace, GitHub, and preferences.
 */

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  joinedAt: string;
  lastActive: string;
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  region: string;
  memberCount: number;
  createdAt: string;
  tier: SubscriptionTier;
  logsUsedToday: number;
  logsLimit: number;
}

export interface GitHubConnection {
  connected: boolean;
  username?: string;
  avatarUrl?: string;
  repositories?: GitHubRepo[];
  selectedRepo?: string;
  selectedBranch?: string;
  webhookActive?: boolean;
  lastSync?: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  private: boolean;
  branches: string[];
  defaultBranch: string;
  language: string;
  updatedAt: string;
}

export interface NotificationPrefs {
  pushEnabled: boolean;
  emailEnabled: boolean;
  severityThreshold: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string;   // HH:mm
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  activeSessions: SessionInfo[];
  apiKeys: ApiKeyInfo[];
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  prefix: string; // first 8 chars
  createdAt: string;
  lastUsed: string;
  scopes: string[];
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  startDate: string;
  nextBillingDate?: string;
  logsUsed: number;
  logsLimit: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  features: string[];
}

export interface AppSettings {
  theme: 'dark'; // only dark for now
  language: string;
  notifications: NotificationPrefs;
  security: SecuritySettings;
}
