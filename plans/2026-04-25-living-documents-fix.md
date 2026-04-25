# H1 fix: Living-documents subsystem — static graph + agent memory layer (v2.6.0)

## Context

Round B audit surfaced 3 critical findings. **H1**: the dependency-tracking subsystem is dead — nothing in the plugin ever writes `status: complete` or `last_updated` to `dependencies.yaml`. The phase indicator we removed in v2.5.0 was a symptom; the disease is broader. `check_deliverable_deps.py`, `session_dep_summary.py`'s "deliverables updated this session" summary, and the 90-day staleness check are all functionally dead. Meanwhile the README FAQ #15 ("Living documents") promises this works.

After grounding in Anthropic docs:
- **PostToolUse hooks writing to project YAML files is undocumented/unsupported.** No examples in the docs. Risks: race conditions, FileChanged-loop hazards.
- **`${CLAUDE_PLUGIN_DATA}`** is the wrong primitive — it's plugin-global state at `~/.claude/plugins/data/{id}/`, not per-project.
- **Agent `memory:` frontmatter is the documented persistence primitive.** `memory: project` writes to `.claude/agent-memory/<agent-name>/` (project-local, version-controllable).
- The plugin already has `compound-documenter` agent described as "maintain living context files… preserve institutional knowledge" — that's literally the use case.

User chose **Option C (max value, max work)**: keep `dependencies.yaml` as a **static reference document** (no runtime mutation — it shows users which deliverables inform which downstream ones, useful as a reading guide) AND **add an agent-memory layer** for actual progress tracking via the documented `memory: project` mechanism on `compound-documenter`.

This separates two concerns the plugin currently confuses:
- **Static dependency graph** (which deliverables relate to which) → `.design-engineer-plugin/dependencies.yaml` (no runtime mutation, just read-only documentation of the graph).
- **Live progress** (what's been completed, what was decided, what's stale) → `.claude/agent-memory/compound-documenter/` (agent memory, written by the documented Anthropic mechanism).

Bumping 2.5.1 → **2.6.0 (MINOR)** — adds new agent memory mechanism and significantly changes living-documents semantics. Per CLAUDE.md: MINOR for new skills/agents/commands or significant behavior changes.

## Architectural decisions

- **Strip the runtime tracking fields from `dependencies-default.yaml`.** Remove `status:` and `last_updated:` from every entry — they were dead-on-arrival. Keep `depends_on`, `informs`, `folder`, `phase`, `skill`. The file becomes a static dependency-relationship document.
- **Refactor `check_deliverable_deps.py`** to print only the static "X informs Y" relationship (no "updated this session" — that claim was always false). Drop the staleness check (relied on `last_updated` which was never set). Keep the file/skill so users still get a "Heads up: X informs Y, Z" reminder on edits.
- **Refactor `session_dep_summary.py`** to remove the recency check. The Stop hook still runs but no longer claims "deliverables updated this session" since it has no reliable signal. Keep its memory-reminder output for cross-session continuity.
- **Add `memory: project` frontmatter to `compound-documenter`** — this enables the documented agent-memory persistence at `.claude/agent-memory/compound-documenter/`. The agent's instructions get expanded to write specific structured files there: `pipeline-state.md`, `key-decisions.md`, `stale-dependents.md`.
- **Rewrite the agent's instructions** to use the agent-memory directory for state writes instead of vaguely "the status file at status.md or somewhere". Specific path, specific schema, specific update triggers.
- **Update `meta-document/SKILL.md` and `commands/de/document.md`** to invoke `compound-documenter` on phase completion and document state changes — the agent does the actual write to its memory.
- **Update `meta-orchestrator/SKILL.md`** to read from the agent-memory directory at session start (instead of the dead `project-state.md`).
- **Update README FAQ #15** to honestly describe both layers: static dependency graph (visible to user, edit-tracked manually) + agent-memory progress (auto-updated by compound-documenter on phase completions).
- **Don't migrate existing user data.** This is a v2.6.0 install — fresh setups get the new behavior. Users who upgrade can just have `compound-documenter` run once on their next phase completion and it'll seed the memory dir.

## Phase 1: Strip runtime tracking from `dependencies.yaml`

**Objective**: Convert the file from "dynamic state" to "static reference graph." Remove fields that were never written.

**Depends on**: none

**Files**:
- Modify: `skills/meta-setup/assets/dependencies-default.yaml` — remove `status:` and `last_updated:` from every deliverable entry
- Modify: `hooks/check_deliverable_deps.py` — remove the staleness check (`check_staleness` function), simplify the output to "Updated 'X'. Downstream dependents that may need review: …" without false "this session" claims
- Modify: `hooks/session_dep_summary.py` — remove the `is_recent`/`last_updated` recency logic and the `updated` filtering. Keep the basic structure: print phase, key decisions reminder, memory reminder. Stop pretending it knows what was updated this session.
- Modify: `hooks/de-postcompact-hook.sh` — remove the `grep "status: complete"` count (always 0, meaningless)

**Reuse**: existing parser scaffolds; just delete code paths.

**Checklist**:
- [ ] Run a sed/awk to remove `    status: not_started` and `    last_updated: null` lines from `dependencies-default.yaml` (every deliverable). Verify YAML still parses.
- [ ] Update `check_deliverable_deps.py` to drop `check_staleness()` and the staleness print line. Keep the basenames-match downstream-dependents logic (it works regardless of last_updated).
- [ ] Update `session_dep_summary.py`: remove `is_recent`, `derive_resume_state` (it's based on `updated`), and `write_resume_state`'s update detection. Keep memory reminder + a simple "use /de:document to capture this session's progress" prompt.
- [ ] Update `de-postcompact-hook.sh`: drop the COMPLETED count, drop the "Deliverables completed: N" line.
- [ ] Validate hooks still execute cleanly with empty/missing inputs (smoke test).

**QA**:
```bash
python3 -c "import yaml; yaml.safe_load(open('skills/meta-setup/assets/dependencies-default.yaml'))" && echo "yaml: valid"
echo '{}' | python3 hooks/check_deliverable_deps.py && echo "check_deps: clean"
python3 hooks/session_dep_summary.py 2>&1 | head -10
bash -n hooks/de-postcompact-hook.sh && echo "postcompact: syntax OK"
grep -c "status:" skills/meta-setup/assets/dependencies-default.yaml   # should be 0
grep -c "last_updated:" skills/meta-setup/assets/dependencies-default.yaml   # should be 0
```

## Phase 2: Wire `compound-documenter` to use `memory: project`

**Objective**: Move state tracking to the documented Anthropic primitive. The agent gets a project-local memory directory and writes structured files to it.

**Depends on**: Phase 1

**Files**:
- Modify: `agents/compound-documenter.md` — add `memory: project` to frontmatter; rewrite the body to specify exact files to write in the agent-memory directory (`pipeline-state.md`, `key-decisions.md`, `stale-dependents.md`)
- Reference (no edit needed): the agent-memory directory will live at `.claude/agent-memory/compound-documenter/` per Anthropic docs

**Reuse**: the existing structure of compound-documenter's "Status File Structure" section — repurpose those sections to be the schema for the new memory files.

**Memory file schemas to define in the agent prompt**:

```markdown
# .claude/agent-memory/compound-documenter/pipeline-state.md
- Last updated: YYYY-MM-DD
- Current phase: [Phase N — Name]
- Last completed skill: [skill-name]
- Next skill: [skill-name]
- Mode: [guided / autopilot]
- Recent deliverables (last 5):
  - YYYY-MM-DD — [deliverable-name] — [skill] — [path]
```

```markdown
# .claude/agent-memory/compound-documenter/key-decisions.md
Decisions that affect 2+ downstream deliverables. Append-only.

- YYYY-MM-DD — [decision] — [why] — [affects: X, Y, Z]
```

```markdown
# .claude/agent-memory/compound-documenter/stale-dependents.md
Auto-tracked when an upstream deliverable is updated. The agent reads dependencies.yaml's static graph, then computes which downstream deliverables haven't been refreshed since the upstream change.

- [downstream-deliverable] — last refreshed YYYY-MM-DD — upstream [X] updated YYYY-MM-DD
```

**Checklist**:
- [ ] Add `memory: project` to `agents/compound-documenter.md` frontmatter
- [ ] Replace the "Status File Structure" section with three sub-sections matching the schemas above
- [ ] Rewrite the "Update Process" section to target the three memory files instead of one ambiguous status.md
- [ ] Add explicit "Read pipeline-state.md first to load prior state" instruction at the top of the agent body
- [ ] Document where the memory dir lives (`.claude/agent-memory/compound-documenter/` per Anthropic) so users understand it's project-local and version-controllable
- [ ] Remove or update references to `status.md` (the old fictional file)

**QA**: Open `agents/compound-documenter.md`. Confirm:
1. Frontmatter has `memory: project`.
2. Body specifies three memory files and their schemas.
3. No remaining references to `status.md` at project root (the old confused convention).

## Phase 3: Update meta-document, meta-orchestrator, /de:document to invoke the new flow

**Objective**: Skills and commands now route state writes through compound-documenter (which uses agent memory).

**Depends on**: Phase 2

**Files**:
- Modify: `skills/meta-document/SKILL.md` — update Step 5 ("Update Project Status File") to invoke `compound-documenter` rather than directly write `status.md`. Drop the `status.md` references; replace with "compound-documenter writes to its memory directory."
- Modify: `skills/meta-orchestrator/SKILL.md` — update the "Step 0: Check Memory and Resume State" to read `.claude/agent-memory/compound-documenter/pipeline-state.md` instead of the never-written `documents/design/project-state.md`. Drop project-state.md references.
- Modify: `commands/de/document.md` — confirm it invokes meta-document which now invokes compound-documenter.

**Reuse**: existing invocation patterns (`Use the Agent tool to spawn it with…`).

**Checklist**:
- [ ] `meta-document/SKILL.md` Step 5 rewritten to invoke compound-documenter instead of directly writing status.md
- [ ] `meta-document/SKILL.md` references to status.md replaced with "compound-documenter memory dir" or removed
- [ ] `meta-orchestrator/SKILL.md` Step 0 reads pipeline-state.md from agent memory (not project-state.md)
- [ ] `meta-orchestrator/SKILL.md` references to project-state.md removed (it's the dead H2 issue — partially folded in here)
- [ ] `commands/de/document.md` verified to flow through the new path

**QA**:
```bash
grep -rnE "status\.md|project-state\.md" skills/ commands/ agents/ 2>&1 | grep -v "\.claude/agent-memory" | head
# should return zero project-root status.md or {deliverables_path}/project-state.md mentions
```

## Phase 4: Update README FAQ #15 + relevant FAQs

**Objective**: Honestly describe both layers. No more "Living documents" promise that the plugin can't keep.

**Depends on**: Phases 1–3

**Files**:
- Modify: `README.md` FAQ #15 — rewrite to describe two layers: static dependency graph (read-only docs at `.design-engineer-plugin/dependencies.yaml`) + agent-memory progress (`.claude/agent-memory/compound-documenter/` — auto-updated by the compound-documenter agent on phase completions)
- Modify: `README.md` FAQ #14 ("Does it remember things across sessions?") — update to point at agent memory, not the dead "Pipeline state in dependencies.yaml" claim

**Reuse**: the existing FAQ structure and tone.

**Checklist**:
- [ ] Rewrite FAQ #15 to describe the two-layer system honestly
- [ ] Update FAQ #14 to reflect the new agent-memory-based persistence
- [ ] Confirm README headline section (line 1, "Major update…") is still accurate

**QA**: Read the rewritten FAQs. Confirm:
1. They describe what actually works.
2. No more claims about "the plugin flags downstream dependents when upstream changes" — that's the user's job after reviewing the static graph.
3. Cross-session continuity language points at the agent memory.

## Phase 5: Versioning + CHANGELOG + README banner

**Objective**: Bump 2.5.1 → 2.6.0. Document changes.

**Depends on**: Phases 1–4

**Files**:
- Modify: `.claude-plugin/plugin.json` — version 2.5.1 → 2.6.0
- Modify: `.claude-plugin/marketplace.json` — version 2.5.1 → 2.6.0
- Modify: `CHANGELOG.md` — add 2.6.0 entry
- Modify: `README.md` — banner v2.5.1 → v2.6.0

**CHANGELOG content** (Keep a Changelog format):

```markdown
## [2.6.0] – 2026-04-25

Major fix to the "living documents" subsystem from Round B critical-bug audit. The dependency tracking system was dead since launch — nothing wrote `status: complete` or `last_updated` to `dependencies.yaml`, so the entire feature was advertised but non-functional. Re-architected around the documented Anthropic primitive (agent `memory: project`).

### Added
- **Agent-memory progress tracking** — `compound-documenter` agent gains `memory: project` frontmatter, writing structured state to `.claude/agent-memory/compound-documenter/`: `pipeline-state.md` (current phase, last completed skill, recent deliverables), `key-decisions.md` (cross-cutting decisions affecting 2+ deliverables), `stale-dependents.md` (downstream deliverables not refreshed since upstream change). Uses Anthropic's documented agent-memory mechanism.

### Changed
- **`dependencies.yaml` is now a static reference graph.** Removed `status:` and `last_updated:` fields from every entry — they were never written. The file documents which deliverables inform which downstream ones; runtime progress is now in agent memory.
- **`check_deliverable_deps.py`** simplified to print only the static "Updated X. Downstream dependents that may need review: …" relationship. Removed the dead staleness check.
- **`session_dep_summary.py`** simplified — removed the false "deliverables updated this session" claim (it relied on `last_updated` which was never set). Keeps memory-reminder output.
- **`de-postcompact-hook.sh`** removed the dead "Deliverables completed: N" count.
- **`compound-documenter` agent** rewritten to write to its agent-memory directory using the documented schema, instead of an ambiguous `status.md`.
- **`meta-orchestrator`** now reads pipeline state from the agent-memory directory (not the never-written `project-state.md`).
- **README FAQs #14 + #15** rewritten to honestly describe both layers (static graph + agent memory). No more "the plugin flags downstream dependents" promise — that's the user's review after reading the static graph.

### Removed
- Dead `status:` / `last_updated:` fields from `dependencies-default.yaml` seed.
- `status.md` references from `meta-document` and `compound-documenter` (the file was conceptually muddled — split into three specific memory files).
- `project-state.md` references from `meta-orchestrator` (file was never created or written).
- 90-day staleness detection (relied on `last_updated`, dead).
```

**Checklist**:
- [ ] Bump versions in plugin.json and marketplace.json
- [ ] Add 2.6.0 CHANGELOG entry above 2.5.1
- [ ] Bump README banner v2.5.1 → v2.6.0
- [ ] Validate JSON manifests

## Risk assessment

- **Risk**: Existing v2.x users have `dependencies.yaml` files with `status:` / `last_updated:` fields. Removing those from the seed doesn't break them — extra fields in the user's local copy are harmless YAML keys. New installs get the cleaner format.
- **Risk**: The `memory: project` frontmatter requires Claude Code's agent memory system, which may not be enabled in all Claude Code versions.
  **Mitigation**: It's a documented stable feature per the docs we fetched. If a user's Claude Code version doesn't support it, the agent simply won't have memory — degrades gracefully. Fail-soft.
- **Risk**: Removing `project-state.md` references could break a user who built their workflow around it.
  **Mitigation**: The file was never created by the plugin's init script, so no real user has data there. Pure stale references.

## Verification (end-to-end)

After v2.6.0 lands:
1. `python3 -c "import yaml; yaml.safe_load(open('skills/meta-setup/assets/dependencies-default.yaml'))"` succeeds.
2. `grep -c "status:" skills/meta-setup/assets/dependencies-default.yaml` returns 0.
3. New project installs with `init-project-structure.sh` → `dependencies.yaml` is created without `status:` / `last_updated:` fields.
4. After a phase completes and meta-document is invoked, `.claude/agent-memory/compound-documenter/pipeline-state.md` is updated by the agent (verifiable by checking the file mtime + content after a `/de:document` run).
5. A new session reads pipeline-state.md to recover prior state — meta-orchestrator's Step 0 finds the agent memory and uses it.

## Questions for user

None pending. Architecture is settled (Option C from the v3 H1 options). H2, H3, M1, M2, L1, L2 are deferred to subsequent rounds — H1 is large enough to ship as 2.6.0 alone, then we tackle the rest.
