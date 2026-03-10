# MVP Prioritization Framework

## Overview

This framework uses the ICE model to prioritize features and produce a clear MVP scope document. The goal is to define the smallest product version that delivers real value and validates your core hypothesis.

---

## 1. Feature Inventory

List every feature idea before prioritizing. Include features from all sources: your own ideas, user research, competitive analysis, and stakeholder requests.

| ID | Feature | Source | Category |
|----|---------|--------|----------|
| F1 | [Feature name] | [Where this idea came from] | [Core / Enhancement / Nice-to-have] |
| F2 | ... | ... | ... |

---

## 2. ICE Scoring

Score each feature from 1-10 on three dimensions, then multiply for the total score.

### Scoring Guide

**Impact (1-10):** How much do users need this feature?
- 1-3: Minor convenience, users can work without it
- 4-6: Noticeable improvement to the experience
- 7-9: Significantly affects whether users get value from the product
- 10: Without this, the product does not work at all

**Confidence (1-10):** How sure are you this will be valuable?
- 1-3: Pure guess, no evidence
- 4-6: Some indirect evidence (competitor has it, a few users mentioned it)
- 7-9: Strong evidence from research (survey data, interview insights)
- 10: Validated through testing with real users

**Ease (1-10):** How easy is it to design and build?
- 1-3: Major technical challenge, requires new infrastructure or expertise
- 4-6: Moderate effort, feasible but requires significant work
- 7-9: Straightforward implementation with known tools and patterns
- 10: Trivial to implement, can be done in hours

### ICE Scoring Table

| ID | Feature | Impact | Confidence | Ease | ICE Score | Priority |
|----|---------|--------|------------|------|-----------|----------|
| F1 | [Feature] | [1-10] | [1-10] | [1-10] | [I x C x E] | [Rank] |
| F2 | ... | ... | ... | ... | ... | ... |

Sort by ICE score descending. Draw the MVP line where cumulative effort exceeds your capacity.

---

## 3. MVP Scope Definition

### 3.1 Must-Have Features (Ships in v1)

Features above the MVP line. Each must have acceptance criteria.

| Feature | Acceptance Criteria | ICE Score | Estimated Effort |
|---------|-------------------|-----------|-----------------|
| [Feature name] | [Specific, testable criteria for "done"] | [Score] | [Hours/Days] |
| ... | ... | ... | ... |

**Acceptance criteria guidelines:**
- Must be specific and testable (not "works well" but "user can complete onboarding in under 3 minutes")
- Must define the minimum viable version (not the ideal version)
- Must include edge cases that matter for launch

### 3.2 Nice-to-Have Features (Post-launch backlog)

Features that scored well but did not make the MVP cut.

| Feature | ICE Score | Why Not MVP | When to Reconsider |
|---------|-----------|------------|-------------------|
| [Feature name] | [Score] | [Specific reason] | [Trigger for inclusion] |

### 3.3 Parking Lot

Ideas that are interesting but do not solve the core user problem for the MVP. These are not rejected -- they are deferred.

| Feature | Reason for Parking | Revisit When |
|---------|-------------------|-------------|
| [Feature name] | [Why it does not belong in MVP] | [Condition for reconsidering] |

---

## 4. Constraints Documentation

Define the boundaries that shape MVP scope:

| Constraint | Details | Impact on Scope |
|-----------|---------|----------------|
| Timeline | [When you need to launch] | [What this forces you to cut] |
| Budget | [Available financial resources] | [What you can afford to build] |
| Team | [Who is building this and their skills] | [What is technically feasible] |
| Technology | [Tech stack limitations or requirements] | [What is possible/impossible] |

---

## 5. Free vs. Paid Boundaries (If Applicable)

If your business model includes a free tier, define the MVP boundaries for each:

| Aspect | Free Tier | Paid Tier |
|--------|----------|----------|
| Features included | [List] | [List] |
| Usage limits | [Specific limits] | [Limits or "unlimited"] |
| Value delivered | [What free users get] | [Additional value for paid] |
| Upgrade trigger | [What motivates the switch] | N/A |

Think about limits early. Define what the free plan includes, how it differs from paid, what limits exist, and how you motivate users toward upgrading.

---

## 6. Validation Goal

State clearly what the MVP needs to prove:

> **Primary hypothesis to validate:** [One clear statement]
>
> **Success metrics:** [How you will measure whether the hypothesis is confirmed]
>
> **Minimum viable data:** [How many users / how much time you need to draw a conclusion]

---

## 7. Scope Creep Prevention

Rules to keep the MVP scope from growing:

1. **The "one feature" test**: If someone suggests adding a feature, ask "Could we launch without it?" If yes, it goes to the parking lot.
2. **The effort check**: If a feature takes more than [X days] to build, it needs a very strong justification to stay in MVP.
3. **The user test**: If your primary persona would not notice the feature missing, it is not MVP.
4. **The competitor check**: If no competitor offers this at their basic level, you probably do not need it for MVP either.
5. **The "ship it" rule**: A shipped MVP that is 60% of your vision beats an unshipped product that is 100% of your vision.

---

## 8. Evolution Log

| Version | Date | Changes | Trigger |
|---------|------|---------|---------|
| v1 | [Date] | Initial MVP requirements | Feature inventory + ICE prioritization |
| v2 | [Date] | [What changed] | [User testing results / technical discovery / business pivot] |
