import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Filter, ThumbsUp } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function IssuesFeed() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header and navbar should ideally be a shared layout, but keeping simple here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Public Feed</h1>
            <p className="text-gray-500 mt-1">See what's happening in your community.</p>
          </div>
          
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'map' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search issues..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="h-5 w-5" /> Filters
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading issues...</div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">No issues reported yet.</p>
              </div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col">
                  {issue.images && issue.images.length > 0 ? (
                    <img src={issue.images[0]} alt={issue.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{issue.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{issue.address || 'Unknown Location'}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{issue.category}</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {issue.upvote_count || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 h-[600px]">
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues.map(issue => (
                <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{issue.address}</p>
                      <button onClick={() => navigate(`/issues/${issue.id}`)} className="text-blue-600 text-sm font-medium hover:underline">View details</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
