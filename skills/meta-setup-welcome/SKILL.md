---
name: meta-setup-welcome
description: "Welcome prompt for projects using the plugin for the first time. Routes to full setup (new product) or capability guide (existing project)."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Welcome to Design Engineer

Your ONLY task is to present the question below, then route based on the answer.

Do not output any text before the question. No greeting, no project summary, no memory context, no "welcome back." Just the question.

```
question: "Welcome to Design Engineer Plugin. What brings you here?"
header: "Project Type"
options:
  - label: "New product idea"
    description: "Starting from scratch – I have an idea or a problem I want to solve"
  - label: "Existing project"
    description: "I already have a product, codebase, or designs – I want to improve, review, or add features"
```

After the user answers:

- If "New product idea": load the `meta-setup` skill and proceed to **Step 2: Detect Environment**.
- If "Existing project": load the `meta-setup-existing` skill. It handles the full onboarding flow for existing projects.
