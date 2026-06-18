# Spec format – the YAML schema

A `.spec.md` file is a short prose intent section followed by one fenced ` ```yaml ` block per component. This document defines every field of those blocks. The YAML carries the load-bearing spec; the prose carries the "why".

Two hard rules govern every field:

1. **Reference-only.** Every value is a reference into the project's design system, never a raw value. Write `color: color.surface.primary`, never `color: "#0A84FF"`. Write `padding: space.4`, never `padding: 16`. The reference must be a token name, semantic alias, or component path that appears in `.design-engineer-plugin/design/dev/design-system.md`.
2. **Reuse before define.** If the component already exists, the block names it by file path and describes how to reach its states through its own public API. A net-new component is defined only when the design system has no existing component for the job (greenfield primitives).

---

## File-level structure

```
<screen-slug>.spec.md
├── # <Screen name>            – H1, sentence case
├── prose intent section       – who / what / feel / intent_reference
└── one ```yaml block per component
```

The prose intent section is plain Markdown (see the template). The structured spec lives entirely in the per-component YAML blocks.

---

## Per-component YAML block

Each block describes one component instance on the screen. Top-level keys:

| Key | Required | Purpose |
|---|---|---|
| `component` | yes | The component's name in sentence-or-Pascal form as it appears in the design system catalog (e.g. `Button`, `Product card`). |
| `disposition` | yes | `reuse` or `define`. `reuse` binds to an existing component; `define` introduces a net-new one. |
| `source` | yes when `reuse` | The existing component's file path, copied from design-system.md's component catalog (e.g. `src/components/atoms/Button.tsx`). Omit for `define`. |
| `intent` | yes | One line: what this component does on this screen and why it is here. |
| `props` | when applicable | The public props/attributes/modifiers used to configure the instance. Values are token references or enum values the component already accepts. |
| `tokens` | yes | The token references the component binds to on this screen: color, spacing, typography, radius, elevation, motion. Reference-only. |
| `states` | yes | Each interactive state and what changes in it, expressed as token references. |
| `variants` | when applicable | Named variants of the component and when each is used. |
| `responsive` | yes | Behavior per breakpoint. |
| `a11y` | yes | Accessibility requirements: roles, labels, focus, contrast, target size. |
| `acceptance` | yes | EARS-style acceptance criteria – the verifiable conditions the build must satisfy. These become the `/goal` completion condition. |

### `disposition: reuse` vs `define`

- **`reuse`** – the common case for established and shipped projects. `source` names the existing file. `props` and `states` describe how to reach the needed configuration through the component's own API; if a needed state is not reachable via the API, that is a component bug to fix at the component, not a new value invented in the spec.
- **`define`** – greenfield primitives only. There is no `source` yet; the block defines the new component's full surface so the implementer builds it once and registers it in the design system.

### `tokens`

A map of design properties to token references. Use only names that appear in design-system.md. Group by property:

```yaml
tokens:
  color:
    background: color.action.primary          # semantic alias from design-system.md
    text: color.text.on-action
  spacing:
    padding-x: space.4
    padding-y: space.2
  typography: type.label.medium
  radius: radius.md
  elevation: elevation.none
  motion:
    press: motion.press.fast
```

Every leaf value is a reference. If design-system.md has no token for a property the component needs, stop and ask the user – do not coin one.

### `states`

Each interactive state names only what changes from the base, as token references:

```yaml
states:
  default: {}                                  # base tokens above
  hover:
    color.background: color.action.primary-hover
  pressed:
    color.background: color.action.primary-pressed
  disabled:
    color.background: color.action.disabled
    color.text: color.text.disabled
  focus-visible:
    outline: focus.ring
```

Cover every state the component actually has on this screen. Do not list states the component cannot enter here.

### `variants`

When the component has named variants, list each with the condition that selects it:

```yaml
variants:
  primary: used for the screen's single primary action
  secondary: used for cancel / back
  destructive: used only on the delete confirmation
```

### `responsive`

Behavior per breakpoint, using the project's breakpoint names from design-system.md:

```yaml
responsive:
  mobile: full-width; min target height target.min
  tablet: hug content; inline with sibling
  desktop: hug content; right-aligned in the action row
```

### `a11y`

The accessibility contract for this component on this screen:

```yaml
a11y:
  role: button
  label: derived from visible text; icon-only variant needs aria-label
  focus: visible focus ring via focus.ring; reachable in DOM order
  contrast: text on background meets WCAG AA (>=4.5:1)
  target: minimum tap target target.min on touch breakpoints
```

### `acceptance` (EARS)

EARS = Easy Approach to Requirements Syntax. Each criterion is one verifiable line in one of these shapes:

- **Ubiquitous**: `The <component> SHALL <requirement>.`
- **Event-driven**: `WHEN <trigger>, the <component> SHALL <response>.`
- **State-driven**: `WHILE <state>, the <component> SHALL <requirement>.`
- **Conditional**: `IF <condition>, THEN the <component> SHALL <response>.`

```yaml
acceptance:
  - The button SHALL use only color.action.* tokens; no raw color value appears.
  - The button SHALL reuse src/components/atoms/Button.tsx; no new button component is created.
  - WHEN the user hovers, the button SHALL apply color.action.primary-hover.
  - WHILE disabled, the button SHALL be non-interactive and SHALL use color.action.disabled.
  - IF the viewport is mobile, THEN the button SHALL span full width with target height target.min.
```

These criteria are what the design-system-auditor verifies and what the `/goal` completion condition is built from. Write them so each is independently checkable in the running UI.

---

## Field discipline summary

- Reference-only values, always. A raw hex, px, or rem in a spec is a bug.
- `reuse` over `define`; name the real file path for every reuse.
- Every block carries `tokens`, `states`, `responsive`, `a11y`, and `acceptance`.
- Bind only to names in design-system.md; point intent at references.md.
- No invented tokens, components, or criteria – ask the user when a name is missing.
