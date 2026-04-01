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
