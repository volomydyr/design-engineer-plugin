# Pipeline State Schema (deprecated → see compound-documenter)

> **Deprecated as of v2.6.0.** Pipeline state is no longer tracked in a project-root or `design-docs/` markdown file. It now lives in the `compound-documenter` agent's project-local memory at `.claude/agent-memory/compound-documenter/` – Anthropic's documented persistence primitive (`memory: project` frontmatter on the agent).

## Why this changed

The old `design-docs/project-state.md` file was advertised but never actually created or written by the plugin's init script. The "auto-update" claim was advisory – it depended on the model remembering to write the file, which was unreliable. v2.6.0 migrated to Anthropic's documented agent-memory mechanism, which Claude Code wires up structurally rather than by prose instruction.

## Where pipeline state lives now

`.claude/agent-memory/compound-documenter/` contains three structured files maintained by the agent:

- **`pipeline-state.md`** – current phase, last completed skill, next skill, mode, project type, recent deliverables (last 5), open questions. Overwritten on each invocation.
- **`key-decisions.md`** – append-only log of cross-cutting decisions affecting 2+ downstream deliverables. Older entries are valuable context – never delete.
- **`stale-dependents.md`** – downstream deliverables that may need refreshing because an upstream changed. Recomputed on each invocation by reading the static graph at `.design-engineer-plugin/dependencies.yaml`.

For the full schema of each file, see the `compound-documenter` agent definition at `agents/compound-documenter.md`.

## How meta-orchestrator uses it

At session start (Step 0 of meta-orchestrator), the orchestrator reads `.claude/agent-memory/compound-documenter/pipeline-state.md` if it exists. The file tells the orchestrator the current phase, last completed skill, and next skill – enough to resume where the previous session ended.

If the file does not exist (first run for a new project), the orchestrator continues with normal startup and, after the first phase completes, invokes compound-documenter to seed the file.

## How to update it

You don't update these files by hand. Invoke `compound-documenter` via the Agent tool whenever a phase completes or a cross-cutting decision is made. The agent reads its existing memory, gathers context from the parent conversation, and writes the appropriate updates. The `meta-document` skill handles this automatically; users can also trigger it manually via `/product:document`.

## Static dependency graph (separate concern)

The static graph at `.design-engineer-plugin/dependencies.yaml` documents which deliverables inform which downstream ones. It is read-only documentation – the plugin does not mutate it. Use it as a reference when deciding which downstream deliverables to revisit after an upstream change. The compound-documenter agent reads it to compute `stale-dependents.md`.
