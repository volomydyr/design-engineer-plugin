---
name: ux-business-plan
description: Develops a business plan covering revenue model, market size, go-to-market strategy, and financial projections. Use when defining how a product will make money, estimating market potential, or planning finances before building.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Business Plan

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_business_plan`. If it indicates the project already has a business plan / revenue model (in repo, or via an off-repo reference such as Notion / Confluence captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the business model.
2. Ask via AskUserQuestion: "Your project already has a business plan / revenue model at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only.
5. If "Re-run anyway" → proceed normally below.

## Why This Matters

Business model, market research, and financial planning are important steps that founders often postpone until launch. That approach backfires. Better to tackle them early, even imperfectly.

Until you crunch the numbers, every idea feels "definitely profitable." Even a rough plan is better than none. A real accountant can be hired later, after you have launched your MVP and attracted initial users or investors.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess how far along you are with business planning, 2) share my initial read on the business model, 3) ask 7–10 strategic questions covering revenue model, market size, go-to-market, and financials, 4) draft the business plan together, 5) iterate until you approve it, 6) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with business planning for products and why it matters early. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Current State

```
question: "How far along are you with the business side of your product?"
header: "Business Planning Status"
options:
  - label: "Have not thought about it yet"
    description: "I have been focused on the product idea and user needs"
  - label: "I have a rough idea of the business model"
    description: "I know generally how I want to make money but nothing documented"
  - label: "I have competitive pricing data"
    description: "I know what competitors charge and have some market context"
  - label: "I have an existing business plan to update"
    description: "I have a document that needs revision based on new insights"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing business documents or competitive analysis, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the business plan based on what you know about the project so far. Keep it to 2-3 sentences per thought. Be honest -- flag what is speculation versus data-driven.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project. Make sure your questions cover these key concepts:

- 5 business model types: freemium, subscription, e-commerce, advertising, marketplace
- Market research: TAM/SAM/SOM estimation
- PESO framework (Paid, Earned, Shared, Owned) for go-to-market
- Financial planning: revenue forecasting, cost structure
- AI verification discipline: "the main goal of every AI assistant is to answer you even when it doesn't know"

Ask in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. Do not generate the deliverable until at least 7 questions have been asked and answered.

---

## Step 4: Draft the Business Plan

Based on all gathered information, draft the business plan following the structure in [business-plan-template.md](./references/business-plan-template.md).

Present the draft and ask for feedback.

### Critical: Verify AI Claims

When using AI to help with market research or financial projections, always apply skepticism:

- If AI cites "research proves X," ask: what specific research? Can you find the source?
- If AI provides market size numbers, cross-reference with at least one other source
- If AI suggests revenue projections, stress-test the assumptions behind them
- Never present AI-generated statistics as facts without verification

Teach the user this discipline explicitly. The main goal of every AI assistant is to answer you, even when it does not know the right answer. Always verify.

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and new data
2. Flag unrealistic assumptions (especially optimistic revenue projections)
3. Ensure the LTV:CAC ratio is realistic (3:1 minimum for US/Europe, 5:1 for harder markets)
4. Verify that costs are not underestimated

Repeat until the user explicitly approves the business plan.

---

## Step 6: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/foundation` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final business plan to `.design-engineer-plugin/design/foundation/business-plan.md`.

The document should follow the complete structure from [business-plan-template.md](./references/business-plan-template.md).

After completing the business plan, check if any new assumptions surfaced. If so, Read `.design-engineer-plugin/design/foundation/assumptions.md` and append the new assumptions with a note: 'Added from business plan on [date].' The assumptions document is a living deliverable that accumulates insights across the pipeline.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing revenue assumption, an unaddressed cost category, a market segment nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **When referencing the assumptions document, you MUST Read the actual file `.design-engineer-plugin/design/foundation/assumptions.md` first.** Do not quote assumptions from memory.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (competitive analysis, persona, problem statement) informs projections
3. **AI suggestions** fill gaps but must be verified – especially numerical claims

---

## What Comes Next

After the business plan is finalized, suggest:

1. `ux-mvp-requirements` – Define the minimum viable feature set informed by business constraints
2. `ux-storybrand` – Align messaging with the business model and value proposition

---

## Resource Files

- [business-plan-template.md](./references/business-plan-template.md) – Lean business plan structure with financial projection framework


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
