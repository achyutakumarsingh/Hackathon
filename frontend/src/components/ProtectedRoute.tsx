import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

export default function ProtectedRoute({ allowedRoles = ['admin', 'user'] }: ProtectedRouteProps) {
  const { user, isAuthLoading, isRoleLoading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only wait for auth. For admin routes, also wait for role.
  const needsRoleCheck = allowedRoles.length === 1 && allowedRoles[0] === 'admin';
  const isReady = !isAuthLoading && (!needsRoleCheck || !isRoleLoading);

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      console.log('[ProtectedRoute] No user → /login');
      navigate('/login', { state: { from: location }, replace: true });
    } else if (needsRoleCheck && role && role !== 'admin') {
      console.log('[ProtectedRoute] Not admin → /feed');
      navigate('/feed', { replace: true });
    }
  }, [user, isReady, role, allowedRoles, navigate, location, needsRoleCheck]);

  // Show compact spinner only while checking
  if (!isReady) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay:'0.1s'}}></div>
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay:'0.2s'}}></div>
        </div>
      </div>
    );
  }

  // Don't render content if unauthorized (redirect is in progress)
  if (!user) return null;
  if (needsRoleCheck && role !== 'admin') return null;

  return <Outlet />;
}
