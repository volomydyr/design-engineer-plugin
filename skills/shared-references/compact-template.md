# Compact message template

When suggesting compaction at a pipeline breakpoint, generate a ready-to-use compact message for the user. Fill in every bracket with actual values from the current session. Never leave brackets unfilled.

## Template

```
Keep full context of [project name] at [project path]. Current state: running /de:[command] in [mode] mode. Phase [N] ([phase name]): completed [list of completed skills with deliverable status], next is [next skill]. Key decisions this session: [list of cross-cutting decisions that affect downstream work]. Deliverables updated: [list of files written or modified this session]. Stale dependents: [list from dependencies.yaml, or "none"]. Next step: [specific action to take after compaction]. Open questions: [any unresolved blockers or pending user decisions, or "none"].
```

## Rules

1. Fill in every bracket with actual values – never output the template with placeholders
2. Include the message in the same response as the suggestion – don't wait for the user to agree before generating it
3. This is a suggestion, not a requirement – if the user dismisses it, do not bring it up again in the same session
4. The user copies this message and pastes it into `/compact`

## When to suggest

1. After Phase 3 completes (design activities done, before prototyping) – context is heavy with conversation, deliverables are saved to files
2. After Phase 4 completes (prototyping + Figma done, before development) – fresh context for the implementation phase
3. At ~90% context usage regardless of pipeline position (existing rule in CLAUDE.md)

## Example

```
Keep full context of Cowrite at ~/Cursor-projects/cowrite. Current state: running /de:design in Guided mode. Phase 3 (Product planning): completed ux-mvp-requirements, ux-information-architecture, next is ux-bias-audit (Phase 4). Key decisions this session: macOS-only overlay app, free/open-source, Space Mono font, annotation popup with two buttons (Save & close, Copy all). Deliverables updated: problem-statement.md, target-audience.md, assumptions.md, competitor-analysis.md, behavior-map.md, storybrand.md, story-panels/feedback-loop, business-plan.md, mvp-requirements.md, information-architecture.md. Stale dependents: none. Next step: start Phase 4 with bias audit. Open questions: none.
```
