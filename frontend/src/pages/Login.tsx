import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await AuthService.signIn(email, password);
      console.log('[Login] Success, session:', !!data.session);
      toast('Login successful!', 'success');
      // Navigate to feed after successful login
      navigate('/feed');
    } catch (error: any) {
      toast(error.message || 'Login failed', 'error');
      console.error('[Login] Error:', error.message);
    } finally {
      // ALWAYS reset button state
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glow-card p-8 md:p-10">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
             <LogIn className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Access your Civic Sense account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium text-sm transition-colors"
                placeholder="••••••••"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm font-semibold">
          <Link to="/register" className="text-slate-500 hover:text-indigo-500 transition-colors">
            Don't have an account? <span className="text-slate-700 dark:text-slate-300">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
