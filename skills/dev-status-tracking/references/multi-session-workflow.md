# Multi-Session Workflow Rules

## The Core Problem

AI tools allow a limited amount of context per session – roughly 200,000 tokens for most models. That limit includes your messages, AI responses, attached files, and documents that AI creates. When you approach this limit, AI starts losing context from earlier parts of the conversation.

Some tools have automatic compaction – when you hit the limit, AI compresses the earlier conversation and continues. This compaction is fairly smart: it summarizes older messages more heavily and keeps recent ones mostly as they are. But you still lose some details.

The solution: one activity should equal one session.

## Rules for the Multi-Session Workflow

### Rule 1: One Activity = One Session

Each step in your project gets its own dedicated session. When you finish an activity (e.g., defining a problem statement), save the deliverable and start a fresh session for the next activity. AI will access all your previous documents through its knowledge base while having a clean context window.

**Why this works:**
- Prevents context degradation from long conversations
- Reduces hallucinations caused by compressed earlier messages
- Maintains laser focus on the current step's objectives
- Each session has the full token budget for its specific activity

### Rule 2: Save Deliverables Between Sessions

When a step is complete:
1. Save the final deliverable so it is available in the next session (to project knowledge, files, or equivalent storage for your tool)
2. In browser-based tools, saving deliverables to the project's knowledge must be done manually – AI cannot do this on its own, even if you ask it to and it claims it did
3. In terminal-based tools (Claude Code), deliverables are saved directly to files on disk – no manual step needed
4. Verify the deliverable is accessible before starting the next session

### Rule 3: Start Each Session with Context

Every new session should begin with AI:
1. Checking the project status tracker to understand current progress
2. Following the complete global rules – not ignoring any parts
3. Reviewing all available project documents
4. Sharing brief initial thoughts about the current step's deliverable
5. Asking only the questions it can't infer for the specific step, batched (no more than 4 at a time)

At the end of each completed step, AI provides a brief prompt for the next session that includes these instructions.

### Rule 4: Step Completion Is Explicit

A step is only complete when:
- There is a final deliverable document
- The user explicitly says the step is complete
- The deliverable has been saved and is accessible for the next session

AI should never assume a step is done or suggest moving on prematurely.

### Rule 5: Step Scope Discipline

- NEVER ask about moving to the next step – stay in the current step until the deliverable is ready
- CAN revisit and update previous step deliverables based on new knowledge
- NEVER work on future steps, even if the user mentions them casually
- Stay focused on the specific scope of the current activity

### Rule 6: Decision Hierarchy

When there is a disagreement or conflicting information:

1. **User's own experience** – highest weight, least likely to be wrong
2. **Project documentation** – what has already been decided and written down
3. **AI suggestions** – lowest weight, most likely to contain mistakes

AI confidently fills in gaps with made-up information if given room to do so. When AI makes a claim based on research or documents, ask it to provide specific quotes. Then open those sources and search for the exact text. If you cannot find anything, AI probably invented it.

### Rule 7: Document Standards

All documents should follow these standards:
- Written in markdown format
- Simple, natural language (8th grade reading level, no jargon)
- Executive summaries at the beginning with specific key points, not vague descriptions
- Detailed content that can be used as context for other AI tools
- Exact artifact naming consistency across all sessions (no variations ever)

### Rule 8: Process for Each Step

AI follows this process in every session:
1. Share brief initial thoughts about the current step's deliverable (based on project knowledge)
2. Ask only what you can't infer to understand the user's perspective, batched (no more than 4 at a time)
3. Work through problems together based on the answers
4. Create documentation only after understanding the task well enough
5. Refine the deliverable based on user feedback

### Rule 9: Stay In Scope

AI never jumps ahead. It is always focused on one step only:
- During discovery: never jump to solutions
- During research: never discuss positioning
- During strategy: never ask about implementation
- During planning: never start building

## Applying These Rules

### In Claude Code (terminal)
These principles map to the CLAUDE.md file and the agent pipeline. Each sub-agent is essentially one focused session with its own token budget, following the same pattern of focused scope and explicit completion. Deliverables are saved directly to files on disk.

### In browser-based AI tools (Claude.ai, ChatGPT, etc.)
These rules go into the project instructions or system prompt, which applies them to every session automatically. Deliverables must be saved manually to the project's knowledge base between sessions.

### In other AI tools
The workflow applies to any AI tool with session-based interactions. The mechanism for saving context between sessions varies (project knowledge, file uploads, system prompts), but the principles remain the same.

## Common Mistakes to Avoid

1. **Trying to do everything in one session** – you will hit the token limit and lose critical context
2. **Forgetting to save deliverables** – the next session will not have access to your completed work
3. **Trusting AI claims without verification** – always ask for specific quotes and verify them
4. **Letting AI skip the question phase** – the questions that can't be inferred prevent assumptions and ensure alignment
5. **Moving to the next step without explicit completion** – incomplete deliverables become shaky foundations for everything that follows
