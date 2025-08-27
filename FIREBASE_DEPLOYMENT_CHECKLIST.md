# Firebase Deployment Checklist

## Issue: Sign-in button greyed out/disabled on Vercel deployment

### Potential Causes and Solutions:

## 1. Environment Variables in Vercel

**Check if all Firebase environment variables are properly set in Vercel:**

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables" section
4. Ensure all these variables are set:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB49CP9P1zU_EmxM7Pxerjf9PQEPynnnms
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prompt-enhancer-4636b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prompt-enhancer-4636b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prompt-enhancer-4636b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=27112504451
NEXT_PUBLIC_FIREBASE_APP_ID=1:27112504451:web:b65ba67d8549d2ee486fb6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-C6X317PW42
```

**Important:** Make sure these are set for all environments (Production, Preview, Development)

## 2. Firebase Project Configuration

**Check Firebase Console settings:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `prompt-enhancer-4636b`
3. Go to "Authentication" > "Settings" > "Authorized domains"
4. Ensure these domains are added:
   - `localhost` (for development)
   - `prompt-enhancer.vercel.app` (your production domain)
   - `*.vercel.app` (for preview deployments)

## 3. Google OAuth Configuration

**Check Google Cloud Console:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID
5. Edit the client and ensure these are in "Authorized JavaScript origins":
   - `https://prompt-enhancer.vercel.app`
   - `https://*.vercel.app`
6. Ensure these are in "Authorized redirect URIs":
   - `https://prompt-enhancer.vercel.app/__/auth/handler`
   - `https://*.vercel.app/__/auth/handler`

## 4. Debug Steps

### Step 1: Check Environment Variables
Visit: `https://your-domain.vercel.app/api/debug/firebase?token=debug123`

This will show you if all environment variables are properly set.

### Step 2: Check Firebase Initialization
Visit: `https://your-domain.vercel.app/debug/firebase`

This will show you detailed Firebase initialization status.

### Step 3: Check Browser Console
1. Open your deployed app
2. Open browser developer tools (F12)
3. Check the Console tab for any Firebase-related errors
4. Look for errors like:
   - "Firebase configuration is incomplete"
   - "Firebase Auth not initialized"
   - OAuth popup blocked errors

## 5. Common Issues and Fixes

### Issue: "Firebase configuration is incomplete"
**Solution:** Ensure all environment variables are set in Vercel and redeploy.

### Issue: "Popup blocked" or OAuth errors
**Solution:** Check authorized domains in Firebase and Google Cloud Console.

### Issue: "Auth domain mismatch"
**Solution:** Verify the auth domain matches exactly: `prompt-enhancer-4636b.firebaseapp.com`

### Issue: Button disabled but no errors
**Solution:** Check if `isFirebaseConfigured` is returning false due to missing env vars.

## 6. Deployment Commands

After making changes to environment variables in Vercel:

```bash
# Trigger a new deployment
vercel --prod

# Or redeploy from Vercel dashboard
```

## 7. Testing Checklist

- [ ] Environment variables are set in Vercel
- [ ] Firebase authorized domains include your Vercel domain
- [ ] Google OAuth authorized origins include your Vercel domain
- [ ] No console errors in browser
- [ ] Firebase debug page shows all services initialized
- [ ] Sign-in button is clickable and not greyed out
- [ ] Google sign-in popup opens successfully
- [ ] Authentication completes and redirects properly

## 8. Emergency Fallback

If Firebase continues to fail, the app has fallback authentication that should still allow basic functionality. Check the `auth-fallback.ts` file for fallback behavior.
