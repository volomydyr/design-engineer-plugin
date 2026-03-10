# Persona Framework

## Overview

This framework combines traditional persona structure with the BMap motivation model (Hope, Pain, Barrier) to create personas that capture not just who the user is, but what drives and blocks their behavior.

A persona directly depends on your product. There is no single list of characteristics that always works. Start with a proto-persona (your best educated guess), then refine it as real data comes in from surveys, interviews, and testing.

---

## Document Structure

### 1. Persona Identity

| Field | Content |
|-------|---------|
| Name | A realistic name (not "User A") |
| Role | Job title or primary occupation |
| Experience | Years of experience, career stage |
| Context | Employment type, company size, industry |
| One-line summary | A single sentence that captures who this person is |

**Example:**
> Olena, 28, mid-level product designer at a mid-size tech company. Three years in design, recently started exploring AI tools but unsure where to start.

---

### 2. Background and Context

Describe the user's situation in 3-5 sentences. Include:

- Their professional environment (team size, company culture, remote/office)
- Their current skill level relative to the problem area
- External factors that affect their ability to address the problem (time, money, motivation)
- How long they have been dealing with this problem

---

### 3. Behaviors

Describe observable actions, not intentions. Focus on:

- **Current problem-solving approach**: What they actually do today when they encounter the problem
- **Tool usage**: Specific products, apps, or workarounds they rely on
- **Decision patterns**: How they choose between options (research-driven, peer recommendation, trial and error)
- **Time investment**: How much time they currently spend on the problem area
- **Learning habits**: How they acquire new knowledge or skills related to the problem

**Anti-pattern:** "They want to improve" is not a behavior. "They save learning links in browser tabs and Telegram channels but rarely return to them" is a behavior.

---

### 4. BMap Motivation Analysis

The BMap framework uses three key questions to understand what drives and blocks behavior. Adapt the bracketed parts to match your specific product and problem.

#### 4.1 Hope (The Magic Wand Question)

> "If you had a magic wand and could instantly [achieve the value your product promises], how would it change your life?"

This question reveals the user's underlying motivation – what they truly want to achieve. Document:

- **Surface desire**: What they say they want (e.g., "learn new skills faster")
- **Deeper motivation**: What achieving this would actually mean for them (e.g., "feel confident applying for senior roles")
- **Emotional payoff**: How success would make them feel (e.g., "less anxious about falling behind peers")

#### 4.2 Pain (The Last Attempt Question)

> "Tell me about the last time you tried to [do the action your product enables]. What happened? What stopped you from reaching your goal?"

This question uncovers the friction in their current experience. Document:

- **What they tried**: Specific actions they took
- **Where it broke down**: The exact moment things went wrong
- **Emotional response**: How the failure made them feel
- **Consequence**: What they lost (time, money, opportunity, confidence)

#### 4.3 Barrier (The Biggest Challenge Question)

> "What is your biggest difficulty when it comes to [the problem your product solves]? Why is it so hard?"

This question identifies what stands between the user and success. Document:

- **Primary barrier**: The single biggest obstacle
- **Root cause**: Why this barrier exists (lack of time, knowledge, motivation, or resources)
- **Failed solutions**: What they have tried to overcome this barrier and why it did not work

---

### 5. Pain Points

List 3-5 specific pain points, ordered from most to least severe. For each one:

| Pain Point | Severity (1-5) | Frequency | Current Workaround |
|-----------|----------------|-----------|-------------------|
| [Specific pain] | [Rating] | [Daily/Weekly/Monthly] | [What they do instead] |

---

### 6. Goals

List 3-5 goals the user wants to achieve, split into:

**Immediate goals** (next 1-3 months):
- What they want to accomplish in the short term
- Why it matters right now

**Aspirational goals** (next 6-12 months):
- Where they see themselves heading
- What achieving this would unlock for them

---

### 7. Why Your Product Idea Fails Without This Understanding

If users are not doing what you expect, it is usually because of one of three reasons:

1. **Low motivation**: They do not care enough about the result. Your product might solve a problem they do not actually prioritize.
2. **Too complex**: Your solution requires too much time, money, or mental effort. Even if the result is desirable, the path is too hard.
3. **No trigger**: They do not know when or how to act. There is no clear call to action at the right moment.

Document which of these three risks applies to your persona and how your product should address it.

---

### 8. Assumptions vs. Confirmed Knowledge

Clearly mark what is assumed versus what is validated:

| Claim | Status | Evidence |
|-------|--------|----------|
| [Statement about the user] | Assumed / Confirmed | [Source: survey, interview, observation, or "needs validation"] |

This table should be updated after each research activity. Proto-personas start with mostly "Assumed" entries. The goal is to gradually replace assumptions with confirmed knowledge.

---

### 9. Persona Evolution Log

| Version | Date | What Changed | Based On |
|---------|------|-------------|----------|
| v1 | [Date] | Initial proto-persona | Founder's assumptions |
| v2 | [Date] | [Specific change] | [Survey results / interview / testing] |

---

## Multiple Personas

If your product serves meaningfully different user groups, create separate personas for each. However:

- Start with your **primary persona** – the person who benefits most from your product
- Add secondary personas only when you have evidence they represent a distinct group with different needs
- For MVP purposes, design for the primary persona first
- Limit yourself to 2-3 personas maximum at the early stage
