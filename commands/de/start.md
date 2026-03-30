---
name: de:start
description: Universal entry point. New projects get setup, returning projects resume where they left off, existing projects get a capability guide.
argument-hint: ""
---

# Design Engineer – Start

<context> #$ARGUMENTS </context>

## Routing

Check your context for `DESIGN_ENGINEER_PROJECT_STATE:`.

- If `new_to_plugin` → load the `meta-setup-welcome` skill. Follow the ONBOARDING SEQUENCE from the hook — it has the complete step-by-step flow.
- If `returning_with_resume` → load the `meta-setup` skill, follow Path A (resume state).
- If `returning_no_resume` → load the `meta-setup` skill, follow Path A (config summary).
- If not found → load the `meta-setup` skill, it handles detection as fallback.
