# Eval 99 — Without Skill Transcript

**Prompt:** Our design system has 200+ tokens but developers keep creating new ones instead of reusing existing ones. How do I audit our codebase for design system compliance?

**Step 1:** Suggests using grep or IDE search to find hardcoded color values (hex codes) and spacing values outside the token file.

**Step 2:** Recommends setting up ESLint rules or stylelint to enforce token usage and prevent hardcoded values in the future.

**Step 3:** Mentions reviewing components for consistency but without a structured methodology or checklist.

**Step 4:** Suggests team process improvements: PR reviews checking for token compliance, documentation of available tokens.

**Result:** Reasonable process suggestions (linting, PR reviews) and basic search techniques, but no structured audit methodology, no token deduplication, and no formal audit report.
