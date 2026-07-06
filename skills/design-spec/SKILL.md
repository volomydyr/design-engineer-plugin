---
name: design-spec
description: Authors per-screen design specs that bind UI to a project's existing tokens and components, so implementation reuses what already exists instead of reinventing it. Use as a premium planning step before building consequential UI – net-new components or primary and reused surfaces of a feature – after the design system and references exist.
model: sonnet
effort: medium
license: MIT
---

# Design Spec

## Why this matters

The classic AI-UI failure: the model reinvents components that already exist, ignores the project's tokens, designs to a generic 2010 default, and builds something other than what was agreed. A vague plan line ("design a beautiful blue button") gives the implementer nothing to bind to, so it improvises.

A design spec is the positive fix. It is a premium planning artifact: a structured, reference-only description of every screen's components, grounded in the project's real tokens and existing components, that the implementer builds verbatim. Spec authoring is where the thinking happens (high effort, premium planning); implementation against a good spec is lean execution. The spec is the "really good plan" that makes lean implementation work, and the constructive replacement for after-the-fact drift policing: prevent reinvention up front instead of catching it later.

## What a design spec is

One `.spec.md` file per screen or surface. Each file has:

- A short prose **intent** section: who the screen is for, what it must accomplish, how it should feel, and a pointer to the reference that grounds the intent.
- One fenced ` ```yaml ` block **per component** on the screen. Each block is **reference-only**: it names the existing component by file path, expresses every value as a token reference (never a raw value), and records states, variants, responsive behavior, accessibility, and EARS-style acceptance criteria.

The YAML carries the load-bearing spec; the prose carries the "why". The implementer and the design-system-auditor both parse the YAML blocks.

## Read these first (binding)

You cannot author a correct spec from memory. A spec that references a token or component that does not exist is worse than no spec. Before writing anything, Read these two files and bind only to names that appear in them:

1. **`.design-engineer-plugin/design/dev/design-system.md`** – the `ui-design-system` output. This is the source of truth for real token names, semantic aliases, and existing component names and file paths. Every value in your YAML must be a reference into this file (a token name, an alias, or a component path). If the file does not exist yet, stop and tell the user the design system has to be established first (via `ui-design-system`) – do not invent tokens.

2. **`.design-engineer-plugin/design/exploration/references/references.md`** – the `ui-references-moodboard` output. This is the source for design intent: the design feel, the bold aesthetic flavor, and the "from app X take quality Y" notes. The spec's `intent_reference` field points back into this file. If it does not exist, the intent section is thinner but the spec can still bind to the design system.

If either file is missing a name you need, ask the user via `AskUserQuestion` – never fill the gap silently and never coin a new token or component name.

## Graduated strictness (not a gate)

Specs are required for **consequential UI** and optional for trivia. This is deliberate: a blanket mandate would recreate the friction of the deny-hooks this layer replaces.

- **Required**: net-new components, and the primary or reused surfaces of a feature – anything where the cost of the implementer guessing wrong is high, or where the same component will be reused across screens.
- **Optional**: trivial one-off elements and small tweaks – a single label, a one-off spacing change, throwaway scaffolding.

The spec is never a blocking gate. The design-system-auditor verifies conformance **where a spec exists** and flags undocumented components as informational only – it does not fail unspecced trivia.

For an established or shipped project, specs are reuse-heavy: bind to existing tokens and components, define almost nothing new. For greenfield, the spec defines the new primitives the design system will hold.

## How to author a spec

Work one screen at a time. For each screen:

1. **Confirm the screen is in scope** for a spec (consequential UI, per the strictness rule above). If it is trivial, say so and skip – do not author a spec for trivia.

2. **Read the two binding inputs** (design-system.md, references.md) if you have not already this session.

3. **Write the intent section** in prose: who, what, feel, and the `intent_reference` pointer into references.md. Keep it short – a few sentences, not a PRD.

4. **List the components** on the screen. For each, decide: reuse an existing component (the common case for established projects) or define a net-new one (greenfield primitives). Prefer reuse – check design-system.md's component catalog before proposing anything new.

5. **Write one YAML block per component**, following the schema in [spec-format.md](./references/spec-format.md). Use the skeleton in [spec-template.md](./references/spec-template.md) as a starting point. Every value is a token reference; every reuse names the component's existing file path; every block carries states, variants, responsive, a11y, and EARS acceptance criteria.

6. **Self-check for dangling references** before saving: every token name, alias, and component path in the YAML must appear in design-system.md. If one does not, fix it or ask the user – do not save a spec with an invented name.

See [examples.md](./references/examples.md) for a worked button: the vague plan line it replaces, and the full spec-driven YAML grounded in tokens and an existing component.

## Where specs are saved

- **Feature-scoped** (the default): `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md`. One file per screen, under the feature it belongs to.
- **Standalone** (a surface not tied to a feature): `.design-engineer-plugin/design/specs/<surface-slug>.spec.md`.

Before writing, ensure the parent directory exists (`mkdir -p` the `screens/` or `specs/` directory). The plugin uses lazy folder scaffolding – the skill that needs a folder creates it.

Slugs are short, lowercase, kebab-case (e.g. `checkout`, `product-detail`, `settings-profile`).

## Who consumes the spec

- **`frontend-implementer`** reads the per-screen `.spec.md` files for the feature as a binding pre-read, pre-fills its component-audit reuse table from each spec's `reuse` blocks, and builds the component verbatim against the YAML.
- **`design-system-auditor`** runs a spec-conformance pass: where a `.spec.md` references a built component, it verifies the component matches the spec's YAML and acceptance criteria (FAIL on mismatch), and flags undocumented components as informational.

The spec slots into the implementer's existing component-audit and trace-to-source method and the auditor's existing passes – it does not add a parallel mechanism.

## Suggesting `/goal` (suggest and wait, never invoke)

When a spec exists for the screen about to be built, the spec's EARS acceptance criteria are a ready-made completion condition for Claude Code's built-in `/goal` command (it sets a completion condition and loops turns until the condition holds – its headline use is implementing a design doc until all acceptance criteria are met).

`/goal` is **user-invoked only**. The plugin SUGGESTS a ready-to-paste `/goal` and STOPS; it never tries to run `/goal` itself.

When a spec is ready and the build has a verifiable end state, compose a ready-to-paste `/goal` from the template in [goal-command.md](./references/goal-command.md): map the spec's acceptance criteria into the completion condition, add "verified via at least 3 Playwright iterations, zero hardcoded values, only reused components", present it to the user, and STOP. The user pastes it (or says "go" to proceed without it).

Gate on availability: `/goal` needs Claude Code v2.1.139+. If it is unavailable or the user declines, proceed normally – do not block on it.

## Content integrity

1. **No fabrication**: only bind to tokens, aliases, and components that appear in design-system.md, and intent that appears in references.md or was given by the user. Never invent a token value, a component, or an acceptance criterion. If you see a gap, ask via `AskUserQuestion`.
2. **Read before reference**: Read design-system.md and references.md before quoting from them. Do not quote from memory.

## Anti-slop writing

Before generating the prose intent or any spec text, Read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it.

## Resource files

- [spec-format.md](./references/spec-format.md) – the full YAML schema, every field explained
- [spec-template.md](./references/spec-template.md) – a copy-paste skeleton for a new `.spec.md` file
- [examples.md](./references/examples.md) – a worked button: vague plan line vs full spec-driven YAML, grounded in tokens and an existing component
- [goal-command.md](./references/goal-command.md) – a `/goal` template that maps spec acceptance criteria to a completion condition (user pastes it)
