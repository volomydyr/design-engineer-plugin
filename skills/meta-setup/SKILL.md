---
name: meta-setup
description: "Smart entry point for the design-engineer plugin. Detects project state and routes to the right flow: new projects get full setup, returning projects resume where they left off, existing projects get a capability guide. Use as the first command for any project."
disable-model-invocation: true
model: claude-opus-4-7
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

If "Continue" or "Jump": suggest running `/design-engineer:design` to resume the pipeline.
If "Browse": show the full capability list inline (see below), then suggest relevant `/design-engineer:` commands.
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

If "Start": suggest running `/design-engineer:design`.
If "Browse": show the full capability list inline (see below), then suggest relevant `/design-engineer:` commands.
If "Reconfigure": proceed to Step 2.

---

## Step 2: Detect Environment

Run `scripts/detect-environment.sh` from this skill's directory. It checks for design tools, documentation access, testing setup, and project state.

Present the results in plain language – no plugin names, no technical identifiers. Describe what each tool enables:

```
Here's what I found in your setup:

✓ Figma connected – I can read your designs and work with them directly
✓ Library docs lookup – I can fetch up-to-date docs for libraries and frameworks (e.g., React, Tailwind, Stripe)
✗ Browser testing not set up yet – needed later for testing, can add anytime
```

Only list what's relevant. Adapt the wording to what was actually detected. Use ✓ for available tools and ✗ for missing ones.

**Internal knowledge for explaining tools to users** (use when explaining status to users – never show these labels or technical names directly):

- **Library docs lookup** (Context7 MCP, bundled): Gives AI access to up-to-date documentation for libraries, frameworks, SDKs, CLIs, and cloud services (React, Next.js, Tailwind, Stripe, etc.) so it does not rely on outdated training data. This is about external library docs, not the project's own README or internal docs. Bundled – auto-starts when the plugin is enabled. Nothing for the user to install.
- **Design tool connection** (Figma MCP, bundled): Provides structured design data from Figma – not screenshots, but code-ready design information adapted to the project's tech stack. Supports both design→code and code→design workflows. Bundled – auto-starts. The user just needs to open Figma desktop with Dev Mode enabled to use it.
- **Browser testing** (Playwright MCP, bundled): Enables browser-based testing and lets AI browse live URLs for visual review. Bundled – auto-starts. Requires Node.js v18+ on the user's machine so npx can fetch the Playwright package on first use.
- **Figma actions** (Figma Console MCP, OPTIONAL companion): Can perform actions in Figma directly – create components, apply tokens and styles from prompts. More powerful than the read-only Figma connection but trickier to set up. Not bundled; an optional install for power users only.

**Three MCPs are bundled with this plugin** (Context7, Figma, Playwright) – they auto-start with the plugin and don't need separate installation. Status messaging should reflect "bundled, here's whether the prerequisite (Figma desktop / Node) is in place" rather than "you need to install this".

**If a prerequisite is missing** (Node.js for Playwright, or the user wants Figma Console as an extra), proactively offer to help: explain what it enables in plain language and guide the user through setup. Don't offer to install Figma or Playwright themselves – those are bundled.

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

Run `scripts/init-project-structure.sh` with the default deliverables path `design/`.

This creates the standardized folder structure. See [setup-checklist.md](./references/setup-checklist.md) for the full configuration reference.

The script creates:

```
design/
├── foundation/          # Core product definition deliverables
├── research/            # Research findings and competitive analysis
│   └── archive/         # Archived research versions
├── planning/            # MVP requirements, information architecture
├── craft/               # Design deliverables (bias audit, journey, references, story panels)
│   ├── references/      # UI reference images
│   └── story-panels/    # Story panel images and scripts
├── psych/               # Psychology audit results
├── reviews/             # Design reviews and assessments
└── dev/                 # Development preparation deliverables

prototype/               # HTML prototypes at project root, sibling of design/

.design-engineer-plugin/
├── dependencies.yaml    # Dependency graph tracking all deliverables
└── memory/              # Plugin-local memory (project-map, debug-solutions)

plans/
└── archive/             # Completed implementation plans
```

The `dependencies.yaml` file lives at `.design-engineer-plugin/dependencies.yaml` (separate from the user-facing deliverables in `design/`) and is initialized from the default template. See [dependencies-default.yaml](./assets/dependencies-default.yaml) for the full dependency graph.

---

## Step 5: Write Configuration and Finalize

Generate `.design-engineer-plugin/config.yaml` in the project root:

```yaml
# Design-Engineer Plugin Configuration
# Generated by /design-engineer:start on {current_date}

project:
  type: "new"
  mode: "{answer_mode}"
  deliverables_path: "design/"

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

- **Claude Code auto-memory** (`~/.claude/projects/<slug>/memory/MEMORY.md`) – owned and managed by Claude Code itself. Auto-loads first 200 lines every session. The plugin does NOT touch this file. Do not call Read on it; do not write skeletons to it.
- **Plugin-local memory** (`.design-engineer-plugin/memory/`) – owned by the plugin. Contains `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log). Seeded automatically by `init-project-structure.sh` (the script Step 4 already ran), so by the time you reach this point the skeletons exist. No further action required during setup.

**Note**: writes to plugin-local memory files are advisory – Claude updates them when it notices a relevant trigger, but nothing structurally enforces the writes. The structurally enforced layer for pipeline state lives in the compound-documenter agent's project-local memory at `.claude/agent-memory/compound-documenter/` (Anthropic's documented `memory: project` mechanism). Plugin-local memory is the lighter on-demand reference layer; the compound-documenter agent is the durable pipeline-state layer.

**For new projects (Path B, "New product idea"):**

The skeletons are already in place at `.design-engineer-plugin/memory/project-map.md` and `.design-engineer-plugin/memory/debug-solutions.md`. As work progresses, Claude updates them per the triggers in CLAUDE.md.

**For existing projects (Path B, "Existing project"):**

Same skeletons. project-map.md starts with only the design/ scaffold and `.design-engineer-plugin/config.yaml` – do NOT scan pre-existing project files. Track everything Claude creates or changes going forward.

**For returning projects (Path A):**

Memory already exists – do not overwrite. It will be read on demand during the startup sequence.

---

Ask about the status line.

**First**, detect prior installation: read `~/.claude/settings.json` (if it exists) and check if `statusLine.command` references `de-statusline.js`. If yes, present the 3-option question; if no, present the 2-option question.

3-option (already installed):
```
question: "The design-engineer status line is already installed. What would you like to do?"
header: "Status Line"
options:
  - label: "Skip – already installed"
    description: "Keep your current setup, no changes"
  - label: "Reinstall (replace)"
    description: "Re-copy the script and rewrite the settings entry – useful if it stopped working"
  - label: "Uninstall"
    description: "Remove the statusLine entry from ~/.claude/settings.json (script file stays on disk)"
```

2-option (not installed):
```
question: "Would you like to install the design-engineer status line?"
header: "Status Line"
options:
  - label: "Yes (Recommended)"
    description: "Shows model, usage limits, context bar, and pipeline progress below every prompt"
  - label: "No"
    description: "Skip – re-run /design-engineer:start later to install"
```

If "Yes" or "Reinstall":

Do NOT write to `~/.claude/settings.json` or copy files into `~/.claude/hooks/` yourself — Auto mode's permission classifier blocks writes outside the working directory. Instead, present the install command to the user and have them run it in their next prompt.

1. If a status line is already configured (Reinstall branch), inform the user: "A status line is already configured. The command below will overwrite the `statusLine` entry. The previous script file is not deleted."
2. Output exactly this block to the chat (substitute the resolved plugin root for `${DESIGN_ENGINEER_PLUGIN_ROOT}`):

````
To install the status line, paste this into your next prompt (the leading `!` runs it as a shell command):

! mkdir -p ~/.claude/hooks && cp ${DESIGN_ENGINEER_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js && node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};s.statusLine={type:"command",command:"node "+require("os").homedir()+"/.claude/hooks/de-statusline.js"};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Status line installed.")'
````

3. Confirm: "Once you paste that command, the status line will appear on the next prompt."
4. Explain the usage monitor: "The status line shows your model, context usage, and pipeline progress automatically. To also see your 5-hour and 7-day usage limits, you need to run a small monitor in a separate terminal window. Open a new terminal tab and run this command:"

```
node ~/.claude/hooks/de-statusline.js --watch
```

"Keep that window open while you work with Claude. It refreshes your usage data every 3 minutes. If you close it, the status line still works – it just won't show the usage limits. This is optional but recommended, especially if you're on a usage-limited plan."

"Important: the monitor accesses your Anthropic credentials to check usage. Claude itself never sees your credentials – only the monitor does, and only in that separate terminal."

---

Silently apply commit/PR attribution defaults (no question – this just runs):

1. Read `~/.claude/settings.json` (create the file with `{}` if missing).
2. Check the `attribution` field:
   - If absent → write `"attribution": { "commit": "", "pr": "" }`.
   - If present and both `commit` and `pr` are already `""` → no-op.
   - If present with the default Anthropic text (the `🤖 Generated with [Claude Code]…` string or `Co-Authored-By: Claude` trailer) → set both to `""`.
   - If present with custom non-default text the user wrote themselves → leave alone, do not overwrite.
3. Write back with 2-space indentation. Preserve all other fields.
4. Confirm in plain language: "Disabled the default Co-Authored-By trailer on commits. The plugin only adds its own attribution when actively driving a commit (during a plan-execution phase). Manual commits in unrelated projects stay attribution-free."

---

Ask about sound notifications.

**Background**: sound hooks are bundled in the plugin's `hooks/hooks.json` (Stop event for completion sound, Notification event for attention sound). They fire automatically, but the playback shim plays a sound only when BOTH conditions are true: (a) the global opt-in flag `~/.claude/de-sound-enabled` exists, AND (b) the current working directory is a plugin project (has `.design-engineer-plugin/config.yaml`). A fresh install is silent by default until the user opts in here.

**First**, detect current state by checking whether `~/.claude/de-sound-enabled` exists (`test -f ~/.claude/de-sound-enabled`). If it DOES exist, sounds are currently on; ask the "keep them on?" question. If it does NOT exist, sounds are currently off; ask the "enable?" question.

Sounds-currently-on (flag present) – ask:
```
question: "Sound notifications are currently on. Keep them?"
header: "Sounds"
options:
  - label: "Yes (Recommended)"
    description: "Plays a short bundled sound when Claude finishes (Stop hook) and when Claude waits for your input – permission requests, AskUserQuestion (Notification hook). Sounds fire only inside design-engineer plugin projects, never in unrelated repos. Works on macOS, Linux (with paplay/aplay/play), and native Windows shells. Silent on WSL. To silence temporarily later, run /design-engineer:mute-unmute-sound."
  - label: "No, mute them"
    description: "Removes ~/.claude/de-sound-enabled so the playback shim exits silently. Toggle later with /design-engineer:mute-unmute-sound."
```

Sounds-currently-off (flag absent) – ask:
```
question: "Sound notifications are currently off. Enable them?"
header: "Sounds"
options:
  - label: "Yes (Recommended)"
    description: "Creates ~/.claude/de-sound-enabled so the bundled sound hooks (Stop + Notification) play their chimes – only inside design-engineer plugin projects."
  - label: "Keep muted"
    description: "Leave sounds off. Toggle later with /design-engineer:mute-unmute-sound."
```

**Apply the choice** (no writes to `~/.claude/settings.json` – the hooks are already wired in the plugin's own `hooks/hooks.json`):

- If user picks "Yes (Recommended)": run `mkdir -p ~/.claude && touch ~/.claude/de-sound-enabled` (idempotent). Confirm: "Sounds are on globally. You'll hear a chime when Claude finishes a response and a different one when Claude needs your input – inside plugin projects only."
- If user picks "No, mute them" or "Keep muted": run `rm -f ~/.claude/de-sound-enabled` (idempotent; no error if absent). Confirm: "Sounds muted. Toggle anytime with /design-engineer:mute-unmute-sound."

**Cleanup the retired legacy mute flag** (idempotent, harmless if absent): `rm -f ~/.claude/de-sound-muted`. Older plugin versions used a default-on mute flag at this path; v4.8.2 retired it in favor of the explicit opt-in flag above. Removing the legacy file keeps the user's `~/.claude/` directory clean and prevents confusion if anyone inspects it manually.

**Migration cleanup**: if the user has legacy entries in `~/.claude/settings.json` under `hooks.Stop` or `hooks.Notification` from plugin versions v4.1.0–v4.7.0 that referenced `${CLAUDE_PLUGIN_ROOT}/hooks/de-play-sound.sh`, those are dead (the variable does not resolve inside `settings.json`). Detect them by reading the file and checking for `de-play-sound.sh` in any Stop/Notification hook entry. If found, remove just those entries (preserve all other settings) and tell the user "Cleaned up legacy sound-hook entries from settings.json – the plugin now ships its sound hooks bundled at the canonical Anthropic location." Do not write any new entries to `~/.claude/settings.json`.

---

Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `.design-engineer-plugin/dependencies.yaml` (the canonical path – kept separate from user deliverables in `design/`).

Display a summary in plain language – no file names or config paths:

```
You're all set.

Mode: {Guided / Autopilot}
Your design docs will live in design/
{Figma connected / Figma not connected – offer help}
Status line: {installed / skipped}
Sound notifications: {installed / skipped}

Next step: Run /design-engineer:design to start designing your product.
Tip: Run /design-engineer:help anytime to see all available commands and capabilities.
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
4. Run `/design-engineer:start` again – the script is fail-open and will skip unavailable checks

### Config file not created
If `.design-engineer-plugin/config.yaml` is not created after setup:
1. Check write permissions in the project root directory
2. Ensure no existing `.design-engineer-plugin/config.yaml` is locked by another process
3. Delete any corrupted `.design-engineer-plugin/config.yaml` and re-run `/design-engineer:start`
