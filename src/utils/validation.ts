/**
 * Halcyon — Validation Utilities
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export interface PasswordValidation {
  valid: boolean;
  strength: 'weak' | 'fair' | 'strong' | 'excellent';
  score: number; // 0-4
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Must be at least ${PASSWORD_MIN_LENGTH} characters`);
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Must contain at least one number');
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Must contain at least one special character');
  } else {
    score++;
  }

  const strengthMap: Record<number, PasswordValidation['strength']> = {
    0: 'weak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'excellent',
  };

  return {
    valid: errors.length === 0,
    strength: strengthMap[score] ?? 'weak',
    score,
    errors,
  };
}

export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function getEmailError(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
}

export function getPasswordError(password: string): string | null {
  if (!password) return 'Password is required';
  const validation = validatePassword(password);
  if (!validation.valid) return validation.errors[0] ?? 'Invalid password';
  return null;
}

export function getNameError(name: string): string | null {
  if (!name.trim()) return 'Name is required';
  if (!isValidName(name)) return 'Name must be at least 2 characters';
  return null;
}

/**
 * Maps Firebase auth error codes to user-friendly messages.
 */
export function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'The email address is invalid.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/account-exists-with-different-credential':
      'An account already exists with a different sign-in method.',
  };

  return errorMessages[code] ?? 'An unexpected error occurred. Please try again.';
}
