---
description: Universal entry point. Launches the plugin for any project state — new, in-progress, or already shipped.
argument-hint: "[what you want to work on – optional free-form task]"
allowed-tools: Bash(test -f .design-engineer-plugin/config.yaml && cat .design-engineer-plugin/config.yaml || echo "NO_CONFIG"), Bash(test -f ~/.claude/de-sound-enabled && echo present || echo absent)
---

# Design Engineer – Launch

Arguments: $ARGUMENTS

When routing (Step 0 below) lands in the **iterate flow** and the arguments line above is non-empty, treat it as the user's free-form task: skip Step I1 entirely and go straight to Step I2 with that text as the task to clarify. When the arguments line is empty, run Step I1 as written.

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command body references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

## Routing

**Step 0 (BLOCKING — run before anything else): re-detect state from disk.** The `DESIGN_ENGINEER_PROJECT_STATE` value injected by the start hook can lag behind disk reality (cached old hook version, hook fired before config was created, hook ran in a different cwd, etc.). Trust the disk, not the injected value:

1. Run via Bash: `test -f .design-engineer-plugin/config.yaml && cat .design-engineer-plugin/config.yaml || echo "NO_CONFIG"`.
2. Branch on what you read:
   - **`NO_CONFIG`** → user is genuinely new in this directory. Follow the **Onboarding sequence** below in this file. Do not skip any step.
   - **Config exists with `project_type: new` AND a `status: complete` line** → the plugin-built product has shipped its from-scratch pipeline and is now in iteration. Treat this as state `returning_complete`: route into the **Iterate flow** below (NOT the from-scratch returning paths). This check comes BEFORE the `resume:` check – the detection hook (`hooks/de-start-state.sh`) uses the same order, so a paused iterate task on a completed product stays in the iterate flow. Acknowledge in one sentence what shipped (e.g. the product name / last goal from config). If the config also carries a `resume:` block (a task paused with `/design-engineer:stop`), follow the **Paused-task pick-up** rule below before Step I1.
   - **Config exists with `project_type: new`, no `status: complete` line, AND a `resume:` block** → returning user with active pipeline state. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (resume state). Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true` and the Skill tool will reject them.
   - **Config exists with `project_type: new`, no `status: complete` line, no `resume:` block** → returning user, no active pipeline (from-scratch pipeline still in progress). Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (config summary).
   - **Config exists with `project_type: existing`** → existing-project user is returning. Acknowledge in one sentence what you found in their config (last goal, any in-progress feature folder under `.design-engineer-plugin/design/features/`), then enter the **Iterate flow** below. If the config carries a `resume:` block (a task paused with `/design-engineer:stop`), follow the **Paused-task pick-up** rule below before Step I1.

The `DESIGN_ENGINEER_PROJECT_STATE` injected value is a hint only. The disk read above is the source of truth.

Skip the **Onboarding sequence** entirely if the disk read found a config.

## The iterate flow

Both an existing project (`project_type: existing`) and a shipped plugin-built product (`project_type: new` + `status: complete`, state `returning_complete`) land here. This is a fast, task-driven flow for working on a product that already exists. It does NOT march the from-scratch discovery pipeline.

**Core interaction model: clarify-then-dispatch.** A task front-door is a conversational entry. Picking one (or sending free-form text) makes you ASK THE USER FOR DETAIL in natural language first. Only AFTER you understand what they want do you dispatch the right plugin pieces (per the task→dispatch map below). A front-door NEVER auto-spawns agents or workflows on selection. Lean in process, powerful in capability: even a one-line free-form request should reach for the most capable fitting tool (a skill, a workflow, an agent, the spec-driven layer, or a `/goal`), but never a forced pipeline.

### Paused-task pick-up (when the config carries a `resume:` block)

`/design-engineer:stop` writes an iterate-flow `resume:` block with `task`, `files`, `next_action`, and `saved_at`. When the Step 0 routing landed here and such a block exists, run this rule before Step I1 (the front-door question caps at 4 options, so the pick-up offer is its own quick question first):

1. Acknowledge the saved task in one plain-language sentence (e.g. "Last time you paused midway through the settings header redesign.").
2. End the chat message with the canonical 3-horizontal-rule spacer and call `AskUserQuestion`:
   - question: "Pick up where you left off?"
   - header: "Paused task"
   - options:
     - label: "Pick up: <saved task>" (shorten the task to a few words), description: "Resume the paused task at its next step"
     - label: "Start something else", description: "Leave the paused task saved and pick a new starting point"
   - multiSelect: false
3. On "Pick up" → delete the `resume:` block from `.design-engineer-plugin/config.yaml` (touch nothing else), skip Step I1, re-read the files the block names, and continue the saved task at its `next_action`. When the task completes, Step I3 runs as usual.
4. On "Start something else" → leave the `resume:` block in place (the paused task stays available for a later session) and continue to Step I1.

When `/design-engineer:launch` was invoked with explicit arguments, skip this question – the typed task wins and the `resume:` block stays saved for later.

### Step I1: nudge, then offer the front-doors

**Required first output: a visible chat message** (not a blockquote, not a code block, not a tool result). Emit this as normal chat text so the screen is not blank before the question panel:

Tell me what you want to work on – a fix, a redesign, or a new feature – or pick a starting point.

Then end the chat message with the canonical 3-horizontal-rule spacer and call `AskUserQuestion`:

- question: "What do you want to work on?"
- header: "Starting point"
- options:
  - label: "Act on feedback", description: "I have feedback to turn into changes – a video walkthrough, notes, messages, or a transcript"
  - label: "Improve an existing design", description: "Rework an existing screen, page, or flow so it looks and works better"
  - label: "Explore a concept", description: "Try directions for a new idea before committing to one"
  - label: "Audit a design", description: "Review a design for UX, accessibility, visual quality, or psychology issues"
- multiSelect: false

The built-in free-form "Other" path is always available: the user can ignore the options and just type what they have in mind. Treat that free-form text exactly as a task to clarify-then-dispatch.

### Step I2: clarify, read context, then dispatch

When a front-door is picked OR free-form text arrives:

1. **Ask for the specifics** with the `AskUserQuestion` tool (2–4 options, the canonical spacer above it, numbered-list fallback). What design, what exactly should change, what does "better" mean here, what do they already have (a feedback video, a reference site, a Figma file). Keep it light – one focused question, or two at most – but always through `AskUserQuestion`, never as an inline prose question the user has to answer by typing.
2. **Read the project context already in `config.yaml`** under `project.context`: `existing_design_system`, `shipped_ui`, `component_count`, `off_repo_references`. Use it to ground the dispatch (reuse-heavy when a design system and shipped UI exist; bind to real tokens and components, do not reinvent).
3. **Dispatch per the task→dispatch map below**, matched to what the user actually described – the most capable tool that fits, not the heaviest by default.

There is NO discovery Step 2.1 spec-polish gate and NO forced discovery 2.2–2.7 pipeline in this flow.

### Step I3: after a task completes

When an iterate task finishes (edited, verified, presented), do not dead-end. First give a one-sentence confirmation of what changed. Then end the chat message with the canonical 3-horizontal-rule spacer and call `AskUserQuestion`:

- question: "What's next?"
- header: "What's next"
- multiSelect: false
- options:
  - label: "Next task", description: "Start another task on this project"
  - label: "Document this change", description: "Record the decision and update project state for future sessions"
  - label: "Done for now", description: "Wrap up this session"

Routing:
- **"Next task"** → return to Step I2 (clarify, read context, dispatch).
- **"Document this change"** → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool. When documentation completes, return to this step's question (minus the documentation option).
- **"Done for now"** → one-sentence wrap-up of what shipped this session, then stop.

This step runs once per completed task. For act-on-feedback checklists it runs once per batch, after the checklist has been worked through – never after each individual checklist item.

## Task→dispatch map (single source of truth)

This is the ONE authoritative routing map for the iterate flow. The onboarding Step 4 hand-off references this section – do not restate it elsewhere.

- **Act on feedback** → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/feedback-to-todos/SKILL.md` and follow its instructions inline (it ingests the video, notes, messages, or transcript into one grounded checklist), then feed items one at a time into the free-form scoped-edit loop below. Do NOT use the `Skill` tool.
- **Improve an existing design** → audit what exists first (Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/SKILL.md` for the real tokens and component paths, plus grep the files), then `design-spec` for consequential UI only (graduated, never a blanket gate), then `frontend-implementer` to build, then `design-system-auditor` to verify, then Playwright to confirm in the browser, then optionally compose a `/goal` (suggest-and-wait). All skills load via Read + follow inline, never the `Skill` tool.
- **Explore a concept** → a lighter inline pass plus `/design-engineer:prototype` for quick concepts; escalate to the Opus/xhigh design-exploration workflow ONLY for substantive concepts. Ask the user which (quick vs substantive) during the clarify step.
- **Audit a design** → a single-design inline audit by default; escalate to the `/design-engineer:review audit` workflow ONLY if, after clarifying, the user actually has many pages. Never auto-spawn the full multi-page sweep.
- **Build or add a feature** → hand off to `/design-engineer:discovery` – its existing-project branch asks how polished the spec needs to be (minimal feature-spec vs full feature flow), then routes to `/design-engineer:development`. Use this when the user wants a new capability rather than an edit to something that already exists.
- **Free-form scoped edit (the workhorse)** → restate the exact element, file, and property FIRST (the guardrail where the real friction lives), then locate → edit → Playwright-verify → scoped PR. Reach for the spec-driven layer, a workflow, or an agent when the change genuinely warrants it.

Every front-door ends up feeding the same scoped-edit loop. Dispatch is decided AFTER the clarify step, matched to what the user described.

**Agent dispatch note**: any Task prompt that dispatches a plugin agent (`frontend-implementer`, `design-system-auditor`, or any other) MUST include a line `PLUGIN_ROOT: <absolute path>` carrying the resolved DESIGN_ENGINEER_PLUGIN_ROOT from your context – agents do not inherit this conversation and cannot resolve the plugin root themselves.

**Skill invocation note**: throughout this file, "load the X skill" or "load the meta-setup skill" means Read the file at `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<skill-name>/SKILL.md` using the Read tool, then follow its instructions inline. NEVER use the `Skill` tool to invoke these skills — they all set `disable-model-invocation: true` in their frontmatter and the Skill tool will reject them.

## Spacer rule (applies to every AskUserQuestion below)

Immediately before EACH `AskUserQuestion` tool call below, end the preceding chat message with this exact 3-line spacer block as its final content:

```
───────────────────
───────────────────
───────────────────
```

The spacer prevents the question panel from overlaying and cutting off your text. No exceptions.

## Onboarding sequence (DESIGN_ENGINEER_PROJECT_STATE = new_to_plugin)

Follow these steps when `/design-engineer:launch` runs and the project state is `new_to_plugin`. Do not skip any step.

### Step 1: Brief intro, then ask project type

**Required first output: a visible chat message.** Before any tool call, emit this exact paragraph as a normal chat message (not a blockquote, not a code block, not a tool result). It's the user's first signal that the command is working — without it the screen looks blank until the question panel pops up.

Design Engineer Plugin – a swiss knife for product design. Research, psychology, prototyping, development – all in one tool. You run one command, it figures out where you are, and opens the right instrument.

After that paragraph is emitted as visible text, then end the chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6) and call `AskUserQuestion`:

- question: "Welcome to Design Engineer Plugin. What brings you here?"
- header: "Project type"
- options:
  - label: "New product", description: "Starting from scratch – I have an idea or a problem I want to solve"
  - label: "Existing project", description: "I already have a product, codebase, or designs – I want to improve, review, or add features"

After receiving the answer, continue to the matching path below (Path A or Path B based on the Step 1 answer).

### Path A – "New product"

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions starting at Step 2 (Detect Environment). It handles the full new-product setup. Skip Steps 2–4 below. (Do NOT use the `Skill` tool.)

### Path B – "Existing project"

Continue with Steps 2–4 below. Do not skip any.

#### Step 2: Run setup

**Required first output: a visible chat message acknowledging the user's project-type choice** (1–2 sentences, e.g. "Got it – picking up on an existing project. Let me take a quick look at your setup first."). Then:

a) Run `detect-environment.sh` from `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/scripts/detect-environment.sh`. Do NOT launch Explore agents or scan the project separately.

b) Create `.design-engineer-plugin/` directory and write `config.yaml` inside it with `project_type` and the detected environment. The `goal` field is appended later, in Step 4, once the user has picked a starting point – do not write a placeholder goal here.

b.5) **Project context check** (Path B / Existing project only – skip on Path A). The `detect-environment.sh` output above contains a 'Project Context Detection' section with lines like `existing_design_system: <path>`, `existing_brand_docs: <file>`, `existing_specs: <dir>`, `shipped_ui: true|false`, `component_count: <n>`. Now:

  i) Show the user what was detected, in plain language. Example: "Looks like an established project – found a design-system folder at `src/design-system/`, a long README that mentions an established brand voice, and 34 components shipped under `app/`." Keep it 2–4 sentences, no jargon.

  ii) Ask ONE `AskUserQuestion` (with spacer above the call):
  - question: "Anything else outside this repo I should know about?"
  - header: "Off-repo refs"
  - multiSelect: true
  - options:
    - label: "Figma project", description: "Designs / design system live in a Figma file"
    - label: "Docs or tracker", description: "Notion / Confluence specs, or a Linear / Jira tracker"
    - label: "External design-system page", description: "Storybook, Zeroheight, or similar published reference"
    - label: "No, that's everything", description: "What I detected is the full picture"

  If "Docs or tracker" is selected, ask in chat which specific tools (Notion, Confluence, Linear, Jira) before writing the config. The user can also pick "Other" to type a custom reference.

  iii) Append a `project:` section to the `config.yaml` you wrote in (b), with these fields under `project.context`: `existing_design_system` (true|false|`<path>`), `existing_brand_docs` (true|false|`<location>`), `existing_specs` (true|false|`<location>`), `shipped_ui` (true|false), `component_count` (integer), `off_repo_references` (list of strings – one per Figma/Notion/Linear/etc. selection plus any "Other" custom text). This is the source of truth that biased `ux-*` skills will read to decide whether to skip-check or augment.

c) Scaffold `design/` folder via `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/scripts/init-project-structure.sh`.

d) Show brief environment results in plain language. Only show tech stack and tool connections. Do NOT show Git status, CLAUDE.md status, or developer internals.

#### Step 3: Notifications

a) **Sound notifications first.** The sound opt-in is a top-level `sound:` key (`enabled` or `muted`) in the project's `.design-engineer-plugin/config.yaml`. The config you wrote in Step 2 (b) has no `sound:` key yet, so the effective current state comes from the legacy global flag – detect it by running:

```bash
test -f ~/.claude/de-sound-enabled && echo present || echo absent
```

Present = sounds currently on (a pre-per-project opt-in); absent = sounds currently off.

End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6) before each AskUserQuestion below.

If absent (sounds currently off), ask via AskUserQuestion:
- question: "Sound notifications are currently off. Enable them?"
- header: "Sounds"
- options:
  - label: "Yes (Recommended)"
    description: "I'll get a chime when Claude finishes a response and when Claude needs my input – in this project only."
  - label: "Keep muted"
    description: "Leave sounds off. Toggle later with /design-engineer:mute-unmute-sound."
- multiSelect: false

If present (sounds currently on), ask:
- question: "Sound notifications are currently on. Keep them?"
- header: "Sounds"
- options:
  - label: "Yes (Recommended)", description: "Keep the chime on Stop and Notification for this project."
  - label: "No, mute them", description: "Keep this project silent."
- multiSelect: false

Apply the choice immediately – the `sound:` key is a CWD write into the config.yaml from Step 2 (b), so no paste command is needed for sounds:

- On "Yes (Recommended)": append a top-level `sound: enabled` line to `.design-engineer-plugin/config.yaml`. Confirm: "Sounds are on for this project. You'll hear a chime when Claude finishes a response and a different one when Claude needs your input."
- On "Keep muted" or "No, mute them": append a top-level `sound: muted` line (explicit, so a leftover legacy flag can't re-enable sounds here). Confirm: "Sounds stay off for this project. Toggle anytime with /design-engineer:mute-unmute-sound."

Leave the legacy global flag `~/.claude/de-sound-enabled` untouched – other projects configured before the per-project key still read it, and the explicit `sound:` key written above takes precedence for this project.

b) **Status line.** Explain: "The status line appears below your prompt and shows your model, how much context you have used, and your usage limits."

Then immediately ask via `AskUserQuestion` (spacer above). Do NOT use the built-in `statusline-setup` agent. On approval, install it yourself by running the command below with your shell — it writes to `~/.claude`, so Claude Code will ask you to approve one command. Only if that write is blocked (Auto permission mode can deny writes outside the working directory) fall back to the paste block in (c).

- question: "Install the status line?"
- header: "Status line"
- options:
  - label: "Install it", description: "I'll install it for you – you just approve one prompt"
  - label: "Skip", description: "Re-run /design-engineer:launch later if I change my mind"
- multiSelect: false

On "Install it", the status-line command for the paste block is (substituting the resolved plugin root for `${DESIGN_ENGINEER_PLUGIN_ROOT}`):

```
mkdir -p ~/.claude/hooks && cp ${DESIGN_ENGINEER_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js && node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};s.statusLine={type:"command",command:"node "+require("os").homedir()+"/.claude/hooks/de-statusline.js"};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Status line installed.")'
```

c) **Run the install.** If the user opted in, run the status-line command from (b) yourself with your shell (substitute the resolved plugin root for `${DESIGN_ENGINEER_PLUGIN_ROOT}`). It writes to `~/.claude`, so Claude Code will prompt you to approve one command — that is expected. On success, confirm: "Status line installed — it appears on your next prompt." If the user skipped, write nothing and move straight to Step 4.

**Fallback (only if the write is blocked).** If Auto permission mode denies the write, present the command as a paste block for the user to run instead:

````
The install needs to write to ~/.claude, which is blocked here. Paste this into your next prompt (the leading `!` runs it as a shell command):

! mkdir -p ~/.claude/hooks && cp ${DESIGN_ENGINEER_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js && node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};s.statusLine={type:"command",command:"node "+require("os").homedir()+"/.claude/hooks/de-statusline.js"};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Status line installed.")'
````

**If you used the fallback, STOP and wait.** Do not move on to Step 4 or any design work while a manual command is pending — that leaves the user mid-install while you barrel ahead. End your turn after presenting the command and wait. When the user runs it (or its output appears), or they explicitly say to skip the status line, acknowledge in one line and continue to Step 4. The automatic path in (c) does not need this — the approval prompt already pauses the turn.

#### Step 4: Ask the starting point, then clarify and dispatch

Say "You're all set. Let's get started." then show: "Tip: Run `/design-engineer:help` anytime to see all available commands and capabilities."

Then run the front-door ask exactly as **Step I1** above defines it: the same lead-in sentence, the canonical 3-horizontal-rule spacer, and the same `AskUserQuestion` (question, header, options, multiSelect). Do not restate or vary the options here – Step I1 is the single source for the front-door question.

After the user picks a front-door (or types free-form text via "Other"), append a `goal` field to the `config.yaml` written in Step 2: the chosen front-door label plus any free-form text the user typed.

A front-door is a conversational entry, not a dispatch trigger. Now continue the **iterate flow** above at **Step I2: clarify, read context, then dispatch** – ask for the specifics, read `project.context` from the config you just wrote, then dispatch per the **Task→dispatch map** (the single source of truth above). Do NOT auto-spawn an agent or workflow on the front-door selection alone.

## Optional advisor consult for the loaded skill

After environment detection completes (tech stack identified, tools enumerated, project type inferred) but before committing to a recommended onboarding path, the loaded skill (`meta-setup`) MAY consult the advisor when the project-type inference is genuinely ambiguous. It is optional, not a required checkpoint. When it would help, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions with: detection results, inferred project type, the path it's about to recommend, and "any course correction before I show this to the user?" Apply the advice or use the reconcile pattern. (As elsewhere in this plugin, advisor is loaded via Read, not the `Skill` tool.) Skip it when detection is unambiguous or the user invoked `/design-engineer:launch` with explicit arguments.
