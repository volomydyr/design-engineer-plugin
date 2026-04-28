---
name: design-engineer:start
description: Universal entry point. New projects get setup, returning projects resume where they left off, existing projects get a capability guide.
argument-hint: ""
---

# Design Engineer – Start

<context> #$ARGUMENTS </context>

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command body references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

## Routing

Check your context for `DESIGN_ENGINEER_PROJECT_STATE:`.

- If `new_to_plugin` → follow the **Onboarding sequence** below in this file. Do not skip any step.
- If `returning_with_resume` → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (resume state). Do NOT use the `Skill` tool — these skills have `disable-model-invocation: true` and must be loaded by Reading the file.
- If `returning_no_resume` → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions, Path A (config summary).
- If not found → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/SKILL.md` and follow its instructions; it handles detection as fallback.

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

Follow these steps when `/design-engineer:start` runs and the project state is `new_to_plugin`. Do not skip any step.

### Step 1: Brief intro, then ask project type

Output this text first (exactly as written):

> "Design Engineer Plugin – a swiss knife for product design. Research, psychology, prototyping, development – all in one tool. You run one command, it figures out where you are, and opens the right instrument."

Then ask via `AskUserQuestion` (with the spacer above the call):

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

Both questions appear on the same screen. Spacer above the call.

Question 1:
- question: "What would you like to do?"
- header: "Goal"
- options:
  - label: "Review my project", description: "Find issues with UX, accessibility, visual quality, or psychology"
  - label: "Implement from Figma", description: "Turn Figma designs into production code"
  - label: "Design a new feature", description: "Think through a new feature before building – research, strategy, design"
  - label: "Set up development", description: "Configure the AI build pipeline – CLAUDE.md, agents, testing, GitHub"

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

f) Ask status line question. Do NOT use the built-in `statusline-setup` agent. Instead copy the script manually:

```bash
cp ${DESIGN_ENGINEER_PLUGIN_ROOT}/hooks/de-statusline.js ~/.claude/hooks/de-statusline.js
```

Then read `~/.claude/settings.json` and set `statusLine` to `{"type": "command", "command": "node ~/.claude/hooks/de-statusline.js"}`, write back.

`AskUserQuestion` (spacer above):
- question: "Would you like to install the status line?"
- header: "Status line"
- options:
  - label: "Yes (Recommended)", description: "Shows model, context usage, and rate limits below every prompt"
  - label: "No", description: "Skip – re-run /design-engineer:start later to install"

#### Step 4: Hand off to the goal-matching command

Say "You're all set. Let's get started." then show: "Tip: Run `/design-engineer:help` anytime to see all available commands and capabilities."

Then run the `/design-engineer:` slash command matching the goal selected in Step 2 (these are commands, not skills — invoke them as slash commands):

| Goal selected | Command to load |
| --- | --- |
| Review my project | `/design-engineer:review` |
| Implement from Figma | `/design-engineer:dev` |
| Design a new feature | `/design-engineer:design` |
| Set up development | `/design-engineer:dev` |

## Advisor checkpoint contract for the loaded skill

After environment detection completes (tech stack identified, tools enumerated, project type inferred) but **before** committing to a recommended onboarding path or kickoff plan, the loaded skill (`meta-setup-welcome` or `meta-setup`) MUST consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions with: detection results, inferred project type, the path it's about to recommend, and "I'm about to commit to this interpretation of the project – any course correction before I show it to the user?" Apply the advice or use the reconcile pattern. (As elsewhere in this plugin, advisor is loaded via Read, not the `Skill` tool.)

This is the docs' "before committing to an interpretation" call ([advisor docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)). Onboarding is irreversibly directional – wrong project-type inference cascades through every later phase. Skip only when the user invoked `/design-engineer:start` with explicit arguments that make interpretation unambiguous.
