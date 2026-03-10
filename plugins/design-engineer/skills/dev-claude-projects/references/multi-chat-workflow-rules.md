# Multi-Chat Workflow Rules

## The Core Problem

Claude allows about 200,000 tokens per chat -- roughly 140,000 words. That limit includes your messages, AI responses, attached files, and documents that AI creates. When you approach this limit, Claude starts losing context from earlier parts of the conversation.

Claude has a "compact chat" feature -- when you hit 200k tokens, AI automatically compresses the earlier conversation and continues. This compaction is pretty smart: it summarizes older messages more heavily and keeps recent ones mostly as they are. But you still lose some details.

The solution: one activity should equal one chat.

## Rules for the Multi-Chat Workflow

### Rule 1: One Activity = One Chat

Each step in your project gets its own dedicated chat. When you finish an activity (e.g., defining a problem statement), save the deliverable and start a fresh chat for the next activity. AI will access all your previous documents through its knowledge base while having a clean context window.

**Why this works:**
- Prevents context degradation from long conversations
- Reduces hallucinations caused by compressed earlier messages
- Maintains laser focus on the current step's objectives
- Each chat has the full 200k token budget for its specific activity

### Rule 2: Save Deliverables Between Chats

When a step is complete:
1. Copy the final deliverable to the project's knowledge by clicking the "Copy to project" button (or equivalent in your tool)
2. This must be done manually -- Claude cannot save files on its own, even if you ask it to and it claims it did
3. Verify the document appears in your project knowledge before starting the next chat

### Rule 3: Start Each Chat with Context

Every new chat should begin with AI:
1. Checking the project status tracker to understand current progress
2. Following the complete global rules -- not ignoring any parts
3. Reviewing all project knowledge documents
4. Sharing brief initial thoughts about the current step's deliverable
5. Asking 7-10 strategic questions for the specific step

At the end of each completed step, AI provides a brief prompt for the next chat that includes these instructions.

### Rule 4: Step Completion Is Explicit

A step is only complete when:
- There is a final deliverable document
- The user explicitly says the step is complete
- The deliverable has been saved to project knowledge

AI should never assume a step is done or suggest moving on prematurely.

### Rule 5: Step Scope Discipline

- NEVER ask about moving to the next step -- stay in the current step until the deliverable is ready
- CAN revisit and update previous step deliverables based on new knowledge
- NEVER work on future steps, even if the user mentions them casually
- Stay focused on the specific scope of the current activity

### Rule 6: Decision Hierarchy

When there is a disagreement or conflicting information:

1. **User's own experience** -- highest weight, least likely to be wrong
2. **Project documentation** -- what has already been decided and written down
3. **AI suggestions** -- lowest weight, most likely to contain mistakes

AI confidently fills in gaps with made-up information if given room to do so. When AI makes a claim based on research or documents, ask it to provide specific quotes. Then open those sources and search for the exact text. If you cannot find anything, Claude probably invented it.

### Rule 7: Document Standards

All documents should follow these standards:
- Written in markdown format
- Simple, natural language (8th grade reading level, no jargon)
- Executive summaries at the beginning with specific key points, not vague descriptions
- Detailed content that can be used as context for other AI tools
- Exact artifact naming consistency across all chats (no variations ever)

### Rule 8: Process for Each Step

AI follows this process in every chat:
1. Share brief initial thoughts about the current step's deliverable (based on project knowledge)
2. Ask 7-10 strategic questions to understand the user's perspective
3. Work through problems together based on the answers
4. Create documentation only after understanding the task well enough
5. Refine the deliverable based on user feedback

### Rule 9: Stay In Scope

Claude never jumps ahead. It is always focused on one step only:
- During discovery: never jump to solutions
- During research: never discuss positioning
- During strategy: never ask about implementation
- During planning: never start building

## Applying These Rules

### In Claude Projects (browser)
These rules go into the **Project Instructions** field, which applies them to every chat automatically. You do not need to repeat them -- they are always active.

### In Claude Code (terminal)
These principles map to the CLAUDE.md file and the agent pipeline. Each sub-agent is essentially one focused "chat" with its own token budget, following the same pattern of focused scope and explicit completion.

### In Other AI Tools
The workflow applies to any AI tool with chat-based interactions. The mechanism for saving context between chats varies (project knowledge, file uploads, system prompts), but the principles remain the same.

## Common Mistakes to Avoid

1. **Trying to do everything in one chat** -- you will hit the token limit and lose critical context
2. **Forgetting to save deliverables** -- the next chat will not have access to your completed work
3. **Trusting AI claims without verification** -- always ask for specific quotes and verify them
4. **Letting AI skip the question phase** -- the 7-10 strategic questions prevent assumptions and ensure alignment
5. **Moving to the next step without explicit completion** -- incomplete deliverables become shaky foundations for everything that follows
