import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Map as MapIcon, List as ListIcon, Activity, CornerRightUp, ArrowUpRight, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useIssuesFeed } from '../hooks/useIssues';
import { calculatePriority, clusterIssues, type PriorityLevel } from '../utils/geo';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PRIORITY_STYLES: Record<PriorityLevel, { bg: string; text: string; dot: string; label: string }> = {
  high:   { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'High' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Medium' },
  low:    { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', label: 'Low' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  pending:     { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  resolved:    { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
};

/** Custom cluster icon */
function createClusterIcon(count: number, dominant: string) {
  const colors: Record<string, string> = {
    pothole: '#EF4444', streetlight: '#F59E0B', garbage: '#10B981', water: '#3B82F6', other: '#6366F1',
  };
  const color = colors[dominant] || '#6366F1';
  return L.divIcon({
    html: `<div style="background:${color};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${count}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

/** Component to fit map bounds to markers */
function FitBounds({ issues }: { issues: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds(issues.filter(i => i.lat && i.lng).map(i => [i.lat, i.lng]));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [issues, map]);
  return null;
}

export default function IssuesFeed() {
  const { issues, loading, error, refetch, fetchFeed } = useIssuesFeed();
  const [view, setView] = useState<'list'|'map'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  // Compute priorities and apply filters
  const enrichedIssues = issues.map(issue => ({
    ...issue,
    priority: calculatePriority(issue),
  }));

  const filteredIssues = enrichedIssues.filter(issue => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && issue.priority.level !== priorityFilter) return false;
    return true;
  });

  // Clusters for map view
  const clusters = clusterIssues(filteredIssues, 500);

  const categories = [...new Set(issues.map(i => i.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
         <div>
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">Issue Feed</h1>
             <p className="text-slate-500 font-medium text-sm">{filteredIssues.length} issues found</p>
         </div>
         
         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full md:w-auto">
            <button onClick={() => setView('list')} className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-sm flex justify-center gap-2 items-center transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}><ListIcon className="w-4 h-4"/> List</button>
            <button onClick={() => setView('map')} className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-sm flex justify-center gap-2 items-center transition-colors ${view === 'map' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}><MapIcon className="w-4 h-4"/> Map</button>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <Filter className="w-4 h-4 text-slate-400" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none">
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {error ? (
         <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center h-64 border border-red-100 dark:border-red-900/30">
            <Activity className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="font-bold text-lg mb-2">Connection Error</h3>
            <p className="text-sm opacity-80 mb-4">{error}</p>
            <button onClick={refetch} className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition">Retry</button>
         </div>
      ) : loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(n => (
               <div key={n} className="glow-card h-80 skeleton-box p-6 flex flex-col justify-between">
                  <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded-lg w-full mb-4"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
                  <div className="flex justify-between">
                     <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
                     <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
                  </div>
               </div>
            ))}
         </div>
      ) : view === 'list' ? (
        filteredIssues.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-80">
              <Activity className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No issues found</h3>
              <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters.</p>
           </div>
        ) : (
          <AnimatePresence>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredIssues.map(issue => {
                const ps = PRIORITY_STYLES[issue.priority.level as PriorityLevel];
                const ss = STATUS_STYLES[issue.status] || STATUS_STYLES.pending;
                return (
                 <motion.div 
                    layoutId={`issue-${issue.id}`}
                    key={issue.id} 
                    onClick={()=>navigate(`/issues/${issue.id}`)} 
                    className="glow-card overflow-hidden flex flex-col cursor-pointer group"
                 >
                    {issue.images?.[0] ? 
                      <div className="h-44 w-full relative overflow-hidden">
                        <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {/* Priority badge overlay */}
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded ${ps.bg} ${ps.text} flex items-center gap-1`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`}></span> {ps.label}
                        </span>
                      </div> : 
                      <div className="h-44 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 relative">
                          <Activity className="w-6 h-6 mb-2"/>
                          <span className="text-xs font-semibold uppercase tracking-wider">No Media</span>
                          <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded ${ps.bg} ${ps.text} flex items-center gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`}></span> {ps.label}
                          </span>
                      </div>
                    }
                    <div className="p-4 flex flex-col flex-1">
                       <div className="flex justify-between mb-2 items-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{issue.category}</span>
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(issue.created_at).toLocaleDateString()}</span>
                       </div>
                       <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{issue.title}</h3>
                       <div className="flex items-start text-xs font-medium text-slate-500 mb-4 flex-1"><MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-[1px]"/> <span className="line-clamp-1">{issue.address || 'Unknown'}</span></div>
                       
                       <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 mt-auto">
                         <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded uppercase flex items-center gap-1.5 ${ss.bg} ${ss.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`}></span>
                            {issue.status.replace('_', ' ')}
                         </span>
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {issue.upvote_count || 0}</span>
                           <CornerRightUp className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                         </div>
                       </div>
                    </div>
                 </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )
      ) : (
        /* ── MAP VIEW with Clusters ── */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[60vh] md:h-[70vh] w-full rounded-2xl overflow-hidden glow-card relative z-0">
           <MapContainer center={[28.61, 77.23]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <FitBounds issues={filteredIssues} />

              {clusters.map(cluster => (
                cluster.count === 1 ? (
                  <Marker key={cluster.id} position={[cluster.issues[0].lat, cluster.issues[0].lng]}>
                    <Popup className="premium-popup">
                       <div className="p-1">
                          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1 block">{cluster.issues[0].category}</span>
                          <h4 onClick={()=>navigate(`/issues/${cluster.issues[0].id}`)} className="cursor-pointer font-bold text-sm hover:text-indigo-600 transition-colors mb-1 line-clamp-2">{cluster.issues[0].title}</h4>
                          <span className={`text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded inline-block uppercase ${cluster.issues[0].status === 'resolved'?'bg-emerald-100 text-emerald-800':'bg-amber-100 text-amber-800'}`}>{cluster.issues[0].status}</span>
                       </div>
                    </Popup>
                  </Marker>
                ) : (
                  <Marker 
                    key={cluster.id} 
                    position={[cluster.lat, cluster.lng]} 
                    icon={createClusterIcon(cluster.count, cluster.dominantCategory)}
                  >
                    <Popup className="premium-popup">
                       <div className="p-2 max-w-[200px]">
                          <h4 className="font-bold text-sm mb-1">{cluster.count} issues in this area</h4>
                          <p className="text-xs text-slate-500 mb-2">Primary: {cluster.dominantCategory}</p>
                          {cluster.count >= 3 && (
                            <p className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">⚠️ High-density area — needs attention</p>
                          )}
                          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                            {cluster.issues.slice(0, 5).map(i => (
                              <div key={i.id} onClick={() => navigate(`/issues/${i.id}`)} className="text-xs font-medium text-indigo-600 hover:underline cursor-pointer truncate">{i.title}</div>
                            ))}
                            {cluster.count > 5 && <p className="text-[10px] text-slate-400">+{cluster.count - 5} more</p>}
                          </div>
                       </div>
                    </Popup>
                  </Marker>
                )
              ))}
           </MapContainer>
        </motion.div>
      )}
    </div>
  );
}
