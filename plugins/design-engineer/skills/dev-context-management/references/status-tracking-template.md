# Development Status Tracking Template

Use this template to create a development status file for your project. Place it in a predictable location (e.g., `dev-status/development-context.md` or `status.md` at the project root). AI reads this file at the start of every development task.

This file is separate from CLAUDE.md. CLAUDE.md contains rules and structure. The status file contains the current state of the project -- what is built, what is in progress, what failed. Keeping them separate follows the principle of separation of concerns: smaller, dedicated files work better than one large file because AI may ignore parts of very long documents due to context limits.

---

```markdown
# [Project Name] - Development Status

Last updated: [date]
Updated by: [user or AI agent]

## Project Overview

- **Product**: [Brief description of what the product does]
- **Tech Stack**: [Frontend framework] + [Backend solution] + [Any other key technologies]
- **Current Phase**: [e.g., MVP Development, Post-MVP, Maintenance]

## Completed Features

### [Feature Category 1, e.g., Authentication]
- [Specific feature]: [Status details, e.g., "Google + Apple Sign-In with session persistence"]
- [Specific feature]: [Status details]

### [Feature Category 2, e.g., Core Functionality]
- [Specific feature]: [Status details]
- [Specific feature]: [Status details]

### [Feature Category 3, e.g., UI/UX]
- [Specific feature]: [Status details]
- [Specific feature]: [Status details]

## In Progress

- **[Feature name]**: [Current state, what remains, any blockers]
- **[Feature name]**: [Current state, what remains, any blockers]

## Planned (Not Started)

- **[Feature name]**: [Brief description, priority level]
- **[Feature name]**: [Brief description, priority level]

## Design System Status

### Available Tokens and Styles
- **Colors**: [List semantic color tokens available, e.g., "primaryText, secondaryText, accentRed, backgroundPrimary"]
- **Typography**: [List type styles available, e.g., "headingLarge, bodyRegular, captionSmall"]
- **Spacing**: [List spacing constants, e.g., "screenPadding, cardPadding, sectionGap"]

### Available Components
- **[Component 1]**: [Description, variants, where it is used]
- **[Component 2]**: [Description, variants, where it is used]
- **[Component 3]**: [Description, variants, where it is used]

### Available Assets
- **Icons**: [Count and naming pattern, e.g., "51 icons with icon-tabler_ prefix"]
- **Images**: [Count and types, e.g., "5 profile images, logo, app icon"]

## Architecture Decisions

### [Decision 1, e.g., State Management]
- **Choice**: [What was chosen]
- **Why**: [Brief rationale]
- **Date**: [When decided]

### [Decision 2, e.g., Data Storage]
- **Choice**: [What was chosen]
- **Why**: [Brief rationale]
- **Date**: [When decided]

## Critical Warnings

### [Warning 1, e.g., Deprecated API]
- **Problem**: [What went wrong]
- **Solution**: [What to do instead]
- **Date discovered**: [When]

### [Warning 2]
- **Problem**: [What went wrong]
- **Solution**: [What to do instead]
- **Date discovered**: [When]

## Project Structure

```
/[project-root]
├── [directory]/ # [description] ([file count] files)
├── [directory]/ # [description] ([file count] files)
├── [directory]/ # [description] ([file count] files)
└── [directory]/ # [description] ([file count] files)
```

## Services Inventory

- **[Service 1]** ([line count] lines): [What it does]
- **[Service 2]** ([line count] lines): [What it does]

## Next Session Prompt

[Optional: A brief prompt to start the next development session, including what to work on and any context needed]
```

---

## How to Maintain This File

### When to Update

Update the status file:
- After every feature AI implements
- After any critical bug fix
- Before working on anything unfamiliar
- When the project structure changes
- When new patterns or components are established
- When an approach fails and a warning needs to be recorded

### Who Updates

The AI tool should update this file as part of the development workflow. Add a rule to CLAUDE.md requiring the status file to be updated after completing major features or phases.

However, AI can forget to track status even with rules in place. Nudge AI from time to time by explicitly asking it to update the status file after every big development phase.

### What to Track

Focus on information that prevents repeated mistakes and enables context recovery:
- **Component inventories** prevent AI from recreating existing components
- **Architecture decisions** prevent AI from second-guessing settled choices
- **Critical warnings** prevent AI from repeating failed approaches
- **File counts and line counts** give a sense of project scale and help identify bloated files

### What NOT to Track

Avoid turning the status file into a changelog. It should reflect the current state, not the history of every change. For history, use Git commits.
