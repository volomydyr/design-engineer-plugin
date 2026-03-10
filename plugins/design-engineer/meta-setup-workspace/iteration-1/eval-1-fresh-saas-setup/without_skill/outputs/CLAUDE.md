# DesignFlow - Claude Code Project Instructions

## Project Overview
DesignFlow is a SaaS project management tool for freelance designers. Solo developer project.

## Tech Stack
- **Framework**: React (Next.js or Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Design Tool**: Figma
- **Fonts**: Inter (UI), JetBrains Mono (code/data)

## Design System
- Design tokens are defined in `design/tokens/`
- Use Tailwind CSS utility classes aligned with the design token values
- Primary color: Indigo (`#6366F1` base)
- Border radius: Default to `rounded-lg` (0.5rem) for cards, `rounded-md` for inputs/buttons
- Spacing: Use 4px base unit, Tailwind's default scale

## Component Guidelines
- Components live in `src/components/` organized by category (primitives, forms, navigation, layout, feedback, data-display, overlays)
- Each component gets its own file: `ComponentName.tsx`
- Export all components from category index files
- Use composition over configuration (prefer children/slots over excessive props)
- All interactive components must be keyboard accessible

## Design-to-Code Workflow
1. Design screens in Figma
2. Take screenshots or export assets to `design/assets/`
3. Write design specs in `design/specs/` for complex screens
4. Use Claude Code to implement, referencing screenshots and specs
5. Compare implementation with Figma design visually

## When Implementing Designs
- Match Figma designs pixel-for-pixel where possible
- Use the exact color tokens from the design system
- Preserve spacing ratios from the design
- If a design element is ambiguous, note it and implement the most reasonable interpretation
- Always implement responsive behavior (mobile-first)

## Code Style
- Use functional components with hooks
- Prefer named exports
- Use descriptive variable names
- Keep components focused and single-responsibility
- Extract repeated patterns into shared components

## File Organization
- Feature code goes in `src/features/[feature-name]/`
- Shared components in `src/components/`
- Hooks in `src/hooks/`
- Types in `src/types/`
- Utilities in `src/lib/`
