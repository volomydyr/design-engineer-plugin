# Context Engineering Guide

Best practices for maintaining context across sessions, surviving chat compaction, and enabling long-term complex projects. These strategies apply to both Claude Projects (browser) and Claude Code (IDE) workflows.

---

## Strategy 1: One Activity = One Chat

Every conversation has a token limit. Claude allows about 200,000 tokens per chat -- roughly 140,000 words. That limit includes your messages, AI responses, attached files, and documents that AI creates. When you approach this limit, Claude starts losing context from earlier parts of the conversation.

Claude has a "compact chat" feature -- when you hit 200k tokens, AI automatically compresses the earlier conversation and continues. This compaction is smart; it summarizes older messages more heavily and keeps recent ones mostly as they are. But you still lose some details.

**The rule: one activity should equal one chat.**

When you finish an activity (e.g., defining a problem statement, completing a B.I.A.S. audit, implementing a frontend component), save the deliverable and start a fresh chat for the next activity. AI will access all your previous documents through its knowledge or project files, while having a clean context window.

### How to apply this in Claude Projects (browser)

1. Complete one activity per chat (e.g., write the Problem Statement document)
2. When finished, save the deliverable to the project's knowledge by clicking the "Copy to project" button
3. This must be done manually -- Claude cannot save files on its own, even if you ask it to and it claims it did
4. Start a fresh chat for the next activity
5. AI reads all your previous documents through project knowledge, starting with full context

### How to apply this in Claude Code (IDE)

1. Complete one activity per conversation
2. Deliverables are saved as files in the project directory (Claude Code can write files directly)
3. When the activity is done, update the status file (`status.md`) with what was completed
4. Start a fresh conversation for the next task
5. AI reads project files and status at the start of the new conversation

### Why this matters for design + dev workflows

Design projects produce many deliverables across multiple phases: problem statements, personas, journey maps, prototypes, implemented components. Each deliverable builds on previous ones. If you try to do everything in one long conversation, AI will lose the early deliverables' details by the time you reach later phases.

By saving each deliverable as a separate file and starting fresh chats, you ensure every piece of work is preserved at full fidelity and accessible to future conversations.

---

## Strategy 2: Manual Compaction Over Auto-Compaction

When approaching token limits, the AI should warn the user and allow them to manually compact the conversation with specific instructions, instead of letting auto-compaction happen. Auto-compaction prevents information loss through summarization, but the AI decides what to keep and what to compress. Manual compaction lets the user specify exactly what must be preserved.

### How manual compaction works

1. AI detects the conversation is approaching the token limit (roughly 80% of the 200k window)
2. AI warns the user with a clear message about what might be lost
3. The user tells AI exactly what to preserve: specific decisions, file paths, current task state, critical constraints
4. AI compacts the conversation while preserving the specified items at full detail
5. The conversation continues with a smaller token footprint but with critical context intact

### What to preserve during manual compaction

**Always preserve:**

- Current task state (what step you are on, what remains)
- Key decisions made in this session and their rationale
- File paths of deliverables created or modified
- Error messages or failed approaches from this session
- Constraints or rules established during the conversation
- Any schema or validation requirements currently in effect

**Safe to compress:**

- Exploration and brainstorming that led to a settled decision
- Intermediate drafts that have been superseded by final versions
- Detailed code/content that has already been saved to files
- Conversation about tool setup that is now complete
- Verbose AI explanations of concepts the user already understands

### Why auto-compaction is dangerous

Auto-compaction uses AI judgment to decide what matters. This creates specific risks:

- **Decision amnesia**: AI forgets why a particular approach was chosen, potentially revisiting rejected alternatives
- **Constraint loss**: Rules established early in the conversation (e.g., "never use this library") get compressed away
- **Hallucination trigger**: When AI loses context about what was already built, it may invent components or features that do not exist
- **Repeated failures**: Failed approaches get compressed, leading AI to try them again

Manual compaction avoids these risks by letting the human -- who knows what matters -- control what survives.

---

## Strategy 3: Sub-Agent Token Preservation

Claude Code has the exact same 200,000 token limit as Claude Projects. Complex development workflows that require reading many files, creating plans, and writing code burn through that limit fast. When it fills up, chat compaction happens and earlier instructions get partially lost.

Sub-agents solve this by giving each task its own token budget. Each sub-agent runs in a separate conversation with its own 200k token limit. Results come back to the main conversation as concise summaries, preserving the parent conversation's token budget for coordination rather than execution.

### How sub-agents preserve tokens

- One sub-agent analyzes the project context
- Another creates the implementation plan
- A third does the actual development
- A fourth runs the review

They all work in separate "chats" with separate limits, but results come back to the main conversation. This way the main conversation loses fewer tokens because all the heavy work happens elsewhere.

### Token budget distribution

For a typical design + dev workflow:

| Agent | Purpose | Token Usage |
|-------|---------|-------------|
| Context Analyzer | Reads project files, understands current state | High (reads many files) |
| Plan Creator | Creates structured implementation plan | Medium (synthesis work) |
| Implementer | Writes code or creates deliverables | High (generates content) |
| Reviewer | Audits output against requirements | Medium (comparison work) |
| Parent Conversation | Coordinates, presents results to user | Low (receives summaries) |

### When to use sub-agents vs. direct work

**Use sub-agents when:**

- The task requires reading many files (context analysis)
- The task generates large amounts of content (implementation)
- Multiple independent tasks can run in parallel
- The main conversation is already past 50% token usage

**Work directly when:**

- The task is simple and quick (under 5 minutes)
- User interaction is needed at every step (guided mode)
- The output needs to be displayed immediately for user review
- The main conversation has plenty of token budget remaining

### Practical guidelines

- Keep the parent conversation lean: it should coordinate and present, not execute
- Each sub-agent should receive only the context it needs, not the entire conversation history
- Sub-agent results should be summarized before returning to the parent
- If a sub-agent's work is saved to a file, the parent only needs the file path, not the full content
- Four sub-agents is usually enough -- splitting further adds coordination overhead without proportional benefit

---

## Strategy 4: Status File as Ground Truth

When you work on something complex with AI, it forgets things. This happens because of how context works in any AI tool. Every conversation has a token limit, and when you hit it, earlier parts of the chat get compressed or lost. This means the AI might forget about components you already built, decisions you already made, and approaches that did not work before.

The solution: keep a status file for AI to read at the start of every task.

### Setting up the status file

Create a markdown file in the root of your project and call it `status.md`. The name is not critical -- what matters is that your AI tool knows where to find it and when to update it.

**For Claude Code:** Explain the status file as part of your workflow in the CLAUDE.md file. Tell the AI to read it at the start of every conversation and update it after every significant action.

**For Claude Projects:** Add the status file to the project's knowledge. Update it manually at the end of each chat by asking AI to generate the updated version, then copying it to the project.

### What the status file should track

```markdown
# Project Status

## Last Updated
[Date] - [What triggered this update]

## Completed Phases
- Phase 1 Discovery (completed 2026-01-20)
  - Problem Statement: project-docs/deliverables/problem-statement.md
  - Target Audience: project-docs/deliverables/target-audience.md
  - Assumptions: project-docs/deliverables/assumptions.md (living document)

## Current Phase
Phase 2 Strategy - Step 1: StoryBrand Canvas

## Key Decisions
- 2026-01-15: Chose behavioral problem framing over feature-based
- 2026-01-18: Focused on 3 core personas instead of 5
- 2026-01-20: Deferred second interview round to after prototype

## What Has Not Worked
- Generic persona templates lacked product-specific motivation data
- Tried to define IA before research -- too speculative

## Open Questions
- Should onboarding flow include social proof? (test in prototype)
- API rate limits for third-party data source?

## Next Steps
1. Create StoryBrand canvas
2. Draft business plan
3. Begin 6P Stories

## Warnings
- Assumptions doc needs re-review after user interviews
- Token usage note: fresh chat recommended for Phase 2
```

### Keeping the status file accurate

The AI can forget to update the status file even if global rules tell it to. Nudge AI from time to time. Ask it to update your status file after every big phase it completes -- basically after any complex prompt.

If you are wondering why you need a separate document when you could write all project progress inside the global rules (CLAUDE.md): the answer is separation of concerns. It is better to use smaller, dedicated files for cases like this instead of keeping everything in one large CLAUDE.md, because otherwise the AI may ignore certain parts due to context limits.

### Reducing hallucinations with the status file

The status file directly reduces hallucinations by giving AI a factual reference:

- **What exists**: AI knows which components are built, preventing it from inventing non-existent features
- **What was decided**: AI follows established decisions instead of proposing alternatives that were already rejected
- **What failed**: AI avoids repeating approaches that did not work, saving time and preventing frustration
- **What is next**: AI follows the planned sequence instead of jumping ahead or going off-track

---

## Strategy 5: Separation of Concerns

Use smaller, dedicated files instead of one large configuration file. When all project context lives in a single CLAUDE.md or a single project instructions document, AI may ignore certain parts due to context limits.

### Recommended file structure for design + dev projects

```
project-root/
  CLAUDE.md                           # Global rules and workflow instructions (keep lean)
  status.md                           # Project status (updated after every phase)
  project-docs/
    deliverables/                     # Final versions of design deliverables
      problem-statement.md
      target-audience.md
      mvp-requirements.md
      ...
    solutions/                        # Compound documentation entries
      research/
      strategy/
      design/
      development/
      evaluation/
      meta/
    context/                          # Supporting context files
      assumptions.md                  # Living assumptions tracker
      decisions-log.md                # Chronological decision log
      failed-approaches.md            # What did not work and why
```

### Why separation matters

- **CLAUDE.md** should contain only workflow rules and tool configuration -- not project status or deliverable content
- **status.md** gives AI a quick snapshot of where the project stands without reading every deliverable
- **deliverables/** contains the actual work products at full fidelity
- **solutions/** contains compound documentation about HOW the work was done
- **context/** contains living documents that change throughout the project

Each file is small enough that AI can read it fully without context truncation. When AI needs the problem statement, it reads that specific file -- it does not need to parse through a 50-page combined document.

### Cross-file references

When documents reference each other, use file paths:

- In deliverables: "This builds on the Problem Statement (see `project-docs/deliverables/problem-statement.md`)"
- In status.md: list file paths for every deliverable
- In compound entries: reference related deliverables in the `related_deliverables` YAML field

This creates a navigable web of context that AI can traverse as needed, reading only the files relevant to the current task.

---

## Strategy 6: Context Recovery After Breaks

When returning to a project after a break (new session, different day, team handoff), the AI needs to recover context efficiently. The status file and compound documentation make this possible.

### Recovery sequence

1. **Read status.md** -- understand what phase the project is in, what was last completed, what is next
2. **Read the latest compound entry** -- understand the most recent work in detail
3. **Read relevant deliverables** -- only the deliverables needed for the current task
4. **Check open questions** -- see if any blockers have been resolved
5. **Proceed with the next step** -- AI now has sufficient context to continue

### What to do after chat compaction

If compaction has already occurred (you notice AI has forgotten details):

1. Ask AI to read status.md
2. Ask AI to read the specific deliverable it seems to have forgotten
3. Restate any constraints or decisions that were lost
4. Continue from where you left off

### Team handoffs

When another team member or a different AI tool picks up the project:

1. Ensure status.md is fully up to date
2. Ensure all deliverables are saved as files (not just in conversation history)
3. Ensure the latest compound entry documents current state and next steps
4. The new session reads these files and has full project context without needing the original conversation

This is why documenting what did NOT work is just as important as documenting what did. A new team member or AI session will not know about rejected approaches unless they are explicitly recorded.
