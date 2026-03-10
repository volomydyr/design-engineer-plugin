# DesignFlow - Recommended Project Folder Structure

```
designflow/
├── .claude/
│   ├── CLAUDE.md                    # Project-level instructions for Claude Code
│   └── settings.json                # Claude Code settings
│
├── design/
│   ├── tokens/
│   │   ├── colors.json              # Design tokens - colors
│   │   ├── typography.json          # Design tokens - typography
│   │   ├── spacing.json             # Design tokens - spacing
│   │   └── index.json               # Combined token export
│   ├── assets/
│   │   ├── icons/                   # SVG icons exported from Figma
│   │   ├── illustrations/           # Illustrations and graphics
│   │   └── screenshots/             # Figma screenshots for reference
│   ├── specs/
│   │   ├── dashboard.md             # Design spec: Dashboard
│   │   ├── projects.md              # Design spec: Projects view
│   │   ├── clients.md               # Design spec: Clients view
│   │   ├── invoicing.md             # Design spec: Invoicing view
│   │   └── settings.md              # Design spec: Settings
│   └── figma-links.md               # Links to Figma files and frames
│
├── src/
│   ├── components/
│   │   ├── primitives/              # Button, Input, Badge, Avatar, etc.
│   │   ├── forms/                   # FormField, Select, DatePicker, etc.
│   │   ├── navigation/              # Sidebar, Breadcrumb, Tabs, etc.
│   │   ├── layout/                  # Container, Grid, Stack, Card, etc.
│   │   ├── feedback/                # Toast, Alert, Spinner, Progress, etc.
│   │   ├── data-display/            # Table, List, Stat, Chart, etc.
│   │   └── overlays/                # Modal, Dropdown, Tooltip, Popover, etc.
│   ├── features/
│   │   ├── dashboard/               # Dashboard feature module
│   │   ├── projects/                # Project management feature
│   │   ├── clients/                 # Client management feature
│   │   ├── invoicing/               # Invoicing feature
│   │   ├── time-tracking/           # Time tracking feature
│   │   └── settings/                # Settings feature
│   ├── layouts/
│   │   ├── AppLayout.tsx            # Main app layout with sidebar
│   │   ├── AuthLayout.tsx           # Auth pages layout
│   │   └── OnboardingLayout.tsx     # Onboarding flow layout
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility functions
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   └── tailwind.config.ts       # Tailwind configuration
│   └── types/                       # TypeScript type definitions
│
├── public/
│   ├── fonts/                       # Self-hosted fonts (Inter, JetBrains Mono)
│   └── images/                      # Public images
│
├── docs/
│   └── design-decisions.md          # Log of design decisions and rationale
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Key Directories Explained

### `design/` - Design-Code Bridge
This is where design artifacts live alongside code. When you export from Figma or take screenshots for Claude Code, they go here. Design tokens in JSON format serve as the single source of truth for your design system values.

### `design/specs/` - Design Specifications
Write markdown specs for each major screen/feature. Include:
- Screenshot or Figma frame link
- Layout description
- Component inventory
- Interaction notes
- Responsive behavior

### `src/components/` - Component Library
Organized by function, not by screen. This makes components reusable across features.

### `src/features/` - Feature Modules
Each feature is self-contained with its own components, hooks, and utilities specific to that feature.
