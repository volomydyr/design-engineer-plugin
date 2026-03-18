---
name: de:review
description: Multi-layer design review. Visual review, accessibility, psychology, product assessment, design system compliance, ethics.
argument-hint: "[figma | live | codebase | accessibility | psych | ethics | full]"
---

# Design Review

## Context

<context> #$ARGUMENTS </context>

Reviews existing designs or implemented code against best practices, psychology principles, accessibility standards, and design system consistency.

## Review Type Selection

If no review type was specified in arguments, use AskUserQuestion to ask:

**Question:** "What are you reviewing?"

1. **Figma designs** – I will share frames or a Figma link
2. **Live implementation** – Review a URL or screenshots against design intent
3. **Codebase** – Design system compliance check on code
4. **Accessibility audit** – WCAG compliance and usability review
5. **Psychology scan** – Psychology principles applied to current design
6. **Ethics review** – Ethical design practices audit
7. **Full product assessment** – Comprehensive review across all dimensions

If AskUserQuestion is not available, present options as a numbered list.

## Workflow

### Figma Designs (Option 1)

Ask for a Figma frame link or ask the user to share screenshots.

If Figma plugin is available, use it to analyze the design directly.

1. Load `ui-implementation-review` – check visual design quality
2. Load `ui-accessibility` – accessibility compliance
3. Load `psych-master-audit` – psychology principles scan
4. Compile findings into a structured review report

### Live Implementation (Option 2)

Ask for a URL or screenshots.

If Playwright plugin is available, use it to capture and analyze the live site.

1. Load `ui-implementation-review` – compare implementation against design intent
2. Load `ui-accessibility` – accessibility audit
3. Load `psych-master-audit` – psychology scan
4. Compile findings into a review report

### Codebase (Option 3)

1. Load `ui-design-system` in audit mode – check code against design system rules
2. Task `design-system-auditor`(codebase) – automated compliance check
3. Report violations and recommendations

### Accessibility Audit (Option 4)

1. Load `ui-accessibility` – comprehensive accessibility review
2. Check against WCAG guidelines, tap targets, color contrast, screen reader support
3. Produce an accessibility audit report

### Psychology Scan (Option 5)

Use AskUserQuestion to ask:

**Question:** "How would you like to run the psychology audit?"

1. **Master audit** – Broad scan across all 100+ principles, then targeted deep-dives into problem areas
2. **Section deep-dive** – Pick 1 of 13 sections to analyze in detail
3. **God mode** – Full autonomous audit across all 100+ principles

If AskUserQuestion is not available, present options as a numbered list.

Load `psych-master-audit` for all three approaches. The psych-master-audit skill handles routing to the appropriate section skills, deep-dive selection, and god mode sequencing.

### Ethics Review (Option 6)

1. Load `ux-ethics-review` – ethical design audit
2. Apply ethics tests and humane design principles
3. Produce an ethics review report

### Full Product Assessment (Option 7)

Run all review dimensions in parallel where possible:

- Task `design-system-auditor`(product)
- Task `psych-scanner`(product)

Then sequentially:

1. Load `ui-implementation-review`
2. Load `ui-accessibility`
3. Load `psych-master-audit`
4. Load `ux-product-assessment` – comprehensive product checklist
5. Load `ux-ethics-review`
6. Load `ux-communicating-decisions` – prepare findings for stakeholders

Compile all findings into a comprehensive review report.

## Post-Review

After any review, ask:

"Review complete. What would you like to do?"

1. **Address findings** – Work through the issues identified
2. **Share with stakeholders** – Use communicating-decisions skill to prepare a presentation
3. **Document** – Run `/de:document` to save findings
4. **Run another review type** – Choose a different review dimension

## Agents Used

- `design-system-auditor` – automated design system compliance
- `psych-scanner` – broad psychology principles scan
- `deliverable-writer` – review report production
