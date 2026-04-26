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

## Step 1: Read Config

Read `.design-engineer-plugin/config.yaml`. Check the `project_type` field:

- If `project_type: existing` → this is an existing project, NOT a returning pipeline project. The hook injects context for this case. Follow the hook's instructions (show capabilities via AskUserQuestion). Do NOT show pipeline state or resume information.
- If `project_type: new` → this is a returning pipeline project. Continue with Path A below.

Do not mention config files, detection state, or project types to the user. No jargon.

### Path A: Returning Pipeline Project (project_type: new only)

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
question: "What would you like to do?"
header: "Resume"
options:
  - label: "Pick up where I stopped"
    description: "Continue with {human-readable next step name}"
  - label: "Work on a different phase"
    description: "Jump to discovery, strategy, planning, or design"
  - label: "See what else I can do"
    description: "Browse all available commands and capabilities"
  - label: "Start over"
    description: "Reset the plugin setup for this project"
```

If "Continue" or "Jump": suggest running `/de:design` to resume the pipeline.
If "Browse": show the full capability list inline (see below), then suggest relevant `/de:` commands.
If "Reconfigure": proceed to Step 2.

**If the config has `project_type: new` but no resume state** (set up but no active pipeline), ask:

```
question: "What would you like to do?"
header: "Next step"
options:
  - label: "Start designing"
    description: "Begin the full design workflow – research, strategy, planning, validation"
  - label: "See what I can do"
    description: "Browse all available commands and capabilities"
  - label: "Start over"
    description: "Reset the plugin setup for this project"
```

If "Start": suggest running `/de:design`.
If "Browse": show the full capability list inline (see below), then suggest relevant `/de:` commands.
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
  - label: "Autopilot"
    description: "Rapid autonomous exploration – 99% automated, spends more tokens, produces the simplest working MVP as fast as possible. Best for quick validation: testing ideas, seeing if someone would pay. Not for building the final polished product."
```

---

## Step 4: Scaffold Project Structure

Run `scripts/init-project-structure.sh` with the default deliverables path `documents/design/`.

This creates the standardized folder structure. See [setup-checklist.md](./references/setup-checklist.md) for the full configuration reference.

The script creates:

```
documents/design/
├── foundation/          # Core product definition deliverables
├── research/            # Research findings and competitive analysis
│   └── archive/         # Archived research versions
├── planning/            # MVP requirements, information architecture
├── design/              # Design deliverables (bias audit, journey, references, story panels)
│   ├── references/      # UI reference images
│   └── story-panels/    # Story panel images and scripts
├── prototype/           # HTML prototypes (storyboard, prototype, landing page)
├── psych/               # Psychology audit results
├── reviews/             # Design reviews and assessments
└── dev/                 # Development preparation deliverables

.design-engineer-plugin/
└── dependencies.yaml    # Dependency graph tracking all deliverables

plans/
└── archive/             # Completed implementation plans
```

The `dependencies.yaml` file lives at `.design-engineer-plugin/dependencies.yaml` (separate from the user-facing deliverables in `documents/design/`) and is initialized from the default template. See [dependencies-default.yaml](./assets/dependencies-default.yaml) for the full dependency graph.

---

## Step 5: Write Configuration and Finalize

Generate `.design-engineer-plugin/config.yaml` in the project root:

```yaml
# Design-Engineer Plugin Configuration
# Generated by /de:start on {current_date}

project:
  type: "new"
  mode: "{answer_mode}"
  deliverables_path: "documents/design/"

environment:
  plugins:
    context7: {true/false}
    figma: {true/false}
    playwright: {true/false}
  mcps:
    figma_console: {true/false}

dependencies:
  tracking_file: ".design-engineer-plugin/dependencies.yaml"
  auto_suggest: true
```

### Memory layer

The plugin uses two memory layers:

- **Claude Code auto-memory** (`~/.claude/projects/<slug>/memory/MEMORY.md`) — owned and managed by Claude Code itself. Auto-loads first 200 lines every session. The plugin does NOT touch this file. Do not call Read on it; do not write skeletons to it.
- **Plugin-local memory** (`.design-engineer-plugin/memory/`) — owned by the plugin. Contains `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log). Seeded automatically by `init-project-structure.sh` (the script Step 4 already ran), so by the time you reach this point the skeletons exist. No further action required during setup.

**Note**: writes to plugin-local memory files are advisory — Claude updates them when it notices a relevant trigger, but nothing structurally enforces the writes. The structurally enforced layer for pipeline state lives in the compound-documenter agent's project-local memory at `.claude/agent-memory/compound-documenter/` (Anthropic's documented `memory: project` mechanism). Plugin-local memory is the lighter on-demand reference layer; the compound-documenter agent is the durable pipeline-state layer.

**For new projects (Path B, "New product idea"):**

The skeletons are already in place at `.design-engineer-plugin/memory/project-map.md` and `.design-engineer-plugin/memory/debug-solutions.md`. As work progresses, Claude updates them per the triggers in CLAUDE.md.

**For existing projects (Path B, "Existing project"):**

Same skeletons. project-map.md starts with only the documents/design/ scaffold and `.design-engineer-plugin/config.yaml` — do NOT scan pre-existing project files. Track everything Claude creates or changes going forward.

**For returning projects (Path A):**

Memory already exists — do not overwrite. It will be read on demand during the startup sequence.

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

Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `.design-engineer-plugin/dependencies.yaml` (the canonical path — kept separate from user deliverables in `documents/design/`).

Display a summary in plain language – no file names or config paths:

```
You're all set.

Mode: {Guided / Autopilot}
Your design docs will live in documents/design/
{Figma connected / Figma not connected – offer help}
Status line: {installed / skipped}

Next step: Run /de:design to start designing your product.
Tip: Run /de:start anytime to check progress or see what's available.
```

---

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
If `.design-engineer-plugin/config.yaml` is not created after setup:
1. Check write permissions in the project root directory
2. Ensure no existing `.design-engineer-plugin/config.yaml` is locked by another process
3. Delete any corrupted `.design-engineer-plugin/config.yaml` and re-run `/de:start`
