# Design System Architecture

## Core Principle

A design system should be built in code, not Figma. With AI-assisted development, tokens and components emerge from implementation -- not from upfront planning. You give AI a design frame, develop the first iteration, and then ask it to refactor: separate large files into smaller ones, create reusable components, and extract colors, typography, and spacing into tokens.

This approach ensures every token and component is actually used in your codebase, avoids maintaining two parallel systems (Figma + code), and lets AI handle the mechanical work of consistency enforcement.

---

## Three-Layer Architecture

The design system follows an atomic design pattern with three layers. Each layer builds on the previous one, creating a clear hierarchy from raw values to complete UI components.

### Layer 1: Design Tokens (Base Values)

The foundation layer containing raw values that define the visual identity of the product:

- **Colors** -- hex values, RGB values, opacity levels
- **Spacing** -- point/pixel values for padding, margins, gaps (e.g., spacing10, spacing40, spacing56, spacing64)
- **Typography** -- font sizes, font weights, line heights, letter spacing
- **Border radii** -- corner radius values for different component types
- **Shadows** -- shadow definitions (color, offset, blur, spread)
- **Animation durations** -- timing values for transitions and micro-interactions (e.g., microAnimationDuration at 0.08s, quickAnimationDuration at 0.15s, slowTransition at 0.5s)
- **Icon sizes** -- standardized icon dimensions (e.g., iconSizeSmall at 16, iconSizeMedium at 20, iconSize at 24)
- **Accessibility constants** -- minimum tap target size of 56 points

Example structure:
```
DesignSystem/
├── DesignTokens        # Base values (colors, spacing, typography, accessibility)
```

### Layer 2: Semantic Aliases (Context-Specific)

Meaningful names that reference base tokens. Semantic aliases make intent clear and enable theme changes by updating one mapping.

Instead of using raw values directly:
- `Color(hex: "#007AFF")` becomes `Color.primaryAction`
- `Font.system(size: 16)` becomes `Font.bodyDefault`
- `EdgeInsets(top: 16, leading: 20)` becomes `Semantics.screenHorizontalPadding`

Semantic aliases can be organized by context:
- **Onboarding semantics** -- aliases specific to onboarding flows (colors, spacing, typography)
- **Main app semantics** -- aliases for the primary app experience
- **Shared semantics** -- aliases used across multiple contexts

Example structure:
```
DesignSystem/
├── DesignTokens              # Base values
├── OnboardingSemantics       # Onboarding semantic aliases
├── MainAppSemantics          # Main app semantic aliases
```

### Layer 3: View Components (Reusable UI)

Components that consume semantic aliases -- never raw values. Each component uses only semantic aliases to ensure consistency and enable theming.

Component categories:
- **Button styles** -- primary, secondary, stateful buttons with consistent styling
- **Button container layouts** -- standardized arrangements for button groups
- **Typography components** -- text styles with atomic modifiers
- **Animation configurations** -- reusable animation presets (quickEaseOut, microInteraction, slowTransition)
- **Input components** -- text fields, selectors, toggles
- **Container components** -- cards, sheets, modals

Example structure:
```
DesignSystem/
├── DesignTokens              # Base values
├── OnboardingSemantics       # Onboarding semantic aliases
├── MainAppSemantics          # Main app semantic aliases
├── ButtonStyles              # Universal button styles
├── ButtonContainerStyles     # Button container layouts
├── Typography                # Typography with atomic modifiers
└── Animations                # Animation configurations
```

---

## Incremental Extraction Process

The design system is built incrementally during development, not designed upfront:

### Step 1: Implement First
Build the first iteration from design frames. At this stage, code will contain hardcoded values -- this is expected.

### Step 2: Identify Patterns
After initial implementation, scan for repeated values:
- Colors used in multiple places
- Spacing values that appear frequently
- Typography combinations that repeat
- Animation timings that recur

### Step 3: Extract Tokens
Create base tokens for each identified pattern. Group them logically:
- All color values in one location
- All spacing values together
- All typography definitions centralized

### Step 4: Create Semantic Aliases
Map tokens to meaningful names based on usage context:
- `Color.onboardingTextPrimary` references a base color token
- `Font.onboardingTitle` references base typography tokens
- `Semantics.screenHorizontalPadding` references a base spacing token

### Step 5: Replace Hardcoded Values
Systematically replace all raw values throughout the codebase with semantic aliases:
- Replace `Color(red: 0.86, green: 0.15, blue: 0.15)` with `Color.onboardingAccentRed`
- Replace `.font(.system(size: 16))` with `.font(.onboardingBody)`
- Replace magic numbers with semantic constants

### Step 6: Extract Components
Identify repeated UI patterns and create reusable components:
- Break down views with more than 50 lines into logical subviews
- Extract repeated UI patterns into reusable components
- Ensure each view has a single, clear responsibility
- Maintain proper data flow patterns

---

## Design System Usage Patterns

### Colors
Use semantic color aliases that describe purpose, not appearance:
- `Color.onboardingTextPrimary` -- primary text in onboarding
- `Color.primaryAction` -- interactive elements requiring attention
- Create context-specific semantics files for different app areas

### Typography
Use semantic font aliases:
- `Font.onboardingTitle` -- titles in onboarding screens
- `Font.bodySmall` -- small body text throughout the app
- Semantic aliases can be reused across the entire app

### Spacing
Use semantic spacing constants:
- `Semantics.screenHorizontalPadding` -- horizontal page padding
- Reference base spacing tokens (spacing10, spacing40, spacing56, spacing64)
- Maintain consistent spacing system across all screens

### Components
Use established component patterns:
- Universal button component with variants (primary, secondary, stateful)
- Input field component with modes (editable, tappable)
- Never inline component styling -- always use design system references

### Icons
Use a centralized icon system:
- Store all icons in an asset catalog
- Reference icons through constants, not string literals
- Replace system icons with project-specific icons when available

---

## Architecture Decision: Code-First

The design system lives in code because:

1. **Every token is used** -- no orphaned design tokens that exist only in Figma
2. **Single source of truth** -- the code defines the system, not a parallel Figma library
3. **AI can enforce it** -- AI tools can audit compliance and replace violations automatically
4. **Incremental growth** -- the system grows as the product grows, not as a speculative upfront investment
5. **Refactoring is cheap** -- AI handles the mechanical work of finding and replacing hardcoded values
