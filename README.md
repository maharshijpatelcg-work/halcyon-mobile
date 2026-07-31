# 🚀 Halcyon — AI Incident Intelligence Platform (Mobile)

![Halcyon Banner](https://img.shields.io/badge/Halcyon-AI%20Incident%20Intelligence-000000?style=for-the-badge&logo=react&logoColor=34F5E6)
![Expo](https://img.shields.io/badge/Expo-SDK%2057-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86.0-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-000000?style=for-the-badge&logo=typescript&logoColor=3178C6)
![License](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge)

Halcyon Mobile is an enterprise-grade AI Incident Intelligence application built with **React Native**, **Expo SDK 57**, and **TypeScript**. Designed for SREs and DevOps teams to detect, analyze, correlate, and resolve production incidents using AI-powered memory retrieval and historical incident intelligence.

---

## 📋 Table of Contents

1. [Key Features](#-key-features)
2. [Technology Stack](#%EF%B8%8F-technology-stack)
3. [Installation Guide](#-installation-guide)
4. [Firebase Setup Guide](#-firebase-setup-guide)
5. [Google Authentication Guide](#-google-authentication-guide)
6. [Secure Storage Specification](#-secure-storage-specification)
7. [Build Guide (EAS Build)](#-build-guide-eas-build)
   - [Development Build](#1-development-build)
   - [Preview APK Generation](#2-preview-apk-generation)
   - [Production AAB (.aab) Generation](#3-production-android-app-bundle-aab)
   - [Production iOS Build](#4-production-ios-build)
8. [Deployment & App Distribution](#-deployment--app-distribution)
9. [GitHub Release Strategy](#-github-release-strategy)
10. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 🌟 Key Features

- 🖤 **Liquid Obsidian Dark Theme:** Dark UI (`#030614`) with crisp Liquid Cyan (`#34F5E6`) accents, dark crystal glass cards, and monospace technical labels.
- 🔐 **Multi-Provider Authentication:**
  - Firebase Email & Password authentication.
  - Native Google Sign-In (`@react-native-google-signin/google-signin`).
  - Graceful fallback mode when native binaries or credentials are operating in preview/offline mode.
  - Secure encrypted storage (`expo-secure-store`) for tokens, user profiles, workspace IDs, preferences, theme, and language.
- 📱 **Production-Ready Application Flow:**
  - **Animated Splash Screen:** Smooth logo reveal & state-based navigation guard.
  - **Landing Screen:** Hero showcase ("*Incident memory, calmed.*"), feature cards, and CTA buttons.
  - **Login Screen:** Validation, error shake animation, password toggle & Google sign-in.
  - **Register Screen:** Create account form with real-time 4-bar password strength meter.
  - **Forgot Password Screen:** Password recovery flow with animated success state.
  - **Dashboard (Operator View):** System status badge, metrics grid (`INCIDENTS`, `LATENCY`, `UPTIME`), incident intelligence feed, and settings drawer.
- ⚡ **Performance & UX:**
  - 60 FPS native animations powered by **React Native Reanimated 4**.
  - Micro-haptic feedback integration (`expo-haptics`).
  - Toast notification system with queueing & auto-dismissal.
  - Safe Area & dynamic notch support across iOS, Android, and Web.

---

## 🛠️ Technology Stack

| Category | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo SDK 57 | `57.0.8` | Core mobile application framework |
| **Core Engine** | React Native | `0.86.0` | Native UI components & engine |
| **Language** | TypeScript | `~6.0.3` | Type safety & strict compiler options |
| **Routing** | Expo Router | `~57.0.8` | File-based navigation & route guards |
| **Styling** | NativeWind / TailwindCSS | `^4.2.6` / `^3.4.19` | Utility-first responsive design |
| **Animations** | React Native Reanimated | `4.5.0` | 60 FPS UI animations |
| **Auth Engine** | `@react-native-firebase/auth` | `^25.1.0` | Firebase Auth native SDK |
| **Google Auth** | `@react-native-google-signin` | `^16.1.4` | Native Google Sign-In |
| **Storage** | `expo-secure-store` | `~57.0.1` | Hardware-backed encrypted key-value store |

---

## 📦 Installation Guide

### Prerequisites

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Expo CLI**: `npx expo`
- **EAS CLI**: `npm install -g eas-cli` (for builds)
- **Android Studio & SDK**: (For local Android emulation / development build)
- **Xcode**: (For local iOS development on macOS)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/halcyon/halcyon-mobile.git
   cd halcyon-mobile
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your Firebase Web Client ID:
   ```env
   EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=your-firebase-web-client-id-here.apps.googleusercontent.com
   ```

4. **Start Development Server:**
   ```bash
   npm start
   ```

---

## 🔥 Firebase Setup Guide

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Click **Add Project** and name it `halcyon-mobile`.

2. **Register Android App:**
   - Package Name: `com.halcyon.mobile`
   - Download `google-services.json` and place it in the root folder `./google-services.json`.

3. **Register iOS App:**
   - Bundle ID: `com.halcyon.mobile`
   - Download `GoogleService-Info.plist` and place it in the root folder `./GoogleService-Info.plist`.

4. **Enable Auth Providers:**
   - Navigate to **Authentication > Sign-in method**.
   - Enable **Email/Password**.
   - Enable **Google**.

---

## 🔑 Google Authentication Guide

1. **Obtain Web Client ID:**
   - In Firebase Console under **Authentication > Sign-in method > Google**, copy the **Web Client ID**.
   - Paste it into your `.env` file under `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID`.

2. **Generate Android Key SHA-1 & SHA-256:**
   - Run in the `./android` folder:
     ```bash
     ./gradlew signingReport
     ```
   - Copy the `SHA1` and `SHA256` fingerprints for debug and release variants.
   - Paste them into Firebase Console under **Project Settings > Android Apps > Add fingerprint**.

---

## 🔐 Secure Storage Specification

Sensitive operational data is encrypted using `expo-secure-store` (Keychain on iOS, Keystore on Android):

| Key | Description | Storage Helper |
| :--- | :--- | :--- |
| `halcyon_auth_token` | JWT Access Token | `getAccessToken()` / `saveAuthTokens()` |
| `halcyon_refresh_token` | Refresh Token | `getRefreshToken()` / `saveAuthTokens()` |
| `halcyon_user_data` | User Profile Object | `getUserData()` / `saveUserData()` |
| `halcyon_firebase_uid` | Firebase UID | `getFirebaseUid()` / `saveFirebaseUid()` |
| `halcyon_workspace_id` | Workspace Identifier | `getWorkspaceId()` / `saveWorkspaceId()` |
| `halcyon_preferences` | Operational Preferences | `getUserPreferences()` / `saveUserPreferences()` |
| `halcyon_theme_mode` | Dark/Light/System Theme | `getThemeMode()` / `saveThemeMode()` |
| `halcyon_language` | Preferred i18n Locale | `getLanguage()` / `saveLanguage()` |

---

## 🏗️ Build Guide (EAS Build)

### 1. Development Build
Used for debugging on physical devices with native code support:
```bash
eas build --profile development --platform android
```

### 2. Preview APK Generation
Generates a standalone, shareable `.apk` file for testing:
```bash
eas build --profile preview --platform android
```

### 3. Production Android App Bundle (.aab)
Generates an optimized, signed `.aab` file ready for Google Play Store upload:
```bash
eas build --profile production --platform android
```

### 4. Production iOS Build
Generates signed iOS build for Apple TestFlight / App Store:
```bash
eas build --profile production --platform ios
```

---

## 🚀 Deployment & App Distribution

### Google Play Store (.aab)
1. Generate release bundle using `eas build --profile production --platform android`.
2. Login to [Google Play Console](https://play.google.com/console).
3. Create a new Release in **Production** or **Internal Testing**.
4. Upload the generated `.aab` file and complete store listing.

### Apple App Store
1. Generate iOS release build using `eas build --profile production --platform ios`.
2. Submit automatically using `eas submit --platform ios` or upload via Transporter to App Store Connect.

---

## 🏷️ GitHub Release Strategy

Follow semantic versioning (`v1.0.0`, `v1.1.0`):

1. **Tag Version:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Initial Production Build"
   git push origin v1.0.0
   ```

2. **Attach Assets:**
   - Build preview APK: `eas build --profile preview --platform android`
   - Attach the generated APK to the GitHub Release notes.

---

## ❓ Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `GoogleSignin.signIn() error` | Missing SHA-1 / Incorrect Web Client ID | Verify SHA-1 fingerprint in Firebase console & check `.env` client ID. |
| `getValueWithKeyAsync error` | Calling SecureStore on Web preview | Handled automatically by `secureStorage.ts` web fallback. |
| `Font loading delay` | Async font fetch | Handled in `_layout.tsx` with `SplashScreen.preventAutoHideAsync()`. |
| `NativeWind styling missing` | Missing Metro plugin | Ensure `metro.config.js` uses `withNativeWind`. |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/maharshi%20patel/Desktop/Halcyon-MOBILE/halcyon-mobile/LICENSE) file for details.
