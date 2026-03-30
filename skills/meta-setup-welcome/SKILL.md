---
name: meta-setup-welcome
description: "Welcome prompt for new-to-plugin projects. The onboarding sequence is injected by the UserPromptSubmit hook."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Welcome

Follow the ONBOARDING SEQUENCE injected into your context by the hook. Start at Step 1.

Do not output any text before the first AskUserQuestion. No greeting, no project summary, no memory context.
