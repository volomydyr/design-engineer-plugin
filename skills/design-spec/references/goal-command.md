# `/goal` command template

`/goal` is a built-in Claude Code command (v2.1.139+): it sets a completion condition, and after each turn a small fast model checks whether the condition holds; if it does not, Claude auto-starts another turn until it does. Its headline use is implementing a design doc until all its acceptance criteria hold.

This template turns a screen's `.spec.md` into a ready-to-paste `/goal` whose completion condition is the spec's EARS acceptance criteria plus Playwright verification. It locks the implementer to the spec: build only what the spec says, reuse only existing components, emit zero hardcoded values, and verify in the real UI.

## How to use it

- `/goal` is **user-invoked only**. The plugin SUGGESTS this block and STOPS. NEVER attempt to invoke `/goal` yourself.
- Gate on availability: `/goal` needs Claude Code v2.1.139+. If it is unavailable or the user declines, proceed normally – do not block.
- Compose the block from the spec: fill the placeholders, then paste every line of the spec's `acceptance` blocks into the completion condition (this is the load-bearing substitution – the spec's acceptance criteria ARE the goal condition).
- Present it to the user and STOP. The user pastes it, or says "go" to proceed without it.

---

```
/goal Implement the design spec(s) for <feature / screen> EXACTLY.

REQUIRED READS (before writing any code):
1. <spec path(s)> – e.g. .design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md – every YAML block is binding
2. .design-engineer-plugin/design/dev/design-system.md – the source of truth for token names, aliases, and existing component paths
3. .design-engineer-plugin/design/exploration/references/references.md – the design intent the spec binds to
4. <project conventions doc at root, e.g. CLAUDE.md> – coding conventions, component architecture, design token usage

COMPLETION CONDITION (all must hold, verified in the running UI):
<paste every line from each component's `acceptance` block in the spec(s) here, verbatim>
PLUS the following always apply:
- Every component the spec marks `reuse` is reused from its `source` path; no new component is created for a job an existing component covers.
- Zero hardcoded values: every color, spacing, type, radius, elevation, and motion value resolves to a token reference from design-system.md. No raw hex / px / rem.
- Verified via at least 3 Playwright iterations of real user flows (desktop AND mobile), checking each acceptance criterion in the rendered UI.

HARD RULES:
1. Build EVERY component block in the spec(s). No skipping, no condensing.
2. Do NOT add anything beyond the spec. No invented components, props, states, or tokens. If the design system lacks a token the spec needs, STOP and ask.
3. If a spec line is ambiguous or contradicts the design system (a referenced token or component path does not exist), STOP and ask. Do NOT improvise or coin a name.
4. Verify EACH component before moving on:
   - Type check / lint clean.
   - Playwright MCP test: drive the real screen, exercise every state in the spec's `states` block, check each `acceptance` criterion across desktop and mobile. When you hit a login wall, STOP and ask the user to log in in the Playwright window.
   - Confirm no raw values were emitted (grep the diff for hex / px / rem that should be tokens).
5. Do NOT claim done until 100% of the completion condition holds across at least 3 Playwright iterations.
6. When done, report: each acceptance criterion + its status, the files changed, the Playwright flows run and what you found, and any deviations from the spec with the reason.

If anything in these rules contradicts the spec: STOP and ask. Do NOT silently work around it.
```
