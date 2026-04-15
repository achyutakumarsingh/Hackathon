import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded routes for performance
const IssuesFeed = React.lazy(() => import('./pages/IssuesFeed'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const IssueDetail = React.lazy(() => import('./pages/IssueDetail'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1220]">
     <div className="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-600 animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes (no Layout) */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All app routes wrapped in Layout for nav bar */}
            <Route element={<Layout />}>
              {/* Public feed */}
              <Route path="/feed" element={<IssuesFeed />} />
              <Route path="/issues/:id" element={<IssueDetail />} />
              
              {/* Admin route — protected, requires admin role */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Report route — protected, any authenticated user */}
              <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                 <Route path="/report" element={<ReportIssue />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
