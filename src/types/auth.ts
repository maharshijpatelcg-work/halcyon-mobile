/**
 * Halcyon — Auth Types
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export type AuthProvider = 'email' | 'google';
