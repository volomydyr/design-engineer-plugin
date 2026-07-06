# Context Engineering Guide

Best practices for maintaining context across sessions, surviving chat compaction, and enabling long-term complex projects. These strategies apply to Claude Code, Claude.ai, and other AI tool workflows.

Strategies 1, 3, and 4 are covered in full detail in [context-survival-guide.md](../../dev-status-tracking/references/context-survival-guide.md) – that file is the single detailed home for them. This guide keeps short summaries of those three and goes deep only on the strategies specific to documentation work.

---

## Strategy 1: One Activity = One Chat

Every conversation has a token limit. When you finish an activity (defining a problem statement, completing a bias audit, implementing a frontend component), save the deliverable as a file and start a fresh chat for the next activity. The AI accesses previous deliverables through project files rather than compressed chat history, so every piece of work stays at full fidelity while each activity gets a clean context window.

Full workflow (browser and Claude Code variants, rationale): see "Strategy 3: One Activity Per Chat" in [context-survival-guide.md](../../dev-status-tracking/references/context-survival-guide.md).

---

## Strategy 2: Manual Compaction Over Auto-Compaction

Auto-compaction prevents information loss through summarization, but the AI decides what to keep and what to compress. Manual compaction lets the user control what survives. Whenever compaction is suggested, the AI provides a ready-to-use compact message in the same response as the suggestion, with actual session values filled in.

### How manual compaction works

1. A defined breakpoint is reached: a phase or major activity completes, the user pauses with `/design-engineer:stop`, or the user explicitly asks for a compact message. The AI cannot measure its own context usage, so a self-estimated percentage is never the trigger.
2. AI suggests compacting **and includes a ready-to-use compact message** with actual session values filled in – no placeholders, no waiting for a second round-trip
3. The user can immediately copy the message and run `/compact`, customize it, or dismiss it
4. The conversation continues with a smaller token footprint but with critical context intact

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

Manual compaction avoids these risks by letting the human – who knows what matters – control what survives.

---

## Strategy 3: Sub-Agent Token Preservation

Sub-agents run in separate conversations with separate token budgets. Heavy work (context analysis, implementation, auditing) happens in sub-agent conversations, and only concise summaries come back to the main conversation – the parent coordinates and presents, it does not execute. Dispatch a sub-agent when a task reads many files or generates large amounts of content; work directly when the task is quick or needs user interaction at every step.

Full guidance (agent roles, token budget distribution, dispatch heuristics): see "Strategy 2: Sub-Agents for Token Preservation" in [context-survival-guide.md](../../dev-status-tracking/references/context-survival-guide.md).

---

## Strategy 4: Pipeline State as Ground Truth

The compound-documenter agent maintains the project's pipeline state at `.claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md` through Anthropic's documented `memory: project` mechanism. The file is created and updated by the agent – it is never hand-created in the project root. Reading it at the start of a task recovers what phase the project is in, what was completed, key decisions, failed approaches, and what comes next.

A current pipeline state directly reduces hallucinations: the AI knows what exists (so it does not invent components), what was decided (so it does not revisit rejected alternatives), what failed (so it does not repeat dead ends), and what is next (so it follows the planned sequence).

Full guidance on status-file discipline and keeping it accurate: see "Strategy 1: Status File as Primary Context" in [context-survival-guide.md](../../dev-status-tracking/references/context-survival-guide.md).

---

## Strategy 5: Separation of Concerns

Use smaller, dedicated files instead of one large configuration file. When all project context lives in a single CLAUDE.md or a single project instructions document, AI may ignore certain parts due to context limits.

### Recommended file structure for design + dev projects

```
project-root/
  CLAUDE.md                          # Global rules and workflow instructions (keep lean)
  .claude/agent-memory/design-engineer-compound-documenter/
    pipeline-state.md                # Live pipeline state (maintained by the compound-documenter agent)
    key-decisions.md                 # Append-only decision log
    stale-dependents.md              # Deliverables needing re-review after upstream edits
  .design-engineer-plugin/
    config.yaml                      # Plugin runtime state
    dependencies.yaml                # Static dependency graph (read-only documentation)
    design/
      foundation/                    # Problem statement, target audience, assumptions
      research/                      # Competitor analysis, interviews
      planning/                      # MVP requirements, information architecture
      exploration/                   # References, moodboard, images
      psychology/                    # Psychology audits
      reviews/                       # Design critiques, accessibility and QA reviews
      dev/                           # Design system, dev decisions, compound documentation entries
      features/                      # Feature-scoped specs
      specs/                         # Standalone surface specs
    prototype/                       # HTML prototypes
    plans/                           # Approved implementation plans
```

### Why separation matters

- **CLAUDE.md** should contain only workflow rules and tool configuration – never project status or deliverable content
- **pipeline-state.md** gives AI a quick snapshot of where the project stands without reading every deliverable
- **design/** subdirectories contain the actual work products at full fidelity
- **key-decisions.md** and the compound documentation entries under `design/dev/` capture HOW the work was done and why

Each file is small enough that AI can read it fully without context truncation. When AI needs the problem statement, it reads that specific file – it does not need to parse through a 50-page combined document.

### Cross-file references

When documents reference each other, use file paths:

- In deliverables: "This builds on the problem statement (see `.design-engineer-plugin/design/foundation/problem-statement.md`)"
- In pipeline-state.md: list file paths for every deliverable
- In compound entries: reference related deliverables in the `related_deliverables` YAML field

This creates a navigable web of context that AI can traverse as needed, reading only the files relevant to the current task.

---

## Strategy 6: Context Recovery After Breaks

When returning to a project after a break (new session, different day, team handoff), the AI needs to recover context efficiently. The pipeline state and compound documentation make this possible.

### Recovery sequence

1. **Read `.claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md`** – understand what phase the project is in, what was last completed, what is next
2. **Read the latest compound entry** – understand the most recent work in detail
3. **Read relevant deliverables** – only the deliverables needed for the current task
4. **Check open questions** – see if any blockers have been resolved
5. **Proceed with the next step** – AI now has sufficient context to continue

### What to do after chat compaction

If compaction has already occurred (you notice AI has forgotten details):

1. Ask AI to read `.claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md`
2. Ask AI to read the specific deliverable it seems to have forgotten
3. Restate any constraints or decisions that were lost
4. Continue from where you left off

### Team handoffs

When another team member or a different AI tool picks up the project:

1. Ensure `.claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md` is fully up to date
2. Ensure all deliverables are saved as files (not just in conversation history)
3. Ensure the latest compound entry documents current state and next steps
4. The new session reads these files and has full project context without needing the original conversation

This is why documenting what did NOT work is just as important as documenting what did. A new team member or AI session will not know about rejected approaches unless they are explicitly recorded.
