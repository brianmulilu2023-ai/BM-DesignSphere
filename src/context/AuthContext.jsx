import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo-admin-victor',
  email: 'admin@victorgraphics.com',
  user_metadata: { full_name: 'Victor Muiruri' },
  role: 'authenticated'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // Check local session first for instant response
      const stored = localStorage.getItem('vg_demo_session');
      if (stored === 'active') {
        if (mounted) {
          setUser(DEMO_USER);
          setSession({ user: DEMO_USER });
          setLoading(false);
        }
        return;
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (mounted && currentSession) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (mounted) {
              setSession(newSession);
              setUser(newSession?.user ?? null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe?.();
          };
        } catch (err) {
          console.warn('Supabase auth getSession error:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    // 1. Instant Admin Login (Works 100% reliably with Zero Network Lag / Zero Supabase)
    if (email === 'admin@victorgraphics.com' && password === 'admin123') {
      localStorage.setItem('vg_demo_session', 'active');
      setUser(DEMO_USER);
      setSession({ user: DEMO_USER });
      return { user: DEMO_USER, isDemo: true };
    }

    // 2. If user has created a custom Supabase user
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setSession(data.session);
        return data;
      } catch (err) {
        throw new Error(err.message || 'Supabase login failed.');
      }
    }

    throw new Error('Invalid credentials. Use admin@victorgraphics.com / admin123.');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('vg_demo_session');
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });
        if (error) throw error;
        return data;
      } catch (e) {}
    }
    return { message: 'Password reset link simulated in local mode.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: Boolean(user),
        isSupabaseConfigured,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
