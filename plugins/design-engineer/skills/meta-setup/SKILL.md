---
name: meta-setup
description: "Runs interactive one-time plugin setup. Detects environment, asks configuration questions, scaffolds deliverable folders, and initializes dependency tracking. Use when starting a new project or configuring the design-engineer plugin for the first time."
disable-model-invocation: true
---

# Design-Engineer Plugin Setup

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding to the next step. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-configure without explicit user consent.

---

## Step 1: Check Existing Configuration

Look for `.design-engineer.yaml` in the project root. If it exists, display the current settings summary and ask:

```
question: "A configuration file already exists. What would you like to do?"
header: "Existing Config Detected"
options:
  - label: "Reconfigure"
    description: "Run the interactive setup again from scratch"
  - label: "View current"
    description: "Show the current configuration, then stop"
  - label: "Cancel"
    description: "Keep current settings"
```

If "View current": read and display the file, then stop.
If "Cancel": stop.

---

## Step 2: Detect Environment

Run `scripts/detect-environment.sh` from this skill's directory. This script checks for:

- **Installed MCPs**: Context7, Figma MCP (official), Figma Console MCP, Playwright MCP
- **Available tools**: AskUserQuestion, WebSearch, WebFetch, Agent tool
- **Project state**: existing code, existing docs/design/ folder, existing CLAUDE.md, git initialization

Display the detection results to the user in a clear summary:

```
Environment Detection Results
─────────────────────────────
MCPs found:     Context7, Figma MCP
MCPs missing:   Playwright MCP, Figma Console MCP
Tools:          AskUserQuestion, WebSearch, Agent
Project:        Git initialized, no existing deliverables
```

Explain briefly what each detected (or missing) MCP does, following this guidance:

- **Context7**: Gives AI access to up-to-date technical documentation so it does not rely on outdated training data.
- **Figma MCP** (official): Provides design data from Figma Dev Mode – not screenshots, but structured design information adapted to the project's tech stack.
- **Figma Console MCP**: Can perform actions in Figma directly (create components, apply tokens, and styles from prompts). More powerful than the official MCP but trickier to set up.
- **Playwright MCP**: Enables browser-based testing and a TDD approach. Also allows AI to browse live URLs for visual review.

Do not recommend installing everything. Explain that Context7 and Figma MCP are the essential two for the workflow this plugin teaches. Playwright and Figma Console are advanced tools to explore once the user is comfortable with the basics.

---

## Step 3: Ask Configuration Questions

Ask the following 5-7 questions sequentially. Each answer shapes the plugin configuration.

### Question 1: Project State

```
question: "What is the current state of your project?"
header: "Project State"
options:
  - label: "Starting from scratch"
    description: "New idea, no design or development work done yet"
  - label: "Partially done (pre-development)"
    description: "Some design deliverables exist (problem statement, research, etc.) but development has not started"
  - label: "Partially done (in development)"
    description: "Design is mostly complete and development has already begun"
  - label: "Existing product"
    description: "A live or near-complete product that needs review, audit, or iteration"
```

This determines skip logic: the orchestrator will know which skills to suggest and which deliverables may already exist. For "Starting from scratch" – the full pipeline applies. For other states, the orchestrator proactively detects existing deliverables and asks which to skip.

### Question 2: Mode Preference

```
question: "How do you prefer to work with AI?"
header: "Interaction Mode"
options:
  - label: "Guided mode (Recommended)"
    description: "Step-by-step with questions, suggestions from multiple perspectives, and approval at every stage"
  - label: "God mode"
    description: "Fully autonomous – provide context and let AI run the entire pipeline end-to-end with minimal input"
  - label: "Both / decide later"
    description: "Choose the mode each time you run a command"
```

Guided mode: AI shares brief suggestions from multiple perspectives first, asks 7-10 questions using AskUserQuestion, then iterates back-and-forth until the user approves the deliverable. God mode: AI runs the full pipeline autonomously with minimal user input, pausing only at major checkpoints.

### Question 3: Team Size

```
question: "Who will be working on this project?"
header: "Team"
options:
  - label: "Solo"
    description: "Just you – all design and development"
  - label: "Small team (2-5)"
    description: "A few collaborators sharing context"
  - label: "Larger team (5+)"
    description: "Multiple people with distinct roles"
```

This affects context management strategy. Solo projects can use simpler status tracking. Team projects need more structured handoff documentation and compound steps.

### Question 4: Design Tool Integration

```
question: "How do you work with design tools?"
header: "Design Integration"
options:
  - label: "Figma with MCP"
    description: "Use Figma MCP to share design data directly with AI"
  - label: "Figma without MCP"
    description: "Manually share screenshots or export design specs"
  - label: "Other design tool"
    description: "Sketch, Adobe XD, or another tool"
  - label: "No design tool yet"
    description: "Will decide later or skip design tooling"
```

### Question 5: Deliverables Path

```
question: "Where should design deliverables be saved?"
header: "Deliverables Location"
options:
  - label: "docs/design/ (Recommended)"
    description: "Standard path inside your project folder with organized subdirectories"
  - label: "Custom path"
    description: "Specify your own directory path"
```

If "Custom path" is selected, ask a follow-up question for the exact path. Default is `docs/design/` inside the project root.

### Question 6: Development Environment (conditional)

Only ask this if the project state is "Starting from scratch" or "Partially done (pre-development)":

```
question: "What development environment do you plan to use?"
header: "Dev Environment"
options:
  - label: "Claude Code in terminal"
    description: "Using Claude Code directly in the terminal"
  - label: "Claude Code inside Cursor"
    description: "Running Claude Code in Cursor's integrated terminal"
  - label: "Cursor only"
    description: "Using Cursor IDE with its built-in AI features"
  - label: "Other / not sure yet"
    description: "Different IDE or undecided"
```

### Question 7: Previous Experience (conditional)

Only ask this if the project state is "Starting from scratch":

```
question: "What is your experience level with AI-assisted development?"
header: "Experience"
options:
  - label: "New to AI development"
    description: "First time using AI tools for building products – enable extra teaching and explanations"
  - label: "Some experience"
    description: "Have used AI tools before but not extensively"
  - label: "Experienced"
    description: "Comfortable with AI-assisted workflows – skip basic explanations"
```

This controls inline teaching depth. New users get more educational context woven into each skill. Experienced users get streamlined output.

---

## Step 4: Scaffold Project Structure

Run `scripts/init-project-structure.sh` with the deliverables path from Question 5.

This creates the standardized folder structure. See [setup-checklist.md](./references/setup-checklist.md) for the full configuration reference.

The script creates:

```
{deliverables_path}/
├── foundation/          # Core product definition deliverables
│   ├── .gitkeep
├── research/            # Research findings and competitive analysis
│   ├── .gitkeep
├── design/              # Design-specific deliverables (IA, flows, references)
│   ├── .gitkeep
├── psych/               # Psychology audit results and principle applications
│   ├── .gitkeep
├── dev/                 # Development preparation deliverables
│   ├── .gitkeep
├── solutions/           # Compound documentation (solved problems, learnings, status)
│   ├── .gitkeep
└── .dependencies.yaml   # Dependency graph tracking all deliverables
```

The `.dependencies.yaml` file is initialized from the default template. See [dependencies-default.yaml](./assets/dependencies-default.yaml) for the full dependency graph.

**Subdirectory purposes:**

- **foundation/**: Big Idea, Problem Statement, Target Audience, Assumptions, StoryBrand, Business Plan
- **research/**: Competitor Analysis, User Interview findings, market research
- **design/**: MVP Requirements, Information Architecture, design references, Figma workflow notes, journey maps, B.I.A.S. audits
- **psych/**: Psychology audit results, section-by-section principle applications
- **dev/**: CLAUDE.md draft, kickstart prompts, agent configurations, MCP notes, GitHub workflow
- **solutions/**: Compound documentation – solved problems, project status, learnings, context files for long-term projects

---

## Step 5: Write Configuration File

Generate `.design-engineer.yaml` in the project root with all collected answers:

```yaml
# Design-Engineer Plugin Configuration
# Generated by /setup on {current_date}

project:
  state: "{answer_from_q1}"
  mode: "{answer_from_q2}"
  team_size: "{answer_from_q3}"
  design_tool: "{answer_from_q4}"
  deliverables_path: "{answer_from_q5}"
  dev_environment: "{answer_from_q6_or_null}"
  experience_level: "{answer_from_q7_or_null}"

environment:
  mcps:
    context7: {true/false}
    figma_mcp: {true/false}
    figma_console: {true/false}
    playwright: {true/false}
  tools:
    ask_user_question: {true/false}
    web_search: {true/false}
    web_fetch: {true/false}
    agent: {true/false}

dependencies:
  tracking_file: "{deliverables_path}/.dependencies.yaml"
  auto_suggest: true
```

---

## Step 6: Initialize Dependency Tracking

Copy the default dependency graph from [dependencies-default.yaml](./assets/dependencies-default.yaml) into `{deliverables_path}/.dependencies.yaml`.

This file maps every deliverable the plugin produces and tracks:
- Which deliverables depend on which other deliverables
- Current status of each deliverable (not_started, in_progress, complete)
- Last updated timestamp

When any deliverable is created or updated, the plugin automatically checks this dependency graph and suggests reviewing affected downstream documents. This is critical because deliverables are living documents that get updated regularly – and users often forget that changes to one document affect others.

---

## Step 7: Confirm Setup

Display a summary of everything configured:

```
Setup Complete
──────────────
Project state:    {state}
Mode:             {mode}
Team:             {team_size}
Design tool:      {design_tool}
Deliverables:     {deliverables_path}
MCPs detected:    {list}
Config saved:     .design-engineer.yaml
Dependencies:     {deliverables_path}/.dependencies.yaml

Next steps:
- Run /design to start the full product design pipeline
- Run /research to conduct targeted research
- Run /psych to audit designs with psychology principles
- Run /review to review existing designs or code

Tip: Re-run /setup anytime to reconfigure.
     Edit .design-engineer.yaml directly for manual adjustments.
```

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:
1. **User decisions** always override everything – if the user wants a non-standard path or skips a question, respect that.
2. **Documentation and detected environment** inform smart defaults.
3. **AI suggestions** fill gaps only when user and docs provide no guidance.

---

## Resource Files

- [setup-checklist.md](./references/setup-checklist.md) – Full reference of all configuration options and their effects
- [dependencies-default.yaml](./assets/dependencies-default.yaml) – Default dependency graph for all plugin deliverables
- [detect-environment.sh](./scripts/detect-environment.sh) – Environment detection script
- [init-project-structure.sh](./scripts/init-project-structure.sh) – Project structure scaffolding script
