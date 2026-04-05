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
After approval, the plan is automatically copied to `plans/` by a hook. Verify the file exists in `plans/` before writing any code. If it's not there, copy it manually.

### Feature branch
If on main or master, create a feature branch before writing code: `git checkout -b feat/[plan-slug]`.

### TDD (mandatory)
Before writing production code for each phase, invoke the **test-writer** agent to create failing tests. Use the Agent tool to spawn it. You cannot write source code until test scripts exist in `tests/`. A hook enforces this – if you try to write code without tests, it will be blocked.

### Cross-agent review (at handoff points)

Before implementation starts:
- Invoke the **test-writer** agent in review mode: "Review this plan. Flag any requirements that are untestable as written." Address any concerns before proceeding.

After backend implementation and before frontend implementation:
- Invoke the **frontend-implementer** agent in review mode: "Review the backend API shape. Flag anything that will make the frontend harder than it needs to be." Address any concerns before proceeding.

After both backend and frontend implementation:
- The **design-system-auditor** agent reviews both – ensure it runs and its findings are addressed before proceeding.

### One phase at a time
Implement phases in dependency order. Never implement multiple phases in a single turn.

### Per-phase checklist
For each phase, follow this sequence:
1. Invoke the **test-writer** agent to write failing tests for this phase's changes (Red). Do not write the tests yourself – delegate to the agent.
2. Run test scripts to verify they fail correctly (fails because feature is missing, not because of typos)
3. Invoke the **backend-implementer** agent for server-side code (if applicable). Do not write backend code yourself – delegate to the agent.
4. MANDATORY: Run `/simplify` on backend changes. State what /simplify found and what was fixed. Do not proceed until /simplify has reviewed the code.
5. Invoke the **frontend-implementer** agent for client-side code (if applicable). Do not write frontend code yourself – delegate to the agent.
6. MANDATORY: Run `/simplify` on frontend changes. State what /simplify found and what was fixed. Do not proceed until /simplify has reviewed the code.
7. Run tests to verify they pass (Green)
8. Completeness review: read the phase's Checklist above, verify every item was implemented as specified – not differently, not partially. Check that no creative additions were made beyond the checklist.
9. If UI was changed: use Playwright to navigate to the affected page, take a screenshot, and verify visual correctness before presenting to the user
10. Present to user: what was done (brief), QA instructions from the plan. If the phase has no manual QA possible, state "No manual QA needed for this phase."
11. **BLOCKING**: WAIT for user approval – do not proceed to the next phase until the user explicitly approves
12. After approval: commit using dev-github-workflow (Conventional Commits format)

### After all phases
1. Invoke the **design-system-auditor** agent if any UI was changed. Do not skip this step.
2. Invoke the **compound-documenter** agent via meta-document to record what was built and why
3. Present post-implementation options via AskUserQuestion – never a plain text question

### Quality checks that happen automatically (hooks)
- Fidelity hook: checks every code write against the plan for scope drift, phase ordering, and content preservation
- TDD hook: blocks source code writes if no test scripts exist in `tests/`
- /simplify reminder: appears after every code write reminding you to run /simplify
- Git branch check: warns if your branch doesn't match the plan name
