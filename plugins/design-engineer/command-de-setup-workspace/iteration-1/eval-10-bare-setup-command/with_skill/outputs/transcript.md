# Design-Engineer Plugin Setup -- Transcript

**Command:** `/de:setup`
**Date:** 2026-03-10
**Context:** User typed only the command with no additional context.

---

## Step 1: Load Meta-Setup Skill

Recognized `/de:setup` as the setup command. Loaded the meta-setup skill from `skills/meta-setup/SKILL.md`.

**Result:** Skill loaded successfully. Proceeding with setup flow.

---

## Step 2: Check Existing Configuration

Checked for `.design-engineer.yaml` in the project root.

**Result:** No existing configuration file found. Proceeding with fresh setup.

---

## Step 3: Detect Environment

Ran environment detection (from `scripts/detect-environment.sh` logic and available tool inventory).

### Detection Results

```
Environment Detection Results
------------------------------
MCPs found:     Context7, Figma MCP (desktop + dev mode), Figma Console, Playwright MCP
MCPs missing:   (none)
Tools:          WebSearch, WebFetch
Tools missing:  AskUserQuestion, Agent
Project:        Not a git repo, no existing deliverables, no CLAUDE.md, no source code detected
Tech stack:     No specific tech stack detected
```

### MCP Explanations Presented to User

> **Context7** -- Gives AI access to up-to-date technical documentation so it does not rely on outdated training data.
>
> **Figma MCP (official/desktop)** -- Provides design data from Figma Dev Mode. Not screenshots, but structured design information adapted to the project's tech stack.
>
> **Figma Console MCP** -- Can perform actions in Figma directly (create components, apply tokens, and styles from prompts).
>
> **Playwright MCP** -- Enables browser-based testing and a TDD approach. Also allows AI to browse live URLs for visual review.
>
> **Recommendation:** All four MCPs are installed. You are fully set up for the design-engineer workflow.

---

## Step 4: Configuration Questions

Since `AskUserQuestion` is NOT available in this environment, all questions are presented as numbered lists, waiting for a reply before proceeding.

### Question 1: Project State

```
Project State
What is the current state of your project?

1. Starting from scratch
   New idea, no design or development work done yet
2. Partially done (pre-development)
   Some design deliverables exist but development has not started
3. Partially done (in development)
   Design is mostly complete and development has already begun
4. Existing product
   A live or near-complete product that needs review, audit, or iteration
```

**Simulated answer:** 1 (Starting from scratch)

### Question 2: Mode Preference

```
Interaction Mode
How do you prefer to work with AI?

1. Guided mode (Recommended)
   Step-by-step with questions, suggestions from multiple perspectives, and approval at every stage
2. God mode
   Fully autonomous -- provide context and let AI run the entire pipeline end-to-end with minimal input
3. Both / decide later
   Choose the mode each time you run a command
```

**Simulated answer:** 1 (Guided mode)

### Question 3: Team Size

```
Team
Who will be working on this project?

1. Solo
   Just you -- all design and development
2. Small team (2-5)
   A few collaborators sharing context
3. Larger team (5+)
   Multiple people with distinct roles
```

**Simulated answer:** 1 (Solo)

### Question 4: Design Tool Integration

```
Design Integration
How do you work with design tools?

1. Figma with MCP
   Use Figma MCP to share design data directly with AI
2. Figma without MCP
   Manually share screenshots or export design specs
3. Other design tool
   Sketch, Adobe XD, or another tool
4. No design tool yet
   Will decide later or skip design tooling
```

**Simulated answer:** 1 (Figma with MCP)

### Question 5: Deliverables Path

```
Deliverables Location
Where should design deliverables be saved?

1. docs/design/ (Recommended)
   Standard path inside your project folder with organized subdirectories
2. Custom path
   Specify your own directory path
```

**Simulated answer:** 1 (docs/design/)

### Question 6: Development Environment

```
Dev Environment
What development environment do you plan to use?

1. Claude Code in terminal
   Using Claude Code directly in the terminal
2. Claude Code inside Cursor
   Running Claude Code in Cursor's integrated terminal
3. Cursor only
   Using Cursor IDE with its built-in AI features
4. Other / not sure yet
   Different IDE or undecided
```

**Simulated answer:** 1 (Claude Code in terminal)

### Question 7: Previous Experience

```
Experience
What is your experience level with AI-assisted development?

1. New to AI development
   First time using AI tools for building products -- enable extra teaching and explanations
2. Some experience
   Have used AI tools before but not extensively
3. Experienced
   Comfortable with AI-assisted workflows -- skip basic explanations
```

**Simulated answer:** 2 (Some experience)

---

## Step 5: Scaffold Project Structure

Created the standardized folder structure at `docs/design/`:

```
docs/design/
├── foundation/          # Core product definition deliverables
│   └── .gitkeep
├── research/            # Research findings and competitive analysis
│   └── .gitkeep
├── design/              # Design-specific deliverables (IA, flows, references)
│   └── .gitkeep
├── psych/               # Psychology audit results and principle applications
│   └── .gitkeep
├── dev/                 # Development preparation deliverables
│   └── .gitkeep
├── solutions/           # Compound documentation (solved problems, learnings, status)
│   └── .gitkeep
└── .dependencies.yaml   # Dependency graph tracking all deliverables
```

---

## Step 6: Write Configuration File

Generated `.design-engineer.yaml` in the project root with all collected answers and detected environment.

---

## Step 7: Initialize Dependency Tracking

Copied the default dependency graph from `assets/dependencies-default.yaml` into `docs/design/.dependencies.yaml`. This file maps all 28 deliverables the plugin produces, tracking status, dependencies, pipeline phase, and producing skill.

---

## Step 8: Confirm Setup

```
Setup Complete
--------------
Project state:    Starting from scratch
Mode:             Guided mode
Team:             Solo
Design tool:      Figma with MCP
Deliverables:     docs/design/
Dev environment:  Claude Code in terminal
Experience:       Some experience
MCPs detected:    Context7, Figma MCP, Figma Console, Playwright MCP
Config saved:     .design-engineer.yaml
Dependencies:     docs/design/.dependencies.yaml

Next steps:
- Run /de:design to start the full product design pipeline
- Run /de:research to conduct targeted research
- Run /de:psych to audit designs with psychology principles
- Run /de:review to review existing designs or code

Tip: Re-run /de:setup anytime to reconfigure.
     Edit .design-engineer.yaml directly for manual adjustments.
```

---

## Files Created

| File | Purpose |
|------|---------|
| `.design-engineer.yaml` | Plugin configuration with all user answers and detected environment |
| `docs/design/foundation/.gitkeep` | Placeholder for foundation deliverables |
| `docs/design/research/.gitkeep` | Placeholder for research deliverables |
| `docs/design/design/.gitkeep` | Placeholder for design deliverables |
| `docs/design/psych/.gitkeep` | Placeholder for psychology audit deliverables |
| `docs/design/dev/.gitkeep` | Placeholder for development preparation deliverables |
| `docs/design/solutions/.gitkeep` | Placeholder for compound documentation |
| `docs/design/.dependencies.yaml` | Full dependency graph with 28 deliverables, all initialized to `not_started` |
