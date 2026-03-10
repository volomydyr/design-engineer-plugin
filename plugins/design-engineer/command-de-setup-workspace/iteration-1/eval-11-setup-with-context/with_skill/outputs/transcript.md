# Design-Engineer Plugin Setup -- Transcript

**Command:** `/de:setup -- I'm setting up for an existing React Native app that already has some design docs in a folder called 'product-design'. We're a team of 3.`
**Date:** 2026-03-10
**Context:** User provided inline context about an existing React Native project with design docs and a team of 3.

---

## Step 1: Load Meta-Setup Skill

Recognized `/de:setup` as the setup command. Loaded the meta-setup skill from `skills/meta-setup/SKILL.md`.

**Result:** Skill loaded successfully. User provided inline context that will be used to pre-fill configuration answers.

### Context Parsed from Arguments

- **Platform/framework:** React Native
- **Project state:** Existing app (in development or live)
- **Existing docs:** Yes, in `product-design/` folder
- **Team size:** 3 (small team)

---

## Step 2: Check Existing Configuration

Checked for `.design-engineer.yaml` in the project root.

**Result:** No existing configuration file found. Proceeding with fresh setup.

---

## Step 3: Detect Environment

Ran environment detection (from `scripts/detect-environment.sh` logic and available tool inventory).

### Detection Results

```
Environment Detection Results
------------------------------
MCPs found:     Context7, Figma MCP (desktop + dev mode), Figma Console, Playwright MCP
MCPs missing:   (none)
Tools:          WebSearch, WebFetch
Tools missing:  AskUserQuestion, Agent
Project:        Not a git repo, existing docs found at product-design/, no CLAUDE.md
Tech stack:     React Native detected from user context
Existing docs:  product-design/ folder referenced by user
```

---

## Step 4: Configuration Questions

Since the user provided context, several questions can be pre-filled with smart defaults. Remaining questions are presented as numbered lists.

### Question 1: Project State (Pre-filled)

Based on user context: "existing React Native app that already has some design docs"

**Pre-filled answer:** 3 (Partially done -- in development)

> Detected: You mentioned an existing React Native app with design docs. I've set your project state to "Partially done (in development)." If this is already a live product, let me know and I'll adjust to "Existing product."

User confirmed the pre-filled answer.

### Question 2: Mode Preference

```
Interaction Mode
How do you prefer to work with AI?

1. Guided mode (Recommended for teams)
   Step-by-step with questions, suggestions from multiple perspectives, and approval at every stage
2. God mode
   Fully autonomous -- provide context and let AI run the entire pipeline end-to-end
3. Both / decide later
   Choose the mode each time you run a command
```

**Simulated answer:** 1 (Guided mode)

**Rationale:** Recommended for teams where multiple people share context and need approval at each stage.

### Question 3: Team Size (Pre-filled)

Based on user context: "We're a team of 3."

**Pre-filled answer:** 2 (Small team, 2-5)

> Detected: Team of 3. Setting team size to "Small team (2-5)."

User confirmed.

### Question 4: Design Tool Integration

```
Design Integration
How do you work with design tools?

1. Figma with MCP
   Use Figma MCP to share design data directly with AI
2. Figma without MCP
   Manually share screenshots or export design specs
3. Other design tool
   Sketch, Adobe XD, or another tool
4. No design tool yet
   Will decide later or skip design tooling
```

**Simulated answer:** 1 (Figma with MCP)

**Rationale:** Environment detection confirmed Figma MCPs are installed.

### Question 5: Deliverables Path (Pre-filled with adaptation)

Based on user context: "design docs in a folder called 'product-design'"

```
Deliverables Location
Where should design deliverables be saved?

Detected: You already have docs in product-design/. I can use that as the base path.

1. product-design/ (Use existing folder)
   Keep your current folder and add organized subdirectories inside it
2. docs/design/ (Plugin default)
   Standard path with organized subdirectories -- existing docs stay where they are
3. Custom path
   Specify a different directory path
```

**Simulated answer:** 1 (product-design/)

> Using `product-design/` as the deliverables root. Subdirectories (foundation, research, design, psych, dev, solutions) will be created inside it. Existing files in product-design/ will not be moved or modified.

### Question 6: Anything else to configure?

```
Additional Configuration
Is there anything else you'd like to configure?

1. No, finish setup
   Proceed with the current configuration
2. Set tech stack details
   Specify additional framework/library details
3. Configure CI/CD integration
   Set up hooks for your deployment pipeline
```

**Simulated answer:** 1 (No, finish setup)

---

## Step 5: Scaffold Project Structure

Created the standardized folder structure at `product-design/`:

```
product-design/
├── [existing files preserved]
├── foundation/          # Core product definition deliverables
│   └── .gitkeep
├── research/            # Research findings and competitive analysis
│   └── .gitkeep
├── design/              # Design-specific deliverables (IA, flows, references)
│   └── .gitkeep
├── psych/               # Psychology audit results and principle applications
│   └── .gitkeep
├── dev/                 # Development preparation deliverables
│   └── .gitkeep
├── solutions/           # Compound documentation (solved problems, learnings, status)
│   └── .gitkeep
└── .dependencies.yaml   # Dependency graph tracking all deliverables
```

Note: Existing files in `product-design/` were left untouched. Only new subdirectories were added.

---

## Step 6: Write Configuration File

Generated `.design-engineer.yaml` in the project root with all collected answers, detected environment, and context from user arguments.

Key config values reflecting user context:
- `tech_stack: react-native`
- `team_size: small`
- `team_count: 3`
- `deliverables_path: product-design/`
- `project_state: in-development`

---

## Step 7: Initialize Dependency Tracking

Copied the default dependency graph from `assets/dependencies-default.yaml` into `product-design/.dependencies.yaml`. Adjusted paths to use `product-design/` as the root instead of the default `docs/design/`.

---

## Step 8: Confirm Setup

```
Setup Complete
--------------
Project state:    Partially done (in development)
Mode:             Guided mode
Team:             Small team (3 people)
Design tool:      Figma with MCP
Deliverables:     product-design/
Tech stack:       React Native
MCPs detected:    Context7, Figma MCP, Figma Console, Playwright MCP
Config saved:     .design-engineer.yaml
Dependencies:     product-design/.dependencies.yaml

Next steps:
- Run /de:review to review your existing design docs and identify gaps
- Run /de:design to continue the design pipeline from where you left off
- Run /de:psych to audit existing designs with psychology principles
- Run /de:compound to document solved problems and learnings

Tip: Since you have existing docs in product-design/, /de:review is the
     recommended starting point -- it will analyze what you have and
     suggest what to work on next.
```

---

## Files Created

| File | Purpose |
|------|---------|
| `.design-engineer.yaml` | Plugin configuration reflecting React Native, team of 3, product-design path |
| `product-design/foundation/.gitkeep` | Placeholder for foundation deliverables |
| `product-design/research/.gitkeep` | Placeholder for research deliverables |
| `product-design/design/.gitkeep` | Placeholder for design deliverables |
| `product-design/psych/.gitkeep` | Placeholder for psychology audit deliverables |
| `product-design/dev/.gitkeep` | Placeholder for development preparation deliverables |
| `product-design/solutions/.gitkeep` | Placeholder for compound documentation |
| `product-design/.dependencies.yaml` | Dependency graph with paths adjusted to product-design/ root |
