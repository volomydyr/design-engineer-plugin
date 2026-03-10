# Eval 99 — With Skill Transcript

**Prompt:** Our design system has 200+ tokens but developers keep creating new ones instead of reusing existing ones. How do I audit our codebase for design system compliance?

**Step 1:** Skill activates design system audit mode. Loads existing token definitions and establishes the compliance baseline.

**Step 2:** Scans codebase for hardcoded values: finds 34 files with hex colors outside token files, 22 files with raw px spacing, 8 files with inline font declarations.

**Step 3:** Cross-references found values against existing tokens — identifies that 70% of hardcoded values have exact token matches that developers ignored.

**Step 4:** Audits token set itself: finds 18 near-duplicate tokens (same or similar values under different names), recommends consolidation to reduce token bloat.

**Step 5:** Flags 12 files where developers defined ad-hoc local tokens instead of importing from the design system. Lists specific files and line ranges.

**Step 6:** Checks component consistency: identifies 6 components using non-standard spacing, 4 using off-palette colors, 3 with inconsistent border radius.

**Step 7:** Produces design-system-audit.md with categorized violations, file-level findings, token consolidation plan, and prioritized remediation roadmap.

**Result:** Comprehensive compliance audit with codebase scan, token deduplication, component consistency check, and actionable remediation report.
