import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Check if all required Firebase config values are present
const requiredConfigKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const isFirebaseConfigured = requiredConfigKeys.every(key =>
  process.env[key] && process.env[key] !== 'your_firebase_api_key' && process.env[key] !== 'your_project_id'
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

// Initialize Firebase only if configured and on client side
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);

      // Initialize Analytics only on client side
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((error) => {
        console.warn('Firebase Analytics initialization failed:', error);
      });
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // Set to null to prevent further errors
    app = null;
    auth = null;
    db = null;
    analytics = null;
  }
} else if (typeof window !== 'undefined' && !isFirebaseConfigured) {
  console.warn('Firebase configuration is incomplete. Authentication features will be disabled.');
}

export { app, auth, db, analytics, isFirebaseConfigured };