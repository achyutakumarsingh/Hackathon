import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, ThumbsUp, ChevronLeft, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      const { data } = await supabase.from('issues').select('*').eq('id', id).single();
      if (data) setIssue(data);
      setLoading(false);
    };
    fetchIssue();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!issue) return <div className="text-center py-20 text-gray-500">Issue not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/feed')} className="flex items-center text-blue-600 font-medium mb-6 hover:text-blue-700 hover:underline">
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Feed
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {issue.images && issue.images.length > 0 && (
            <div className="h-72 lg:h-96 w-full bg-gray-100">
               <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{issue.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {issue.address}</span>
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(issue.created_at).toLocaleDateString()}</span>
                  <span className="uppercase tracking-wider font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{issue.category}</span>
                </div>
              </div>
              <button className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition">
                <ThumbsUp className="h-6 w-6 text-blue-600 mb-1" />
                <span className="font-bold text-gray-900">{issue.upvote_count || 0}</span>
              </button>
            </div>
            
            <div className="prose max-w-none text-gray-700 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="whitespace-pre-wrap leading-relaxed">{issue.description}</p>
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
                <MapContainer center={[issue.lat, issue.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[issue.lat, issue.lng]} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
