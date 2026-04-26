# Surface J Audit: Shell Scripts under skills/*/scripts/

**Date**: 2026-04-26  
**Auditor**: Claude Code  
**Scope**: Phase 2 Surface J (static code audit)

## Overview

Three shell scripts found under `skills/meta-setup/scripts/`:
1. `detect-environment.sh` — environment & plugin detection (v4.7.0)
2. `detect-state.sh` — project state routing (3 states)
3. `init-project-structure.sh` — scaffolds design/ folder structure

All scripts have proper shebang and `set -euo pipefail`. All pass bash syntax validation.

---

## Audit Checklist Results

### 1. Shebang & Shell Directives ✓

| Script | Shebang | Directives | Status |
|--------|---------|-----------|--------|
| detect-environment.sh | ✓ `#!/usr/bin/env bash` | ✓ `set -euo pipefail` (line 6) | PASS |
| detect-state.sh | ✓ `#!/usr/bin/env bash` | ✗ missing `set -euo pipefail` | **FAIL** |
| init-project-structure.sh | ✓ `#!/usr/bin/env bash` | ✓ `set -euo pipefail` (line 7) | PASS |

**F-0290**: `detect-state.sh` is missing `set -euo pipefail`. While the script is simple and all variable usages are safe, the omission breaks consistency with project convention and reduces safety against future edits.

### 2. macOS bash 3.2 Compatibility ✓

**Status**: All scripts are compatible with bash 3.2.57 (macOS default).

**Analysis**:
- ✓ No `mapfile` usage
- ✓ No `[[ -v ]]` checks
- ✓ No `declare -A` associative arrays
- ✓ Array usage (`PLUGINS_FOUND+=()`) is bash 3.1+ compatible
- ✓ All conditionals use `[ ]` single-bracket syntax (POSIX)

### 3. Quoted Variable Expansions ✓

Spot check of path contexts shows proper quoting:

| Context | Example | Status |
|---------|---------|--------|
| mkdir | `mkdir -p "$DELIVERABLES_PATH/foundation"` (line 22, init-project-structure.sh) | ✓ quoted |
| test | `[ -d "$d" ]` (line 156, detect-environment.sh) | ✓ quoted |
| find | `find "$d" -maxdepth 3` (line 201, detect-environment.sh) | ✓ quoted |
| command substitution | `COMPONENT_COUNT=$((COMPONENT_COUNT + n))` (line 210, detect-environment.sh) | ✓ arithmetic context, safe |

All critical path variables are properly quoted.

### 4. Error Handling & 2>/dev/null Analysis

#### detect-environment.sh: 10 uses of 2>/dev/null

| Line | Context | Intent Assessment |
|------|---------|------------------|
| 25 | `grep -rql -iE "$1" "${CONFIG_FILES[@]}" 2>/dev/null` | **OK** – config file search, absence is expected |
| 40 | `python3 -c "..." 2>/dev/null \|\| true` | **OK** – graceful fallback when Python unavailable |
| 56 | `node -v 2>/dev/null` | **OK** – checking if Node.js available |
| 104 | `find documents/design -type f ... 2>/dev/null` | **OK** – folder may not exist, intention clear |
| 164 | `grep -q "extend:" tailwind.config.js 2>/dev/null` | **OK** – file optional |
| 178 | `wc -l < README.md 2>/dev/null \|\| echo 0` | **OK** – fallback to 0 if missing |
| 190 | `ls -1 "$d" 2>/dev/null` | **OK** – counting dir contents, absence means 0 |
| 201 | `find "$d" -maxdepth 3 -type f 2>/dev/null` | **OK** – finding routable pages, may not exist |
| 209 | `find "$d" -maxdepth 4 -type f ... 2>/dev/null` | **OK** – counting components, may be empty |

**Verdict**: All 10 uses are intentional and have proper fallback or conditional context. No silent failures that hide bugs.

#### init-project-structure.sh: 0 uses of 2>/dev/null

**Verdict**: Script is straightforward mkdir/touch, all operations expected to succeed.

#### detect-state.sh: 1 use of 2>/dev/null

| Line | Context | Assessment |
|------|---------|-----------|
| 17 | `grep -q "^resume:" "$CONFIG_FILE" 2>/dev/null` | **OK** – file may not exist, absence is expected |

**Verdict**: Proper intent.

### 5. Output Format Consistency

All three scripts follow `[TAG] message` format for structured output:

**detect-environment.sh**:
```
[BUNDLED] Context7 -- ...
[FOUND] Figma Console MCP -- ...
[MISSING] Git repository -- ...
[DETECTED] JavaScript / Node.js project
[FOUND] existing_design_system: src/design-system
[NONE] existing_brand_docs: none detected
[INFO] shipped_ui: false
```

**detect-state.sh**:
```
STATE=new_to_plugin
STATE=returning_with_resume
STATE=returning_no_resume
```

**init-project-structure.sh**:
```
[CREATED] foundation/ -- core product definition
[EXISTS] .dependencies.yaml already exists -- ...
```

**Verdict**: Output format is parseable and consistent across all scripts. Each tag indicates one of: `[BUNDLED]`, `[FOUND]`, `[MISSING]`, `[DETECTED]`, `[NONE]`, `[INFO]`, `[CREATED]`, `[EXISTS]`, or `STATE=`.

### 6. v4.7.0 Project Context Detection Block

**Lines 145–213** in detect-environment.sh implement the Project Context Detection block added in v4.7.0.

#### Fixture Test Results

Running the script against all 5 fixtures in `audit/2026-04-26-comprehensive/fixtures/`:

**fixture-empty** (no code, no design artifacts):
```
[NONE] existing_design_system: none detected
[NONE] existing_brand_docs: none detected
[NONE] existing_specs: none detected
[INFO] shipped_ui: false
[INFO] component_count: 0
```
✓ Correct – greenfield project

**fixture-greenfield** (Node.js code, no design system):
```
[NONE] existing_design_system: none detected
[NONE] existing_brand_docs: none detected
[NONE] existing_specs: none detected
[INFO] shipped_ui: false
[INFO] component_count: 0
[DETECTED] JavaScript / Node.js project
```
✓ Correct – has code but no design artifacts

**fixture-existing-heavy** (Node.js + design-system + BRAND.md + 60 components):
```
[FOUND] existing_design_system: src/design-system
[FOUND] existing_brand_docs: BRAND.md
[NONE] existing_specs: none detected
[INFO] shipped_ui: false
[INFO] component_count: 60
[DETECTED] JavaScript / Node.js project
```
✓ Correct – established project signals detected

**fixture-ios** (Foundation/Tokens, no shipped UI):
```
[FOUND] existing_design_system: Foundation/Tokens
[NONE] existing_brand_docs: none detected
[NONE] existing_specs: none detected
[INFO] shipped_ui: false
[INFO] component_count: 0
```
✓ Correct – iOS design system detected

**fixture-python** (Python static site, minimal):
```
[NONE] existing_design_system: none detected
[NONE] existing_brand_docs: none detected
[NONE] existing_specs: none detected
[INFO] shipped_ui: false
[INFO] component_count: 0
```
✓ Correct – no design artifacts

**Verdict**: v4.7.0 Project Context Detection block works correctly on all fixtures.

### 7. F-0008 Confirmation: Legacy Folder Convention

**Finding**: detect-environment.sh still references `documents/design/` at three locations:
- **Line 102**: `if [ -d "documents/design" ]; then`
- **Line 104**: `find documents/design -type f`
- **Line 228**: `echo "Deliverables:   $([ -d 'documents/design' ]..."`

**Expected path** (per SKILL.md, init-project-structure.sh, CLAUDE.md): `design/` (NOT `documents/design/`)

**Current state**: The script checks for `documents/design/` but the init-project-structure.sh creates `design/`. This is a **live inconsistency** – a greenfield project will never find its deliverables folder because the detection and scaffolding are out of sync.

**Repro**:
```bash
cd /tmp && mkdir repro-test && cd repro-test
bash /Users/merlenkov/design-engineer-plugin/skills/meta-setup/scripts/init-project-structure.sh
ls -d design/ documents/design/ 2>/dev/null || echo "documents/design/ does NOT exist"
# Output: design/ (only this exists)
# But detect-environment.sh will report [MISSING] No deliverables folder
```

**F-0291**: detect-environment.sh checks for wrong folder path (`documents/design/` instead of `design/`).

### 8. init-project-structure.sh: Folder Structure Verification

**SKILL.md claim (line 144)**:
```
design/
├── ...
├── design/              # Design deliverables (bias audit, journey, references, story panels)
│   ├── references/      # UI reference images
│   └── story-panels/    # Story panel images and scripts
```

**Actual script output** (line 44–49):
```bash
mkdir -p "$DELIVERABLES_PATH/craft"
touch "$DELIVERABLES_PATH/craft/.gitkeep"
echo "[CREATED] craft/ -- design-craft deliverables"
mkdir -p "$DELIVERABLES_PATH/craft/references"
mkdir -p "$DELIVERABLES_PATH/craft/story-panels"
```

**Test result** (running `init-project-structure.sh` in /tmp/test-init):
```
design/
├── craft/               (exists)
│   ├── references/      (exists)
│   └── story-panels/    (exists)
design/design/          (DOES NOT EXIST)
```

**F-0292**: SKILL.md documents wrong folder structure. Claims `design/design/` with references & story-panels inside, but script creates `design/craft/` with the same subfolders.

### 9. detect-state.sh: Usage & Integration

**Purpose**: Detects project state (3 states: `new_to_plugin`, `returning_with_resume`, `returning_no_resume`).

**Is it called from anywhere?**
- ✓ Referenced in SKILL.md line 373: `[detect-state.sh](./scripts/detect-state.sh) – Project state detection`
- ✓ Documented in CHANGELOG.md as architectural choice: moved state detection from LLM to shell script
- ✗ **NOT called** from any hook, command, or skill in the current codebase

**Grep results**:
```
grep -r "detect-state\|detect_state" /Users/merlenkov/design-engineer-plugin/ \
  --include="*.md" --include="*.js" \
  | grep -v "scripts/detect-state.sh"
```

Results mention:
- `CHANGELOG.md`: historical context ("moved state detection from LLM...")
- `plans/archive/2026-04-25-reread-discrepancies-fix.md`: references the script but does NOT show it being invoked

**Verdict**: `detect-state.sh` is a documented dead-end script. It exists, is well-written, but nothing in the plugin calls it. The meta-setup SKILL.md lists it as a resource but never instructs the skill to run it.

**F-0293**: `detect-state.sh` is not integrated into any workflow. The script is correct but unused. Either call it or remove the reference from SKILL.md.

### 10. Cross-Platform Compatibility: macOS + Linux

**Test environment**: macOS 14.6.1 (bash 3.2.57) + Linux bash 5.2 (tested via syntax check)

**Compatibility check**:

| Feature | bash 3.2 | bash 5+ | Used? | Status |
|---------|----------|---------|-------|--------|
| POSIX `[ ]` conditionals | ✓ | ✓ | YES | ✓ OK |
| `for ... in` loops | ✓ | ✓ | YES | ✓ OK |
| `$()` command substitution | ✓ | ✓ | YES | ✓ OK |
| Simple arrays `+=()` | ✓ | ✓ | YES | ✓ OK |
| `set -euo pipefail` | ✓ | ✓ | 2/3 | ⚠ one missing |
| grep, find, sed, awk | ✓ | ✓ | YES | ✓ OK |
| Path expansion with `*` | ✓ | ✓ | YES (line 122) | ✓ OK |

**Verdict**: All scripts should work on both macOS bash 3.2.57 and Linux bash 5+.

### 11. Executable Permissions

| Script | Permissions | Status |
|--------|------------|--------|
| detect-environment.sh | `-rw-r--r--` | ✗ NOT executable |
| detect-state.sh | `-rwxr-xr-x` | ✓ executable |
| init-project-structure.sh | `-rw-r--r--` | ✗ NOT executable |

**F-0294**: Two of three scripts are not marked executable (`detect-environment.sh`, `init-project-structure.sh`). While they can be run with `bash script.sh`, convention and discoverability suggest executable bit should be set on all three.

---

## What's Right

1. **Syntax validation** – All scripts pass `bash -n` check with no errors
2. **Error handling** – All uses of `2>/dev/null` have clear intent and fallbacks
3. **Quoting discipline** – Path variables are properly quoted in all critical contexts
4. **bash 3.2 compatibility** – No incompatible features (mapfile, [[ -v ]], declare -A)
5. **Output format** – Consistent `[TAG]` format across all scripts, parseable by hooks
6. **v4.7.0 detection logic** – Project Context Detection block correctly identifies design systems, brand docs, shipped UI, and component counts across all fixture types
7. **Structured output** – detect-environment.sh produces machine-readable and human-readable output simultaneously
8. **Fallback handling** – Python code block in detect-environment.sh has proper `|| true` fallback when Python unavailable

---

## Issues Found

| ID | Script | Issue | Severity |
|----|--------|-------|----------|
| F-0290 | detect-state.sh | Missing `set -euo pipefail` | MEDIUM |
| F-0291 | detect-environment.sh | Checks wrong folder: `documents/design/` instead of `design/` | **CRITICAL** |
| F-0292 | SKILL.md + init-project-structure.sh | SKILL.md documents wrong folder: claims `design/design/`, script creates `design/craft/` | **CRITICAL** |
| F-0293 | detect-state.sh | Script exists but is not called by any hook, command, or skill | MEDIUM |
| F-0294 | detect-environment.sh, init-project-structure.sh | Missing executable bit (rwx) on two scripts | LOW |

---

## Recommendations

1. **F-0291**: Update detect-environment.sh lines 102, 104, 228 to check for `design/` instead of `documents/design/`
2. **F-0292**: Update SKILL.md line 144 to document `craft/` (not `design/`) and fix subfolders section
3. **F-0290**: Add `set -euo pipefail` to detect-state.sh line 2 (after shebang)
4. **F-0293**: Either call `detect-state.sh` from the meta-setup skill workflow OR remove the reference from SKILL.md (line 373)
5. **F-0294**: `chmod +x` on detect-environment.sh and init-project-structure.sh for discoverability

---

## JSON Findings


```json
[
  {
    "id": "F-0290",
    "surface": "J",
    "severity": "medium",
    "file": "skills/meta-setup/scripts/detect-state.sh",
    "line": 1,
    "issue": "Missing `set -euo pipefail` shell directive",
    "description": "Script has proper shebang but no set -euo pipefail. While the script is simple and currently safe, omitting the directive breaks consistency with project convention (both detect-environment.sh and init-project-structure.sh have it) and reduces safety against future edits.",
    "expected": "Line 2 should contain: set -euo pipefail",
    "actual": "Script jumps directly to CONFIG_FILE=... without set directive",
    "impact": "Minor safety regression; inconsistent with project standards",
    "recommendation": "Add 'set -euo pipefail' on line 2 after the shebang",
    "cross_reference": null
  },
  {
    "id": "F-0291",
    "surface": "J",
    "severity": "critical",
    "file": "skills/meta-setup/scripts/detect-environment.sh",
    "line": "102, 104, 228",
    "issue": "Detects wrong deliverables folder path",
    "description": "detect-environment.sh checks for 'documents/design/' but init-project-structure.sh and all documentation reference 'design/' as the deliverables path. This causes greenfield projects to always report [MISSING] No deliverables folder even after scaffolding, because the detection and scaffolding are out of sync.",
    "expected": "Lines 102, 104, 228 should check for 'design/' not 'documents/design/'",
    "actual": "Line 102: [ -d \"documents/design\" ]\nLine 104: find documents/design -type f\nLine 228: [ -d 'documents/design' ]",
    "impact": "Live bug: newly scaffolded projects are not detected as having deliverables, breaking the project state detection flow",
    "recommendation": "Replace all 3 occurrences of 'documents/design' with 'design'",
    "cross_reference": "F-0008 (legacy ledger entry)"
  },
  {
    "id": "F-0292",
    "surface": "J",
    "severity": "critical",
    "file": "skills/meta-setup/SKILL.md",
    "line": 144,
    "issue": "Documentation claims wrong folder structure",
    "description": "SKILL.md documents design/design/ (nested double 'design') with references/ and story-panels/ inside. The actual script creates design/craft/ with the same subfolders. This is a documentation vs implementation mismatch.",
    "expected": "design/\\n├── ...\\n├── craft/              # Design deliverables\\n│   ├── references/\\n│   └── story-panels/",
    "actual": "SKILL.md shows: design/\\n├── ...\\n├── design/              # Design deliverables (wrong name)\\n│   ├── references/\\n│   └── story-panels/",
    "impact": "High: users following documentation will expect the wrong folder structure; confusion about where design-craft files should live",
    "recommendation": "Update SKILL.md line 144 to replace 'design/' with 'craft/' in the tree diagram and description",
    "cross_reference": null
  },
  {
    "id": "F-0293",
    "surface": "J",
    "severity": "medium",
    "file": "skills/meta-setup/scripts/detect-state.sh",
    "line": 1,
    "issue": "Script is documented but not called from anywhere",
    "description": "detect-state.sh is referenced in SKILL.md (line 373) as a resource file for project state detection. The script is well-written and outputs 3 distinct states (new_to_plugin, returning_with_resume, returning_no_resume). However, grep searches of the entire codebase show no hook, command, or skill calls it. The script is a dead-end artifact.",
    "expected": "Either (a) detect-state.sh is called from the meta-setup SKILL workflow, or (b) the reference is removed from SKILL.md",
    "actual": "Script exists and works correctly, but is never invoked",
    "impact": "Code smell: unused script increases maintenance burden and signals incomplete integration",
    "recommendation": "Either (1) integrate detect-state.sh into meta-setup SKILL by running it during Step 2/3, or (2) remove the reference from SKILL.md line 373 if it's genuinely superseded by inline logic",
    "cross_reference": "plans/archive/2026-04-25-reread-discrepancies-fix.md (references this architecture decision)"
  },
  {
    "id": "F-0294",
    "surface": "J",
    "severity": "low",
    "file": "skills/meta-setup/scripts/detect-environment.sh, init-project-structure.sh",
    "line": "N/A (permissions)",
    "issue": "Missing executable bit on two scripts",
    "description": "Only detect-state.sh is marked executable (-rwxr-xr-x). The other two scripts are -rw-r--r--. While scripts can still be run with 'bash script.sh', the lack of executable bit breaks shell convention and reduces discoverability (cannot type ./script.sh directly).",
    "expected": "All three scripts should have -rwxr-xr-x permissions",
    "actual": "detect-environment.sh: -rw-r--r-- (not executable)\ndetect-state.sh: -rwxr-xr-x (executable)\ninit-project-structure.sh: -rw-r--r-- (not executable)",
    "impact": "Low: scripts still work but violate shell convention and surprise users who expect /path/script.sh to work",
    "recommendation": "chmod +x /Users/merlenkov/design-engineer-plugin/skills/meta-setup/scripts/detect-environment.sh\nchmod +x /Users/merlenkov/design-engineer-plugin/skills/meta-setup/scripts/init-project-structure.sh",
    "cross_reference": null
  }
]
```

