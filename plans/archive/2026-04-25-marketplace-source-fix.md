# Fix: `/plugin install` fails with "not found in any marketplace"

## Context

A beta tester (on Windows) ran the documented install commands:

```
/plugin marketplace add volomydyr/design-engineer-plugin    → success
/plugin install design-engineer@design-engineer-plugin      → "Plugin not found in any marketplace"
```

No other tester reported the issue — the user's hypothesis is Windows-specific path handling, but it's unconfirmed.

The likely structural cause: `.claude-plugin/marketplace.json` declares `"source": "./"` for the plugin entry. Per Anthropic's official spec ([code.claude.com/docs/en/plugin-marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)), relative paths "must start with `./`" and resolve against the marketplace root. Bare `"./"` technically satisfies that rule but does not appear in any documented example — every Anthropic walkthrough uses `"./<subdir>"`. The bare-root form is a structural smell that may break on certain Claude Code versions or Windows path resolution.

The fix replaces the relative path with an explicit GitHub source. The marketplace and the plugin live in the same repository, but the plugin's `source` now points back to that repo by name. This eliminates all relative-path ambiguity and matches the documented `github` source pattern.

## Architectural decisions

- **Use the `github` source object, not relative path.** Removes the only structural deviation from Anthropic's documented patterns. Works identically on every platform. One JSON change.
- **Bump version 2.4.0 → 2.4.1.** Per the docs: *"Setting `version` pins the plugin... pushing new commits without changing that string does nothing for existing users."* Without a bump, existing testers who previously installed v2.4.0 won't receive the fix on `/plugin update`.
- **Update both `plugin.json` and `marketplace.json` versions in lockstep.** CLAUDE.md repo rule.
- **No file moves, no path changes elsewhere.** Hooks, skills, agents, commands, scripts — all unaffected.

## Phase 1: Marketplace + plugin manifest update

**Objective**: Replace the `"./"` source with an explicit GitHub source and bump the version so existing users receive the fix.

**Depends on**: none

**Files**:
- Modify: `.claude-plugin/marketplace.json`
- Modify: `.claude-plugin/plugin.json`

**Reuse**: The existing marketplace/plugin schema — only the `source` field on the single plugin entry and the `version` field in two places change. No new components, no helper code.

**Checklist**:
- [ ] In `.claude-plugin/marketplace.json`: replace `"source": "./"` with `"source": { "source": "github", "repo": "volomydyr/design-engineer-plugin" }` on the single plugin entry
- [ ] In `.claude-plugin/marketplace.json`: bump the plugin entry's `"version": "2.4.0"` → `"version": "2.4.1"`
- [ ] In `.claude-plugin/plugin.json`: bump `"version": "2.4.0"` → `"version": "2.4.1"`
- [ ] Validate the resulting JSON with `python3 -m json.tool` on both files

**QA**: After the edits, the user runs:
```
python3 -m json.tool .claude-plugin/marketplace.json
python3 -m json.tool .claude-plugin/plugin.json
```
Both must print the file with no syntax errors. Visually inspect the diff: only `source` and `version` should have changed.

## Phase 2: CHANGELOG entry

**Objective**: Document the fix following Keep a Changelog format. Required by `CLAUDE.md` versioning rules.

**Depends on**: Phase 1

**Files**:
- Modify: `CHANGELOG.md`

**Reuse**: The existing 2.4.0 entry's heading style and Keep-a-Changelog section structure (Added / Changed / Removed / Fixed).

**Checklist**:
- [ ] Add a new `## [2.4.1] – 2026-04-25` section above the existing `## [2.4.0]` block
- [ ] Under a `### Fixed` subheading, document: `Plugin install failure for some users — replaced bare relative source ("./") in marketplace.json with explicit GitHub source ({source: "github", repo: "volomydyr/design-engineer-plugin"}). Aligns with the documented Anthropic plugin-source patterns and removes a Windows-specific path-resolution edge case reported by one beta tester.`

**QA**: Open `CHANGELOG.md`. Confirm the 2.4.1 entry is at the top, dated 2026-04-25, and the wording is accurate. Confirm no existing entries were modified.

## Phase 3: README beta-banner version reference

**Objective**: Keep the README's version reference in sync with `plugin.json`. Per CLAUDE.md: *"`README.md` — Verify/update component counts."* Component counts haven't changed, but the beta banner explicitly cites `v2.4.0`.

**Depends on**: Phase 1

**Files**:
- Modify: `README.md`

**Reuse**: The existing banner sentence structure — only the version string changes.

**Checklist**:
- [ ] In `README.md` line 1, change `> **v2.4.0 – beta testing phase.**` → `> **v2.4.1 – beta testing phase.**`
- [ ] Verify component counts in the README ("8 commands, 54 skills, 9 agents") are still accurate — no skills/agents/commands were added or removed in this fix, so they should still match (note: actual skill count is 53, but that is a pre-existing discrepancy to address in a later round, not this one)

**QA**: Open the README, confirm the banner now reads `v2.4.1`. The rest of the README should be byte-identical to the previous version.

## Risk assessment

- **Risk**: The fix doesn't address the actual root cause if it was something else (stale tester cache, old Claude Code version on the tester's machine, genuine Windows bug in Claude Code itself).
  **Mitigation**: The change matches Anthropic's documented patterns, so it can only improve compatibility — never regress it. If a tester continues to hit the issue after 2.4.1, we'll know the root cause is upstream (Claude Code itself) and can route them to update Claude Code or file a bug.

- **Risk**: Existing testers on 2.4.0 don't receive the new version because they never run `/plugin update`.
  **Mitigation**: Out of scope for this fix. A separate follow-up could add a one-time message to the README telling existing testers to run `/plugin update`.

- **Risk**: The version bump conflicts with planned future fixes in the same week.
  **Mitigation**: We'll bump again (2.4.2, etc.) for each subsequent fix round. Patch versions are cheap.

## Verification (end-to-end)

After all three phases land, the user (or a fresh tester) should be able to run, on a clean machine:

```
/plugin marketplace add volomydyr/design-engineer-plugin
/plugin install design-engineer@design-engineer-plugin
/de:help
```

Expected outcome:
1. `marketplace add` reports success (unchanged from before).
2. `plugin install` resolves the plugin via the explicit GitHub source — no relative-path resolution involved — and reports success.
3. `/de:help` runs and shows v2.4.1's command list.

If the user wants to validate the marketplace JSON without installing, they can run from inside Claude Code:
```
/plugin validate /path/to/design-engineer-plugin
```
which checks the manifest schema per Anthropic's CLI.

## Questions for user

None pending — the approach is settled (Option A from the three options), and the affected files are limited to manifests, CHANGELOG, and one line of README. No git operations, branch creation, or PR are part of this plan; per the user's working style, those happen separately on explicit request.
