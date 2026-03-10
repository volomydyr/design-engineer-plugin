# GitHub for Designers

## What GitHub Actually Is

GitHub is a place where you store your project's code online. Since any codebase is literally just a folder with files and other folders inside, it works like Google Drive in that sense. But it also tracks every change, lets you revert to any previous version, and enables collaboration when needed.

You might think "I am not collaborating with anyone, why do I need GitHub?" The answer is version control -- project history. When you open an IDE for the first few times, it is very common to break things. First, you build something great, then you do another iteration, and mess it all up to a state where it is not possible to fix. GitHub prevents such situations by letting you go back in the history of changes.

## Core Concepts

### Commits

When you take your updated code from the IDE and push it to GitHub. Think of it as saving a copy of your work with a small comment about what has changed since the last update -- like creating a restore point.

### Branches

Different versions of the same codebase. There is always a main branch where everything gets uploaded to when it is approved. And there are also feature branches where you commit code while working on a specific task.

### Pull Requests (PRs)

When you take the committed code that is already on GitHub (pushed to a dedicated branch) and create a request for someone to review it. Useful even for solo developers as a self-review checkpoint -- it forces you to look at all changes before merging them into the main branch.

### Merge

The action of applying code from a feature branch to the main branch. After a pull request is reviewed (by someone else or by yourself), you merge it.

### Merge Conflicts

When different changes affect the same part of the code. If multiple developers (or multiple AI sessions) change the same file in incompatible ways, you need to decide which version to keep or how to combine them.

## Commit Discipline

This is the most important habit to build. The rule of thumb:

### When to Commit

- **After every feature AI implements** -- immediately, before moving to the next task
- **After any critical bug fix** -- the fix is valuable and should be preserved
- **Before working on anything unfamiliar** -- if the next step might break things, save the current state first
- **Before any risky operation** -- refactoring, restructuring, or trying a new approach

### Why This Matters

One developer once had to recreate an entire project from scratch because they were not using GitHub and AI broke everything beyond repair. The lesson: commit early, commit often.

The temptation is always to do "just one more change" before committing. It usually ends badly. Save the state that works before experimenting with the next thing.

### Commit Messages

Keep them descriptive but brief:
- "Add user authentication with Google and Apple Sign-In"
- "Fix navigation crash when returning from settings"
- "Implement home screen with category cards"

The message should tell future-you what changed without needing to look at the code.

## Staging vs. Discarding

When you update code, those changes exist only on your computer. Before you commit, you need to stage the changes -- choosing which updated files to include in your commit.

### The Danger Zone

In IDEs like Cursor, the staging and discard actions are placed close together in the interface. One misclick can erase hours of work:

- **Stage** = "I want to include these changes in my next commit"
- **Discard** = "I want to throw away these changes permanently"

Be extremely careful. Always verify you are clicking the right button, especially when you are tired or working late.

### What Happens After a Misclick

If you accidentally discard changes:
1. **Check IDE Timeline**: Some IDEs (like Cursor) have a local history feature that might recover individual files
2. **Check auto-save backups**: Some editors save temporary copies
3. **Accept the loss**: If no backup exists, you will need to re-implement

The Timeline feature works but is painful -- you need to revert each file one by one, know the file names, their locations, and which version was correct. GitHub revert, by contrast, restores the entire project to a previous state with one command.

## Terminal Command Safety

Most GitHub actions are done through a terminal. When AI suggests any command, verify it is safe:

- **Ask AI to explain**: If you do not know what a command does, ask AI to explain it in simple terms
- **Do not accept blindly**: Do not run all commands right away, especially when learning
- **Pay attention to destructive commands**: Commands with words like "force," "reset," "delete," or "clean" can permanently remove work
- **Understand your project structure**: Know what files and folders exist, where they are, and what they are called -- this helps you catch mistakes

## Recovery Options

When things go wrong (and they will), here are your recovery options in order of preference:

### 1. Git Revert (Best)

If you committed before things broke, one command restores the entire project:
- Run `git log` to see recent commits
- Find the last good commit
- Ask AI to help you revert to that state

This restores all files at once to the exact state they were in at that commit.

### 2. Branch Checkout

If you are working on a feature branch and it is broken beyond repair:
- Switch back to the main branch (which should be stable)
- Create a new feature branch from main
- Start the feature implementation again with a clean state

### 3. IDE Timeline (Backup)

If you did not commit (learn from this):
- Check your IDE's local history / Timeline feature
- Recover files one by one
- This is tedious but can save most of your work (you might recover around 70% of changes)

### 4. Re-implement (Last Resort)

If no backup exists:
- Use your development status file as a guide for what was built
- Use commit history to understand the sequence of changes
- Ask AI to re-implement based on the same prompts and documents

## Setting Up GitHub

### For a New Project

1. Create a GitHub account (free)
2. Create a new repository on GitHub
3. Connect it to your local project folder (ask AI for the exact commands for your setup)
4. Make your initial commit with the current project state
5. Push to GitHub

### Branching Strategy (Keep It Simple)

For solo work or small teams:
- **main branch**: Always contains working, stable code
- **feature branches**: Create one for each significant feature or change
- Merge feature branches into main when they are stable

You do not need complex branching strategies when starting out. A simple main + feature branches setup is enough.

### IDE Integration

Most IDEs (Cursor, VS Code, etc.) have built-in Git integration:
- A dedicated panel shows changed files
- Buttons for staging, committing, and pushing
- Visual diff showing exactly what changed in each file

Use the IDE interface for routine operations. Use the terminal (or ask AI) for anything more complex.

## Common Mistakes

1. **Not committing often enough** -- the single biggest source of lost work
2. **Committing everything at once** -- stage only the files related to the current feature
3. **Ignoring Git because "I am working alone"** -- version control is about protecting your own work, not just collaboration
4. **Discarding instead of staging** -- always double-check which button you are clicking
5. **Not reading terminal commands before running them** -- one wrong command can undo hours of work
6. **Waiting until a feature is "perfect" before committing** -- commit working intermediate states, not just finished features
