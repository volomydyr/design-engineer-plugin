# Assumptions and Hypotheses Template

## Document Structure

This is a living document. It should be updated after every research activity, pivot, or significant insight. Assumptions that remain untested for too long become dangerous blind spots.

---

## 1. Assumption Categories

Organize all assumptions into four categories, based on the structured approach from Lean UX by Jeff Gothelf.

### 1.1 User Assumptions

Beliefs about who your users are and what they experience.

**Guiding prompts:**
- "My early users are..."
- "They struggle with..."

| ID | Assumption | Risk Level | Status | Evidence |
|----|-----------|------------|--------|----------|
| U1 | [Statement about users] | High/Med/Low | Unvalidated/Confirmed/Invalidated | [Source or "needs validation"] |
| U2 | ... | ... | ... | ... |

### 1.2 Product Assumptions

Beliefs about how the product should work and what features matter.

**Guiding prompts:**
- "These problems can be solved with..."
- "The most important features are..."
- "The main value of my product is..."
- "This is what it should look like..."

| ID | Assumption | Risk Level | Status | Evidence |
|----|-----------|------------|--------|----------|
| P1 | [Statement about product] | High/Med/Low | Unvalidated/Confirmed/Invalidated | [Source or "needs validation"] |
| P2 | ... | ... | ... | ... |

### 1.3 Business Assumptions

Beliefs about revenue, growth, and market positioning.

**Guiding prompts:**
- "I will get most of my users through..."
- "I will make money by..."
- "My main competitors are..."
- "The biggest risk for my product is..."
- "I can avoid this risk by..."

| ID | Assumption | Risk Level | Status | Evidence |
|----|-----------|------------|--------|----------|
| B1 | [Statement about business] | High/Med/Low | Unvalidated/Confirmed/Invalidated | [Source or "needs validation"] |
| B2 | ... | ... | ... | ... |

---

## 2. Converting Assumptions to Hypotheses

Every high and medium-risk assumption should be converted into a testable hypothesis using one of two formulas:

### Formula 1: Belief-based hypothesis

> "I believe [assumption is true/false], and I can find out by [research method]."

**Example:**
> "I believe that tech professionals save learning resources in browser tabs and Telegram chats but rarely return to them, and I can find out by conducting a survey asking about their current learning resource management habits."

### Formula 2: Outcome-based hypothesis

> "I will achieve [result] if [user group] gets [value] by using [functionality]. I can validate this through [research method]."

**Example:**
> "I will achieve 70% onboarding completion if mid-level designers get a personalized skill gap analysis by completing a 5-minute assessment. I can validate this through unmoderated usability testing with 10 participants."

---

## 3. Hypothesis Table

| ID | Hypothesis | Source Assumption | Validation Method | Priority | Status | Result |
|----|-----------|-------------------|-------------------|----------|--------|--------|
| H1 | [Testable statement] | [U1/P2/B3/etc.] | [Survey/Interview/Test/Analytics] | High/Med/Low | Planned/In Progress/Complete | [Confirmed/Invalidated/Inconclusive] |
| H2 | ... | ... | ... | ... | ... | ... |

---

## 4. Value-Risk Prioritization Matrix

Plot each hypothesis on this matrix to determine testing order:

```
        High Value
            |
    II      |      I
  (Test     |   (Test
  second)   |   FIRST)
            |
 -----------+----------- High Risk
            |
    IV      |     III
  (Parking  |   (Test
   lot)     |   third)
            |
        Low Value
```

- **Quadrant I (High Value + High Risk)**: Test these first. They have the biggest impact and the highest uncertainty.
- **Quadrant II (High Value + Low Risk)**: Test second. Important but less likely to be wrong.
- **Quadrant III (Low Value + High Risk)**: Test third. Not critical but could cause problems if wrong.
- **Quadrant IV (Low Value + Low Risk)**: Move to parking lot. Not worth testing right now.

---

## 5. Testing Notes

Testing everything at once is too complex for both you and respondents. Key principles:

- Prioritize before each research cycle
- Test 3-5 hypotheses per research round, not all at once
- When asking about behavior, always ask about the past, not the future. "Have you used..." beats "Would you use..."
- After each round, update this document: mark confirmed, invalidated, and inconclusive hypotheses
- New hypotheses are added continuously – this is never a "done" document

