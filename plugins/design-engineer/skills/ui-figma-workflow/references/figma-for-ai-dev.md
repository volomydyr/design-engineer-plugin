# Figma for AI-Assisted Development

## Core Principle

With AI-assisted development, Figma becomes a tool for visual direction – not for documenting every possible state. You do not need to design every screen beforehand. Instead, design only 5-8 key screens that establish the visual style, and let AI generate the rest to match.

When you spend days in Figma designing a first iteration, you risk creating a UI that looks great but is technically painful to implement. On the other hand, if AI generates components and provides their code, development becomes relatively easy.

---

## Selecting Key Screens

Design 5-8 screens that serve as building blocks – screens that set up the visual style AI can analyze and reuse for other parts of the app. These screens should cover:

- **One onboarding step** – sets the tone and first impression for the entire app
- **Main home or dashboard screen** – establishes core layout patterns and navigation
- **One detail view** – shows how content is displayed in depth
- **One action screen** – shows the primary user interaction pattern
- **Navigation structure** – bottom tabs, sidebar, or drawer pattern
- **One modal or bottom sheet** – shows overlay and secondary interaction patterns

During development, share these frames along with requirements and architecture documents. AI will develop other screens to match the established UI. For example, if there is only one onboarding page in Figma but the architecture defines many more steps, AI creates the rest of them following the same visual style.

After reviewing the results, some screens will look good while others will have issues. Design corrections only for the frames where AI made mistakes, share them via the chosen integration method, and let AI adjust the code based on the new references. The number of designed screens will grow incrementally – not because you planned them all upfront, but because you corrected AI output where needed.

---

## Auto-Layouts Are Essential

Auto-layouts are the single most important Figma practice for AI handoff. AI needs them to understand how to make code responsive. If you skip auto-layouts and use absolute positioning, AI will not know how elements should behave when screen sizes change.

Every frame shared with AI should use auto-layout for:
- Vertical and horizontal stacking of elements
- Padding and spacing between items
- Resize behavior (fill container, hug contents, fixed)
- Alignment and distribution rules

Without auto-layouts, AI will generate static, non-responsive implementations that require manual corrections for every screen size.

---

## Skip Components and Tokens in Figma

There is no need to name layers properly – Figma now has an AI feature that does it automatically. Do not create components, color tokens, or a separate design system in Figma. A single-page Figma file works fine.

The design system should be built in code, not Figma. AI handles this well: give it a design frame, develop the first iteration, then ask it to refactor – separate large files into smaller ones, create reusable components, extract colors and tokens.

This approach ensures every token and component is actually used in your codebase, avoids maintaining two parallel systems (Figma + code), and lets AI handle the mechanical work of consistency enforcement.

---

## Gathering References Before Designing

Before opening Figma, spend time on platforms like Mobbin looking at apps in your domain to get a sense of common patterns. Nothing complex – just collect references so you are not starting from a blank file.

This prevents blank-canvas paralysis and ensures your designs follow established patterns users already recognize. For standard web and mobile apps with common patterns, AI can do most of the work with proper context and the right design process beforehand.

---

## Design Corrections Workflow

The iterative correction workflow follows this cycle:

1. **Design key screens** – create the initial 5-8 frames in Figma with auto-layouts
2. **Share with AI** – use your chosen integration method (MCP, screenshots, etc.)
3. **AI implements** – generates code matching your visual direction
4. **Review results** – identify screens that need visual corrections
5. **Design corrections** – create new Figma frames only for screens with issues
6. **Share corrections** – let AI adjust the code based on new references
7. **Repeat** – continue until visual quality meets your standards

This cycle means you design incrementally, driven by actual implementation needs rather than speculative upfront planning.

---

## File Organization

Keep Figma organization minimal:

- **Single-page file** – all screens on one page, no complex page structure
- **Logical frame ordering** – arrange frames in a way that reflects user flow
- **Consistent frame sizing** – use the same device frame dimensions across all screens
- **Clear screen labels** – name frames descriptively so AI can reference them (e.g., "Home - Dashboard", "Onboarding - Step 1")

The goal is a file that is easy to navigate and share, not a comprehensive design system document.

---

## What Not to Do in Figma

- **Do not create a full design system** – build it in code instead
- **Do not design every screen** – let AI generate screens from your established patterns
- **Do not use absolute positioning** – always use auto-layouts
- **Do not spend time on layer naming** – Figma AI handles this automatically
- **Do not create interactive prototypes** – use AI-generated web prototypes for testing instead
- **Do not treat Figma as the source of truth** – the code is the source of truth in AI-assisted development
