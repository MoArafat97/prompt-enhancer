import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue, Timestamp, Firestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

// Lightweight server-side Firebase Admin helper
// Tries to initialize using either FIREBASE_SERVICE_ACCOUNT (JSON) or Application Default Credentials

let adminDb: Firestore | null = null;

function initAdmin() {
  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    // Helper to load service account from a file path
    const loadServiceAccountFromPath = (p: string) => {
      try {
        const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
        if (existsSync(abs)) {
          const raw = readFileSync(abs, 'utf8');
          return JSON.parse(raw);
        }
      } catch (_) {
        // ignore and fallback
      }
      return null;
    };

    // Try in order: JSON env, explicit env paths, known local file, then ADC
    let loadedServiceAccount: any | null = null;

    if (serviceAccountJson) {
      try {
        loadedServiceAccount = JSON.parse(serviceAccountJson);
      } catch (_) {
        loadedServiceAccount = null;
      }
    }

    if (!loadedServiceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      loadedServiceAccount = loadServiceAccountFromPath(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    }

    if (!loadedServiceAccount && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      loadedServiceAccount = loadServiceAccountFromPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }

    if (!loadedServiceAccount) {
      // Attempt to use the bundled local service account file if present
      const defaultLocalPath = path.resolve(process.cwd(), 'prompt-enhancer-4636b-firebase-adminsdk-fbsvc-31e271711e.json');
      if (existsSync(defaultLocalPath)) {
        loadedServiceAccount = loadServiceAccountFromPath(defaultLocalPath);
      }
    }

    try {
      if (loadedServiceAccount) {
        initializeApp({
          credential: cert(loadedServiceAccount),
          projectId: loadedServiceAccount.project_id || projectId,
        });
      } else {
        // Final fallback: Application Default Credentials (requires local ADC setup)
        initializeApp({
          credential: applicationDefault(),
          projectId,
        });
      }
      adminDb = getFirestore();
    } catch (e) {
      console.warn('Firebase Admin initialization failed:', e);
      adminDb = null;
    }
  } else {
    try {
      adminDb = getFirestore();
    } catch (e) {
      console.warn('Failed to get Firestore instance:', e);
      adminDb = null;
    }
  }
}

export function getAdminDb(): Firestore | null {
  try {
    if (!adminDb) initAdmin();
    return adminDb;
  } catch (e) {
    console.warn('Firebase Admin initialization failed:', e);
    return null;
  }
}

export async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    if (!getAdminDb()) return null;
    const auth = getAuth();
    const decoded = await auth.verifyIdToken(idToken);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}



