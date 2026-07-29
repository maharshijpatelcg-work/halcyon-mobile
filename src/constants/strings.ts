/**
 * Halcyon — User-facing Strings
 * 
 * All text centralized for future i18n.
 */

export const STRINGS = {
  // ─── Auth Screens ─────────────────────────────
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'ACCESS YOUR HALCYON DASHBOARD',
      emailLabel: 'EMAIL',
      emailPlaceholder: 'e.g. engineer@company.com',
      passwordLabel: 'PASSWORD',
      passwordPlaceholder: '••••••••',
      forgotPassword: 'Forgot Password?',
      submitButton: 'LOGIN & CONNECT',
      noAccount: 'First time using Halcyon?',
      signUpLink: 'Create Workspace',
      orDivider: 'OR CONTINUE WITH',
      googleButton: 'CONTINUE WITH GOOGLE',
    },
    register: {
      title: 'Create Account',
      subtitle: 'DEPLOY YOUR INTELLIGENT MEMORY CLUSTER',
      nameLabel: 'FULL NAME',
      namePlaceholder: 'e.g. Jane Doe',
      emailLabel: 'EMAIL',
      emailPlaceholder: 'e.g. engineer@company.com',
      passwordLabel: 'PASSWORD',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'CONFIRM PASSWORD',
      confirmPasswordPlaceholder: '••••••••',
      submitButton: 'REGISTER & SETUP',
      hasAccount: 'Already registered?',
      signInLink: 'Sign in',
      orDivider: 'OR CONTINUE WITH',
      googleButton: 'CONTINUE WITH GOOGLE',
      securityNote: 'Signing up automatically configures a new isolated, encrypted telemetry workspace.',
    },
    forgotPassword: {
      title: 'Reset Password',
      subtitle: 'RECOVER YOUR WORKSPACE ACCESS',
      description: 'Enter your registered email address and we\'ll send you instructions to reset your password.',
      emailLabel: 'EMAIL',
      emailPlaceholder: 'e.g. engineer@company.com',
      submitButton: 'SEND RESET LINK',
      backToLogin: 'Back to Sign In',
      successTitle: 'Email Sent!',
      successMessage: 'Check your inbox for password reset instructions. If you don\'t see it, check your spam folder.',
    },
    landing: {
      heroTitle: 'Incident memory,',
      heroAccent: 'calmed.',
      heroSubtitle: 'Instantly resolve system alerts by tapping into an active, self-learning institutional memory of past fixes.',
      ctaPrimary: 'Enter Dashboard →',
      ctaSecondary: 'Create Workspace',
      feature1Title: 'INTELLIGENT DETECTION',
      feature1Desc: 'AI-powered pattern recognition across your incident history.',
      feature2Title: 'MEMORY CORRELATION',
      feature2Desc: 'Self-learning system that connects current alerts to past fixes.',
      feature3Title: 'RAPID RESOLUTION',
      feature3Desc: 'Reduce MTTR with instant access to proven solutions.',
    },
  },

  // ─── Common ───────────────────────────────────
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    cancel: 'Cancel',
    back: '← BACK',
  },
} as const;
