# Design-Engineer Plugin Setup -- Transcript

**Command:** `/de:setup`
**Date:** 2026-03-10
**Context:** User typed only the command with no additional context.

---

## Step 1: Check Existing Configuration

Checked for `.design-engineer.yaml` in the project root.

**Result:** No existing configuration file found. Proceeding with fresh setup.

---

## Step 2: Detect Environment

Ran environment detection (simulated from `scripts/detect-environment.sh` logic and available tool inventory).

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

I would display the following to the user:

> **Context7** -- Gives AI access to up-to-date technical documentation so it does not rely on outdated training data.
>
> **Figma MCP (official/desktop)** -- Provides design data from Figma Dev Mode. Not screenshots, but structured design information adapted to the project's tech stack. You have both the desktop and dev mode server variants installed.
>
> **Figma Console MCP** -- Can perform actions in Figma directly (create components, apply tokens, and styles from prompts). More powerful than the official MCP but trickier to set up.
>
> **Playwright MCP** -- Enables browser-based testing and a TDD approach. Also allows AI to browse live URLs for visual review.
>
> **Recommendation:** Context7 and Figma MCP are the essential two for this workflow. Playwright and Figma Console are advanced tools -- explore them once you are comfortable with the basics. That said, all four are already installed in your environment, so you are fully set up.

---

## Step 3: Configuration Questions

Since `AskUserQuestion` is NOT available in this environment, all questions would be presented as numbered lists, waiting for a reply before proceeding. Below are the questions as they would be presented, along with the simulated answers chosen for a generic web app project.

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

**Rationale for simulation:** No source code detected, no deliverables folder, no git repo -- all signals point to a brand new project. This is the most reasonable default for a bare `/de:setup` command.

---

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

**Rationale for simulation:** The skill marks "Guided mode" as recommended, and for a new project it provides the most structured onboarding experience.

---

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

**Rationale for simulation:** No additional context was provided, and a solo developer using Claude Code on a new project is the most common scenario for this plugin.

---

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

**Rationale for simulation:** Environment detection confirmed both Figma MCP (desktop + dev mode) and Figma Console MCP are installed. The user is fully equipped for Figma MCP integration.

---

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

**Rationale for simulation:** Default recommended path, no reason to deviate without user input.

---

### Question 6: Development Environment

This question is asked because project state is "Starting from scratch."

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

**Rationale for simulation:** The user is running this as a Claude Code plugin, which implies they are using Claude Code. Terminal is the default environment.

---

### Question 7: Previous Experience

This question is asked because project state is "Starting from scratch."

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

**Rationale for simulation:** The user has the design-engineer plugin installed with multiple MCPs configured, suggesting familiarity with AI tools, but no strong signal of expert-level experience.

---

## Step 4: Scaffold Project Structure

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

## Step 5: Write Configuration File

Generated `.design-engineer.yaml` in the project root with all collected answers. See the output file for the full contents.

---

## Step 6: Initialize Dependency Tracking

Copied the default dependency graph from `assets/dependencies-default.yaml` into `docs/design/.dependencies.yaml`. This file maps all 28 deliverables the plugin produces, tracking:

- Status of each deliverable (all initialized to `not_started`)
- Dependency relationships between deliverables
- Which downstream documents need review when an upstream document changes
- Pipeline phase for each deliverable
- Which skill produces each deliverable

---

## Step 7: Confirm Setup

The following summary would be displayed to the user:

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

## Questions That Would Be Asked

In a real interactive session, the following 7 questions would be asked sequentially, each waiting for the user's response before proceeding:

1. **Project State** -- "What is the current state of your project?" (4 options)
2. **Interaction Mode** -- "How do you prefer to work with AI?" (3 options)
3. **Team Size** -- "Who will be working on this project?" (3 options)
4. **Design Integration** -- "How do you work with design tools?" (4 options)
5. **Deliverables Path** -- "Where should design deliverables be saved?" (2 options, with follow-up if custom)
6. **Dev Environment** -- "What development environment do you plan to use?" (4 options) -- conditional on project state
7. **Experience Level** -- "What is your experience level with AI-assisted development?" (3 options) -- conditional on project state

Questions 6 and 7 are conditional:
- Question 6 is only asked if project state is "Starting from scratch" or "Partially done (pre-development)"
- Question 7 is only asked if project state is "Starting from scratch"

Since `AskUserQuestion` was not detected in the environment, all questions would use the numbered-list fallback format, accepting a number as the response for single-select questions.

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
