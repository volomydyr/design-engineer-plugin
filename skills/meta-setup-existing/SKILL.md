---
name: meta-setup-existing
description: "Goal selection for existing projects using the Design Engineer Plugin for the first time. Routes to configuration."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# What would you like to do?

Your ONLY task is to present the question below, then route based on the answer.

Do not output any text before the question. No greeting, no project summary, no memory context. Just the question.

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

After the user answers, load the `meta-setup-configure` skill. It handles mode selection, project setup, and launching the right command.

If the user typed something custom instead of selecting an option, show this capability list, let them pick, then load `meta-setup-configure`:

```
Here's everything this plugin can help you with:

RESEARCH & DISCOVERY
• Define and analyze your core problem
• Build behavioral user personas
• Map and test your assumptions
• Research your competition
• Prepare and analyze user interviews

STRATEGY & POSITIONING
• Map what drives user behavior (Behavior Map framework)
• Build your product narrative (StoryBrand)
• Create user empathy stories (Story Panels)
• Plan your business model and revenue

PLANNING
• Define MVP scope and feature priorities
• Design information architecture and user flows

DESIGN & VALIDATION
• Audit designs for cognitive biases
• Map customer journey highs and lows
• Review ethics and dark patterns
• Collect and organize design references
• Generate clickable HTML prototypes
• Design key screens with Figma workflow
• Analyze UX psychology per screen
• Run a full product assessment

DEVELOPMENT
• Set up development environment and AI-assisted build pipeline
• Build features iteratively with test-first approach

REVIEW & AUDIT
• Design craft quality review
• Implementation fidelity check
• Accessibility audit (WCAG)
• Psychology scan (100 laws)
• Design system compliance
```
