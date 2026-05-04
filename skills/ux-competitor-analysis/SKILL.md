---
name: ux-competitor-analysis
description: Conducts structured competitive analysis identifying direct and indirect competitors, strengths, weaknesses, and market positioning. Use when you need to understand the competitive landscape before making product or business decisions.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Competitor Analysis

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_competitor_analysis`. If it indicates the project already has a competitor analysis (in repo, or via an off-repo reference such as Notion / Confluence captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the competitive positioning.
2. Ask via AskUserQuestion: "Your project already has a competitor analysis at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only (e.g., updating specific competitors).
5. If "Re-run anyway" → proceed normally below.

## Why This Matters

Classic competitor analysis can eat up days. AI makes it much faster if you know how to set it up correctly. The key is never just asking AI to "do a competitor analysis" – that produces garbage. The quality depends entirely on the specificity of the prompt and the context provided.

Two critical starting points:

- **Do not skip indirect competitors.** Even if it feels like "there is nothing like my product," similar solutions almost always exist in another form.
- **If stuck, look back at your survey results.** Users often mention tools they already use, which reveals competitors you might not have considered.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand what you already know about competitors, 2) share my initial read on the competitive landscape, 3) ask 7–10 strategic questions, 4) conduct deep research on each competitor, 5) draft the competitive analysis, 6) iterate until you approve it, 7) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with competitive analysis and why it matters in product development. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Create a research plan before executing any searches.** Define: what to research, what queries to run, what dimensions to compare, what gaps to look for.

4. **Agent delegation**: Delegate the web research to the **ux-researcher** agent. Use the Agent tool to spawn it with a research plan that specifies: what to research, what queries to run, what dimensions to compare, what gaps to look for. Do not do the research yourself in the main conversation – the ux-researcher agent has specialized instructions for structured competitive analysis.

5. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

5. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Identify Current Knowledge

```
question: "What do you already know about your competitors?"
header: "Competitive Knowledge"
options:
  - label: "I do not know my competitors"
    description: "I have not researched who else is in this space"
  - label: "I know some direct competitors"
    description: "I can name a few products that do something similar"
  - label: "I know direct and indirect competitors"
    description: "I have a list of both similar products and alternative approaches"
  - label: "I have existing research to update"
    description: "I have done competitive analysis before and need to refresh it"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing competitor lists or research, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the competitive landscape based on what you already know about the project. Draw on the user's context from Step 1, any existing project documents (problem statement, persona, survey results where users mentioned tools), and your understanding of the domain.

Flag what is speculation versus what is based on shared context. If you already see obvious competitors or market gaps, mention them. The goal is to give the user starting material for their own thinking – not to follow a rigid template.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project from Step 1 and any existing documents. Make sure your questions cover these key concepts:

- Do not skip indirect competitors
- Use AI research prompts (Perplexity/Liner) but do not just ask AI to "do a competitor analysis"
- Always click through competitor sites/apps yourself (manual review)
- Look at community feedback, paywall strategies, user complaints

Ask in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. Do not generate the deliverable until at least 7 questions have been asked and answered.

---

## Step 4: Conduct Deep Research

If web search capabilities are available, use them to research each competitor. Follow the structured research prompt template from [competitor-analysis-framework.md](./references/competitor-analysis-framework.md).

For each competitor, research:
1. Business model and pricing strategy
2. User experience evaluation
3. Feature comparison
4. User feedback from app store reviews, Reddit, and forums
5. Strategic opportunities and gaps

If web search is not available, work with the user's knowledge and any documents they can provide. Ask the user to manually check competitor websites and apps, then share their observations.

**Important:** AI research alone is not enough. Always encourage the user to click through competitor sites and apps themselves, write down impressions, and share those notes. The combination of AI research and manual review produces the most reliable results.

---

## Step 5: Draft the Competitive Analysis

Based on all gathered information, draft the analysis document following the structure in [competitor-analysis-framework.md](./references/competitor-analysis-framework.md).

Present the draft and ask for feedback. Ensure:

- Both direct and indirect competitors are covered
- Comparison is based on observable facts, not assumptions
- Gaps and opportunities are specific and actionable
- The user's differentiation strategy is clearly articulated

---

## Step 6: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and new information
2. Flag any claims that need verification
3. Update the comparison matrix
4. Refine the positioning strategy based on feedback

Repeat until the user explicitly approves the analysis.

---

## Step 7: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/research` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final competitive analysis to `.design-engineer-plugin/design/research/competitor-analysis.md`. Competitor analysis is research (gathering external evidence about adjacent products) — that's why it lives in `research/`, not `foundation/`. The dependency graph at `skills/meta-setup/assets/dependencies-default.yaml` is the source of truth for canonical paths.

The document should follow the complete structure from [competitor-analysis-framework.md](./references/competitor-analysis-framework.md).

After completing the competitor analysis, check if any new assumptions surfaced during the research. If so, Read `.design-engineer-plugin/design/foundation/assumptions.md` and append the new assumptions with a note: 'Added from competitor analysis on [date].' The assumptions document is a living deliverable that accumulates insights across the pipeline.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing competitor, an unverified claim, a market segment nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No solutions in discovery**: During this activity, do not introduce specific product features or solutions. Stay focused on understanding the competitive landscape – what exists, what gaps remain, how competitors position themselves. Product decisions belong in later pipeline phases.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (survey results where users mentioned tools, prior research) informs analysis
3. **AI suggestions** and web research fill gaps – but always verify claims with the user

---

## What Comes Next

After competitive analysis is finalized, suggest:

1. `ux-business-plan` – Define the business model informed by competitive pricing insights
2. `ux-storybrand` – Craft messaging that differentiates from competitors

---

## Resource Files

- [competitor-analysis-framework.md](./references/competitor-analysis-framework.md) – Analysis structure with comparison matrices and research prompt template


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
