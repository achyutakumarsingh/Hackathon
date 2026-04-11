# 🏙️ Civic Sense - Civic Issue Reporting Platform

A modern web platform enabling citizens to report local civic issues and allowing authorities to track and resolve them efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)

## ✨ Features

### For Citizens
- 📸 **Report Issues** - Upload images, add descriptions, and pin locations
- 🗺️ **Interactive Map** - View all issues on an interactive map
- 📊 **Public Feed** - Browse issues in your area
- 👍 **Upvote System** - Prioritize important issues
- 🔔 **Track Status** - Monitor issue resolution progress

### For Admins
- 📈 **Dashboard** - Overview of all reported issues
- ✅ **Status Management** - Update issue status (pending → in progress → resolved)
- 📊 **Analytics** - Insights on issue categories and resolution times
- 🎯 **Prioritization** - Focus on high-impact issues

### Upcoming (ML Features)
- 🤖 **Auto-Classification** - AI-powered issue categorization
- 🔍 **Duplicate Detection** - Identify similar reports
- ⚡ **Priority Prediction** - Smart urgency assessment
- 📍 **Geo-Clustering** - Identify issue hotspots

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/civic-sense.git
   cd civic-sense
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Enable PostGIS extension
   - Create `issue-images` storage bucket
   - Run database schema (see [SETUP.md](SETUP.md))

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   npm run dev
   ```

4. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your Supabase credentials
   uvicorn main:app --reload
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

📖 **Detailed setup instructions**: See [SETUP.md](SETUP.md)

## 🏗️ Tech Stack

### Frontend
- **React** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Leaflet** - Interactive maps
- **React Query** - Data fetching
- **Supabase Client** - Authentication

### Backend
- **FastAPI** - Python web framework
- **Pydantic** - Data validation
- **Supabase** - Database, Auth, Storage
- **PostgreSQL + PostGIS** - Geospatial database

### Infrastructure
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Supabase** - Backend-as-a-Service

## 📁 Project Structure

```
civic-sense/
├── frontend/          # React application
├── backend/           # FastAPI application
├── context/           # Project documentation
├── SETUP.md          # Setup instructions
└── README.md         # This file
```

## 🎨 Screenshots

_Coming soon_

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Project setup
- [ ] Authentication system
- [ ] Issue reporting
- [ ] Public feed (list + map)
- [ ] Status tracking
- [ ] Upvote system
- [ ] Admin dashboard

### Phase 2: ML Integration
- [ ] Image classification
- [ ] Duplicate detection
- [ ] Priority prediction
- [ ] Geo-clustering

### Phase 3: Enhancements
- [ ] Email notifications
- [ ] Comments system
- [ ] User profiles
- [ ] Mobile app (React Native)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Maps powered by [OpenStreetMap](https://www.openstreetmap.org)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for better civic engagement**
