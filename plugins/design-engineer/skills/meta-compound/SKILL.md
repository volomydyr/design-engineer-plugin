---
name: meta-compound
description: "Documents knowledge and engineers context for design projects. Stores project status, maintains living context files, and tracks cross-deliverable dependencies. Use when completing a major phase or when context needs to be preserved across sessions."
disable-model-invocation: true
---

# meta-compound Skill

**Purpose:** Document solutions, store project status, and maintain living context files that enable long-term complex projects across sessions, chat compaction, and team handoffs. Adapted from compound-engineering's compound-docs pattern for design + development workflows.

## Overview

After any significant work is completed (a design deliverable, a development phase, a psychology audit), this skill captures what was done, what worked, what did not work, and what comes next. It maintains a structured project status file that AI reads at the start of every task, reducing hallucinations and preventing repeated mistakes.

This is not for pet projects that you start and abandon. This is for actual complex projects planned to run for years, potentially becoming million-dollar products with multiple teams working on them.

**Organization:** Each documentation entry is a markdown file with validated YAML frontmatter, stored in `project-docs/solutions/[category]/`. The project status file lives at the project root as `status.md`.

---

<critical_sequence name="compound-documentation" enforce_order="strict">

## 6-Step Process

<step number="1" required="true">
### Step 1: Detect Trigger

**Auto-invoke after:**

- Completion of any pipeline phase (pre-dev, dev, psychology audit)
- User confirms a solution worked ("that fixed it", "looks good", "approved")
- End of any complex multi-step task

**OR manual:** `/de:compound` command

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

- Tools used (Claude Projects, Claude Code, Cursor, Figma)
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
DOC_PATH="project-docs/solutions/${CATEGORY}/${FILENAME}"

mkdir -p "project-docs/solutions/${CATEGORY}"
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
### Step 5: Update Project Status File

Update the project status file (`status.md`) at the project root.

**Status file structure:**

```markdown
# Project Status

## Last Updated
[Date and activity that triggered this update]

## Completed Phases
[List of completed phases with dates]

## Current Phase
[What phase is active, what step within it]

## Deliverables Produced
[List of all deliverables with file paths]

## Key Decisions Log
[Chronological log of important decisions]

## What Has Not Worked
[Approaches that failed — prevents AI from repeating them]

## Open Questions
[Unresolved issues across all phases]

## Next Steps
[What should happen next in the pipeline]

## Warnings
[Token limits approaching, context that might be lost, blockers]
```

**Update rules:**

- Append to existing sections, do not overwrite previous entries
- Move completed items from "Current Phase" to "Completed Phases"
- Remove resolved items from "Open Questions"
- Always update "Last Updated" with current date and trigger
</step>

<step number="6" required="false" depends_on="5">
### Step 6: Cross-Reference and Pattern Detection

**Search existing docs** for related solutions:

```bash
grep -r "[activity keywords]" project-docs/solutions/
```

**If related entry found:**

- Add cross-reference links to both documents
- Note the relationship (builds-on, supersedes, conflicts-with)

**If pattern detected** (3+ similar entries):

- Note the pattern in status.md under a "Patterns" section
- Suggest consolidation if appropriate

</step>

</critical_sequence>

---

<decision_gate name="post-documentation" wait_for_user="true">

## Decision Menu After Capture

After successful documentation, present:

```
Documentation complete.

File created:
- project-docs/solutions/[category]/[filename].md
- status.md updated

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
- `/de:compound` command (manual invocation)
- `meta-orchestrator` after each major phase completion (auto-triggered in God mode)
- Any skill can request compound documentation when significant decisions are made

**Invokes:**
- None (terminal skill -- does not delegate to other skills)

**Handoff expectations:**
All context needed for documentation should be present in conversation history before invocation. The skill reads conversation context to extract what was done.

---

## Context Engineering Principles

This skill implements context engineering best practices documented in [context-engineering-guide.md](./references/context-engineering-guide.md). Key principles:

1. **One activity = one chat** -- save deliverables to project knowledge, start fresh for the next activity
2. **Manual compaction over auto-compaction** -- warn the user when approaching token limits so they can manually compact with specific preservation instructions instead of losing context to automatic compression
3. **Sub-agent token preservation** -- heavy work happens in sub-agents with their own token budgets, keeping the main conversation lean
4. **Status file as ground truth** -- AI reads `status.md` at the start of every task to recover full project context
5. **Separation of concerns** -- use small dedicated files instead of one large CLAUDE.md to prevent AI from ignoring parts due to context limits

---

## Schema Reference

All documentation entries are validated against [compound-schema.yaml](./references/compound-schema.yaml), which defines:

- **deliverable_type** -- categorizes the type of work (research deliverable, design deliverable, development artifact, etc.)
- **phase** -- maps to the pipeline phases (pre-dev Phase 1-4, dev Phase 5-7)
- **component** -- which part of the product or workflow was affected
- **status** -- current state of the deliverable (draft, in-progress, complete, revised, superseded)
- **severity** -- impact level for decisions and issues

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

- Create initial status.md with current entry as first item
- Warn user that no previous status was found

**Token limit warning:**

- If conversation is approaching token limits, prioritize updating status.md immediately
- Recommend the user manually compact the conversation before proceeding
- Include specific instructions for what to preserve during compaction

---

## Execution Guidelines

**MUST do:**
- Validate YAML frontmatter before writing (block if invalid)
- Record what did NOT work (prevents AI from repeating failed approaches)
- Update status.md every time (this is the ground truth for future sessions)
- Include file paths for all deliverables

**MUST NOT do:**
- Skip status file update
- Use vague descriptions ("made some progress")
- Overwrite previous status entries (append only)
- Auto-compact the conversation (always let the user decide)
