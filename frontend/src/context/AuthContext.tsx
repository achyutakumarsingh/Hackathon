import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { AuthService } from '../services/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: 'admin' | 'user' | null;
  isLoading: boolean;
  isAuthLoading: boolean;
  isRoleLoading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
  toast: (message: string, type?: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null, user: null, role: null,
  isLoading: true, isAuthLoading: true, isRoleLoading: true,
  signOut: async () => {}, refreshRole: async () => {}, toast: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: string} | null>(null);

  const loadRole = useCallback(async (u: User | null) => {
    if (!u) { setRole(null); return; }
    setIsRoleLoading(true);
    try {
      const r = await AuthService.fetchRole(u);
      setRole(r);
    } catch { setRole('user'); }
    finally { setIsRoleLoading(false); }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1) Restore session on load
    AuthService.getSession().then(async (s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user || null);
      setIsAuthLoading(false);
      if (s?.user) await loadRole(s.user);
    }).catch(() => {
      if (mounted) { setIsAuthLoading(false); }
    });

    // 2) Listen for changes — but skip the INITIAL_SESSION event to avoid double-loading
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        // Skip the first INITIAL_SESSION — init() already handles it
        if (event === 'INITIAL_SESSION') return;
        
        console.log('[AuthCtx]', event);
        setSession(s);
        const u = s?.user || null;
        setUser(u);
        setIsAuthLoading(false);

        if (event === 'SIGNED_OUT') {
          setRole(null);
          return;
        }
        
        // Only fetch role on actual sign-in or token refresh
        if (u) await loadRole(u);
      }
    );

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [loadRole]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setSession(null); setUser(null); setRole(null);
  }, []);

  const refreshRole = useCallback(async () => {
    const s = await AuthService.getSession();
    if (s?.user) { setUser(s.user); await loadRole(s.user); }
  }, [loadRole]);

  const toast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, role, isAuthLoading, isRoleLoading, isLoading: isAuthLoading || isRoleLoading, signOut, refreshRole, toast }}>
      {children}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3 backdrop-blur-md text-sm border
            ${toastMessage.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-500/90 text-white border-emerald-400'}`}>
           {toastMessage.msg}
        </div>
      )}
    </AuthContext.Provider>
  );
};
