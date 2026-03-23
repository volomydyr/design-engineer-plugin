---
name: ui-aesthetic-review
description: "Critiques implemented UI for craft quality using a 4-lens framework and 4 named tests. Use after building to identify where defaults replaced intentional design decisions and close the gap between correct and crafted. Do NOT use for design-to-code fidelity or token compliance; see ui-design-to-code-qa instead."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Design Critique

## Why This Matters

There is a distance between correct and crafted. Correct means the layout holds, the grid aligns, the colors do not clash. Crafted means someone cared about every decision down to the last pixel. You can feel the difference immediately – the way you tell a hand-thrown mug from an injection-molded one. Both hold coffee. One has presence.

Your first output lives in correct. This skill pulls it toward crafted.

This is not about finding bugs or catching design system violations – that is what `ui-design-to-code-qa` does. This skill asks a different question: "Would a design lead put their name on this?"

Good taste is trained, not innate. Develop it by surrounding yourself with great work, thinking deeply about why something feels right, and studying the best interfaces with curiosity – reverse-engineer animations, inspect spacing, understand hierarchy.

"All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune." – Paul Graham. Beauty is underutilized in software. Most teams stop at correct. Craft is leverage.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine Critique Scope

```
question: "What would you like to critique?"
header: "Scope"
options:
  - label: "Full page or screen"
    description: "Critique an entire page layout, composition, and all elements"
  - label: "Specific component"
    description: "Deep critique of a single component – card, form, nav, etc."
  - label: "Multi-screen flow"
    description: "Critique consistency and craft across a user journey"
  - label: "Overall product feel"
    description: "High-level critique of the product's visual identity and coherence"
```

Then determine the input method:

```
question: "How should I review the implementation?"
header: "Input"
options:
  - label: "Screenshot or image"
    description: "Analyze provided screenshots of the implementation"
  - label: "Live URL (via browser)"
    description: "Navigate to a URL and take automated screenshots"
  - label: "Code review"
    description: "Read the frontend code and critique the design decisions in it"
  - label: "Figma comparison"
    description: "Compare implementation against the Figma design for craft gaps"
  - label: "HTML prototype"
    description: "Read and critique an HTML prototype file from design-docs/prototype/"
```

When "HTML prototype" is selected, read the HTML file at the path the user provides (default: `design-docs/prototype/prototype.html`). Apply the full 4-lens framework and all 4 named tests to the prototype. Focus on composition, craft decisions, content coherence, and structural quality of the generated code.

---

## Step 2: See the Composition

Step back. Look at the whole thing.

**Rhythm** – Does the layout breathe unevenly? Great interfaces have dense tooling areas that give way to open content, heavy elements that balance against light ones. The eye travels through the page with purpose. Default layouts are monotone: same card size, same gaps, same density everywhere. Flatness is the sound of no one deciding.

**Proportions** – Are they doing work? A 280px sidebar next to full-width content says "navigation serves content." A 360px sidebar says "these are peers." The specific number declares what matters. If you cannot articulate what the proportions are saying, they are not saying anything.

**Focal point** – Is there one? Every screen has one thing the user came here to do. That thing should dominate – through size, position, contrast, or the space around it. When everything competes equally, nothing wins and the interface feels like a parking lot.

**Balance** – Heavy elements (large images, dense data tables, dark sections) should balance against lighter areas. Not symmetrically – dynamically. Like a well-composed photograph.

For the full framework with examples, see [critique-framework.md](./references/critique-framework.md). For deeper domain knowledge on spacing systems, grids, and visual hierarchy, see [spatial-design.md](./references/spatial-design.md).

---

## Step 3: See the Craft

Move close. Pixel-close.

**Spacing** – The grid is non-negotiable: every value a multiple of the base unit, no exceptions. But correctness alone is not craft. A tool panel at 16px padding feels workbench-tight. The same card at 24px feels like a brochure. The same number can be right in one context and lazy in another. Density is a design decision, not a constant.

**Typography** – It should be legible even squinted. If size is the only thing separating headline from body from label, the hierarchy is too weak. Weight, tracking, and opacity create layers that size alone cannot. Does the typeface feel like it belongs in this product's world?

**Surfaces** – Should whisper hierarchy. Not thick borders, not dramatic shadows – quiet tonal shifts where you feel the depth without seeing it. Remove every border mentally. Can you still perceive the structure through surface color alone? If not, the surfaces are not working hard enough.

**Interactive states** – Every button, link, and clickable region should respond to hover and press. Not dramatically – a subtle shift in background, a gentle darkening. Missing states make an interface feel like a photograph of software instead of software.

For deeper domain knowledge, see [typography.md](./references/typography.md), [color-and-contrast.md](./references/color-and-contrast.md), and [motion-design.md](./references/motion-design.md).

---

## Step 4: See the Content

Read every visible string as a user would. Not checking for typos – checking for truth.

**Coherent story** – Does this screen tell one story? Could a real person at a real company be looking at exactly this data right now? Or does the page title belong to one product, the article body to another, and the sidebar metrics to a third?

**Content quality** – Placeholder text like "Lorem ipsum" or obviously fake data ("John Doe", "$1,234.56") breaks the illusion. Good prototypes use realistic data that helps evaluate the design under real conditions.

**Content–design alignment** – Content incoherence breaks the illusion faster than any visual flaw. A beautifully designed interface with nonsensical content is a movie set with no script.

For deeper domain knowledge on copy quality and voice, see [ux-writing.md](./references/ux-writing.md).

---

## Step 5: See the Structure

Open the code and find the lies – the places that look right but are held together with tape.

**Layout hacks** – Negative margins undoing a parent's padding. `calc()` values that exist only as workarounds. Absolute positioning to escape layout flow. Each is a shortcut where a clean solution exists.

**Overcomplicated solutions** – Cards with full-width dividers should use flex column and section-level padding. Centered content should use max-width with auto margins. The correct answer is always simpler than the hack.

**Inconsistent patterns** – Same visual result achieved three different ways across three files. This is where tech debt compounds.

---

## Step 6: Run the 4 Named Tests

These are concrete, repeatable checks that catch defaults.

### Swap Test

Take any design choice – typeface, layout, color palette, spacing scale. Mentally swap it for the most common alternative (the one every other AI would pick). Would anyone notice the difference?

Everywhere swapping would not matter is a place you defaulted. These are the first things to redesign.

### Squint Test

Blur your eyes at the interface. You should still perceive the hierarchy – what is above what, where regions begin and end. But no single element should jump out harshly. If borders are the first thing you see, they are too strong. If you cannot find where one region ends and another begins, they are too subtle.

### Signature Test

Can you point to 5 specific elements where the design intent appears? Not "the overall feel" – actual components. A specific card layout. A particular way data is displayed. A unique navigation pattern.

If you cannot locate the signature, it does not exist. The interface is generic regardless of what the design intent document says.

### Token Test

Read the design tokens or CSS variables out loud. Do they sound like they belong to this product's world? `--ink`, `--parchment`, `--clinic-teal` tell you what product this is. `--gray-700`, `--surface-2`, `--primary` could belong to anything.

### AI Slop Test

Show this interface to a stranger and say "AI made this." If they believe you immediately – that is the problem.

Check the implementation against every anti-pattern in [anti-patterns.md](./references/anti-patterns.md). The tells are specific: purple gradients, Inter font, cards inside cards, glassmorphism, identical card grids, bounce easing. Each one signals "no one decided this."

The goal is not to avoid AI assistance – it is to avoid AI defaults.

---

## Step 7: Produce the Critique Report

For each finding, document:

- **What defaulted** – the specific element or decision that reverted to generic
- **Why it matters** – what craft or intent was lost
- **What to do instead** – concrete recommendation tied to the stated design intent

Group findings by lens:

1. **Composition** – rhythm, proportions, focal point, balance
2. **Craft** – spacing, typography, surfaces, interactive states
3. **Content** – story coherence, data realism, content–design alignment
4. **Structure** – layout hacks, overcomplicated solutions, inconsistent patterns

For each of the 4 named tests, report: **Pass** or **Fail** with specific evidence.

Save the report to `{deliverables_path}/reviews/design-critique.md`.

---

## Step 8: Rebuild

The first build was the draft. The critique is the design.

If the user approves, offer to fix the identified issues. Prioritize:

1. **Composition failures** – these affect everything downstream
2. **Swap test failures** – the most visible signs of generic design
3. **Craft gaps** – surfaces, typography, and states that need refinement
4. **Structural hacks** – clean up the code to match the design quality

After rebuilding, run the 4 named tests again. The goal is for every test to pass.

---

## Decision Hierarchy

1. **User's direct input** – their taste, their judgment of craft
2. **Stated design intent** – the intent established in `ui-references-moodboard`
3. **Design system patterns** – established conventions in the codebase
4. **AI critique** – propose improvements but always defer to user

---

## What Comes Next

After critique and rebuild, suggest running `ui-design-to-code-qa` to catch any remaining technical issues (hardcoded values, design system violations), or `ui-accessibility` to verify the refined design meets accessibility standards.

---

## Resource Files

- [critique-framework.md](./references/critique-framework.md) – Full 4-lens critique framework with detailed examples, common defaults, and example critique reports
- [anti-patterns.md](./references/anti-patterns.md) – AI-generated UI anti-patterns and the AI Slop Test
- [typography.md](./references/typography.md) – Type systems, font pairing, modular scales, OpenType features
- [color-and-contrast.md](./references/color-and-contrast.md) – OKLCH color, tinted neutrals, dark mode, WCAG contrast
- [spatial-design.md](./references/spatial-design.md) – Spacing systems, grids, visual hierarchy, container queries
- [motion-design.md](./references/motion-design.md) – Animation decision framework, easing curves, duration rules, springs, stagger
- [advanced-animations.md](./references/advanced-animations.md) – clip-path patterns, gesture/drag, WAAPI, debugging
- [interaction-design.md](./references/interaction-design.md) – Interactive states, focus rings, forms, keyboard navigation
- [responsive-design.md](./references/responsive-design.md) – Mobile-first, fluid design, input detection, safe areas
- [ux-writing.md](./references/ux-writing.md) – Button labels, error messages, empty states, voice and tone
