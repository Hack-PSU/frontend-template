# HackPSU Frontend

A modern, responsive frontend application for HackPSU, built with Next.js and designed to deliver an exceptional user experience for hackathon participants, organizers, and sponsors.

## Project Overview

This is the internal frontend repository for the HackPSU development team. The application serves as the primary interface for Penn State's premier hackathon event, providing comprehensive functionality including user registration, authentication, event information, interactive venue maps, prize tracking, sponsor showcases, and real-time analytics. Built with performance and accessibility in mind, the platform supports thousands of concurrent users during the hackathon event.

## Tech Stack

### Core Framework
- **Next.js** - React framework with App Router for server-side rendering and static site generation
- **React** - Modern React with concurrent features and improved performance
- **TypeScript** - Type-safe development with enhanced developer experience

### Styling & UI Components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Radix UI** - Accessible, unstyled UI primitives for custom component development
- **Material-UI** - React components implementing Google's Material Design
- **Framer Motion** - Production-ready motion library for React animations
- **Lucide React** - Beautiful, consistent icon library

### Authentication & Backend Integration
- **Firebase** - Authentication, real-time database, and cloud functions
- **TanStack Query** - Powerful data synchronization and caching for server state
- **JWT Decode** - JSON Web Token decoding utilities
- **Custom API Client** - Type-safe HTTP client with automatic token management

### Form Handling & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation library
- **React Phone Input** - International phone number input with validation

### Analytics & Monitoring
- **Vercel Analytics** - Performance and user behavior analytics
- **PostHog** - Product analytics and feature flags
- **Google Analytics** - Web traffic and user engagement tracking

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting and style consistency
- **Knip** - Unused dependencies and exports detection
- **Lint-staged** - Pre-commit code quality checks

## Architecture & Design Decisions

### App Router Structure
The application uses Next.js App Router with a carefully designed route structure:
- `(default)` - Public pages accessible without authentication
- `(protected)` - Pages requiring user authentication with automatic redirects
- Dynamic layouts for different sections with shared navigation and providers

### Authentication Strategy
Firebase Authentication provides secure, scalable user management with:
- Custom token handling through a centralized API client
- Automatic token refresh and error handling
- Protected route guards for sensitive areas
- Integration with backend services for user data synchronization

### State Management
- **Server State**: TanStack Query for API data with intelligent caching and background updates
- **Client State**: React hooks and context for UI state management
- **Form State**: React Hook Form for complex form handling with validation

### Styling Architecture
Tailwind CSS with custom design system:
- Custom color palette reflecting HackPSU brand identity
- Responsive design patterns for mobile-first development
- Component-based styling with consistent spacing and typography
- Dark mode support with CSS custom properties

### Performance Optimizations
- Server-side rendering for improved initial load times
- Image optimization with Next.js Image component
- Code splitting and lazy loading for reduced bundle size
- Efficient data fetching with request deduplication

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: use a version manager like nvm or asdf)
- Yarn package manager (preferred) or npm
- Git for version control

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Hack-PSU/frontend-template.git
   cd frontend-template
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_BASE_URL_V3=your_api_base_url
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:3000`.

### Available Scripts
- `yarn dev` - Start development server with hot reloading
- `yarn build` - Create optimized production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint for code quality checks
- `yarn format` - Format code with Prettier
- `yarn knip` - Detect unused dependencies and exports

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (default)/         # Public pages (no authentication required)
│   ├── (protected)/       # Protected pages (authentication required)
│   └── layout.tsx         # Root layout with providers and metadata
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── common/           # Shared business logic components
├── lib/                  # Utility functions and configurations
│   ├── api/             # API client and data fetching hooks
│   ├── config/          # Environment and Firebase configuration
│   ├── hooks/           # Custom React hooks
│   └── providers/       # React context providers
└── styles/              # Global CSS and Tailwind configuration
```

## Key Features

### User Management
- Secure authentication with Firebase
- User profile management and data persistence
- Role-based access control for different user types

### Event Information
- Dynamic content management for hackathon details
- Interactive schedule with real-time updates
- Venue maps with location-based features

### Registration System
- Multi-step registration process with validation
- Travel reimbursement request handling
- Application status tracking and notifications

### Interactive Components
- Prize tracking and challenge submissions
- Sponsor showcase with engagement metrics
- Custom interactive activities (varies by event cycle)

## Deployment

The application is optimized for deployment on Vercel with automatic builds and deployments from the main branch. The production build includes:
- Static site generation for public pages
- Server-side rendering for dynamic content
- Automatic image optimization and CDN integration
- Performance monitoring and analytics

## Contributing

This project follows established coding standards and best practices:
- TypeScript for type safety and developer experience
- ESLint and Prettier for consistent code style
- Component-based architecture with clear separation of concerns
- Comprehensive error handling and user feedback
- Accessibility considerations following WCAG guidelines

When contributing, ensure all code passes linting, includes appropriate TypeScript types, and follows the existing architectural patterns.
