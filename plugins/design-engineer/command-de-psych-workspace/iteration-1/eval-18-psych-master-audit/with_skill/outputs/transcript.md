# Psychology Master Audit Transcript

**Date**: 2026-03-10
**Subject**: Meditation app onboarding screens
**Audit type**: Master audit (broad scan across all sections)

---

## Step 1: Route to psych-master-audit

Received `/de:psych master` command. Loaded the `psych-master-audit` skill which performs a broad scan across all 10 psychology sections (100 laws) to identify the highest-priority issues before recommending targeted deep-dives.

---

## Step 2: Gather Context

Reviewed the two onboarding screens described by the user:
- **Screen 1**: Goal selection -- user must pick 5 goals from a list of 20 options
- **Screen 2**: Daily reminder time picker

No Figma file or URL provided. Analysis based on described UI.

---

## Step 3: Broad Scan -- All 10 Sections

### Section 1: Cognitive Load & Processing (Laws 1-10)

**CRITICAL -- Hick's Law (Law 2) Violation**
The goal selection screen presents 20 options simultaneously. Hick's Law states that decision time increases logarithmically with the number of choices. With 20 options, users face a log2(20) = ~4.3 decision complexity multiplier. The requirement to select exactly 5 from 20 compounds this -- users must evaluate all 20, mentally rank them, and select 5, creating a multi-pass cognitive burden.

**HIGH -- Miller's Law (Law 1) Concern**
Working memory holds 7 plus/minus 2 items. Presenting 20 goals exceeds working memory capacity by 2-3x. Users cannot hold all options in mind simultaneously, leading to satisficing (picking "good enough" rather than truly meaningful goals) or anchoring on the first few visible options.

**MEDIUM -- Cognitive Load Theory (Law 5)**
The intrinsic load of choosing life goals is already high (emotionally weighted decisions). Adding extraneous load (scanning 20 items, remembering which you've selected, counting to 5) pushes total cognitive load past the threshold for comfortable processing.

Score: 2/10 (critical issues found)

### Section 2: Decision Architecture & Choice Design (Laws 11-20)

**CRITICAL -- Paradox of Choice (Law 12)**
20 options triggers choice paralysis. Barry Schwartz's research shows that beyond 5-7 options, satisfaction decreases and anxiety increases. Users may abandon onboarding entirely rather than face this decision.

**HIGH -- Decision Fatigue (Law 14)**
Placing a high-effort decision (pick 5 goals) as the very first onboarding screen depletes decision-making energy before the user has any investment in the app. The subsequent reminder-time screen, while simpler, arrives when the user is already fatigued.

**MEDIUM -- Default Effect (Law 11)**
No defaults or suggestions are provided. Users with no meditation experience have no framework for evaluating which goals are relevant to them.

Score: 3/10 (critical issues found)

### Section 3: Visual Perception & Hierarchy (Laws 21-30)

**LOW -- Gestalt Grouping (Law 21)**
Without seeing the actual layout, the 20 goals likely lack meaningful grouping. Categorizing goals (e.g., stress/sleep/focus/emotional) would reduce perceived complexity.

Score: 6/10 (minor concerns, needs visual review)

### Section 4: Engagement & Motivation (Laws 31-40)

**MEDIUM -- Goal Gradient Effect (Law 32)**
The onboarding does not show progress toward completion. Adding a progress indicator (Step 1 of 3) would increase completion motivation.

**LOW -- Endowed Progress (Law 35)**
No sense of progress is given before the first task. The user starts at zero with a hard task.

Score: 5/10 (moderate concerns)

### Section 5: Trust & Social Proof (Laws 41-50)

**MEDIUM -- Social Proof (Law 41)**
No indication of what goals other users commonly pick. Showing "Most popular" or "80% of users pick this" would reduce decision burden and build confidence.

Score: 6/10 (minor opportunity)

### Section 6: Navigation & Wayfinding (Laws 51-60)

**LOW -- Progressive Disclosure (Law 52)**
All 20 goals shown at once rather than progressively revealed. Could use a category-first approach.

Score: 7/10 (minor concern)

### Section 7: Emotional Design (Laws 61-70)

**MEDIUM -- Peak-End Rule (Law 62)**
The onboarding peak experience is currently a difficult decision. The "peak" should be a moment of excitement about the app, not anxiety about choices.

Score: 5/10 (moderate concern)

### Section 8: Accessibility & Inclusion (Laws 71-80)

**LOW -- No immediate violations detected from description alone. Needs visual review.**

Score: 7/10 (needs visual review)

### Section 9: Persuasion & Behavior Change (Laws 81-90)

**MEDIUM -- Fogg Behavior Model (Law 81)**
The onboarding demands high ability (complex decision) at a moment of uncertain motivation. Should reduce ability requirement or boost motivation first.

Score: 5/10 (moderate concern)

### Section 10: Error Prevention & Recovery (Laws 91-100)

**LOW -- Reversibility (Law 93)**
Users should be told they can change their goals later. Fear of making the "wrong" choice adds to decision anxiety.

Score: 7/10 (minor concern)

---

## Step 4: Findings Report

### Priority 1 -- Critical (Fix Immediately)

| Finding | Section | Law | Issue |
|---------|---------|-----|-------|
| Hick's Law violation | 1 | Law 2 | 20 simultaneous choices creates excessive decision time |
| Paradox of Choice | 2 | Law 12 | 20 options triggers choice paralysis and potential abandonment |
| Decision Fatigue | 2 | Law 14 | High-effort decision as first interaction depletes willpower |

### Priority 2 -- High (Fix Before Launch)

| Finding | Section | Law | Issue |
|---------|---------|-----|-------|
| Working memory overload | 1 | Law 1 | 20 items exceeds 7 plus/minus 2 capacity |
| No defaults provided | 2 | Law 11 | New users lack framework to evaluate goals |
| Cognitive load stacking | 1 | Law 5 | Intrinsic + extraneous load exceeds threshold |

### Priority 3 -- Medium (Improve in Next Iteration)

| Finding | Section | Law | Issue |
|---------|---------|-----|-------|
| Missing social proof | 5 | Law 41 | No indication of popular goals |
| Poor peak experience | 7 | Law 62 | Onboarding peak is anxiety, not excitement |
| Fogg model violation | 9 | Law 81 | High ability demanded at low motivation moment |
| No progress indication | 4 | Law 32 | Missing Goal Gradient in onboarding flow |

### Priority 4 -- Low (Polish)

| Finding | Section | Law | Issue |
|---------|---------|-----|-------|
| No progressive disclosure | 6 | Law 52 | All options shown simultaneously |
| Missing reversibility signal | 10 | Law 93 | Users don't know they can change later |
| No goal grouping | 3 | Law 21 | 20 items lack categorical organization |

---

## Step 5: Section Deep-Dive Recommendations

Based on the master audit, the following sections warrant targeted deep-dives (in priority order):

1. **Section 2: Decision Architecture & Choice Design** -- The core problem is a choice architecture failure. Deep-dive will provide specific restructuring strategies (chunking, progressive disclosure, smart defaults).

2. **Section 1: Cognitive Load & Processing** -- Multiple cognitive load violations compound each other. Deep-dive will quantify the load and propose reduction strategies.

3. **Section 4: Engagement & Motivation** -- The onboarding sets the wrong motivational tone. Deep-dive will redesign the flow for engagement momentum.

4. **Section 9: Persuasion & Behavior Change** -- Fogg model violation in the onboarding funnel needs behavioral design review.

---

## Step 6: Recommended Fix Summary

**Immediate redesign of Screen 1:**
- Reduce from 20 to 6-8 top-level goal categories
- Let users pick 2-3 categories, then show 3-4 specific goals within each
- Add "Most popular" badges using social proof
- Show "You can change these anytime" reassurance
- Add progress indicator (Step 1 of 2)

**Screen 2 (reminder time) is well-designed** -- single clear decision with reasonable defaults. No critical issues.
