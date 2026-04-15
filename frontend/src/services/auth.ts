import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const AuthService = {
  async signIn(email: string, password: string) {
    console.log('[Auth] signIn:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('[Auth] signIn OK, user:', data.user?.id);
    return data;
  },

  async signUp(email: string, password: string) {
    console.log('[Auth] signUp:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email confirmation for hackathon demo
        emailRedirectTo: window.location.origin + '/feed',
      }
    });
    if (error) throw error;

    // Auto-create profile row if user was created
    if (data.user) {
      console.log('[Auth] creating profile for:', data.user.id);
      try {
        await supabase
          .from('profiles')
          .upsert({ id: data.user.id, role: 'user' }, { onConflict: 'id' });
      } catch (e) {
        console.warn('[Auth] profile creation failed (RLS):', e);
      }
    }
    return data;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[Auth] getSession error:', error.message);
      return null;
    }
    return session;
  },

  async fetchRole(user: User | null): Promise<'user' | 'admin'> {
    if (!user) return 'user';

    // 1) Check user_metadata first (instant, no DB call)
    if (user.user_metadata?.role === 'admin') {
      console.log('[Auth] role from metadata: admin');
      return 'admin';
    }

    // 2) Try profiles table (may fail due to RLS or missing table)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data?.role === 'admin') {
        console.log('[Auth] role from DB: admin');
        return 'admin';
      }
    } catch {
      // Silently default to user
    }

    return 'user';
  },

  async setAdminRole(userId: string) {
    // Set in auth metadata (always works, no RLS)
    const { error } = await supabase.auth.updateUser({ data: { role: 'admin' } });
    if (error) throw error;

    // Best-effort DB update
    try {
      await supabase.from('profiles').upsert({ id: userId, role: 'admin' }, { onConflict: 'id' });
    } catch { /* RLS may block */ }

    return true;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
