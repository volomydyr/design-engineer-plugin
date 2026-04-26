---
name: design-engineer:start
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

## Advisor checkpoint contract for the loaded skill

After environment detection completes (tech stack identified, tools enumerated, project type inferred) but **before** committing to a recommended onboarding path or kickoff plan, the loaded skill (`meta-setup-welcome` or `meta-setup`) MUST invoke the `advisor` skill (`skills/advisor/`) with: detection results, inferred project type, the path it's about to recommend, and "I'm about to commit to this interpretation of the project — any course correction before I show it to the user?" Apply the advice or use the reconcile pattern.

This is the docs' "before committing to an interpretation" call ([advisor docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)). Onboarding is irreversibly directional — wrong project-type inference cascades through every later phase. Skip only when the user invoked `/design-engineer:start` with explicit arguments that make interpretation unambiguous.
