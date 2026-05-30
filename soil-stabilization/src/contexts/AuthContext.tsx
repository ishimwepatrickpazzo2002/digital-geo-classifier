import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearStoredAuth, fetchCurrentUser, getStoredToken, getStoredUser, login, register, setStoredAuth } from '../lib/api';
import type { AppUser } from '../lib/api';

interface AuthContextType {
  user: AppUser | null;
  profile: AppUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(getStoredUser());
  const [profile, setProfile] = useState<AppUser | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setProfile(currentUser);
      } catch {
        await signOut();
      } finally {
        setLoading(false);
      }
    }

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const data = await login(email, password);
      setStoredAuth(data.user, data.token);
      setUser(data.user);
      setProfile(data.user);
      setToken(data.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to sign in' };
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      const data = await register(email, password, fullName);
      setStoredAuth(data.user, data.token);
      setUser(data.user);
      setProfile(data.user);
      setToken(data.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to register' };
    }
  }

  async function signOut() {
    clearStoredAuth();
    setUser(null);
    setProfile(null);
    setToken(null);
  }

  async function resetPassword() {
    return {
      error: 'Password reset is not available in this version',
    };
  }

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
