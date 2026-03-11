# Design Engineer Plugin Development

## Versioning Requirements

Every change to this plugin MUST include updates to all three files:

1. **`.claude-plugin/plugin.json`** - Bump version using semver
2. **`CHANGELOG.md`** - Document changes using Keep a Changelog format
3. **`README.md`** - Verify/update component counts

### Version Bumping Rules

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, major reorganization
- **MINOR** (1.0.0 → 1.1.0): New skills, agents, or commands
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, doc updates, minor improvements

## Directory Structure

```
plugins/design-engineer/
├── .claude-plugin/plugin.json
├── .mcp.json
├── CLAUDE.md
├── README.md
├── CHANGELOG.md
├── hooks/
│   ├── hooks.json
│   ├── check_deliverable_deps.py
│   └── session_dep_summary.py
├── agents/                         # 9 specialized agents
├── commands/
│   └── de/                         # 7 commands (de: namespace)
└── skills/                         # 49 hidden skills
```

## Skill Compliance Checklist

When adding or modifying skills:

### YAML Frontmatter (Required)

- [ ] `name:` present and matches directory name
- [ ] `description:` present, describes what it does AND when to use it
- [ ] `disable-model-invocation: true` present on ALL skills

### Content Rules (Non-Negotiable)

- [ ] ALL content from source files only – never generic internet knowledge
- [ ] English only – no Ukrainian names or translated names
- [ ] Each skill covers exactly ONE activity
- [ ] Prescribes exact workflows from the author's experience
- [ ] Guides thinking process, not just outputs deliverables
- [ ] Enforces User > Docs > AI decision hierarchy
- [ ] Reference files contain FULL ADAPTED content, not summaries
- [ ] Sources merged silently – no attribution like "from the book"

### Structural Rules

- [ ] SKILL.md under 500 lines – detailed content in references/
- [ ] All reference files linked with proper markdown: `[file.md](./references/file.md)`
- [ ] No placeholder text (TODO, TBD, [fill in])
- [ ] AskUserQuestion with numbered-list fallback for cross-platform compatibility
- [ ] AskUserQuestion previews used when presenting visual or architectural options (layout comparisons, spacing scales, design directions, IA structures)

### Pre-Commit Checklist

- [ ] Version bumped in `.claude-plugin/plugin.json`
- [ ] CHANGELOG.md updated
- [ ] README.md component counts verified
- [ ] All JSON files valid (`python3 -m json.tool`)

## Command Naming Convention

Commands use `de:` prefix (short for design-engineer) to avoid conflicts with Claude Code's built-in `/review` and `/plan`:

- `/de:setup` - One-time plugin configuration
- `/de:design` - Full design workflow orchestrator
- `/de:research` - UX research activities
- `/de:psych` - Psychology audit and deep-dives
- `/de:dev` - Development pipeline
- `/de:review` - Multi-layer design review
- `/de:compound` - Knowledge documentation

## Living Documents

Deliverables created by this plugin are living documents tracked via `.dependencies.yaml`. When an upstream deliverable changes, downstream documents may need review. The hook scripts in `hooks/` implement this tracking automatically.

## Context Monitoring

When running long design sessions (multi-skill, multi-phase), monitor conversation length. If you estimate context usage is approaching 90% (typically after 20+ tool calls in a single session or when the conversation has been running for an extended period with many skill invocations):

1. Gently suggest compacting: "This session has covered a lot of ground. Context is getting heavy – it might be a good time to compact. Would you like me to suggest a compact message?"

2. If the user agrees, generate a compact message that preserves:
   - Current project name and state
   - Which command is running and in which mode
   - Current phase and skill position
   - Key decisions made this session (from the decisions log or conversation)
   - Deliverables completed and any stale dependents
   - What to do next
   - Any unresolved questions or blockers

3. Format the compact message as a single paragraph optimized for the `/compact` command: "Keep full context of [project] at [path]. Current state: v[X], running /de:[command] in [mode] mode. Phase [N] ([name]): completed [skills], next is [skill]. Key decisions: [list]. Deliverables updated: [list]. Stale dependents: [list]. Next step: [action]. [Any blockers or open questions]."

Important:
- Do NOT warn earlier than ~90% – premature warnings are distracting
- This is a SUGGESTION, not a requirement – never tell the user they must compact
- If the user dismisses the suggestion, do not bring it up again in the same session
