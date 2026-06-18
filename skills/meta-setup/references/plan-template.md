# Implementation plan template

Every implementation plan must follow this format exactly. All fields are mandatory. Do not skip any field or substitute with a simpler format.

---

## Summary

[1–2 sentence overview of what this plan accomplishes and why]

## Architectural decisions

- [Decision 1]: [Rationale – why this approach over alternatives]
- [Decision 2]: [Rationale]

## Phase 1: [Phase name]

**Objective**: [What this phase accomplishes – 1 sentence]

**Depends on**: none

**Files**:
- Create: [exact file paths for new files]
- Modify: [exact file paths for existing files]

**Reuse**: [List every existing component you will reuse. For each one, state one of:
- Use as-is: [component name] – no changes needed
- Extend: [component name] – add [specific new variant/prop]
- Replace: [component name] – because [specific reason]
- New: [component name] – no existing equivalent because [reason]
Never write "leverage existing components" – be specific about every component.]

**Checklist:**
- [ ] [Specific deliverable 1 – concrete enough to verify]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]

**QA**: [Specific things the user should check – not "verify it works" but exact steps:
- Open [page/component] and check [specific behavior]
- Verify [specific file] contains [specific content]
- Test [specific interaction] and confirm [expected result]
- Edge case: [what to try] should [expected outcome]]

## Phase 2: [Phase name]

**Objective**: [What this phase accomplishes]

**Depends on**: Phase 1

**Files**:
- Create: [paths]
- Modify: [paths]

**Reuse**: [Same format as Phase 1]

**Checklist:**
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

**QA**: [Specific verification steps]

## Risk assessment

- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

## Questions for user

- [Any decisions that need user input before proceeding]
- [Any ambiguities that should be clarified]

---

## Execution rules

Follow these rules after the plan is approved. They are not optional.

### Plan storage
After approval, copy the plan to `.design-engineer-plugin/plans/`. Verify the file exists there before writing any code.

### Feature branch
If on main or master, create a feature branch before writing code: `git checkout -b feat/[plan-slug]`.

### Cross-agent review (at handoff points)

After backend implementation and before frontend implementation:
- Brief the **frontend-implementer** agent in review mode: "Review the backend API shape. Flag anything that will make the frontend harder than it needs to be." Address any concerns before proceeding.

After both backend and frontend implementation:
- The **design-system-auditor** agent reviews both – ensure it runs and its findings are addressed before proceeding.

### One phase at a time
Implement phases in dependency order. Never implement multiple phases in a single turn.

### Per-phase checklist
For each phase, follow this sequence:
1. Invoke the **backend-implementer** agent for server-side code when the work would otherwise flood the main context; iterate inline otherwise.
2. Run `/simplify` on backend changes. State what /simplify found and what was fixed before proceeding.
3. Invoke the **frontend-implementer** agent for client-side code when the work would otherwise flood the main context; iterate inline otherwise.
4. Run `/simplify` on frontend changes. State what /simplify found and what was fixed before proceeding.
5. Completeness review: read the phase's Checklist above, verify every item was implemented as specified – not differently, not partially. Check that no creative additions were made beyond the checklist, and that no important existing content was removed.
6. If UI was changed: use Playwright to navigate to the affected page, take a screenshot, and verify visual correctness before presenting to the user.
7. Build only what the plan's scope states. If a feature, behavior, or piece of copy was not in the plan or the user's request, do not add it – the only way to introduce something new is to ask the user first via AskUserQuestion.
8. Present to user: what was done (brief), QA instructions from the plan. If the phase has no manual QA possible, state "No manual QA needed for this phase."
9. **BLOCKING**: WAIT for user approval – do not proceed to the next phase until the user explicitly approves.
10. After approval: commit using dev-github-workflow (Conventional Commits format).

### After all phases
1. Invoke the **design-system-auditor** agent if any UI was changed. Do not skip this step.
2. Invoke the **compound-documenter** agent via meta-document to record what was built and why.
3. Present post-implementation options via AskUserQuestion – never a plain text question.
