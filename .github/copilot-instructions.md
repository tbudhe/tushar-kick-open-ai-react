# Copilot Instructions for tushar-kick-open-ai-react

## Project Overview
A full-stack AI/ML learning platform using **React 19** + **Express/TypeScript** backend. The React build is served statically from the Express server (`server.ts`), creating a unified application deployed as a single Node.js process.

## Build & Development Workflow

### Critical Commands
- **Development**: `npm run dev` - Starts React dev server on port 3000
- **Production Build**: `npm run build` - Creates optimized React build at `dist/build/`
- **Server Compilation**: `npm run build:server` - Compiles `server.ts` to `dist/server.js` via TypeScript
- **Production Start**: `npm start` or `npm run serve` - Runs compiled server with built React assets
- **Full Development**: `npm run start:server` - Compiles server and watches both frontend/backend

### Build Architecture
- **Frontend**: React with `react-scripts` (CRA-based), outputs to `build/` then moved to `dist/build/`
- **Backend**: Single `server.ts` file compiled to `dist/server.js`
- **Node Version**: >= 20.0.0 (critical for production deployments)

## Architecture & Data Flow

### Frontend Structure (React)
```
src/
├── App.tsx              // Main router - VerticalMenu + Route-based pages
├── components/
│   ├── menu/            // Navigation sidebar with collapse toggle
│   ├── pages/           // Route pages (Home, Profile, AI, Systems, PracticeML)
│   ├── AICard/          // AI feature card component
│   ├── SystemCard/      // Reusable card for system design content
│   └── ProfileCard/     // User profile display card
└── css/                 // Global + page-specific styles (Bootstrap + custom)
```

### Page Routes
All routes defined in `App.tsx` with react-router-dom v7.7+:
- `/` → Home
- `/profile` → Profile (user information)
- `/ai` → AI section (AICard component)
- `/Systems` → Systems page (design principles)
- `/practice-ml` → Machine Learning practice

### Backend Server (Express)
Located in `server.ts` (compiled to `dist/server.js`):
- **Health Check Endpoints**: `/health`, `/heartbeat`, `/api/health`
- **API Endpoint**: `GET /api/menu` - Returns menu structure as JSON (used by VerticalMenu navigation)
- **Static Files**: Serves React build from `dist/build/` directory
- **Fallback Route**: `GET /` sends `index.html` for SPA routing support
- **CORS**: Enabled globally via `cors()` middleware
- **Port**: From env var `PORT` (fallback: 3000)

## Component Patterns

### Typed Functional Components (React.FC)
All components use TypeScript with explicit props interfaces:
```tsx
interface ComponentProps {
  title: string;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Component: React.FC<ComponentProps> = ({ title, collapsed, setCollapsed }) => {
  // Component logic
};
```

### Reusable Card Components
- **SystemCard**: Takes `{ title, description, principles[] }` - renders educational content with optional GIF illustrations
- **ProfileCard**: User information display
- **AICard**: AI feature showcase

Use props interfaces for all reusable components; destructure in function signature.

### State Management
- React hooks (useState) for local state
- Props drilling for parent-child communication
- No global state library (Redux/Zustand)

### Styling
- **Bootstrap 5** for layout/utilities (imported in `index.tsx`)
- **Custom CSS** files co-located with components (e.g., `SystemCard.css` in same directory)
- **MUI Icons** (`@mui/icons-material`) for sidebar navigation icons

## Key Dependencies & Integration Points

### Frontend
- `react-router-dom` (v7.7) - Routing and navigation
- `@mui/material` & `@mui/icons-material` - UI components and icons
- `@emotion/react`, `@emotion/styled` - CSS-in-JS (required by MUI)
- `bootstrap` (v5) - Grid system and utilities

### Backend
- `express` (v5.1) - HTTP server
- `cors` (v2.8) - Cross-origin resource sharing
- `typescript` - Type safety for server code

### Development/Testing
- `react-scripts` (5.0.1) - Build tool for React
- `@testing-library/react`, `@testing-library/jest-dom` - Component testing
- `ts-node` - TypeScript execution (for dev commands)

## Important Implementation Details

### Environment Variables
- `PORT` - Server port (default: 3000)

### TypeScript Configuration
- **Target**: ES2020
- **Module**: CommonJS (for Node.js)
- **Strict Mode**: Enabled
- **Only Compiles**: `server.ts` (React handled separately by react-scripts)

### File Structure Conventions
- Components in subdirectories with their own CSS files
- Pages in `src/components/pages/` with simple routing wrappers
- CSS files use kebab-case filenames matching component names

### AI/ML Content
Project includes system design and ML learning materials:
- Decision Trees in `src/components/ml/supervised/Decision-Tree/`
- System design visualizations in `system-design-practice/`

## Deployment Context
- **Docker Support**: Dockerfile provided (see DEPLOYMENT_GUIDE.md)
- **Railway Deployment**: Primary deployment platform (see RAILWAY_DEPLOYMENT.md)
- **Health Check**: Server exposes `/health` endpoint for deployment monitoring

## When Adding Features
1. **New Page**: Create in `src/components/pages/`, add Route in `App.tsx`
2. **New Card Component**: Use `SystemCardProps` pattern - export interface, type component
3. **API Endpoint**: Add to `server.ts` before static file serving, ensure CORS compatible
4. **Styling**: Co-locate CSS with component, use Bootstrap classes + custom CSS as needed
5. **Build**: Always test `npm run build && npm start` before committing

## Testing & Debugging
- `npm test` - React component tests (jest-based)
- Server logs print to console; check `npm start` output for port/errors
- Use `src/setupTests.ts` for test configuration
