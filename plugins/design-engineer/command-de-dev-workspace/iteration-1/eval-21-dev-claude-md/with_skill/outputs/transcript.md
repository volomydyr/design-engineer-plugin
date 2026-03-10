# Dev CLAUDE.md Skill Transcript

**Date**: 2026-03-10
**Prompt**: /de:dev claude-md -- We have a Next.js 14 app with Supabase backend, Tailwind CSS, and shadcn/ui components. The repo has components in src/components, API routes in src/app/api, and design docs in docs/design/.

---

## Step 1: Route to dev-claude-md Skill

Parsed the `/de:dev` command with argument `claude-md`. Identified the `dev-claude-md` skill as the target. This skill handles structured CLAUDE.md generation with source hierarchy, tech stack adaptation, and pipeline rules.

---

## Step 2: Gather Tech Stack Context

Extracted tech stack from the user's prompt and verified against project files:

```
Tech Stack Detection
---------------------
Framework:      Next.js 14 (App Router)
Backend:        Supabase (auth, database, storage)
Styling:        Tailwind CSS
UI Library:     shadcn/ui
Language:       TypeScript (inferred from Next.js 14 + shadcn/ui)
```

Scanned the project structure to confirm:
- `src/components/` -- component directory exists
- `src/app/api/` -- API routes directory exists
- `docs/design/` -- design documentation directory exists
- `package.json` -- confirmed Next.js 14.x, @supabase/supabase-js, tailwindcss, shadcn/ui dependencies

---

## Step 3: Ask About Planning Documents and Existing Code

Presented the following questions to the user:

```
Planning Documents & Existing Code
Which of these exist in your project? (Select all that apply)

1. Design documents (PRDs, specs, requirements)
2. Architecture decision records (ADRs)
3. Figma designs or design system documentation
4. Existing CLAUDE.md or AI instructions
5. API documentation or OpenAPI specs
6. None of the above
```

**Simulated user answer**: 1, 3 (Design documents and Figma designs exist)

**Follow-up question**:

```
Document Locations
Where are these documents located?

1. docs/design/ (detected)
2. docs/ (root docs folder)
3. Other location (please specify)
```

**Simulated user answer**: 1 (docs/design/)

**Reasoning**: The user already mentioned design docs in docs/design/. The skill needs to know what planning artifacts exist so the CLAUDE.md can reference them as authoritative sources in the hierarchy.

---

## Step 4: Guide Source Hierarchy Definition

Explained the source hierarchy concept and asked the user to confirm or customize:

```
Source Hierarchy
The CLAUDE.md uses a source hierarchy to resolve conflicts between different inputs.
Default hierarchy (recommended):

  1. User (highest authority)
     Direct instructions from the developer override everything.

  2. Docs (planning documents, design specs, PRDs)
     Written specifications take precedence over AI assumptions.
     Location: docs/design/

  3. AI (lowest authority)
     AI-generated suggestions and implementations defer to User and Docs.

Do you want to:
1. Use this default hierarchy (recommended)
2. Customize the hierarchy
3. Add additional source levels (e.g., Team Lead, Design System)
```

**Simulated user answer**: 1 (Use default hierarchy)

**Reasoning**: The User > Docs > AI hierarchy is the standard approach. For a team project with design docs, this ensures the developer's direct instructions always win, documented specs are respected, and AI fills in gaps without overriding either.

---

## Step 5: Generate CLAUDE.md

Generated a comprehensive CLAUDE.md with the following sections:

### Sections Included:
1. **Project Overview** -- Next.js 14 app with Supabase, purpose and scope
2. **Tech Stack Specifications** -- Detailed framework, backend, styling, UI library specs
3. **Source Hierarchy** -- User > Docs > AI with conflict resolution rules
4. **Directory Structure** -- Component paths, API routes, design docs locations
5. **Pipeline Rules** -- How to handle the dev pipeline (context-analyzer > plan-creator > backend > frontend > auditor)
6. **Conflict Resolution Protocol** -- Step-by-step protocol when sources disagree
7. **Component Guidelines** -- shadcn/ui patterns, Tailwind conventions, naming
8. **API Route Conventions** -- Supabase client usage, error handling, auth patterns
9. **Design Document References** -- Links to docs/design/ as authoritative source
10. **AI Behavior Rules** -- When to ask vs assume, what to never change without approval

### Conflict Resolution Protocol:

```
When sources conflict, follow this resolution order:

1. Check if the User has given a direct instruction → follow it
2. Check if docs/design/ has a specification → follow the spec
3. Check if existing code establishes a pattern → follow the pattern
4. If none of the above → propose a solution and ask before implementing

Never silently override a documented decision.
Always cite which source level you are following when making a choice.
```

---

## Step 6: Review and Confirm

Presented the generated CLAUDE.md to the user for review:

```
CLAUDE.md Generated
--------------------
Sections:     10 (overview, tech stack, hierarchy, structure, pipeline,
              conflict resolution, components, API, design refs, AI rules)
Tech stack:   Next.js 14, Supabase, Tailwind CSS, shadcn/ui
Hierarchy:    User > Docs > AI
Pipeline:     5-agent pipeline rules included
Design refs:  docs/design/ linked as authoritative source

Review the generated file and let me know if any sections need adjustment.
```

---

## Files Created

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Comprehensive project instructions with source hierarchy and pipeline rules |
| `transcript.md` | This file |
