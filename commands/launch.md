---
name: design-engineer:launch
description: Universal entry point. Launches the plugin for any project state — new, in-progress, or already shipped.
argument-hint: ""
---

# Design Engineer – Launch

<context> #$ARGUMENTS </context>

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command body references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

## Routing

**Step 0 (BLOCKING — run before anything else): re-detect state from disk.** The `DESIGN_ENGINEER_PROJECT_STATE` value injected by the start hook can lag behind disk reality (cached old hook version, hook fired before config was created, hook ran in a different cwd, etc.). Trust the disk, not the injected value:

1. Run via Bash: `test -f .design-engineer-plugin/config.yaml && cat .design-engineer-plugin/config.yaml || echo "NO_CONFIG"`.
2. Branch on what you read:
   - **`NO_CONFIG`** → user is genuinely new in this directory. Follow the **Onboarding sequence** below in this file. Do not skip any step.
   - **Config exists with `project_type: new` AND a `resume:` block** → returning user with active pipeline state. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (resume state). Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true` and the Skill tool will reject them.
   - **Config exists with `project_type: new` but no `resume:` block** → returning user, no active pipeline. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (config summary).
   - **Config exists with `project_type: existing`** → existing-project user is returning. Acknowledge in one sentence what you found in their config (mode, last goal, any in-progress feature folder under `.design-engineer-plugin/design/features/`), then ask via AskUserQuestion (with spacer):
     - question: "Welcome back. What would you like to do?"
     - header: "Goal"
     - options match the Step 2 Question 1 set below (Review my project / Implement from Figma / Design a new feature / Prepare project for AI coding).
     - multiSelect: false
     - After the answer, route directly to the matching `/design-engineer:` command. Do NOT re-run the project-type question, do NOT re-scaffold `design/`, do NOT ask about the status line or sound again — those were settled on the original onboarding run.

The `DESIGN_ENGINEER_PROJECT_STATE` injected value is now an HINT only. The disk read above is the source of truth.

Skip the **Onboarding sequence** entirely if the disk read found a config.

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

After receiving the answer, follow the matching path.

### Path A – "New product"

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions starting at Step 2 (Detect Environment). It handles the full new-product setup. Skip Steps 2–4 below. (Do NOT use the `Skill` tool.)

### Path B – "Existing project"

Continue with Steps 2–4 below. Do not skip any.

#### Step 2: Ask goal AND mode in ONE AskUserQuestion call

**Required first output: a visible chat message acknowledging the user's project-type choice and previewing what's next.** Without this, the user sees only a spacer above the question panel — feels broken. Emit one short paragraph (1–2 sentences) like:

> Got it — picking up on an existing project. Two quick questions and I'll route you to the right tool.

(Adapt the wording to be natural; don't render the blockquote literally — that's just an example.) Then end the chat message with the canonical 3-horizontal-rule spacer and call AskUserQuestion with both questions on the same screen.

Question 1:
- question: "What would you like to do?"
- header: "Goal"
- options:
  - label: "Review my project", description: "Find issues with UX, accessibility, visual quality, or psychology"
  - label: "Implement from Figma", description: "Turn Figma designs into production code"
  - label: "Design a new feature", description: "Think through a new feature before building – research, strategy, design"
  - label: "Prepare project for AI coding", description: "Generate the rules file (CLAUDE.md), wire up helper agents, and set up testing — useful before you start building features"

Question 2:
- question: "How do you want to work?"
- header: "Mode"
- options:
  - label: "Guided mode (Recommended)", description: "I explain my thinking, show findings one at a time, and wait for your input at each step"
  - label: "Autopilot", description: "I plan and execute everything, then show you the results. Faster but you review after, not during."

#### Step 3: Run setup silently, then ask status line

a) Run `detect-environment.sh` from `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/scripts/detect-environment.sh`. Do NOT launch Explore agents or scan the project separately.

b) Create `.design-engineer-plugin/` directory and write `config.yaml` inside it with `project_type`, selected mode, goal, and detected environment.

b.5) **Project context check** (Path B / Existing project only – skip on Path A). The `detect-environment.sh` output above contains a 'Project Context Detection' section with lines like `existing_design_system: <path>`, `existing_brand_docs: <file>`, `existing_specs: <dir>`, `shipped_ui: true|false`, `component_count: <n>`. Now:

  i) Show the user what was detected, in plain language. Example: "Looks like an established project – found a design-system folder at `src/design-system/`, a long README that mentions an established brand voice, and 34 components shipped under `app/`." Keep it 2–4 sentences, no jargon.

  ii) Ask ONE `AskUserQuestion` (with spacer above the call):
  - question: "Anything else outside this repo I should know about?"
  - header: "Off-repo refs"
  - multiSelect: true
  - options:
    - label: "Figma project", description: "Designs / design system live in a Figma file"
    - label: "Notion / Confluence docs", description: "Specs or brand docs live there"
    - label: "Linear / Jira tracker", description: "Active issues or feature requests live there"
    - label: "External design-system page", description: "Storybook, Zeroheight, or similar published reference"
    - label: "No, that's everything", description: "What I detected is the full picture"

  The user can also pick "Other" to type a custom reference.

  iii) Append a `project:` section to the `config.yaml` you wrote in (b), with these fields under `project.context`: `existing_design_system` (true|false|`<path>`), `existing_brand_docs` (true|false|`<location>`), `existing_specs` (true|false|`<location>`), `shipped_ui` (true|false), `off_repo_references` (list of strings – one per Figma/Notion/Linear/etc. selection plus any "Other" custom text). This is the source of truth that biased `ux-*` skills will read to decide whether to skip-check or augment.

c) Scaffold `design/` folder via `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/scripts/init-project-structure.sh`.

d) Show brief environment results in plain language. Only show tech stack and tool connections. Do NOT show Git status, CLAUDE.md status, or developer internals.

e) Explain: "The status line appears below your prompt and shows your model, how much context you have used, and your usage limits."

e.5) **Sound notifications**. First detect whether `~/.claude/de-sound-enabled` exists by running:

```bash
test -f ~/.claude/de-sound-enabled && echo present || echo absent
```

End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6) before each AskUserQuestion below.

If absent (sounds currently off), ask via AskUserQuestion:
- question: "Sound notifications are currently off. Enable them?"
- header: "Sounds"
- options:
  - label: "Yes (Recommended)"
    description: "I'll get a chime when Claude finishes a response and when Claude needs my input — only inside design-engineer plugin projects."
  - label: "Keep muted"
    description: "Leave sounds off. Toggle later with /design-engineer:mute-unmute-sound."
- multiSelect: false

If present (sounds currently on), ask:
- question: "Sound notifications are currently on. Keep them?"
- header: "Sounds"
- options:
  - label: "Yes (Recommended)", description: "Keep the chime on Stop and Notification."
  - label: "No, mute them", description: "Remove the global opt-in flag."
- multiSelect: false

Apply the choice using the `! <command>` paste pattern (per the user's preference — the plugin should not write outside CWD directly):

- On "Yes (Recommended)" with absent flag: tell the user to paste in their next prompt:

  ```
  ! mkdir -p ~/.claude && touch ~/.claude/de-sound-enabled
  ```

  Confirm: "Sounds will be on globally once you paste that — only inside plugin projects."

- On "Yes (Recommended)" with present flag: no action needed; confirm "Sounds stay on."

- On "Keep muted" with absent flag: no action needed; confirm "Sounds stay off."

- On "No, mute them" with present flag: tell the user to paste:

  ```
  ! rm -f ~/.claude/de-sound-enabled
  ```

  Confirm: "Sounds muted once you paste that. Toggle anytime with /design-engineer:mute-unmute-sound."

f) Ask status line question. Do NOT use the built-in `statusline-setup` agent, and do NOT write to `~/.claude/settings.json` or copy files to `~/.claude/hooks/` yourself — Auto mode's permission classifier blocks writes outside the working directory. Instead, present the install command to the user and ask them to run it themselves in their next prompt.

Output exactly this block to the chat (substituting the resolved plugin root for `${DESIGN_ENGINEER_PLUGIN_ROOT}`):

````
To install the status line, paste this into your next prompt (the leading `!` runs it as a shell command):

! mkdir -p ~/.claude/hooks && cp ${DESIGN_ENGINEER_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js && node -e 'const f=require("os").homedir()+"/.claude/settings.json";const fs=require("fs");let s={};try{s=JSON.parse(fs.readFileSync(f,"utf8"))}catch{};s.statusLine={type:"command",command:"node "+require("os").homedir()+"/.claude/hooks/de-statusline.js"};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(s,null,2));console.log("Status line installed.")'
````

Then `AskUserQuestion` (spacer above):
- question: "Status line install"
- header: "Status line"
- options:
  - label: "I'll paste the command above", description: "I'll run the install command in my next prompt"
  - label: "Skip", description: "Re-run /design-engineer:launch later if I change my mind"

#### Step 4: Hand off to the goal-matching command

Say "You're all set. Let's get started." then show: "Tip: Run `/design-engineer:help` anytime to see all available commands and capabilities."

Then run the `/design-engineer:` slash command matching the goal selected in Step 2 (these are commands, not skills — invoke them as slash commands):

| Goal selected | Command to load |
| --- | --- |
| Review my project | `/design-engineer:review` |
| Implement from Figma | `/design-engineer:development` |
| Design a new feature | `/design-engineer:discovery` |
| Prepare project for AI coding | `/design-engineer:development setup` |

## Advisor checkpoint contract for the loaded skill

After environment detection completes (tech stack identified, tools enumerated, project type inferred) but **before** committing to a recommended onboarding path or kickoff plan, the loaded skill (`meta-setup-welcome` or `meta-setup`) MUST consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions with: detection results, inferred project type, the path it's about to recommend, and "I'm about to commit to this interpretation of the project – any course correction before I show it to the user?" Apply the advice or use the reconcile pattern. (As elsewhere in this plugin, advisor is loaded via Read, not the `Skill` tool.)

This is the docs' "before committing to an interpretation" call ([advisor docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)). Onboarding is irreversibly directional – wrong project-type inference cascades through every later phase. Skip only when the user invoked `/design-engineer:launch` with explicit arguments that make interpretation unambiguous.
