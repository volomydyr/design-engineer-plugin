# v4.5.0 — Advisor agent + skill, wired into pipeline checkpoints (not passive)

## Context

Beta tester (the user, who is also the plugin author) wants the plugin to embody the **advisor strategy** described in [Anthropic's advisor tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) and the [advisor strategy blog post](https://claude.com/blog/the-advisor-strategy). The strategy: a faster executor model consults a higher-intelligence advisor model at strategic moments — early in the task (before substantive work), before declaring done, when stuck, when changing approach. The blog claims SWE-bench Multilingual +2.7pp and BrowseComp Haiku +21.5pp from this pairing.

**Critical constraint** the user must understand up-front: the literal `advisor_20260301` server tool is an **Anthropic API beta feature** (`anthropic-beta: advisor-tool-2026-03-01` on `/v1/messages`). Claude Code plugins do not control request shape — we ship skills/agents/commands that run *inside* Claude Code. So this plan does NOT enable the literal API tool. It ships the **strategy** as a plugin-native pattern: a dedicated Opus advisor agent that other skills consult at strategic moments, with the docs' suggested system prompt baked into the agent verbatim, and active integration into the existing /design-engineer pipeline so it actually fires.

User refinement on the option pick: "make sure it really works, not just lays in the plugin wait for the user to manually invoke it." → Phase 2 is the active integration: explicit advisor checkpoints in CLAUDE.md Plan Mode workflow, in /design-engineer command files (start/design/dev/review/document), and in dev-github-workflow Mode 1. Not optional, not user-invoked.

This is a feature addition — new agent + new skill + integration touchpoints — no breaking changes. **MINOR bump → v4.5.0**.

## Architectural decisions

- **Advisor agent system prompt = the docs' suggested coding-task block, near-verbatim.** Three blocks from the docs' "Suggested system prompt for coding tasks" section: timing block, treatment block, conciseness instruction ("under 100 words, enumerated steps, not explanations"). The docs report this combination produced "the highest intelligence at near-Sonnet cost" on internal coding evals — quoting and copying directly preserves that signal. We adapt only what the agent infrastructure requires (frontmatter, agent-name reference) and drop sentences that don't apply (the docs reference an `advisor()` function call which doesn't translate to a sub-agent shape).
- **Pin advisor agent at `model: claude-opus-4-7`, `effort: xhigh`.** The docs' compatibility matrix lists Opus 4.7 as the only allowed advisor model. xhigh is our top-tier effort per CLAUDE.md (replaces deprecated `max`). The docs note: "For coding tasks, pairing a Sonnet executor at medium effort with an Opus advisor achieves intelligence comparable to Sonnet at default effort, at lower cost."
- **No tools on the advisor agent.** The docs say: "The advisor itself runs without tools and without context management." Mirror that — set `tools: []` (or omit) so the agent returns text-only advice and can't sprawl.
- **Reuse meta-orchestrator? No — separate concerns.** meta-orchestrator runs the full pipeline; advisor is a focused consult. Different roles, different prompts. Keep them separate per single-responsibility principle.
- **Active integration is the deal-breaker.** Per user's explicit refinement, the advisor must fire at known checkpoints, not sit waiting for manual invocation. Touchpoints chosen from the docs' timing guidance, mapped to our pipeline:
  - **Early-task consult** ("before substantive work, before committing to an interpretation, before building on an assumption") → in CLAUDE.md Plan Mode workflow, **before ExitPlanMode** for non-trivial plans.
  - **Pre-done consult** ("when you believe the task is complete… BEFORE this call, make your deliverable durable") → at end-of-phase in /design-engineer:dev, /design-engineer:design, /design-engineer:review, /design-engineer:document; in dev-github-workflow Mode 1 before commit on plan-driven changes.
  - **Stuck / change-of-approach consult** → documented in skill itself; meta-orchestrator and dev workflow reference it as the recovery escalation when implementation is diverging.
- **Reconcile pattern from docs.** The skill includes the "I found X, you suggest Y, which constraint breaks the tie?" reconcile-call pattern verbatim. This is the docs' answer to "what if advisor advice conflicts with my evidence" — a single follow-up consult, not silent override or blind compliance.
- **No hook-level enforcement.** Tempting to add a UserPromptSubmit hook that nags about advisor consult, but the user has already pushed back on overly rigid hooks (process-recall hook, v4.1.2 → v4.1.4 loosening). The docs' own framing puts the *executor* in charge of timing: "the executor decides when to call it." Advisor checkpoints are written into the workflow text — model follows them like any other workflow step.
- **Don't ship a literal API enablement.** Plugin runtime can't toggle the `advisor-tool-2026-03-01` beta header. Add a brief README aside for advanced users running their own Anthropic API pipelines who want to enable it directly. No code change.
- **CHANGELOG entry quotes the source.** Per the v4.2.0 citation requirement, the CHANGELOG entry references the official docs URL.

## Phase 1: Ship the advisor agent + skill primitive

**Objective**: Create the dedicated advisor agent and skill, with system prompt and timing guide based heavily on the docs.

**Depends on**: none

**Files to modify**:

- **NEW** `agents/advisor.md` — agent frontmatter (`name: advisor`, `description: …`, `model: claude-opus-4-7`, `effort: xhigh`). Body = the docs' three suggested-system-prompt blocks, lightly adapted for a sub-agent context. Explicit non-mandates: no tool use; respond in under 100 words with enumerated steps; the calling skill includes full task context in the invocation prompt (since sub-agents don't auto-see the parent transcript the way the API tool does).
- **NEW** `skills/advisor/SKILL.md` — wrapper skill with frontmatter (`name: advisor`, `description: …`, `model: sonnet` — skill itself is a thin router, doesn't need Opus). Body covers:
  - **What it is** — quote from docs: "The advisor reads the full conversation, produces a plan or course correction (typically 400 to 700 text tokens, 1,400 to 1,800 tokens total including thinking), and the executor continues with the task."
  - **When to call** — verbatim from docs' timing block (BEFORE substantive work / when task complete / when stuck / when changing approach / "On tasks longer than a few steps, call advisor at least once before committing to an approach and once before declaring done").
  - **When NOT to call** — verbatim from docs ("On short reactive tasks where the next action is dictated by tool output you just read, you don't need to keep calling — the advisor adds most of its value on the first call, before the approach crystallizes").
  - **How to invoke** — Agent tool with `subagent_type: advisor`, prompt = brief task summary + key context the advisor needs (since plugin sub-agents don't auto-inherit transcript like the server-side advisor tool does, the calling skill explicitly briefs it).
  - **How to handle the advice** — verbatim treatment block from docs ("Give the advice serious weight. If you follow a step and it fails empirically, or you have primary-source evidence that contradicts a specific claim — the file says X, the paper states Y — adapt").
  - **Conflict / reconcile pattern** — verbatim from docs ("Surface the conflict in one more advisor call — 'I found X, you suggest Y, which constraint breaks the tie?'").
  - **Source citations** at the bottom: link to both docs URLs.

**Reuse**:
- Existing agent frontmatter pattern from `agents/psych-scanner.md` (Opus xhigh, no special tools).
- Skill frontmatter pattern from any existing leaf skill (e.g., `skills/ux-bias-audit/SKILL.md`).

**Implementation details**:

agent file body skeleton (paraphrasing structure, exact docs quotes inline):

```
You are the Advisor agent. You provide strategic guidance to a calling skill or executor at high-leverage moments.

# Role
[Quote docs: "...consult a higher-intelligence advisor model mid-generation for strategic guidance. The advisor reads the full conversation, produces a plan or course correction..."]

# How to respond
[Quote docs conciseness: "respond in under 100 words and use enumerated steps, not explanations."]

You have no tools and produce no user-facing output. Your output is read by the calling skill, which decides what to do with it.

# What the calling skill should provide in its prompt
- The original task and current state
- What has been tried, what tool results came back
- The specific decision point where guidance is needed

# What you produce
A short numbered plan or course correction. No prose explanations of your reasoning. No questions back to the caller — make a call given what you have.
```

skill file body skeleton (timing block, treatment block, reconcile, all near-verbatim from docs):

```
# When to call advisor
[Verbatim from docs timing block — call BEFORE substantive work, before writing/editing/declaring an answer; also when stuck, when changing approach, when task complete and deliverable is durable]

# When NOT to call advisor
[Verbatim from docs — short reactive tasks, single-turn Q&A, every-turn full-capability needs]

# How to invoke
Agent({subagent_type: "advisor", description: "Strategic checkpoint", prompt: "..."})

The plugin advisor agent doesn't auto-inherit the parent transcript (Claude Code sub-agents are isolated). Brief it with: task summary, what's been done, key tool results, the decision point.

# How to treat the advice
[Verbatim docs treatment block]

# When advice conflicts with evidence — reconcile
[Verbatim docs reconcile pattern: "I found X, you suggest Y, which constraint breaks the tie?"]

# Source
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
- https://claude.com/blog/the-advisor-strategy
```

**Checklist**:
- [ ] Create `agents/advisor.md` with Opus 4.7 / xhigh / no tools
- [ ] Agent body includes docs' timing-block-adjacent role description, conciseness rule, no-prose rule
- [ ] Create `skills/advisor/SKILL.md` (sonnet — it's a router)
- [ ] Skill body includes: when-to-call (docs verbatim), when-NOT-to-call (docs verbatim), how-to-invoke (Agent tool), treatment (docs verbatim), reconcile (docs verbatim), source links
- [ ] No tool list in agent (or empty `tools:`)
- [ ] Spot-check both files for docs quotes accuracy

**QA**:
1. `head -10 agents/advisor.md` shows correct frontmatter and Opus pin.
2. `grep -c "advisor" skills/advisor/SKILL.md` returns ≥10 (sanity check on completeness).
3. `grep "claude.com/blog/the-advisor-strategy\|platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool" skills/advisor/SKILL.md` confirms both source links present.
4. `grep "under 100 words" agents/advisor.md` confirms conciseness directive.

## Phase 2: Wire active integration into pipeline (so it actually fires)

**Objective**: Insert advisor checkpoints at the docs-prescribed moments throughout the existing /design-engineer pipeline, so the agent fires automatically during normal flows — not on user prompt only.

**Depends on**: Phase 1 (advisor agent + skill must exist).

**Files to modify**:

- **`CLAUDE.md`** Plan Mode workflow section (around line 220, after "EnterPlanMode" / before "ExitPlanMode" guidance):
  - Add new bullet: "Before calling `ExitPlanMode` on a non-trivial plan, invoke the **advisor** skill (`skills/advisor/`) for early-task strategic guidance. Brief it with: the user's request, key constraints discovered, the proposed phase breakdown. Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence."
  - Add note in implementation rules: "Before declaring a phase complete to the user, after deliverables are durable (files written, commits made), invoke the **advisor** skill for a pre-done consult."
- **`commands/design-engineer/dev.md`** — at the end of the existing implementation flow (before "present to user"), add a step: "Step N: Pre-done advisor consult — invoke `advisor` skill with: what was implemented, test results, anything that surprised you. Apply or reconcile."
- **`commands/design-engineer/design.md`** — at the end of each design phase / before final deliverable hand-off, add the pre-done consult.
- **`commands/design-engineer/review.md`** — at the end of the review phase / before producing the final report, add the pre-done consult.
- **`commands/design-engineer/document.md`** — before the final document is written/finalized, add the pre-done consult.
- **`commands/design-engineer/start.md`** — after detect-environment / before producing the kickoff plan, add an early advisor consult ("Before committing to an interpretation of the user's project type and goals, invoke advisor with the detection results and proposed onboarding path").
- **`skills/dev-github-workflow/SKILL.md`** — Mode 1 (plan-driven) commit flow: add "Before commit, if implementation diverged from the approved plan in any non-trivial way, invoke advisor skill with: the divergence summary and the rationale. Apply or reconcile."
- **`skills/meta-orchestrator/SKILL.md`** — add a one-paragraph section "Advisor checkpoints" referencing the skill and naming the moments orchestrator should invoke it (between phases at major transitions, at the user-approval checkpoint before Phase 5).
- **`README.md`** — bump banner v4.4.0 → v4.5.0; add a one-paragraph "Advisor pattern" entry under features summarizing the integration; include a brief note at the bottom for advanced API users: "If you're calling the Anthropic API directly (not via Claude Code), you can also enable the literal advisor-tool feature with `anthropic-beta: advisor-tool-2026-03-01` — see https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool."
- **`CHANGELOG.md`** — `[4.5.0] – 2026-04-26` entry under Added; cite both docs URLs in the body.
- **`.claude-plugin/plugin.json`** — bump 4.4.0 → 4.5.0.
- **`.claude-plugin/marketplace.json`** — bump 4.4.0 → 4.5.0.

**Reuse**:
- Existing agent-invocation pattern from CLAUDE.md and command files (Agent tool with subagent_type).
- Existing CHANGELOG format from prior 4.x.x entries.

**Implementation details**:

For each command file, the inserted step looks like:

```markdown
## Step N: Pre-done advisor consult (BLOCKING before user hand-off)

Before presenting the deliverable to the user as complete, invoke the advisor skill:

Skill({skill: "advisor"})

Provide in the prompt:
- Summary of what was produced
- Tool results / test outcomes / file writes (durable evidence)
- Anything that surprised you or felt uncertain
- The specific decision: "I'm about to present this as done — any course correction?"

Apply the advice. If it conflicts with primary-source evidence (a file says X, a test result shows Y), surface the conflict in a single follow-up advisor call ("I found X, you suggest Y, which constraint breaks the tie?"). Do not silently override either way.
```

For CLAUDE.md, the Plan Mode insertion:

```markdown
**Before calling `ExitPlanMode`** on any plan with more than one phase or any phase with non-trivial scope, invoke the advisor skill (`skills/advisor/`) for early-task guidance. Brief it with: the user's original request, key constraints, the proposed phase breakdown, anything you're uncertain about. Apply the advice or use the reconcile pattern.
```

For dev-github-workflow Mode 1 commit:

```markdown
Before drafting the commit message, if implementation diverged from the approved plan in any non-trivial way (added scope, dropped checklist items, changed approach mid-phase), invoke the advisor skill with the divergence summary. The advisor will return either "fine, ship it" or a course correction. Apply or reconcile before committing.
```

**Checklist**:
- [ ] CLAUDE.md Plan Mode workflow updated with two advisor checkpoints (pre-ExitPlanMode and pre-phase-done)
- [ ] commands/design-engineer/start.md adds early-task consult after env detection
- [ ] commands/design-engineer/dev.md adds pre-done consult at end-of-phase
- [ ] commands/design-engineer/design.md adds pre-done consult before final deliverable
- [ ] commands/design-engineer/review.md adds pre-done consult before final report
- [ ] commands/design-engineer/document.md adds pre-done consult before doc finalize
- [ ] skills/dev-github-workflow/SKILL.md Mode 1 adds divergence consult before commit
- [ ] skills/meta-orchestrator/SKILL.md adds Advisor checkpoints section
- [ ] README.md banner → v4.5.0, advisor-pattern feature entry added, advanced API note appended
- [ ] CHANGELOG.md `[4.5.0] – 2026-04-26` Added entry with both docs URLs cited
- [ ] .claude-plugin/plugin.json 4.4.0 → 4.5.0
- [ ] .claude-plugin/marketplace.json 4.4.0 → 4.5.0
- [ ] JSON manifests valid: `python3 -m json.tool < .claude-plugin/plugin.json` and same for marketplace.json
- [ ] Spot-check each command file for consistent step numbering after insertion
- [ ] `grep -rn "skills/advisor\|advisor skill" CLAUDE.md commands/design-engineer/ skills/` confirms checkpoints landed in every targeted file
- [ ] Validate the new agent doesn't sprawl: `wc -l agents/advisor.md` should be modest (~50–100 lines)

**QA**:
1. JSON manifests valid (`python3 -m json.tool` succeeds on both).
2. `grep -rn "advisor" CLAUDE.md commands/design-engineer/` returns hits in every command file and at least 2 in CLAUDE.md.
3. `grep -n "v4.5.0\|4.5.0" README.md CHANGELOG.md .claude-plugin/plugin.json .claude-plugin/marketplace.json` shows version bumped in all four.
4. `head -20 agents/advisor.md` shows `model: claude-opus-4-7` and `effort: xhigh`.
5. Manual smoke test (deferred to user): run `/design-engineer:dev` on a tiny task; observe the model invokes Skill({skill: "advisor"}) at the pre-done checkpoint. Run `/design-engineer:start` on a fresh dir; observe early-task consult after environment detection.

## Risk assessment

- **Risk**: Advisor checkpoints become noisy on trivial tasks (the docs explicitly flag this — "On short reactive tasks… you don't need to keep calling"). **Mitigation**: skill's "When NOT to call" section quotes the docs verbatim; CLAUDE.md inserts the checkpoint only for "non-trivial" plans/phases; command files word their insertions to fire at end-of-phase, not every tool result.
- **Risk**: Sub-agent spawn cost. Each advisor consult is a separate Opus xhigh invocation. **Mitigation**: docs themselves frame this as net-cost-positive when paired with cheaper executor work; we mostly invoke at *transition* points (a few times per /design-engineer pipeline run), not per-step. The cost saving the docs claim ("11.9% per agentic task" on Sonnet+Opus advisor) only materializes when most work runs at executor-rate; this matches our pipeline shape.
- **Risk**: Sub-agents in Claude Code don't auto-see the parent transcript the way the API advisor tool does ("the advisor sees the system prompt, all tool definitions, all prior turns, and all prior tool results"). **Mitigation**: skill explicitly tells the calling skill to brief the advisor with task summary + tool results + decision point. This is a fidelity gap we acknowledge — the plugin advisor sees what the caller chooses to share, not the full transcript. Document the gap in the skill so users understand it's the strategy, not the literal API plumbing.
- **Risk**: User might object to checkpoints being hard-coded into command files (vs. opt-in). **Mitigation**: this is exactly the user's explicit refinement ("really works, not just lays in the plugin wait for the user to manually invoke it"). No mitigation needed unless user changes mind.
- **Risk**: docs' suggested system prompt references `advisor()` function call which doesn't translate to Claude Code sub-agent shape. **Mitigation**: adapt only the function-call sentence; preserve everything else verbatim. Cite the docs in the skill so future maintainers can see the source.
- **Risk**: meta-orchestrator already does some "strategic guidance" work — overlap with advisor. **Mitigation**: meta-orchestrator runs the *whole pipeline* (sequencing, mode handling); advisor is a *consult-only* primitive. They compose: orchestrator can invoke advisor at key transitions. Different roles, no conflict.

## Verification (end-to-end)

After v4.5.0 lands:
1. `agents/advisor.md` exists, Opus 4.7 / xhigh / no tools, body quotes docs' timing/treatment/conciseness blocks near-verbatim.
2. `skills/advisor/SKILL.md` exists with all docs sections (when-to / when-not / how-to-invoke / treatment / reconcile / sources).
3. CLAUDE.md Plan Mode workflow includes two advisor checkpoints (pre-ExitPlanMode for non-trivial plans; pre-phase-done after deliverables durable).
4. All five /design-engineer command files have an advisor checkpoint inserted at the appropriate moment.
5. dev-github-workflow Mode 1 references advisor consult on plan divergence.
6. meta-orchestrator has an "Advisor checkpoints" section.
7. README banner v4.5.0, feature entry mentions advisor pattern, advanced-API note links to docs.
8. CHANGELOG `[4.5.0] – 2026-04-26` Added entry with both docs URLs cited.
9. JSON manifests valid; version 4.5.0 in plugin.json and marketplace.json.
10. Manual smoke test (deferred to user, with a v4.5.0-installed copy of the plugin):
    - Run /design-engineer:start in a fresh dir → observe early-task advisor consult after env detection.
    - Run /design-engineer:dev plan flow → observe advisor consult before ExitPlanMode and before phase-done.
    - Verify the advisor agent receives a contextual prompt (not empty), returns a short enumerated plan (not prose), and the calling skill applies or reconciles before proceeding.

## Questions for user

None — option C selected with the refinement "really works, not just lays in the plugin." Plan honors that with Phase 2 active integration. MINOR bump v4.5.0. Ready to implement on approval.
