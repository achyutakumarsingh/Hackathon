import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast('Password must be at least 6 characters', 'error');
    }
    setLoading(true);
    
    try {
      const data = await AuthService.signUp(email, password);
      
      // Supabase may or may not auto-confirm depending on settings
      if (data.session) {
        // Auto-confirmed: go straight to feed
        toast('Account created! Welcome to Civic Sense.', 'success');
        navigate('/feed');
      } else {
        // Email confirmation required
        toast('Check your email to confirm your account, then sign in.', 'success');
        navigate('/login');
      }
    } catch (error: any) {
      toast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glow-card p-8 md:p-10">
        <div className="text-center">
           <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
             <UserPlus className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Join Civic Sense to report and track issues</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium text-sm transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium text-sm transition-colors"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm font-semibold">
          <Link to="/login" className="text-slate-500 hover:text-indigo-500 transition-colors">
            Already have an account? <span className="text-slate-700 dark:text-slate-300">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
