# meta-compound Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 7: Bare /de:compound command | 7/7 (100%) | 1/7 (14%) | +86% |
| Eval 8: Document a decision | 7/7 (100%) | 3/7 (43%) | +57% |
| Eval 9: Status check | 8/8 (100%) | 0/8 (0%) | +100% |
| **Overall** | **22/22 (100%)** | **4/22 (18%)** | **+82%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 41,733 | 16,167 | +158% |
| Mean duration (s) | 168.1 | 83.0 | +102% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Trigger detection** — Recognizes bare `/de:compound` command and auto-detects decision/completion triggers from natural language
2. **Schema-validated YAML frontmatter** — Validates all documentation entries against compound-schema.yaml with correct enum values for phase, deliverable_type, component, status, and severity
3. **Structured directory placement** — Creates files in `project-docs/solutions/[category]/` using the schema's category_mapping (research/, strategy/, design/, development/, evaluation/, meta/)
4. **Status file management** — Creates and maintains `status.md` with append-only updates to Completed Phases, Key Decisions Log, Deliverables Produced, Open Questions, and Next Steps
5. **Cross-referencing** — Searches existing documentation entries for related content and adds bidirectional cross-reference links
6. **Decision menu** — Presents a structured 5-option post-documentation menu (Continue, View, Link, Update deliverable, Other)
7. **Pipeline-aware status display** — Reads status.md and presents structured overview with Phase 1-7 progress tracking, all without modifying files

### What baseline does instead:
- Eval 7: Does not recognize `/de:compound` as a command. Creates informal markdown at project root with no frontmatter, no schema validation, no status tracking
- Eval 8: Can write a reasonable decision document with rationale, but no YAML frontmatter, wrong file location, no status.md update, no cross-references, no "What Did Not Work" section
- Eval 9: Cannot find or read status.md. Inspects generic project files (package.json) for vague status estimate. Offers to create a document (violating read-only requirement)

### Analyst Notes:
- The skill's value is strongest for Eval 9 (status check) where baseline scores 0/8 -- it has no concept of structured status tracking
- Eval 8 (document decision) shows the narrowest gap because baseline Claude can write informal decision documents reasonably well (3/7 pass)
- Eval 7 (bare command) shows strong differentiation: the skill follows the full 6-step process while baseline produces an ad-hoc markdown file
- The "What Did Not Work" documentation pattern is particularly valuable -- it prevents AI from repeating failed approaches in future sessions
- Token cost is ~2.6x higher for with-skill, justified by schema-validated structured output that enables automated cross-referencing and long-term project tracking
- All 22 assertions discriminate clearly between skill and baseline behavior
