# Design-Engineer Plugin Setup Transcript

**Date**: 2026-03-10
**Project**: DesignFlow -- a project management tool for freelance designers
**User context**: Solo developer, using Figma and Claude Code in the terminal

---

## Step 1: Check Existing Configuration

Checked for `.design-engineer.yaml` in the project root. No existing configuration file was found. Proceeding with fresh setup.

---

## Step 2: Detect Environment

Ran environment detection (equivalent to `scripts/detect-environment.sh`). Checked MCP configurations in `~/.claude/settings.json`, `~/.claude/settings.local.json`, and `.mcp.json`. Also checked available deferred tools for tool availability.

### Detection Results Displayed to User

```
Environment Detection Results
------------------------------
MCPs found:     Context7, Figma MCP, Figma Console, Playwright MCP
MCPs missing:   (none)
Tools:          WebSearch, WebFetch
Tools missing:  AskUserQuestion, Agent
Project:        Git initialized, no existing CLAUDE.md, no deliverables, no source code
Tech stack:     No specific tech stack detected (new project)
```

### MCP Explanations Provided to User

- **Context7** (found): Gives AI access to up-to-date technical documentation so it does not rely on outdated training data. This is one of the two essential MCPs for this workflow.

- **Figma MCP** (found): Provides design data from Figma Dev Mode -- not screenshots, but structured design information adapted to the project's tech stack. This is the second essential MCP for this workflow. Detected via `figma-desktop` and `figma-dev-mode-mcp-server` in available tools.

- **Figma Console MCP** (found): Can perform actions in Figma directly (create components, apply tokens, and styles from prompts). More powerful than the official MCP but trickier to set up. This is an advanced tool -- explore it once comfortable with the basics. Detected via `figma-console` tools in available tools and permissions in `settings.local.json`.

- **Playwright MCP** (found): Enables browser-based testing and a TDD approach. Also allows AI to browse live URLs for visual review. This is also an advanced tool for later. Detected via `playwright` tools in available tools.

**Note to user**: Context7 and Figma MCP are the essential two for the workflow this plugin teaches. Playwright and Figma Console are advanced tools to explore once you are comfortable with the basics. You have all four installed, which is great -- but the workflow will primarily lean on Context7 and Figma MCP.

---

## Step 3: Configuration Questions

Since AskUserQuestion is not available, all questions were presented as numbered lists and answers were collected sequentially.

### Question 1: Project State

```
Project State
What is the current state of your project?

1. Starting from scratch
   New idea, no design or development work done yet
2. Partially done (pre-development)
   Some design deliverables exist (problem statement, research, etc.) but development has not started
3. Partially done (in development)
   Design is mostly complete and development has already begun
4. Existing product
   A live or near-complete product that needs review, audit, or iteration
```

**Simulated user answer**: 1 (Starting from scratch)

**Reasoning**: The user said "new SaaS project" and no source code or deliverables were detected. This means the full pipeline applies -- all skills will be suggested sequentially from Phase 1.

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

**Simulated user answer**: 1 (Guided mode)

**Reasoning**: This is the recommended mode, and a solo designer building a new product benefits from the iterative back-and-forth approach. The step-by-step workflow ensures the user's vision is captured accurately. AI will share suggestions from multiple perspectives, ask 7-10 questions, and iterate until the user approves each deliverable.

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

**Simulated user answer**: 1 (Solo)

**Reasoning**: The user explicitly stated "I'm working solo." This means simpler status tracking and compound docs focused on personal learnings and project context survival across sessions.

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

**Simulated user answer**: 1 (Figma with MCP)

**Reasoning**: The user said they are "using Figma" and the environment detection confirmed Figma MCP is available. Skills that reference designs will use Figma MCP to read design data directly and provide adapted code based on the project's tech stack.

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

**Simulated user answer**: 1 (docs/design/)

**Reasoning**: No reason to deviate from the recommended default for a fresh project. The standard path keeps deliverables organized inside the project folder.

---

### Question 6: Development Environment

(Asked because project state is "Starting from scratch")

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

**Simulated user answer**: 1 (Claude Code in terminal)

**Reasoning**: The user explicitly said "using... Claude Code in the terminal." Development skills will optimize for terminal-based workflows. Agent pipeline will use Claude Code's native sub-agent capabilities.

---

### Question 7: Previous Experience

(Asked because project state is "Starting from scratch")

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

**Simulated user answer**: 2 (Some experience)

**Reasoning**: The user has the design-engineer plugin installed, uses Claude Code, and has Figma MCPs configured -- this indicates familiarity with AI tooling. However, since they are setting up this specific plugin for the first time, "Some experience" provides a balanced level of guidance without being overly basic. Moderate teaching depth: key concepts explained, but basic AI tool usage is assumed known.

---

## Step 4: Scaffold Project Structure

Created the standardized deliverables folder structure at `docs/design/`:

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

**Subdirectory purposes explained to user**:
- **foundation/**: Big Idea, Problem Statement, Target Audience, Assumptions, StoryBrand, Business Plan
- **research/**: Competitor Analysis, User Interview findings, market research
- **design/**: MVP Requirements, Information Architecture, design references, Figma workflow notes, journey maps, B.I.A.S. audits
- **psych/**: Psychology audit results, section-by-section principle applications
- **dev/**: CLAUDE.md draft, kickstart prompts, agent configurations, MCP notes, GitHub workflow
- **solutions/**: Compound documentation -- solved problems, project status, learnings, context files for long-term projects

---

## Step 5: Write Configuration File

Generated `.design-engineer.yaml` in the project root with all collected answers. See the output file for the full YAML content.

---

## Step 6: Initialize Dependency Tracking

Copied the default dependency graph from `assets/dependencies-default.yaml` into `docs/design/.dependencies.yaml`. This file maps every deliverable the plugin produces and tracks:
- Which deliverables depend on which other deliverables
- Current status of each deliverable (all set to `not_started`)
- Last updated timestamp (all set to `null`)

When any deliverable is created or updated, the plugin automatically checks this dependency graph and suggests reviewing affected downstream documents.

---

## Step 7: Confirm Setup

Displayed the following summary to the user:

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
- Run /design to start the full product design pipeline
- Run /research to conduct targeted research
- Run /psych to audit designs with psychology principles
- Run /review to review existing designs or code

Tip: Re-run /setup anytime to reconfigure.
     Edit .design-engineer.yaml directly for manual adjustments.
```

---

## Questions That Would Be Asked Interactively

In a real session, the following 7 questions would be asked sequentially with the user responding to each before proceeding:

1. **Project State** -- "What is the current state of your project?" (4 options)
2. **Mode Preference** -- "How do you prefer to work with AI?" (3 options)
3. **Team Size** -- "Who will be working on this project?" (3 options)
4. **Design Tool Integration** -- "How do you work with design tools?" (4 options)
5. **Deliverables Path** -- "Where should design deliverables be saved?" (2 options)
6. **Development Environment** -- "What development environment do you plan to use?" (4 options, conditional on Q1 answer)
7. **Previous Experience** -- "What is your experience level with AI-assisted development?" (3 options, conditional on Q1 answer)

All questions would be presented as numbered lists (since AskUserQuestion is not available) with the user typing their number choice and the system waiting for a reply before proceeding.

---

## Files Created

| File | Purpose |
|------|---------|
| `.design-engineer.yaml` | Plugin configuration with all user choices |
| `docs/design/foundation/.gitkeep` | Placeholder for foundation deliverables |
| `docs/design/research/.gitkeep` | Placeholder for research deliverables |
| `docs/design/design/.gitkeep` | Placeholder for design deliverables |
| `docs/design/psych/.gitkeep` | Placeholder for psychology audit deliverables |
| `docs/design/dev/.gitkeep` | Placeholder for development deliverables |
| `docs/design/solutions/.gitkeep` | Placeholder for compound documentation |
| `docs/design/.dependencies.yaml` | Full dependency graph initialized from default template |
