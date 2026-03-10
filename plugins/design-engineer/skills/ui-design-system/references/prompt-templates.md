# Prompt Templates

Curated prompts for common design system tasks. Use these as starting points – adapt to your specific project context.

---

## Visual Polish Pass

Use after initial implementation to elevate craft quality.

```
Review this UI for visual quality.

- Fix hierarchy: what is primary vs secondary vs tertiary?
- Fix spacing: grouping clarity, rhythm, alignment, consistent base unit
- Fix typography: scale, weights, line height, line length, letter-spacing
- Fix color: contrast ratios, palette consistency, accent usage, semantic colors
- Fix depth: shadows or borders (not both), focus on meaning not decoration
- Improve empty states and microcopy

Return:
1. A list of concrete changes (not vague suggestions)
2. Updated tokens if any values need adjustment
3. Before/after descriptions of the most important screens
```

---

## Glance Test

Use to verify a screen communicates its purpose within 10 seconds. This catches unclear hierarchy, buried actions, and missing navigation context.

```
Pretend you have 10 seconds to look at this page.

Answer:
- What is this page?
- Who is it for?
- What are the top 3 things I can do here?
- What is the primary action?
- Where is the navigation?

Then list everything that created a question mark, and propose fixes.
```

---

## Component Spec

Use when a component needs a build-ready specification – states, behavior, tokens, and edge cases.

```
Write a build-ready spec for this component.

Include:
- Purpose: when to use this component and when not to
- Anatomy: named parts (container, label, icon, indicator, etc.)
- Variants: size, style, and context variations
- States: default, hover, focus, active, disabled, loading, error, success, empty
- Behavior: keyboard interaction, mouse interaction, touch interaction
- Tokens: spacing, typography, and color tokens used (reference design system)
- Accessibility: ARIA roles and properties, focus management, screen reader behavior
- Edge cases: long text, missing data, localization, RTL

Keep it concise but unambiguous. Every value should reference the design system.
```

---

## Accessibility Quick Check

Use to catch the most common accessibility issues quickly.

```
Review this design for accessibility.

Check:
- Text contrast (normal text target 4.5:1, large text target 3:1)
- Keyboard navigation: can every interactive element be reached and activated?
- Focus visibility: are focus rings visible and consistent?
- Semantic elements: are buttons actually buttons, links actually links?
- Form labeling: does every input have a visible, associated label?
- Error messaging: are errors announced to screen readers?
- Motion: does animation respect the "reduce motion" preference?

Return:
1. Issues grouped by severity (critical, major, minor)
2. Concrete fixes for each issue (design + implementation)
3. Any token changes needed (colors, focus styles)
```

---

## Responsive Behavior Spec

Use when defining how a component or page adapts across screen sizes.

```
Define responsive behavior for this page or component.

For each breakpoint (small phone, large phone, tablet, desktop):
- Layout: stack vs columns, grid changes
- Priority: what becomes primary vs secondary vs hidden
- Text: how headings and body text scale, truncation rules
- Tables: horizontal scroll, card view conversion, or column hiding
- Actions: how toolbars, buttons, and secondary actions adapt
- Navigation: bottom tabs vs sidebar vs hamburger transitions

Then list edge cases (long text, empty state, error state, loading state)
and how they render at each breakpoint.
```

---

## Design Token Audit

Use to check whether design tokens are complete, consistent, and well-named.

```
Audit the design token system.

Check:
- Completeness: are there tokens for colors, spacing, typography, borders,
  shadows, radii, and animation durations?
- Naming: do token names describe purpose (semantic) or just appearance?
  "primary-action" is good, "blue-500" is not.
- Consistency: are all values from a defined scale, or are there one-off numbers?
- Coverage: scan the codebase for hardcoded values that should be tokens
- Theming: can the palette be swapped without changing component code?
- Dark mode: do tokens have dark mode variants?

Return:
1. Missing tokens that need to be created
2. Poorly named tokens that should be renamed
3. Hardcoded values found in components (with file paths)
4. Recommendations for scale adjustments
```
