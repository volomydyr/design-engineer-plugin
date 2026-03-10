---
name: ui-design-references
description: Guides the user through gathering and organizing design references before opening any design tool. Use when starting high-fidelity UI work or when the user needs visual direction for their product's look and feel.
disable-model-invocation: true
---

# Design References

## Why This Matters

Once your product is validated through testing, you can move to high-fidelity UI. But you do not need to design every screen beforehand. With AI-assisted development, Figma becomes a tool for visual direction -- not for documenting every possible state.

Before opening Figma, you should spend time collecting references to get a sense of common patterns relevant to your product type. Nothing complex -- just collect references so you are not starting from a blank file. Starting with references prevents blank-canvas paralysis and ensures consistency with established patterns in your industry.

For example, when building a healthcare app, browsing healthcare apps on Mobbin reveals common patterns for onboarding flows, data display, navigation structures, and interaction models. These references become the visual vocabulary that both you and your AI tools will use.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand the Product Context

Before collecting references, determine what the user is building. Ask:

```
question: "What type of product are you designing for?"
header: "Product Type"
options:
  - label: "Mobile app (iOS)"
    description: "Native iOS application with standard mobile patterns"
  - label: "Mobile app (Android)"
    description: "Native Android application with Material Design patterns"
  - label: "Web application"
    description: "Browser-based application with responsive layouts"
  - label: "Cross-platform mobile"
    description: "React Native, Flutter, or similar cross-platform framework"
  - label: "Other"
    description: "Desktop app, wearable, or something else"
```

Then ask about the product domain (e.g., healthcare, fintech, e-commerce, productivity, social) to narrow reference searches.

---

## Step 2: Identify Key Screens to Reference

Based on the user's Information Architecture and MVP Requirements (if available from earlier skills), identify the 5-8 most important screens that need visual direction. These are the building blocks -- screens that set up the visual style AI can analyze and reuse for other parts of the app.

Ask the user to confirm or adjust the list:

```
question: "Which screens are most critical for establishing your visual direction?"
header: "Key Screens"
options:
  - label: "Onboarding / Welcome"
    description: "First impression and sign-up flow"
  - label: "Home / Dashboard"
    description: "Main screen users see after login"
  - label: "Primary action screen"
    description: "The core feature users come for"
  - label: "Detail / Content view"
    description: "How individual items or records are displayed"
  - label: "Navigation structure"
    description: "Bottom tabs, sidebar, or drawer patterns"
  - label: "Forms / Input screens"
    description: "How users enter or edit data"
  - label: "Settings / Profile"
    description: "Account management and preferences"
  - label: "Other"
    description: "Something specific to your product"
allowMultiSelect: true
```

---

## Step 3: Guide Reference Collection

Walk the user through collecting references using the approach described in [reference-gathering-guide.md](./references/reference-gathering-guide.md).

For each key screen identified in Step 2:

1. Suggest specific search terms for Mobbin (e.g., "healthcare onboarding", "medical records detail")
2. Recommend looking at 3-5 apps in the same domain
3. Ask the user to note what they like about each reference -- specific elements, not just "looks good"
4. Help categorize references by: layout patterns, color approaches, typography styles, interaction models

---

## Step 4: Organize References into a Direction Document

Help the user compile their references into a structured document. For each key screen:

- Which reference apps inspired the direction
- Specific patterns to adopt (e.g., "card-based layout like App X", "bottom sheet navigation like App Y")
- Color direction (light/dark, accent colors, tone)
- Typography feel (modern/classic, bold headers vs subtle)
- Interaction patterns worth replicating

---

## Step 5: Produce the Deliverable

Save the references document to `{deliverables_path}/design/references.md`.

The document should include:

- Product type and domain context
- List of key screens with visual direction for each
- Reference apps and what to take from each
- Overall visual direction summary (2-3 sentences describing the target aesthetic)
- Notes on what NOT to do (anti-patterns observed during research)

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything -- their taste, their product, their call
2. **Existing documentation** (MVP Requirements, Information Architecture) informs what screens to focus on
3. **AI suggestions** fill gaps only when user and docs provide no guidance -- and are always presented as suggestions, not decisions

---

## What Comes Next

After references are collected, suggest running `ui-figma-workflow` to design the key screens in Figma using these references as visual direction.

---

## Resource Files

- [reference-gathering-guide.md](./references/reference-gathering-guide.md) -- Approach to collecting and organizing design references using Mobbin and other tools
