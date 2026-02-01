# LocalConnect - Job Discovery Platform

## Overview

LocalConnect is a location-based job discovery platform that helps users find local employment opportunities. The application features an interactive map interface for browsing jobs, user profiles with skills and portfolio management, and a streamlined onboarding flow for location personalization. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Maps**: Leaflet with react-leaflet for interactive job location mapping
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in shared route schemas with Zod validation
- **Build Process**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

### Authentication
- **Provider**: Replit OpenID Connect (OIDC) authentication
- **Session Management**: Express-session with PostgreSQL store
- **User Storage**: Dedicated users table with profile information

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory are used by both frontend and backend
- **API Route Definitions**: Type-safe route definitions in `shared/routes.ts` with Zod schemas
- **Component Architecture**: Atomic design with reusable UI components in `client/src/components/ui/`
- **Custom Hooks**: Business logic encapsulated in hooks (`use-auth`, `use-jobs`, `use-location`)
- **Storage Abstraction**: Database operations abstracted through storage interface in `server/storage.ts`

### Project Structure
```
├── client/              # Frontend React application
│   └── src/
│       ├── components/  # React components including shadcn/ui
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components (Dashboard, Onboarding, Profile)
│       └── lib/         # Utilities and query client
├── server/              # Express backend
│   ├── replit_integrations/  # Replit auth integration
│   └── storage.ts       # Database access layer
├── shared/              # Shared types and schemas
│   ├── schema.ts        # Drizzle database schema
│   ├── routes.ts        # API route definitions
│   └── models/          # Data models (auth)
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit OIDC**: OpenID Connect authentication via `ISSUER_URL` environment variable
- **Session Secret**: `SESSION_SECRET` environment variable for session encryption

### Frontend Libraries
- **Leaflet**: Map rendering for job location visualization
- **Radix UI**: Accessible component primitives for shadcn/ui
- **TanStack Query**: Server state management and caching

### Build & Development
- **Vite**: Frontend development server with HMR
- **esbuild**: Server-side bundling for production
- **TypeScript**: Full-stack type safety

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `ISSUER_URL`: Replit OIDC issuer (defaults to https://replit.com/oidc)
- `REPL_ID`: Replit environment identifier