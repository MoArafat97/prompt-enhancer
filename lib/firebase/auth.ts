import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  User,
  UserCredential,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { isFirebaseConfigured, ensureFirebaseClient, getFirebaseStatus, getFirebaseInstances } from './config';
import { UserProfile } from './types';
import * as fallbackAuth from './auth-fallback';

// Auth providers
const googleProvider = new GoogleAuthProvider();

// Helper function to create user profile
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Ensure Firebase is initialized
  if (typeof window !== 'undefined') {
    const initSuccess = await ensureFirebaseClient();
    if (!initSuccess) {
      throw new Error('Firebase Firestore initialization failed');
    }
  }
  
  const { db } = getFirebaseInstances();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized on client');
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!.split('@')[0],
      photoURL: user.photoURL || undefined,
      preferences: {
        defaultTechnique: 'clarity',
        defaultFormat: 'natural',
        emailNotifications: true,
        apiKeys: {},
      },
    };

    await setDoc(userRef, {
      ...newProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...newProfile,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
  }

  return userSnap.data() as UserProfile;
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  // Ensure Firebase client is ready
  const initSuccess = await ensureFirebaseClient();
  if (!initSuccess) {
    throw new Error('Firebase authentication initialization failed');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user);
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!isFirebaseConfigured()) {
    return fallbackAuth.signInWithEmail(email, password);
  }
  
  // Ensure Firebase client is ready
  const initSuccess = await ensureFirebaseClient();
  if (!initSuccess) {
    return fallbackAuth.signInWithEmail(email, password);
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    return fallbackAuth.signInWithEmail(email, password);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Ensure user profile exists
    await createUserProfile(userCredential.user);

    return userCredential;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  console.log('🔐 Starting Google sign-in process...');
  
  // Verify Firebase is configured
  if (!isFirebaseConfigured()) {
    const status = await getFirebaseStatus();
    console.error('❌ Firebase is not configured:', status.configErrors);
    throw new Error(`Firebase is not configured: ${status.configErrors.join(', ')}`);
  }
  
  // Ensure client SDK is initialized
  console.log('🔍 Ensuring Firebase client is ready for Google sign-in...');
  const initSuccess = await ensureFirebaseClient();
  if (!initSuccess) {
    const status = await getFirebaseStatus();
    console.error('❌ Firebase initialization failed:', status);
    throw new Error(`Firebase Auth initialization failed. Check environment variables and try again.`);
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    const status = await getFirebaseStatus();
    console.error('❌ Firebase Auth not available after initialization:', status);
    throw new Error('Firebase Auth is not initialized on the client');
  }
  
  console.log('✅ Firebase Auth ready for Google sign-in:', {
    authDomain: auth.config?.authDomain,
    apiKey: auth.config?.apiKey ? `${auth.config.apiKey.substring(0, 10)}...` : 'MISSING'
  });

  try {
    // Try popup first
    const userCredential = await signInWithPopup(auth, googleProvider);
    await createUserProfile(userCredential.user);
    return userCredential;
  } catch (error: any) {
    const code = error?.code || '';
    // Fallback to redirect for environments where popups are restricted
    if (
      code === 'auth/operation-not-supported-in-this-environment' ||
      code === 'auth/popup-blocked' ||
      code === 'auth/cancelled-popup-request'
    ) {
      await signInWithRedirect(auth, googleProvider);
      // signInWithRedirect will navigate away; return a rejected promise to stop further processing
      throw error;
    }
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }
  
  const { db } = getFirebaseInstances();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update authentication profile
export const updateAuthProfile = async (
  updates: { displayName?: string; photoURL?: string }
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    await updateProfile(user, updates);

    // Also update in Firestore
    await updateUserProfile(user.uid, updates);
  } catch (error) {
    console.error('Error updating auth profile:', error);
    throw error;
  }
};

// Update email
export const updateUserEmail = async (newEmail: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    await updateEmail(user, newEmail);

    // Update in Firestore
    await updateUserProfile(user.uid, { email: newEmail });
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Update password
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Reauthenticate user (for sensitive operations)
export const reauthenticateUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const credential = EmailAuthProvider.credential(email, password);
    return await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error('Error reauthenticating:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    return null;
  }
  
  return auth.currentUser;
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }
  
  const { db } = getFirebaseInstances();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Subscribe to auth state changes with async initialization
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  console.log('🔍 Setting up auth state subscription...');
  
  let unsubscribe: (() => void) | null = null;
  let isUnsubscribed = false;
  
  const setupSubscription = async () => {
    if (isUnsubscribed) return;
    
    // Check if Firebase is configured first
    if (!isFirebaseConfigured()) {
      console.log('ℹ️ Firebase not configured, providing null user immediately');
      if (typeof window !== 'undefined' && !isUnsubscribed) {
        setTimeout(() => {
          if (!isUnsubscribed) {
            console.log('🔄 Calling auth callback with null user (not configured)');
            callback(null);
          }
        }, 0);
      }
      return;
    }
    
    // Try to ensure Firebase is initialized
    if (typeof window !== 'undefined') {
      console.log('🔄 Firebase configured, attempting initialization...');
      const initSuccess = await ensureFirebaseClient();
      if (!initSuccess) {
        const status = await getFirebaseStatus();
        console.warn('⚠️ Firebase initialization failed for auth state subscription:', status);
        if (!isUnsubscribed) {
          callback(null);
        }
        return;
      }
    }
    
    if (isUnsubscribed) return;
    
    const { auth } = getFirebaseInstances();
    if (!auth) {
      console.log('ℹ️ No auth available after initialization, providing null user');
      if (typeof window !== 'undefined' && !isUnsubscribed) {
        setTimeout(() => {
          if (!isUnsubscribed) {
            console.log('🔄 Calling auth callback with null user (no auth)');
            callback(null);
          }
        }, 0);
      }
      return;
    }
    
    console.log('✅ Setting up real auth state listener');
    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isUnsubscribed) {
        console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user');
        callback(user);
      }
    });
  };
  
  // Start setup asynchronously
  setupSubscription().catch(error => {
    console.error('❌ Auth state subscription setup failed:', error);
    if (!isUnsubscribed) {
      callback(null);
    }
  });
  
  return () => {
    console.log('🔄 Unsubscribing from auth state changes');
    isUnsubscribed = true;
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Check if email is verified
export const isEmailVerified = (): boolean => {
  if (!isFirebaseConfigured()) {
    return false;
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    return false;
  }
  
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase authentication is not configured');
  }
  
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase authentication is not initialized');
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Delete user data from Firestore
    // Note: In production, you might want to use Cloud Functions
    // to handle cascading deletes of user data

    // Delete the user account
    await user.delete();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Helper to format Firebase auth errors
export const formatAuthError = (error: any): string => {
  const errorCode = error.code || '';
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in or use a different email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};