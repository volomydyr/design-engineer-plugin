---
name: meta-setup
description: "Setup and resume flow for the design-engineer plugin, loaded by /design-engineer:launch. New projects get environment detection, scaffolding, and configuration; returning pipeline projects resume where they left off. Existing projects and shipped products are routed by launch.md directly."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
compatibility: "Requires Node.js v18+, Python 3, and Bash"
---

# Design-Engineer Plugin Setup

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding to the next step. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-configure without explicit user consent.

---

## Step 1: Read Config

Read `.design-engineer-plugin/config.yaml`. Check the top-level `project_type` field:

- If `project_type: new` AND a `resume:` block is present → returning pipeline project with saved state. Continue with Path A below (resume state).
- If `project_type: new` with no `resume:` block (and no `status: complete` line) → set up, but no active pipeline. Continue with Path A below (config summary).

Every other state is routed by `commands/launch.md` directly and never reaches this step: existing projects (`project_type: existing`) and shipped plugin-built products (`project_type: new` with `status: complete`) enter its iterate flow, and first-time setup enters via its onboarding, which starts this skill at Step 2.

Do not mention config files, detection state, or project types to the user. No jargon.

### Path A: returning pipeline project (project_type: new only)

**If the config has a `resume:` block** (state `returning_with_resume`), show the current state in plain language:

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

If "Pick up where I stopped" or "Work on a different phase": announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/discovery.md` and follow its instructions inline, carrying forward the resume state from the config (which step to pick up, or which phase the user chose to jump to). Do NOT end the turn telling the user to run `/design-engineer:discovery` themselves.
If "See what else I can do": show the full capability list inline, then suggest relevant `/design-engineer:` commands.
If "Start over": proceed to Step 2.

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

If "Start designing": announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/discovery.md` and follow its instructions inline. Do NOT end the turn telling the user to run `/design-engineer:discovery` themselves.
If "See what I can do": show the full capability list inline, then suggest relevant `/design-engineer:` commands.
If "Start over": proceed to Step 2.

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
- **Figma write actions** (bundled Figma MCP): The same bundled Figma connection also writes into Figma – creating components, applying tokens and styles, structuring files for handoff – through its `use_figma` executor. No separate Figma write tool is needed; the advanced `ui-figma-handoff` workflow runs entirely on the bundled MCP.

**Three MCPs are bundled with this plugin** (Context7, Figma, Playwright) – they auto-start with the plugin and don't need separate installation. Status messaging should reflect "bundled, here's whether the prerequisite (Figma desktop / Node) is in place" rather than "you need to install this".

**If a prerequisite is missing** (Node.js for Playwright, or Figma desktop for the Figma connection), proactively offer to help: explain what it enables in plain language and guide the user through setup. Don't offer to install Figma or Playwright themselves – those are bundled.

If any existing configuration conflicts are detected, explain the conflict in plain terms and ask whether to keep the current setup or use the recommended one. Never overwrite existing configuration without asking.

---

## Step 3: Scaffold Project Structure

Run `scripts/init-project-structure.sh` from this skill's directory (its optional deliverables-path parameter is legacy and no longer used – the script always scaffolds the `.design-engineer-plugin/` umbrella).

This creates the standardized folder structure. See [config-reference.md](./references/config-reference.md) for the config keys and folder tiers.

The script creates:

```
.design-engineer-plugin/
├── memory/              # Plugin-local memory, seeded with project-map.md + debug-solutions.md
├── plans/
│   └── archive/         # Implementation plans + completed-plans archive
├── prototype/           # HTML prototypes
├── temporary/           # Gitignored (fenced .gitignore block) – purged at completion milestones
│   ├── scratch/         # General throwaway
│   ├── playwright/      # Playwright debug captures
│   └── intermediate/    # Prep work and exploratory drafts
└── dependencies.yaml    # Dependency graph, initialized from the default template
```

Deliverable subdirs under `.design-engineer-plugin/design/` (`foundation`, `research`, `planning`, `exploration`, `psychology`, `reviews`, `dev`, `features`) are lazy – each is created by the skill that writes its first deliverable there, not by this script.

The `dependencies.yaml` file lives at `.design-engineer-plugin/dependencies.yaml` (separate from the user-facing deliverables in `.design-engineer-plugin/design/`) and is initialized from the default template. See [dependencies-default.yaml](./assets/dependencies-default.yaml) for the full dependency graph.

---

## Step 4: Write Configuration and Finalize

Generate `.design-engineer-plugin/config.yaml` in the project root:

```yaml
# Design-Engineer Plugin Configuration
# Generated by /design-engineer:launch on {current_date}

# project_type and status must stay top-level and unquoted – detection greps in
# hooks/de-start-state.sh are ^-anchored and launch/discovery/development
# branch on the literal string
project_type: new

environment:
  plugins:
    context7: {true/false}
    figma: {true/false}
    playwright: {true/false}

dependencies:
  tracking_file: ".design-engineer-plugin/dependencies.yaml"
  auto_suggest: true
```

### Memory layer

The plugin uses two memory layers:

- **Claude Code auto-memory** (`~/.claude/projects/<slug>/memory/MEMORY.md`) – owned and managed by Claude Code itself. Auto-loads first 200 lines every session. The plugin does NOT touch this file. Do not call Read on it; do not write skeletons to it.
- **Plugin-local memory** (`.design-engineer-plugin/memory/`) – owned by the plugin. Contains `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log). Seeded automatically by `init-project-structure.sh` (the script Step 3 already ran), so by the time you reach this point the skeletons exist. No further action required during setup.

**Note**: writes to plugin-local memory files are advisory – Claude updates them when it notices a relevant trigger, but nothing structurally enforces the writes. The structurally enforced layer for pipeline state lives in the compound-documenter agent's project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/` (Anthropic's documented `memory: project` mechanism). Plugin-local memory is the lighter on-demand reference layer; the compound-documenter agent is the durable pipeline-state layer.

**For new projects:**

The skeletons are already in place at `.design-engineer-plugin/memory/project-map.md` and `.design-engineer-plugin/memory/debug-solutions.md`. As work progresses, Claude updates them per the triggers in CLAUDE.md.

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
    description: "Skip – re-run /design-engineer:launch later to install"
```

If "Yes" or "Reinstall":

Do NOT write to `~/.claude/settings.json` or copy files into `~/.claude/hooks/` yourself – Auto mode's permission classifier blocks writes outside the working directory. Instead, present the install command to the user and have them run it in their next prompt.

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

If "Uninstall":

Do NOT edit `~/.claude/settings.json` yourself – the same outside-CWD write restriction applies. Present the removal command to the user and have them run it in their next prompt.

1. Output exactly this block to the chat:

````
To remove the status line, paste this into your next prompt (the leading `!` runs it as a shell command):

! node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};delete s.statusLine;fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Status line removed.")'
````

2. Confirm: "Once you paste that command, the status line disappears from the next prompt. The script file at `~/.claude/hooks/de-statusline.js` stays on disk – reinstalling later only rewrites the settings entry."

If "Skip – already installed": make no changes and move on.

---

Ask about commit/PR attribution.

**First**, detect current state: read `~/.claude/settings.json` if it exists (reads outside the working directory are fine – only writes are blocked) and classify the `attribution` field:

- If present and both `commit` and `pr` are already `""` → tell the user attribution is already off and skip the rest of this step.
- If present with custom text the user wrote themselves (anything other than the default Anthropic `🤖 Generated with [Claude Code]…` string or `Co-Authored-By: Claude` trailer) → leave it alone and skip this step silently.
- Otherwise (field absent, or carrying the default Anthropic text) → ask the question below (preceded by the canonical 3-line spacer):

```
question: "Turn off Claude Code's default commit attribution for your projects?"
header: "Attribution"
multiSelect: false
options:
  - label: "Yes, turn it off"
    description: "Removes the Co-Authored-By trailer and the Generated-with footer from commits Claude Code makes globally"
  - label: "No, keep the default"
    description: "The safe default – pick this to skip"
```

If "Yes, turn it off":

Do NOT write to `~/.claude/settings.json` yourself – Auto mode's permission classifier blocks writes outside the working directory. Present the command to the user and have them run it in their next prompt. Output exactly this block to the chat:

````
To turn off the default attribution, paste this into your next prompt (the leading `!` runs it as a shell command):

! node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};s.attribution={commit:"",pr:""};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Attribution turned off.")'
````

The one-liner preserves every other field in the file – it only sets `attribution`. After the user runs it, confirm in plain language: "Disabled the default Co-Authored-By trailer on commits. The plugin only adds its own attribution when actively driving a commit (during a plan-execution phase). Manual commits in unrelated projects stay attribution-free."

If "No, keep the default": skip – commits keep Claude Code's standard attribution.

---

Ask about sound notifications.

**Background**: sound hooks are bundled in the plugin's `hooks/hooks.json` (Stop event for completion sound, Notification event for attention sound). They fire automatically, but the playback shim plays a sound only inside a plugin project (the CWD has `.design-engineer-plugin/config.yaml`) whose config carries a top-level `sound: enabled` key. Any other `sound:` value (e.g. `muted`) is silent; when the key is absent the shim falls back to the legacy global opt-in flag `~/.claude/de-sound-enabled` (pre-per-project releases). A fresh install is silent by default until the user opts in here.

**First**, detect current state. The config.yaml this setup just created has no `sound:` key yet, so the effective state comes from the legacy flag: check whether `~/.claude/de-sound-enabled` exists (`test -f ~/.claude/de-sound-enabled`). If it DOES exist, sounds are currently on; ask the "keep them on?" question. If it does NOT exist, sounds are currently off; ask the "enable?" question.

Sounds-currently-on (flag present) – ask:
```
question: "Sound notifications are currently on. Keep them?"
header: "Sounds"
options:
  - label: "Yes (Recommended)"
    description: "Plays a short bundled sound when Claude finishes (Stop hook) and when Claude waits for your input – permission requests, AskUserQuestion (Notification hook). Sounds fire only inside design-engineer plugin projects, never in unrelated repos. Works on macOS, Linux (with paplay/aplay/play), and native Windows shells. Silent on WSL. To silence temporarily later, run /design-engineer:mute-unmute-sound."
  - label: "No, mute them"
    description: "Keeps this project silent. Toggle later with /design-engineer:mute-unmute-sound."
```

Sounds-currently-off (flag absent) – ask:
```
question: "Sound notifications are currently off. Enable them?"
header: "Sounds"
options:
  - label: "Yes (Recommended)"
    description: "Turns on the bundled sound hooks (Stop + Notification) for this project – other repos stay silent."
  - label: "Keep muted"
    description: "Leave sounds off. Toggle later with /design-engineer:mute-unmute-sound."
```

**Apply the choice** by writing a top-level `sound:` key into the config.yaml this setup just created – a CWD write (no writes to `~/.claude/settings.json` – the hooks are already wired in the plugin's own `hooks/hooks.json`):

- If user picks "Yes (Recommended)": append `sound: enabled`. Confirm: "Sounds are on for this project. You'll hear a chime when Claude finishes a response and a different one when Claude needs your input."
- If user picks "No, mute them" or "Keep muted": append `sound: muted` (explicit, so a leftover legacy opt-in flag can't re-enable sounds here). Confirm: "Sounds muted for this project. Toggle anytime with /design-engineer:mute-unmute-sound."

Leave the legacy global flag `~/.claude/de-sound-enabled` in place – projects configured before the per-project key still read it, and the explicit `sound:` key written above takes precedence for this project.

**Cleanup the retired legacy mute flag** (idempotent, harmless if absent): `rm -f ~/.claude/de-sound-muted`. Older plugin versions used a default-on mute flag at this path; v4.8.2 retired it in favor of the explicit opt-in flag above. Removing the legacy file keeps the user's `~/.claude/` directory clean and prevents confusion if anyone inspects it manually.

**Migration cleanup**: if the user has legacy entries in `~/.claude/settings.json` under `hooks.Stop` or `hooks.Notification` from plugin versions v4.1.0–v4.7.0 that referenced `${CLAUDE_PLUGIN_ROOT}/hooks/de-play-sound.sh`, those are dead (the variable does not resolve inside `settings.json`). Detect them by reading the file and checking for `de-play-sound.sh` in any Stop/Notification hook entry. If found, remove just those entries (preserve all other settings) and tell the user "Cleaned up legacy sound-hook entries from settings.json – the plugin now ships its sound hooks bundled at the canonical Anthropic location." Do not write any new entries to `~/.claude/settings.json`.

---

Initialize dependency tracking by copying [dependencies-default.yaml](./assets/dependencies-default.yaml) into `.design-engineer-plugin/dependencies.yaml` (the canonical path – kept separate from user deliverables in `design/`).

Display a summary in plain language – no file names or config paths:

```
You're all set.

Your design docs will live in .design-engineer-plugin/design/
{Figma connected / Figma not connected – offer help}
Status line: {installed / skipped}
Sound notifications: {installed / skipped}

Next step: Run /design-engineer:discovery to start designing your product.
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

- [config-reference.md](./references/config-reference.md) – config keys the plugin writes and the folder tier layout
- [dependencies-default.yaml](./assets/dependencies-default.yaml) – Default dependency graph for all plugin deliverables
- [detect-environment.sh](./scripts/detect-environment.sh) – Environment detection script
- [init-project-structure.sh](./scripts/init-project-structure.sh) – Project structure scaffolding script

## Common Issues

### Environment detection script fails
If the detection script reports errors or hangs:
1. Verify Python 3 is installed: `python3 --version`
2. Verify Bash is available: `bash --version`
3. Check script permissions: the script needs execute permission
4. Run `/design-engineer:launch` again – the script is fail-open and will skip unavailable checks

### Config file not created
If `.design-engineer-plugin/config.yaml` is not created after setup:
1. Check write permissions in the project root directory
2. Ensure no existing `.design-engineer-plugin/config.yaml` is locked by another process
3. Delete any corrupted `.design-engineer-plugin/config.yaml` and re-run `/design-engineer:launch`
