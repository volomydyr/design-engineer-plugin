# DesignFlow — Project Instructions for Claude Code

## Project Overview

Next.js 14 application with Supabase backend. Tailwind CSS for styling with shadcn/ui component library. TypeScript throughout.

## Source Hierarchy

When sources conflict, this is the authority order:

1. **User** (highest) — Direct developer instructions override everything
2. **Docs** (middle) — Specifications in `docs/design/` override AI assumptions
3. **AI** (lowest) — AI-generated suggestions defer to User and Docs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase (auth, database, real-time, storage)
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui
- **Language**: TypeScript

## Directory Structure

```
src/
├── app/
│   ├── api/          # API routes (Route Handlers)
│   ├── (auth)/       # Auth-related pages
│   └── (dashboard)/  # Main app pages
├── components/       # Shared UI components
│   ├── ui/           # shadcn/ui primitives
│   └── [feature]/    # Feature-specific components
├── lib/              # Utilities, Supabase client, helpers
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions

docs/
└── design/           # Authoritative design documents (Source Level 2)
```

## Pipeline Rules

The dev pipeline executes agents in this order:
1. **context-analyzer** — Reads CLAUDE.md, design docs, existing code
2. **plan-creator** — Produces implementation plan, waits for user approval
3. **backend-implementer** — Implements API routes, database schema, Supabase logic
4. **frontend-implementer** — Implements UI components, pages, client-side logic
5. **design-system-auditor** — Verifies implementation matches design system

Each agent reads this CLAUDE.md before starting. Never skip the plan approval step.

## Conflict Resolution Protocol

When sources conflict, follow this resolution order:

1. Check if the User has given a direct instruction — follow it
2. Check if docs/design/ has a specification — follow the spec
3. Check if existing code establishes a pattern — follow the pattern
4. If none of the above — propose a solution and ask before implementing

Never silently override a documented decision.
Always cite which source level you are following when making a choice.

## Component Guidelines

- Use shadcn/ui components as the base layer
- Extend with Tailwind utility classes, not custom CSS
- Component files: `src/components/ComponentName.tsx`
- Use composition over configuration
- All interactive elements must be keyboard accessible
- Follow shadcn/ui naming conventions (e.g., `Button`, `Card`, `Dialog`)

## API Route Conventions

- Route Handlers in `src/app/api/[resource]/route.ts`
- Use `createRouteHandlerClient` from `@supabase/auth-helpers-nextjs`
- Always validate request body with Zod schemas
- Return consistent error format: `{ error: string, code: string }`
- Check auth on every protected route

## Design Document References

- All design specifications live in `docs/design/`
- These documents are Source Level 2 (Docs) in the hierarchy
- When implementing a feature, always check docs/design/ first
- If a design doc exists for the feature, follow it exactly
- If no design doc exists, ask the user before making design decisions

## AI Behavior Rules

### Always Ask Before:
- Changing database schema
- Modifying auth flow
- Removing existing functionality
- Changing API response shapes

### Never:
- Override a documented design decision without user approval
- Assume a tech stack choice (confirm from package.json)
- Skip the plan approval step in the pipeline
- Create files outside the established directory structure
