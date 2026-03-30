---
name: meta-setup
description: "Smart entry point for the design-engineer plugin. Detects project state and routes to the right flow: new projects get full setup, returning projects resume where they left off, existing projects get a capability guide. Use as the first command for any project."
disable-model-invocation: true
model: opus
effort: high
license: MIT
compatibility: "Requires Node.js v18+, Python 3, and Bash"
---

# Design-Engineer Plugin Setup

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding to the next step. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-configure without explicit user consent.

---

## Step 1: Returning Project State

This skill handles returning projects (those with `.design-engineer.yaml`). New-to-plugin projects are handled by the `meta-setup-welcome` skill instead.

Read `.design-engineer.yaml` to determine the resume state.

### Path A: Returning Project

**If the state is `returning_with_resume`**, read the config file and show the current state in plain language:

```
Welcome back. Here's where you are:

You're in the {phase_name} phase.
Last thing completed: {human-readable deliverable name, not the internal skill ID}
Up next: {human-readable name}
{count} deliverables created, {stale_count} may need a look.
```

Then ask:

```
question: "How would you like to proceed?"
header: "Resume"
options:
  - label: "Continue where I left off"
    description: "Pick up from {human-readable next step name}"
  - label: "Jump to a different phase"
    description: "Choose which phase to work on"
  - label: "Browse all capabilities"
    description: "See everything this plugin can do"
  - label: "Reconfigure"
    description: "Start the setup over"
```

If "Continue" or "Jump": hand off to `meta-orchestrator` with the appropriate context.
If "Browse": proceed to **Step 6: Capability Guide** below.
If "Reconfigure": proceed to Step 2.

**If the state is `returning_no_resume`** (config exists but no active pipeline), show a brief summary and ask:

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

---

## Step 2: Detect Environment

Run `scripts/detect-environment.sh` from this skill's directory. It checks for design tools, documentation access, testing setup, and project state.

Present the results in plain language – no plugin names, no technical identifiers. Describe what each tool enables:

```
Here's what I found in your setup:

✓ Figma connected – I can read your designs and work with them directly
✓ Documentation tools ready – I have access to up-to-date technical docs
✗ Browser testing not set up yet – needed later for testing, can add anytime
```

Only list what's relevant. Adapt the wording to what was actually detected. Use ✓ for available tools and ✗ for missing ones.

**Internal knowledge for explaining tools to users** (use when offering help with missing tools – never show these labels or technical names directly):

- **Documentation access** (Context7 plugin internally): Gives AI access to up-to-date technical documentation so it does not rely on outdated training data. Essential – without it, AI may suggest outdated APIs or deprecated patterns.
- **Design tool connection** (Figma plugin internally): Provides structured design data from Figma – not screenshots, but code-ready design information adapted to the project's tech stack. Supports both design→code and code→design workflows. Essential for design-driven projects.
- **Figma actions** (Figma Console MCP internally): Can perform actions in Figma directly – create components, apply tokens and styles from prompts. More powerful than the read-only connection but trickier to set up. Optional.
- **Browser testing** (Playwright plugin internally): Enables browser-based testing and lets AI browse live URLs for visual review. Needed for test-driven development. Optional – can be added later.

**If essential tools are missing** (design tool connection or documentation access), proactively offer to help install them – explain what they enable in plain language and guide the user through setup. Browser testing is optional and can be added later.

If any existing configuration conflicts are detected, explain the conflict in plain terms and ask whether to keep the current setup or use the recommended one. Never overwrite existing configuration without asking.

---

## Step 3: Mode Selection

The only question for new projects. Ask:

```
question: "How do you want to work?"
header: "Mode"
options:
  - label: "Guided mode (Recommended)"
    description: "Step by step – AI shares thoughts, asks questions adapted to your project, you review and approve every deliverable. Thorough process for building a quality product."
  - label: "God mode"
    description: "Rapid autonomous exploration – 99% automated, spends more tokens, produces the simplest working MVP as fast as possible. Best for quick validation: testing ideas, seeing if someone would pay. Not for building the final polished product."
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
# [Project Name] – Design Engineer

## Pipeline State
Phase: 1 (Discovery) | Last: (none) | Next: ux-problem-statement | Mode: [selected mode]

## Key Decisions
(none yet)

## Topic Files
- [project-map.md](./project-map.md) – read BEFORE any exploration, plan creation, or file search
- [debug-solutions.md](./debug-solutions.md) – read when encountering build/deploy/env errors
```

2. Save `project-map.md` with the scaffolded structure from Step 4:
```markdown
# Project Map

## docs/design/
├── foundation/ – core product definition deliverables | read at pipeline start
├── research/ – research findings and analysis | read before positioning
├── design/ – IA, flows, design references | read before prototyping
├── psych/ – psychology audit results | read during design review
├── dev/ – development preparation | read before dev phase
├── solutions/ – compound docs and status | read for project context
└── .dependencies.yaml – deliverable dependency graph | read by hooks automatically

## Project Root
├── .design-engineer.yaml – plugin config and resume state | read by /de:start
```

3. Save `debug-solutions.md`:
```markdown
# Debug Solutions

Hard-won fixes. Read this before attempting fixes for build, deploy, or environment errors.

(none yet)
```

**For existing projects (Path B, "Existing project"):**

Same structure, but:
- Pipeline State: `Phase: N/A – using individual capabilities | Mode: N/A`
- project-map.md: start with only the docs/design/ scaffold and .design-engineer.yaml – do NOT scan pre-existing project files. Track everything Claude creates or changes going forward.

**For returning projects (Path A):**

Memory already exists – do not re-initialize. It will be read during the startup sequence.

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

"Keep that window open while you work with Claude. It refreshes your usage data every 3 minutes. If you close it, the status line still works – it just won't show the usage limits. This is optional but recommended, especially if you're on a usage-limited plan."

"Important: the monitor accesses your Anthropic credentials to check usage. Claude itself never sees your credentials – only the monitor does, and only in that separate terminal."

Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `{deliverables_path}/.dependencies.yaml`.

Display a summary in plain language – no file names or config paths:

```
You're all set.

Mode: {Guided / God mode}
Your design docs will live in docs/design/
{Figma connected / Figma not connected – offer help}
Status line: {installed / skipped}

Next step: Run /de:design to start designing your product.
Tip: Run /de:start anytime to check progress or see what's available.
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
• Map what drives user behavior (Behavior Map framework)
• Build your product narrative (StoryBrand)
• Create user empathy stories (Story Panels)
• Plan your business model and revenue

PLANNING
• Define MVP scope and feature priorities
• Design information architecture and user flows

DESIGN & VALIDATION
• Audit designs for cognitive biases (bias audit)
• Map customer journey highs and lows
• Review ethics and dark patterns
• Collect and organize design references
• Generate clickable HTML prototypes
• Design key screens with Figma workflow
• Analyze UX psychology per screen (Motivation Levels)
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

After showing capabilities, proceed to 6b. Do not ask the user what they want to do yet – the diagnostic questions come first.

### 6b: Diagnostic Questions (existing projects only)

For existing projects (not returning users who just want to browse), ask diagnostic questions to help filter relevant capabilities.

**Do not skip these questions.** Even if auto-memory tells you the project type, current state, or goal – ask anyway. The user may want to do something different than what memory suggests. Ask all three questions in order:

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

These are recommendations – you can use any capability at any time.
Come back to /de:start anytime to see this list again.
```

After showing recommendations, proceed to 6d (minimal setup). Do not end here.

### 6d: Minimal Config for Existing Projects

**This step is mandatory.** After showing recommendations (6c), always proceed here. Do not end the flow at recommendations – the user needs environment detection, config file creation, folder scaffolding, and status line setup before they can effectively use the plugin.

If the user arrived via Path B (existing project, first time with plugin):

1. Run environment detection (Step 2)
2. Ask only essential config: deliverables path and design tool integration
3. Write `.design-engineer.yaml` with `project.type: "existing"`
4. Scaffold folders (Step 4)
5. Ask about the status line (same question and installation flow as Step 5's status line section)
6. Do NOT ask about mode preference, team size, or dev environment – these are relevant for the full pipeline, not ad-hoc usage

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
- [detect-state.sh](./scripts/detect-state.sh) – Project state detection (new/returning/resume)
- [detect-environment.sh](./scripts/detect-environment.sh) – Environment detection script
- [init-project-structure.sh](./scripts/init-project-structure.sh) – Project structure scaffolding script

## Common Issues

### Environment detection script fails
If the detection script reports errors or hangs:
1. Verify Python 3 is installed: `python3 --version`
2. Verify Bash is available: `bash --version`
3. Check script permissions: the script needs execute permission
4. Run `/de:start` again – the script is fail-open and will skip unavailable checks

### Config file not created
If `.design-engineer.yaml` is not created after setup:
1. Check write permissions in the project root directory
2. Ensure no existing `.design-engineer.yaml` is locked by another process
3. Delete any corrupted `.design-engineer.yaml` and re-run `/de:start`
