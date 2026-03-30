---
name: meta-setup-existing
description: "Goal selection for existing projects using the Design Engineer Plugin for the first time. Routes to configuration."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# What would you like to do?

Your ONLY task is to present the question below, then load `meta-setup-configure`.

Do not output any text before the question. Do not load any command directly. Do not start working on the user's goal. Just ask the question and route.

```
question: "What would you like to do with your existing project?"
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
```

After the user answers: load the `meta-setup-configure` skill.
