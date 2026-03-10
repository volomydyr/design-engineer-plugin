---
name: dev-github-workflow
description: Teaches and establishes a GitHub workflow for designers entering development. Use when setting up version control for a new project or when the user needs guidance on commits, branches, and recovery strategies.
disable-model-invocation: true
---

# GitHub Workflow for Designers

## Why This Matters

GitHub is essential even if you work alone. It provides version control -- the ability to go back in history when something breaks. Without it, you risk losing work that cannot be recovered.

GitHub is similar to Google Drive: it stores your project's code online. But it also tracks every change, lets you revert to any previous version, and enables collaboration when needed.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Assess Current Setup

```
question: "What is your current GitHub situation?"
header: "GitHub Status"
options:
  - label: "Never used GitHub"
    description: "Need full setup guidance from scratch"
  - label: "Have an account but no repository"
    description: "Need help creating and connecting a repo"
  - label: "Repository exists but I do not use it consistently"
    description: "Need workflow guidance and commit discipline"
  - label: "Active repository -- want to improve workflow"
    description: "Looking for best practices and automation"
```

---

## Step 2: Teach Core Concepts

Using [github-for-designers.md](./references/github-for-designers.md), explain:

### Commits
Save a copy of your work with a small comment about what changed since the last update. Think of it as creating a restore point.

### Branches
Different versions of the same codebase. The main branch holds approved code. Feature branches hold work in progress.

### Pull Requests
A request for someone to review your code before it merges into the main branch. Useful even for solo developers as a self-review checkpoint.

---

## Step 3: Establish Commit Discipline

The most important rule: commit frequently. Specifically:
- After every feature AI implements
- After any critical bug fix
- Before working on anything unfamiliar
- Before any risky operation

---

## Step 4: Teach Safety Practices

### Staging vs. Discarding
When you update code, changes exist only on your computer. Before committing, you stage files -- choosing which changes to include. The staging and discard actions in IDEs are often placed close together. One misclick can erase hours of work.

### Terminal Command Verification
When AI suggests terminal commands, verify they are safe before running them. Ask AI to explain any command you do not understand. Do not accept all commands right away, especially when learning.

### Recovery Options
- **GitHub revert**: one command restores the entire project to a previous commit
- **IDE Timeline**: local history of file changes, recoverable one file at a time (less convenient but works as backup)
- **Branch checkout**: switch to a known-good branch if the current one is broken

---

## Step 5: Set Up the Workflow

Help the user:
1. Create a GitHub repository (or connect to an existing one)
2. Make their first commit with the current project state
3. Set up a branching strategy (main + feature branches for significant work)
4. Configure their IDE's Git integration
5. Practice the commit-push cycle

---

## Decision Hierarchy

1. **User's direct input** -- their preferred workflow, their comfort level
2. **Git best practices** -- commit discipline and safety habits
3. **AI suggestions** -- propose workflow but respect the user's pace

---

## What Comes Next

After GitHub is set up, suggest `dev-context-management` to add status tracking (which GitHub commits complement), or `dev-agent-pipeline` to set up development agents.

---

## Resource Files

- [github-for-designers.md](./references/github-for-designers.md) -- Simplified GitHub workflow with commit rules and safety practices
