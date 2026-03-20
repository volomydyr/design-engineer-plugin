# Information Architecture Deliverable Template

## Overview

This template structures the product's information architecture into a clear blueprint for design and development. The IA should be simple enough that anyone on the team can understand the product's structure at a glance.

Keep it short and simple (KISS). Limit to four levels of depth maximum. A plain text hierarchy or a simple diagram works just as well as a fancy visual tool.

---

## 1. Screen Inventory

List every screen in the product, organized by section.

| ID | Screen Name | Section | Purpose | User State |
|----|------------|---------|---------|------------|
| S01 | [Name] | [Section] | [What the user does here] | [First-time / Returning / All] |
| S02 | ... | ... | ... | ... |

**Tips:**
- Use consistent naming conventions (verb + noun: "View Profile," "Edit Settings")
- Include empty states, error states, and loading states as separate entries if they have distinct designs
- Mark screens that only appear for specific user states (free vs. paid, first-time vs. returning)

---

## 2. Navigation Structure

### 2.1 Primary Navigation

The top-level sections accessible from the main navigation element.

```
[Product Name]
|
|-- [Section 1]
|-- [Section 2]
|-- [Section 3]
|-- [Section 4]
```

### 2.2 Full Hierarchy

Expand each section to show the complete navigation tree. Limit to 4 levels maximum.

```
[Product Name]
|
|-- Level 1: [Section Name]
|   |-- Level 2: [Sub-section]
|   |   |-- Level 3: [Detail View]
|   |   |   |-- Level 4: [Action / Modal]
|   |-- Level 2: [Sub-section]
|
|-- Level 1: [Section Name]
|   |-- Level 2: [Sub-section]
```

**Example (learning app):**

```
PDPro
|
|-- Onboarding
|   |-- Step 1: Role & Experience
|   |   |-- Questions
|   |   |   |-- Answer Options
|   |-- Step 2: Learning Preferences
|   |   |-- Questions
|   |   |   |-- Answer Options
|   |-- Step 3: Goal Setting
|
|-- Home
|   |-- Skill Profile
|   |   |-- Skill Details
|   |-- Active PDP
|   |   |-- Learning Resource
|   |   |   |-- Notes
|   |-- Progress Overview
|
|-- Library
|   |-- All Resources
|   |-- Saved Items
|   |-- Import Resources
|
|-- Profile
|   |-- Account Settings
|   |-- Subscription
|   |-- Notifications
```

### 2.3 Navigation Model

Describe the navigation pattern:

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Pattern | [Tab bar / Sidebar / Hamburger / Other] | [Why this pattern] |
| Number of top-level items | [Number] | [Why this number] |
| Mobile adaptation | [How navigation changes on mobile] | [Rationale] |
| Persistent elements | [What stays visible across all screens] | [Why] |

---

## 3. User Flows

### 3.1 Primary Flow (Critical Path)

The most important path from entry to core value. Document step by step:

```
[Entry point] --> [Screen A] --> [Screen B] --> [Screen C] --> [Core Value Delivered]
```

For each step:

| Step | Screen | User Action | System Response | Success Criteria |
|------|--------|------------|----------------|-----------------|
| 1 | [Screen name] | [What user does] | [What system does] | [How we know it worked] |
| 2 | ... | ... | ... | ... |

### 3.2 Secondary Flows

Other important paths through the product:

**Flow: [Name]**
```
[Start] --> [Step 1] --> [Step 2] --> [End]
```

**Flow: [Name]**
```
[Start] --> [Step 1] --> [Step 2] --> [End]
```

### 3.3 Edge Case Flows

Document what happens in non-ideal scenarios:

| Scenario | Current Screen | What Happens | Where User Goes |
|----------|---------------|-------------|----------------|
| Empty state (no content) | [Screen] | [What is shown] | [Next action] |
| Error / failure | [Screen] | [Error handling] | [Recovery path] |
| Limit reached (free tier) | [Screen] | [Upgrade prompt] | [Paywall / explanation] |
| Offline / no connection | [Screen] | [Fallback behavior] | [Cached content / error] |

---

## 4. Content Hierarchy

### 4.1 Content Types

| Content Type | Where It Appears | Priority | Source |
|-------------|-----------------|----------|--------|
| [Type: cards, lists, text blocks, etc.] | [Which screens] | [Primary / Secondary / Tertiary] | [User-generated / System / External] |

### 4.2 Information Priority Per Screen

For each key screen, define what information is most important:

**Screen: [Name]**

| Priority | Content Element | Purpose |
|----------|----------------|---------|
| 1 (highest) | [Element] | [Why this is most important] |
| 2 | [Element] | [Why] |
| 3 | [Element] | [Why] |

---

## 5. Platform Considerations

### 5.1 Mobile-First Approach

If designing mobile-first (recommended), document:

- What the mobile navigation looks like
- How content adapts to smaller screens
- What features are mobile-only or desktop-only (if any)
- Touch targets and gesture considerations

### 5.2 Responsive Breakpoints (If Applicable)

| Breakpoint | Navigation Change | Layout Change |
|-----------|------------------|--------------|
| Mobile (<768px) | [e.g., Bottom tab bar] | [e.g., Single column] |
| Tablet (768-1024px) | [e.g., Sidebar appears] | [e.g., Two columns] |
| Desktop (>1024px) | [e.g., Full sidebar] | [e.g., Multi-column] |

---

## 6. IA Validation Checklist

Before finalizing, verify:

- [ ] Every MVP feature has a screen or location in the IA
- [ ] No navigation path exceeds 4 levels deep
- [ ] The primary user flow reaches core value in 3-5 steps or fewer
- [ ] Naming is consistent and clear (no jargon, no ambiguity)
- [ ] Empty states, errors, and edge cases are accounted for
- [ ] The structure makes sense for the primary platform (mobile or desktop)
- [ ] A new team member could understand this document without explanation

---

## 7. Evolution Log

| Version | Date | Changes | Trigger |
|---------|------|---------|---------|
| v1 | [Date] | Initial IA based on MVP requirements | MVP scope defined |
| v2 | [Date] | [What changed] | [User testing / development constraints / new features] |
