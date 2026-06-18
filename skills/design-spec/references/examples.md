# Examples – the button, vague vs spec-driven

This shows why a spec earns its keep. The same component, described two ways: the vague plan line that leaves the implementer guessing, and the spec-driven YAML that binds it to the project's real tokens and existing component.

All token names, aliases, and the component path below are illustrative of what a real `design-system.md` would hold. In a real spec, every one of them must appear in that project's `design-system.md` – never invent them.

---

## The vague plan line (what a spec replaces)

> Design a beautiful blue primary button for the checkout screen. Make it modern and accessible.

What the implementer has to guess: which blue (a token or a raw hex?), whether a button component already exists or a new one should be built, the padding, the type style, the radius, every interactive state, the responsive behavior, and what "accessible" concretely requires. The likely outcome is a brand-new `CheckoutButton` with hardcoded styles that drifts from the design system – the exact failure the spec exists to prevent.

---

## The spec-driven version

### Intent (prose)

**Who**: a shopper on the checkout screen, card in hand, deciding whether to commit.
**What**: confirm and place the order.
**Feel**: calm and trustworthy, per the "luxury / refined" flavor.
**Intent reference**: `.design-engineer-plugin/design/exploration/references/references.md` § primary actions – "from Linear take the quiet, confident single-primary-action pattern".

### Component (YAML)

```yaml
component: Button
disposition: reuse
source: src/components/atoms/Button.tsx
intent: the single primary action on checkout – places the order
props:
  variant: primary
  size: large
tokens:
  color:
    background: color.action.primary
    text: color.text.on-action
  spacing:
    padding-x: space.5
    padding-y: space.3
  typography: type.label.large
  radius: radius.md
  elevation: elevation.none
  motion:
    press: motion.press.fast
states:
  default: {}
  hover:
    color.background: color.action.primary-hover
  pressed:
    color.background: color.action.primary-pressed
  disabled:
    color.background: color.action.disabled
    color.text: color.text.disabled
  focus-visible:
    outline: focus.ring
variants:
  primary: the one primary action on the screen – placing the order
  secondary: not used here; back / edit lives in the secondary slot
responsive:
  mobile: full-width; min target height target.min; pinned above the keyboard
  tablet: hug content; right-aligned in the action row
  desktop: hug content; right-aligned in the action row
a11y:
  role: button
  label: derived from the visible text "Place order"
  focus: visible focus ring via focus.ring; reachable in DOM order
  contrast: text on background meets WCAG AA (>=4.5:1)
  target: minimum tap target target.min on touch breakpoints
acceptance:
  - The button SHALL reuse src/components/atoms/Button.tsx; no new button component is created.
  - The button SHALL use only color.action.* and type.label.* tokens; no raw color or size value appears.
  - WHEN the user hovers, the button SHALL apply color.action.primary-hover.
  - WHEN the user presses, the button SHALL apply color.action.primary-pressed.
  - WHILE the order is submitting, the button SHALL be disabled and SHALL use color.action.disabled.
  - IF the viewport is mobile, THEN the button SHALL span full width with target height target.min.
  - The button SHALL show a visible focus ring (focus.ring) when focused via keyboard.
```

---

## What changed

| Dimension | Vague line | Spec-driven |
|---|---|---|
| Component | unspecified – likely a new one | `reuse` of `src/components/atoms/Button.tsx` |
| Color | "blue" | `color.action.primary` alias + hover/pressed/disabled tokens |
| Sizing | unspecified | `space.*` and `type.label.large` references |
| States | unspecified | default, hover, pressed, disabled, focus-visible – each a token reference |
| Responsive | unspecified | per-breakpoint behavior |
| Accessibility | "accessible" | role, label, focus, contrast, target – all concrete |
| Verification | none | EARS acceptance criteria, checkable in the running UI and reusable as a `/goal` condition |

The implementer now builds exactly what was agreed, reuses the existing component, and emits zero hardcoded values. The design-system-auditor checks the built button against the `acceptance` block. Nothing was left to improvisation.
