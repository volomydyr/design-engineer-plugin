---
name: psych-visual-perception
description: "Explores visual perception and attention focus psychology principles (Laws 11-20) for UX design. Covers contrast, Gestalt grouping, and visual hierarchy. Use when analyzing how a design directs attention and manages visual focus. Do NOT use for information overload or choice paralysis; see psych-cognitive-load instead."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Visual Perception and Attention Focus (Laws 11-20)

How to effectively use attention, contrast, and visual cues to create emphasis in design.

## Reference Files

- [Section 2 Principles](./references/section-2-principles.md) – All 10 principles with definitions, UX applications, and good/bad examples
- [Section 2 Case Studies](./references/section-2-case-studies.md) – Adapted case studies showing principles in action

## Workflow

### Step 1: Understand What to Analyze

Ask the user what they want to evaluate against visual perception principles.

**Ask the user:**
> What would you like me to analyze against visual perception and attention principles?
>
> 1. **Figma frames** – I will examine specific screens from your Figma file
> 2. **Screenshots** – share screenshots of the interface to review
> 3. **Design description** – describe the interface, flow, or feature in text
> 4. **Live product** – provide a URL and I will review the current state

Wait for the user's response before proceeding.

### Step 2: Load Section Principles

Read the full principles reference file: [section-2-principles.md](./references/section-2-principles.md)

This file contains all 10 principles of visual perception and attention:

| # | Principle | Core Question |
|---|-----------|---------------|
| 11 | Selective Attention | Is the design showing the right thing at the right moment? |
| 12 | Banner Blindness | Does any important content look like advertising? |
| 13 | Visual Anchors | Are there clear reference points guiding the user's eye path? |
| 14 | Von Restorff Effect | Does the element that should stand out actually differ from its surroundings? |
| 15 | Contrast | Is visual weight aligned with element importance? |
| 16 | Law of Similarity | Do similar-function elements share consistent visual treatment? |
| 17 | Law of Pragnanz | Are complex elements presented in the simplest possible form? |
| 18 | Picture Superiority Effect | Are images and icons used to reinforce understanding? |
| 19 | Serial Position Effect | Are the most important items placed at the beginning or end? |
| 20 | The Centre-Stage Effect | Is the recommended option positioned in the center? |

### Step 3: Evaluate the Design

For each principle, assess the design systematically:

1. **State the principle** – one sentence explaining what it means
2. **Evaluate** – does the design follow or violate this principle? Be specific about which elements or flows are affected
3. **Severity** – rate as Critical (breaks usability), Warning (degrades experience), or Passed (principle is well-applied)
4. **Evidence** – point to specific UI elements, flows, or patterns that demonstrate the finding
5. **Recommendation** – if there is a violation, provide a concrete suggestion with pros and cons

Use these evaluation patterns for each principle:

**Selective Attention checkpoints:**
- Check if error messages appear next to the relevant field or are buried elsewhere
- Verify that system notifications appear at contextually appropriate moments
- Look for important information competing with the user's current task focus
- Check if alerts and modals interrupt users at natural break points vs. mid-task

**Banner Blindness checkpoints:**
- Look for important content styled as colorful, rectangular banners at the top of pages
- Check if system messages are visually distinct from advertising patterns
- Verify that promotional content and functional content have different visual treatments
- Look for important announcements that users might subconsciously skip

**Visual Anchors checkpoints:**
- Identify the primary visual anchor on each screen (hero image, main heading, featured content)
- Check if there is a predictable scanning path from anchor to anchor
- Verify that page structure uses anchors to break up long content into navigable sections
- Look for pages with no clear visual anchor where the eye has nowhere to land first

**Von Restorff Effect checkpoints:**
- Identify elements that should stand out (CTAs, recommended plans, key messages)
- Check if these elements are visually distinct from their surroundings (different color, size, shape, or style)
- Verify that isolation is used sparingly – if too many elements are "special," none stand out
- Look for pricing tables or feature comparisons where the recommended option should pop

**Contrast checkpoints:**
- Check color contrast ratios for accessibility (WCAG AA minimum: 4.5:1 for body text, 3:1 for large text)
- Verify that primary actions have higher visual contrast than secondary actions
- Look for text that is hard to read due to insufficient contrast with its background
- Check if excessive contrast creates visual fatigue (e.g., pure black on pure white for long text)

**Law of Similarity checkpoints:**
- Check if all buttons of the same type share the same visual style
- Verify that destructive actions (delete, remove) are visually distinct from constructive actions (save, create)
- Look for inconsistent icon styles (mixing filled and outlined, different stroke weights)
- Check if related items share visual properties (same color, same shape, same size)

**Law of Pragnanz checkpoints:**
- Look for complex visualizations that could be simplified to basic shapes and patterns
- Check if dashboards present data through simple, interpretable charts vs. overwhelming raw data
- Verify that icons and illustrations use the simplest forms that still communicate meaning
- Look for interfaces where the visual complexity exceeds the functional complexity

**Picture Superiority Effect checkpoints:**
- Check if navigation uses icons alongside text labels (not icons alone or text alone)
- Verify that status indicators use visual symbols (checkmark, warning triangle, error circle)
- Look for opportunities to replace text-only content with images or infographics
- Check if visual elements are relevant and reinforce the text rather than being decorative

**Serial Position Effect checkpoints:**
- In navigation, are the most important items at the beginning and end?
- In lists, is the most critical content at the first or last position?
- Are secondary items placed in the middle where they receive less attention?
- For long lists, are there visual breaks that create new "beginning" and "ending" positions?

**Centre-Stage Effect checkpoints:**
- In pricing pages, is the recommended plan in the center position?
- In product comparisons, is the suggested option centered?
- Look for horizontal layouts of 3+ equal options where the center one should be preferred
- Check if the center positioning is reinforced with additional visual emphasis (bigger, highlighted)

### Step 4: Produce the Findings Report

Before writing the report to disk, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/psychology` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront. Save the report to `.design-engineer-plugin/design/psychology/visual-perception.md` (or a flow-specific name when multiple audits are produced).

Structure the output as follows:

```
## Visual Perception Audit: [Design Name]

### Summary
- **Principles passed**: X/10
- **Warnings**: X
- **Critical issues**: X
- **Top priority**: [Most impactful finding]

### Detailed Findings

#### [Principle Name] – [Passed/Warning/Critical]
**What it means**: [One-sentence definition]
**Finding**: [Specific observation about the design]
**Evidence**: [Which elements or flows demonstrate this]
**Recommendation**: [Concrete suggestion if applicable]
**Trade-off**: [Pros and cons of the recommendation]

[Repeat for each principle]

### Priority Actions
1. [Most impactful change with expected benefit]
2. [Second most impactful change]
3. [Third most impactful change]
```

### Step 5: Cross-Reference with Case Studies

After presenting findings, load [section-2-case-studies.md](./references/section-2-case-studies.md) and reference relevant case studies to illustrate your recommendations.

For each critical or warning finding, find the most relevant case study and explain:
- How a similar problem was solved in the case study
- What specific technique was used
- How the user's design could apply the same approach

**Ask the user:**
> Would you like me to:
>
> 1. **Deep-dive** into any specific principle finding
> 2. **Generate implementation specs** for the priority actions
> 3. **Run another section** of the psychology audit
> 4. **Compare** your design against a specific case study pattern

## Key Relationships to Other Principles

Several principles in this section have been enriched with additional research and practical applications. The reference file merges these sources for a unified perspective:

- **Banner Blindness** – expanded with research on how users develop selective filtering for ad-like patterns and how this affects notification design
- **Von Restorff Effect** – enriched with the isolation effect research and practical limits on how many elements can be simultaneously "special"
- **Visual Hierarchy** – deepened with the relationship between visual weight, scanning patterns, and information architecture


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
