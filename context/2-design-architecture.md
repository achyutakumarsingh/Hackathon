# Design Architecture

## UI/UX Design Specifications

### Design Philosophy

- **Clean & Minimal**: Trustworthy government-grade with modern SaaS polish
- **Accessible**: WCAG 2.1 AA compliant, readable for all age groups
- **Mobile-First**: Optimized for citizens reporting on-the-go
- **Clarity Over Decoration**: Focus on usability and clear information hierarchy

### Color System

#### Primary Colors

```css
--primary-blue: #3b82f6 /* Trust, authority, primary actions */
  --primary-blue-dark: #2563eb /* Hover states */ --primary-blue-light: #60a5fa
  /* Accents */;
```

#### Status Colors

```css
--status-pending: #f59e0b /* Amber - awaiting action */
  --status-in-progress: #3b82f6 /* Blue - being worked on */
  --status-resolved: #10b981 /* Green - completed */;
```

#### Semantic Colors

```css
--success: #10b981 --error: #ef4444 --warning: #f59e0b --info: #3b82f6;
```

#### Neutral Palette

```css
--white: #ffffff --gray-50: #f9fafb --gray-100: #f3f4f6 --gray-200: #e5e7eb
  --gray-300: #d1d5db --gray-600: #4b5563 --gray-900: #111827;
```

### Typography

#### Font Family

```css
--font-primary:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

#### Type Scale

```css
--text-xs: 0.75rem /* 12px - labels, captions */ --text-sm: 0.875rem
  /* 14px - body small */ --text-base: 1rem /* 16px - body */
  --text-lg: 1.125rem /* 18px - large body */ --text-xl: 1.25rem
  /* 20px - small headings */ --text-2xl: 1.5rem /* 24px - section headings */
  --text-3xl: 1.875rem /* 30px - page headings */ --text-4xl: 2.25rem
  /* 36px - hero headings */;
```

#### Font Weights

```css
--font-normal: 400 --font-medium: 500 --font-semibold: 600 --font-bold: 700;
```

### Spacing System

```css
--space-1: 0.25rem /* 4px */ --space-2: 0.5rem /* 8px */ --space-3: 0.75rem
  /* 12px */ --space-4: 1rem /* 16px */ --space-6: 1.5rem /* 24px */
  --space-8: 2rem /* 32px */ --space-12: 3rem /* 48px */ --space-16: 4rem
  /* 64px */;
```

### Border Radius

```css
--radius-sm: 0.375rem /* 6px - small elements */ --radius-md: 0.5rem
  /* 8px - buttons, inputs */ --radius-lg: 0.75rem /* 12px - cards */
  --radius-xl: 1rem /* 16px - large cards */ --radius-full: 9999px
  /* Pills, badges */;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Page Layouts

### 1. Global Layout Structure

#### Navigation Bar (Sticky)

- Height: 64px (desktop), 56px (mobile)
- Background: White with subtle shadow
- Logo + Navigation links + User menu
- Transparent backdrop blur on scroll

#### Responsive Breakpoints

```css
--screen-sm: 640px /* Mobile landscape */ --screen-md: 768px /* Tablet */
  --screen-lg: 1024px /* Desktop */ --screen-xl: 1280px /* Large desktop */;
```

### 2. Citizen Experience

#### A. Home / Public Feed

**Layout**: Single column with toggle

- **Header Section**:
  - View toggle (List/Map)
  - Search bar (prominent, full-width on mobile)
  - Filter chips (Category, Status, Location)
- **Issue Cards** (List View):

  ```
  ┌─────────────────────────────────┐
  │ [Image]  Title                  │
  │          Location • 2h ago      │
  │          [Status Badge] 👍 45   │
  └─────────────────────────────────┘
  ```

  - Image: 80x80px thumbnail (mobile), 120x120px (desktop)
  - Hover: Subtle elevation increase
  - Click: Navigate to detail page

- **Infinite Scroll**: Load more on scroll
- **Empty State**: Friendly illustration + CTA

#### B. Map View

**Layout**: Full-height map with overlay

- Interactive map (Leaflet/Mapbox)
- Color-coded markers:
  - Red: Pending
  - Blue: In Progress
  - Green: Resolved
- Cluster markers when zoomed out
- Click marker → Preview card overlay
- Filter panel (collapsible sidebar on desktop, bottom sheet on mobile)

#### C. Report Issue Flow

**Multi-step Form** (3 steps):

**Step 1: Upload Images**

```
┌─────────────────────────────────┐
│  Drag & drop or click to upload│
│  [+ Add Photo]                  │
│  Preview grid (2x2)             │
└─────────────────────────────────┘
```

**Step 2: Location**

```
┌─────────────────────────────────┐
│  [Use Current Location] [Map]   │
│  Interactive map picker         │
│  Address preview                │
└─────────────────────────────────┘
```

**Step 3: Details**

```
┌─────────────────────────────────┐
│  Title: [Input]                 │
│  Category: [Dropdown]           │
│  Description: [Textarea]        │
│  [AI Suggestion: "Pothole"]     │
│  [⚠ Similar issue nearby]       │
└─────────────────────────────────┘
```

- Progress indicator at top
- Back/Next buttons
- Auto-save draft

#### D. Issue Detail Page

**Layout**: Single column, centered (max-width: 768px)

```
┌─────────────────────────────────┐
│  Image Gallery (Carousel)       │
├─────────────────────────────────┤
│  Title              [Status]    │
│  Location • Category • Time     │
├─────────────────────────────────┤
│  Description (full text)        │
├─────────────────────────────────┤
│  [👍 Upvote (45)] [Share]       │
├─────────────────────────────────┤
│  Status Timeline:               │
│  ● Reported                     │
│  ○ In Progress                  │
│  ○ Resolved                     │
├─────────────────────────────────┤
│  Map (location preview)         │
├─────────────────────────────────┤
│  Comments (optional)            │
└─────────────────────────────────┘
```

### 3. Admin Dashboard

#### Layout Structure

```
┌──────┬──────────────────────────┐
│      │  Header                  │
│ Side ├──────────────────────────┤
│ bar  │  KPI Cards (4 columns)   │
│      ├──────────────────────────┤
│      │  Issues Table            │
│      │  + Filters               │
└──────┴──────────────────────────┘
```

#### Sidebar Navigation

- Width: 240px (desktop), collapsible on mobile
- Sections:
  - Dashboard
  - All Issues
  - Analytics
  - Users
  - Settings

#### KPI Cards

```
┌─────────────┐ ┌─────────────┐
│ Total: 248  │ │ Pending: 89 │
│ [Icon]      │ │ [Icon]      │
└─────────────┘ └─────────────┘
```

#### Issues Table

- Columns: Title, Category, Status, Upvotes, Date, Actions
- Sortable headers
- Inline status update dropdown
- Bulk actions (select multiple)
- Pagination (20 per page)

#### Analytics Page

- Time range selector
- Charts:
  - Issues by category (pie chart)
  - Resolution time (line chart)
  - Geo heatmap
- Export data (CSV)

## Component Library

### Status Badge

```html
<span class="status-badge status-pending">Pending</span>
<span class="status-badge status-progress">In Progress</span>
<span class="status-badge status-resolved">Resolved</span>
```

- Pill-shaped (border-radius: 9999px)
- Padding: 4px 12px
- Font-size: 12px, font-weight: 500

### Upvote Button

```html
<button class="upvote-btn">
  <svg>👍</svg>
  <span>45</span>
</button>
```

- Micro-interaction: Scale on click
- Active state: Filled background
- Disabled for unauthenticated users

### Issue Card

- Border: 1px solid gray-200
- Border-radius: 12px
- Padding: 16px
- Hover: Shadow elevation + border color change
- Transition: 200ms ease

### Timeline Stepper

```
● Reported (Jan 15, 2026)
│
● In Progress (Jan 16, 2026)
│
○ Resolved
```

- Filled circle: Completed
- Empty circle: Pending
- Line connector between steps

## Interactions & Animations

### Micro-interactions

- Button hover: Scale 1.02, shadow increase
- Card hover: translateY(-2px), shadow increase
- Upvote click: Scale 1.1 → 0.95 → 1.0 (bounce)
- Status change: Fade out → Fade in with new color

### Loading States

- Skeleton loaders for cards (shimmer effect)
- Spinner for buttons (inline)
- Progress bar for image uploads

### Transitions

- All transitions: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Page transitions: Fade in (300ms)

### Toast Notifications

- Position: Top-right (desktop), top-center (mobile)
- Auto-dismiss: 3 seconds
- Types: Success, Error, Info, Warning

## Accessibility

### Keyboard Navigation

- Tab order follows visual flow
- Focus indicators (2px blue outline)
- Escape closes modals
- Enter submits forms

### Screen Reader Support

- ARIA labels on all interactive elements
- Alt text for images
- Status announcements (aria-live)

### Color Contrast

- Text on white: Minimum 4.5:1 ratio
- Status badges: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Touch Targets

- Minimum size: 44x44px (mobile)
- Spacing between targets: 8px

## Responsive Design

### Mobile (< 768px)

- Single column layout
- Bottom navigation (sticky)
- Full-width cards
- Collapsible filters (bottom sheet)
- Larger touch targets

### Tablet (768px - 1024px)

- Two-column grid
- Sidebar toggleable
- Hybrid layouts

### Desktop (> 1024px)

- Multi-column layouts
- Persistent sidebar
- Hover states enabled
- Keyboard shortcuts

## Smart UI Elements (ML-Powered)

### Auto-suggest Category

```
┌─────────────────────────────────┐
│ Category: [Dropdown ▼]          │
│ 💡 Suggested: Pothole (AI)      │
└─────────────────────────────────┘
```

### Duplicate Detection Warning

```
┌─────────────────────────────────┐
│ ⚠ Similar issue found nearby    │
│ "Pothole on Main St" (0.2 km)   │
│ [View] [Report Anyway]          │
└─────────────────────────────────┘
```

### Priority Indicator

```
[🔴 High Priority] (AI-predicted)
```

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Vercel)                    │
├──────────────────────────────────────────────────────────────┤
│  React SPA (TypeScript + Vite)                               │
│  - Components (shadcn/ui)                                    │
│  - State Management (React Query + Zustand)                  │
│  - Routing (React Router)                                    │
│  - Map Integration (Leaflet + OpenStreetMap)                 │
│  - Auth (Supabase Client)                                    │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────▼─────────────────────────────────────────┐
│                API GATEWAY LAYER (Railway)                   │
├──────────────────────────────────────────────────────────────┤
│  FastAPI (Python 3.11+)                                      │
│  - CORS Middleware                                           │
│  - Rate Limiting (slowapi)                                   │
│  - Request Validation (Pydantic)                             │
│  - Supabase Auth Verification                                │
└────────────────────┬─────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
├──────────────────────────────────────────────────────────────┤
│  Business Logic Services (Python):                           │
│  - Issue Service (CRUD, filtering, search)                   │
│  - Vote Service (upvote logic)                               │
│  - Admin Service (status updates, analytics)                 │
│  - ML Service (Phase 2: classification, duplicates)          │
└─────┬──────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend-as-a-Service)           │
├──────────────────────────────────────────────────────────────┤
│  - PostgreSQL + PostGIS (Database)                           │
│  - Authentication (Email/Password, Social)                   │
│  - Storage (Image uploads)                                   │
│  - Real-time subscriptions (optional)                        │
│  - Row Level Security (RLS)                                  │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

### Users Table

```sql
users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- role (ENUM: 'citizen', 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Issues Table

```sql
issues
- id (UUID, PK)
- title (VARCHAR)
- description (TEXT)
- category (ENUM: 'pothole', 'streetlight', 'garbage', 'water', 'other')
- status (ENUM: 'pending', 'in_progress', 'resolved')
- location (GEOGRAPHY POINT) -- PostGIS type
- address (TEXT)
- images (JSONB) -- array of image URLs
- reporter_id (UUID, FK -> users.id)
- upvote_count (INTEGER, DEFAULT 0)
- priority_score (FLOAT, NULLABLE) -- ML-generated
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- resolved_at (TIMESTAMP, NULLABLE)
```

### Votes Table

```sql
votes
- id (UUID, PK)
- issue_id (UUID, FK -> issues.id)
- user_id (UUID, FK -> users.id)
- created_at (TIMESTAMP)
- UNIQUE(issue_id, user_id)
```

### Status History Table

```sql
status_history
- id (UUID, PK)
- issue_id (UUID, FK -> issues.id)
- old_status (VARCHAR)
- new_status (VARCHAR)
- changed_by (UUID, FK -> users.id)
- comment (TEXT, NULLABLE)
- created_at (TIMESTAMP)
```

### Comments Table (Optional)

```sql
comments
- id (UUID, PK)
- issue_id (UUID, FK -> issues.id)
- user_id (UUID, FK -> users.id)
- content (TEXT)
- created_at (TIMESTAMP)
```

## API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Issues

```
GET    /api/issues              # List all issues (with filters)
GET    /api/issues/:id          # Get single issue
POST   /api/issues              # Create new issue
PATCH  /api/issues/:id          # Update issue
DELETE /api/issues/:id          # Delete issue (admin only)
POST   /api/issues/:id/upvote   # Upvote an issue
DELETE /api/issues/:id/upvote   # Remove upvote
```

### Admin

```
GET    /api/admin/issues        # Admin view with filters
PATCH  /api/admin/issues/:id/status  # Update status
GET    /api/admin/analytics     # Dashboard analytics
GET    /api/admin/users         # User management
```

### ML Services (Optional)

```
POST   /api/ml/classify-image   # Classify issue from image
POST   /api/ml/detect-duplicate # Find similar issues
POST   /api/ml/predict-priority # Predict issue priority
```

## Component Architecture (Frontend)

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── issues/
│   │   ├── IssueCard.tsx
│   │   ├── IssueList.tsx
│   │   ├── IssueMap.tsx
│   │   ├── IssueForm.tsx
│   │   └── IssueDetail.tsx
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── IssueManager.tsx
│   │   └── Analytics.tsx
│   └── common/
│       ├── ImageUpload.tsx
│       ├── LocationPicker.tsx
│       └── StatusBadge.tsx
├── pages/
│   ├── Home.tsx
│   ├── IssuesFeed.tsx
│   ├── ReportIssue.tsx
│   ├── IssueDetails.tsx
│   ├── Login.tsx
│   └── AdminDashboard.tsx
├── hooks/
│   ├── useIssues.ts
│   ├── useAuth.ts
│   └── useGeolocation.ts
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
└── types/
    └── index.ts
```

## Data Flow

### Issue Reporting Flow

```
1. User fills form → uploads image → selects location
2. Frontend validates → sends to /api/issues
3. Backend:
   - Validates data
   - Uploads image to S3
   - (Optional) Calls ML service for classification
   - Saves to PostgreSQL
   - Returns created issue
4. Frontend updates UI + redirects to issue detail
```

### Upvote Flow

```
1. User clicks upvote button
2. Frontend sends POST /api/issues/:id/upvote
3. Backend:
   - Checks if user already voted
   - Creates vote record
   - Increments upvote_count
   - Returns updated count
4. Frontend updates UI optimistically
```

### Admin Status Update Flow

```
1. Admin changes status dropdown
2. Frontend sends PATCH /api/admin/issues/:id/status
3. Backend:
   - Validates admin role
   - Updates issue status
   - Creates status_history record
   - (Optional) Triggers notification to reporter
4. Frontend updates UI + shows success message
```

## Security Considerations

### Authentication

- JWT tokens with short expiry (15 min access, 7 day refresh)
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt (12 rounds)

### Authorization

- Role-based access control (RBAC)
- Admin-only routes protected by middleware
- Users can only edit their own issues

### Data Validation

- Input sanitization on backend
- File upload validation (type, size)
- Rate limiting on API endpoints

### Privacy

- Location data anonymized in public view (rounded to ~100m)
- User emails not exposed in public API
- Image EXIF data stripped

## Performance Optimization

### Caching Strategy

- Redis cache for:
  - Issue list queries (5 min TTL)
  - User sessions
  - Analytics data (1 hour TTL)

### Database Indexing

```sql
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_location ON issues USING GIST(location);
```

### Pagination

- Cursor-based pagination for issue feed
- Limit: 20 issues per page

### Image Optimization

- Compress images on upload
- Generate thumbnails
- Lazy loading on frontend

## Scalability Considerations

### Horizontal Scaling

- Stateless API servers
- Load balancer (Nginx/AWS ALB)
- Database read replicas

### Microservices (Future)

- Separate ML service
- Notification service
- Analytics service

## Monitoring & Logging

- Error tracking (Sentry)
- API monitoring (Prometheus + Grafana)
- Structured logging (Winston/Pino)
- Database query performance monitoring
