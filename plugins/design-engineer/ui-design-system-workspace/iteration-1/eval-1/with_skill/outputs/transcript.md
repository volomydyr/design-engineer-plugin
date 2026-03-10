# Eval 98 — With Skill Transcript

**Prompt:** We've been building our Next.js app for 3 months and have 40+ components but no design system. Colors are hardcoded everywhere, spacing is inconsistent, and every developer uses different patterns. Help me set up a proper code-first design system.

**Step 1:** Skill activates design system creation mode. Starts with component inventory — categorizes 40+ components by atomic level (atoms, molecules, organisms).

**Step 2:** Runs token extraction methodology: scans for hardcoded hex colors (finds 23 unique values, deduplicates to 12 canonical colors), spacing values (8 unique px values), font declarations (4 font stacks).

**Step 3:** Identifies pattern inconsistencies: 6 different button variants with no shared base, 3 card implementations with different padding, 2 competing color palettes.

**Step 4:** Establishes token naming conventions: color-{semantic}-{variant}, spacing-{size}, font-{role}-{property}. Maps extracted values to named tokens.

**Step 5:** Defines atomic structure: 8 atoms (Button, Input, Badge, Icon, Typography, Spacer, Divider, Avatar), 12 molecules, 6 organisms. Flags missing atoms.

**Step 6:** Creates phased refactoring plan: Phase 1 — tokens file + CSS variables (1 day), Phase 2 — high-usage components (3 days), Phase 3 — remaining components (5 days).

**Step 7:** Produces design-system-setup.md deliverable with full token definitions, component inventory, naming conventions, and migration plan.

**Result:** Complete code-first design system setup with component audit, token extraction, atomic structure, naming conventions, and phased refactoring plan.
