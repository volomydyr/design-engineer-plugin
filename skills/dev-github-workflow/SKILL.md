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

## Commit Message Format

All commits follow Conventional Commits with plugin attribution:

```
type(scope): brief description

Phase N – what was accomplished

Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin
```

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
- **Footer**: always present – plugin attribution on the last line

---

## Mode 1: Automatic (during plan execution)

Called after the user approves a plan phase. Receives context from the plan workflow.

### Steps

1. **Check branch state**: If on `main` or `master`, this should not happen – the plan workflow creates a feature branch at the start. If somehow on main, warn and ask the user before proceeding.

2. **Stage phase files**: Stage only files changed in this phase. Use `git diff --name-only` to identify changed files, then `git add` each one specifically. Never use `git add .` or `git add -A`.

3. **Generate commit message**: Build from phase context:
   - Type: infer from what was done (new files → `feat`, bug fixes → `fix`, restructuring → `refactor`)
   - Scope: infer from file paths (shared directory name or feature area)
   - Description: one-line summary of what the phase accomplished
   - Body: "Phase N – [objective from the plan]"
   - Footer: attribution line

4. **Commit and push**: `git commit` with the message, then `git push` to the remote.

5. **Report**: Brief confirmation – "Committed phase N: [description]. Pushed to [branch-name]."

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

4. **Generate commit message**: Analyze the changes and draft a message following the format. Present it to the user for approval before committing:

   > **Proposed commit:**
   > ```
   > feat(dashboard): add usage chart with weekly breakdown
   >
   > Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin
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

### PR creation (when plan completes)

After all plan phases are committed:
1. Create PR: `gh pr create --title "type(scope): plan description" --body "## Summary\n[plan summary]\n\nBuilt with design-engineer – https://github.com/volomydyr/design-engineer-plugin"`
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

3. If merge requested: `gh pr merge --squash` or `gh pr merge --merge`

---

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
