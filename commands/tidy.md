---
description: Wipe disposable working artifacts under .design-engineer-plugin/temporary/. Use before commit, or anytime the working tree feels noisy.
argument-hint: ""
allowed-tools: Bash(test -f .design-engineer-plugin/config.yaml && echo "OK" || echo "NO_CONFIG"), Bash(bash -c 'TEMP_DIR=".design-engineer-plugin/temporary"; if [ ! -d "$TEMP_DIR" ]; then echo "EMPTY"; exit 0; fi; FILE_COUNT=$(find "$TEMP_DIR" -mindepth 1 -type f 2>/dev/null | wc -l | tr -d " "); DIR_COUNT=$(find "$TEMP_DIR" -mindepth 1 -type d 2>/dev/null | wc -l | tr -d " "); TOTAL_SIZE=$(du -sh "$TEMP_DIR" 2>/dev/null | cut -f1); echo "FILES=$FILE_COUNT DIRS=$DIR_COUNT SIZE=$TOTAL_SIZE"'), Bash(bash -c 'find .design-engineer-plugin/temporary -mindepth 1 -delete 2>/dev/null; mkdir -p .design-engineer-plugin/temporary/scratch .design-engineer-plugin/temporary/playwright .design-engineer-plugin/temporary/intermediate')
---

# Tidy disposable working artifacts

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters).

## What this command does

The plugin keeps disposable working artifacts (Playwright debug captures, intermediate analysis dumps, exploratory drafts) under `.design-engineer-plugin/temporary/`. That directory is git-ignored and purged automatically at completion milestones (whenever the full `/design-engineer:document` documentation run happens – end of the discovery spine, end of development, or an explicit invocation). This command does the same purge **on demand** — useful before a commit, or anytime the working tree feels noisy.

The command never touches durable deliverables (`design/`, `prototype/`, `plans/`, `memory/`). It only wipes `temporary/`.

## Step 0: Verify this is a plugin project

Run via Bash:

```bash
test -f .design-engineer-plugin/config.yaml && echo "OK" || echo "NO_CONFIG"
```

If the output is `NO_CONFIG`, exit immediately with the message:

> This isn't a design-engineer plugin project. Run `/design-engineer:launch` first to set one up.

## Step 1: Count and summarize what will be purged

Run via Bash:

```bash
bash -c 'TEMP_DIR=".design-engineer-plugin/temporary"; if [ ! -d "$TEMP_DIR" ]; then echo "EMPTY"; exit 0; fi; FILE_COUNT=$(find "$TEMP_DIR" -mindepth 1 -type f 2>/dev/null | wc -l | tr -d " "); DIR_COUNT=$(find "$TEMP_DIR" -mindepth 1 -type d 2>/dev/null | wc -l | tr -d " "); TOTAL_SIZE=$(du -sh "$TEMP_DIR" 2>/dev/null | cut -f1); echo "FILES=$FILE_COUNT DIRS=$DIR_COUNT SIZE=$TOTAL_SIZE"'
```

Run it as a single line exactly as written above – the exact string is pre-permitted via this command's `allowed-tools` frontmatter, so any reformatting re-triggers a permission prompt.

Parse the output. If `EMPTY` or `FILES=0`, surface to the user:

> `.design-engineer-plugin/temporary/` is already empty. Nothing to tidy.

Then exit.

Otherwise, surface a one-line summary:

> Found `<FILE_COUNT>` files (`<TOTAL_SIZE>`) across `<DIR_COUNT>` subdirs in `.design-engineer-plugin/temporary/`.

## Step 2: Ask for confirmation

End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6).

Then `AskUserQuestion`:
- question: `"Purge <FILE_COUNT> disposable files from .design-engineer-plugin/temporary/?"` (substitute the actual count)
- header: `"Tidy"`
- options:
  - label: `"Yes (Recommended)"`, description: `"Wipe all files under temporary/. Safe — these are working artifacts, never deliverables."`
  - label: `"No, leave them"`, description: `"Keep the files for now. Re-run /design-engineer:tidy whenever you want."`
- multiSelect: false

## Step 3: Apply the choice

**On "Yes (Recommended)"** — run via Bash:

```bash
bash -c 'find .design-engineer-plugin/temporary -mindepth 1 -delete 2>/dev/null; mkdir -p .design-engineer-plugin/temporary/scratch .design-engineer-plugin/temporary/playwright .design-engineer-plugin/temporary/intermediate'
```

Then surface to the user:

> Purged `<FILE_COUNT>` files. `temporary/` is empty (subdirs preserved).

**On "No, leave them"** — surface:

> Kept `<FILE_COUNT>` files in temporary/. Re-run `/design-engineer:tidy` later when ready.

## Behavior notes

- This command is safe to run any number of times. Files in `temporary/` are by definition disposable.
- The automatic purge at completion milestones (via `/design-engineer:document` Step 7) does the same thing without asking. This command is for mid-session manual cleanup.
- Deliverables are written only to their canonical paths under `.design-engineer-plugin/design/<subdir>/`; `temporary/` holds working artifacts only, so a tidy never removes real work.
- If the user has work in `temporary/` they want to keep, promote it to a canonical path under `.design-engineer-plugin/design/<subdir>/` BEFORE running `/design-engineer:tidy`.
