# Pipeline Sequence

Complete skill sequence for the design pipeline managed by `meta-orchestrator`. Each phase lists skills in execution order with their dependencies, handoff requirements, and optional markers.

## Pipeline Overview

```
                     /de:design
                        |
                 meta-orchestrator
                        |
        +---------------+---------------+
        |               |               |
   GOD MODE        GUIDED MODE     DIRECT ACCESS
   (autonomous)    (interactive)   (specific skill)
        |               |               |
        v               v               v
========== PHASE 1: DISCOVERY & FOUNDATION ==========
        |
   ux-problem-statement
        |
   ux-target-audience
        |
   ux-assumptions
        |
   ux-competitor-analysis
        |
   ux-user-interviews [optional]
        |
   meta-document       <-- save progress
        |
========== PHASE 2: STRATEGY & POSITIONING ==========
        |
   ux-behavior-mapping
        |
   ux-storybrand
        |
   ux-story-panels
        |
   ux-business-plan
        |
   meta-document       <-- save progress
        |
========== PHASE 3: PRODUCT PLANNING ==========
        |
   ux-mvp-requirements
        |
   ux-information-architecture
        |
   meta-document       <-- save progress
        |
========== PHASE 4: DESIGN & VALIDATION ==========
        |
   ux-bias-audit
        |
   ux-journey-mapping
        |
   ux-ethics-review [optional]
        |
   ui-references-moodboard
        |
   dev-prototyping
        |
   ui-figma-guide
        |
   ui-figma-handoff [optional]
        |
   ux-motivation-audit
        |
   ux-full-review [optional]
        |
   meta-document       <-- save progress
        |
    [USER APPROVAL CHECKPOINT]
        |
========== PHASE 5: DEVELOPMENT ==========
        |
   dev-claude-md
        |
   dev-starter-prompts ─────────────┐
                                     ├─ [parallel-group: 5a]
   dev-agent-setup   ────────────┘
        |
   dev-mcp-setup  ──────────────────┐
                                     ├─ [parallel-group: 5b]
   dev-github-workflow ─────────────┘
        |
   ui-design-system
        |
   [Development loop: context-analyzer -> Plan Mode ->
    test-writer -> tests (Red) -> backend -> /simplify ->
    frontend -> /simplify -> tests (Green) ->
    /simplify (final) -> design-system-auditor -> archive tests -> compound]
        |
   dev-status-tracking [ongoing]
        |
   meta-document       <-- final documentation
```

---

## Phase 1: Discovery and Foundation

The foundation phase. Everything built later depends on these deliverables. Skills must execute in order because each builds on the previous output.

### Skill 1.1: ux-problem-statement

- **Required**: Yes
- **Depends on**: Nothing (entry point)
- **Produces**: Problem Statement document – defines what problems the product solves, for whom, and why existing solutions fall short
- **Hands off to**: ux-target-audience
- **Notes**: The starting point of the entire pipeline. The user comes with an idea or a problem. This skill frames it around user needs rather than features. The deliverable should be specific enough to guide all future design decisions.

### Skill 1.2: ux-target-audience

- **Required**: Yes
- **Depends on**: ux-problem-statement
- **Produces**: Target Audience document – detailed profiles of the people the product serves
- **Hands off to**: ux-assumptions
- **Notes**: Defines who the users are, what they care about, what their context is. Not generic personas – specific audience segments grounded in the problem statement.

### Skill 1.3: ux-assumptions

- **Required**: Yes
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: Assumptions document – explicit list of what the team believes to be true but has not validated
- **Hands off to**: ux-competitor-analysis
- **Notes**: Tracks assumptions throughout the project. Updated as new information emerges. This document is a living artifact that gets revisited in later phases.

### Skill 1.4: ux-competitor-analysis

- **Required**: Yes
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: Competitor Analysis document – structured analysis of existing solutions in the space
- **Hands off to**: ux-user-interviews (if included) or meta-document
- **Notes**: Uses web search and deep research capabilities when available. Analyzes direct and indirect competitors. Identifies gaps and opportunities.

### Skill 1.5: ux-user-interviews (OPTIONAL)

- **Required**: No
- **Depends on**: ux-target-audience, ux-assumptions
- **Produces**: User Interview findings – synthesized insights from user conversations
- **Hands off to**: meta-document
- **When to include**: When the user has access to real users or potential users and wants to validate assumptions before proceeding. Most useful for products where the target audience is accessible.
- **When to skip**: Early-stage ideas where no users are available yet, or when the user wants to move faster through discovery.

### Phase 1 Completion: meta-document

After all Phase 1 skills complete, invoke `meta-document` to:
- Document all discovery deliverables
- Record key decisions and their rationale
- Update the project state file with Phase 1 status
- Prepare context summary for Phase 2

---

## Phase 2: Strategy and Positioning

Translates discovery findings into product strategy. These skills define how the product will position itself, tell its story, and drive user behavior.

### Skill 2.1: ux-behavior-mapping

- **Required**: Yes
- **Depends on**: Phase 1 deliverables (problem statement, target audience)
- **Produces**: Behavior Mapping document – maps user behaviors, motivations, abilities, and triggers using the Behavior Map framework
- **Hands off to**: ux-storybrand
- **Notes**: Foundational strategy skill. Understanding what drives user behavior (Motivation × Ability × Prompt) informs everything that follows — how to position the product, what stories to tell, and how to monetize.

### Skill 2.2: ux-storybrand

- **Required**: Yes
- **Depends on**: Phase 1 deliverables, ux-behavior-mapping
- **Produces**: StoryBrand document – brand messaging framework that positions the user as the hero and the product as the guide
- **Hands off to**: ux-story-panels
- **Notes**: Applies the StoryBrand framework to create clear product messaging. Uses behavior mapping insights to craft messaging that connects with real motivations. The output informs copywriting, onboarding flows, and marketing materials.

### Skill 2.3: ux-story-panels

- **Required**: Yes
- **Depends on**: Phase 1 deliverables, ux-storybrand
- **Produces**: Story Panels document – comic-style product scenarios following the story panels framework
- **Hands off to**: ux-business-plan
- **Notes**: Creates story-driven scenarios that illustrate how real users interact with the product, using the StoryBrand narrative. Each story covers the panel elements. Reveals gaps in the product concept that abstract documents miss.

### Skill 2.4: ux-business-plan

- **Required**: Yes
- **Depends on**: Phase 1 deliverables, ux-storybrand, ux-story-panels, ux-behavior-mapping
- **Produces**: Business Plan document – monetization strategy, pricing model, growth approach
- **Hands off to**: meta-document
- **Notes**: Covers revenue model, pricing tiers, unit economics. Informed by behavior mapping (what drives users), StoryBrand (how to communicate value), and Story Panels (user scenarios). Grounded in the target audience and competitive landscape from Phase 1.

### Phase 2 Completion: meta-document

After all Phase 2 skills complete, invoke `meta-document` to:
- Document strategy deliverables
- Record strategic decisions and positioning choices
- Update the project state file with Phase 2 status
- Prepare context summary for Phase 3

---

## Phase 3: Product Planning

Converts strategy into concrete product specifications. These are the blueprints that guide design and development.

### Skill 3.1: ux-mvp-requirements

- **Required**: Yes
- **Depends on**: Phase 1 and Phase 2 deliverables
- **Produces**: MVP Requirements document – feature specifications, scope definition, priority tiers
- **Hands off to**: ux-information-architecture
- **Notes**: Defines what goes into the MVP and what gets deferred to post-MVP. Every feature traces back to the problem statement and target audience. Uses the business plan to inform priority decisions.

### Skill 3.2: ux-information-architecture

- **Required**: Yes
- **Depends on**: ux-mvp-requirements, Phase 1 and Phase 2 deliverables
- **Produces**: Information Architecture document – navigation structure, user flows, screen inventory, content hierarchy
- **Hands off to**: meta-document
- **Notes**: Defines the structural backbone of the product. Maps how users navigate between screens and how content is organized. The IA document becomes a critical reference for both design and development phases.

### Phase 3 Completion: meta-document

After all Phase 3 skills complete, invoke `meta-document` to:
- Document planning deliverables
- Record scope decisions and trade-offs
- Update the project state file with Phase 3 status
- Prepare context summary for Phase 4

---

## Phase 4: Design and Validation

Applies design principles, creates visual designs, builds prototypes, and validates the product concept. This is the most skill-dense phase.

### Skill 4.1: ux-bias-audit

- **Required**: Yes
- **Depends on**: Phase 1-3 deliverables
- **Produces**: Bias Framework analysis – identifies cognitive biases relevant to the product and recommends design patterns to address them
- **Hands off to**: ux-journey-mapping
- **Notes**: Applies psychology principles to the product design. Reviews the IA and MVP requirements through the lens of cognitive biases. Produces actionable recommendations, not just theory.

### Skill 4.2: ux-journey-mapping

- **Required**: Yes
- **Depends on**: ux-bias-audit, Phase 1-3 deliverables
- **Produces**: Journey Map document – end-to-end user experience maps showing touchpoints, emotions, pain points, and opportunities
- **Hands off to**: ux-ethics-review (if included) or ui-references-moodboard
- **Notes**: Maps the complete user experience from first contact through ongoing use. Incorporates bias framework findings. Reveals experience gaps and emotional low points that need design attention.

### Skill 4.3: ux-ethics-review (OPTIONAL)

- **Required**: No
- **Depends on**: Phase 1-3 deliverables, ux-bias-audit
- **Produces**: Ethics Review document – assessment of ethical implications in the product design
- **Hands off to**: ui-references-moodboard
- **When to include**: Products that handle sensitive data (health, finance, children), products with persuasive design elements, or when the user wants to ensure ethical design practices.
- **When to skip**: Straightforward utility products with minimal ethical risk.

### Skill 4.4: ui-references-moodboard

- **Required**: Yes
- **Depends on**: Phase 1-3 deliverables, ux-journey-mapping
- **Produces**: Design References collection – curated visual references, mood boards, and design direction
- **Hands off to**: dev-prototyping
- **Notes**: Gathers visual inspiration and establishes the design direction before moving to high-fidelity work. Asks the user about their preferred visual approach.

### Skill 4.5: dev-prototyping

- **Required**: Yes
- **Depends on**: ui-references-moodboard, information-architecture, mvp-requirements, journey-map, bias-audit
- **Produces**: Working HTML prototype – single-file prototype saved to `design-docs/prototype/prototype.html`
- **Hands off to**: ui-figma-guide
- **Notes**: Generates a single-file HTML prototype directly in Claude Code. Pulls design context from upstream deliverables (design references, IA, journey map, bias audit) and applies design intent, typography, spacing, and color from the established design direction. The prototype serves as both a validation tool and a reference for which key screens to design in Figma.

### Skill 4.6: ui-figma-guide

- **Required**: Yes
- **Depends on**: ui-references-moodboard, dev-prototyping, information architecture, MVP requirements
- **Produces**: High-fidelity Figma designs – complete screen designs following the established design direction
- **Hands off to**: ux-full-review (if included) or meta-document
- **Notes**: Asks the user about their preferred Figma integration method (MCP, manual, screenshots, Playwright, Chrome extension) via AskUserQuestion. Adapts the workflow to the available tools. The validated prototype informs which key screens to design in Figma. Focus Figma work on the screens that set the visual style (typically 5-10 screens).

### Skill 4.7: ui-figma-handoff (OPTIONAL)

- **Required**: No
- **Depends on**: ui-figma-guide
- **Produces**: Structured Figma file with components, tokens, annotations, and dev status badges
- **Hands off to**: ux-full-review (if included) or meta-document
- **When to include**: When Figma Console MCP is available and the user wants higher-quality developer handoff from Figma
- **When to skip**: When using the minimal Figma workflow without Figma Console MCP, or when the design system is being built entirely in code
- **Notes**: Automates the structuring of raw Figma designs (components, variables, styles) and prepares them for dev handoff (annotations, sections, connectors, dev status badges). Requires Figma Console MCP.

### Skill 4.8: ux-motivation-audit

- **Required**: Yes
- **Depends on**: dev-prototyping, ui-figma-guide, Phase 1-3 deliverables
- **Produces**: Motivation Framework analysis – screen-level Motivation Levels and Experience Value analysis
- **Hands off to**: ux-full-review (if included) or meta-document
- **Notes**: Analyzes each screen's motivation vs friction using the Motivation Framework (Experience Value = Expected Utility − Expected Interaction Cost). Requires actual designs or prototypes to analyze — that's why it runs after prototyping and Figma work, not during Strategy. Identifies where users are most likely to abandon and where motivation peaks.

### Skill 4.9: ux-full-review (OPTIONAL)

- **Required**: No
- **Depends on**: dev-prototyping, all Phase 1-4 deliverables
- **Produces**: Product Assessment document – comprehensive evaluation using a structured checklist
- **Hands off to**: meta-document
- **When to include**: Before moving to development, to catch issues across all dimensions (usability, business viability, technical feasibility, design quality).
- **When to skip**: When the user is confident in the prototype and wants to move directly to development.

### Phase 4 Completion: meta-document

After all Phase 4 skills complete, invoke `meta-document` to:
- Document all design and validation deliverables
- Record design decisions and validation findings
- Update the project state file with Phase 4 status
- Prepare a comprehensive summary for the user approval checkpoint

---

## User Approval Checkpoint

This is the boundary between pre-development activities (Phases 1-4) and development activities (Phase 5). Even in God mode, the orchestrator must pause here.

### What to present:
1. Summary of all completed phases and their key deliverables
2. List of any skipped optional skills
3. Key decisions made throughout the pipeline
4. Known risks or gaps identified during the process
5. Recommendation for whether to proceed to development or revisit any phase

### What to ask:
<ask-user>
All pre-development phases are complete. Before we proceed to development:

1. **Proceed to development** – Everything looks good, start Phase 5
2. **Review specific deliverables** – I want to revisit some outputs before moving on
3. **Run skipped optional skills** – I want to include some skills I skipped earlier
4. **Stop here** – I will handle development separately
</ask-user>

If the user proceeds to development, ask about model preference:

<ask-user>
Development works well with a faster model. Which would you prefer?

1. **Sonnet (Recommended)** – Faster execution, good for implementation tasks
2. **Opus** – More thorough but slower, better if implementation involves complex architecture
</ask-user>

If the user picks Sonnet, suggest: "Switch with `/model sonnet` before we continue."

---

## Phase 5: Development

Sets up the development environment, creates implementation guides, and manages the development workflow. This phase transitions from design thinking to code.

### Skill 5.1: dev-claude-md

- **Required**: Yes
- **Depends on**: Phase 1-4 deliverables
- **Produces**: CLAUDE.md file – global rules for AI-assisted development
- **Hands off to**: dev-starter-prompts
- **Notes**: Creates the rules file that governs AI behavior during development. Covers tech stack specifications, non-negotiable requirements, development pipeline, conflict resolution, and project status tracking.

### Skill 5.2: dev-starter-prompts

- **Required**: Yes
- **Depends on**: dev-claude-md, Phase 1-4 deliverables
- **Produces**: Kick-start prompts – 3-5 focused prompts for beginning development
- **Hands off to**: dev-agent-setup
- **Notes**: Generates high-level starting prompts that reference context documents. These are not deep technical prompts – they are references that point to the existing deliverables. Simple and focused.

### Skill 5.3: dev-agent-setup

- **Required**: Yes
- **Depends on**: dev-claude-md, dev-starter-prompts
- **Produces**: Agent pipeline configuration – specialized AI agents for the development workflow
- **Hands off to**: dev-mcp-setup
- **Notes**: Sets up the sequence of specialized agents that run for each development task (context analysis, planning, backend, frontend, design system auditing, compounding).

### Skill 5.4: dev-mcp-setup

- **Required**: Yes
- **Depends on**: dev-agent-setup
- **Produces**: MCP configuration – configured Model Context Protocol servers for the project
- **Hands off to**: dev-github-workflow
- **Notes**: Configures relevant MCP servers based on the project's needs and the user's environment. Uses the environment detection from meta-setup.

### Skill 5.5: dev-github-workflow

- **Required**: Yes
- **Depends on**: dev-mcp-setup
- **Produces**: GitHub workflow configuration – repository setup, branching strategy, CI/CD basics
- **Hands off to**: ui-design-system
- **Notes**: Sets up version control and collaboration workflow. Covers commits, branches, pull requests, and basic automation.

### Skill 5.6: ui-design-system

- **Required**: Yes
- **Depends on**: ui-figma-guide, dev-claude-md
- **Produces**: Design system implementation – code-level design tokens, component architecture, semantic naming
- **Hands off to**: Development loop
- **Notes**: Translates the Figma design system into code. Establishes the atomic architecture pattern: tokens, semantics, components.

### Development Loop

After initial setup, development enters an iterative loop for each feature:

1. **context-analyzer** (agent) – reads project state, understands what has been built
2. **Plan Mode** – enter Plan Mode, write structured plan, get approval, save to `plans/`
3. **test-writer** (agent) – writes failing Playwright CLI test scripts to `tests/`
4. **Run tests** – verify Red phase (all tests fail — feature not built yet)
5. **Backend implementation** – server-side code
6. **`/simplify`** – review backend changes for reuse, quality, and efficiency
7. **Frontend implementation** – client-side code and UI
8. **`/simplify`** – review frontend changes for reuse, quality, and efficiency
9. **Run tests** – verify Green phase (all tests pass)
10. **`/simplify`** (final pass) – review all code changes together
11. **design-system-auditor** (agent) – verifies new code follows the design system
12. **Archive tests** – move test scripts from `tests/` to `tests/archive/`
13. **meta-document** – documents progress after each feature

### Skill 5.7: dev-status-tracking (ONGOING)

- **Required**: Yes (runs throughout development)
- **Depends on**: All development skills
- **Produces**: Updated context files – maintains project status, development context, and session continuity
- **Notes**: Keeps the status file updated after every big development phase. Addresses the context degradation problem where AI forgets about components already built, decisions already made, and approaches that did not work. Uses a dedicated status file (separation of concerns) rather than putting everything in CLAUDE.md.

### Phase 5 Completion: meta-document

Final invocation of `meta-document` to:
- Document the complete project from discovery through development
- Record all learnings across the entire pipeline
- Update the project state file to reflect completion
- Create a final summary of the project

---

## Parallel Groups

Skills in the same parallel group have no dependency on each other's output and can execute simultaneously. The groups identified in the pipeline overview are:

- **[parallel-group: 5a]** – `dev-starter-prompts` and `dev-agent-setup` both depend on `dev-claude-md`, not on each other.
- **[parallel-group: 5b]** – `dev-mcp-setup` and `dev-github-workflow` are independent setup tasks.

### How to Execute Parallel Groups

**God mode**: Spawn Agent subprocesses for each skill in the group simultaneously. Wait for all to complete before proceeding to the next skill in the sequence.

**Guided mode**: Inform the user: "These [N] skills can run independently. Would you like to run them in parallel (faster) or one at a time (more interactive)?" Respect the user's preference.

**Direct access**: Not applicable – the user is running a single skill.
