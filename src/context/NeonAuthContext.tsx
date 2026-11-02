import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { authClient } from '../services/neonAuth';
import { authStorage } from '../services/storage';

export interface NeonUser {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  username?: string;
  imageUrl?: string;
  primaryEmailAddress?: { emailAddress: string };
  createdAt?: string;
}

export interface NeonSession {
  id: string;
  user: NeonUser;
  token?: string;
  expiresAt?: string;
}

export interface OpenSignInOptions {
  mode?: 'signin' | 'signup';
}

interface NeonAuthContextType {
  user: NeonUser | null;
  session: any | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  sessions: NeonSession[];
  signUp: (params: { email: string; password: string; name?: string }) => Promise<{ user?: NeonUser; error?: any }>;
  signIn: (params: { email: string; password: string }) => Promise<{ user?: NeonUser; error?: any }>;
  signInWithGoogle: (callbackUrl?: string) => Promise<any>;
  signOut: () => Promise<void>;
  openSignIn: (options?: OpenSignInOptions) => void;
  closeSignIn: () => void;
  openUserProfile: () => void;
  closeUserProfile: () => void;
  isSignInOpen: boolean;
  signInMode: 'signin' | 'signup';
  isUserProfileOpen: boolean;
  setActive: (params: { session: string }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const NeonAuthContext = createContext<NeonAuthContextType | undefined>(undefined);

const normalizeUser = (rawUser: any): NeonUser => {
  const displayName = rawUser.name || rawUser.fullName || rawUser.email?.split('@')[0] || 'User';
  return {
    id: String(rawUser.id),
    email: rawUser.email || '',
    name: displayName,
    fullName: displayName,
    username: displayName.toLowerCase().replace(/\s+/g, ''),
    imageUrl: rawUser.image || rawUser.imageUrl || undefined,
    primaryEmailAddress: { emailAddress: rawUser.email || '' },
    createdAt: rawUser.createdAt,
  };
};

export const NeonAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal dialog states
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<'signin' | 'signup'>('signin');
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await authClient.getSession();
      if (res.data?.user && res.data?.session) {
        const norm = normalizeUser(res.data.user);
        setUser(norm);
        setSession(res.data.session);
        authStorage.setUserId(norm.id);
      } else {
        setUser(null);
        setSession(null);
        authStorage.setUserId('guest');
      }
    } catch (err) {
      console.warn('Neon auth getSession notice:', err);
      setUser(null);
      setSession(null);
      authStorage.setUserId('guest');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const openSignIn = useCallback((options?: OpenSignInOptions) => {
    setSignInMode(options?.mode || 'signin');
    setIsSignInOpen(true);
    setIsUserProfileOpen(false);
  }, []);

  const closeSignIn = useCallback(() => {
    setIsSignInOpen(false);
  }, []);

  const openUserProfile = useCallback(() => {
    setUser((currentUser) => {
      if (currentUser) {
        setIsUserProfileOpen(true);
        setIsSignInOpen(false);
      } else {
        setSignInMode('signin');
        setIsSignInOpen(true);
        setIsUserProfileOpen(false);
      }
      return currentUser;
    });
  }, []);

  const closeUserProfile = useCallback(() => {
    setIsUserProfileOpen(false);
  }, []);

  const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    try {
      const res = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name?.trim() || email.split('@')[0] || 'User',
      });

      if (res.error) {
        return { error: res.error };
      }

      if (res.data?.user) {
        const norm = normalizeUser(res.data.user);
        setUser(norm);
        setSession(res.data);
        authStorage.setUserId(norm.id);
        await refreshSession();
        setIsSignInOpen(false);
        return { user: norm };
      }

      await refreshSession();
      setIsSignInOpen(false);
      return { user: undefined };
    } catch (err: any) {
      return { error: { message: err?.message || 'Failed to sign up with Neon Auth' } };
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        return { error: res.error };
      }

      if (res.data?.user) {
        const norm = normalizeUser(res.data.user);
        setUser(norm);
        setSession(res.data);
        authStorage.setUserId(norm.id);
        await refreshSession();
        setIsSignInOpen(false);
        return { user: norm };
      }

      await refreshSession();
      setIsSignInOpen(false);
      return { user: undefined };
    } catch (err: any) {
      return { error: { message: err?.message || 'Failed to sign in with Neon Auth' } };
    }
  };

  const signInWithGoogle = async (callbackUrl?: string) => {
    try {
      const targetUrl =
        callbackUrl || (typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173');
      const res = await authClient.signIn.social({
        provider: 'google',
        callbackURL: targetUrl,
      });
      if (res.data?.url && typeof window !== 'undefined') {
        window.location.href = res.data.url;
      }
      return res;
    } catch (err: any) {
      console.error('Google social sign in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.warn('Neon signOut notice:', err);
    } finally {
      setUser(null);
      setSession(null);
      authStorage.setUserId('guest');
      setIsUserProfileOpen(false);
    }
  };

  const setActive = async (_params: { session: string }) => {
    await refreshSession();
  };

  const sessions: NeonSession[] = useMemo(() => {
    if (!user || !session) return [];
    return [
      {
        id: session.id || user.id,
        user,
        token: session.token,
        expiresAt: session.expiresAt,
      },
    ];
  }, [user, session]);

  const value: NeonAuthContextType = {
    user,
    session,
    isLoaded,
    isSignedIn: Boolean(user),
    sessions,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    openSignIn,
    closeSignIn,
    openUserProfile,
    closeUserProfile,
    isSignInOpen,
    signInMode,
    isUserProfileOpen,
    setActive,
    refreshSession,
  };

  return <NeonAuthContext.Provider value={value}>{children}</NeonAuthContext.Provider>;
};

export const useNeonAuth = () => {
  const ctx = useContext(NeonAuthContext);
  if (!ctx) {
    throw new Error('useNeonAuth must be used within a NeonAuthProvider');
  }
  return ctx;
};

// Aliases matching Clerk hooks for direct drop-in compatibility across all components
export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useNeonAuth();
  return { user, isLoaded, isSignedIn };
};

export const useClerk = () => {
  const {
    signOut,
    openUserProfile,
    openSignIn,
    closeSignIn,
    closeUserProfile,
    signInWithGoogle,
    setActive,
    user,
    isSignedIn,
  } = useNeonAuth();
  return {
    signOut,
    openUserProfile,
    openSignIn,
    closeSignIn,
    closeUserProfile,
    signInWithGoogle,
    setActive,
    user,
    isSignedIn,
  };
};

export const useSessionList = () => {
  const { sessions, isLoaded } = useNeonAuth();
  return { sessions, isLoaded };
};
