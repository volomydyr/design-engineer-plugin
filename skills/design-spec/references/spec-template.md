# Spec template – copy-paste skeleton

Copy the block below into a new `<screen-slug>.spec.md`, then replace every `<...>` placeholder. Add one ` ```yaml ` block per component on the screen. Delete this header before saving.

Save to `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md` (feature-scoped) or `.design-engineer-plugin/design/specs/<surface-slug>.spec.md` (standalone). Bind every value to a name in `design-system.md`; point `intent_reference` at `references.md`.

---

```markdown
# <Screen name>

## Intent

**Who**: <the actual person opening this screen, where they are, what's on their mind>
**What**: <the verb they must accomplish here>
**Feel**: <the design feel + bold aesthetic flavor, from references.md>
**Intent reference**: `.design-engineer-plugin/design/exploration/references/references.md` § <section> – <the "from app X take quality Y" note this screen leans on>

## Components

```yaml
component: <Component name as it appears in the design system catalog>
disposition: reuse            # reuse | define
source: <path/to/Component.ext>   # required when reuse; copied from design-system.md
intent: <what this component does on this screen and why>
props:
  <prop>: <token reference or enum value the component accepts>
tokens:
  color:
    <role>: <color token / alias>
  spacing:
    <role>: <space token>
  typography: <type token>
  radius: <radius token>
  elevation: <elevation token>
  motion:
    <role>: <motion token>
states:
  default: {}
  hover:
    <property>: <token reference>
  pressed:
    <property>: <token reference>
  disabled:
    <property>: <token reference>
  focus-visible:
    outline: <focus token>
variants:
  <variant>: <when this variant is used>
responsive:
  mobile: <behavior>
  tablet: <behavior>
  desktop: <behavior>
a11y:
  role: <aria role>
  label: <how the accessible name is derived>
  focus: <focus behavior, focus token>
  contrast: <contrast requirement>
  target: <minimum target size token>
acceptance:
  - The <component> SHALL <requirement>.
  - WHEN <trigger>, the <component> SHALL <response>.
  - WHILE <state>, the <component> SHALL <requirement>.
  - IF <condition>, THEN the <component> SHALL <response>.
```

<!-- repeat one yaml block per component on this screen -->
```
