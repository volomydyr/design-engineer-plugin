---
name: dev-prototyping
description: Guides the AI prototyping workflow from generation through testing and analysis. Use when creating interactive prototypes from planning documents, when testing prototypes with users, or when analyzing test results.
disable-model-invocation: true
---

# AI Prototyping Workflow

## Why This Matters

Claude Projects and similar tools can generate simple web prototypes -- perfect for quickly testing ideas. Instead of spending days in Figma to design a first iteration, you can generate a working prototype from your MVP Requirements and Information Architecture, iterate through many refinement rounds, and test it with real users before writing production code.

The key principle: build functional-first prototypes before making them beautiful. Start with something that works well but looks basic, validate the concept, then invest in visual polish.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Prepare for Prototyping

```
question: "What documents do you have available for prototyping?"
header: "Available Context"
options:
  - label: "MVP Requirements"
    description: "Feature list with priorities and acceptance criteria"
  - label: "Information Architecture"
    description: "Screen inventory, navigation, user flows"
  - label: "Design references"
    description: "Visual inspiration from similar products"
  - label: "Target audience personas"
    description: "Who will be testing the prototype"
  - label: "None of the above"
    description: "Starting with just an idea"
allowMultiSelect: true
```

---

## Step 2: Generate the Prototype

Guide the prototyping process using [prototyping-workflow.md](./references/prototyping-workflow.md):

1. **Do not tell AI to build immediately** -- first ask it to share its thoughts, ask clarifying questions, and create a detailed development plan
2. **Wait for approval** before AI starts building
3. **Iterate extensively** -- expect many rounds of refinement (dozens or more) as each round of feedback gets the prototype closer to the intended idea
4. **Focus on functionality first** -- the prototype should work well and cover all key user flows, even if it looks basic

---

## Step 3: Test the Prototype

Once the prototype is ready for testing:
1. Use the share link (Claude Projects provides direct share links)
2. Set up unmoderated tests using a tool like Useberry, Maze, or similar
3. Create a test script with specific tasks for users to complete
4. If unfamiliar with the testing tool, ask AI for help navigating the interface (share screenshots when AI's guidance does not match what you see)

---

## Step 4: Analyze Results (Dual-Analysis Method)

Follow the approach from [testing-analysis-guide.md](./references/testing-analysis-guide.md):

1. **Watch every test recording first** -- take your own notes and form your own conclusions
2. **Do not share your conclusions with AI yet** -- keep them private
3. **Ask AI to analyze the raw results independently** -- without knowing your thoughts, so it is not biased by your interpretation
4. **Then share your analysis** and ask AI to identify what might have been missed
5. **Combine the best from both versions** -- your insights plus AI's fresh perspective

This dual-analysis approach catches details that either human or AI analysis alone would miss. AI tends to invent findings that are not supported by data -- always verify its claims against the actual test results.

---

## Step 5: Iterate Based on Findings

Use test findings to:
- Adjust the prototype for another round of testing
- Update planning documents (requirements, architecture) based on validated or invalidated assumptions
- Identify positioning problems early (before writing production code)
- Decide which features to keep, modify, or cut from the MVP

---

## Decision Hierarchy

1. **User's direct input** -- their interpretation of test results takes priority
2. **Test data** -- actual user behavior and feedback
3. **AI analysis** -- useful for catching missed details but must be verified against raw data

---

## What Comes Next

After prototyping and testing, suggest `ui-design-references` to collect visual references for high-fidelity design, or `ui-figma-workflow` to create the key Figma screens based on validated prototype findings.

---

## Resource Files

- [prototyping-workflow.md](./references/prototyping-workflow.md) -- Iteration methodology for AI-generated prototypes
- [testing-analysis-guide.md](./references/testing-analysis-guide.md) -- Dual-analysis approach for user testing results
