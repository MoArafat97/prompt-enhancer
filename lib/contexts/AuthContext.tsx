'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  subscribeToAuthState,
  getUserProfile,
  updateUserProfile as updateProfile,
  formatAuthError,
} from '@/lib/firebase/auth';
import { UserProfile, AuthError } from '@/lib/firebase/types';
import { useToast } from '@/components/ui/toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const { addToast } = useToast();

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async (user: User) => {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error('Error loading user profile:', err);
        addToast({
          title: 'Error loading profile',
          description: 'Please refresh the page',
          type: 'error',
        });
      }
    };

    if (user) {
      loadUserProfile(user);
    } else {
      setUserProfile(null);
    }
  }, [user, addToast]);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      setLoading(false);

      // Maintain a lightweight auth-token cookie for middleware route protection
      if (typeof document !== 'undefined') {
        if (user) {
          // Use the Firebase ID token; middleware only checks presence for now
          user.getIdToken().then((token) => {
            try {
              const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
              document.cookie = `auth-token=${token}; Path=/; Max-Age=3600; SameSite=Lax${isSecure ? '; Secure' : ''}`;
            } catch (e) {
              console.warn('Failed to set auth cookie:', e);
            }
          }).catch((e) => console.warn('Failed to get ID token:', e));
        } else {
          // Clear cookie on sign out
          document.cookie = 'auth-token=; Path=/; Max-Age=0; SameSite=Lax';
        }
      }
    });

    return unsubscribe;
  }, []);

  // Clear error
  const clearError = () => setError(null);

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      await signUpWithEmail(email, password, displayName);
      addToast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Sign up failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmail(email, password);
      addToast({
        title: 'Welcome back!',
        description: 'Successfully signed in',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Sign in failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogleHandler = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      addToast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Google sign in failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await signOutUser();
      addToast({
        title: 'Signed out',
        description: 'Come back soon!',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Sign out failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordReset(email);
      addToast({
        title: 'Password reset email sent',
        description: 'Check your inbox for instructions',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Password reset failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      await updateProfile(user.uid, data);
      
      setUserProfile({
        ...userProfile,
        ...data,
      });

      addToast({
        title: 'Profile updated',
        description: 'Your changes have been saved',
        type: 'success',
      });
    } catch (err: any) {
      const errorMessage = formatAuthError(err);
      setError({ code: err.code, message: errorMessage });
      addToast({
        title: 'Update failed',
        description: errorMessage,
        type: 'error',
      });
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle: signInWithGoogleHandler,
    signOut,
    resetPassword,
    updateUserProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During SSR or when AuthProvider is not available, return fallback
    return {
      user: null,
      userProfile: null,
      loading: false,
      error: null,
      signUp: async () => {},
      signIn: async () => {},
      signInWithGoogle: async () => {},
      signOut: async () => {},
      resetPassword: async () => {},
      updateUserProfile: async () => {},
      clearError: () => {},
    };
  }
  return context;
}