# Context Survival Guide

## The Core Problem

When you work on something complex with AI, it forgets things. Every conversation has a token limit (~200,000 tokens for Claude), and when you hit it, earlier parts of the chat get compressed or lost. AI might forget about components already built, decisions already made, and approaches that did not work.

This guide covers strategies for maintaining context across sessions, preventing information loss, and recovering when things go wrong.

## Strategy 1: Status File as Primary Context

Keep a development status file that AI reads at the start of every task. Unlike your global rules file (CLAUDE.md), this document tracks the current state of the codebase specifically.

**Why a separate file:** Using smaller, dedicated files works better than keeping everything in one large CLAUDE.md. AI may ignore parts of very long documents due to context limits. Separation of concerns means the rules file tells AI how to work, and the status file tells AI what exists.

**What to include:**
- Completed features and their current state
- In-progress work and remaining tasks
- Components, services, and assets that exist
- Critical warnings about failed approaches
- Architecture decisions and their rationale

**When to update:**
- After every feature AI implements
- After any critical bug fix
- Before working on anything unfamiliar
- When the project structure changes

## Strategy 2: Sub-Agents for Token Preservation

Sub-agents run in separate "chats" with separate token limits. Heavy work (context analysis, implementation, auditing) happens in sub-agent conversations, and only the results come back to the main conversation.

**Why this helps:** Your main conversation stays lean. Instead of burning 50,000 tokens analyzing the codebase, the context-analyzer agent does that work separately and returns a summary. The main conversation only consumes tokens for the summary, not the full analysis.

**The four-agent pattern:**
1. Context analyzer – analyzes project state (separate tokens)
2. Backend implementer – implements data layer (separate tokens)
3. Frontend implementer – implements UI (separate tokens)
4. Design system auditor – checks quality (separate tokens)

Each agent has its own ~200,000 token budget, effectively multiplying your available context.

## Strategy 3: One Activity Per Chat

For pre-development work in browser-based AI tools (Claude.ai, ChatGPT, or similar), one activity should equal one chat. When you finish an activity (e.g., defining a problem statement), save the deliverable to the project's knowledge and start a fresh chat.

**Why this works:**
- Each chat gets the full token budget for its specific activity
- Earlier context is not lost to compression
- AI accesses previous deliverables through project knowledge, not through compressed chat history

**The workflow:**
1. Start a chat focused on one specific step
2. Complete the step and produce a deliverable
3. Save the deliverable to project knowledge (manually – AI cannot do this)
4. Start a fresh chat for the next step

## Strategy 4: Manual Compaction Over Auto-Compaction

When approaching the 200k token limit, Claude automatically compresses the earlier conversation. This auto-compaction is smart but loses details.

**The better approach:** When you notice the conversation getting long, manually compact it yourself. Tell AI specifically what to remember and what can be forgotten. This gives you control over what information survives compression.

**How to do it:**
- Ask AI to summarize the current state before the conversation gets too long
- Tell AI which decisions and warnings are critical to preserve
- Start a fresh conversation with the summary if the current one is getting unwieldy

**Warning the user:** Include a rule in CLAUDE.md telling AI to warn the user when approaching the token limit, allowing the user to manually compact with specific instructions instead of letting auto-compaction happen.

## Strategy 5: Git as a Context Safety Net

Regular commits serve as a secondary context preservation mechanism. Even if AI loses context about what was built, the Git history shows exactly what changed and when.

**Commit discipline:**
- After every feature AI implements
- After any critical bug fix
- Before working on anything unfamiliar
- Before any risky operation

**Why this matters beyond code preservation:** When context is lost and AI starts suggesting changes to things that already work, you can point to the commit history and say "this was already implemented in commit X." The development status file should reference recent significant commits.

## Strategy 6: IDE Timeline as Last Resort

IDEs like Cursor have a Timeline feature – a local history of file changes separate from Git. It is not as powerful, not as easy to use, and not granular enough to let you revert everything cleanly. But it helps when:

- You forgot to commit before AI broke something
- You accidentally discarded changes instead of staging them
- Auto-save captured a state that Git did not

**Limitations:**
- You need to revert each file one by one
- You need to know the file names, locations, and which version was correct
- It is not a substitute for proper Git usage

## Recovery Scenarios

### Scenario: AI Forgot What Components Exist

**Symptoms:** AI creates a new button component when one already exists. AI suggests installing an icon library that is already in the project.

**Recovery:**
1. Ask AI to re-read the development status file
2. Ask AI to audit the components directory and list what exists
3. Update the status file with the current component inventory
4. Add the missing components to the frontend-implementer agent file

### Scenario: AI Uses a Deprecated Approach

**Symptoms:** AI writes code using an API or pattern that was previously tried and failed.

**Recovery:**
1. Add a warning to the status file about the deprecated approach
2. Add a warning to CLAUDE.md if it is a project-wide concern
3. Tell AI explicitly which approach to use instead
4. Consider adding it to the context-analyzer agent's checklist

### Scenario: Conversation Hit Token Limit

**Symptoms:** AI starts giving less detailed responses, forgets earlier instructions, or contradicts previous decisions.

**Recovery:**
1. Ask AI to update the status file with the current state
2. Start a fresh conversation
3. In the new conversation, AI reads the updated status file and CLAUDE.md
4. Continue development with a clean context window

### Scenario: Accidental Code Loss

**Symptoms:** Changes were discarded instead of staged, or a bad reset wiped recent work.

**Recovery (in order of preference):**
1. **Git revert**: If committed, one command restores everything
2. **Branch checkout**: Switch to a known-good branch
3. **IDE Timeline**: Recover files one by one from local history
4. **Re-implement**: If no backup exists, use the status file and commit history as a guide

## Checklist for New Projects

When starting a new project, set up context management from the beginning:

- [ ] Create a development status file at a predictable location
- [ ] Add a rule to CLAUDE.md requiring AI to read and update the status file
- [ ] Set up Git and make an initial commit
- [ ] Configure the agent pipeline with separate agents for heavy work
- [ ] Establish the one-activity-per-chat pattern for pre-development work
- [ ] Add a token limit warning rule to CLAUDE.md
