---
name: meta-document
description: "Documents knowledge and engineers context for design projects. Stores project status, maintains living context files, and tracks cross-deliverable dependencies. Use when completing a major phase or when context needs to be preserved across sessions. Do NOT use for development context management; see dev-status-tracking instead."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# meta-document Skill

**Purpose:** Document solutions, store project status, and maintain living context files that enable long-term complex projects across sessions, chat compaction, and team handoffs.

## Overview

After any significant work is completed (a design deliverable, a development phase, a psychology audit), this skill captures what was done, what worked, what did not work, and what comes next. It maintains a structured project status file that AI reads at the start of every task, reducing hallucinations and preventing repeated mistakes.

This is not for pet projects that you start and abandon. This is for actual complex projects planned to run for years, potentially becoming million-dollar products with multiple teams working on them.

**Organization:** Each documentation entry is a markdown file with validated YAML frontmatter, stored in `.design-engineer-plugin/design/dev/[category]/`. Live progress (current phase, key decisions, stale dependents) is tracked separately by the `compound-documenter` agent in its project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/` – Anthropic's documented persistence primitive for subagents.

---

<critical_sequence name="compound-documentation" enforce_order="strict">

## 6-Step Process

<step number="1" required="true">
### Step 1: Detect Trigger

**Auto-invoke after:**

- Completion of any pipeline phase (pre-dev, dev, psychology audit)
- User confirms a solution worked ("that fixed it", "looks good", "approved")
- End of any complex multi-step task

**OR manual:** `/design-engineer:document` command

**Document when:**

- A design deliverable was produced or significantly revised
- A development phase completed
- A non-obvious solution was found after multiple attempts
- Decisions were made that future sessions need to know about
- Context that would be lost to chat compaction

**Skip documentation for:**

- Trivial edits (typo fixes, formatting changes)
- Intermediate work that will be superseded
- Information already captured in existing deliverables
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Gather Context

Extract from conversation history:

**Required information:**

- **Activity name**: Which skill or task was performed
- **Phase**: Which pipeline phase this belongs to (Phase 1-4 pre-dev, Phase 5-7 dev)
- **Deliverable**: What was produced (document name, file path)
- **Key decisions**: What decisions were made and why
- **What worked**: Approaches that succeeded
- **What did not work**: Approaches that failed and why
- **Dependencies**: What other deliverables this builds on or feeds into
- **Open questions**: Unresolved issues or assumptions to validate

**Environment details:**

- Tools used (Claude Code, Cursor, Figma, or other AI tools)
- MCP servers involved (if any)
- Token usage concerns (approaching limits, compaction occurred)

**BLOCKING REQUIREMENT:** If the activity name or deliverable is unclear, ask user and WAIT:

```
To document this properly, I need:

1. What activity was just completed?
2. What deliverable was produced? (file name or description)
3. Any decisions that should be recorded for future sessions?

[Continue after user provides details]
```
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Validate Against Schema

Validate the documentation entry against [compound-schema.yaml](./references/compound-schema.yaml).

**Required fields:**

- `activity`, `date`, `phase`, `deliverable_type`, `component`, `status`, `severity`

**BLOCK if validation fails:**

```
YAML validation failed:

Errors:
- deliverable_type: must be one of schema enums, got "[invalid value]"
- phase: must match allowed values

Please provide corrected values.
```

**GATE ENFORCEMENT:** Do NOT proceed until YAML frontmatter passes all validation rules.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Create Documentation Entry

**Agent delegation**: Use the **deliverable-writer** agent to format the final document. Use the Agent tool to spawn it with the content to format. The deliverable-writer has specialized instructions for producing polished, structured deliverable documents.

**Generate filename:** `[activity-name]-[YYYYMMDD].md`

**Sanitization rules:**

- Lowercase
- Replace spaces with hyphens
- Remove special characters except hyphens
- Truncate to reasonable length (< 80 chars)

**Determine category from deliverable_type** using the category mapping in [compound-schema.yaml](./references/compound-schema.yaml).

**Create documentation file:**

```bash
CATEGORY="[mapped from deliverable_type]"
FILENAME="[generated-filename].md"
DOC_PATH="$.design-engineer-plugin/design/dev/${CATEGORY}/${FILENAME}"

mkdir -p "$.design-engineer-plugin/design/dev/${CATEGORY}"
```

**File structure:**

```markdown
---
# Validated YAML frontmatter
activity: [activity name]
date: [YYYY-MM-DD]
phase: [phase]
deliverable_type: [type]
component: [component]
status: [status]
severity: [severity]
tags: [tags]
---

# [Activity Name]

## What Was Done
[Description of the completed work]

## Key Decisions
[Decisions made and rationale]

## What Worked
[Successful approaches]

## What Did Not Work
[Failed approaches and why they failed]

## Deliverable
[File path or description of what was produced]

## Dependencies
[What this builds on, what depends on this]

## Open Questions
[Unresolved issues, assumptions to validate]

## Context for Next Session
[Critical information that must survive chat compaction]
```
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Invoke compound-documenter to update agent memory

Live pipeline state is tracked by the `compound-documenter` agent's project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/`. The agent maintains three structured files:

- **pipeline-state.md** – current phase, last completed skill, next skill, recent deliverables
- **key-decisions.md** – append-only log of cross-cutting decisions affecting 2+ deliverables
- **stale-dependents.md** – downstream deliverables that may need refreshing

**Action**: Use the Agent tool to spawn `compound-documenter` with the context from this session (activity completed, deliverable file path, any cross-cutting decisions). The agent will read its existing memory, gather context, and overwrite/append the appropriate files.

You do not write to `.claude/agent-memory/...` directly from this skill – the agent owns its memory directory. Just invoke it with the context.

**Why agent memory and not a status.md file at the project root?** The agent-memory directory is Anthropic's documented persistence primitive (`memory: project` frontmatter on the agent). It is project-local, version-controllable, and survives across sessions reliably. Writing to a project-root `status.md` from this skill was the old approach – it was advisory and depended on the model remembering to do it. The agent-memory mechanism is the correct platform path.
</step>

<step number="6" required="false" depends_on="5">
### Step 6: Cross-Reference and Pattern Detection

**Search existing docs** for related solutions:

```bash
grep -r "[activity keywords]" ".design-engineer-plugin/design/dev/"
```

**If related entry found:**

- Add cross-reference links to both documents
- Note the relationship (builds-on, supersedes, conflicts-with)

**If pattern detected** (3+ similar entries):

- Mention the pattern in the next compound-documenter invocation so it can be reflected in pipeline-state.md or key-decisions.md as relevant
- Suggest consolidation if appropriate

</step>

<step number="7" required="true" depends_on="5">
### Step 7: Purge disposable working artifacts (phase boundary)

`/design-engineer:document` runs at every phase boundary, so this is the natural moment to clear the temporary/ bucket. Without this, Playwright debug captures, intermediate analysis dumps, and exploratory drafts accumulate across phases and pollute the working tree.

**Run via Bash:**

```bash
bash -c 'find .design-engineer-plugin/temporary -mindepth 1 -delete 2>/dev/null; mkdir -p .design-engineer-plugin/temporary/scratch .design-engineer-plugin/temporary/playwright .design-engineer-plugin/temporary/intermediate'
```

**Surface a one-line confirmation** in the user-facing chat:

```
Cleared disposable working files from this phase.
```

This step always runs — there is no condition under which the temporary bucket should persist across a phase boundary. If the user has work in `.design-engineer-plugin/temporary/` that they want to keep, the rule is: promote it to a canonical deliverable path (`.design-engineer-plugin/design/<subdir>/<filename>`) BEFORE running `/design-engineer:document`. The path-validation hook (`de-deliverable-path-hook.js`) ensures only canonical filenames land at canonical paths.

**Do not** purge anywhere else under `.design-engineer-plugin/` — only `temporary/`. The other subdirs (design/, prototype/, plans/, memory/) are durable.

</step>

</critical_sequence>

---

<decision_gate name="post-documentation" wait_for_user="true">

## Decision Menu After Capture

After successful documentation, present:

```
Documentation complete.

File created:
- .design-engineer-plugin/design/dev/[category]/[filename].md
- .claude/agent-memory/design-engineer-compound-documenter/ updated by the agent

What's next?
1. Continue workflow (recommended)
2. View documentation
3. Link related entries
4. Update an existing deliverable based on learnings
5. Other
```

**Option 1:** Return to calling skill/workflow.

**Option 2:** Display the created documentation entry.

**Option 3:** Prompt for which entry to link, add cross-references to both.

**Option 4:** Open the deliverable for revision based on documented learnings.

**Option 5:** Ask what the user would like to do.

</decision_gate>

---

## Integration Points

**Invoked by:**
- `/design-engineer:document` command (manual invocation)
- `meta-orchestrator` after each major phase completion (auto-triggered in Autopilot)
- Any skill can request compound documentation when significant decisions are made

**Invokes:**
- None (terminal skill – does not delegate to other skills)

**Handoff expectations:**
All context needed for documentation should be present in conversation history before invocation. The skill reads conversation context to extract what was done.

---

## Context Engineering Principles

This skill implements context engineering best practices documented in [context-engineering-guide.md](./references/context-engineering-guide.md). Key principles:

1. **One activity = one chat** – save deliverables to project knowledge, start fresh for the next activity
2. **Manual compaction over auto-compaction** – warn the user when approaching token limits so they can manually compact with specific preservation instructions instead of losing context to automatic compression
3. **Sub-agent token preservation** – heavy work happens in sub-agents with their own token budgets, keeping the main conversation lean
4. **Agent memory as ground truth** – AI reads `.claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md` at the start of every task to recover full project context. Persistence handled by Anthropic's documented `memory: project` mechanism.
5. **Separation of concerns** – use small dedicated files instead of one large CLAUDE.md to prevent AI from ignoring parts due to context limits

---

## Schema Reference

All documentation entries are validated against [compound-schema.yaml](./references/compound-schema.yaml), which defines:

- **deliverable_type** – categorizes the type of work (research deliverable, design deliverable, development artifact, etc.)
- **phase** – maps to the pipeline phases (pre-dev Phase 1-4, dev Phase 5-7)
- **component** – which part of the product or workflow was affected
- **status** – current state of the deliverable (draft, in-progress, complete, revised, superseded)
- **severity** – impact level for decisions and issues

---

## Success Criteria

Documentation is successful when ALL of the following are true:

- YAML frontmatter validated against compound-schema.yaml
- File created in correct category directory
- Status file updated with latest state
- Key decisions and failed approaches recorded
- Cross-references added if related entries exist
- User presented with decision menu

---

## Error Handling

**Missing context:**

- Ask user for missing details
- Do not proceed until activity name and deliverable are identified

**YAML validation failure:**

- Show specific field errors
- Present retry with corrected values
- Block until valid

**Status file not found:**

- Invoke compound-documenter to seed the agent-memory directory with an initial pipeline-state.md
- Warn user that no previous status was found

**Token limit warning:**

- If conversation is approaching token limits, prioritize invoking compound-documenter to flush state to its agent memory
- Proactively suggest compacting with a ready-to-use compact message included in the same response – do not wait for the user to agree before generating it
- The compact message must contain actual session values (project state, decisions, phase, next steps), not placeholders

---

## Execution Guidelines

**MUST do:**
- Validate YAML frontmatter before writing (block if invalid)
- Record what did NOT work (prevents AI from repeating failed approaches)
- Invoke compound-documenter every time so the agent memory stays current (this is the ground truth for future sessions)
- Include file paths for all deliverables

**MUST NOT do:**
- Skip status file update
- Use vague descriptions ("made some progress")
- Overwrite previous status entries (append only)
- Auto-compact the conversation (always let the user decide)
