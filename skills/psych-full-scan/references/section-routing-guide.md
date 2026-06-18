# Section Routing Guide

Maps each book section to its corresponding skill, defines routing thresholds, and provides guidance on when and how to route users to deep-dive skills after the master scan.

---

## Section-to-Skill Mapping

| Section | Laws | Skill Name | Focus Area |
|---------|------|------------|------------|
| 1. Fundamentals of Cognitive Interaction | 1-10 | `psych-cognitive-load` | Mental load, choices, memory capacity, visual hierarchy, proximity, discoverability |
| 2. Visual Perception and Attention Focus | 11-20 | `psych-visual-perception` | Selective attention, banner blindness, contrast, visual anchors, similarity, serial position |
| 3. Psychology of Decision-Making | 21-30 | `psych-decision-fundamentals` | Loss aversion, decision fatigue, anchoring bias, confirmation bias, default bias, scarcity, social proof, authority bias, framing, availability heuristic |
| 4. Engagement and Motivation | 31-40 | `psych-engagement-patterns` | Flow state, variable reward, goal gradient, curiosity gap, aha moment, investment loops, triggers, Zeigarnik effect, feedback loops |
| 5. Emotional Design | 41-50 | `psych-delight-design` | Peak-end rule, delighters, sensory appeal, labor illusion, IKEA effect, endowment effect, fresh start effect, storytelling effect, spacing effect, feedforward |
| 6. Efficiency Principles | 51-60 | `psych-simplification` | Tesler's law, signifiers, skeuomorphism, Occam's razor, method of loci, exit points, law of the instrument, second-order effects, Weber's law, unit bias |
| 7. Behavioral Economics | 61-70 | `psych-pricing-psychology` | Decoy effect, sunk cost effect, hyperbolic discounting, cashless effect, Pareto principle, commitment and consistency, reciprocity, temptation bundling, pseudo-set framing, noble edge effect |
| 8. Social Influence | 71-80 | `psych-social-influence` | Bandwagon effect, false consensus, group attractiveness, Hawthorne effect, observer-expectancy, spotlight effect, Streisand effect, Barnum-Forer effect, reactance, self-serving bias |
| 9. Cognitive Biases and Self-Perception | 81-90 | `psych-cognitive-biases` | Curse of knowledge, Dunning-Kruger, planning fallacy, cognitive dissonance, hindsight bias, backfire effect, survey bias, expectations bias, negativity bias, empathy gap |
| 10. Time and Behavior Management | 91-100 | `psych-time-perception` | Parkinson's law, chronoception, singularity effect, halo effect, spark effect, familiarity bias, juxtaposition, survivorship bias, attentional bias, shaping |

---

## Routing Decision Criteria

### When to Recommend a Deep Dive

Route the user to a section skill when ANY of these conditions are met:

1. **3 or more findings in a single section** – indicates a pattern of issues that requires systematic analysis
2. **1 or more HIGH severity findings in a section** – even a single high-severity finding warrants deeper investigation
3. **User explicitly requests** – the user asks about topics covered by a specific section regardless of finding count
4. **Cross-section pattern** – findings in one section suggest issues in a related section (see cross-section relationships below)

### When NOT to Route

- **0-1 LOW findings in a section** – the quick recommendation in the master scan report is sufficient
- **Single MEDIUM finding with obvious fix** – provide the fix inline rather than routing to a full deep dive
- **User is in targeted mode and did not select the section** – respect the user's scope choice

---

## Cross-Section Relationships

Findings in one section often indicate issues in related sections. Use these relationships to suggest additional deep dives:

### Cluster: Information Processing (Sections 1 + 2 + 6)
- Cognitive load issues (Section 1) almost always co-occur with visual hierarchy problems (Section 2) and efficiency violations (Section 6)
- If 2+ findings across these three sections, recommend reviewing all three

### Cluster: Decision & Conversion (Sections 3 + 7)
- Decision-making principles (Section 3) and behavioral economics (Section 7) both affect conversion paths
- Pricing page issues typically span both sections
- If findings appear in either, check the other

### Cluster: Engagement & Emotion (Sections 4 + 5)
- Engagement mechanics (Section 4) and emotional design (Section 5) together determine how users feel about the product
- Onboarding issues typically span both sections
- If 2+ findings across these sections, recommend reviewing both

### Cluster: Trust & Social (Sections 3 + 8)
- Social proof (Section 3, Laws 26-30) and social influence (Section 8) both affect trust
- If trust-related findings appear, check both sections

### Cluster: Consistency & Expectations (Sections 6 + 9 + 10)
- Efficiency patterns (Section 6), cognitive biases about expectations (Section 9), and familiarity (Section 10) all relate to how well the interface matches what users expect
- If consistency or expectation issues appear, check all three

---

## Routing Message Templates

Use these templates when recommending deep dives to the user:

### High-Priority Routing (3+ findings or any HIGH severity)
```
**Section [N]: [Name]** has [count] findings ([high-count] high priority).
This section covers [brief description of what principles address].
A deep dive with `psych-[skill-name]` will provide principle-by-principle analysis
with specific recommendations and good/bad examples for your design.
```

### Medium-Priority Routing (2 findings, all MEDIUM)
```
**Section [N]: [Name]** has [count] findings worth exploring.
Running `psych-[skill-name]` would uncover additional optimization opportunities
around [specific topic area].
```

### Cross-Section Routing
```
Findings in **Section [N]** suggest related issues in **Section [M]**.
These sections form a [cluster name] cluster – reviewing both provides
a more complete picture of [what the cluster addresses].
```

---

## Routing Priority Order

When multiple sections qualify for deep dives, recommend them in this priority:

1. **Sections with HIGH severity findings** – ordered by number of HIGH findings (most first)
2. **Sections with 3+ total findings** – ordered by finding count
3. **Cross-section cluster recommendations** – based on relationship patterns
4. **Sections with 2 MEDIUM findings** – as optional follow-ups

Present the top 2-3 recommendations as the primary suggestion. List remaining qualified sections as optional follow-ups.

---

## Context Passing

When routing to a section skill, pass the following context so the deep dive starts informed:

1. **Design context** – product type, audience, screens/flows being reviewed
2. **Findings from the master scan** – specific observations for that section, including:
   - Which principles were flagged
   - Whether each was a violation or missed opportunity
   - The severity classification
   - Any specific UI elements or flows involved
3. **User notes** – any concerns or priorities the user mentioned
4. **Related findings from other sections** – if cross-section patterns were detected

This ensures the section skill does not repeat the master scan work and can immediately dive deeper into the specific issues identified.

---

## Autopilot Execution Order

When running all sections autonomously (Autopilot), execute in this order for optimal flow:

1. `psych-cognitive-load` (Section 1) – foundational layer, findings inform all others
2. `psych-visual-perception` (Section 2) – visual layer analysis
3. `psych-simplification` (Section 6) – interaction mechanics
4. `psych-decision-fundamentals` (Section 3) – decision and persuasion patterns
5. `psych-engagement-patterns` (Section 4) – engagement layer
6. `psych-delight-design` (Section 5) – emotional foundations and advanced patterns
7. `psych-pricing-psychology` (Section 7) – economic and habit patterns
8. `psych-social-influence` (Section 8) – social layer
9. `psych-cognitive-biases` (Section 9) – bias identification
10. `psych-time-perception` (Section 10) – time and behavior polish

This order ensures foundational findings (cognitive load, visual hierarchy, efficiency) are established before evaluating higher-level patterns (engagement, emotion, social influence) that depend on the foundations being sound.
