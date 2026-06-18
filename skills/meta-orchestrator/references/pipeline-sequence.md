# Pipeline Sequence

Skill reference for the design pipeline managed by `meta-orchestrator`. The default run is a lean spine of six steps; everything else is opt-in depth available on request. Each entry below lists a skill's dependencies, handoff requirements, and whether it's on the spine or opt-in.

## Pipeline Overview

```
                     /design-engineer:discovery
                        |
                 meta-orchestrator
                        |
        +---------------+---------------+
        |                               |
   GUIDED MODE                     AUTOPILOT
   (interactive)                  (autonomous)
        |                               |
        v                               v
================= DEFAULT SPINE =================
        |
   ux-problem-statement        (Problem)
        |
   ux-target-audience          (Audience)
        |
   ux-mvp-requirements         (MVP)
        |
   ux-information-architecture (IA)
        |
   dev-prototyping             (Prototype)
        |
   meta-document       <-- save progress (milestone)
        |
    [USER APPROVAL CHECKPOINT]
        |
================= DEVELOPMENT ===================
        |
   dev-claude-md
        |
   dev-starter-prompts ─────────────┐
                                     ├─ [parallel-group: a]
   dev-agent-setup   ────────────┘
        |
   dev-mcp-setup  ──────────────────┐
                                     ├─ [parallel-group: b]
   dev-github-workflow ─────────────┘
        |
   ui-design-system
        |
   [Development loop: Plan Mode -> backend -> /simplify ->
    frontend -> /simplify -> design-system-auditor]
        |
   dev-status-tracking [ongoing]
        |
   meta-document       <-- final documentation
```

Opt-in depth skills slot in at their natural point when the user chooses them: discovery-stage analyses (`ux-competitor-analysis`, `ux-user-interviews`, `ux-storybrand`, `ux-story-panels`, `ux-business-plan`) after Audience; design-stage audits (`ux-bias-audit`, `ux-ethics-review`, `ux-journey-mapping`, `ui-references-moodboard`, `ui-figma-guide`, `ui-figma-handoff`, the psychology audits, `ux-full-review`) after Prototype and before the approval checkpoint.

---

## Pipeline Overview (present to user before the first skill)

Before starting the first activity, present the user with a map of the journey:

> **Here's what we'll do together:**
>
> **Problem** – define what the product solves, for whom, and why existing solutions fall short.
> **Audience** – identify the specific people it serves and their context.
> **MVP** – define feature scope and priority tiers.
> **IA** – design the navigation structure, user flows, and screen inventory.
> **Prototype** – build a working prototype to validate the concept.
> **Development** – set up the project and implement step by step with quality checks.
>
> You can also add depth wherever it helps – competitor analysis, user interviews, brand story, business plan, bias/ethics/journey audits, psychology audits – just ask.
>
> You can stop at any point – your progress is saved automatically. Run `/design-engineer:launch` to resume where you left off. Run `/design-engineer:stop` if you want to save mid-activity progress.

Use AskUserQuestion to confirm the user is ready to begin.

---

## Discovery and planning

The foundation of the product. On the default spine, this means four steps: Problem, Audience, MVP, and IA. The discovery-stage depth skills (assumptions, competitor analysis, user interviews, behavior mapping, storybrand, story panels, business plan) are off the spine and added only when the user chooses them.

### ux-problem-statement (spine)

- **On the spine**: Yes (step 1)
- **Depends on**: Nothing (entry point)
- **Produces**: Problem Statement document – defines what problems the product solves, for whom, and why existing solutions fall short
- **Hands off to**: ux-target-audience
- **Notes**: The starting point of the entire pipeline. The user comes with an idea or a problem. This skill frames it around user needs rather than features. The deliverable should be specific enough to guide all future design decisions.

### ux-target-audience (spine)

- **On the spine**: Yes (step 2)
- **Depends on**: ux-problem-statement
- **Produces**: Target Audience document – detailed profiles of the people the product serves
- **Hands off to**: ux-mvp-requirements, or to a chosen discovery-stage depth skill
- **Notes**: Defines who the users are, what they care about, what their context is. Not generic personas – specific audience segments grounded in the problem statement.

### ux-mvp-requirements (spine)

- **On the spine**: Yes (step 3)
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: MVP Requirements document – feature specifications, scope definition, priority tiers
- **Hands off to**: ux-information-architecture
- **Notes**: Defines what goes into the MVP and what gets deferred to post-MVP. Every feature traces back to the problem statement and target audience.

### ux-information-architecture (spine)

- **On the spine**: Yes (step 4)
- **Depends on**: ux-mvp-requirements, problem statement, target audience
- **Produces**: Information Architecture document – navigation structure, user flows, screen inventory, content hierarchy
- **Hands off to**: dev-prototyping
- **Notes**: Defines the structural backbone of the product. Maps how users navigate between screens and how content is organized. The IA document is a critical reference for both design and development.

### ux-assumptions (opt-in depth)

- **On the spine**: No
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: Assumptions document – explicit list of what the team believes to be true but has not validated
- **When to include**: When the concept rests on unvalidated beliefs worth tracking as a living artifact.

### ux-competitor-analysis (opt-in depth)

- **On the spine**: No
- **Depends on**: ux-problem-statement, ux-target-audience
- **Produces**: Competitor Analysis document – structured analysis of existing solutions in the space
- **When to include**: When entering a crowded or unfamiliar market. Uses web search and deep research when available; analyzes direct and indirect competitors and identifies gaps.

### ux-user-interviews (opt-in depth)

- **On the spine**: No
- **Depends on**: ux-target-audience
- **Produces**: User Interview findings – synthesized insights from user conversations
- **When to include**: When the user has access to real or potential users and wants to validate assumptions. Skip for early-stage ideas where no users are available yet.

### ux-behavior-mapping (opt-in depth)

- **On the spine**: No
- **Depends on**: problem statement, target audience
- **Produces**: Behavior Mapping document – maps user behaviors, motivations, abilities, and triggers (Motivation × Ability × Prompt)
- **When to include**: When you want a behavioral backbone before crafting messaging or monetization.

### ux-storybrand (opt-in depth)

- **On the spine**: No
- **Depends on**: problem statement, target audience (and ux-behavior-mapping if run)
- **Produces**: StoryBrand document – brand messaging framework that positions the user as the hero and the product as the guide
- **When to include**: When positioning and copy need a clear backbone. The output informs copywriting and onboarding.

### ux-story-panels (opt-in depth)

- **On the spine**: No
- **Depends on**: ux-storybrand (if run), problem statement, target audience
- **Produces**: Story Panels document – comic-style product scenarios
- **When to include**: When you want to surface concept gaps that abstract documents miss.

### ux-business-plan (opt-in depth)

- **On the spine**: No
- **Depends on**: problem statement, target audience (and storybrand / story panels / behavior mapping if run)
- **Produces**: Business Plan document – monetization strategy, pricing model, growth approach
- **When to include**: When the revenue model is unsettled. Covers revenue model, pricing tiers, and unit economics.

---

## Compaction breakpoint

After the planning steps and any chosen depth, suggest compaction. The deliverables are saved to files; a fresh context for prototyping and design produces better results.

Read `skills/shared-references/compact-template.md` and generate a ready-to-use compact message for the user. Include it in the same response. This is a suggestion, not a requirement – if the user dismisses it, do not bring it up again.

---

## Design and validation

The default spine has one design step here: the prototype. The other design-stage skills (references and moodboard, Figma guide, Figma handoff, bias audit, journey mapping, ethics review, psychology audits, full review) are opt-in depth, added when the project warrants it. They slot in after the prototype and before the approval checkpoint.

### dev-prototyping (spine)

- **On the spine**: Yes (step 5)
- **Depends on**: ux-information-architecture, ux-mvp-requirements (plus any chosen references / bias / journey deliverables)
- **Produces**: Working HTML prototype – single-file prototype saved to `.design-engineer-plugin/prototype/prototype.html`
- **Hands off to**: the user-approval checkpoint, or a chosen design-stage depth skill
- **Notes**: Generates a single-file HTML prototype directly in Claude Code. Pulls design context from upstream deliverables (IA, MVP requirements, and any design references / journey map / bias audit that were run) and applies design intent, typography, spacing, and color. The prototype serves as both a validation tool and a reference for which key screens to design in Figma.

### ui-references-moodboard (opt-in depth)

- **On the spine**: No
- **Depends on**: problem statement, target audience, IA (and ux-journey-mapping if run)
- **Produces**: Design References collection – curated visual references, mood boards, and design direction
- **When to include**: When you want to establish a deliberate visual direction before prototyping. Asks the user about their preferred visual approach.

### ux-bias-audit (opt-in depth)

- **On the spine**: No
- **Depends on**: IA, MVP requirements
- **Produces**: Bias Framework analysis – identifies cognitive biases relevant to the product and recommends design patterns to address them
- **When to include**: For decision-heavy products. Reviews the IA and MVP requirements through the lens of cognitive biases; produces actionable recommendations, not just theory.

### ux-journey-mapping (opt-in depth)

- **On the spine**: No
- **Depends on**: IA, MVP requirements (and ux-bias-audit if run)
- **Produces**: Journey Map document – end-to-end user experience maps showing touchpoints, emotions, pain points, and opportunities
- **When to include**: For multi-touchpoint flows. Reveals experience gaps and emotional low points that need design attention.

### ux-ethics-review (opt-in depth)

- **On the spine**: No
- **Depends on**: IA, MVP requirements (and ux-bias-audit if run)
- **Produces**: Ethics Review document – assessment of ethical implications in the product design
- **When to include**: Products that handle sensitive data (health, finance, children) or use persuasive design. Skip for straightforward utility products with minimal ethical risk.

### ui-figma-guide (opt-in depth)

- **On the spine**: No
- **Depends on**: dev-prototyping, IA, MVP requirements (and ui-references-moodboard if run)
- **Produces**: High-fidelity Figma designs – complete screen designs following the established design direction
- **When to include**: When the user wants high-fidelity Figma work. Asks about the preferred Figma integration method (MCP, manual, screenshots, Playwright, Chrome extension) via AskUserQuestion and adapts to the available tools. Focus Figma work on the screens that set the visual style (typically 5-10 screens).

### Figma design checkpoint (when ui-figma-guide was run)

If the user ran ui-figma-guide, they leave to design in Figma. This is a natural pause point.

Present via AskUserQuestion:
```
question: "Your prototypes are in Figma. What would you like to do?"
header: "Figma checkpoint"
options:
  - label: "I'm done designing"
    description: "My Figma designs are ready"
  - label: "I need more time"
    description: "I'll come back when my designs are ready – save my progress"
  - label: "Skip Figma"
    description: "I'll use the prototype as-is"
allowMultiSelect: false
```

If "I need more time": save state, suggest compaction with compact-template.md, and make it easy to resume. The user will start a new session and run `/design-engineer:launch` to pick up where they left off.

### ui-figma-handoff (opt-in depth)

- **On the spine**: No
- **Depends on**: ui-figma-guide
- **Produces**: Structured Figma file with components, tokens, annotations, and dev status badges
- **When to include**: When the bundled Figma MCP is available and the user wants higher-quality developer handoff from Figma. Skip when using the minimal Figma workflow or when the design system is being built entirely in code.
- **Notes**: Automates the structuring of raw Figma designs (components, variables, styles) and prepares them for dev handoff (annotations, sections, connectors, dev status badges).

### Psychology audits (opt-in depth)

- **On the spine**: No
- **Depends on**: dev-prototyping (and ui-figma-guide if run), problem statement, target audience, MVP requirements
- **Notes**: When the user wants behavioral analysis of the designs, present the available psychology skills and let the user choose. Do not hardcode which ones run.

**Step 1**: Present the available psychology skills in a message (one line each: name + what it does + when it's useful):

- `ux-motivation-audit` – Screen-level motivation vs friction analysis. Identifies where users abandon and where motivation peaks. Recommended for all products.
- `psych-cognitive-load` – Cognitive interaction fundamentals. Choice architecture, information grouping, discoverability. Recommended for complex UIs.
- `psych-cognitive-biases` – Cognitive biases and self-perception. Knowledge gaps, planning fallacies. Useful for products involving user decisions.
- `psych-decision-fundamentals` – Decision-making and persuasion. Loss aversion, decision fatigue, anchoring, defaults, scarcity, social proof, ethical influence. Useful for products with pricing or onboarding choices and conversion optimization.
- `psych-delight-design` – Emotional design and retention. Peak moments, micro-delighters, perceived effort, re-engagement, emotional attachment. Useful for consumer products and products needing repeat usage.
- `psych-engagement-patterns` – Engagement loops and habit triggers. Useful for daily-use products.
- `psych-pricing-psychology` – Pricing perception, framing, and habit formation. Useful for products with pricing pages or tiers and products that need to become part of the user's routine.
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

### ux-full-review (opt-in depth)

- **On the spine**: No
- **Depends on**: dev-prototyping and the deliverables produced so far
- **Produces**: Product Assessment document – comprehensive evaluation using a structured checklist
- **When to include**: Before moving to development, to catch issues across usability, business viability, technical feasibility, and design quality. Worth running on substantial products to ensure design integrity before the build.

### Design-step completion: meta-document

After the design steps (and any chosen depth) complete, invoke `meta-document` once to:
- Document the design and validation deliverables
- Record design decisions and validation findings
- Update the project state
- Prepare a summary for the user approval checkpoint

---

## User Approval Checkpoint

This is the boundary between the design steps and development. Even in Autopilot, the orchestrator must pause here.

### What to present:
1. Summary of all completed steps and their key deliverables
2. List of any opt-in depth skills the user skipped
3. Key decisions made throughout the pipeline
4. Known risks or gaps identified during the process
5. Recommendation for whether to proceed to development or revisit any step

### What to ask:
<ask-user>
The design steps are complete. Before we proceed to development:

1. **Proceed to development** – Everything looks good, start building
2. **Review specific deliverables** – I want to revisit some outputs before moving on
3. **Add depth first** – I want to run some opt-in depth skills I skipped earlier
4. **Stop here** – I will handle development separately
</ask-user>

---

## Compaction breakpoint

After the User Approval Checkpoint and before development begins, suggest compaction. The design deliverables are saved, and development needs a fresh context for implementation work.

Read `skills/shared-references/compact-template.md` and generate a ready-to-use compact message. Include it in the same response. This is a suggestion, not a requirement.

---

## Development

Sets up the development environment, creates implementation guides, and manages the development workflow. This stage transitions from design thinking to code.

### Build Target Detection

Before running any development setup skills, read the MVP requirements and Information Architecture documents to identify distinct build targets (e.g., macOS app + web landing page, Chrome extension + backend API, mobile app + web dashboard).

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

Each build target gets its own development loop: separate CLAUDE.md, separate git repo/folder, separate design system, separate development loop. After the first target is complete, ask if the user wants to proceed to the next target.

### dev-claude-md

- **Depends on**: the design deliverables
- **Produces**: CLAUDE.md file – global rules for AI-assisted development
- **Hands off to**: dev-starter-prompts
- **Notes**: Creates the rules file that governs AI behavior during development. Covers tech stack specifications, non-negotiable requirements, development pipeline, conflict resolution, and project status tracking.

### dev-starter-prompts

- **Depends on**: dev-claude-md, the design deliverables
- **Produces**: Kick-start prompts – 3-5 focused prompts for beginning development
- **Hands off to**: dev-agent-setup
- **Notes**: Generates high-level starting prompts that reference context documents. These are not deep technical prompts – they are references that point to the existing deliverables. Simple and focused.

### dev-agent-setup

- **Depends on**: dev-claude-md, dev-starter-prompts
- **Produces**: Agent pipeline configuration – specialized AI agents for the development workflow
- **Hands off to**: dev-mcp-setup
- **Notes**: Sets up the specialized agents that run during development (backend, frontend, design system auditing, compound documentation).

### dev-mcp-setup

- **Depends on**: dev-agent-setup
- **Produces**: MCP configuration – configured Model Context Protocol servers for the project
- **Hands off to**: dev-github-workflow
- **Notes**: Configures relevant MCP servers based on the project's needs and the user's environment. Uses the environment detection from meta-setup.

### dev-github-workflow

- **Depends on**: dev-mcp-setup
- **Produces**: GitHub workflow configuration – repository setup, branching strategy, CI/CD basics
- **Hands off to**: ui-design-system
- **Notes**: Sets up version control and collaboration workflow. Covers commits, branches, pull requests, and basic automation.

### ui-design-system

- **Depends on**: the design deliverables, dev-claude-md
- **Produces**: Design system implementation – code-level design tokens, component architecture, semantic naming
- **Hands off to**: Development loop
- **Notes**: Translates the design direction into code. Establishes the atomic architecture pattern: tokens, semantics, components.

### Development Loop

After initial setup, development enters an iterative loop for each feature:

1. **Plan Mode** – enter Plan Mode, write a structured plan, get approval, save to `.design-engineer-plugin/plans/`
2. **backend-implementer** (agent) – server-side code, when the work would otherwise flood the main context; iterate inline otherwise
3. **`/simplify`** – review of backend changes for reuse, quality, and efficiency
4. **frontend-implementer** (agent) – client-side code and UI, when the work would otherwise flood the main context; iterate inline otherwise
5. **`/simplify`** – review of frontend changes for reuse, quality, and efficiency
6. **design-system-auditor** (agent) – verifies new code follows the design system
7. **meta-document** – documents progress at the end of development

**BLOCKING: Per-phase approval is mandatory.** Never implement multiple phases in a single turn. Each phase: implement → present with QA instructions from the plan → WAIT for explicit user approval → only then proceed to next phase. If a phase has no manual QA possible, state "No manual QA needed for this phase" instead of skipping the approval step.

### dev-status-tracking (ongoing)

- **Depends on**: All development skills
- **Produces**: Updated context files – maintains project status, development context, and session continuity
- **Notes**: Keeps the status file updated after every big development phase. Addresses the context degradation problem where AI forgets about components already built, decisions already made, and approaches that did not work. Uses a dedicated status file (separation of concerns) rather than putting everything in CLAUDE.md.

### Development completion: meta-document

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
   - Add new features via `/design-engineer:discovery` (existing project flow)
   - Run design reviews or psychology audits via `/design-engineer:review`
   - Build additional build targets (if any remain)
   - Run specific psychology skills on real screens
   - Refine Figma designs and sync code
   - Set up user testing
4. **Make the user feel good** – like a mentor wrapping up, not a checkbox completion screen

Use AskUserQuestion for next steps (never plain text).

---

## Parallel Groups

Skills in the same parallel group have no dependency on each other's output and can execute simultaneously. The groups identified in the pipeline overview are:

- **[parallel-group: a]** – `dev-starter-prompts` and `dev-agent-setup` both depend on `dev-claude-md`, not on each other.
- **[parallel-group: b]** – `dev-mcp-setup` and `dev-github-workflow` are independent setup tasks.

### How to Execute Parallel Groups

**Autopilot**: Spawn Agent subprocesses for each skill in the group simultaneously. Wait for all to complete before proceeding to the next skill in the sequence.

**Guided mode**: Inform the user: "These [N] skills can run independently. Would you like to run them in parallel (faster) or one at a time (more interactive)?" Respect the user's preference.
