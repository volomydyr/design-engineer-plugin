---
name: de:psych
description: Psychology audit. Master audit across 100+ principles, section deep-dives, or full autonomous analysis.
argument-hint: "[master | section N | god-mode]"
---

# Psychology Audit

## Context

<context> #$ARGUMENTS </context>

Standalone psychology audit for designs, products, or ideas. Works for both reviewing existing products and guiding new designs. Covers 100 UX psychology laws merged with 106 cognitive biases.

## Approach Selection

If no approach was specified in arguments, use AskUserQuestion to ask:

**Question:** "How would you like to run the psychology audit?"

1. **Master audit** -- Broad scan across all 100+ principles, then targeted deep-dives into problem areas
2. **Section deep-dive** -- Pick a specific section to analyze in detail
3. **God mode** -- Full autonomous audit across all 100+ principles

If AskUserQuestion is not available, present options as a numbered list.

### Section Selection (for deep-dive)

If the user chose a section deep-dive, ask which section:

1. **Cognitive Basics** (Laws 1-10) -- cognitive load, progressive disclosure, recognition
2. **Visual Perception** (Laws 11-20) -- Gestalt, visual hierarchy, attention
3. **Decision Making: Core** (Laws 21-25) -- loss aversion, anchoring, confirmation bias
4. **Decision Making: Advanced** (Laws 26-30) -- scarcity, social proof, decoy effect, framing
5. **Engagement & Motivation** (Laws 31-40) -- curiosity gap, variable reward, goal gradient
6. **Emotional Design: Core** (Laws 41-45) -- peak-end rule, delighters, labor illusion
7. **Emotional Design: Advanced** (Laws 46-50) -- endowment effect, storytelling
8. **Efficiency** (Laws 51-60) -- serial position, picture superiority, chunking
9. **Behavioral Economics: Core** (Laws 61-65) -- sunk cost, reciprocity
10. **Behavioral Economics: Habits** (Laws 66-70) -- commitment, consistency, reactance

11. **Social Influence** (Laws 71-80) -- social proof, authority, liking
12. **Cognitive Biases** (Laws 81-90) -- availability heuristic, negativity bias
13. **Time & Behavior** (Laws 91-100) -- familiarity bias, shaping, aha moment

## Workflow

### Master Audit

1. Load `psych-master-audit` -- performs a broad scan
2. Based on findings, recommend specific section deep-dives
3. For each recommended section, load the corresponding skill
4. Run `meta-compound` to document findings

### Section Deep-Dive

Load the corresponding section skill:

| Section | Skill to Load |
|---------|---------------|
| 1 | `psych-cognitive-basics` |
| 2 | `psych-visual-perception` |
| 3 | `psych-decision-making-core` |
| 4 | `psych-decision-making-advanced` |
| 5 | `psych-engagement-motivation` |
| 6 | `psych-emotional-design-core` |
| 7 | `psych-emotional-design-advanced` |
| 8 | `psych-efficiency` |
| 9 | `psych-behavioral-economics-core` |
| 10 | `psych-behavioral-economics-habits` |
| 11 | `psych-social-influence` |
| 12 | `psych-cognitive-biases` |
| 13 | `psych-time-behavior` |

### God Mode

Run all section skills sequentially:

1. Load `psych-master-audit` (overview scan)
2. Load each section skill (1 through 13) in order
3. Produce a comprehensive psychology audit report
4. Run `meta-compound` to document all findings

## Agents Used

- `psych-scanner` -- broad scan across all principles
- `deliverable-writer` -- audit report production
