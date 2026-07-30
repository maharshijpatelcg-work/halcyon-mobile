/**
 * Halcyon — Auth Context & Provider (Real Google OAuth)
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User, AuthState, AuthError } from '@/types/auth';
import * as authService from '@/services/auth/authService';
import * as googleAuth from '@/services/auth/googleAuth';
import { clearAuthStorage, saveUserData } from '@/services/auth/secureStorage';
import { getAuthErrorMessage } from '@/utils/validation';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          try { await saveUserData(firebaseUser); } catch (e) { console.warn('[AuthProvider] Storage save note:', e); }
        }
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleAuthError = (err: any) => {
    const code = err?.code ?? 'auth/unknown';
    const message = err?.message ?? getAuthErrorMessage(code);
    setError({ code, message });
    throw { code, message };
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const signedInUser = await authService.signInWithEmail(email, password);
      setUser(signedInUser);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleAuthError(err);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const signedUpUser = await authService.signUpWithEmail(email, password, displayName);
      setUser(signedUpUser);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleAuthError(err);
    }
  }, []);

  const signInWithGoogleFn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const googleUser = await googleAuth.signInWithGoogle();
      setUser(googleUser);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleAuthError(err);
    }
  }, []);

  const signOutFn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await googleAuth.signOutFromGoogle();
      await authService.signOut();
      await clearAuthStorage();
      setUser(null);
    } catch (err) {
      setIsLoading(false);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPasswordFn = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleAuthError(err);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signInWithGoogle: signInWithGoogleFn,
    signOut: signOutFn,
    resetPassword: resetPasswordFn,
    clearError,
  }), [user, isLoading, error, signIn, signUp, signInWithGoogleFn, signOutFn, resetPasswordFn, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
