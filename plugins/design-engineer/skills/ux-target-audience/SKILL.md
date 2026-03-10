---
name: ux-target-audience
description: Develops detailed user personas with demographics, motivations, pain points, and behavioral patterns. Use when defining or refining who your product is for, after the problem statement is established.
disable-model-invocation: true
---

# Target Audience

## Why This Matters

A user persona helps you stay focused on who you are building the product for. Every time a new idea pops into your head, check it against the persona. This way, you avoid one of the most common traps -- building features instead of solving real needs.

You can start with a proto-persona: your best guess of who the user is, even without solid data. Later, you refine it as you gather insights from surveys and user tests.

There is no universal template for a persona -- the details always depend on your product. Still, focus on four categories:

- **Background**: Their role, environment, and daily situation
- **Behaviors**: How they act, make decisions, or approach the problem area
- **Pain points**: What frustrates them most about today's solutions
- **Goals**: What "better" looks like for them

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Assess Current Knowledge

```
question: "How well do you know your target users right now?"
header: "User Knowledge"
options:
  - label: "I have a general idea"
    description: "I know roughly who they are but have not documented it"
  - label: "I have a proto-persona"
    description: "I have written down my assumptions about the user"
  - label: "I have survey or interview data"
    description: "I have talked to real users or collected responses"
  - label: "I have an existing persona to update"
    description: "I have a persona document that needs revision based on new insights"
```

If the user has existing data, surveys, or persona drafts, ask them to share before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, briefly share how the target audience could be viewed from multiple angles:

- **Demographic perspective**: Who might these people be in terms of role, experience, and context
- **Behavioral perspective**: How they likely approach the problem area today -- their habits, tools, and decision patterns
- **Motivational perspective**: What drives them -- career growth, efficiency, recognition, financial gain
- **Barrier perspective**: What prevents them from solving the problem today -- lack of time, knowledge, motivation, or resources

Keep this to 2-3 sentences per perspective. Be honest about what is speculation versus what is grounded in shared data.

---

## Step 3: Ask Strategic Questions

Use the BMap framework (Hope, Pain, Barrier) combined with practical product questions. Ask 7-10 questions, adapting based on the user's earlier answers:

1. **Hope (magic wand)**: If your target user had a magic wand and could instantly [achieve the value your product promises], how would it change their life?
2. **Pain (last attempt)**: Tell me about the last time your target user tried to [do the action your product enables]. What happened? What stopped them from reaching their goal?
3. **Barrier (biggest challenge)**: What is their biggest difficulty when it comes to [the problem your product solves]? Why is it so hard for them?
4. **Daily context**: Describe a typical day for this person. When and where does the problem show up?
5. **Decision making**: How do they currently decide what tools or approaches to use for this problem? Who or what influences them?
6. **Existing tools**: What specific products, apps, or workarounds do they use today? What do they like and dislike about them?
7. **Willingness to pay**: Have they paid money to solve this problem before? If yes, how much and for what?
8. **Information sources**: Where do they go to learn about solutions like yours? What communities, platforms, or people do they trust?
9. **Success definition**: In their own words, what would "success" look like after using your product?
10. **Segmentation**: Are there meaningfully different groups within your target audience? If so, who is the primary group and who is secondary?

Ask questions in small batches (2-3 at a time). Wait for answers before continuing.

---

## Step 4: Draft the Persona

Based on the user's answers, draft the persona document following the structure in [persona-framework.md](./references/persona-framework.md).

Present the draft and ask for feedback. Pay special attention to:

- Whether the persona is specific enough (not "all professionals" or "anyone who wants to learn")
- Whether behaviors are described concretely (not "they use social media" but "they save learning links in Telegram chats they never revisit")
- Whether the BMap questions revealed genuine emotional insights

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and additions
2. Flag if the persona is becoming too broad or too generic
3. Distinguish between confirmed knowledge and assumptions (mark assumptions explicitly)
4. Ask follow-up questions where needed

Repeat until the user explicitly approves the persona.

---

## Step 6: Produce the Deliverable

Save the final persona document to `{deliverables_path}/foundation/target-audience.md`.

The document should follow the complete structure from [persona-framework.md](./references/persona-framework.md).

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (problem statement, survey results) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After the persona is finalized, suggest:

1. `ux-assumptions` -- Document and categorize all assumptions about the user and product
2. `ux-user-interviews` -- Design research to validate the persona with real users

---

## Resource Files

- [persona-framework.md](./references/persona-framework.md) -- Complete persona structure integrating BMap questions with practical product context
