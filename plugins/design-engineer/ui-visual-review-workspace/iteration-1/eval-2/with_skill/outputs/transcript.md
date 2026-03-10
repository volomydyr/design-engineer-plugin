# Eval 103 — With Skill Transcript

**Prompt:** We deployed a new feature and the live site looks different from what we designed in Figma. Some buttons are bigger, fonts seem different, and the card layout spacing is off. Can you compare and identify all the discrepancies?

**Step 1:** Skill activates visual review in comparison mode. Establishes design-to-implementation fidelity check across three reported areas: buttons, fonts, card spacing.

**Step 2:** Button audit: live buttons use py-3 px-6 (48px total height) vs design spec py-2 px-4 (36px). Flags as P0 — visible to every user.

**Step 3:** Typography audit: live site missing Inter font import (falling back to system fonts), body text at 16px vs design 14px, heading weight 700 vs design 600.

**Step 4:** Card spacing audit: gap between cards is 24px vs design 16px, card internal padding 24px vs design 20px, border-radius 16px vs design 12px.

**Step 5:** Expands beyond reported issues: finds 11 hardcoded values that should use tokens, 3 wrong-token references, 2 components that bypass design system.

**Step 6:** Produces visual-review.md organized by severity: 4 P0 (button sizing, font import, card gap, card padding), 5 P1, 6 P2 with file:line references and fix commands.

**Result:** Comprehensive design fidelity review covering reported issues plus proactive discovery, organized by severity with actionable fixes.
