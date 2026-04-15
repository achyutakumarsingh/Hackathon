import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { IssueService } from '../services/issues';
import { useNavigate } from 'react-router-dom';
import { MapPin, UploadCloud, FileText, Camera, Check, ArrowRight, AlertTriangle, ThumbsUp, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }: { position: any, setPosition: any }) => {
  useMapEvents({ click(e) { setPosition({ lat: e.latlng.lat, lng: e.latlng.lng, address: 'Custom point logged' }); } });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const convertToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const CATEGORIES = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'water', label: 'Water Leak' },
  { value: 'other', label: 'Other' },
];

export default function ReportIssue() {
  const { user, isLoading, toast } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Duplicate detection state
  const [nearbyIssues, setNearbyIssues] = useState<any[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicatesDismissed, setDuplicatesDismissed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate('/login');
  }, [user, isLoading, navigate]);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles([file]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Duplicate Detection ──────────────────────────────────────────────
  const checkForDuplicates = async () => {
    if (!location) return;
    setCheckingDuplicates(true);
    try {
      const nearby = await IssueService.getNearbyIssues(
        location.lat, location.lng, category, 200,
      );
      setNearbyIssues(nearby);
      // If no duplicates, auto-advance to step 3
      if (nearby.length === 0) {
        setStep(3);
      }
      // If duplicates found, stay on step 2 to show the warning
    } catch (e) {
      console.error('[DuplicateCheck]', e);
      setNearbyIssues([]);
      setStep(3); // On error, proceed anyway
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleUpvoteExisting = async (issueId: string) => {
    try {
      await IssueService.incrementUpvote(issueId, 0);
      toast('Upvoted existing report! Thank you.', 'success');
      navigate('/feed');
    } catch {
      toast('Failed to upvote. Try again.', 'error');
    }
  };

  const proceedToDetails = () => {
    setDuplicatesDismissed(true);
    setStep(3);
  };


  // If duplicates were found and not yet dismissed, stay on step 2 with overlay
  useEffect(() => {
    if (nearbyIssues.length === 0 && !checkingDuplicates && step === 2 && location && !duplicatesDismissed) {
      // No duplicates found from a check — auto-advance
      // But only if a check was actually done (nearbyIssues starts empty, so we need a flag)
    }
  }, [nearbyIssues, checkingDuplicates, step, location, duplicatesDismissed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !location) return toast('Requires authentication and location data.', 'error');
    if (!files.length) return toast('Image evidence is mandatory.', 'error');
    
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const file of files) { imageUrls.push(await convertToBase64(file)); }
      await IssueService.createIssue({
        title, description, category, lat: location.lat, lng: location.lng,
        images: imageUrls, reporter_id: user.id, address: location.address,
        status: 'pending', upvote_count: 0,
      });
      toast('Issue reported successfully!', 'success');
      navigate('/feed');
    } catch (err: any) {
      toast(err.message || 'Submission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto min-h-[90vh] flex flex-col justify-center">
      
      <div className="text-center mb-10">
         <h1 className="text-3xl font-extrabold tracking-tight mb-2">New Report</h1>
         <p className="text-slate-500 font-medium">Report a civic issue in your area.</p>
      </div>

      <div className="glow-card overflow-hidden">
        
        {/* Progress Tracker */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-between relative">
           <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
           <div className="absolute top-1/2 left-8 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `calc(${((step - 1) / 2) * 100}% - 4rem)` }}></div>
           
           {[ { n: 1, text: 'Media', icon: UploadCloud }, { n: 2, text: 'Location', icon: MapPin }, { n: 3, text: 'Details', icon: FileText } ].map(s => (
             <div key={s.n} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors duration-300 ${step >= s.n ? 'bg-indigo-600 text-white border border-indigo-500' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                  {step > s.n ? <Check className="w-4 h-4" /> : <span>{s.n}</span>}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${step >= s.n ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.text}</span>
             </div>
           ))}
        </div>
        
        <div className="p-6 md:p-10 relative overflow-hidden">
           <form onSubmit={handleSubmit}>
             <AnimatePresence mode="wait">

               {/* ── STEP 1: Media Upload ── */}
               {step === 1 && (
                 <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-10 text-center relative transition-colors group cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                      <input 
                        type="file" accept="image/*" onChange={handleFile}
                        className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
                      />
                      <div className="pointer-events-none relative z-0 flex flex-col items-center">
                        {imagePreview ? (
                           <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-4" />
                        ) : (
                           <div className="w-14 h-14 bg-white dark:bg-slate-800 shadow rounded-full flex justify-center items-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                             <Camera className="w-6 h-6" />
                           </div>
                        )}
                        <p className="font-bold text-slate-900 dark:text-white mb-1">{imagePreview ? 'Replace Image' : 'Upload Photo Evidence'}</p>
                        <p className="text-xs text-slate-500 font-medium">JPG, PNG up to 10MB • Required</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => files.length ? setStep(2) : toast('Please upload an image first.', 'error')} className="mt-8 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl py-3.5 hover:opacity-90 transition-opacity flex justify-center items-center gap-2">Next Step <ArrowRight className="w-4 h-4"/></button>
                 </motion.div>
               )}

               {/* ── STEP 2: Location + Duplicate Check ── */}
               {step === 2 && (
                 <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    
                    {/* Category selector (needed for duplicate check) */}
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Issue Type</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => (
                          <button key={c.value} type="button" onClick={() => { setCategory(c.value); setNearbyIssues([]); setDuplicatesDismissed(false); }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${category === c.value ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                          >{c.label}</button>
                        ))}
                      </div>
                    </div>

                    <button type="button" onClick={() => {
                          if ('geolocation' in navigator) {
                            navigator.geolocation.getCurrentPosition(
                              pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'GPS Auto-detected' }),
                              () => toast('Location access denied.', 'error')
                            );
                          }
                        }} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold py-3 rounded-xl mb-4 shadow-sm hover:bg-slate-200 transition">
                        <MapPin className="w-4 h-4" /> Auto-detect Location
                    </button>
                    <div className="h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 z-0 relative shadow-inner">
                       <MapContainer center={[28.61, 77.23]} zoom={13} style={{ height: '100%', width: '100%' }}>
                          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                          <LocationMarker position={location} setPosition={setLocation} />
                       </MapContainer>
                    </div>

                    {/* ── Duplicate Detection Results ── */}
                    <AnimatePresence>
                      {nearbyIssues.length > 0 && !duplicatesDismissed && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="font-bold text-sm text-amber-800 dark:text-amber-300">Similar issue found nearby</span>
                          </div>
                          {nearbyIssues.slice(0, 2).map(issue => (
                            <div key={issue.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-2 border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{issue.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{Math.round(issue.distance)}m away • {issue.upvote_count || 0} upvotes</p>
                              </div>
                              <button type="button" onClick={() => handleUpvoteExisting(issue.id)}
                                className="ml-3 flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-indigo-700 transition shrink-0"
                              >
                                <ThumbsUp className="w-3 h-3" /> Upvote
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={proceedToDetails}
                            className="mt-2 w-full text-center text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center justify-center gap-1"
                          >
                            Report as new issue anyway <ChevronRight className="w-3 h-3" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-4 mt-6">
                       <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-800">Back</button>
                       <button type="button" 
                         onClick={async () => {
                           if (!location) return toast('Please select a location.', 'error');
                           if (duplicatesDismissed) { setStep(3); return; }
                           await checkForDuplicates();
                           // If no duplicates, go directly to step 3
                           // (The effect of this check is that nearbyIssues gets set; if empty, we advance)
                         }}
                         disabled={!location || checkingDuplicates}
                         className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl py-3.5 disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                       >
                         {checkingDuplicates ? 'Checking...' : 'Confirm Location'}
                       </button>
                    </div>
                 </motion.div>
               )}

               {/* ── STEP 3: Details ── */}
               {step === 3 && (
                 <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div className="space-y-4">
                       <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label><input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium text-sm transition-colors" placeholder="e.g. Broken Pothole on MG Road" /></div>
                       <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Category</label>
                         <div className="flex flex-wrap gap-2">
                           {CATEGORIES.map(c => (
                             <span key={c.value} className={`px-3 py-2 rounded-lg text-xs font-bold border ${category === c.value ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>{c.label}</span>
                           ))}
                         </div>
                       </div>
                       <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label><textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none font-medium text-sm resize-none transition-colors" placeholder="Describe the issue in detail..." /></div>
                    </div>
                    <div className="flex gap-4 mt-8">
                       <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-800">Back</button>
                       <button type="submit" disabled={loading} className="flex-[2] bg-indigo-600 text-white font-bold rounded-xl py-3.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                          {loading ? 'Submitting...' : 'Submit Report'} <Check className="w-4 h-4"/>
                       </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </form>
        </div>
      </div>
    </div>
  );
}
