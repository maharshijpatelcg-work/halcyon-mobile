/**
 * Halcyon — Settings Data Service
 */
import type { UserProfile, WorkspaceConfig, GitHubConnection, NotificationPrefs, SecuritySettings, SubscriptionInfo } from '@/types/settings';
import { MOCK_WORKSPACE, MOCK_GITHUB_REPOS, MOCK_SUBSCRIPTION, MOCK_NOTIFICATION_PREFS, MOCK_SECURITY } from './mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

let workspace = { ...MOCK_WORKSPACE };
let notifPrefs = { ...MOCK_NOTIFICATION_PREFS };
let security = { ...MOCK_SECURITY };
let githubConnection: GitHubConnection = { connected: false };

export async function getUserProfile(user: { displayName: string | null; email: string | null; uid: string; photoURL: string | null }): Promise<UserProfile> {
  await delay(200);
  return {
    uid: user.uid,
    displayName: user.displayName || 'Engineer',
    email: user.email || 'unknown@halcyon.ai',
    photoURL: user.photoURL,
    role: 'ADMIN',
    joinedAt: '2026-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
  };
}

export async function getWorkspaceConfig(): Promise<WorkspaceConfig> {
  await delay(200);
  return { ...workspace };
}

export async function updateWorkspaceConfig(updates: Partial<WorkspaceConfig>): Promise<WorkspaceConfig> {
  await delay(300);
  workspace = { ...workspace, ...updates };
  return workspace;
}

export async function getGitHubConnection(): Promise<GitHubConnection> {
  await delay(200);
  return { ...githubConnection };
}

export async function connectGitHub(): Promise<GitHubConnection> {
  await delay(800);
  githubConnection = {
    connected: true,
    username: 'maharshijpatel',
    avatarUrl: 'https://github.com/maharshijpatel.png',
    repositories: MOCK_GITHUB_REPOS,
    selectedRepo: 'halcyon-infra',
    selectedBranch: 'main',
    webhookActive: true,
    lastSync: new Date().toISOString(),
  };
  return { ...githubConnection };
}

export async function disconnectGitHub(): Promise<void> {
  await delay(300);
  githubConnection = { connected: false };
}

export async function selectGitHubRepo(repoName: string): Promise<GitHubConnection> {
  await delay(200);
  const repo = MOCK_GITHUB_REPOS.find(r => r.name === repoName);
  githubConnection = {
    ...githubConnection,
    selectedRepo: repoName,
    selectedBranch: repo?.defaultBranch || 'main',
  };
  return { ...githubConnection };
}

export async function selectGitHubBranch(branch: string): Promise<GitHubConnection> {
  await delay(200);
  githubConnection = { ...githubConnection, selectedBranch: branch };
  return { ...githubConnection };
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  await delay(200);
  return { ...notifPrefs };
}

export async function updateNotificationPrefs(updates: Partial<NotificationPrefs>): Promise<NotificationPrefs> {
  await delay(300);
  notifPrefs = { ...notifPrefs, ...updates };
  return notifPrefs;
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  await delay(200);
  return { ...security };
}

export async function toggleTwoFactor(): Promise<SecuritySettings> {
  await delay(500);
  security = { ...security, twoFactorEnabled: !security.twoFactorEnabled };
  return { ...security };
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  await delay(200);
  return { ...MOCK_SUBSCRIPTION };
}
