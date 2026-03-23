---
name: ux-competitor-analysis
description: Conducts structured competitive analysis identifying direct and indirect competitors, strengths, weaknesses, and market positioning. Use when you need to understand the competitive landscape before making product or business decisions.
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Competitor Analysis

## Why This Matters

Classic competitor analysis can eat up days. AI makes it much faster if you know how to set it up correctly. The key is never just asking AI to "do a competitor analysis" – that produces garbage. The quality depends entirely on the specificity of the prompt and the context provided.

Two critical starting points:

- **Do not skip indirect competitors.** Even if it feels like "there is nothing like my product," similar solutions almost always exist in another form.
- **If stuck, look back at your survey results.** Users often mention tools they already use, which reveals competitors you might not have considered.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

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

If the user has existing competitor lists or research, ask them to share before proceeding.

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

Save the final competitive analysis to `{deliverables_path}/foundation/competitor-analysis.md`.

The document should follow the complete structure from [competitor-analysis-framework.md](./references/competitor-analysis-framework.md).

---

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
