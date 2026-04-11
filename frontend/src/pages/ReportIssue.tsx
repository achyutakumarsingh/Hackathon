import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MapPin, UploadCloud, AlertCircle } from 'lucide-react';

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Approximate Location Found', // In a real app, do reverse geocoding via API
          });
          setStep(3);
        },
        (error) => {
          alert('Could not get actual location automatically: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to report an issue.");
    if (!location) return alert("Location is required.");

    setLoading(true);

    try {
      // 1. Upload Images to Supabase Storage
      const imageUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('issue-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('issue-images')
          .getPublicUrl(filePath);
          
        imageUrls.push(publicUrlData.publicUrl);
      }

      // 2. Insert Issue into DB
      const { error: dbError } = await supabase.from('issues').insert({
        title,
        description,
        category,
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        images: imageUrls,
        reporter_id: user.id,
      });

      if (dbError) throw dbError;

      alert("Issue reported successfully!");
      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50/50 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h2>
          <p className="text-sm text-gray-500 mt-1">Help us keep the community safe and clean.</p>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 text-center border-b-2 pb-2 ${step >= 1 ? 'border-blue-600 font-medium text-blue-600' : 'border-gray-200 text-gray-400'}`}>1. Image</div>
            <div className={`flex-1 text-center border-b-2 pb-2 ${step >= 2 ? 'border-blue-600 font-medium text-blue-600' : 'border-gray-200 text-gray-400'}`}>2. Location</div>
            <div className={`flex-1 text-center border-b-2 pb-2 ${step >= 3 ? 'border-blue-600 font-medium text-blue-600' : 'border-gray-200 text-gray-400'}`}>3. Details</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">Single or multiple photos (PNG, JPG)</p>
                </div>
                
                {files.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {files.map((file, i) => (
                      <div key={i} className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }} />
                    ))}
                  </div>
                )}
                
                <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition font-medium">
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start text-amber-800">
                  <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">We need to pinpoint the exact location of the issue to aid authorities.</p>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleGetLocation}
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 rounded-md py-3 px-4 hover:bg-blue-50 transition font-medium"
                >
                  <MapPin className="w-5 h-5" /> Use Current Location
                </button>
                
                <div className="text-center font-medium text-gray-500 text-sm py-2">OR</div>

                <div className="h-48 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center text-sm text-gray-500">
                  Interactive Map Component (Leaflet goes here)
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-200 transition font-medium">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition font-medium disabled:opacity-50" disabled={!location}>Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="E.g., Large pothole on Main Street" />
                </div>
                
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="pothole">Pothole / Road Repair</option>
                    <option value="streetlight">Faulty Streetlight</option>
                    <option value="garbage">Garbage / Waste Accumulation</option>
                    <option value="water">Water Leakage / Pipe Burst</option>
                    <option value="other">Other Civic Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Provide any additional details that might help authorities locate or resolve the issue faster..." />
                </div>

                <div className="flex gap-3 pt-2">
                   <button type="button" onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-200 transition font-medium">Back</button>
                   <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition font-medium disabled:opacity-70 flex items-center justify-center">
                     {loading ? 'Submitting...' : 'Submit Report'}
                   </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
