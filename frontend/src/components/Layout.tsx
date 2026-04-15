import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/auth';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Plus, ShieldCheck, Layers, Menu, X, User, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, role, signOut, refreshRole, toast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    toast('Logged out successfully.', 'success');
    navigate('/login');
  };

  const handleMakeAdmin = async () => {
    if (!user) return toast('You must be logged in.', 'error');
    try {
      await AuthService.setAdminRole(user.id);
      await refreshRole();
      toast('Admin role granted! Refreshing...', 'success');
    } catch (e: any) {
      toast('Failed: ' + (e.message || 'Unknown error'), 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-slate-200/50 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Civic Sense
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link to="/feed" className={`btn-ghost ${location.pathname === '/feed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''}`}>Feed</Link>
              {user && role === 'admin' && (
                <Link to="/admin" className={`btn-ghost flex items-center gap-2 ${location.pathname === '/admin' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''}`}>
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Dev Admin Button */}
                  {role !== 'admin' && (
                    <button onClick={handleMakeAdmin} className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded flex items-center gap-1" title="Dev: Elevate to Admin">
                      <Wrench className="w-3 h-3" /> Make Admin
                    </button>
                  )}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 max-w-[80px] truncate">{user.email?.split('@')[0]}</span>
                    {role === 'admin' && <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">ADMIN</span>}
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 transition-colors p-2" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                  <Link to="/report" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all flex items-center gap-2">
                    New Issue <Plus className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <Link to="/login" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all">Log In</Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>

          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
             initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
             className="fixed top-16 left-0 w-full bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-lg z-40 md:hidden flex flex-col p-4 space-y-4"
          >
             {user && (
               <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                 <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex justify-center items-center"><User className="w-4 h-4 text-slate-500" /></div>
                 <span className="font-bold text-sm truncate">{user.email}</span>
                 {role === 'admin' && <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">ADMIN</span>}
               </div>
             )}
             <Link to="/feed" className="block text-base font-semibold px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Community Feed</Link>
             
             {user && role === 'admin' && (
               <Link to="/admin" className="block text-base font-semibold px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5"/> Admin Dashboard
               </Link>
             )}

             {user ? (
               <>
                 {role !== 'admin' && (
                   <button onClick={handleMakeAdmin} className="text-left text-base font-semibold text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
                     <Wrench className="w-4 h-4" /> Make Me Admin (Dev)
                   </button>
                 )}
                 <Link to="/report" className="block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center text-base font-bold px-4 py-4 rounded-xl">Submit Report +</Link>
                 <button onClick={handleLogout} className="text-left text-base font-semibold text-red-600 dark:text-red-400 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">Log Out</button>
               </>
             ) : (
               <Link to="/login" className="block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center text-base font-bold px-4 py-4 rounded-xl">Log In / Sign Up</Link>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
    </div>
  );
}
