import { useEffect, useState, useMemo } from 'react';
import { IssueService } from '../services/issues';
import { calculatePriority, getZone, type PriorityLevel } from '../utils/geo';
import { ShieldCheck, MapPin, Search, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const PRIORITY_COLORS: Record<PriorityLevel, string> = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:     { bg: 'border-amber-200 bg-amber-50 text-amber-800', text: 'PENDING' },
  in_progress: { bg: 'border-blue-200 bg-blue-50 text-blue-800', text: 'IN PROGRESS' },
  resolved:    { bg: 'border-emerald-200 bg-emerald-50 text-emerald-800', text: 'RESOLVED' },
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchIssues(); }, []);

  const fetchIssues = async () => {
    try {
      setDataLoading(true);
      setError(null);
      const data = await IssueService.getAdminIssues();
      setIssues(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setDataLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await IssueService.updateIssueStatus(id, newStatus);
    fetchIssues(); 
  };

  // ── Enriched & Filtered Data ──────────────────────────────────────────
  const enrichedIssues = useMemo(() => 
    issues.map(issue => ({
      ...issue,
      priority: calculatePriority(issue),
      zone: getZone(issue.lat, issue.lng),
    })).sort((a, b) => b.priority.score - a.priority.score), // Sort by priority
  [issues]);

  const filteredIssues = useMemo(() => 
    enrichedIssues.filter(issue => {
      if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && issue.priority.level !== priorityFilter) return false;
      if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }),
  [enrichedIssues, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  // ── Analytics Computations ────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    highPriority: enrichedIssues.filter(i => i.priority.level === 'high').length,
  }), [issues, enrichedIssues]);

  const categoryData = useMemo(() => 
    Object.entries(issues.reduce((acc: any, curr) => {
       acc[curr.category] = (acc[curr.category] || 0) + 1;
       return acc;
    }, {})).map(([key, val]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), val })),
  [issues]);

  const priorityData = useMemo(() => {
    const counts: Record<PriorityLevel, number> = { high: 0, medium: 0, low: 0 };
    enrichedIssues.forEach(i => { counts[i.priority.level as PriorityLevel]++; });
    return Object.entries(counts).map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v, color: PRIORITY_COLORS[k as PriorityLevel] }));
  }, [enrichedIssues]);

  // Daily trend (last 7 days)
  const trendData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      days[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
    }
    issues.forEach(issue => {
      const d = new Date(issue.created_at);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([day, count]) => ({ day, count }));
  }, [issues]);

  // High-density zones
  const hotspots = useMemo(() => {
    const zoneCounts: Record<string, { count: number; pending: number }> = {};
    enrichedIssues.forEach(i => {
      const z = i.zone.name;
      if (!zoneCounts[z]) zoneCounts[z] = { count: 0, pending: 0 };
      zoneCounts[z].count++;
      if (i.status === 'pending') zoneCounts[z].pending++;
    });
    return Object.entries(zoneCounts)
      .filter(([, v]) => v.pending >= 2)
      .sort((a, b) => b[1].pending - a[1].pending)
      .slice(0, 5);
  }, [enrichedIssues]);

  const categories = [...new Set(issues.map(i => i.category))];

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
       <header className="mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-end border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-indigo-600" /> Admin Dashboard
             </h1>
             <p className="text-sm font-medium text-slate-500 mt-2">Municipal operations command center</p>
          </div>
       </header>

       {error ? (
         <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center h-48 border border-red-100 dark:border-red-900/30 mb-8">
            <h3 className="font-bold text-lg mb-2">Connection Error</h3>
            <p className="text-sm opacity-80 mb-4">{error}</p>
            <button onClick={fetchIssues} className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition">Retry</button>
         </div>
       ) : dataLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(n => <div key={n} className="h-28 skeleton-box glow-card rounded-xl"></div>)}
         </div>
       ) : (
         <>
           {/* ── KPI Cards ── */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="glow-card p-5">
                 <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Reports</h2>
                 <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</span>
              </div>
              <div className="glow-card p-5">
                 <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Pending</h2>
                 <span className="text-3xl font-black text-amber-500">{stats.pending}</span>
              </div>
              <div className="glow-card p-5">
                 <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">In Progress</h2>
                 <span className="text-3xl font-black text-blue-500">{stats.inProgress}</span>
              </div>
              <div className="glow-card p-5">
                 <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">High Priority</h2>
                 <span className="text-3xl font-black text-red-500">{stats.highPriority}</span>
              </div>
           </div>

           {/* ── Analytics Row ── */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Category Distribution */}
              <div className="glow-card p-6">
                 <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-4">Issue Categories</h2>
                 <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#CBD5E1" strokeOpacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: '700'}} width={80} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                        <Bar dataKey="val" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Daily Trend */}
              <div className="glow-card p-6">
                 <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> 7-Day Trend</h2>
                 <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.3} />
                        <XAxis dataKey="day" tick={{fill: '#64748B', fontSize: 10, fontWeight: '700'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#64748B', fontSize: 10}} axisLine={false} tickLine={false} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Priority Breakdown */}
              <div className="glow-card p-6">
                 <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-4">Priority Distribution</h2>
                 <div className="h-52 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={priorityData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" label={({name, value}) => `${name}: ${value}`} labelLine={false}>
                          {priorityData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* ── Hotspot Alerts ── */}
           {hotspots.length > 0 && (
             <div className="mb-8">
               <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> High-Density Problem Areas</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                 {hotspots.map(([zone, data]) => (
                   <div key={zone} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-center justify-between">
                     <div>
                       <p className="font-bold text-sm text-red-800 dark:text-red-300">{zone}</p>
                       <p className="text-xs text-red-600/70 mt-0.5">{data.pending} pending of {data.count} total</p>
                     </div>
                     <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">Needs Attention</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* ── Filter Bar ── */}
           <div className="glow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-3 items-center">
                 <h2 className="text-sm font-bold text-slate-900 dark:text-white mr-auto">Issues Ledger</h2>
                 <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 px-3 items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search..." className="bg-transparent text-xs focus:outline-none w-24 md:w-32 dark:text-white font-medium" />
                 </div>
                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 outline-none uppercase">
                   <option value="all">All Status</option>
                   <option value="pending">Pending</option>
                   <option value="in_progress">In Progress</option>
                   <option value="resolved">Resolved</option>
                 </select>
                 <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 outline-none uppercase">
                   <option value="all">All Categories</option>
                   {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                 </select>
                 <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 outline-none uppercase">
                   <option value="all">All Priority</option>
                   <option value="high">High</option>
                   <option value="medium">Medium</option>
                   <option value="low">Low</option>
                 </select>
              </div>
              
              <div className="flex-1 overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
                   <thead className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                     <tr>
                       <th className="px-4 py-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Report</th>
                       <th className="px-4 py-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Priority</th>
                       <th className="px-4 py-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Zone</th>
                       <th className="px-4 py-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-[#0B1220]">
                     {filteredIssues.map(issue => {
                       const ps = PRIORITY_COLORS[issue.priority.level as PriorityLevel];
                       return (
                       <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                         <td className="px-4 py-3">
                            <div className="flex flex-col">
                               <div className="flex items-center gap-2 mb-0.5">
                                 <span className="font-bold text-slate-900 dark:text-white text-xs">{issue.title}</span>
                                 <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 uppercase">{issue.category}</span>
                               </div>
                               <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.address?.substring(0, 40) || 'N/A'}</span>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                           <span className="text-[10px] font-bold uppercase flex items-center gap-1.5">
                             <span className="w-2 h-2 rounded-full" style={{ background: ps }}></span>
                             {issue.priority.level} ({issue.priority.score})
                           </span>
                         </td>
                         <td className="px-4 py-3">
                           <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{issue.zone.name}</span>
                         </td>
                         <td className="px-4 py-3">
                           <select 
                             value={issue.status}
                             onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                             className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 outline-none cursor-pointer border shadow-sm transition-all ${(STATUS_STYLES[issue.status] || STATUS_STYLES.pending).bg}`}
                           >
                             <option value="pending">PENDING</option>
                             <option value="in_progress">IN PROGRESS</option>
                             <option value="resolved">RESOLVED</option>
                           </select>
                         </td>
                       </tr>
                       );
                     })}
                   </tbody>
                 </table>
              </div>
           </div>
         </>
       )}
    </div>
  );
}
