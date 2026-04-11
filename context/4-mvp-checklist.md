# MVP Checklist

## Phase 1: Project Setup & Foundation

### Development Environment
- [ ] Initialize Git repository
- [ ] Create project structure (frontend + backend)
- [ ] Set up package managers (npm/yarn for frontend, npm/pip for backend)
- [ ] Configure TypeScript for frontend
- [ ] Set up ESLint + Prettier
- [ ] Create `.env.example` files
- [ ] Set up development database (PostgreSQL + PostGIS)
- [ ] Configure Redis (optional for MVP)

### Frontend Setup
- [ ] Initialize React app with Vite/Create React App
- [ ] Install core dependencies:
  - [ ] React Router
  - [ ] TailwindCSS
  - [ ] shadcn/ui
  - [ ] React Query
  - [ ] Axios
  - [ ] Lucide React
  - [ ] Leaflet/Mapbox
- [ ] Configure Tailwind with custom theme
- [ ] Set up folder structure
- [ ] Create base layout components (Header, Footer)

### Backend Setup
- [ ] Initialize Node.js/Express or Python/FastAPI project
- [ ] Install core dependencies:
  - [ ] Database ORM (Prisma/TypeORM or SQLAlchemy)
  - [ ] Authentication (JWT, bcrypt)
  - [ ] File upload (Multer/FastAPI UploadFile)
  - [ ] Validation (Zod/Joi or Pydantic)
  - [ ] CORS middleware
- [ ] Set up database connection
- [ ] Create database schema/models
- [ ] Run initial migrations
- [ ] Set up API folder structure

---

## Phase 2: Authentication System

### Backend
- [ ] Create User model/schema
- [ ] Implement registration endpoint
  - [ ] Email validation
  - [ ] Password hashing
  - [ ] Duplicate email check
- [ ] Implement login endpoint
  - [ ] Credential verification
  - [ ] JWT token generation
  - [ ] Refresh token logic (optional for MVP)
- [ ] Implement authentication middleware
- [ ] Create `/api/auth/me` endpoint
- [ ] Add role-based access control (citizen/admin)

### Frontend
- [ ] Create auth context/provider
- [ ] Build Login page
- [ ] Build Registration page
- [ ] Implement protected routes
- [ ] Add token storage (localStorage/cookies)
- [ ] Create auth interceptor for API calls
- [ ] Add logout functionality

### Testing
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test token expiry handling

---

## Phase 3: Issue Reporting

### Backend
- [ ] Create Issue model/schema
- [ ] Set up image upload:
  - [ ] Configure storage (local/S3/Cloudinary)
  - [ ] Image validation (type, size)
  - [ ] Generate thumbnails (optional)
- [ ] Implement POST `/api/issues` endpoint
  - [ ] Validate input data
  - [ ] Handle image uploads
  - [ ] Save location (PostGIS POINT)
  - [ ] Return created issue
- [ ] Add geolocation validation

### Frontend
- [ ] Create IssueForm component
- [ ] Build image upload component
  - [ ] Preview uploaded images
  - [ ] Multiple image support
  - [ ] Drag & drop (optional)
- [ ] Create location picker component
  - [ ] Auto-detect current location
  - [ ] Manual map selection
  - [ ] Reverse geocoding for address
- [ ] Add category dropdown
- [ ] Implement form validation
- [ ] Create ReportIssue page
- [ ] Add success/error notifications

### Testing
- [ ] Test issue creation with all fields
- [ ] Test image upload
- [ ] Test location capture
- [ ] Test form validation

---

## Phase 4: Public Feed

### Backend
- [ ] Implement GET `/api/issues` endpoint
  - [ ] Pagination (cursor/offset)
  - [ ] Filtering (status, category, date)
  - [ ] Sorting (recent, popular)
  - [ ] Search (title, description)
- [ ] Implement GET `/api/issues/:id` endpoint
- [ ] Add database indexes for performance
- [ ] Optimize queries (select specific fields)

### Frontend
- [ ] Create IssueCard component
- [ ] Create IssueList component
  - [ ] Infinite scroll or pagination
  - [ ] Loading states (skeleton)
  - [ ] Empty state
- [ ] Create IssueMap component
  - [ ] Display markers for all issues
  - [ ] Color-code by status
  - [ ] Popup on marker click
  - [ ] Geo-clustering (optional for MVP)
- [ ] Build IssuesFeed page
  - [ ] Toggle between list/map view
  - [ ] Filter controls
  - [ ] Search bar
- [ ] Create IssueDetail page
  - [ ] Image gallery/carousel
  - [ ] Issue metadata
  - [ ] Location map
  - [ ] Status badge

### Testing
- [ ] Test issue list rendering
- [ ] Test filters and search
- [ ] Test map markers
- [ ] Test pagination
- [ ] Test issue detail page

---

## Phase 5: Status Tracking

### Backend
- [ ] Create StatusHistory model/schema
- [ ] Implement PATCH `/api/admin/issues/:id/status` endpoint
  - [ ] Admin-only access
  - [ ] Validate status transitions
  - [ ] Create history record
  - [ ] Update issue timestamp
- [ ] Add status change notifications (optional)

### Frontend
- [ ] Create status badge component
- [ ] Add status timeline/history display
- [ ] Build admin status update UI
  - [ ] Dropdown for status change
  - [ ] Confirmation dialog
  - [ ] Comment field (optional)
- [ ] Show status history on issue detail page
- [ ] Add real-time updates (optional)

### Testing
- [ ] Test status updates as admin
- [ ] Test unauthorized access prevention
- [ ] Test status history logging
- [ ] Test UI updates after status change

---

## Phase 6: Upvote System

### Backend
- [ ] Create Vote model/schema
- [ ] Implement POST `/api/issues/:id/upvote` endpoint
  - [ ] Check for existing vote
  - [ ] Create vote record
  - [ ] Increment upvote_count
  - [ ] Return updated count
- [ ] Implement DELETE `/api/issues/:id/upvote` endpoint
  - [ ] Remove vote
  - [ ] Decrement count
- [ ] Add unique constraint (user + issue)

### Frontend
- [ ] Create upvote button component
  - [ ] Show current count
  - [ ] Toggle active state
  - [ ] Optimistic updates
- [ ] Add upvote to IssueCard
- [ ] Add upvote to IssueDetail page
- [ ] Disable for unauthenticated users
- [ ] Add sort by upvotes in feed

### Testing
- [ ] Test upvote creation
- [ ] Test upvote removal
- [ ] Test duplicate vote prevention
- [ ] Test count accuracy

---

## Phase 7: Admin Dashboard

### Backend
- [ ] Implement GET `/api/admin/issues` endpoint
  - [ ] Admin-only access
  - [ ] Advanced filtering
  - [ ] Bulk operations (optional)
- [ ] Implement GET `/api/admin/analytics` endpoint
  - [ ] Issue count by status
  - [ ] Issue count by category
  - [ ] Average resolution time
  - [ ] Recent activity

### Frontend
- [ ] Create admin layout with sidebar
- [ ] Build Dashboard page
  - [ ] Stats cards (total, pending, in progress, resolved)
  - [ ] Charts (optional: pie chart for categories)
  - [ ] Recent issues table
- [ ] Build IssueManager component
  - [ ] Table view with filters
  - [ ] Status update controls
  - [ ] Bulk actions (optional)
- [ ] Create Analytics page (optional)
- [ ] Add admin navigation

### Testing
- [ ] Test admin access control
- [ ] Test analytics data accuracy
- [ ] Test issue management features
- [ ] Test responsive design

---

## Phase 8: Polish & Optimization

### Performance
- [ ] Optimize images (compression, lazy loading)
- [ ] Add caching headers
- [ ] Implement Redis caching (optional)
- [ ] Database query optimization
- [ ] Code splitting (React.lazy)
- [ ] Minify assets

### UX Improvements
- [ ] Add loading states everywhere
- [ ] Improve error messages
- [ ] Add success notifications
- [ ] Implement 404 page
- [ ] Add empty states
- [ ] Improve mobile responsiveness

### Security
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Strip image EXIF data
- [ ] Add CSRF protection
- [ ] Implement helmet.js (security headers)
- [ ] Validate file uploads thoroughly

### Accessibility
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Check color contrast
- [ ] Add alt text to images
- [ ] Test with screen reader

---

## Phase 9: Testing & QA

### Unit Tests
- [ ] Backend API endpoints
- [ ] Frontend components
- [ ] Utility functions
- [ ] Authentication logic

### Integration Tests
- [ ] User registration → login → report issue flow
- [ ] Admin status update flow
- [ ] Upvote flow

### E2E Tests (Optional)
- [ ] Complete user journey
- [ ] Admin workflow

### Manual Testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing (iOS, Android)
- [ ] Edge cases (network errors, large files)

---

## Phase 10: Deployment

### Backend Deployment
- [ ] Choose hosting (Railway, Render, AWS, Heroku)
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Deploy backend
- [ ] Test production API

### Frontend Deployment
- [ ] Choose hosting (Vercel, Netlify)
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy frontend
- [ ] Test production app

### Post-Deployment
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure analytics (optional)
- [ ] Set up backup strategy
- [ ] Document API endpoints
- [ ] Create user guide/README

---

## Optional Enhancements (Post-MVP)

### ML Features
- [ ] Image classification model
- [ ] Duplicate detection system
- [ ] Priority prediction algorithm
- [ ] Geo-clustering improvements

### Additional Features
- [ ] Email notifications
- [ ] Push notifications
- [ ] Comments on issues
- [ ] User profiles
- [ ] Issue categories management
- [ ] Export data (CSV/PDF)
- [ ] Dark mode
- [ ] Multi-language support

---

## Success Criteria

### Functional
- ✅ Users can register and login
- ✅ Users can report issues with images and location
- ✅ Public feed displays all issues
- ✅ Issues can be filtered and searched
- ✅ Users can upvote issues
- ✅ Admins can update issue status
- ✅ Admin dashboard shows analytics

### Non-Functional
- ✅ App loads in < 3 seconds
- ✅ Mobile responsive
- ✅ Accessible (WCAG AA)
- ✅ Secure (no major vulnerabilities)
- ✅ Deployed and publicly accessible

---

## Timeline Estimate (MVP)

- **Week 1**: Setup + Authentication (Phase 1-2)
- **Week 2**: Issue Reporting + Public Feed (Phase 3-4)
- **Week 3**: Status Tracking + Upvote (Phase 5-6)
- **Week 4**: Admin Dashboard + Polish (Phase 7-8)
- **Week 5**: Testing + Deployment (Phase 9-10)

**Total: ~5 weeks for MVP**
