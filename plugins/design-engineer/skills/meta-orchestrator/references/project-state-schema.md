# Project State Schema

Schema for the project state file that tracks progress through the design pipeline. This file lives at `design-docs/project-state.md` in the user's project directory and serves as the single source of truth for pipeline progress.

## Why This File Exists

When you work on something complex with AI, there is a problem you will run into sooner or later – it forgets things. Every conversation has a token limit, and when you hit it, earlier parts of the chat get compressed or lost. This means the AI might forget about deliverables already created, decisions already made, and approaches that did not work before.

The project state file solves this by keeping a persistent record that AI reads at the start of every task. It does not need to be maintained manually – the orchestrator and meta-document handle updates automatically. However, users may need to nudge AI to update it from time to time, especially after big phases.

This file is separate from CLAUDE.md (separation of concerns). It is better to use smaller, dedicated files for tracking progress instead of keeping everything in one large rules file, because otherwise the AI may ignore certain parts due to context limits.

## File Location

```
<project-root>/
  design-docs/
    project-state.md          <-- this file
    deliverables/
      phase-1-discovery/
      phase-2-strategy/
      phase-3-planning/
      phase-4-design/
      phase-5-development/
```

## Schema Structure

The project state file uses the following markdown structure. Every section is required. Empty sections use "None yet" as the value.

---

### Header

```markdown
# Project State: [Project Name]

**Last updated**: [ISO 8601 timestamp]
**Current phase**: [Phase number and name]
**Current skill**: [Skill name or "Between skills"]
**Mode**: [God / Guided / Direct]
**Pipeline status**: [In progress / Paused / Completed / Abandoned]
```

### Fields:

- **Project Name**: The name the user gave the project during startup
- **Last updated**: Timestamp of the most recent update, in ISO 8601 format (e.g., 2026-03-09T14:30:00Z)
- **Current phase**: Which phase the pipeline is currently in (e.g., "Phase 2: Strategy and Positioning")
- **Current skill**: Which skill is currently executing or which skill is next (e.g., "ux-business-plan" or "Between skills – next is ux-6p-stories")
- **Mode**: Which access mode the user selected (God, Guided, or Direct)
- **Pipeline status**: Overall status of the pipeline run

---

### Project Overview

```markdown
## Project Overview

**Idea**: [One-paragraph summary of what the product is]
**Project type**: [New from scratch / Partially done / Existing product]
**Started**: [Date the pipeline was first invoked]
**Target completion**: [Estimated completion, if known]
```

This section is populated during the startup sequence and updated if the project scope changes.

---

### Phase Status

```markdown
## Phase Status

### Phase 1: Discovery and Foundation
- **Status**: [Not started / In progress / Completed / Skipped]
- **Started**: [Timestamp or "–"]
- **Completed**: [Timestamp or "–"]
- **Skills completed**: [List of skill names]
- **Skills skipped**: [List of skill names with reason]
- **Deliverables produced**:
  - [deliverable name] – [file path relative to design-docs/]

### Phase 2: Strategy and Positioning
- **Status**: [Not started / In progress / Completed / Skipped]
- **Started**: [Timestamp or "–"]
- **Completed**: [Timestamp or "–"]
- **Skills completed**: [List of skill names]
- **Skills skipped**: [List of skill names with reason]
- **Deliverables produced**:
  - [deliverable name] – [file path relative to design-docs/]

### Phase 3: Product Planning
- **Status**: [Not started / In progress / Completed / Skipped]
- **Started**: [Timestamp or "–"]
- **Completed**: [Timestamp or "–"]
- **Skills completed**: [List of skill names]
- **Skills skipped**: [List of skill names with reason]
- **Deliverables produced**:
  - [deliverable name] – [file path relative to design-docs/]

### Phase 4: Design and Validation
- **Status**: [Not started / In progress / Completed / Skipped]
- **Started**: [Timestamp or "–"]
- **Completed**: [Timestamp or "–"]
- **Skills completed**: [List of skill names]
- **Skills skipped**: [List of skill names with reason]
- **Deliverables produced**:
  - [deliverable name] – [file path relative to design-docs/]

### User Approval Checkpoint
- **Status**: [Not reached / Pending approval / Approved / Declined]
- **Timestamp**: [When the checkpoint was reached]
- **Decision**: [Proceed / Review / Run skipped skills / Stop]
- **Notes**: [Any user comments at the checkpoint]

### Phase 5: Development
- **Status**: [Not started / In progress / Completed / Skipped]
- **Started**: [Timestamp or "–"]
- **Completed**: [Timestamp or "–"]
- **Skills completed**: [List of skill names]
- **Skills skipped**: [List of skill names with reason]
- **Deliverables produced**:
  - [deliverable name] – [file path relative to design-docs/]
```

---

### Skill-Level Tracking

For each skill that has been executed, record its individual status:

```markdown
## Skill History

### ux-problem-statement
- **Status**: [Completed / In progress / Skipped / Failed]
...
```

Each skill entry follows the same structure. Only include entries for skills that have been started or explicitly skipped. Do not pre-populate entries for future skills.

---

### Decisions Log

```markdown
## Decisions Log

Significant decisions made during the pipeline, in chronological order. Each entry records what was decided, why, and by whom (user vs. AI suggestion).

| # | Date | Phase | Decision | Rationale | Made by |
|---|------|-------|----------|-----------|---------|
| 1 | [Date] | [Phase] | [What was decided] | [Why] | [User / AI-suggested, user-approved] |
```

### Fields:

- **#**: Sequential number
- **Date**: When the decision was made
- **Phase**: Which phase the pipeline was in
- **Decision**: Clear statement of what was decided
- **Rationale**: Why this decision was made
- **Made by**: Whether the user made this decision directly or the AI suggested it and the user approved

---

### Learnings

```markdown
## Learnings

Insights, patterns, and lessons recorded during the pipeline. Updated after each meta-document run.

### What Worked
- [Description of approach that worked well]

### What Did Not Work
- [Description of approach that failed or was abandoned, and why]

### Assumptions Updated
- [Assumption that was validated or invalidated, with reference to evidence]

### Unexpected Findings
- [Anything surprising that emerged during the process]
```

This section is critical for context continuity. When the AI reads the project state at the start of a new session, the learnings section prevents it from repeating failed approaches or contradicting established decisions.

---

### Context for Next Session

```markdown
## Context for Next Session

A brief summary written specifically for the AI to read at the start of the next work session. Updated after every significant milestone.

**Where we left off**: [Which skill was last completed or is in progress]
**What to do next**: [The immediate next step]
**Critical context**: [Any context that must not be forgotten – warnings, constraints, user preferences]
**Open questions**: [Anything unresolved that needs user input]
```

This section addresses the multi-chat workflow pattern: each new session starts by reading the project state file, which provides the AI with full context about what has happened so far without relying on conversation history.

---

## Update Rules

The orchestrator updates the project state file according to these rules:

1. **After every skill completes**: Update that skill's entry in the Skill History section. Update the Phase Status if this was the last skill in a phase.

2. **After every meta-document run**: Update the Learnings section. Update the Context for Next Session section. Update the Phase Status for the completed phase.

3. **When the user makes a significant decision**: Add an entry to the Decisions Log. If the decision changes the pipeline plan (e.g., skipping a phase), update the Phase Status accordingly.

4. **At the user approval checkpoint**: Update the checkpoint status. Record the user's decision and any comments.

5. **At the start of every new session**: Read the entire file. Confirm the current status with the user before proceeding. Do not assume the state is correct without verification – the user may have done work outside the pipeline.

6. **When a skill fails or is retried**: Update the skill's status to "Failed" or note the retry. Add the failure reason to Learnings under "What Did Not Work".

## Initial State

When the pipeline starts for the first time, the orchestrator creates the project state file with all sections populated with their initial values:

- All Phase Status sections set to "Not started"
- Skill History section empty (no entries)
- Decisions Log empty
- Learnings sections set to "None yet"
- Context for Next Session populated with the startup information (mode, project type, initial idea)

## Example: Partially Completed State

Below is an example of what the project state file looks like after Phase 1 is complete and Phase 2 is in progress:

```markdown
# Project State: Meddy AI

**Last updated**: 2026-03-09T16:45:00Z
**Current phase**: Phase 2: Strategy and Positioning
**Current skill**: Between skills – next is ux-6p-stories
**Mode**: Guided
**Pipeline status**: In progress

## Project Overview

**Idea**: A mobile app that helps people understand and manage their medical records using AI. Users can photograph or upload medical documents, and the app interprets them in plain language.
**Project type**: New from scratch
**Started**: 2026-03-08
**Target completion**: Unknown

## Phase Status

### Phase 1: Discovery and Foundation
- **Status**: Completed
- **Started**: 2026-03-08T10:00:00Z
- **Completed**: 2026-03-08T18:30:00Z
- **Skills completed**: ux-problem-statement, ux-target-audience, ux-assumptions, ux-competitor-analysis
- **Skills skipped**: ux-user-interviews (user chose to skip – no access to target users yet)
- **Deliverables produced**:
  - Problem Statement – deliverables/phase-1-discovery/problem-statement.md
  - Target Audience – deliverables/phase-1-discovery/target-audience.md
  - Assumptions – deliverables/phase-1-discovery/assumptions.md
  - Competitor Analysis – deliverables/phase-1-discovery/competitor-analysis.md

### Phase 2: Strategy and Positioning
- **Status**: In progress
- **Started**: 2026-03-09T09:00:00Z
- **Completed**: –
- **Skills completed**: ux-storybrand, ux-business-plan
- **Skills skipped**: None yet
- **Deliverables produced**:
  - StoryBrand – deliverables/phase-2-strategy/storybrand.md
  - Business Plan – deliverables/phase-2-strategy/business-plan.md

### Phase 3: Product Planning
- **Status**: Not started
...

## Skill History

### ux-problem-statement
- **Status**: Completed
- **Started**: 2026-03-08T10:00:00Z
- **Completed**: 2026-03-08T11:15:00Z
- **Deliverable**: deliverables/phase-1-discovery/problem-statement.md
- **Iterations**: 3
- **Key decisions**: Focused on medical records interpretation rather than general health tracking
- **Notes**: User had a clear vision from the start, refinement was mostly about scope

### ux-storybrand
- **Status**: Completed
- **Started**: 2026-03-09T09:00:00Z
- **Completed**: 2026-03-09T11:30:00Z
- **Deliverable**: deliverables/phase-2-strategy/storybrand.md
- **Iterations**: 2
- **Key decisions**: Positioned the app as a "medical translator" rather than a "health assistant"
- **Notes**: StoryBrand framework revealed that fear of misunderstanding medical results is the primary emotional driver

### ux-business-plan
- **Status**: Completed
- **Started**: 2026-03-09T13:00:00Z
- **Completed**: 2026-03-09T16:00:00Z
- **Deliverable**: deliverables/phase-2-strategy/business-plan.md
- **Iterations**: 4
- **Key decisions**: Freemium model with premium AI features, no subscription fatigue
- **Notes**: User had a hypothesis about quarterly payments – research showed users dislike monthly subscriptions in similar apps but no evidence for quarterly acceptance specifically

## Decisions Log

| # | Date | Phase | Decision | Rationale | Made by |
|---|------|-------|----------|-----------|---------|
| 1 | 2026-03-08 | Phase 1 | Focus on medical records, not general health | User's core insight is that people cannot understand their own medical data | User |
| 2 | 2026-03-08 | Phase 1 | Skip user interviews for now | No access to target users; will validate assumptions through competitor analysis and market research instead | User |
| 3 | 2026-03-09 | Phase 2 | Freemium model, not subscription | Competitor analysis showed subscription fatigue in health apps | AI-suggested, user-approved |

## Learnings

### What Worked
- Starting with a clear one-sentence idea made the problem statement much easier to define
- Competitor analysis revealed a gap in medical record interpretation that no competitor addresses well

### What Did Not Work
- First attempt at target audience was too broad (all adults) – narrowed to specific segments after user feedback

### Assumptions Updated
- Validated: People find medical records confusing (confirmed by competitor reviews)
- Invalidated: Assumed young adults would be primary audience – research showed 35-55 age group has more medical records and more frustration

### Unexpected Findings
- Several competitors exist for health tracking but almost none for medical record interpretation specifically

## Context for Next Session

**Where we left off**: Completed ux-business-plan, about to start ux-6p-stories
**What to do next**: Run ux-6p-stories to create narrative scenarios for the product
**Critical context**: The product is positioned as a "medical translator" (see StoryBrand). Freemium model. Target audience is 35-55 adults with chronic conditions or regular medical visits.
**Open questions**: User mentioned wanting to explore behavior mapping – ask whether to include the optional ux-behavior-mapping skill after 6P stories
```
