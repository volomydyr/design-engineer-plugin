# Critique Framework

## The Gap Between Correct and Crafted

Correct means the layout holds, the grid aligns, the colors do not clash. Crafted means someone cared about every decision. You can feel the difference immediately.

A crafted interface has presence. It feels considered. Every spacing value, every color choice, every typographic decision reinforces a single intent. A correct interface merely functions – it holds together but says nothing about who made it or why.

Your first output is almost always correct, not crafted. That is normal. The work is catching it before the user has to.

---

## Lens 1: Composition

Composition is the macro view – the arrangement and relationship of major elements on the page.

### Rhythm

Great interfaces breathe unevenly. Dense tooling areas give way to open content spaces. Heavy elements balance against light ones. The eye travels through the page with purpose, not scanning a uniform grid.

Default layouts are monotone: same card size, same gaps, same density everywhere. Flatness is the sound of no one deciding.

**What to look for:**
- Are all sections the same visual weight? (Bad – monotone)
- Do dense areas have adjacent breathing room? (Good – rhythm)
- Does the eye have a natural path through the page? (Good – flow)
- Is the page a uniform grid of same-sized containers? (Bad – template)

### Proportions

Proportions declare relationships. A narrow sidebar with wide content says "navigation serves content." Equal-width panels say "these are peers." The specific numbers matter.

**What to look for:**
- Can you articulate what the proportions are saying?
- Do sidebar widths, column ratios, and content areas reflect the actual importance of their contents?
- Are proportions just framework defaults (e.g., 1/4 sidebar because 3-column grid)?

### Focal Point

Every screen has one thing the user came here to do. That thing should dominate – through size, position, contrast, or the space around it. When everything competes equally, nothing wins.

**What to look for:**
- Can you identify the primary action within 2 seconds?
- Is the focal point achieved through intentional emphasis, or does it just happen to be first?
- Are secondary elements clearly subordinate, or do they compete for attention?

### Balance

Not symmetry – dynamic balance. Like a well-composed photograph where a large element on one side is balanced by a smaller, higher-contrast element on the other.

**What to look for:**
- Heavy visual elements (large images, data tables, dark sections) balanced by lighter areas
- Whitespace used intentionally, not just as leftover
- The page does not feel "tilted" toward one side or one section

---

## Lens 2: Craft

Craft is the pixel-level view – the quality of individual design decisions.

### Spacing Craft

The grid is non-negotiable: every value a multiple of the base unit, no exceptions. But there is craft beyond correctness.

**What to look for:**
- Is padding consistent AND appropriate? 16px that is correct for a compact tool panel is lazy for a premium card.
- Does spacing create clear grouping? (Inside-group < between-group)
- Are there one-off values that break the rhythm?
- Does the density match the stated intent? (Dense for power tools, spacious for consumer apps)

### Typography Craft

Typography should be legible even squinted. It should create layers you perceive without reading.

**What to look for:**
- Is size the only differentiator between heading, body, and label? (Weak hierarchy)
- Are weight, tracking (letter-spacing), and opacity used to create distinct levels? (Strong hierarchy)
- Does the typeface belong in this product's world?
- Is there a clear 4-level text hierarchy (primary, secondary, tertiary, muted)?
- Do data values use monospace / tabular numbers where appropriate?

### Surface Craft

Surfaces should whisper hierarchy, not shout it.

**What to look for:**
- Remove all borders mentally. Can you still perceive the structure? If not, surfaces are not working.
- Are surface elevation jumps subtle (a few percentage points of lightness) or dramatic? Dramatic is wrong.
- Do all surfaces use the same hue, shifting only in lightness? Different hues for different surfaces is a common mistake.
- In dark mode: are elevated surfaces slightly lighter? (Correct) Or dramatically different? (Wrong)

### Interactive State Craft

Every interactive element needs life.

**What to look for:**
- Do all buttons, links, and clickable regions respond to hover?
- Are press/active states present?
- Are focus rings visible and consistent?
- Are disabled states clearly distinguishable but not harsh?
- Are loading states present where data fetching occurs?
- Are empty states designed, not just blank?

---

## Lens 3: Content

Content is the story the interface tells.

### Coherent Story

A well-designed interface with nonsensical content is a movie set with no script. Content incoherence breaks the illusion faster than any visual flaw.

**What to look for:**
- Does the page title match what the body content shows?
- Do sidebar metrics relate to the main content?
- Could a real person at a real company be looking at exactly this data right now?
- If placeholder data is used, is it realistic? ("Dr. Sarah Chen" not "John Doe", "$847.50" not "$1,234.56")

### Data Presentation

Numbers on screen are not design. The question is: what does this number mean to the person looking at it?

**What to look for:**
- Are numbers presented with context? ("+12% vs last month" not just "12%")
- Are data displays chosen for their content? (Sparklines for trends, progress bars for completion, not everything as a big number with a label)
- Is comparison data present where it would help decision-making?

---

## Lens 4: Structure

Structure is the code quality behind the visual quality.

### Layout Integrity

**What to look for:**
- Negative margins undoing parent padding – use flex/grid instead
- `calc()` workarounds – usually indicate a layout that should be restructured
- Absolute positioning to escape layout flow – almost always a sign of a broken layout model
- `!important` overrides – sign of specificity battles

### Simplicity

The correct structural answer is always simpler than the hack.

**What to look for:**
- Full-width dividers inside padded containers? Use flex column with section-level padding.
- Centered content with manual positioning? Use max-width with auto margins.
- Overlapping elements with z-index stacking? Reconsider the layout approach.

### Consistency

**What to look for:**
- Same visual result achieved different ways across files
- Spacing that matches visually but uses different values
- Colors that look the same but reference different tokens (or raw values)

---

## The 4 Named Tests – Expanded

### Swap Test

For each major design decision, mentally swap it for the most generic alternative:

| Decision | Generic Alternative | Would anyone notice? |
|----------|-------------------|---------------------|
| Your typeface | Inter / SF Pro / system default | ? |
| Your color palette | Blue primary, gray neutrals | ? |
| Your layout | Sidebar + card grid | ? |
| Your spacing | 16px padding, 24px gaps | ? |
| Your data display | Big number + small label | ? |

Every "no" is a defaulted decision. Fix the "no" answers first.

### Squint Test

Physically squint or blur your screen. Three things should remain visible:

1. **Hierarchy** – You can still tell what is primary, secondary, tertiary
2. **Structure** – You can still perceive where sections begin and end
3. **Nothing screams** – No single element jumps out with harsh contrast

If hierarchy disappears, your typographic and spatial hierarchy is too weak.
If structure disappears, your surfaces and borders are too subtle.
If something screams, your borders or contrast are too harsh.

### Signature Test

List 5 specific places where the design intent manifests:

1. _______________
2. _______________
3. _______________
4. _______________
5. _______________

If you cannot fill all 5 with specific components (not "the overall feel"), the signature does not exist. The interface is generic.

### Token Test

Read your design tokens aloud. Complete this sentence:

"This product is _____ because the tokens use words like _____."

If you cannot complete the sentence, or the answer is "This product is generic because the tokens use words like gray, surface, and primary" – the tokens are not doing design work.

---

## Common Default Patterns

These are the most frequent defaults to watch for across interface types:

### Dashboard Defaults
- Same-height metric cards in a row (every dashboard looks this way)
- Left sidebar at exactly 240–280px with generic nav items
- Blue accent color with gray neutrals
- "Welcome back, [Name]" greeting that adds nothing
- Line charts and bar charts as the default data visualization

### Form Defaults
- Label-above-input for everything regardless of content
- Full-width inputs when half-width would create better grouping
- "Submit" as the CTA text
- All fields visible at once when progressive disclosure would reduce cognitive load

### Table Defaults
- Full-width table with alternating row colors
- Actions column on the right with icon buttons
- Pagination below with page numbers
- No empty state beyond "No results found"

### Card Defaults
- Icon on the left, title + description on the right
- Same border radius, same shadow, same padding for every card type
- "View Details" as the generic action text
- Three cards in a row, always

---

## Example Critique Report Structure

```markdown
# Design Critique: [Screen/Component Name]

## Summary
[2–3 sentences: overall craft assessment and biggest gap]

## Composition
- **Rhythm**: [finding]
- **Proportions**: [finding]
- **Focal point**: [finding]

## Craft
- **Spacing**: [finding]
- **Typography**: [finding]
- **Surfaces**: [finding]
- **States**: [finding]

## Content
- **Story coherence**: [finding]
- **Data presentation**: [finding]

## Structure
- **Layout integrity**: [finding]
- **Consistency**: [finding]

## Named Tests
- **Swap test**: PASS / FAIL – [evidence]
- **Squint test**: PASS / FAIL – [evidence]
- **Signature test**: PASS / FAIL – [5 signature points or why they are missing]
- **Token test**: PASS / FAIL – [evidence]
- **AI Slop test**: PASS / FAIL – [evidence against the anti-pattern catalog]

## Priority Fixes
1. [Most impactful fix]
2. [Second fix]
3. [Third fix]

## The Question
"If they said this lacks craft, what would they point to?"
→ [Answer this honestly, then fix it]
```
