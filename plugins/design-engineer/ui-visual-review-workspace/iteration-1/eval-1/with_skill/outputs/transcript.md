# Eval 102 — With Skill Transcript

**Prompt:** I just had Claude Code implement my Figma designs for the onboarding flow. Some things look off -- the spacing seems wrong and the colors don't match exactly. Can you do a visual review?

**Step 1:** Skill activates visual review framework. Identifies this as a Figma-to-code fidelity check — focuses on common AI-generation artifacts.

**Step 2:** Runs text casing audit: finds 4 headings using Title Case that should be sentence case per design, 2 button labels with inconsistent casing.

**Step 3:** Verifies spacing: cross-references code against design tokens, identifies 6 instances of hardcoded px values deviating from the spacing scale (e.g., padding: 18px should be spacing-4 = 16px).

**Step 4:** Checks color fidelity: finds 8 hardcoded hex colors, 3 are near-miss values (off by one digit from design tokens), 5 should use token references instead.

**Step 5:** Identifies AI creative deviations: extra card shadow not in design, border-radius increased from 8px to 12px, gradient added to button not in original Figma frame.

**Step 6:** Checks for redundant components: finds 2 onboarding step components that duplicate existing stepper component from the design system.

**Step 7:** Produces visual-review.md with file:line references, before/after values, severity levels, and specific fix commands.

**Result:** Comprehensive visual review catching text casing, spacing deviations, color mismatches, AI embellishments, and redundant components with actionable fix list.
