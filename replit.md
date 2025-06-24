# GlobalExport - Agricultural Products Export Platform

## Overview

This is a full-stack web application for a global agricultural export business. The platform showcases premium agricultural products and allows visitors to request quotes for bulk export orders. It features a customer-facing product catalog and an admin panel for content management.

## System Architecture

The application follows a monorepo structure with a clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, Vite build system, Tailwind CSS for styling
- **Backend**: Express.js with TypeScript, RESTful API architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session-based authentication
- **Deployment**: Configured for Replit autoscale deployment

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Passport.js with bcryptjs for password hashing
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Users**: Admin authentication and role management
- **Categories**: Product categorization system
- **Products**: Main product catalog with images, specifications, and metadata
- **Quotes**: Customer quote requests with contact information
- **Contact Messages**: General customer inquiries

### UI Components
Built on shadcn/ui component library providing:
- Responsive design patterns
- Accessibility compliance
- Dark/light theme support
- Comprehensive form components
- Data visualization components

## Data Flow

1. **Product Display**: Products are fetched from the database, categorized, and displayed in a responsive grid with search and filtering capabilities
2. **Quote Requests**: Customers can request quotes through forms that validate data and store requests in the database
3. **Admin Management**: Authenticated admins can manage products, categories, quotes, and contact messages through a comprehensive dashboard
4. **Real-time Updates**: TanStack Query provides optimistic updates and real-time synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection for Neon PostgreSQL
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI primitives
- **bcryptjs**: Password hashing
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

The application is configured for Replit deployment with:
- **Environment**: Node.js 20 runtime with PostgreSQL 16
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Production**: Serves static files and API from a single Express server
- **Development**: Hot module replacement with Vite dev server
- **Database**: Automatic PostgreSQL provisioning through Replit

### Environment Configuration
- **Development**: `npm run dev` - Runs with hot reload
- **Production**: `npm run build && npm run start` - Optimized build
- **Database**: Migrations managed through Drizzle Kit

## Changelog
```
Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Migration completed from Replit Agent to Replit environment
- June 20, 2025. Added Vercel deployment configuration files
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Language: Indonesian (Bahasa Indonesia)
Prefers clear, step-by-step instructions for deployment configurations.
```