# TaskFlow UI

Modern React/Vite frontend for TaskFlow task management system.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Fonts**: DM Sans (body), Sora (headings) from Google Fonts

## Features

- User authentication (register, login, logout)
- Task management (create, read, update, delete)
- Task filtering by status
- Task status updates via dropdown
- Admin dashboard with user and task analytics
- Responsive design (mobile-first)
- Real-time error handling and notifications
- Automatic JWT token management
- Protected routes with role-based access

## Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API running on `http://localhost:3000`

## Local Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the API base URL if your backend runs on a different port:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Start Development Server

```bash
pnpm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Build for Production

```bash
pnpm run build
```

Output will be in the `dist/` folder.

## Project Structure

```
taskflow-ui/
├── index.html               # HTML entry point with font imports
├── src/
│   ├── api/
│   │   └── axios.js         # API client with interceptors
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx     # Task display card
│   │   ├── TaskModal.jsx    # Create/edit task modal
│   │   └── Toast.jsx        # Notifications
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx    # Main task list
│   │   └── Admin.jsx        # Admin analytics
│   ├── styles/
│   │   └── index.css        # Global styles + Tailwind
│   ├── App.jsx              # Router setup
│   └── main.jsx             # React entry point
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Key Components

### AuthContext
Manages authentication state (token, user, login, logout) with automatic verification on app load.

```jsx
const { user, token, isAuthenticated, login, logout } = useAuth();
```

### Axios Client
HTTP client with automatic JWT injection and 401 error handling:

```javascript
// Automatically adds Authorization header
api.get('/tasks');

// On 401, clears token and redirects to login
```

### ProtectedRoute
Wraps routes that require authentication:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="USER">
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Styling & Design System

### Color Palette
- Background: `#0f0f13`
- Surface: `#1a1a24`
- Primary: `#6c63ff`
- Success: `#00d084`
- Warning: `#ffa500`
- Danger: `#ff6b6b`
- Muted: `#8c8c96`

### Typography
- Heading font: Sora (600-700 weight)
- Body font: DM Sans (400-600 weight)

### Component Classes
Utility classes defined in Tailwind config and CSS:

```html
<button class="btn btn-primary">Click me</button>
<div class="card">Content</div>
<span class="badge badge-success">Done</span>
```

## API Integration

### Environment Detection
The API base URL is automatically set from `VITE_API_BASE_URL` environment variable:

```javascript
const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
```

### Error Handling
All API errors are caught and displayed as toast notifications. 401 errors trigger automatic logout and redirect to login.

### Authentication Flow
1. User enters credentials on Login/Register page
2. API returns JWT token and user object
3. Token stored in localStorage and added to `AuthContext`
4. Axios interceptor adds token to all subsequent requests
5. If token expires (401), user is logged out

## Building for Production

```bash
# Build optimized bundle
pnpm run build

# Preview production build
pnpm run preview

# Deploy dist/ folder to Vercel, Netlify, or any static host
```

The build output is fully self-contained and can be deployed to any CDN or static hosting service.

## Troubleshooting

**API connection errors**: Verify `VITE_API_BASE_URL` matches your backend URL  
**Blank page**: Check browser console for errors, verify backend is running  
**Auth redirects to login**: Ensure JWT token has not expired, check backend is reachable  
**Styles not loading**: Clear browser cache and rebuild with `pnpm run build`

## Performance Optimizations

- Tree-shaking via Vite
- Code splitting with React Router
- Lazy loading routes
- Optimized font loading (Google Fonts)
- Minimal CSS with Tailwind

## License

MIT
