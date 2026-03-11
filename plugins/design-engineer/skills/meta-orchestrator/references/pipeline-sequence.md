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
   ux-big-idea
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
   meta-compound       <-- save progress
        |
========== PHASE 2: STRATEGY & POSITIONING ==========
        |
   ux-storybrand
        |
   ux-business-plan
        |
   ux-6p-stories
        |
   ux-behavior-mapping [optional] ─┐
                                    ├─ [parallel-group: 2a]
   ux-psych-framework [optional]  ─┘
        |
   meta-compound       <-- save progress
        |
========== PHASE 3: PRODUCT PLANNING ==========
        |
   ux-mvp-requirements
        |
   ux-information-architecture
        |
   meta-compound       <-- save progress
        |
========== PHASE 4: DESIGN & VALIDATION ==========
        |
   ux-bias-framework
        |
   ux-journey-mapping
        |
   ux-ethics-review [optional]
        |
   ui-design-references
        |
   dev-prototyping
        |
   ui-figma-workflow
        |
   ux-product-assessment [optional]
        |
   meta-compound       <-- save progress
        |
    [USER APPROVAL CHECKPOINT]
        |
========== PHASE 5: DEVELOPMENT ==========
        |
   dev-claude-md
        |
   dev-kickstart-prompts ─────────────┐
                                     ├─ [parallel-group: 5a]
   dev-agent-pipeline   ────────────┘
        |
   dev-mcp-setup  ──────────────────┐
                                     ├─ [parallel-group: 5b]
   dev-github-workflow ─────────────┘
        |
   ui-design-system
        |
   [Development loop: context-analyzer -> plan ->
    backend -> frontend -> design-system-auditor ->
    compound]
        |
   dev-context-management [ongoing]
        |
   meta-compound       <-- final documentation
```

---

## Phase 1: Discovery and Foundation

The foundation phase. Everything built later depends on these deliverables. Skills must execute in order because each builds on the previous output.

### Skill 1.1: ux-big-idea

- **Required**: Yes
- **Depends on**: Nothing (entry point)
- **Produces**: Big Idea document – the core product vision in clear, simple language
- **Hands off to**: ux-problem-statement
- **Notes**: This is where the user explains what they want to build. The skill helps refine a rough idea into a clear vision statement. In Guided mode, the skill shares suggestions from multiple perspectives first, then asks 7-10 questions using AskUserQuestion to deeply understand the idea.

### Skill 1.2: ux-problem-statement

- **Required**: Yes
- **Depends on**: ux-big-idea (needs the product vision as context)
- **Produces**: Problem Statement document – defines what problems the product solves, for whom, and why existing solutions fall short
- **Hands off to**: ux-target-audience
- **Notes**: Frames the product around user problems rather than features. The deliverable should be specific enough to guide all future design decisions.

### Skill 1.3: ux-target-audience

- **Required**: Yes
- **Depends on**: ux-big-idea, ux-problem-statement
- **Produces**: Target Audience document – detailed profiles of the people the product serves
- **Hands off to**: ux-assumptions
- **Notes**: Defines who the users are, what they care about, what their context is. Not generic personas – specific audience segments grounded in the problem statement.

### Skill 1.4: ux-assumptions

- **Required**: Yes
- **Depends on**: ux-big-idea, ux-problem-statement, ux-target-audience
- **Produces**: Assumptions document – explicit list of what the team believes to be true but has not validated
- **Hands off to**: ux-competitor-analysis
- **Notes**: Tracks assumptions throughout the project. Updated as new information emerges. This document is a living artifact that gets revisited in later phases.

### Skill 1.5: ux-competitor-analysis

- **Required**: Yes
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: Competitor Analysis document – structured analysis of existing solutions in the space
- **Hands off to**: ux-user-interviews (if included) or meta-compound
- **Notes**: Uses web search and deep research capabilities when available. Analyzes direct and indirect competitors. Identifies gaps and opportunities.

### Skill 1.6: ux-user-interviews (OPTIONAL)

- **Required**: No
- **Depends on**: ux-target-audience, ux-assumptions
- **Produces**: User Interview findings – synthesized insights from user conversations
- **Hands off to**: meta-compound
- **When to include**: When the user has access to real users or potential users and wants to validate assumptions before proceeding. Most useful for products where the target audience is accessible.
- **When to skip**: Early-stage ideas where no users are available yet, or when the user wants to move faster through discovery.

### Phase 1 Completion: meta-compound

After all Phase 1 skills complete, invoke `meta-compound` to:
- Document all discovery deliverables
- Record key decisions and their rationale
- Update the project state file with Phase 1 status
- Prepare context summary for Phase 2

---

## Phase 2: Strategy and Positioning

Translates discovery findings into product strategy. These skills define how the product will position itself, tell its story, and drive user behavior.

### Skill 2.1: ux-storybrand

- **Required**: Yes
- **Depends on**: Phase 1 deliverables (big idea, problem statement, target audience)
- **Produces**: StoryBrand document – brand messaging framework that positions the user as the hero and the product as the guide
- **Hands off to**: ux-business-plan
- **Notes**: Applies the StoryBrand framework to create clear product messaging. The output informs copywriting, onboarding flows, and marketing materials.

### Skill 2.2: ux-business-plan

- **Required**: Yes
- **Depends on**: Phase 1 deliverables, ux-storybrand
- **Produces**: Business Plan document – monetization strategy, pricing model, growth approach
- **Hands off to**: ux-6p-stories
- **Notes**: Covers revenue model, pricing tiers, unit economics. Grounded in the target audience and competitive landscape from Phase 1.

### Skill 2.3: ux-6p-stories

- **Required**: Yes
- **Depends on**: Phase 1 deliverables, ux-storybrand, ux-business-plan
- **Produces**: 6P Stories document – narrative-driven product scenarios following the 6P framework
- **Hands off to**: ux-behavior-mapping (if included) or meta-compound
- **Notes**: Creates story-driven scenarios that illustrate how real users interact with the product. Each story covers the 6P elements. Reveals gaps in the product concept that abstract documents miss.

### Skill 2.4: ux-behavior-mapping (OPTIONAL)

- **Required**: No
- **Depends on**: Phase 1 deliverables, ux-6p-stories
- **Produces**: Behavior Mapping document – maps user behaviors, motivations, and triggers
- **Hands off to**: ux-psych-framework (if included) or meta-compound
- **When to include**: When the product relies heavily on behavior change (habit-forming apps, health products, educational tools) or when the user wants deeper insight into user motivation.
- **When to skip**: Simpler products where user behavior patterns are straightforward.

### Skill 2.5: ux-psych-framework (OPTIONAL)

- **Required**: No
- **Depends on**: Phase 1 deliverables, ux-6p-stories
- **Produces**: Psychology Framework document – identifies which psychological principles are most relevant to the product
- **Hands off to**: meta-compound
- **When to include**: When the user wants to apply design psychology principles early in the strategy phase rather than waiting for Phase 4 validation.
- **When to skip**: When the user prefers to handle psychology principles during the Design & Validation phase via ux-bias-framework.

### Phase 2 Completion: meta-compound

After all Phase 2 skills complete, invoke `meta-compound` to:
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
- **Hands off to**: meta-compound
- **Notes**: Defines the structural backbone of the product. Maps how users navigate between screens and how content is organized. The IA document becomes a critical reference for both design and development phases.

### Phase 3 Completion: meta-compound

After all Phase 3 skills complete, invoke `meta-compound` to:
- Document planning deliverables
- Record scope decisions and trade-offs
- Update the project state file with Phase 3 status
- Prepare context summary for Phase 4

---

## Phase 4: Design and Validation

Applies design principles, creates visual designs, builds prototypes, and validates the product concept. This is the most skill-dense phase.

### Skill 4.1: ux-bias-framework

- **Required**: Yes
- **Depends on**: Phase 1-3 deliverables
- **Produces**: Bias Framework analysis – identifies cognitive biases relevant to the product and recommends design patterns to address them
- **Hands off to**: ux-journey-mapping
- **Notes**: Applies psychology principles to the product design. Reviews the IA and MVP requirements through the lens of cognitive biases. Produces actionable recommendations, not just theory.

### Skill 4.2: ux-journey-mapping

- **Required**: Yes
- **Depends on**: ux-bias-framework, Phase 1-3 deliverables
- **Produces**: Journey Map document – end-to-end user experience maps showing touchpoints, emotions, pain points, and opportunities
- **Hands off to**: ux-ethics-review (if included) or ui-design-references
- **Notes**: Maps the complete user experience from first contact through ongoing use. Incorporates bias framework findings. Reveals experience gaps and emotional low points that need design attention.

### Skill 4.3: ux-ethics-review (OPTIONAL)

- **Required**: No
- **Depends on**: Phase 1-3 deliverables, ux-bias-framework
- **Produces**: Ethics Review document – assessment of ethical implications in the product design
- **Hands off to**: ui-design-references
- **When to include**: Products that handle sensitive data (health, finance, children), products with persuasive design elements, or when the user wants to ensure ethical design practices.
- **When to skip**: Straightforward utility products with minimal ethical risk.

### Skill 4.4: ui-design-references

- **Required**: Yes
- **Depends on**: Phase 1-3 deliverables, ux-journey-mapping
- **Produces**: Design References collection – curated visual references, mood boards, and design direction
- **Hands off to**: dev-prototyping
- **Notes**: Gathers visual inspiration and establishes the design direction before moving to high-fidelity work. Asks the user about their preferred visual approach.

### Skill 4.5: dev-prototyping

- **Required**: Yes
- **Depends on**: ui-design-references, information-architecture, mvp-requirements, journey-map, bias-audit
- **Produces**: Working HTML prototype – single-file prototype saved to `design-docs/prototype/prototype.html`
- **Hands off to**: ui-figma-workflow
- **Notes**: Generates a single-file HTML prototype directly in Claude Code. Pulls design context from upstream deliverables (design references, IA, journey map, bias audit) and applies design intent, typography, spacing, and color from the established design direction. The prototype serves as both a validation tool and a reference for which key screens to design in Figma.

### Skill 4.6: ui-figma-workflow

- **Required**: Yes
- **Depends on**: ui-design-references, dev-prototyping, information architecture, MVP requirements
- **Produces**: High-fidelity Figma designs – complete screen designs following the established design direction
- **Hands off to**: ux-product-assessment (if included) or meta-compound
- **Notes**: Asks the user about their preferred Figma integration method (MCP, manual, screenshots, Playwright, Chrome extension) via AskUserQuestion. Adapts the workflow to the available tools. The validated prototype informs which key screens to design in Figma. Focus Figma work on the screens that set the visual style (typically 5-10 screens).

### Skill 4.7: ux-product-assessment (OPTIONAL)

- **Required**: No
- **Depends on**: dev-prototyping, all Phase 1-4 deliverables
- **Produces**: Product Assessment document – comprehensive evaluation using a structured checklist
- **Hands off to**: meta-compound
- **When to include**: Before moving to development, to catch issues across all dimensions (usability, business viability, technical feasibility, design quality).
- **When to skip**: When the user is confident in the prototype and wants to move directly to development.

### Phase 4 Completion: meta-compound

After all Phase 4 skills complete, invoke `meta-compound` to:
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
- **Hands off to**: dev-kickstart-prompts
- **Notes**: Creates the rules file that governs AI behavior during development. Covers tech stack specifications, non-negotiable requirements, development pipeline, conflict resolution, and project status tracking.

### Skill 5.2: dev-kickstart-prompts

- **Required**: Yes
- **Depends on**: dev-claude-md, Phase 1-4 deliverables
- **Produces**: Kick-start prompts – 3-5 focused prompts for beginning development
- **Hands off to**: dev-agent-pipeline
- **Notes**: Generates high-level starting prompts that reference context documents. These are not deep technical prompts – they are references that point to the existing deliverables. Simple and focused.

### Skill 5.3: dev-agent-pipeline

- **Required**: Yes
- **Depends on**: dev-claude-md, dev-kickstart-prompts
- **Produces**: Agent pipeline configuration – specialized AI agents for the development workflow
- **Hands off to**: dev-mcp-setup
- **Notes**: Sets up the sequence of specialized agents that run for each development task (context analysis, planning, backend, frontend, design system auditing, compounding).

### Skill 5.4: dev-mcp-setup

- **Required**: Yes
- **Depends on**: dev-agent-pipeline
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
- **Depends on**: ui-figma-workflow, dev-claude-md
- **Produces**: Design system implementation – code-level design tokens, component architecture, semantic naming
- **Hands off to**: Development loop
- **Notes**: Translates the Figma design system into code. Establishes the atomic architecture pattern: tokens, semantics, components.

### Development Loop

After initial setup, development enters an iterative loop for each feature:

1. **context-analyzer** (agent) – reads project state, understands what has been built
2. **plan-creator** (agent) – creates implementation plan for the next feature
3. **Backend implementation** – server-side code
4. **Frontend implementation** – client-side code and UI
5. **design-system-auditor** (agent) – verifies new code follows the design system
6. **meta-compound** – documents progress after each feature

### Skill 5.7: dev-context-management (ONGOING)

- **Required**: Yes (runs throughout development)
- **Depends on**: All development skills
- **Produces**: Updated context files – maintains project status, development context, and session continuity
- **Notes**: Keeps the status file updated after every big development phase. Addresses the context degradation problem where AI forgets about components already built, decisions already made, and approaches that did not work. Uses a dedicated status file (separation of concerns) rather than putting everything in CLAUDE.md.

### Phase 5 Completion: meta-compound

Final invocation of `meta-compound` to:
- Document the complete project from discovery through development
- Record all learnings across the entire pipeline
- Update the project state file to reflect completion
- Create a final summary of the project

---

## Parallel Groups

Skills in the same parallel group have no dependency on each other's output and can execute simultaneously. The groups identified in the pipeline overview are:

- **[parallel-group: 2a]** – `ux-behavior-mapping` and `ux-psych-framework` are both optional and independent. Both depend on Phase 1 deliverables and `ux-6p-stories`, not on each other.
- **[parallel-group: 5a]** – `dev-kickstart-prompts` and `dev-agent-pipeline` both depend on `dev-claude-md`, not on each other.
- **[parallel-group: 5b]** – `dev-mcp-setup` and `dev-github-workflow` are independent setup tasks.

### How to Execute Parallel Groups

**God mode**: Spawn Agent subprocesses for each skill in the group simultaneously. Wait for all to complete before proceeding to the next skill in the sequence.

**Guided mode**: Inform the user: "These [N] skills can run independently. Would you like to run them in parallel (faster) or one at a time (more interactive)?" Respect the user's preference.

**Direct access**: Not applicable – the user is running a single skill.
