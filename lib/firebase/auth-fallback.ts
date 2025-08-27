// Fallback auth service when Firebase is not configured
// This prevents the app from crashing when Firebase environment variables are missing

import { User, UserCredential } from 'firebase/auth';
import { UserProfile, AuthError } from './types';

// Mock user for fallback
const createMockUser = (email: string, displayName?: string): User => ({
  uid: 'mock-user-id',
  email,
  displayName: displayName || email.split('@')[0],
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    signInProvider: 'password',
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  photoURL: null,
  providerId: 'firebase',
} as User);

// Fallback functions that throw appropriate errors
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const signOutUser = async (): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const createUserProfile = async (user: User): Promise<UserProfile> => {
  throw new Error('Firebase is not configured. Please set up Firebase environment variables.');
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  throw new Error('Firebase is not configured. Please set up Firebase environment variables.');
};

export const updateAuthProfile = async (
  updates: { displayName?: string; photoURL?: string }
): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const updateUserEmail = async (newEmail: string): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const reauthenticateUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const getCurrentUser = (): User | null => {
  return null;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  return null;
};

export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  // Call callback with null user immediately
  callback(null);
  // Return a no-op unsubscribe function
  return () => {};
};

export const isEmailVerified = (): boolean => {
  return false;
};

export const resendVerificationEmail = async (): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const deleteUserAccount = async (): Promise<void> => {
  throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
};

export const formatAuthError = (error: any): string => {
  if (error.message?.includes('Firebase')) {
    return error.message;
  }
  return 'Authentication service is not available. Please check your configuration.';
};
