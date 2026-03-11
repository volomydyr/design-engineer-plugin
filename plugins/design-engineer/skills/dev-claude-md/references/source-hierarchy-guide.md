# Source Hierarchy Guide

## Why a Hierarchy Matters

AI confidently fills in gaps with made-up information if you give it room to do so. Without a clear hierarchy, Claude might prioritize its own suggestions over your explicit decisions, or override documented requirements with "creative" interpretations.

Setting up a decision hierarchy at the very beginning establishes who (or what) has the final word when there is a conflict.

## The Hierarchy

### Level 1: User's Direct Instructions (Highest Authority)

Your own experience and explicit instructions always take priority. If you tell AI to do something a specific way, it must follow that instruction even if documentation suggests otherwise.

**Why highest weight:** You understand your project's context, constraints, and goals better than any AI model. Your decisions reflect real-world factors that documentation cannot capture.

**In practice:**
- If you say "use this approach," AI follows it without debate
- If you correct AI, the correction stands for the rest of the conversation
- AI should never override, reinterpret, or argue against your direct instructions

### Level 2: Development Status File

The development context file (e.g., `dev-status/development-context.md` or `status.md`) contains the current state of the project: what is built, what is in progress, critical warnings, and established patterns.

**Why second:** This file is the ground truth about what actually exists in the codebase. It prevents AI from suggesting features that are already built, using patterns that have been abandoned, or ignoring warnings about failed approaches.

**In practice:**
- AI reads this file at the start of every task
- Warnings in this file override general best practices
- If the status file says "do not use approach X," that overrides documentation that recommends approach X

### Level 3: Design Files

When designs exist (Figma frames, design mockups, visual references), they define the visual implementation. AI must implement designs pixel-perfect with zero creative interpretation.

**Why third:** Designs represent deliberate decisions about how the product should look and feel. They have been thought through from a user experience perspective. AI should not "improve" or "simplify" designs.

**In practice:**
- AI implements exactly what the design shows, not what it thinks would look better
- If a design seems inconsistent with existing code, AI asks the user instead of guessing
- Designs override AI's aesthetic preferences

### Level 4: Project Knowledge Documents

Planning documents (MVP Requirements, Information Architecture, Business Plan, etc.) contain the complete feature specifications and product decisions.

**Why fourth:** These documents capture decisions made during planning. They define what to build and why. AI should follow them precisely.

**In practice:**
- AI cites specific sections when implementing features
- AI never invents features not documented in these files
- If a requirement is ambiguous, AI asks for clarification instead of interpreting

### Level 5: Reference Prototypes

If you have a working prototype (e.g., from a prototype (e.g., an HTML prototype file)), it serves as a content and text reference when no formal designs exist.

**Why fifth:** Prototypes may contain placeholder content or early-stage decisions that have since been refined. They are useful for reference but should not override more authoritative sources.

### Level 6: Global Rules (Lowest in Hierarchy)

The CLAUDE.md file and agent configurations define the implementation process and technical guidelines.

**Why lowest:** These rules tell AI how to work, not what to build. They can be overridden by any of the above sources when there is a conflict.

## Enforcing the Hierarchy

### In CLAUDE.md

Include the hierarchy explicitly in your global rules file. List each level with clear labels like "highest authority" and "never override."

### In Agent Files

Each agent should reference the hierarchy and know which sources to prioritize. For example, the context analyzer should read the status file before making any recommendations.

### In Prompts

When giving instructions, you can reinforce the hierarchy by referencing specific documents:
- "Follow the layout from the Figma design for this screen"
- "Use the navigation structure from the Information Architecture document"
- "Ignore the prototype approach – I want to do it differently"

## Conflict Resolution Protocol

When two sources disagree, AI must:

1. **Identify the conflict clearly** – quote both sources
2. **State which source has higher authority** based on the hierarchy
3. **Ask the user how to proceed** – never resolve conflicts silently
4. **Wait for the user's decision** before implementing anything

### Example Conflict Report

```
CONFLICT DETECTED:
- MVP Requirements says: "Home screen shows 4 categories"
- Figma design shows: 6 categories on the home screen
- Hierarchy: Design (Level 3) vs. Documentation (Level 4) -> Design has higher authority
- Recommendation: Follow the Figma design with 6 categories
How should I proceed?
```

Even when the hierarchy suggests an answer, always confirm with the user for significant conflicts.

## Common Pitfalls

1. **AI overriding user instructions with "best practices"** – your instructions are always Level 1
2. **AI inventing features not in any document** – if it is not documented, it should not exist
3. **AI "improving" designs** – designs must be implemented exactly as shown
4. **AI ignoring status file warnings** – warnings exist because someone already learned the hard way
5. **AI resolving conflicts silently** – all conflicts must be reported to the user
