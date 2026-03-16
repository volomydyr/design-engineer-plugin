---
name: ux-business-plan
description: Develops a business plan covering revenue model, market size, go-to-market strategy, and financial projections. Use when defining how a product will make money, estimating market potential, or planning finances before building.
disable-model-invocation: true
model: opus
---

# Business Plan

## Why This Matters

Business model, market research, and financial planning are important steps that founders often postpone until launch. That approach backfires. Better to tackle them early, even imperfectly.

Until you crunch the numbers, every idea feels "definitely profitable." Even a rough plan is better than none. A real accountant can be hired later, after you have launched your MVP and attracted initial users or investors.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

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

If the user has existing business documents or competitive analysis, ask them to share before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, share how the business could be viewed from multiple angles:

- **Revenue perspective**: Common business models in this space and which might fit
- **Market perspective**: How large the addressable audience might be
- **Cost perspective**: What it will take to build, maintain, and grow this product
- **Competitive pricing perspective**: What users in this space typically pay

Keep each to 2-3 sentences. Be honest – flag what is speculation versus data-driven.

---

## Step 3: Ask Strategic Questions

Ask 7-10 questions covering business model, market, and finances:

1. **Revenue model**: How do you imagine making money? Subscription, freemium, one-time purchase, marketplace, advertising?
2. **Pricing intuition**: Based on your competitive research, what price range feels right? What do similar products charge?
3. **Free vs. paid boundary**: If offering a free tier, what would be free and what would be paid? How do you nudge users toward upgrading?
4. **Market size**: How many potential users exist for your product? How did you estimate this?
5. **Growth channels**: How will you get your first 100 users? First 1,000? What channels will you use (PESO: Paid, Earned, Shared, Owned)?
6. **Cost structure**: What are your main costs? Development, hosting, AI APIs, marketing, your own time?
7. **Break-even**: How many paying users do you need to cover your costs?
8. **LTV:CAC awareness**: Do you have a sense of how much a user is worth over their lifetime vs. how much it costs to acquire them?
9. **Biggest financial risk**: What would make this product financially unviable?
10. **Timeline**: When do you expect to reach your first paying customer?

Ask in small batches (2-3 at a time). Wait for answers before continuing.

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

Save the final business plan to `{deliverables_path}/foundation/business-plan.md`.

The document should follow the complete structure from [business-plan-template.md](./references/business-plan-template.md).

---

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
