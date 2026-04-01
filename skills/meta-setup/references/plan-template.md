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
Before writing production code for each phase, create failing tests first using the test-writer agent. You cannot write source code until test scripts exist in `tests/`. A hook enforces this – if you try to write code without tests, it will be blocked.

### One phase at a time
Implement phases in dependency order. Never implement multiple phases in a single turn.

### Per-phase checklist
For each phase, follow this sequence:
1. Write failing tests for this phase's changes (Red)
2. Implement the phase's code
3. Run `/simplify` on all changed code – this is mandatory, code is not complete without it
4. Run tests to verify they pass (Green)
5. Completeness review: read the phase's Checklist above, verify every item was implemented as specified – not differently, not partially. Check that no creative additions were made beyond the checklist.
6. If UI was changed: use Playwright to navigate to the affected page, take a screenshot, and verify visual correctness before presenting to the user
7. Present to user: what was done (brief), QA instructions from the plan
8. WAIT for user approval – do not proceed to the next phase until the user explicitly approves
9. After approval: commit using dev-github-workflow (Conventional Commits format)

### After all phases
1. Run design-system-auditor if any UI was changed
2. Invoke meta-document to record what was built and why
3. Present post-implementation options via AskUserQuestion – never a plain text question

### Quality checks that happen automatically (hooks)
- Fidelity hook: checks every code write against the plan for scope drift, phase ordering, and content preservation
- TDD hook: blocks source code writes if no test scripts exist in `tests/`
- /simplify reminder: appears after every code write reminding you to run /simplify
- Git branch check: warns if your branch doesn't match the plan name
