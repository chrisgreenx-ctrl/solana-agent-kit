# Building the Solana Agent APK

This guide explains how to build an APK for your Solana Agent mobile app.

## Prerequisites

1. **Expo Account**: Create a free account at [expo.dev](https://expo.dev)
2. **EAS CLI**: Already installed in this project

## Step 1: Configure Your Backend URL

Before building, update the API URL in `mobile/.env` to point to your deployed backend:

```
EXPO_PUBLIC_API_URL=https://your-deployed-backend-url.com
```

**Important**: The mobile app needs to connect to your backend server. You should:
1. Deploy/publish your Replit project first
2. Use the published URL as your `EXPO_PUBLIC_API_URL`

## Step 2: Login to Expo

```bash
cd mobile
npx eas login
```

## Step 3: Configure EAS Project

Run this once to link your project to Expo:

```bash
npx eas build:configure
```

This will update your `app.json` with your project ID.

## Step 4: Build the APK

### Option A: Build on Expo's Cloud (Recommended)

This builds the APK on Expo's servers (free tier available):

```bash
npm run build:android
```

Or for a production build:

```bash
npm run build:android:prod
```

After the build completes, you'll get a download link for your APK.

### Option B: Build Locally

If you have Android SDK installed locally:

```bash
npm run build:local
```

## Build Profiles

- **preview**: Creates an APK file for testing (easier to install)
- **production**: Creates an AAB file for Play Store (or APK with current config)

## Downloading Your APK

After the cloud build completes:
1. Go to [expo.dev](https://expo.dev) and log in
2. Navigate to your project
3. Find your build and click "Download"

## Installing on Android

1. Transfer the APK to your Android device
2. Enable "Install from unknown sources" in settings
3. Open the APK file to install

## Customization

### Change App Name/Icon

Edit `mobile/app.json`:
- `name`: Display name of your app
- `icon`: Path to your app icon (1024x1024 recommended)
- `splash.image`: Splash screen image
- `android.adaptiveIcon.foregroundImage`: Android adaptive icon

### Change Package Name

Edit `mobile/app.json`:
- `android.package`: Your unique package identifier (e.g., `com.yourname.solanaagent`)

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Check that app.json is valid JSON
- Verify your Expo account is active

### App Can't Connect to Backend
- Ensure your backend is deployed and accessible
- Check the `EXPO_PUBLIC_API_URL` in `.env`
- Make sure the backend has CORS enabled for your mobile app
