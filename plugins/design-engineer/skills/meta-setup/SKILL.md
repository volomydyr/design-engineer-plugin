---
name: meta-setup
description: "Smart entry point for the design-engineer plugin. Detects project state and routes to the right flow: new projects get full setup, returning projects resume where they left off, existing projects get a capability guide. Use as the first command for any project."
disable-model-invocation: true
model: sonnet
---

# Design-Engineer Plugin Setup

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding to the next step. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-configure without explicit user consent.

---

## Step 1: Detect Project State

Check for `.design-engineer.yaml` in the project root.

### Path A: Returning Project (config file exists)

Read `.design-engineer.yaml`. Check if it contains a `resume:` section (written by the session hook when a previous session ended with work in progress).

**If resume state exists**, show the current state:

```
Welcome back. Here's where you are:

Phase:           {phase_name}
Last completed:  {last_completed_skill}
Next:            {next_skill}
Deliverables:    {count} created, {stale_count} may need review
```

Then ask:

```
question: "How would you like to proceed?"
header: "Resume"
options:
  - label: "Continue where I left off"
    description: "Resume with {next_skill} in the same mode"
  - label: "Jump to a different phase"
    description: "Choose which phase or skill to work on"
  - label: "Browse all capabilities"
    description: "See everything this plugin can do"
  - label: "Reconfigure"
    description: "Re-run the setup from scratch"
```

If "Continue" or "Jump": hand off to `meta-orchestrator` with the appropriate context.
If "Browse": proceed to **Step 6: Capability Guide** below.
If "Reconfigure": proceed to Step 2.

**If no resume state** (config exists but no active pipeline), show the saved config summary and ask:

```
question: "What would you like to do?"
header: "Existing Config"
options:
  - label: "Start the design pipeline"
    description: "Run /de:design to begin or continue the full workflow"
  - label: "Browse all capabilities"
    description: "See everything this plugin can do"
  - label: "Reconfigure"
    description: "Re-run the setup from scratch"
```

If "Start": suggest running `/de:design`.
If "Browse": proceed to **Step 6: Capability Guide**.
If "Reconfigure": proceed to Step 2.

### Path B: New to Plugin (no config file)

Ask:

```
question: "Welcome to Design Engineer. What brings you here?"
header: "Project Type"
options:
  - label: "New product idea"
    description: "Starting from scratch — I have an idea or a problem I want to solve"
  - label: "Existing project"
    description: "I already have a product, codebase, or designs — I want to improve, review, or add features"
```

If "New product idea": proceed to **Step 2: Environment Detection** (full setup flow).
If "Existing project": proceed to **Step 6: Capability Guide** first, then minimal setup.

---

## Step 2: Detect Environment

Run `scripts/detect-environment.sh` from this skill's directory. This script checks for:

- **Installed plugins**: Context7, Figma, Playwright. **Installed MCPs**: Figma Console
- **Available tools**: AskUserQuestion, WebSearch, WebFetch, Agent tool
- **Project state**: existing code, existing docs/design/ folder, existing CLAUDE.md, git initialization

Display the detection results to the user in a clear summary:

```
Environment Detection Results
─────────────────────────────
Plugins found:  Context7, Figma
Plugins missing: Playwright
MCPs found:     Figma Console
MCPs missing:   (none)
Tools:          AskUserQuestion, WebSearch, Agent
Project:        Git initialized, no existing deliverables
```

Explain briefly what each detected (or missing) MCP does:

- **Context7 plugin**: Gives AI access to up-to-date technical documentation so it does not rely on outdated training data.
- **Figma plugin**: Provides design data from Figma Dev Mode — not screenshots, but structured design information adapted to the project's tech stack. Supports bidirectional workflows (design→code and code→design import).
- **Figma Console MCP**: Can perform actions in Figma directly (create components, apply tokens, and styles from prompts). More powerful than the official plugin but trickier to set up.
- **Playwright plugin**: Enables browser-based testing and a TDD approach. Also allows AI to browse live URLs for visual review.

**Proactive help with missing tools:**

Context7 and the Figma plugin are the essential prerequisites. If either is missing, proactively offer to help install them — explain what they do and guide the user through setup. If Playwright is missing, mention it's needed for testing but can be added later.

If any existing configuration conflicts are detected (e.g., an existing status line, conflicting MCP settings), explain the conflict and ask the user whether to keep their current setup or use the recommended one. Never overwrite existing configuration without asking — explain what will change and why the recommended option is better.

---

## Step 3: Mode Selection

The only question for new projects. Ask:

```
question: "How do you want to work?"
header: "Mode"
options:
  - label: "Guided mode (Recommended)"
    description: "Step by step — AI shares thoughts, asks questions adapted to your project, you review and approve every deliverable. Thorough process for building a quality product."
  - label: "God mode"
    description: "Rapid autonomous exploration — 99% automated, spends more tokens, produces the simplest working MVP as fast as possible. Best for quick validation: testing ideas, seeing if someone would pay. Not for building the final polished product."
```

---

## Step 4: Scaffold Project Structure

Run `scripts/init-project-structure.sh` with the default deliverables path `docs/design/`.

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

---

## Step 5: Write Configuration and Finalize

Generate `.design-engineer.yaml` in the project root:

```yaml
# Design-Engineer Plugin Configuration
# Generated by /de:start on {current_date}

project:
  type: "new"
  mode: "{answer_mode}"
  deliverables_path: "docs/design/"

environment:
  plugins:
    context7: {true/false}
    figma: {true/false}
    playwright: {true/false}
  mcps:
    figma_console: {true/false}

dependencies:
  tracking_file: "docs/design/.dependencies.yaml"
  auto_suggest: true
```

### Initialize Auto-Memory

After writing the config, seed the auto-memory structure for this project. Auto-memory lives at `~/.claude/projects/<project>/memory/` and MEMORY.md auto-loads every session (first 200 lines).

**For new projects (Path B, "New product idea"):**

1. Save `MEMORY.md`:
```markdown
# [Project Name] — Design Engineer

## Pipeline State
Phase: 1 (Discovery) | Last: (none) | Next: ux-problem-statement | Mode: [selected mode]

## Key Decisions
(none yet)

## Topic Files
- [project-map.md](./project-map.md) — read BEFORE any exploration, plan creation, or file search
- [debug-solutions.md](./debug-solutions.md) — read when encountering build/deploy/env errors
```

2. Save `project-map.md` with the scaffolded structure from Step 4:
```markdown
# Project Map

## docs/design/
├── foundation/ — core product definition deliverables | read at pipeline start
├── research/ — research findings and analysis | read before positioning
├── design/ — IA, flows, design references | read before prototyping
├── psych/ — psychology audit results | read during design review
├── dev/ — development preparation | read before dev phase
├── solutions/ — compound docs and status | read for project context
└── .dependencies.yaml — deliverable dependency graph | read by hooks automatically

## Project Root
├── .design-engineer.yaml — plugin config and resume state | read by /de:start
```

3. Save `debug-solutions.md`:
```markdown
# Debug Solutions

Hard-won fixes. Read this before attempting fixes for build, deploy, or environment errors.

(none yet)
```

**For existing projects (Path B, "Existing project"):**

Same structure, but:
- Pipeline State: `Phase: N/A — using individual capabilities | Mode: N/A`
- project-map.md: start with only the docs/design/ scaffold and .design-engineer.yaml — do NOT scan pre-existing project files. Track everything Claude creates or changes going forward.

**For returning projects (Path A):**

Memory already exists — do not re-initialize. It will be read during the startup sequence.

---

Ask about the status line:

```
question: "Would you like to install the design-engineer status line?"
header: "Status Line"
options:
  - label: "Yes (Recommended)"
    description: "Shows model, usage limits, context bar, and pipeline progress below every prompt"
  - label: "No"
    description: "Skip – re-run /de:start later to install"
```

If "Yes":
1. Check if a status line is already configured in `~/.claude/settings.json`
2. If one exists, inform the user: "A status line is already configured: [current value]. Installing will replace it. The previous script file will not be deleted."
3. Create directories: `mkdir -p ~/.claude/hooks ~/.claude/cache`
4. Copy the script: `cp ${CLAUDE_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js`
5. Read `~/.claude/settings.json`, set `statusLine` to `{"type": "command", "command": "node \"{home}/.claude/hooks/de-statusline.js\""}` (replace `{home}` with the actual home directory path), write back with 2-space indentation
6. Confirm: "Status line installed. It will appear on the next prompt."
7. Explain the usage monitor: "The status line shows your model, context usage, and pipeline progress automatically. To also see your 5-hour and 7-day usage limits, you need to run a small monitor in a separate terminal window. Open a new terminal tab and run this command:"

```
node ~/.claude/hooks/de-statusline.js --watch
```

"Keep that window open while you work with Claude. It refreshes your usage data every 3 minutes. If you close it, the status line still works — it just won't show the usage limits. This is optional but recommended, especially if you're on a usage-limited plan."

"Important: the monitor accesses your Anthropic credentials to check usage. Claude itself never sees your credentials — only the monitor does, and only in that separate terminal."

Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `{deliverables_path}/.dependencies.yaml`.

Display a summary of everything configured:

```
Ready to go
───────────
Mode:             {mode}
Deliverables:     docs/design/
Plugins:          {detected list}
Config saved:     .design-engineer.yaml
Status line:      {installed | skipped}

Next step: Run /de:design to start the full product design pipeline.

Tip: Run /de:start anytime to check progress or browse capabilities.
```

---

## Step 6: Capability Guide

This step is reached when:
- A returning user chooses "Browse all capabilities" (Path A)
- An existing project user arrives (Path B, existing)

### 6a: Show All Capabilities

Present everything the plugin can do in plain language:

```
Here's everything this plugin can help you with:

RESEARCH & DISCOVERY
• Define and analyze your core problem
• Build behavioral user personas
• Map and test your assumptions
• Research your competition
• Prepare and analyze user interviews

STRATEGY & POSITIONING
• Map what drives user behavior (BMap framework)
• Build your product narrative (StoryBrand)
• Create user empathy stories (6P Comics)
• Plan your business model and revenue

PLANNING
• Define MVP scope and feature priorities
• Design information architecture and user flows

DESIGN & VALIDATION
• Audit designs for cognitive biases (B.I.A.S. framework)
• Map customer journey highs and lows
• Review ethics and dark patterns
• Collect and organize design references
• Generate clickable HTML prototypes
• Design key screens with Figma workflow
• Analyze UX psychology per screen (Psych Levels)
• Run a full product assessment

DEVELOPMENT
• Set up development environment (CLAUDE.md + agents + GitHub + tools)
• Build features iteratively (test-first + AI agents)

REVIEW & AUDIT
• Design craft quality review
• Implementation fidelity check
• Accessibility audit (WCAG)
• Psychology scan (100 laws)
• Design system compliance
```

### 6b: Diagnostic Questions (existing projects only)

For existing projects (not returning users who just want to browse), ask diagnostic questions to help filter relevant capabilities:

```
question: "What kind of project is this?"
header: "Project Type"
options:
  - label: "App (mobile or web)"
    description: "A software application with UI"
  - label: "Website"
    description: "A website or landing page"
  - label: "Design system"
    description: "A component library or design system"
  - label: "Something else"
    description: "Tell me more about your project"
```

```
question: "What do you currently have?"
header: "Current State"
options:
  - label: "Code + designs"
    description: "Both a codebase and Figma/design files exist"
  - label: "Code only"
    description: "A working codebase but no formal designs"
  - label: "Designs only"
    description: "Figma files or design specs but no code"
  - label: "Documentation only"
    description: "Research, specs, or planning docs but no code or designs"
```

```
question: "What do you want to do right now?"
header: "Goal"
options:
  - label: "Improve UX / redesign"
    description: "Make the existing experience better"
  - label: "Add new features"
    description: "Build something new into the existing product"
  - label: "Audit / review"
    description: "Check quality, accessibility, psychology, or design system compliance"
  - label: "Set up dev workflow"
    description: "Configure AI-assisted development for this project"
```

### 6c: Filtered Recommendations

Based on the diagnostic answers, present a filtered list of the most relevant capabilities with the commands to invoke them:

```
Based on your answers, the most relevant capabilities for you right now are:

[Filtered list with brief explanations and commands]

For example:
• Psychology audit of your existing screens → /de:review psych
• Design craft review → /de:review figma
• Prototype a new feature → /de:prototype feature
• Full development pipeline for a feature → /de:dev pipeline

These are recommendations — you can use any capability at any time.
Come back to /de:start anytime to see this list again.
```

### 6d: Minimal Config for Existing Projects

If the user arrived via Path B (existing project, first time with plugin):

1. Run environment detection (Step 2)
2. Ask only essential config: deliverables path and design tool integration
3. Write `.design-engineer.yaml` with `project.type: "existing"`
4. Scaffold folders (Step 4)
5. Do NOT ask about mode preference, team size, or dev environment — these are relevant for the full pipeline, not ad-hoc usage

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
