# Figma-to-Code Workflow for DesignFlow

## Overview
As a solo designer-developer using Figma and Claude Code, your workflow bridges design and implementation through screenshots, design tokens, and structured specs.

## Setup Steps

### 1. Figma File Organization
Structure your Figma file with these pages:
- **Cover** - Project title, status, links
- **Design System** - Colors, typography, spacing, icons
- **Components** - Reusable component library
- **Screens - Dashboard** - Main dashboard views
- **Screens - Projects** - Project views and flows
- **Screens - Clients** - Client management views
- **Screens - Invoicing** - Invoice creation and management
- **Screens - Settings** - App settings
- **Prototypes** - Interactive prototype frames
- **Archive** - Old/deprecated designs

### 2. Design Tokens Export
Extract design tokens from Figma into JSON:
- Use Figma's built-in variables (if using Variables)
- Or manually define tokens in `design/tokens/`
- Keep tokens in sync between Figma and code

### 3. Screenshot-Based Handoff
Since you're working solo with Claude Code in the terminal:

1. **Take a screenshot** of the Figma frame you want to implement
2. **Save it** to `design/assets/screenshots/[feature]-[screen].png`
3. **Write a spec** in `design/specs/[feature].md` that includes:
   - Reference to the screenshot
   - Key measurements and spacing
   - Interactive behavior notes
   - Component breakdown
4. **Ask Claude Code** to implement the screen, pointing it to the screenshot and spec

### 4. Component-First Approach
Before building full screens:
1. Identify repeated UI patterns in your Figma designs
2. Build primitive components first (Button, Input, Card, etc.)
3. Compose primitives into feature-specific components
4. Assemble screens from components

## Daily Workflow

```
1. Design in Figma
   ↓
2. Screenshot key frames
   ↓
3. Write/update design spec
   ↓
4. Open Claude Code
   ↓
5. Reference spec + screenshot
   ↓
6. Implement components/screens
   ↓
7. Visual comparison with Figma
   ↓
8. Iterate
```

## Tips for Working with Claude Code

### Effective Prompts
- "Look at the screenshot in design/assets/screenshots/dashboard-overview.png and implement this dashboard layout"
- "Build a Card component matching our design system tokens in design/tokens/colors.json"
- "The sidebar navigation should match the Figma design - see design/specs/navigation.md for details"

### Providing Context
- Always point Claude Code to relevant design files
- Include specific measurements when precision matters
- Describe interactive states (hover, active, disabled, loading)
- Mention responsive breakpoints

### Iteration
- Start with layout structure, then refine details
- Do visual comparison after each implementation pass
- Keep a log of design decisions in `docs/design-decisions.md`

## MCP Integration (Optional)
If you have the Figma MCP server configured, you can:
- Pull design data directly from Figma into Claude Code
- Get component properties and styles programmatically
- Automate parts of the design-to-code translation

## Asset Export Checklist
From Figma, export:
- [ ] Icons as SVG to `design/assets/icons/`
- [ ] Illustrations to `design/assets/illustrations/`
- [ ] Screenshots of each major screen to `design/assets/screenshots/`
- [ ] Color palette documentation
- [ ] Typography scale documentation
- [ ] Component inventory with states
