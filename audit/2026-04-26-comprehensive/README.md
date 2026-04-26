# Audit — design-engineer plugin v4.7.0

**Date**: 2026-04-26
**Status**: complete (all 6 phases executed)
**Findings**: 108 total — 2 BLOCKER, 55 HIGH, 38 MEDIUM, 13 LOW

## Read this first

1. **[LEDGER.md](LEDGER.md)** — synthesized findings ledger. Top of file: 2 BLOCKERs + top-20 HIGH + recommended remediation order. Read this if you have 5 minutes.
2. **[99-ledger.json](99-ledger.json)** — same findings, machine-readable. Use for scripted triage / sorting / filtering.

## Read for depth

| Artifact | Purpose |
|---|---|
| [00-facts.md](00-facts.md) | Frozen baseline — counts, version snapshot, MCP patterns, plugin's `hooks/hooks.json` registrations, what was confirmed in Phase 0 |
| [01-key-usage-matrix.md](01-key-usage-matrix.md) | `project.context.*` keys + skill/agent frontmatter keys + canonical Anthropic schema cross-check |
| [02-reference-graph.md](02-reference-graph.md) | Skill→skill, command→skill/agent, agent→tool, hook→event maps + dead-end candidates |
| [02b-mcp-tool-catalog.md](02b-mcp-tool-catalog.md) | Catalog of every MCP tool reference — namespace drift, missing dependencies (figma-console MCP) |
| [04-static-A-meta-skills.md](04-static-A-meta-skills.md) | Surface A audit (6 meta-* skills) |
| [05-static-B-dev-skills.md](05-static-B-dev-skills.md) | Surface B audit (8 dev-* skills) |
| [06-static-C-ui-skills.md](06-static-C-ui-skills.md) | Surface C audit (9 ui-* skills) |
| [07-static-D-discovery-skills.md](07-static-D-discovery-skills.md) | Surface D audit (ux-* + psych-* skills, 31 skills) |
| [04-static-G-agents.md](04-static-G-agents.md) | Surface G audit (10 agents) |
| [04-static-H-commands.md](04-static-H-commands.md) | Surface H audit (9 commands) |
| [04-static-J-scripts.md](04-static-J-scripts.md) | Surface J audit (3 shell scripts) — fixture-traced |
| [07-phase3-anthropic-docs-crosscheck.md](07-phase3-anthropic-docs-crosscheck.md) | Plugin conventions vs canonical Anthropic docs |
| [08-phase4-behavioral-verification.md](08-phase4-behavioral-verification.md) | Fixture-based behavioral verification |
| [09-phase5-process-coverage-audit.md](09-phase5-process-coverage-audit.md) | Git-forensics + eval-coverage + UX walkthrough |
| [10-FINAL-LEDGER.md](10-FINAL-LEDGER.md) | Earlier interim synthesis — superseded by `LEDGER.md`; retained for reference |
| [canonical-docs/](canonical-docs/) | Anthropic docs fetched at audit time (hooks, agents, plugins-reference) |
| [fixtures/](fixtures/) | 5 fixture repos for behavioral verification (empty, greenfield, existing-heavy, ios, python) |

## What this audit found that surprised me

1. **Two BLOCKERs concentrated in onboarding** — sound notifications haven't worked since v4.1.0 (F-0010), and the deliverable-detection check is permanently false on every fresh setup (F-0291) because `documents/design/` was renamed to `design/` but only one of two checks was updated.
2. **The plugin self-violates its own most-strictly-enforced output rule** (CLAUDE.md rule #1: em dashes forbidden). ~120 occurrences across 90% of files.
3. **The figma support is real but undocumented**: the plugin advertises `figma` as a bundled MCP, but the actual ui-figma-* skills require a SEPARATE third-party `figma-console` MCP. Author has it installed locally; everyone else is broken.
4. **Drift concentrates at version seams**: v4.5 (advisor), v4.6 (gallery), v4.7 (skip-check, audit branch, feature-spec) are the highest-debt zones. Incremental shipping leaves rot at the joints.

## What this audit did NOT do

- No fixes applied. Audit is observation only.
- No live execution of evals against a model.
- No Windows/Linux behavioral testing.
- No deep WCAG 2.2 audit of generated UI.
- See `What I did NOT audit` section in [LEDGER.md](LEDGER.md) for the complete coverage gaps list.

## Reproducing the BLOCKERs

Every finding in `99-ledger.json` has a `repro` field. To reproduce both BLOCKERs:

```bash
# F-0291: confirm the BLOCKER folder-convention bug
bash skills/meta-setup/scripts/init-project-structure.sh /tmp/scaffold-test
ls /tmp/scaffold-test/design/  # shows craft/, foundation/, planning/, reviews/, features/
ls /tmp/scaffold-test/documents/design/ 2>/dev/null  # does NOT exist
grep -n 'documents/design' skills/meta-setup/scripts/detect-environment.sh  # 3 hits — the bug

# F-0010: confirm sound hook never resolves
grep -n 'de-play-sound\|de-complete' hooks/hooks.json  # NO matches — not registered
grep -n 'de-play-sound' skills/meta-setup/SKILL.md  # 3 hits including the broken settings.json install path
```

## Next step

User triages [LEDGER.md](LEDGER.md), approves a remediation plan, and a follow-up implementation pass executes the fixes in the recommended order (BLOCKERs first; em-dash sweep + skip-check normalization in v4.8.0). This audit pass produced no code changes.
