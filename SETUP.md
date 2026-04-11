# Civic Sense - Setup Guide

This guide will help you set up the Civic Issue Reporting Platform on your local machine.

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.11+
- **Git**
- **Supabase Account** (free tier)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/civic-sense.git
cd civic-sense
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: civic-sense
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
4. Wait for project to be provisioned (~2 minutes)

#### Get Your Credentials
1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them):
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_KEY) - keep this secret!

#### Enable PostGIS Extension
1. Go to **Database** → **Extensions**
2. Search for "postgis"
3. Click "Enable" on `postgis`

#### Set Up Storage Bucket
1. Go to **Storage** → **Create bucket**
2. Name: `issue-images`
3. **Public bucket**: ✅ (checked)
4. Click "Create bucket"
5. Go to bucket **Policies** → Add policy:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'issue-images' );
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'issue-images' 
     AND auth.role() = 'authenticated'
   );
   ```

#### Run Database Migrations
1. Go to **SQL Editor** → **New query**
2. Copy and paste the schema from `backend/supabase/schema.sql` (we'll create this)
3. Click "Run"

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your values
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your values
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_KEY=your_service_role_key
# SUPABASE_ANON_KEY=your_anon_key
# ENVIRONMENT=development

# Start development server
uvicorn main:app --reload --port 8000
```

Backend API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

## Environment Variables

### Frontend (.env.local)

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_URL=http://localhost:8000

# Optional: Map provider
VITE_MAPBOX_TOKEN=your-mapbox-token (if using Mapbox instead of OpenStreetMap)
```

### Backend (.env)

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Application
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000

# CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional: Rate limiting
RATE_LIMIT_PER_MINUTE=60

# Optional: ML Features (Phase 2)
# ML_MODEL_PATH=./models
# ENABLE_ML_FEATURES=false
```

## Project Structure

```
civic-sense/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities & API client
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/                 # FastAPI + Python
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── config.py       # Configuration
│   ├── supabase/
│   │   └── schema.sql      # Database schema
│   ├── .env.example
│   ├── requirements.txt
│   └── main.py
│
├── context/                # Project documentation
│   ├── 1-project-overview.md
│   ├── 2-design-architecture.md
│   ├── 3-ui-theming.md
│   └── 4-mvp-checklist.md
│
├── .gitignore
├── README.md
└── SETUP.md (this file)
```

## Testing Your Setup

### 1. Test Backend
```bash
# Check health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "database": "connected"}
```

### 2. Test Frontend
1. Open `http://localhost:5173`
2. You should see the landing page
3. Try registering a new account
4. Try logging in

### 3. Test Issue Reporting
1. Login to the app
2. Click "Report Issue"
3. Upload an image
4. Fill in details
5. Submit
6. Check if issue appears in feed

## Common Issues

### PostGIS Extension Error
**Error**: `extension "postgis" does not exist`

**Solution**: Enable PostGIS in Supabase dashboard (Database → Extensions)

### CORS Error
**Error**: `Access-Control-Allow-Origin` error

**Solution**: 
- Check `ALLOWED_ORIGINS` in backend `.env`
- Make sure frontend URL is included
- Restart backend server

### Image Upload Fails
**Error**: `Storage bucket not found`

**Solution**:
- Create `issue-images` bucket in Supabase Storage
- Make sure bucket is public
- Check storage policies

### Supabase Connection Error
**Error**: `Invalid API key`

**Solution**:
- Double-check your Supabase URL and keys
- Make sure you're using the correct key (anon for frontend, service_role for backend)
- Check for extra spaces in .env file

## Development Workflow

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Making Database Changes
1. Update `backend/supabase/schema.sql`
2. Run the SQL in Supabase SQL Editor
3. Update Pydantic models if needed

### Adding New Dependencies

**Frontend**:
```bash
cd frontend
npm install package-name
```

**Backend**:
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Add environment variables
5. Deploy

**Important**: Update `VITE_API_URL` in Vercel to your Railway backend URL

## Getting Help

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check `/context` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
