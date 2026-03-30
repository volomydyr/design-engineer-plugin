---
name: meta-setup-welcome
description: "Welcome prompt for projects using the plugin for the first time. Routes to full setup (new product) or configuration (existing project)."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Welcome to Design Engineer Plugin

Your ONLY task is to present the questions below, then route based on the answers.

Do not output any text before the questions. No greeting, no project summary, no memory context. Just the questions.

Make ONE AskUserQuestion call with both questions:

```
questions:
  - question: "Welcome to Design Engineer Plugin. What brings you here?"
    header: "Project type"
    options:
      - label: "New product idea"
        description: "Starting from scratch – I have an idea or a problem I want to solve"
      - label: "Existing project"
        description: "I already have a product, codebase, or designs – I want to improve, review, or add features"
    multiSelect: false
  - question: "What would you like to do?"
    header: "Goal"
    options:
      - label: "Review what I have"
        description: "Audit quality, find UX issues, check accessibility"
      - label: "Implement from Figma"
        description: "I have designs ready to turn into code"
      - label: "Design a new feature"
        description: "Start the design thinking process for something new"
      - label: "Set up the dev workflow"
        description: "Configure AI-assisted development for this project"
    multiSelect: false
```

After receiving both answers:

- If "New product idea": load the `meta-setup` skill and proceed to **Step 2: Detect Environment**.
- If "Existing project": load the `meta-setup-configure` skill. It asks about mode, runs setup, and launches the right command.
