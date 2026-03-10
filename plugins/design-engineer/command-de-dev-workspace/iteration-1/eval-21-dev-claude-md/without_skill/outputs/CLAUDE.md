# Project Instructions

## Overview
Next.js 14 application with Supabase backend, styled with Tailwind CSS and shadcn/ui components.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Directory Structure
- `src/components/` — Shared UI components
- `src/app/api/` — API route handlers
- `docs/design/` — Design documentation

## Code Style
- Use TypeScript for all files
- Functional components with hooks
- Use shadcn/ui components where possible
- Tailwind utility classes for styling
- Named exports preferred

## Component Guidelines
- Place shared components in `src/components/`
- Use shadcn/ui as the base component layer
- Keep components focused and single-responsibility
- All components should be accessible

## API Routes
- Route handlers in `src/app/api/`
- Use Supabase client for database operations
- Validate inputs before processing
- Return JSON responses with appropriate status codes
