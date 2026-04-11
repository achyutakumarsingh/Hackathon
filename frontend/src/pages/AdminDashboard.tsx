import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Activity, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you'd check a user.role in user metadata or a profiles table.
  // We'll proceed with this simplified admin check.
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchIssues();
  }, [user]);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      alert(`Issue updated to ${newStatus}`);
      fetchIssues(); // Refresh list
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">Admin Portal</span>
        </div>
        <nav className="p-4 space-y-1">
          <button className="w-full flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm transition">
            <List className="w-5 h-5 mr-3" /> All Issues
          </button>
          <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm transition">
            <Activity className="w-5 h-5 mr-3" /> Analytics
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and track civic issues</p>
            </div>
            <button onClick={() => navigate('/')} className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Return to Citizen View
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-500 text-sm">Total Issues</h3>
                <List className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-amber-600 text-sm">Pending</h3>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.pending}</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-blue-600 text-sm">In Progress</h3>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.inProgress}</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-green-600 text-sm">Resolved</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.resolved}</span>
            </div>
          </div>

          {/* Issues Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Recent Issues</h3>
              <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Date Reported</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading issues...</td></tr>
                  ) : issues.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No issues found.</td></tr>
                  ) : (
                    issues.map(issue => (
                      <tr key={issue.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{issue.title}</div>
                          <div className="text-gray-500 text-xs mt-0.5 truncate max-w-[200px]">{issue.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="uppercase tracking-wider font-semibold text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {issue.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize 
                            ${issue.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                              issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'}`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={issue.status}
                            onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button onClick={() => navigate(`/issues/${issue.id}`)} className="ml-3 text-blue-600 hover:text-blue-800 font-medium text-sm">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
