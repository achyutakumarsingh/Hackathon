-- Drop existing tables if needed
-- drop table if exists issues;

-- Create issues table
CREATE TABLE issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending' NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  address TEXT,
  images JSONB DEFAULT '[]'::jsonb NOT NULL,
  reporter_id UUID REFERENCES auth.users(id),
  upvote_count INTEGER DEFAULT 0,
  priority_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Note: In a real environment, you'd enable PostGIS and use geography data types for geolocation.
-- Example: location GEOGRAPHY(POINT, 4326)

-- Set up Row Level Security (RLS)
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view issues" ON issues
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issues" ON issues
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update their own issues" ON issues
  FOR UPDATE USING (auth.uid() = reporter_id);

-- Create storage bucket for issue images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('issue-images', 'issue-images', true);
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'issue-images');
-- CREATE POLICY "Auth Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'issue-images' AND auth.role() = 'authenticated');
