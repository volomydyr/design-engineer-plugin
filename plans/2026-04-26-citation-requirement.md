# v4.2.0 — Per-skill citation requirement (transparency for judgments)

## Context

Beta tester reported that while the plugin asks great clarifying questions and refuses to be a yes-man, **she can't see WHERE the plugin's judgments come from**. When Claude says "this answer is incomplete" or "use Problem/Awareness matrix", it doesn't always cite the source file. Quote: "I'm steering a horse (Claude) but I'm blindfolded and he has the map 😅."

Audit:
- Plugin already has a soft rule in `meta-orchestrator/SKILL.md:27` ("provide specific quotes when making claims") but it's only in one file and only fires when meta-orchestrator is active.
- The 35 evaluation-heavy skills (ux-*, psych-*, plus ui-aesthetic-review / ui-accessibility / ui-design-system / ui-design-to-code-qa / dev-claude-md) push back on user input ("too vague", "incomplete", "use this framework") without consistent citation back to the reference file that grounds the judgment.
- Reference files exist (e.g., `ux-problem-statement/references/problem-statement-template.md` has the "vague vs specific" examples). The link from judgment → source citation is missing in the SKILL.md instructions.

User picked: **per-skill citation requirement**. Add citation discipline to the evaluation steps in each affected skill, not a global CLAUDE.md rule (lighter-touch but easier to drift) or a hook (heavier and more fragile).

This is additive (no breaking change). **MINOR bump → v4.2.0** per CLAUDE.md versioning rules (modifying skills' instructions without renaming or removing).

## Architectural decisions

- **35 skills get the citation requirement.** Full list in Phase 1 below.
- **Single uniform citation block** appended to each skill's evaluation/pushback section. The exact wording is identical across skills so testers see consistent behavior; only the file paths in the example are skill-specific.
- **Pattern**: when Claude pushes back on user input or invokes a named framework, it must include — in the same response — a one-line citation of the form: `Source: <relative path from skill dir>:<line range or section> — "<1-line quote of the relevant passage>"`. Two-form citation (file + quote) so the user can verify the judgment without opening the file.
- **No CLAUDE.md change** in this release. User explicitly rejected the global option. If real-world testing shows drift across skills, we can escalate to CLAUDE.md or a hook in a follow-up patch (noted in CHANGELOG as future option).
- **Existing meta-orchestrator/SKILL.md soft rule stays.** It's complementary, not redundant.

## Phase 1: Add citation requirement to 35 skills + ship v4.2.0

**Objective**: Append the uniform citation block to the evaluation/pushback section of every evaluation-heavy skill. Ship as v4.2.0.

**Depends on**: none

**Files to modify** (35 skills):

UX skills (16):
- `skills/ux-problem-statement/SKILL.md`
- `skills/ux-target-audience/SKILL.md`
- `skills/ux-storybrand/SKILL.md`
- `skills/ux-business-plan/SKILL.md`
- `skills/ux-assumptions/SKILL.md`
- `skills/ux-bias-audit/SKILL.md`
- `skills/ux-mvp-requirements/SKILL.md`
- `skills/ux-information-architecture/SKILL.md`
- `skills/ux-journey-mapping/SKILL.md`
- `skills/ux-behavior-mapping/SKILL.md`
- `skills/ux-competitor-analysis/SKILL.md`
- `skills/ux-user-interviews/SKILL.md`
- `skills/ux-story-panels/SKILL.md`
- `skills/ux-ethics-review/SKILL.md`
- `skills/ux-full-review/SKILL.md`
- `skills/ux-motivation-audit/SKILL.md`
- `skills/ux-communicating-decisions/SKILL.md`

Psych skills (12):
- `skills/psych-cognitive-biases/SKILL.md`
- `skills/psych-cognitive-load/SKILL.md`
- `skills/psych-decision-fundamentals/SKILL.md`
- `skills/psych-decision-persuasion/SKILL.md`
- `skills/psych-delight-design/SKILL.md`
- `skills/psych-emotional-retention/SKILL.md`
- `skills/psych-engagement-patterns/SKILL.md`
- `skills/psych-full-scan/SKILL.md`
- `skills/psych-habit-formation/SKILL.md`
- `skills/psych-pricing-psychology/SKILL.md`
- `skills/psych-simplification/SKILL.md`
- `skills/psych-social-influence/SKILL.md`
- `skills/psych-time-perception/SKILL.md`
- `skills/psych-visual-perception/SKILL.md`

UI skills (4):
- `skills/ui-aesthetic-review/SKILL.md`
- `skills/ui-accessibility/SKILL.md`
- `skills/ui-design-system/SKILL.md`
- `skills/ui-design-to-code-qa/SKILL.md`

Dev (1):
- `skills/dev-claude-md/SKILL.md`

Versions and docs:
- `.claude-plugin/plugin.json` — bump 4.1.4 → 4.2.0.
- `.claude-plugin/marketplace.json` — bump 4.1.4 → 4.2.0.
- `CHANGELOG.md` — `[4.2.0] – 2026-04-26` entry under Changed.
- `README.md` — bump banner.

**The citation block to append** (uniform across skills, after each skill's evaluation/pushback section):

```markdown
## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` — "<1-line quote of the passage that backs the judgment>"

The user is the designer; she's steering. Without the citation, she's working blindfolded. Cite every time, even when the source feels obvious to you — it's not obvious to her.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
```

The block mentions paths relative to the skill's directory so the user can navigate. The "no specific file" escape valve prevents the rule from forcing fake citations.

**Reuse**:
- Existing reference files (each skill's `references/` subfolder already has the framework definitions worth citing).
- Existing rule pattern in `meta-orchestrator/SKILL.md:27` — same intent, now applied per-skill.
- Existing markdown link conventions in skill files.

**Checklist**:
- [ ] Append the uniform citation block to each of the 35 SKILL.md files at the most natural insertion point (typically near the evaluation step or as a top-level section after step 0)
- [ ] Verify each skill still parses correctly (no broken markdown, no duplicate sections)
- [ ] Bump `.claude-plugin/plugin.json` 4.1.4 → 4.2.0
- [ ] Bump `.claude-plugin/marketplace.json` 4.1.4 → 4.2.0
- [ ] Add CHANGELOG `[4.2.0] – 2026-04-26` entry
- [ ] Bump README banner to v4.2.0
- [ ] Validate JSON manifests
- [ ] Spot-check 3 modified skills end-to-end (problem-statement, psych-full-scan, ui-aesthetic-review)

**QA**:
1. JSON manifests valid: `python3 -m json.tool`.
2. Grep verification: `grep -l "Source citation requirement" skills/` returns exactly the 35 files (one for each).
3. Spot-check `skills/ux-problem-statement/SKILL.md` — citation block present, well-positioned, references the right files.
4. Spot-check `skills/psych-full-scan/SKILL.md` — same.
5. Spot-check `skills/ui-aesthetic-review/SKILL.md` — same.
6. Manual smoke (deferred to user): run `/design-engineer:design` on a fresh project, hit a pushback moment, verify Claude cites a source file path + quote.

## Risk assessment

- **Risk**: 35 file edits introduce inconsistencies (typos, drift in placement). **Mitigation**: uniform block text, applied with the same Edit tool calls, plus post-edit grep verification (counts match expected 35).
- **Risk**: model treats the rule as advisory and skips citation under load. **Mitigation**: rule is explicit ("MUST cite", "every time, even when the source feels obvious"). If real-world testing shows drift, escalate to (a) global CLAUDE.md rule or (b) PostToolUse hook scanning AskUserQuestion text for evaluative claims without citation. Noted in CHANGELOG as v4.2.0+ follow-up option.
- **Risk**: forced citation produces fake citations when no real reference backs a judgment. **Mitigation**: the block includes an explicit escape valve — "If the source is a generic principle from your training... name the principle explicitly and acknowledge there is no plugin-internal reference." Forbids fabrication, allows honesty.
- **Risk**: SKILL.md files exceed 500-line cap from CLAUDE.md skill compliance rules. **Mitigation**: the block is ~150 words; current SKILL.md files are well under cap. Spot-check after edits with `wc -l`.
- **Risk**: insertion point varies per skill (some have step-by-step structure, some don't). **Mitigation**: insert as a top-level section near the end (before "Resource Files" / "References" appendix), so it's structurally consistent regardless of step layout.

## Verification (end-to-end)

After v4.2.0 lands:
1. JSON manifests valid; all read 4.2.0.
2. `grep -rln "Source citation requirement" skills/` returns 35 files.
3. CHANGELOG has the 4.2.0 entry with the citation pattern documented and the escape-valve clause noted.
4. README banner v4.2.0.
5. Manual smoke test (deferred to user): run a UX skill that judges input, verify Claude cites the source file + quote in the same response. If it doesn't, escalate to global CLAUDE.md rule or a hook in a follow-up.

## Questions for user

None — option B (per-skill) approved. 35 skills enumerated. Citation block locked. MINOR bump to v4.2.0. Ready to implement on approval.
