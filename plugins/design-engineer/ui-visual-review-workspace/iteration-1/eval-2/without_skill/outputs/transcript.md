# Eval 103 — Without Skill Transcript

**Prompt:** We deployed a new feature and the live site looks different from what we designed in Figma. Some buttons are bigger, fonts seem different, and the card layout spacing is off. Can you compare and identify all the discrepancies?

**Step 1:** Suggests inspecting the live site with browser dev tools and comparing CSS values against Figma's inspect panel for buttons, fonts, and cards.

**Step 2:** Recommends checking button padding and height, font-family/size/weight declarations, and card grid gap/padding values.

**Step 3:** Advises verifying that the correct fonts are loaded (checking for missing font imports) and that responsive breakpoints match design intent.

**Step 4:** General advice to use design tokens consistently and update any hardcoded values found during the comparison.

**Result:** Solid debugging approach addressing the specific reported issues (buttons, fonts, cards) but does not proactively scan beyond reported problems, does not check token compliance, and does not produce a structured severity-based report.
