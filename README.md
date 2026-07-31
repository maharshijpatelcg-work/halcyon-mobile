# 🚀 Halcyon — AI Incident Intelligence Platform (Mobile)

![Halcyon Banner](https://img.shields.io/badge/Halcyon-AI%20Incident%20Intelligence-000000?style=for-the-badge&logo=react&logoColor=34F5E6)
![Expo](https://img.shields.io/badge/Expo-SDK%2057-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86.0-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-000000?style=for-the-badge&logo=typescript&logoColor=3178C6)
![License](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge)

Halcyon Mobile is an enterprise-grade AI Incident Intelligence application built with **React Native**, **Expo SDK 57**, and **TypeScript**. Designed for DevOps engineers and SREs to detect, analyze, correlate, and resolve production incidents using AI-powered memory retrieval and historical incident intelligence.

---

## 🌟 Key Features

- 🖤 **Liquid Obsidian Pitch Black Theme:** Premium dark UI (`#000000`) with crisp Liquid Cyan (`#34F5E6`) accents, dark crystal glass cards, and monospace technical labels.
- 🔐 **Authentication System:**
  - Firebase Email & Password authentication.
  - Native Google Sign-In (`@react-native-google-signin/google-signin`).
  - Graceful fallback mode when Firebase credentials are not yet initialized.
  - Secure encrypted storage (`expo-secure-store`) for user data & tokens.
- 📱 **5 Production-Ready Screens:**
  - **Animated Splash Screen:** Smooth logo reveal & state-based navigation guard.
  - **Landing Screen:** Hero showcase ("*Incident memory, calmed.*"), feature highlight cards, and CTA buttons.
  - **Login Screen:** Input validation, error shake animation, password toggle & Google sign-in.
  - **Register Screen:** Create account form with real-time 4-bar password strength meter & security workspace note.
  - **Forgot Password Screen:** Password recovery flow with animated success state.
  - **Dashboard (Operator View):** System health status badge, metrics grid (`INCIDENTS`, `LATENCY`, `UPTIME`), and incident intelligence feed.
- ⚡ **Performance & UX:**
  - 60 FPS native animations powered by **React Native Reanimated 4**.
  - Micro-haptic feedback integration (`expo-haptics`).
  - Toast notification system with queueing & auto-dismissal.
  - Safe Area & dynamic notch support across iOS, Android, and Web.

---

## 🛠️ Technology Stack

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | Expo SDK 57 (`57.0.8`) | React Native cross-platform app framework |
| **Core Library** | React Native `0.86.0` / React `19.2.3` | UI component foundation |
| **Routing** | Expo Router (`expo-router`) | File-based navigation structure |
| **Styling** | NativeWind v4 & TailwindCSS 3 | Utility-first mobile design system |
| **Animations** | React Native Reanimated `4.5.0` | High-performance 60 FPS gesture animations |
| **Auth Native** | `@react-native-firebase/auth` | Enterprise auth engine |
| **Google Auth** | `@react-native-google-signin` | Native Google Sign-In plugin |
| **Storage** | `expo-secure-store` | Encrypted key-value storage |
| **Tunneling** | `@expo/ngrok` | Development build tunnel mode |

---

## 📁 Directory Structure

```
halcyon-mobile/
├── app.json                      # Expo config plugins & app manifest
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # Path aliases (@/* -> ./src/*)
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Project git ignore
└── src/
    ├── app/                      # Expo Router Navigation Screens
    │   ├── _layout.tsx           # Root Layout (Fonts, Theme, Auth, Toast Providers)
    │   ├── index.tsx             # Entry Redirect -> /splash
    │   ├── splash.tsx            # Animated Splash Screen
    │   ├── +not-found.tsx        # 404 Screen
    │   ├── (auth)/               # Auth Stack Group
    │   │   ├── _layout.tsx       # Auth Layout
    │   │   ├── index.tsx         # Landing Screen (Home '/')
    │   │   ├── login.tsx         # Login Screen
    │   │   ├── register.tsx      # Register Screen
    │   │   └── forgot-password.tsx# Forgot Password Screen
    │   └── (app)/                # Protected App Group
    │       ├── _layout.tsx       # Auth Guard Layout
    │       └── index.tsx         # Dashboard Operator Screen
    ├── components/
    │   └── ui/                   # Reusable UI System
    │       ├── Button.tsx        # Monospace uppercase button with scale press
    │       ├── Input.tsx         # Embedded glass input with focus state
    │       ├── Card.tsx          # Pitch black glass container (16-24px radius)
    │       ├── Toast.tsx         # Slide-in toast notification system
    │       ├── Divider.tsx       # Monospace divider
    │       ├── SocialButton.tsx  # Native Google Sign-In button
    │       ├── Logo.tsx          # Halcyon shield logo component
    │       ├── LoadingSpinner.tsx# Pulsing activity loader
    │       ├── GradientBackground.tsx# Pure pitch black backdrop (#000000)
    │       ├── KeyboardAvoidingWrapper.tsx# Safe-area aware scroll wrapper
    │       └── PasswordStrength.tsx# Real-time password strength meter
    ├── constants/
    │   ├── app.ts                # App branding & storage keys
    │   └── strings.ts            # Centralized UI text strings
    ├── hooks/
    │   ├── useAnimatedEntrance.ts# Staggered fade + slide-up animation
    │   ├── usePulseAnimation.ts  # Infinite pulse animation
    │   ├── useShakeAnimation.ts  # Form validation error feedback
    │   └── useScalePress.ts      # Scale press-in effect (0.97x)
    ├── services/
    │   ├── firebase/
    │   │   └── config.ts         # Firebase initialization
    │   └── auth/
    │       ├── authService.ts    # Firebase Email/Password auth service
    │       ├── googleAuth.ts     # Google Sign-In service
    │       └── secureStorage.ts  # Encrypted secure store helpers
    ├── store/
    │   └── AuthContext.tsx       # Auth Provider Context & listener
    ├── theme/
    │   ├── colors.ts             # Pitch Black (#000000) & Liquid Cyan (#34F5E6) palette
    │   ├── typography.ts         # Inter & Monospace font presets
    │   ├── spacing.ts            # Responsive 4px grid & border radius
    │   ├── shadows.ts            # Shadow factory
    │   └── ThemeProvider.tsx     # Theme Provider Context
    ├── types/
    │   └── auth.ts               # User & Auth TypeScript interfaces
    └── utils/
        ├── validation.ts         # Email/password validation & error parser
        └── haptics.ts            # Haptic feedback utility
```

---

## 🎨 Design System Palette

| Token Name | Color Code | Purpose |
| :--- | :--- | :--- |
| `background.primary` | `#000000` | Pure Pitch Black Main Background |
| `background.secondary` | `#070A0F` | Deep Obsidian Container Surface |
| `surface.default` | `#0D111A` | Dark Glass Card Surface |
| `primary[400]` | `#34F5E6` | Liquid Cyan Accent / Links / Active Badges |
| `secondary[300]` | `#78D7FF` | Crystal Blue Secondary Accent |
| `text.primary` | `#FFFFFF` | Brilliant White Primary Text |
| `text.secondary` | `#B8C6D8` | Soft Blue-Gray Subtitles |
| `text.tertiary` | `#8390A5` | Muted Labels & Monospace Meta |
| `success.default` | `#22F2B4` | Emerald Status Indicator |
| `error.default` | `#FF6478` | Coral Error Text & Borders |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `18.x` or later
- npm or yarn
- Expo Go App on mobile device, Android Studio Emulator, or iOS Simulator

### 1. Installation
Clone the repository and install dependencies:
```bash
cd halcyon-mobile
npm install
```

### 2. Run Locally
Start the Expo Metro Bundler:
```bash
# Start default Expo server
npm start

# Start with Web preview
npm run web

# Start with Tunnel mode for external mobile devices
npx expo start --tunnel
```

---

## 🔐 Firebase & Google Sign-In Setup

To enable full native Firebase Authentication & Google Sign-In:

1. **Firebase Project Setup:**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Add an **Android App** with package name `com.halcyon.mobile`.
   - Add an **iOS App** with bundle identifier `com.halcyon.mobile`.

2. **Download Config Files:**
   - Place `google-services.json` inside the `halcyon-mobile/` root directory for Android.
   - Place `GoogleService-Info.plist` inside the `halcyon-mobile/` root directory for iOS.

3. **Configure Environment:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Set `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID` with your Web Client ID from Firebase Authentication settings.

4. **Build Development Binary:**
   ```bash
   # Run on Android
   npx expo run:android

   # Run on iOS
   npx expo run:ios
   ```

---

## 📜 Commands Reference

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Clear Metro bundler cache and start
npx expo start --clear

# Lint codebase
npx expo lint
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
