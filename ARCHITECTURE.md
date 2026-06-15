# HostelHub - Frontend Architecture (Phase 2: Dashboard Layout & UI Foundation)

## Project Overview

HostelHub is a comprehensive hostel management system built with Next.js 16 and React 19. This implementation covers Phase 2, which establishes the visual layout foundation and core UI components for all 11 modules.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks (mock data for dashboard)

## Project Structure

```
/app
  /students           # Student management module
  /attendance         # Attendance tracking module
  /fund-management    # Fund management (maintainer-only)
  /expenses           # Expense tracking
  /cooking-duties     # Kitchen duty assignments
  /announcements      # Announcements module
  /complaints         # Complaints/issues tracking
  /visitors           # Visitor management
  /elections          # Elections module
  /reports            # Analytics & reports (maintainer-only)
  page.tsx           # Dashboard landing page
  layout.tsx         # Root layout with metadata
  403.tsx            # Forbidden access page

/components
  /layout
    - Sidebar.tsx          # Navigation sidebar with menu
    - Header.tsx           # Top header with notifications & user profile
    - PageContainer.tsx    # Reusable page wrapper with breadcrumbs
    - Breadcrumb.tsx       # Breadcrumb navigation component
  /cards
    - StatsCard.tsx        # Statistics card with trends
  /auth
    - RoleGuard.tsx        # Role-based access control component
  /ui
    - button.tsx          # Base button component (shadcn)

/lib
  - mock-data.ts    # Dashboard mock data
  - utils.ts        # Utility functions (cn for class merging)
```

## Design System

### Color Palette

- **Primary**: Dark Navy (#1F2937) - Sidebar background
- **Accent**: Golden Yellow (#F7B538) - Active states, highlights
- **Background**: Light Gray (#F5F7FA) - Page background
- **Text**: Dark Gray (#111827) - Primary text
- **Secondary**: Light Gray (#6B7280) - Secondary text
- **Borders**: Light Gray (#E5E7EB) - Card and section borders

### Typography

- **Headings**: Bold, sans-serif (Geist)
- **Body**: Regular, sans-serif (Geist)
- **Line height**: 1.5-1.6 for readability

### Component Patterns

- **Cards**: Rounded (radius: 1.5rem), light shadow, subtle borders
- **Buttons**: Golden background with dark text, rounded corners, hover effects
- **Icons**: 20-24px sizing, consistent spacing with labels
- **Spacing**: 4px/8px/16px/24px padding/margins

## Key Features

### 1. Dashboard Landing Page

The home page (`/app/page.tsx`) displays:

- **Statistics Cards**: 4 key metrics with trend indicators
  - Total Students (42)
  - Current Fund (₹125,500)
  - Present Today (38)
  - Pending Duties (3)

- **Recent Activity**: Timeline of fund contributions, expenses, and attendance
- **Announcements**: High/normal priority announcements
- **Upcoming Duties**: Table of scheduled cooking duties with assignment status

### 2. Navigation Sidebar

The `Sidebar` component features:

- Logo with hostel branding (HH in golden square)
- 11 navigation menu items with icons:
  - Dashboard (default active)
  - Students, Attendance, Fund Management, Expenses
  - Cooking Duties, Announcements, Complaints, Visitors
  - Elections, Reports
- Active state highlighting (golden background)
- Settings and Logout buttons
- Mobile-responsive hamburger menu (hidden on desktop)

### 3. Header

The `Header` component includes:

- Notification bell with badge
- User profile section
  - Avatar with initials
  - User name ("John Doe")
  - Role ("Maintainer")

### 4. Page Structure

Every page uses the `PageContainer` wrapper which provides:

- Integrated sidebar + header
- Breadcrumb navigation
- Page title display
- Consistent layout with proper margins/padding

### 5. Role-Based Access Control

The `RoleGuard` component restricts pages based on user role:

- **MAINTAINER**: Fund Management, Reports
- **STUDENT**: All other modules (default)
- **Unauthorized Access**: Redirects to `/403` forbidden page

## Mock Data Structure

Dashboard statistics and activity are seeded from `/lib/mock-data.ts`:

- `dashboardStats`: Key metrics
- `recentActivity`: 5 recent transactions/events
- `announcements`: 4 upcoming announcements
- `upcomingDuties`: 4 upcoming duty assignments

## Responsive Design

- **Mobile** (< 768px): Sidebar collapses to hamburger, single-column layout
- **Tablet** (768px - 1024px): Sidebar visible, 2-column grid for cards
- **Desktop** (1024px+): Full layout with 4-column stats grid

## Component Composition

### Sidebar Component
```tsx
<Sidebar />  // Mobile menu toggle + navigation
```

### Page Layout
```tsx
<PageContainer title="Page Title" breadcrumbs={items}>
  {/* Your content here */}
</PageContainer>
```

### Stats Card
```tsx
<StatsCard 
  title="Total Students"
  value={42}
  icon={Users}
  trend={{ direction: 'up', percentage: 5 }}
/>
```

### Role Protection
```tsx
<RoleGuard requiredRole="MAINTAINER">
  {/* Content visible only to maintainers */}
</RoleGuard>
```

## Next Steps (Phase 3 & Beyond)

1. **Connect Backend Services**: Replace mock data with API calls to Spring Boot backend
2. **Implement Authentication**: Add login/logout with session management
3. **Add Form Modules**: Implement CRUD operations for all 11 modules
4. **Real-time Updates**: Add WebSocket support for live notifications
5. **Search & Filtering**: Add table search and filter capabilities
6. **Export Reports**: PDF/Excel export functionality

## Notes

- All components are client-rendered with `'use client'` directive for interactivity
- Mock data provides realistic examples of dashboard content
- Breadcrumbs automatically show current page context
- Colors use Tailwind utility classes (no arbitrary values)
- Accessibility maintained with semantic HTML and ARIA labels
