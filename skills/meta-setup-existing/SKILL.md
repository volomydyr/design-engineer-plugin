---
name: meta-setup-existing
description: "Reference for existing-project onboarding. The actual flow is driven by the UserPromptSubmit hook's ONBOARDING SEQUENCE."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Existing Project Onboarding

The onboarding flow for existing projects is driven by the ONBOARDING SEQUENCE injected into context by the UserPromptSubmit hook. Follow that sequence – it contains the exact AskUserQuestion calls, setup steps, and routing.

This skill exists as a reference. The hook handles all routing and question flow.
