# Phase 4: Behavioral Verification on Fixtures

**Date**: 2026-04-26  
**Scope**: Verify plugin behavior on test fixtures  
**Status**: In progress  
**Fixtures**: 5 types (empty, greenfield, python, ios, existing-heavy)

## Test Fixtures

Located at `audit/2026-04-26-comprehensive/fixtures/`:

1. **fixture-empty**: Minimal project (`.gitkeep` only)
2. **fixture-greenfield**: JavaScript/React project (package.json, src/App.tsx)
3. **fixture-python**: Python Django project (settings.py, models.py, templates/)
4. **fixture-ios**: Swift/iOS project (Foundation/Tokens/Colors.swift)
5. **fixture-existing-heavy**: Established React project (30+ components, BRAND.md, STYLE-GUIDE.md, tokens.css)

## Verification Plan

### Stage 1: Project Detection
Verify detect-environment.sh correctly identifies:
- [ ] fixture-empty: "new" project, no tech stack
- [ ] fixture-greenfield: JavaScript/Node.js + React
- [ ] fixture-python: Python project (pyproject.toml or requirements.txt)
- [ ] fixture-ios: iOS/Swift/SwiftUI
- [ ] fixture-existing-heavy: Established JavaScript + design system found

**Finding to verify**: F-0103 (path mismatch in detection)
- Run detect-environment.sh on each fixture
- Verify it correctly checks design/ folder (not documents/design/)
- Expected: Should report deliverables correctly

### Stage 2: Project State Injection
Verify project.context keys are written and read correctly:
- [ ] SessionStart hook writes 9 keys (shipped_ui, existing_design_system, etc.)
- [ ] Keys are used by at least one skill
- [ ] No orphaned keys

**Finding to verify**: F-0015 (project.context coverage)
- Run on fixture-empty: Should detect shipped_ui=false
- Run on fixture-existing-heavy: Should detect shipped_ui=true, existing_design_system found
- Verify consistency with meta-setup detection logic

### Stage 3: Path Resolution
Verify path conventions are consistent:
- [ ] detect-environment.sh checks correct path
- [ ] de-design-grounding-hook.js uses correct path
- [ ] Project scaffolding creates correct structure

**Findings to verify**: F-0008, F-0041, F-0103
- Trace through detect-environment.sh output
- Check hook attempts to read from correct paths
- Verify init-project-structure.sh creates design/ (not documents/design/)

### Stage 4: Hook Registration
Verify hooks are registered and fire correctly:
- [ ] SessionStart hook fires without errors
- [ ] UserPromptSubmit hook fires on every prompt
- [ ] PreToolUse hook blocks/allows writes correctly
- [ ] Stop hook executes without crashing

**Finding to verify**: F-0010 (BLOCKER - sound hooks)
- Check if Stop/Notification hooks are registered
- Verify ${CLAUDE_PLUGIN_ROOT} resolution works in hook
- Verify sound notifications actually play (or mute flag works)

### Stage 5: Skill Invocation Control
Verify disable-model-invocation behavior:
- [ ] Skills with disable-model-invocation: true are NOT auto-invoked
- [ ] Skills without field default to false (auto-invoked)
- [ ] Advisor agent can still run skills listed in preload

**Findings to verify**: F-0003, F-0004, F-0012, F-0013
- Check advisor.md frontmatter
- Check dev-component-gallery frontmatter
- Trace Claude's auto-invocation logic

## Test Execution Matrix

| Fixture | detect-environment | project.context | Path resolution | Hook registration | Invocation control |
|---------|-------------------|-----------------|-----------------|-------------------|-------------------|
| empty | ✓/? | ? | ? | ? | ? |
| greenfield | ✓/? | ? | ? | ? | ? |
| python | ✓/? | ? | ? | ? | ? |
| ios | ✓/? | ? | ? | ? | ? |
| existing-heavy | ✓/? | ? | ? | ? | ? |

## Critical Path Verification

1. **HIGHEST PRIORITY**: F-0010 (BLOCKER)
   - Does the plugin crash or fail silently when trying to register sound hooks?
   - Can ~/.claude/settings.json be reliably written with ${CLAUDE_PLUGIN_ROOT}?
   - Do sound notifications work after installation?

2. **HIGH PRIORITY**: Path consistency (F-0008, F-0041, F-0103)
   - Does detect-environment.sh report deliverables correctly?
   - Does design-grounding hook find prototype.html in the right location?

3. **MEDIUM PRIORITY**: Skill invocation (F-0003, F-0004, F-0012, F-0013)
   - Are all skills marked with disable-model-invocation?
   - Do untagged skills auto-invoke correctly?

## Expected Outcomes

- **PASS**: All behaviors match Anthropic docs and plugin CLAUDE.md
- **PARTIAL**: Some behaviors work but have inconsistencies
- **FAIL**: Critical behaviors broken (e.g., F-0010 hooks)

## Next Steps

Results from Phase 4 will inform Phase 5 (process/coverage audit) and Phase 6 (synthesis).

---

*Status: Awaiting fixture setup and test execution*
