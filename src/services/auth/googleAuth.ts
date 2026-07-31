/**
 * Halcyon — Google Auth Service (Real Google OAuth)
 * 
 * Uses Google Identity Services (GIS) on Web for real account selection.
 * Uses @react-native-google-signin on native platforms.
 */
import { Platform } from 'react-native';
import type { User } from '@/types/auth';
import { saveUserSession, saveFirebaseUid } from './secureStorage';

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || '778035867822-vml065k7lqfvgnqacugfv8hpli29qjnf.apps.googleusercontent.com';

let googleSigninModule: any = null;
let firebaseAuthModule: any = null;

function getGoogleSignin() {
  if (Platform.OS === 'web') return null;
  if (!googleSigninModule) {
    try {
      googleSigninModule = require('@react-native-google-signin/google-signin');
    } catch {
      return null;
    }
  }
  return googleSigninModule;
}

function getFirebaseAuth() {
  if (Platform.OS === 'web') return null;
  if (!firebaseAuthModule) {
    try {
      firebaseAuthModule = require('@react-native-firebase/auth');
    } catch {
      return null;
    }
  }
  return firebaseAuthModule;
}

export function configureGoogleSignIn() {
  if (Platform.OS === 'web') return;
  const mod = getGoogleSignin();
  if (mod) {
    try {
      mod.GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });
    } catch {}
  }
}

// ─── Web: Load Google Identity Services SDK ────────────────
let gisLoaded = false;
let gisLoadPromise: Promise<void> | null = null;

function loadGISScript(): Promise<void> {
  if (Platform.OS !== 'web') return Promise.resolve();
  if (gisLoaded) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') { reject(new Error('No document')); return; }
    
    // Check if already loaded
    if ((window as any).google?.accounts?.oauth2) {
      gisLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => { gisLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

// ─── Web: Real Google OAuth with Account Chooser ───────────
async function signInWithGoogleWeb(): Promise<User> {
  await loadGISScript();

  return new Promise<User>((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not available'));
      return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      prompt: 'select_account',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error));
          return;
        }

        try {
          // Fetch real user profile from Google
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          const profile = await res.json();

          const user: User = {
            uid: `google-${profile.sub}`,
            email: profile.email || null,
            displayName: profile.name || profile.email || 'Google User',
            photoURL: profile.picture || null,
            emailVerified: profile.email_verified || false,
            providerId: 'google.com',
          };

          await saveUserSession(user);
          resolve(user);
        } catch (err) {
          reject(err);
        }
      },
      error_callback: (err: any) => {
        reject(new Error(err?.message || 'Google sign-in cancelled'));
      },
    });

    // This opens the real Google Account Chooser popup
    tokenClient.requestAccessToken();
  });
}

// ─── Native: Google Sign-In via Firebase ───────────────────
async function signInWithGoogleNative(): Promise<User> {
  const mod = getGoogleSignin();
  const authMod = getFirebaseAuth();

  if (mod && authMod) {
    const { GoogleSignin } = mod;
    const auth = authMod.default;

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (idToken) {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? null,
        displayName: firebaseUser.displayName ?? 'Google User',
        photoURL: firebaseUser.photoURL ?? null,
        emailVerified: true,
        providerId: 'google.com',
      };

      await saveUserSession(user);
      await saveFirebaseUid(user.uid);
      return user;
    }
  }

  throw new Error('Google Sign-In not available on this device');
}

// ─── Public API ────────────────────────────────────────────

/**
 * Sign in with Google — opens real Google Account Chooser
 */
export async function signInWithGoogle(): Promise<User> {
  if (Platform.OS === 'web') {
    return signInWithGoogleWeb();
  }
  return signInWithGoogleNative();
}

/**
 * Sign in with a pre-selected Google account (from modal fallback)
 */
export async function signInWithSelectedGoogleAccount(account: { name: string; email: string; photoURL?: string }): Promise<User> {
  const user: User = {
    uid: `google-user-${Date.now()}`,
    email: account.email,
    displayName: account.name,
    photoURL: account.photoURL ?? null,
    emailVerified: true,
    providerId: 'google.com',
  };
  await saveUserSession(user);
  return user;
}

export async function signOutFromGoogle() {
  if (Platform.OS === 'web') return;
  const mod = getGoogleSignin();
  if (!mod) return;
  try {
    await mod.GoogleSignin.revokeAccess();
    await mod.GoogleSignin.signOut();
  } catch {}
}
