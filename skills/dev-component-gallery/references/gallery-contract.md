# Gallery Contract – universal text + per-language adaptation

This is the canonical contract that lives at the top of every component gallery file scaffolded by `dev-component-gallery`. The text is identical regardless of stack – only the comment syntax changes.

## Canonical contract text

```
GALLERY CONTRACT – DO NOT VIOLATE

- Every component below MUST be imported (or used) from its production source.
  Never copy-paste, restub, or inline a component. If you can't import it,
  the gallery is broken – fix the import path, do not duplicate.

- NO hardcoded styles. No inline style="..." attributes, no extra CSS rules
  in this file, no language-equivalent style overrides (StyleSheet objects,
  styled() wrappers, sx props, NSAttributedString attributes, etc.).

- Variant states are reached via the component's own public API only:
  props, attributes, modifiers, classes, slots – whatever the component
  already exposes. If you can't reach a state via the component's API,
  that's a component bug – fix it at the component, not here.

- Every entry shows its source file path next to the rendered component,
  so visually-identical entries pointing to different files surface as
  redundancy candidates.

- This file is a viewer, not a workshop. Read components, render them,
  label them. Don't reshape them.
```

## Per-language comment-syntax adaptation

When scaffolding the contract into a gallery file, wrap the canonical text in the file's idiomatic comment syntax. Examples:

| Language / file type | Comment style | Example wrapper |
|---|---|---|
| JavaScript / TypeScript / JSX / TSX | Block | `/* GALLERY CONTRACT … */` |
| HTML | Block | `<!-- GALLERY CONTRACT … -->` |
| CSS / SCSS | Block | `/* GALLERY CONTRACT … */` |
| Vue SFC `<template>` | Block | `<!-- GALLERY CONTRACT … -->` |
| Vue SFC `<script>` | Block | `/* GALLERY CONTRACT … */` |
| Svelte | Block | `<!-- GALLERY CONTRACT … -->` (template) or `/* … */` (script) |
| Astro frontmatter | Block | `/* GALLERY CONTRACT … */` |
| Swift / SwiftUI | Block | `/* GALLERY CONTRACT … */` (also fine: leading `// ` per line) |
| Kotlin / Jetpack Compose | Block | `/* GALLERY CONTRACT … */` |
| Java | Block | `/* GALLERY CONTRACT … */` |
| Dart / Flutter | Block | `/* GALLERY CONTRACT … */` |
| Rust / Tauri | Block | `/* GALLERY CONTRACT … */` |
| Python (when relevant) | Triple-quoted docstring or `# ` per line | `"""GALLERY CONTRACT … """` |
| Ruby | `# ` per line | `# GALLERY CONTRACT …` |
| C# / .NET MAUI | Block | `/* GALLERY CONTRACT … */` |
| Go | Block | `/* GALLERY CONTRACT … */` |
| Markdown (rare – only for static-site gallery indexes) | HTML comment | `<!-- GALLERY CONTRACT … -->` |

If the project's primary file uses a less common language, default to block-style if the language supports it, otherwise leading-line comments. The point is preservation of the canonical text – the syntax is just packaging.

## Why these rules exist (do not edit; this is the rationale that justifies enforcement)

1. **Real-component import only** – if Claude reimplements components in the gallery, the gallery shows fake-correct UI while the real app has bugs. The user trusts the gallery as visual ground truth; that trust is broken the moment a single entry is duplicated rather than imported.
2. **No hardcoded styles** – same reason. If a Button entry uses `style="background: red"` instead of the production token, you can't tell whether the production token system actually works. The gallery becomes a lie.
3. **API-only variants** – if a state can't be reached via the component's API, that's a missing capability the component should expose. Hacking it in the gallery hides the gap.
4. **Source path labels** – visual redundancy is impossible to spot without source attribution. Two cards showing identical buttons but pointing to `Button.tsx` and `PrimaryButton.tsx` are the duplicate-detection signal.
5. **Viewer, not workshop** – design exploration belongs in the prototype lifecycle (`skills/dev-prototyping/`). Component changes belong in the components themselves. The gallery is a one-way mirror onto shipped reality.

## Source

- Visual reference: Yana's gallery at `yananaaas.github.io` (pill-tab navigation across categories, all variants visible per component, source-path labels, code snippets beneath).
- Stack-adaptive scaffold via context7 MCP (bundled since v4.3.0).
- Detection infrastructure: `skills/meta-setup/scripts/detect-environment.sh`.
