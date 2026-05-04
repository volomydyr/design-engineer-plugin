# Pipeline Sequence

Complete skill sequence for the design pipeline managed by `meta-orchestrator`. Each phase lists skills in execution order with their dependencies, handoff requirements, and optional markers.

## Pipeline Overview

```
                     /product:design
                        |
                 meta-orchestrator
                        |
        +---------------+---------------+
        |               |               |
   AUTOPILOT        GUIDED MODE     DIRECT ACCESS
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
   ux-full-review [required]
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

## Pipeline Overview (present to user before Phase 1)

Before starting the first activity, present the user with a map of the journey:

> **Here's what we'll do together:**
>
> **Phase 1 – Discovery** (5 activities): Define the problem, identify your audience, map assumptions, research competitors, optionally interview users.
> **Phase 2 – Strategy** (4 activities): Map user behavior, craft your brand story, create story panels, plan the business model.
> **Phase 3 – Planning** (2 activities): Define MVP requirements, design information architecture.
> **Phase 4 – Design & validation** (8+ activities): Psychology audits, design references, prototyping, Figma workflow, additional psychology skills, comprehensive review.
> **Phase 5 – Development**: Set up the project, implement phase by phase with testing and quality checks.
>
> You can stop at any point – your progress is saved automatically. Run `/product:launch` to resume where you left off. Run `/product:stop` if you want to save mid-activity progress.

Use AskUserQuestion to confirm the user is ready to begin.

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
- **Notes**: Foundational strategy skill. Understanding what drives user behavior (Motivation × Ability × Prompt) informs everything that follows – how to position the product, what stories to tell, and how to monetize.

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

## [COMPACTION BREAKPOINT 1]

After Phase 3 completes, suggest compaction. The design activities (Phases 1–3) are done and all deliverables are saved to files. A fresh context for Phase 4 (prototyping, Figma, psychology) produces better results.

Read `skills/shared-references/compact-template.md` and generate a ready-to-use compact message for the user. Include it in the same response. This is a suggestion, not a requirement – if the user dismisses it, do not bring it up again.

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
- **Produces**: Working HTML prototype – single-file prototype saved to `design-docs/.design-engineer-plugin/prototype/prototype.html`
- **Hands off to**: ui-figma-guide
- **Notes**: Generates a single-file HTML prototype directly in Claude Code. Pulls design context from upstream deliverables (design references, IA, journey map, bias audit) and applies design intent, typography, spacing, and color from the established design direction. The prototype serves as both a validation tool and a reference for which key screens to design in Figma.

### Skill 4.6: ui-figma-guide

- **Required**: Yes
- **Depends on**: ui-references-moodboard, dev-prototyping, information architecture, MVP requirements
- **Produces**: High-fidelity Figma designs – complete screen designs following the established design direction
- **Hands off to**: ux-full-review (if included) or meta-document
- **Notes**: Asks the user about their preferred Figma integration method (MCP, manual, screenshots, Playwright, Chrome extension) via AskUserQuestion. Adapts the workflow to the available tools. The validated prototype informs which key screens to design in Figma. Focus Figma work on the screens that set the visual style (typically 5-10 screens).

### [FIGMA DESIGN CHECKPOINT]

After ui-figma-guide completes, the user leaves to design in Figma. This is a natural pause point.

Present via AskUserQuestion:
```
question: "Your prototypes are in Figma. What would you like to do?"
header: "Figma checkpoint"
options:
  - label: "I'm done designing"
    description: "My Figma designs are ready for psychology review"
  - label: "I need more time"
    description: "I'll come back when my designs are ready – save my progress"
  - label: "Skip Figma"
    description: "I'll use the prototype as-is for the psychology review"
allowMultiSelect: false
```

If "I need more time": save state, suggest compaction with compact-template.md, and make it easy to resume. The user will start a new session and run `/product:launch` to pick up at "designs ready for psychology review."

### Skill 4.7: ui-figma-handoff (OPTIONAL)

- **Required**: No
- **Depends on**: ui-figma-guide
- **Produces**: Structured Figma file with components, tokens, annotations, and dev status badges
- **Hands off to**: ux-full-review (if included) or meta-document
- **When to include**: When Figma Console MCP is available and the user wants higher-quality developer handoff from Figma
- **When to skip**: When using the minimal Figma workflow without Figma Console MCP, or when the design system is being built entirely in code
- **Notes**: Automates the structuring of raw Figma designs (components, variables, styles) and prepares them for dev handoff (annotations, sections, connectors, dev status badges). Requires Figma Console MCP.

### Skill 4.8: Psychology skill selection (dynamic)

- **Required**: Yes (at least ux-motivation-audit)
- **Depends on**: dev-prototyping, ui-figma-guide, Phase 1-3 deliverables
- **Notes**: The plugin has 14 psychology skills. Instead of hardcoding which ones run, present ALL available skills and let the user choose.

**Step 1**: Present all available psychology skills in a message (one line each: name + what it does + when it's useful):

- `ux-motivation-audit` – Screen-level motivation vs friction analysis. Identifies where users abandon and where motivation peaks. Recommended for all products.
- `psych-cognitive-load` – Cognitive interaction fundamentals. Choice architecture, information grouping, discoverability. Recommended for complex UIs.
- `psych-cognitive-biases` – Cognitive biases and self-perception. Knowledge gaps, planning fallacies. Useful for products involving user decisions.
- `psych-decision-fundamentals` – Core decision-making. Loss aversion, decision fatigue, anchoring, defaults. Useful for products with pricing or onboarding choices.
- `psych-decision-persuasion` – Advanced persuasion. Scarcity, social proof, ethical influence. Useful for products needing conversion optimization.
- `psych-delight-design` – Emotional design. Peak moments, micro-delighters, perceived effort. Useful for consumer products.
- `psych-emotional-retention` – Re-engagement and emotional retention. Useful for products needing repeat usage.
- `psych-engagement-patterns` – Engagement loops and habit triggers. Useful for daily-use products.
- `psych-habit-formation` – Habit formation mechanics. Useful for products that need to become part of the user's routine.
- `psych-pricing-psychology` – Pricing perception and framing. Useful for products with pricing pages or tiers.
- `psych-simplification` – Interface simplification and progressive disclosure. Useful for feature-rich products.
- `psych-social-influence` – Social dynamics and peer effects. Useful for products with social or community features.
- `psych-time-perception` – Time perception and wait management. Useful for products with loading or processing states.
- `psych-visual-perception` – Visual hierarchy and attention patterns. Recommended for landing pages and dashboards.

**Step 2**: Use AskUserQuestion with multiSelect. Pre-select the recommended skills based on the product type. Always include ux-motivation-audit as the first option.

```
question: "Which psychology audits would you like to run on your designs?"
header: "Psychology skills"
options:
  - label: "ux-motivation-audit (recommended)"
    description: "Screen-level motivation analysis – where users abandon and where they're motivated"
  - label: "[AI-recommended skill 2]"
    description: "[Why it's relevant to this product]"
  - label: "[AI-recommended skill 3]"
    description: "[Why it's relevant to this product]"
  - label: "[AI-recommended skill 4]"
    description: "[Why it's relevant to this product]"
allowMultiSelect: true
```

The user can also type additional skills from the full list shown in the message.

**Step 3**: Run the selected skills in order. Each follows its own SKILL.md workflow with Step 0, BLOCKING tags, and incremental output.

### Skill 4.9: ux-full-review (Required)

- **Required**: Yes
- **Depends on**: dev-prototyping, all Phase 1-4 deliverables
- **Produces**: Product Assessment document – comprehensive evaluation using a structured checklist
- **Hands off to**: meta-document
- **Notes**: Runs before moving to development, to catch issues across all dimensions (usability, business viability, technical feasibility, design quality). This is a required checkpoint to ensure design integrity before entering the development phase.

### Phase 4 Completion: meta-document

After all Phase 4 skills complete, invoke `meta-document` to:
- Document all design and validation deliverables
- Record design decisions and validation findings
- Update the project state file with Phase 4 status
- Prepare a comprehensive summary for the user approval checkpoint

---

## User Approval Checkpoint

This is the boundary between pre-development activities (Phases 1-4) and development activities (Phase 5). Even in Autopilot, the orchestrator must pause here.

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

## [COMPACTION BREAKPOINT 2]

After the User Approval Checkpoint and before development begins, suggest compaction. Phases 1–4 are complete, all design deliverables are saved, and development needs a fresh context for implementation work.

Read `skills/shared-references/compact-template.md` and generate a ready-to-use compact message. Include it in the same response. This is a suggestion, not a requirement.

---

## Phase 5: Development

Sets up the development environment, creates implementation guides, and manages the development workflow. This phase transitions from design thinking to code.

### Build Target Detection

Before running any Phase 5 skills, read the MVP requirements and Information Architecture documents to identify distinct build targets (e.g., macOS app + web landing page, Chrome extension + backend API, mobile app + web dashboard).

If multiple build targets exist, present via AskUserQuestion:

```
question: "Your product has multiple build targets. Which would you like to build first?"
header: "Build targets"
options:
  - label: "[Target 1 name]"
    description: "[Tech stack and scope]"
  - label: "[Target 2 name]"
    description: "[Tech stack and scope]"
allowMultiSelect: false
```

Each build target gets its own Phase 5 loop: separate CLAUDE.md, separate git repo/folder, separate design system, separate development loop. After the first target is complete, ask if the user wants to proceed to the next target.

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
2. **Plan Mode** – enter Plan Mode, write structured plan, get approval, save to `.design-engineer-plugin/.design-engineer-plugin/plans/`
3. **test-writer** (agent) – writes failing Playwright CLI test scripts to `tests/`
4. **Run tests** – verify Red phase (all tests fail – feature not built yet)
5. **backend-implementer** (agent) – server-side code. Delegate to the agent, do not write backend code yourself.
6. **`/simplify`** – MANDATORY review of backend changes for reuse, quality, and efficiency
7. **frontend-implementer** (agent) – client-side code and UI. Delegate to the agent, do not write frontend code yourself.
8. **`/simplify`** – MANDATORY review of frontend changes for reuse, quality, and efficiency
9. **Run tests** – verify Green phase (all tests pass)
10. **`/simplify`** (final pass) – review all code changes together
11. **design-system-auditor** (agent) – verifies new code follows the design system
12. **Archive tests** – move test scripts from `tests/` to `tests/archive/`
13. **meta-document** – documents progress after each feature

**BLOCKING: Per-phase approval is mandatory.** Never implement multiple phases in a single turn. Each phase: implement → present with QA instructions from the plan → WAIT for explicit user approval → only then proceed to next phase. If a phase has no manual QA possible, state "No manual QA needed for this phase" instead of skipping the approval step.

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

### Pipeline Conclusion

After dev-status-tracking and the final meta-document, present a personalized, dynamic conclusion. This is NOT a generic checklist. Read the actual deliverables and project state, then:

1. **Acknowledge what was accomplished** – specific to this product, referencing actual deliverables and decisions
2. **Highlight key decisions** – the choices that shaped the product (from MEMORY.md key decisions or deliverables)
3. **Show what's possible next** – dynamic, based on what was built and what the plugin can still help with:
   - Iterate on user feedback
   - Add new features via `/product:design` (existing project flow)
   - Run design reviews or psychology audits via `/product:review`
   - Build additional build targets (if any remain)
   - Run specific psychology skills on real screens
   - Refine Figma designs and sync code
   - Set up user testing
4. **Make the user feel good** – like a mentor wrapping up, not a checkbox completion screen

Use AskUserQuestion for next steps (never plain text).

---

## Parallel Groups

Skills in the same parallel group have no dependency on each other's output and can execute simultaneously. The groups identified in the pipeline overview are:

- **[parallel-group: 5a]** – `dev-starter-prompts` and `dev-agent-setup` both depend on `dev-claude-md`, not on each other.
- **[parallel-group: 5b]** – `dev-mcp-setup` and `dev-github-workflow` are independent setup tasks.

### How to Execute Parallel Groups

**Autopilot**: Spawn Agent subprocesses for each skill in the group simultaneously. Wait for all to complete before proceeding to the next skill in the sequence.

**Guided mode**: Inform the user: "These [N] skills can run independently. Would you like to run them in parallel (faster) or one at a time (more interactive)?" Respect the user's preference.

**Direct access**: Not applicable – the user is running a single skill.
