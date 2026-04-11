# UI & Theming Guidelines

## Design Philosophy
- **Clean & Modern**: Minimalist design with focus on content
- **Accessible**: WCAG 2.1 AA compliant
- **Mobile-First**: Responsive design prioritizing mobile experience
- **Civic-Themed**: Professional yet approachable, instilling trust

## Color Palette

### Primary Colors
```css
--primary-blue: #2563eb      /* Main brand color - trust, authority */
--primary-blue-dark: #1e40af /* Hover states */
--primary-blue-light: #3b82f6 /* Accents */
```

### Status Colors
```css
--status-pending: #f59e0b    /* Amber - awaiting action */
--status-in-progress: #3b82f6 /* Blue - being worked on */
--status-resolved: #10b981   /* Green - completed */
```

### Semantic Colors
```css
--success: #10b981
--error: #ef4444
--warning: #f59e0b
--info: #3b82f6
```

### Neutral Colors
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### Background & Text
```css
--background: #ffffff
--background-secondary: #f9fafb
--text-primary: #111827
--text-secondary: #6b7280
--border: #e5e7eb
```

## Typography

### Font Family
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

## Spacing System
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

## Border Radius
```css
--radius-sm: 0.25rem  /* 4px */
--radius-md: 0.375rem /* 6px */
--radius-lg: 0.5rem   /* 8px */
--radius-xl: 0.75rem  /* 12px */
--radius-2xl: 1rem    /* 16px */
--radius-full: 9999px /* Circular */
```

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## Component Styles

### Buttons
```tsx
// Primary Button
className="bg-primary-blue hover:bg-primary-blue-dark text-white font-medium 
           px-4 py-2 rounded-lg transition-colors duration-200"

// Secondary Button
className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium 
           px-4 py-2 rounded-lg transition-colors duration-200"

// Outline Button
className="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue 
           hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"

// Danger Button
className="bg-red-500 hover:bg-red-600 text-white font-medium 
           px-4 py-2 rounded-lg transition-colors duration-200"
```

### Cards
```tsx
className="bg-white rounded-xl shadow-md border border-gray-200 
           p-6 hover:shadow-lg transition-shadow duration-200"
```

### Input Fields
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-blue focus:border-transparent 
           outline-none transition-all duration-200"
```

### Status Badges
```tsx
// Pending
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
           bg-amber-100 text-amber-800"

// In Progress
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
           bg-blue-100 text-blue-800"

// Resolved
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
           bg-green-100 text-green-800"
```

## Layout Structure

### Header
- Height: 64px (desktop), 56px (mobile)
- Fixed position with backdrop blur
- Logo + Navigation + User menu

### Main Content
- Max width: 1280px
- Padding: 24px (desktop), 16px (mobile)
- Centered layout

### Sidebar (Admin)
- Width: 256px (desktop)
- Collapsible on mobile
- Fixed position

## Page Layouts

### Home Page
```
┌─────────────────────────────────────┐
│           Header (Fixed)            │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│    (CTA + Quick Report Button)      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Recent Issues Grid/List        │
│                                     │
└─────────────────────────────────────┘
```

### Issues Feed Page
```
┌─────────────────────────────────────┐
│           Header (Fixed)            │
├─────────────────────────────────────┤
│  Filters & Search Bar               │
├──────────────┬──────────────────────┤
│              │                      │
│   Map View   │    List View         │
│   (50%)      │    (50%)             │
│              │                      │
└──────────────┴──────────────────────┘
```

### Issue Detail Page
```
┌─────────────────────────────────────┐
│           Header (Fixed)            │
├─────────────────────────────────────┤
│                                     │
│     Image Gallery (Carousel)        │
│                                     │
├─────────────────────────────────────┤
│  Title | Status Badge | Upvote Btn  │
├─────────────────────────────────────┤
│  Description | Location | Category  │
├─────────────────────────────────────┤
│         Map (Location Pin)          │
├─────────────────────────────────────┤
│      Comments Section (Optional)    │
└─────────────────────────────────────┘
```

### Admin Dashboard
```
┌──────┬──────────────────────────────┐
│      │      Header (Fixed)          │
│      ├──────────────────────────────┤
│ Side │                              │
│ bar  │   Stats Cards (4 columns)    │
│      │                              │
│      ├──────────────────────────────┤
│      │                              │
│      │   Issues Table + Filters     │
│      │                              │
└──────┴──────────────────────────────┘
```

## Icons (Lucide React)

### Common Icons
- **MapPin**: Location markers
- **Camera**: Image upload
- **ThumbsUp**: Upvote
- **AlertCircle**: Pending status
- **Clock**: In progress status
- **CheckCircle**: Resolved status
- **Filter**: Filtering options
- **Search**: Search functionality
- **Menu**: Mobile menu toggle
- **User**: User profile
- **Settings**: Admin settings
- **TrendingUp**: Analytics

## Responsive Breakpoints
```css
--screen-sm: 640px   /* Mobile landscape */
--screen-md: 768px   /* Tablet */
--screen-lg: 1024px  /* Desktop */
--screen-xl: 1280px  /* Large desktop */
--screen-2xl: 1536px /* Extra large */
```

## Animation & Transitions

### Hover Effects
```css
transition: all 0.2s ease-in-out;
```

### Page Transitions
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

### Loading States
- Skeleton loaders for cards
- Spinner for buttons
- Progress bar for image uploads

## Accessibility

### Focus States
```css
focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 outline-none
```

### ARIA Labels
- All interactive elements have aria-labels
- Form inputs have associated labels
- Status badges have aria-live regions

### Keyboard Navigation
- Tab order follows visual flow
- Escape closes modals
- Enter submits forms

## Dark Mode (Future Enhancement)
```css
@media (prefers-color-scheme: dark) {
  --background: #111827;
  --text-primary: #f9fafb;
  --border: #374151;
  /* ... other dark mode variables */
}
```

## Component Library
Using **shadcn/ui** for:
- Button
- Card
- Input
- Select
- Dialog/Modal
- Dropdown Menu
- Tabs
- Badge
- Avatar
- Skeleton
- Toast/Alert

## Map Styling
- Custom markers for different issue categories
- Cluster styling for grouped issues
- Popup cards with issue preview
- Color-coded by status
