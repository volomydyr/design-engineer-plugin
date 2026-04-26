---
name: dev-github-workflow
description: "Automates Git workflow – commits, branches, PRs, and merges. Use when committing changes, or invoked automatically during plan execution after each approved phase. Do NOT use for Git concept education; see the github-for-designers.md reference instead."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Git Workflow Automation

Handles commits, branches, pull requests, and merges. Works in two modes: automatic (called during plan execution after each approved phase) and manual (user invokes directly to commit changes).

For Git concepts and educational content, see [github-for-designers.md](./references/github-for-designers.md).

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) check the current git state and branch, 2) determine what to include in the commit, 3) generate a commit message following Conventional Commits format, 4) commit and push after your approval." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with Git basics – commits, branches, and pull requests. If yes, give a one-sentence refresher on the Conventional Commits format used here. If no, explain it in simple terms: Git tracks every change you make so you can go back if something breaks – commits are save points, branches are parallel versions, and PRs are how you merge work back together. Refer to [github-for-designers.md](./references/github-for-designers.md) for a deeper walkthrough.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding. (In automatic mode during plan execution, skip Step 0 – the plan workflow already established context.)

---

## Repo Visibility

Before creating a GitHub repository, ask:

```
question: "Would you like this repo to be public or private?"
header: "Repo visibility"
options:
  - label: "Private (recommended)"
    description: "Only you can see the code – safe for proprietary or in-progress work"
  - label: "Public"
    description: "Anyone can see the code – good for open-source projects"
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one option
```

Default to private. **BLOCKING REQUIREMENT**: Wait for the user's answer before creating the repo.

---

## Commit Message Format

All commits follow Conventional Commits. The footer (`Built with design-engineer – ...`) is **scoped** — it appears only when the plugin is actively driving the commit (Mode 1, post-plan-approval), NOT on user-invoked manual commits (Mode 2). This keeps unrelated user work attribution-free.

### Mode 1 commit format (plan-driven — includes plugin attribution)

```
type(scope): brief description

Phase N – what was accomplished

Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin
```

### Mode 2 commit format (manual user-invoked — no plugin footer)

```
type(scope): brief description

[optional body]
```

Claude Code's default Co-Authored-By trailer is disabled at install via the `attribution` setting in `~/.claude/settings.json` (set during `/design-engineer:start`), so neither mode includes it.

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, design tokens |
| `test` | Adding or updating tests |
| `chore` | Build, config, tooling changes |

### Rules

- **Description**: imperative mood, one line, no period ("add dark mode toggle" not "added dark mode toggle.")
- **Scope**: area of the codebase – component name, page name, or feature area (e.g., `settings`, `auth`, `dashboard`)
- **Body**: optional – include phase context during plan execution, skip for standalone commits if the description is sufficient
- **Footer**: present in **Mode 1 only** (plan-driven commits). Mode 2 (manual user-invoked) commits do NOT include the plugin footer — that's user work potentially unrelated to the plugin pipeline.

---

## Mode 1: Automatic (during plan execution)

Called after the user approves a plan phase. Receives context from the plan workflow.

### Steps

1. **Check branch state**: If on `main` or `master`, this should not happen – the plan workflow creates a feature branch at the start. If somehow on main, warn and ask the user before proceeding.

2. **Stage phase files**: Stage only files changed in this phase. Use `git diff --name-only` to identify changed files, then `git add` each one specifically. Never use `git add .` or `git add -A`.

3. **Divergence advisor checkpoint**: Before drafting the commit message, evaluate whether this phase's actual implementation diverged from the approved plan in any non-trivial way (added scope, dropped checklist items, changed approach mid-phase, replaced one technique with another). If yes, invoke the `advisor` skill (`skills/advisor/`) with: the divergence summary, the rationale, and "I'm about to commit this divergence — any course correction before it lands?" Apply the advice or use the reconcile pattern. Skip on phases where implementation matched the checklist exactly.

4. **Generate commit message**: Build from phase context:
   - Type: infer from what was done (new files → `feat`, bug fixes → `fix`, restructuring → `refactor`)
   - Scope: infer from file paths (shared directory name or feature area)
   - Description: one-line summary of what the phase accomplished
   - Body: "Phase N – [objective from the plan]"
   - Footer: attribution line

5. **Commit and push**: `git commit` with the message, then `git push` to the remote.

6. **Report**: Brief confirmation – "Committed phase N: [description]. Pushed to [branch-name]."

---

## Mode 2: Manual (user invokes directly)

User says "commit", "push to github", "send to github", or similar.

### Steps

1. **Check git state**: Run `git status` to see what's changed. If nothing to commit, say so and stop.

2. **Ask what to include**:

```
question: "What would you like to commit?"
header: "Commit scope"
options:
  - label: "All current changes"
    description: "Stage and commit everything that's been modified or added"
  - label: "Specific files"
    description: "I will tell you which files to include"
  - label: "Review changes first"
    description: "Show me what changed, then I will decide"
```

```
multiSelect: false  # User must choose one commit scope
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

3. **Check branch state**: If on `main` or `master`, ask:

```
question: "You're on the main branch. How should we handle this?"
header: "Branch"
options:
  - label: "Commit to main"
    description: "Commit directly to main (fine for small changes)"
  - label: "Create a feature branch first"
    description: "Create a branch, commit there, then you can PR later"
```

```
multiSelect: false  # User must choose one branch strategy
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

4. **Generate commit message**: Analyze the changes and draft a Mode-2 message — **no plugin footer**, since this is user-driven work that may be unrelated to the plugin's pipeline. Present it for approval before committing:

   > **Proposed commit:**
   > ```
   > feat(dashboard): add usage chart with weekly breakdown
   > ```
   > Approve or edit?

5. **Commit and push**: After approval, commit and push.

6. **Report**: Brief confirmation with branch name and commit hash.

---

## Branch Management

### Creating feature branches

When a plan is approved and implementation begins:
- Branch name: `feat/[plan-name-slug]` (e.g., `feat/dark-mode-settings`)
- Create from current main: `git checkout -b feat/plan-name`
- Push with tracking: `git push -u origin feat/plan-name`

### PR creation

**Mode 1 — plan-driven** (after all plan phases are committed): include plugin footer in the PR description.
1. Create PR: `gh pr create --title "type(scope): plan description" --body "## Summary\n[plan summary]\n\nBuilt with design-engineer – https://github.com/volomydyr/design-engineer-plugin"`

**Mode 2 — manual user-invoked** (user says "create a PR" outside a plan): no plugin footer in the PR description.
1. Create PR: `gh pr create --title "type(scope): description" --body "## Summary\n[summary]"`
2. Ask the user:

```
question: "The PR is ready. How would you like to merge?"
header: "Merge"
options:
  - label: "Squash and merge"
    description: "Combines all phase commits into one clean commit on main (recommended)"
  - label: "Merge commit"
    description: "Preserves all phase commits in main's history"
  - label: "Don't merge yet"
    description: "Leave the PR open for review"
```

```
multiSelect: false  # User must choose one merge strategy
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

3. If merge requested: `gh pr merge --squash` or `gh pr merge --merge`

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – an unclear commit scope, an ambiguous change – ask via AskUserQuestion. Never fill gaps silently. Never invent commit descriptions, branch names, or change summaries that don't match actual git state. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their preferred branch strategy, commit scope, merge approach
2. **Conventional Commits standard** – message format
3. **AI suggestions** – commit type inference, scope detection, message drafting

---

## What Comes Next

After committing, suggest the next logical step based on context:
- During plan execution: proceed to the next phase
- After feature completion: create a PR or suggest the next feature
- Standalone: return to whatever the user was doing

---

## Resource Files

- [github-for-designers.md](./references/github-for-designers.md) – Git concepts, commit discipline, safety practices, and recovery options
