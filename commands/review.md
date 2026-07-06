---
description: Context-aware design review. Plans what to review based on your project, then executes step by step with your input at each finding. Argument `audit` runs a multi-page commercial audit with designer-feedback capture per page.
argument-hint: "[specific area to review | audit]"
---

# Design Review

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters). This applies to every option set described in this command body.

## Context

<context> #$ARGUMENTS </context>

## Note: existing-codebase component gallery (auto-scaffold)

If the project has UI components but no gallery yet, `design-system-auditor` will auto-scaffold one transparently during this review (no menu, no permission ask). The gallery is a single-page visual catalog of every component, all variants, real production styles, source-path labels – useful here for redundancy detection on existing codebases.

## Argument routing

If `$ARGUMENTS` is `audit`, jump to **Step A1: Page-by-page commercial audit** below. Otherwise proceed to Step 1.

## Step 1: Read project context

Before asking anything or starting work:

1. Read `.design-engineer-plugin/config.yaml` for goal
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
      - label: "UX and usability"
        description: "Interaction flows, navigation, state handling, error states"
      - label: "Visual quality"
        description: "Spacing, typography, color, alignment, polish"
      - label: "Accessibility"
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

Mark recommended options by appending "(Recommended)" to their labels, derived from the Step 1 project scan – e.g. recommend Accessibility when no a11y tooling is detected, Design system compliance when the project has tokens or a component library, Visual quality when a prototype or Figma reference exists to compare against. Both questions MUST be in a SINGLE AskUserQuestion call.

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

When "Whole app" is selected together with multiple review areas, Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-full-review/SKILL.md` and follow its instructions inline as the assessment backbone for Step 4, layering the selected areas onto its structure (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`).

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
| Psychology scan | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-full-scan/references/master-scan-criteria.md` |
| Ethics review | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-ethics-review/references/` |

This reference material is what makes the plugin's review better than a generic AI review. Do not skip reading it.

## Step 4: Execute the review

Agents CAN run for analysis. But after an agent completes, parse its output and present findings one at a time with AskUserQuestion interaction.

**Capture the rendered UI before analyzing code.** When Playwright is available and the app runs locally (start the dev server if needed), navigate to the in-scope pages and save a screenshot of each: `mkdir -p .design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/` first, then capture with an explicit `filename` of `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/review-<page-slug>.png` (the plugin's Playwright hygiene hook denies unprefixed or absolute paths). Ground visual-quality, accessibility, and UX findings in the rendered UI plus the code – spacing, contrast, and keyboard behavior are exactly what code reading alone misses. If Playwright is unavailable or the app cannot run, proceed code-only and tell the user in one sentence that the findings are code-derived.

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

## Step 4.5: Optional advisor consult

Before presenting the final findings, an advisor consult is available when the review is broad and the prioritization is genuinely uncertain (many findings across several areas, a rare critical one at risk of being lost in noise). It is optional, not a required checkpoint. When it would help, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: review areas covered, top findings by severity, anything that surprised you, and "any course correction before I present these?" Apply the advice or use the reconcile pattern. Skip it on focused reviews.

## Step 5: Fix execution (after review)

Collect every finding for which the user picked a recommendation (rec 1, rec 2, rec 3, or a custom "Other" approach). Skipped findings drop out.

If there are fixes to make:
1. Present the list of selected fixes – each line names the finding AND the chosen recommendation, so the user can confirm at a glance
2. Read the plan template at `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/references/plan-template.md`
3. Use `EnterPlanMode` to create ONE structured plan covering all fixes. The plan MUST implement the recommendation the user picked for each finding – never silently substitute the agent's recommended pick when the user chose an alternative or a custom "Other" approach
4. `ExitPlanMode` for user approval
5. IMMEDIATELY copy approved plan to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[name].md` (create the directory if it doesn't exist)
6. Execute the fixes with this loop (spelled out here because the plugin's dev conventions are not loaded in user sessions):
   - If the project is a git repo and the current branch is `main` or `master`, create a feature branch first (e.g. `fix/design-review-[YYYY-MM-DD]`)
   - Implement one phase at a time – never batch multiple phases into a single turn
   - For UI fixes, verify in the browser via Playwright: `mkdir -p` the directory, then save screenshots to `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/<descriptive-name>.png`
   - Present each phase with its QA instructions and WAIT for the user's approval before continuing
   - After approval, commit and push that phase by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-github-workflow/SKILL.md` and following its Mode 1 instructions inline (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`)
   - After all fixes: if any fix was Large-tier (new component or new file), dispatch the `design-system-auditor` agent scoped to the changed paths before item 7. Include a `PLUGIN_ROOT: <absolute path>` line (the resolved DESIGN_ENGINEER_PLUGIN_ROOT from your context) in the Task prompt so the agent can Read the plugin's reference files
7. After all fixes: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`) to record what changed and why

## Post-review

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

This branch is for designers hired to improve an existing commercial app. It walks every page (or a user-named subset), runs the four review passes per page, captures the designer's professional feedback per page alongside the AI findings, and synthesizes a redesign brief at the end.

### A1.1: Verify project context

1. Read `.design-engineer-plugin/config.yaml` and treat the product as shipped when ANY of these signals holds:
   - `project.context.shipped_ui: true`
   - `project_type: new` AND a top-level `status: complete` line – the completion marker development.md writes when the from-scratch pipeline finishes (the same `returning_complete` signal launch.md Step 0 and hooks/de-start-state.sh use)
   - both fields are absent, but a quick filesystem check finds 1+ `.tsx`/`.jsx`/`.vue`/`.svelte` files in `src/components/`, `app/components/`, top-level `components/`, or an equivalent component directory (the same fallback development.md Step 1.6 uses)

   Only when all three signals indicate greenfield: tell the user audit needs a shipped product to walk; offer to fall back to single-page review or route to the design pipeline. Do not proceed.
2. Confirm Playwright is available (bundled MCP since v4.3.0 – should be).

### A1.2: Scope the audit

Ask via ONE AskUserQuestion call (multiple questions in the array):

- question: "How should I find the pages to audit?" header: "Page source" options: `[{label: "I'll list URLs / paths", description: "I name each page or URL"}, {label: "Crawl from an entry URL", description: "Start at one URL and discover the rest"}, {label: "Use a sitemap.xml", description: "Read sitemap.xml from the deployed site"}]`
- question: "Cap on pages?" header: "Page cap" options: `[{label: "Up to 5", description: "Quick audit"}, {label: "Up to 15", description: "Medium audit"}, {label: "Up to 30", description: "Deep audit (may take a while)"}, {label: "No cap", description: "Audit everything (long-running)"}]`

If the user picks "I'll list URLs / paths", collect them via a follow-up. If they pick crawl, ask for the entry URL. If sitemap, ask for the sitemap URL or detect locally.

### A1.3: Per-page loop

The per-page audit work – capturing each page and running the four review passes on it – is independent across pages and can be a workflow candidate. Before starting, decide how to run the per-page passes:

**Per-page audit – workflow candidate.** When the page set is large (the user picked a higher cap, e.g. up to 15 / 30 / no cap), offer to fan it out: "I can audit these pages as a workflow – one agent per page, run in parallel, with results synthesized into one bundle – or audit them inline one at a time. Use a workflow to run the per-page audits?"

- **Availability gate**: workflows require Claude Code v2.1.154+ on a paid plan. If workflows are unavailable or the user declines, fall back to the inline single-pass loop below – nothing breaks.
- **If the user opts in and workflows are available**: dispatch one agent per page (capped per the user's cap), each performing the Capture + review-pass steps (1–2 below) for its page and returning its findings bundle. Each page agent performs all four review passes ITSELF, as analysis lenses – it must NOT dispatch subagents (subagents cannot spawn subagents) and must NOT use the `Skill` tool. Before dispatching, resolve `${DESIGN_ENGINEER_PLUGIN_ROOT}` from your context and embed the four absolute reference paths directly in every page-agent prompt – `<root>/agents/psych-scanner.md`, `<root>/agents/design-system-auditor.md`, `<root>/skills/ui-aesthetic-review/SKILL.md`, `<root>/skills/ux-motivation-audit/SKILL.md` – so the agent can Read them as its lens material; subagents do not receive the plugin-root context line. When the workflow returns, synthesize the per-page bundles. **The designer-feedback capture (step 4 below) does NOT run inside the workflow** – workflows take no mid-run input – so it happens AFTER the workflow run, page by page, in the main conversation (see "After the AI passes" below).
- **Inline fallback (always available, single pass)**: run steps 1–5 below as a loop, one page at a time, in the main conversation.

If a dispatched agent returns a `BLOCKED – needs user input` section, relay its question to the user via AskUserQuestion (after the run, for workflow dispatches – workflows take no mid-run input), then re-dispatch that agent with the answer and the agent's progress summary included in the prompt.

For each page (capped per the user's cap), the AI passes are:

1. **Capture**: navigate via Playwright → take a screenshot → snapshot the DOM/structure. Save the screenshot to `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/[page-slug]/screenshot.png`.
2. **Run the four review passes** in this order, gathering findings into one in-memory bundle per page. On the inline path, two passes are agent dispatches and two are skills read inline:
   - `psych-scanner` (cognitive load, decision fatigue, dark patterns, motivation) – dispatch the agent defined at `agents/psych-scanner.md`
   - `ui-aesthetic-review` (4-lens critique, AI Slop Test, anti-patterns) – Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`.
   - `design-system-auditor` (token usage, hardcoded styles, monolithic views, gallery audit if applicable) – dispatch the agent defined at `agents/design-system-auditor.md`
   - `ux-motivation-audit` (screen-level psychology) – Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-motivation-audit/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`.

   Any Task prompt that dispatches a plugin agent here – `design-system-auditor` in particular – MUST include a line `PLUGIN_ROOT: <absolute path>` carrying the resolved DESIGN_ENGINEER_PLUGIN_ROOT from your context, so the agent can Read the plugin's reference files (agents do not inherit this conversation).

**After the AI passes** (inline per page, or page by page once the workflow returns – the designer-feedback capture is always a main-conversation step because workflows take no mid-run input):

3. **Present AI findings** to the designer for THIS page (compact: top 5–7 findings grouped by severity).
4. **Capture designer feedback** via AskUserQuestion: question="Your professional feedback on this page?" options: `[{label: "I'll write notes", description: "Open-ended notes I'll type now"}, {label: "Agrees with AI on all points", description: "AI findings match my read"}, {label: "Disagree with one or more findings", description: "I'll explain which and why"}, {label: "Skip / no feedback", description: "Move on"}]`. If "I'll write notes" or "Disagree", collect the prose via natural-language follow-up.
5. **Write the per-page deliverable** to `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/[page-slug]/audit.md`:

```markdown
# [Page name] – Audit

**URL**: [captured URL]
**Date**: [YYYY-MM-DD]
**Screenshot**: ./screenshot.png

## AI findings

### Psychology
[findings]

### Visual / aesthetic
[findings]

### Design system compliance
[findings]

### Motivation / UX
[findings]

## Designer's feedback

[user's professional notes per the AskUserQuestion / freeform]

## Combined recommendation

[synthesis: which AI findings to act on, which to defer per designer's input, what the designer flagged that AI missed]
```

6. **Optional – generate a per-page design spec from the audit findings.** When a page's combined recommendation points to a redesign worth building (net-new components, a reworked primary surface), you can turn the audit findings into a grounded per-screen design spec the implementer can build to. Offer it per page: "Want a design spec for this page's redesign, built from these findings?" On yes, Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/design-spec/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`), feeding the page's combined recommendation, screenshot, and the project's real tokens/components as input. Store the spec at `.design-engineer-plugin/design/specs/<page-slug>.spec.md`. Skip for pages with only minor or token-level fixes – graduated strictness, no blanket mandate.

### A1.4: Synthesize the redesign brief

After all pages: write `.design-engineer-plugin/design/reviews/[YYYY-MM-DD]-audit/SUMMARY.md`:

- Cross-page patterns (e.g., "same hardcoded color used on 8 of 14 pages")
- Top redesign priorities ranked by combined AI + designer signal
- Per-page links back to the individual audit files
- Recommended next step (implement the brief via `/design-engineer:development`, or write minimal specs for selected pages via `/design-engineer:discovery feature-spec` – SUMMARY.md is read in later sessions, so plain command names are correct here)

### A1.5: Hand off

Ask via AskUserQuestion: question="What's next?" options: `[{label: "Implement priority fixes", description: "Hand off to development with the brief"}, {label: "Spec specific feature redesigns", description: "Write a minimal feature spec for selected pages"}, {label: "Document and stop", description: "Brief is saved; pick up later"}]`.

On "Implement priority fixes": announce the hand-off in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/development.md` and follow its instructions inline, carrying forward the brief (the SUMMARY.md path and its top redesign priorities) as the feature plan.

On "Spec specific feature redesigns": ask which pages, announce the hand-off in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/discovery.md` and follow its Step F1 (`feature-spec`) branch inline for each selected page – `$ARGUMENTS` is not substituted on an inline Read, so jump to Step F1 directly, feeding that page's audit findings as the feature description.

On "Document and stop": confirm the brief's saved path and end the session; the user can pick up later with `/design-engineer:launch`.
