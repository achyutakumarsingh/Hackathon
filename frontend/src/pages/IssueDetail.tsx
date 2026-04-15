import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IssueService } from '../services/issues';
import { useAuth } from '../context/AuthContext';
import { calculatePriority, getZone, type PriorityLevel } from '../utils/geo';
import { MapPin, ArrowUpRight, ChevronLeft, Calendar, ImageOff, Clock, Building2, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PRIORITY_STYLES: Record<PriorityLevel, { bg: string; text: string; label: string }> = {
  high:   { bg: 'bg-red-100 border-red-200', text: 'text-red-800', label: '🔴 High Priority' },
  medium: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800', label: '🟡 Medium Priority' },
  low:    { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-800', label: '🟢 Low Priority' },
};

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIssue(); }, [id]);
  const fetchIssue = async () => {
    if (!id) return;
    try {
      const data = await IssueService.getIssueById(id);
      setIssue(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) return navigate('/login');
    const currentCount = issue.upvote_count || 0;
    setIssue({ ...issue, upvote_count: currentCount + 1 });
    try {
      await IssueService.incrementUpvote(issue.id, currentCount);
    } catch {}
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div><div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:'0.1s'}}></div><div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:'0.2s'}}></div></div>
     </div>
  );

  if (!issue) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">Issue not found</h2>
      <button onClick={() => navigate('/feed')} className="text-indigo-600 font-semibold hover:underline">Back to Feed</button>
    </div>
  );

  const priority = calculatePriority(issue);
  const ps = PRIORITY_STYLES[priority.level];
  const zone = getZone(issue.lat, issue.lng);

  const statusStyle = issue.status === 'resolved' 
    ? 'bg-emerald-100 text-emerald-800' 
    : issue.status === 'in_progress' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-amber-100 text-amber-800';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 md:py-12 px-4 md:px-6 max-w-5xl mx-auto min-h-screen">
      <button onClick={() => navigate('/feed')} className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium mb-6 transition-colors gap-1.5 text-sm">
        <ChevronLeft className="h-4 w-4" /> Back to Feed
      </button>

      <div className="glow-card overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Media Block */}
        <div className="w-full md:w-[45%] bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col relative h-[280px] md:h-auto">
           {issue.images && issue.images.length > 0 ? (
             <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover absolute inset-0" />
           ) : (
             <div className="m-auto flex flex-col items-center justify-center text-slate-400">
                <ImageOff className="w-10 h-10 mb-3 stroke-[1.5]"/>
                <span className="font-bold text-xs uppercase tracking-wider">No Media</span>
             </div>
           )}
        </div>
        
        {/* Content Block */}
        <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col">
           
           {/* Header */}
           <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex flex-wrap gap-2 mb-4">
                 <span className="text-[10px] font-bold tracking-wider text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase">#{issue.id.substring(0,6)}</span>
                 <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded ${statusStyle}`}>
                   {issue.status.replace('_', ' ')}
                 </span>
                 <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded border ${ps.bg} ${ps.text}`}>
                   {ps.label}
                 </span>
              </div>

              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex-1">{issue.title}</h1>
                <button onClick={handleUpvote} className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 shadow-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors group ml-4 shrink-0">
                   <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] text-slate-400 group-hover:text-indigo-500" />
                   <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500">{issue.upvote_count || 0}</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                 <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(issue.created_at).toLocaleDateString()}</span>
                 <span className="uppercase tracking-widest">{issue.category}</span>
              </div>
           </div>

           {/* Description */}
           <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-6">
              {issue.description}
           </p>

           {/* Timeline */}
           <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timeline</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Reported: {new Date(issue.created_at).toLocaleString()}</span>
                </div>
                {issue.updated_at && issue.updated_at !== issue.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Last Updated: {new Date(issue.updated_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
           </div>

           {/* Municipal Zone */}
           <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/20 mb-4">
              <h3 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Municipal Assignment</h3>
              <p className="font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> {zone.name}</p>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">{zone.authority}</p>
           </div>

           {/* Location Map */}
           <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mt-auto">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MapPin className="stroke-[2] w-3 h-3"/> Location</h3>
              <p className="font-semibold mb-3 text-xs">{issue.address || "Coordinates specified"}</p>
              <div className="h-36 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 z-0 relative">
                 <MapContainer center={[issue.lat, issue.lng]} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={[issue.lat, issue.lng]} />
                 </MapContainer>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
