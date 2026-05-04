---
name: product:review
description: Context-aware design review. Plans what to review based on your project, executes step by step in Guided mode or as a summary in Autopilot. Argument `audit` runs a multi-page commercial audit with designer-feedback capture per page.
argument-hint: "[specific area to review | audit]"
---

# Design Review

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters). This applies to every option set described in this command body.

## Context

<context> #$ARGUMENTS </context>

## Note: existing-codebase component gallery (auto-scaffold)

If the project has UI components but no gallery yet, `design-system-auditor` will auto-scaffold one transparently during this review (v4.6.0 transparent infrastructure – no menu, no permission ask). The gallery is a single-page visual catalog of every component, all variants, real production styles, source-path labels – useful here for redundancy detection on existing codebases.

## Argument routing

If `$ARGUMENTS` is `audit`, jump to **Step A1: Page-by-page commercial audit** below. Otherwise proceed to Step 1.

## Step 1: Read project context

Before asking anything or starting work:

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot) and goal
2. Check what tools are available (is Figma connected? is Playwright available?)
3. Scan the project briefly: what tech stack, what files exist, are there components, is there a design system?

## Step 2: Plan the review

Based on what you found, present ALL available review areas as text:

```
Here's what I can review for your project:

**Core areas:**
- UX and usability – interaction flows, navigation, state handling, error states
- Visual quality – spacing, typography, color, alignment, polish
- Accessibility – WCAG compliance, keyboard navigation, screen readers
- Design system compliance – token usage, component reuse, naming patterns

**Additional areas:**
- Figma comparison – compare implementation against Figma designs side by side
- Psychology scan – cognitive load, decision fatigue, trust signals, behavioral patterns
- Ethics review – dark patterns, informed consent, data transparency
```

Then make ONE AskUserQuestion call with BOTH questions in the `questions` array (they appear on the same screen):

```
questions:
  - question: "Which core areas would you like me to review?"
    header: "Core review"
    multiSelect: true
    options:
      - label: "UX and usability (Recommended)"
        description: "Interaction flows, navigation, state handling, error states"
      - label: "Visual quality (Recommended)"
        description: "Spacing, typography, color, alignment, polish"
      - label: "Accessibility (Recommended)"
        description: "WCAG compliance, keyboard navigation, screen readers"
      - label: "Design system compliance"
        description: "Token usage, component reuse, naming patterns"
  - question: "Would you like any additional review areas?"
    header: "Additional"
    multiSelect: true
    options:
      - label: "Figma comparison"
        description: "Compare implementation against your Figma designs"
      - label: "Psychology scan"
        description: "Cognitive load, decision fatigue, trust signals"
      - label: "Ethics review"
        description: "Dark patterns, informed consent, data transparency"
```

Mark recommended ones with "(Recommended)" based on project scan. Both questions MUST be in a SINGLE AskUserQuestion call.

After user selects areas, ask a scoping question:

```
question: "What should I focus on?"
header: "Scope"
options:
  - label: "Whole app"
    description: "Review all pages and flows"
  - label: "Specific page or flow"
    description: "I will tell you which one to focus on"
  - label: "Recent changes only"
    description: "Review only what has been changed or added recently"
```

If "Specific page or flow": ask which one.

## Step 3: Read reference material

Before starting the review, Read the relevant reference files from the plugin's knowledge base. Look for `DESIGN_ENGINEER_PLUGIN_ROOT` in your context – it contains the absolute path to the plugin directory. Use it to resolve file paths.

For each selected area, Read these reference files BEFORE analyzing code:

| Review area | Reference files to Read |
|-------------|----------------------|
| UX and usability | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Visual quality | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Accessibility | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-accessibility/references/` |
| Design system compliance | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/references/` |
| Figma comparison | If Figma plugin is connected, use `get_design_context` for structured design data; otherwise fall back to screenshots provided by the user |
| Psychology scan | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-full-scan/references/principles-master.md` |
| Ethics review | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-ethics-review/references/` |

This reference material is what makes the plugin's review better than a generic AI review. Do not skip reading it.

## Step 4: Execute the review

### Active-workflow marker (broad audits only)

If the planned review will run any of these broad multi-principle skills/agents – `psych-full-scan`, `ux-full-review`, `ux-bias-audit`, or `ux-ethics-review` – mark the active workflow at the start of execution so the process-recall hook can fire context-appropriately:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "review:full-audit" > .design-engineer-plugin/.active-workflow
```

Narrow single-skill reviews (e.g., just `ui-aesthetic-review`, just `ui-design-to-code-qa`, just `ui-accessibility`) do NOT write this marker – the recall injection would be noise on a focused review.

### Guided mode

Agents CAN run for analysis. But after an agent completes, parse its output and present findings one at a time with AskUserQuestion interaction. Never show the agent's raw output directly.

1. Read the relevant code yourself or run the appropriate agent
2. Announce: "I found N findings. Here's finding 1 of N..."
3. For each finding, present:
   - Principle name and severity
   - File:line reference
   - What's wrong and why it matters
   - Up to 3 recommendations (cap at 3 so the question fits 4 buttons – recommended one plus 2 alternatives is enough; if the agent has more ideas, fold them into the top 3 or save for "Other"). Each recommendation must include:
     - **What to do** (1 sentence)
     - **Why it helps** (1 sentence)
     - **Tradeoff** (1 sentence)
   - Give each recommendation a short title (3–5 words) so it can fit on a button label
   - Mark the best one as the recommended pick (it goes in the first slot)
4. After presenting the finding, ask ONE AskUserQuestion (multiSelect: false). The recommendations themselves are the primary action buttons – users can pick the recommended one or any alternative with a single click:
   ```
   question: "How would you like to address this finding?"
   header: "Action"
   options:
     - label: "<short title 1> (Recommended)"
       description: "<what to do – why it helps – tradeoff, in one line>"
     - label: "<short title 2>"
       description: "<what to do – why it helps – tradeoff, in one line>"
     - label: "<short title 3>"
       description: "<what to do – why it helps – tradeoff, in one line>"
     - label: "Skip or explain"
       description: "Not relevant, or teach me why this principle matters first"
   ```
   - The auto-added "Other" slot lets the user describe a custom approach in free text – do not list "Other" yourself
   - If the agent produced only 1 or 2 recommendations, list what exists and use the remaining slots for "Skip or explain" (always keep that slot)
5. **Branching on the answer:**
   - **Recommendation 1, 2, or 3**: record `(finding, chosen recommendation)` for the Step 5 batch fix plan, then continue to the next finding. Do NOT silently substitute the agent's recommended pick when the user chose an alternative
   - **Other (custom approach)**: record `(finding, custom approach text)` for the batch plan and continue
   - **Skip or explain**: ask a tiny follow-up AskUserQuestion (multiSelect: false):
     ```
     question: "What did you mean?"
     header: "Action"
     options:
       - label: "Skip this finding"
         description: "Not relevant, show next"
       - label: "Explain this principle"
         description: "Teach me why this matters, then re-ask the question"
     ```
     If "Skip", drop the finding and continue. If "Explain", give the explanation, then loop back to the original question for this same finding
6. After all findings: summary table grouped by severity, including which recommendation was chosen for each item that goes into the fix plan
7. Ask what to do next (see post-review below)

### Autopilot

1. Run agents for speed (psych-scanner, design-system-auditor, etc.)
2. Present complete results as a structured summary grouped by severity
3. Ask what to fix or explore further

## Step 4.5: Pre-presentation advisor checkpoint

Before presenting the final findings (Guided: before the summary table; Autopilot: before the structured summary), consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: review areas covered, top findings by severity, anything that surprised you in the analysis, and "I'm about to present these findings as the review output – any course correction?" Apply the advice or use the reconcile pattern. This catches mis-prioritization (rare critical finding lost in noise) and missed angles before the user sees the report. Skip on tiny single-area reviews where the finding count is one or two.

## Step 5: Fix execution (after review)

Collect every finding for which the user picked a recommendation (rec 1, rec 2, rec 3, or a custom "Other" approach). Skipped findings drop out.

If there are fixes to make:
1. Present the list of selected fixes – each line names the finding AND the chosen recommendation, so the user can confirm at a glance
2. Read the plan template at the plugin's `skills/meta-setup/references/plan-template.md`
3. Use `EnterPlanMode` to create ONE structured plan covering all fixes. The plan MUST implement the recommendation the user picked for each finding – never silently substitute the agent's recommended pick when the user chose an alternative or a custom "Other" approach
4. `ExitPlanMode` for user approval
5. IMMEDIATELY copy approved plan to `plans/[YYYY-MM-DD]-[name].md`
6. Execute per the plan workflow (CLAUDE.md): phase by phase, QA per phase
7. After all fixes: trigger `meta-document` to record what changed and why

## Post-review

If a `review:full-audit` marker was set at the start of Step 4 (broad audit branch), clear it now so the process-recall hook stops firing on subsequent casual chat:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

After the review (or after fixes), ALWAYS use AskUserQuestion with specific options. Never end with a plain text question.

If fixes haven't been done yet:
```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Fix the noted issues"
    description: "Create a plan and implement the fixes we discussed"
  - label: "Document what we reviewed"
    description: "Save the review findings for reference"
  - label: "Review another area"
    description: "Pick a different review area or scope"
```

If fixes were already implemented:
```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Document what we changed"
    description: "Record the fixes and their rationale"
  - label: "Review another area"
    description: "Pick a different review area or scope"
  - label: "Done for now"
    description: "End the session"
```

IMPORTANT: Every transition point in the review flow MUST use AskUserQuestion. Never end with "Is there anything else?" or any plain text question.

---

## Step A1: Page-by-page commercial audit (`audit` argument)

This branch is for designers hired to improve an existing commercial app. It walks every page (or a user-named subset), runs the standard review agents per page, captures the designer's professional feedback per page alongside the AI findings, and synthesizes a redesign brief at the end.

### A1.1: Verify project context

1. Read `.design-engineer-plugin/config.yaml` `project.context.shipped_ui`. If `false` (or the field is missing), tell the user audit needs a shipped product to walk; offer to fall back to single-page review or route to the design pipeline. Do not proceed.
2. Confirm Playwright is available (bundled MCP since v4.3.0 – should be).

### A1.2: Scope the audit

Ask via ONE AskUserQuestion call (multiple questions in the array):

- question: "How should I find the pages to audit?" header: "Page source" options: `[{label: "I'll list URLs / paths", description: "I name each page or URL"}, {label: "Crawl from an entry URL", description: "Start at one URL and discover the rest"}, {label: "Use a sitemap.xml", description: "Read sitemap.xml from the deployed site"}]`
- question: "Cap on pages?" header: "Page cap" options: `[{label: "Up to 5", description: "Quick audit"}, {label: "Up to 15", description: "Medium audit"}, {label: "Up to 30", description: "Deep audit (may take a while)"}, {label: "No cap", description: "Audit everything (long-running)"}]`

If the user picks "I'll list URLs / paths", collect them via a follow-up. If they pick crawl, ask for the entry URL. If sitemap, ask for the sitemap URL or detect locally.

### A1.3: Per-page loop

For each page (capped per the user's cap):

1. **Capture**: navigate via Playwright → take a screenshot → snapshot the DOM/structure. Save the screenshot to `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/[page-slug]/screenshot.png`.
2. **Run AI agents** in this order, gathering findings into one in-memory bundle per page:
   - `psych-scanner` (cognitive load, decision fatigue, dark patterns, motivation) – see `agents/psych-scanner.md`
   - `ui-aesthetic-review` (4-lens critique, AI Slop Test, anti-patterns) – see `skills/ui-aesthetic-review/`
   - `design-system-auditor` (token usage, hardcoded styles, monolithic views, gallery audit if applicable) – see `agents/design-system-auditor.md`
   - `ux-motivation-audit` (screen-level psychology) – see `skills/ux-motivation-audit/`
3. **Present AI findings** to the designer for THIS page (compact: top 5–7 findings grouped by severity).
4. **Capture designer feedback** via AskUserQuestion: question="Your professional feedback on this page?" options: `[{label: "I'll write notes", description: "Open-ended notes I'll type now"}, {label: "Agrees with AI on all points", description: "AI findings match my read"}, {label: "Disagree with one or more findings", description: "I'll explain which and why"}, {label: "Skip / no feedback", description: "Move on"}]`. If "I'll write notes" or "Disagree", collect the prose via natural-language follow-up.
5. **Write the per-page deliverable** to `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/[page-slug]/audit.md`:

```markdown
# [Page name] – Audit

**URL**: [captured URL]
**Date**: [YYYY-MM-DD]
**Screenshot**: ./screenshot.png

## AI findings

### Psychology (psych-scanner)
[findings]

### Visual / aesthetic (ui-aesthetic-review)
[findings]

### Design system compliance (design-system-auditor)
[findings]

### Motivation / UX (ux-motivation-audit)
[findings]

## Designer's feedback

[user's professional notes per the AskUserQuestion / freeform]

## Combined recommendation

[synthesis: which AI findings to act on, which to defer per designer's input, what the designer flagged that AI missed]
```

### A1.4: Synthesize the redesign brief

After all pages: write `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/SUMMARY.md`:

- Cross-page patterns (e.g., "same hardcoded color used on 8 of 14 pages")
- Top redesign priorities ranked by combined AI + designer signal
- Per-page links back to the individual audit files
- Recommended next step (route to `/product:dev` with this brief, or to `/product:design feature-spec` for specific feature redesigns)

### A1.5: Hand off

Ask via AskUserQuestion: question="What's next?" options: `[{label: "Implement priority fixes", description: "Route to /product:dev with the brief"}, {label: "Spec specific feature redesigns", description: "Route to /product:design feature-spec for selected pages"}, {label: "Document and stop", description: "Brief is saved; pick up later"}]`.
