---
name: ui-accessibility
description: Reviews designs and implementations for accessibility compliance including contrast, touch targets, and screen reader support. Use when auditing a product for accessibility or building features that must meet accessibility standards.
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Accessibility Review

## Why This Matters

Accessibility is a UX improvement, not just a compliance requirement. Principles like Fitts's Law (larger targets are easier to hit) and Cognitive Load theory (simpler interfaces reduce mental effort) apply to every user – not just those with disabilities. Building accessible products creates better experiences for everyone.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine Review Scope

```
question: "What are you reviewing for accessibility?"
header: "Review Scope"
options:
  - label: "Figma designs (pre-implementation)"
    description: "Check designs before code is written"
  - label: "Implemented screens (code audit)"
    description: "Audit existing code for accessibility issues"
  - label: "Live application (URL or device)"
    description: "Test a running application"
  - label: "Specific component"
    description: "Focus on one component or interaction"
  - label: "HTML prototype"
    description: "Check an HTML prototype file for accessibility issues"
```

When "HTML prototype" is selected, read the HTML file at the path the user provides (default: `prototype/prototype.html`). Run the full accessibility checklist with particular attention to contrast ratios, touch/click target sizes, keyboard navigation, screen reader support (semantic HTML, ARIA labels), and heading hierarchy.

---

## Step 2: Run the Accessibility Audit

Use the comprehensive checklist from [accessibility-checklist.md](./references/accessibility-checklist.md) covering:

### Touch and Click Targets
- Minimum tap target size: 56 points (based on Fitts's Law – smaller targets require more precision and slow users down)
- Adequate spacing between interactive elements to prevent accidental taps
- Touch targets that extend beyond visible boundaries where needed for small icons

### Color and Contrast
- Text contrast ratio of at least 4.5:1 for normal text (WCAG AA)
- Text contrast ratio of at least 3:1 for large text (18pt or 14pt bold)
- Non-text contrast ratio of at least 3:1 for UI components and graphical objects
- Color is never the only means of conveying information (use icons, text, or patterns as well)

### Typography and Readability
- Base font size of at least 16 points for body text
- Sufficient line height (at least 1.5x font size for body text)
- Support for dynamic type or user-defined text scaling
- No justified text alignment (use left-aligned for readability)

### Screen Reader Support
- All interactive elements have descriptive accessibility labels
- Images have meaningful alt text (or are marked as decorative)
- Heading hierarchy is logical and sequential (h1 -> h2 -> h3)
- Form inputs have associated labels
- Dynamic content changes are announced to assistive technology

### Keyboard and Navigation
- All interactive elements are reachable via keyboard or assistive technology
- Focus order follows a logical reading sequence
- Focus indicators are visible and clear
- No keyboard traps (users can always navigate away from any element)

### Motion and Animation
- Animations respect the "reduce motion" system preference
- No content that flashes more than 3 times per second
- Auto-playing media can be paused or stopped
- Animated transitions have static fallbacks

---

## Step 3: Produce the Accessibility Report

For each issue, document:
- **Severity**: Critical (blocks access), Major (significant barrier), Minor (inconvenience)
- **Criterion**: which WCAG guideline or design principle is violated
- **Location**: specific screen, component, or code file
- **Issue**: what the problem is
- **Fix**: recommended solution with implementation guidance

Save to `design/reviews/accessibility-review.md`.

---

## Step 4: Prioritize Fixes

Guide the user through fixing issues in priority order:
1. **Critical** – complete access barriers (missing labels, zero contrast, no keyboard access)
2. **Major** – significant usability issues (small touch targets, poor contrast, missing focus indicators)
3. **Minor** – improvements (suboptimal heading structure, missing decorative image markers)

---

## Decision Hierarchy

1. **User's direct input** – they choose which fixes to prioritize
2. **WCAG guidelines** – the authoritative standard for accessibility
3. **Psychology principles** – Fitts's Law, Cognitive Load, and others support accessibility rationale
4. **AI suggestions** – propose solutions but defer to user

---

## What Comes Next

After the accessibility review, suggest running `ui-design-to-code-qa` for a broader visual audit, or `ui-design-system` to ensure accessibility constants (like minimum tap target size) are part of the design token system.

---

## Resource Files

- [accessibility-checklist.md](./references/accessibility-checklist.md) – Comprehensive accessibility audit criteria with WCAG references
