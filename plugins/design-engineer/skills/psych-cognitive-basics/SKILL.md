---
name: psych-cognitive-basics
description: "Explores cognitive interaction fundamentals (Laws 1-10) for UX design. Covers cognitive load, choice architecture, information grouping, and discoverability. Use when analyzing how an interface manages mental effort and attention."
disable-model-invocation: true
---

# Fundamentals of Cognitive Interaction (Laws 1-10)

How to simplify information, reduce brain load, and make interaction intuitive.

## Reference Files

- [Section 1 Principles](./references/section-1-principles.md) -- All 10 principles with definitions, UX applications, and good/bad examples
- [Section 1 Case Studies](./references/section-1-case-studies.md) -- Adapted case studies showing principles in action

## Workflow

### Step 1: Understand What to Analyze

Ask the user what they want to evaluate against cognitive interaction principles.

**Ask the user:**
> What would you like me to analyze against cognitive interaction principles?
>
> 1. **Figma frames** -- I will examine specific screens from your Figma file
> 2. **Screenshots** -- share screenshots of the interface to review
> 3. **Design description** -- describe the interface, flow, or feature in text
> 4. **Live product** -- provide a URL and I will review the current state

Wait for the user's response before proceeding.

### Step 2: Load Section Principles

Read the full principles reference file: [section-1-principles.md](./references/section-1-principles.md)

This file contains all 10 principles of cognitive interaction:

| # | Principle | Core Question |
|---|-----------|---------------|
| 1 | Cognitive Load | Is the interface showing too much information at once? |
| 2 | Hick's Law | Are there too many choices slowing down decisions? |
| 3 | Fitts's Law | Are important targets large enough and close enough? |
| 4 | Miller's Law | Are groups of items kept within the 7 plus/minus 2 range? |
| 5 | Recognition Over Recall | Does the interface show options instead of requiring memory? |
| 6 | Progressive Disclosure | Is information revealed gradually based on need? |
| 7 | Chunking | Is content grouped into logical blocks of 3-5 items? |
| 8 | Visual Hierarchy | Do important elements stand out through size, color, or contrast? |
| 9 | Law of Proximity | Are related elements placed close together? |
| 10 | Discoverability | Can users easily find and understand available actions? |

### Step 3: Evaluate the Design

For each principle, assess the design systematically:

1. **State the principle** -- one sentence explaining what it means
2. **Evaluate** -- does the design follow or violate this principle? Be specific about which elements or flows are affected
3. **Severity** -- rate as Critical (breaks usability), Warning (degrades experience), or Passed (principle is well-applied)
4. **Evidence** -- point to specific UI elements, flows, or patterns that demonstrate the finding
5. **Recommendation** -- if there is a violation, provide a concrete suggestion with pros and cons

Use these evaluation patterns for each principle:

**Cognitive Load checkpoints:**
- Count the number of distinct information items visible on screen
- Check if complex forms are broken into steps
- Look for familiar design patterns vs. custom interactions
- Verify navigation is split into primary and secondary levels

**Hick's Law checkpoints:**
- Count options presented simultaneously at decision points
- Check if items are grouped into categories (aim for 5-7 categories)
- Look for overwhelming menus or selection interfaces
- Verify registration or onboarding flows are broken into steps

**Fitts's Law checkpoints:**
- Measure relative size of primary action buttons vs. secondary ones
- Check if frequently-used elements are near natural cursor/finger zones
- On mobile: verify key elements are in the thumb comfort zone
- Check if menus and toolbars use screen edges for easy targeting

**Miller's Law checkpoints:**
- Count items in any list, menu, tab bar, or step sequence
- Verify groups stay within 5-9 items
- Check if longer lists use subcategories or logical grouping

**Recognition Over Recall checkpoints:**
- Look for free-text fields that could be dropdowns, calendars, or pickers
- Check if search offers autocomplete and suggestions
- Verify settings use toggles and selectors rather than requiring typed values

**Progressive Disclosure checkpoints:**
- Check if all information is shown at once vs. revealed on demand
- Verify product listings show essentials first, details on interaction
- Look for "Advanced" sections in settings
- Check if forms ask basic information first, additional fields later

**Chunking checkpoints:**
- Verify forms group related fields (personal data, contact info, preferences)
- Check if long text uses paragraphs with subheadings
- Look for phone numbers, card numbers, or codes displayed in grouped digits

**Visual Hierarchy checkpoints:**
- Check if headings, subheadings, and body text have clearly different sizes
- Verify primary action buttons are visually dominant
- Look for proper use of whitespace to separate content sections
- Check if secondary information is visually subdued

**Law of Proximity checkpoints:**
- Verify labels are closer to their associated input fields than to adjacent ones
- Check if product cards group name, price, and CTA together
- Look for navigation items within the same section being closer than items across sections

**Discoverability checkpoints:**
- Check if interactive elements are visually distinct from static content
- Look for meaningful icons with clear affordances
- Verify the interface provides feedback on user actions
- Check if new features have onboarding hints or tooltips

### Step 4: Produce the Findings Report

Structure the output as follows:

```
## Cognitive Interaction Audit: [Design Name]

### Summary
- **Principles passed**: X/10
- **Warnings**: X
- **Critical issues**: X
- **Top priority**: [Most impactful finding]

### Detailed Findings

#### [Principle Name] -- [Passed/Warning/Critical]
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

After presenting findings, load [section-1-case-studies.md](./references/section-1-case-studies.md) and reference relevant case studies to illustrate your recommendations.

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

Several principles in this section overlap with content from the 106 Cognitive Biases framework. The reference file merges these sources for a unified perspective:

- **Cognitive Load** -- expanded with cognitive load theory (intrinsic, extraneous, germane) and practical reduction strategies
- **Hick's Law** -- enriched with logarithmic decision-time relationship and category-based chunking strategies
- **Fitts's Law** -- enhanced with the mathematical relationship between target size, distance, and acquisition time
- **Progressive Disclosure** -- deepened with the concept of layered complexity and user expertise levels
