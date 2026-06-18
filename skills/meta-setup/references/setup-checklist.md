# Setup Checklist – Full Configuration Reference

This file documents every configuration option collected by the `meta-setup` skill, what each option means, and how it affects the plugin's behavior throughout the entire workflow.

---

## 1. Project State

Determines where the user is in the product-building journey and controls skip logic across the pipeline.

| Option | What it means | Effect on pipeline |
|--------|--------------|-------------------|
| **Starting from scratch** | New idea with no prior work | Full pipeline from Phase 1. All skills are suggested sequentially. |
| **Partially done (pre-development)** | Some design deliverables exist | Orchestrator scans for existing deliverables in the deliverables folder and asks which to skip. Skills for completed deliverables are offered as optional updates rather than mandatory steps. |
| **Partially done (in development)** | Development has already started | Skips to Phase 5 skills by default. Offers to backfill missing design deliverables. Prioritizes context management and compound documentation. |
| **Existing product** | Live or near-complete product | Focuses on `/review` and `/psych` workflows. Offers audit-mode skills (bias audit, journey mapping, accessibility, ethics review). |

**Detection behavior**: When the user selects any state other than "Starting from scratch," the orchestrator proactively checks the deliverables folder for existing files and presents what it found. The user confirms which deliverables are complete, which need updating, and which should be created from scratch.

---

## 2. Team Size

Affects context management strategy and compound documentation depth.

| Option | Effect |
|--------|--------|
| **Solo** | Simpler status tracking. Compound docs focus on personal learnings and project context survival across sessions. |
| **Small team (2-5)** | Structured compound documentation with handoff sections. Status tracking includes team member assignments. Context files designed to survive team member switches. |
| **Larger team (5+)** | Full compound documentation with role-based sections. Enhanced context engineering for long-term projects spanning months or years. Meeting preparation templates enabled. |

---

## 3. Design Tool Integration

Determines how design-related skills interact with the user's design workflow.

| Option | Effect |
|--------|--------|
| **Figma with plugin** | Skills that reference designs (ui-figma-guide, ui-design-to-code-qa, ui-design-system) use Figma plugin to read design data directly. Provides adapted code based on the project's tech stack. |
| **Figma without plugin** | Skills prompt the user to share screenshots or exported design specs manually. Instructions for manual sharing are provided at each step. |
| **Other design tool** | Skills provide tool-agnostic design guidance. User provides design references through their preferred method. |
| **No design tool yet** | Design tool steps are deferred. Skills focus on conceptual and structural deliverables until the user decides on a tool. |

**Gradual Figma plugin usage**: When the Figma plugin is available, skills use it for smaller elements at a time rather than sharing entire complex designs at once. The approach is to start with working prototypes that look rough, then apply design polish through the Figma plugin – functionality first, aesthetics second.

---

## 4. Deliverables Path

Where all skill outputs are saved. Default: `design/` in the project root.

### Folder Structure

```
design/
├── foundation/     Core product definition
│   ├── problem-statement.md
│   ├── target-audience.md
│   ├── assumptions.md
│   ├── storybrand.md
│   └── business-plan.md
├── research/       Research and competitive analysis
│   ├── competitor-analysis.md
│   ├── user-interviews.md
│   └── market-research.md
├── design/         Design deliverables
│   ├── mvp-requirements.md
│   ├── information-architecture.md
│   ├── design-references.md
│   ├── figma-workflow.md
│   ├── journey-map.md
│   ├── bias-audit.md
│   ├── ethics-review.md
│   └── product-assessment.md
├── psych/          Psychology audit results
│   ├── master-audit.md
│   ├── section-1-cognitive-basics.md
│   ├── section-2-visual-perception.md
│   ├── section-3a-decision-core.md
│   ├── section-3b-decision-advanced.md
│   ├── section-4-engagement.md
│   ├── section-5a-emotional-core.md
│   ├── section-5b-emotional-advanced.md
│   ├── section-6-efficiency.md
│   ├── section-7a-behavioral-core.md
│   ├── section-7b-behavioral-habits.md
│   ├── section-8-social-influence.md
│   ├── section-9-cognitive-biases.md
│   └── section-10-time-behavior.md
├── prototype/      HTML prototypes (storyboard, prototype, landing page)
├── reviews/        Design reviews and assessments
└── dev/            Development preparation
    ├── claude-md-draft.md
    ├── kickstart-prompts.md
    ├── agent-pipeline.md
    ├── mcp-notes.md
    ├── github-workflow.md
    ├── project-status.md
    ├── solved-problems.md
    └── learnings.md
```

The dependency graph lives at `.design-engineer-plugin/dependencies.yaml` (separate from the user-facing deliverables in `design/`).

### Living Documents

All deliverables are living documents. They are never created once and forgotten. As the project evolves, deliverables get updated regularly. The dependency tracking system (`.dependencies.yaml`) ensures that when one document changes, the plugin suggests reviewing dependent documents.

---

## 5. Development Environment

Affects how development skills generate instructions and kickstart prompts.

| Option | Effect |
|--------|--------|
| **Claude Code in terminal** | Development skills optimize for terminal-based workflows. Agent pipeline uses Claude Code's native sub-agent capabilities. |
| **Claude Code inside Cursor** | Combines Claude Code's power with Cursor's visual IDE features. Instructions reference both environments. |
| **Cursor only** | Development skills generate Cursor-optimized instructions. Notes about Claude Code capabilities are informational only. |
| **Other / not sure yet** | Development skills provide IDE-agnostic instructions with recommendations. |

---

## 6. Experience Level

Controls the depth of inline teaching across all skills.

| Option | Effect |
|--------|--------|
| **New to AI development** | Extra educational context woven into every skill. Explanations of why each step matters. More detailed instructions with examples. Warnings about common pitfalls (trusting AI blindly, not verifying sources, running unfamiliar terminal commands). |
| **Some experience** | Moderate teaching depth. Key concepts explained, but basic AI tool usage is assumed known. |
| **Experienced** | Streamlined output. Teaching is minimal – focuses on the specific methodology and frameworks rather than general AI development concepts. |

---

## Tool Inventory

The following tools are detected during setup and affect skill behavior:

| Tool | When detected | When missing |
|------|--------------|-------------|
| **AskUserQuestion** | Interactive questions use the native UI | Falls back to numbered-list text format |
| **WebSearch** | Research skills use web search for competitor analysis, market validation | User must provide research context manually |
| **WebFetch** | Skills can fetch live URLs for analysis | User shares content through copy-paste |
| **Agent tool** | Complex skills can delegate parallel subtasks to sub-agents | Skills run sequentially within a single context |
| **Context7 plugin** | Technical documentation is fetched in real-time during development skills | AI relies on training data (may be outdated) |
| **Figma plugin** | Design data is read directly from Figma, and AI can create components, apply tokens, and structure files via `use_figma` | User shares screenshots or design specs manually |
| **Playwright plugin** | Browser-based testing and live URL review available | Testing is done manually; visual review uses screenshots |
