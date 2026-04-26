# v2.6.7 — Add target platform/viewport to dev-prototyping

## Context

Tester asked for a responsive website. Plugin generated a desktop browser page with a mobile-phone-shaped mockup floating in the center surrounded by cream space, plus desktop chrome (language switcher top-right, footer at bottom). Bug: the prototype is mobile-shaped when it should be a full-bleed responsive layout.

Root cause: `dev-prototyping/SKILL.md` never asks the user what target platform / viewport to design for. Step 1 only asks product vs landing page. The Step 4 prototype brief covers design intent, screens, features, navigation, styling — but no field for "is this a mobile app, a responsive web app, or a desktop web app?". Without an explicit platform signal, Claude guesses; the guess is biased toward mobile-frame layouts (likely because most modern app prototypes are mobile-first), so even when the user says "responsive website" mid-conversation, the Step 5 generator builds a mobile-shaped HTML and wraps it in a desktop chrome.

User picked **Option A**: add a platform question, lock it into the prototype brief, and add an anti-pattern flag for "mobile mockup floating in desktop frame" so the Step 5 self-review catches drift.

## Architectural decisions

- **Add the platform question as a new Step 1.5** (between Step 1 Scope and Step 2 Gather context). This keeps Step 1 focused on what to prototype and makes platform a visible, separate decision the user must make explicitly.
- **Lock the chosen platform into the Step 4 prototype brief** as a new "Target platform" field. The brief is the source of truth that the storyboard (Step 5) and interactive prototype (Step 6) read from. Putting it there means it survives the iteration loop.
- **Add a hard rule in Step 5**: when target is "Responsive web" or "Desktop web", layouts MUST fill the viewport. No centered phone-shaped mockup wrappers. No `max-width: 414px` or similar mobile-shaped constraints. No "fake-iphone" CSS frames.
- **Add a new anti-pattern** to `ui-aesthetic-review/references/anti-patterns.md` under the Mobile App Anti-Patterns (2026) section: "Mobile mockup floating in desktop frame — when the target is a responsive or desktop web product, do NOT wrap the UI in a centered phone-shaped container with empty space around it. Layouts must fill the viewport. This is the 'I built it mobile-first and ran out of time to design the desktop version' tell."
- **No platform inference from planning docs.** Option C was rejected — explicit ask is more reliable than inference. The user picked Option A which means explicit.

## Phase 1: Implementation

**Objective**: Add target platform question, brief field, Step 5 hard rule, and anti-pattern entry. Ship as v2.6.7.

**Depends on**: none

**Files to modify**:
- `skills/dev-prototyping/SKILL.md`:
  - Insert new "Step 1.5: Target platform" section between Step 1 Scope and Step 2 Gather context. AskUserQuestion with 4 options: Mobile app / Responsive web / Desktop web / Both (mobile + web).
  - Update Step 4 prototype brief to include a "Target platform" field at the top (above Design intent), so the brief explicitly carries the choice into Step 5.
  - Update Step 5 (Visual storyboard) "How to generate" subsection to include a hard rule: "If target platform is Responsive web or Desktop web, layouts MUST fill the viewport. NEVER wrap content in a centered phone-shaped container, NEVER apply max-width: 414px / 375px / similar mobile-frame constraints, NEVER add a 'fake-iphone' chrome around the UI. If target is Mobile app, design at mobile viewport (375–414px) without desktop wrapping. If target is Both, generate two separate sets of screens — mobile viewport AND full-width responsive — never mix them in one layout."
  - Update Step 1 announce-execution-plan list to mention the platform step (renumber).
- `skills/ui-aesthetic-review/references/anti-patterns.md`:
  - Add new anti-pattern under "Mobile App Anti-Patterns (2026)" section: "Mobile mockup floating in desktop frame".
- `.claude-plugin/plugin.json`, `marketplace.json` — bump 2.6.6 → 2.6.7.
- `CHANGELOG.md` — add 2.6.7 entry under Fixed and Changed.
- `README.md` — bump banner.

**Reuse**:
- Step 1's existing AskUserQuestion pattern (`multiSelect: false` block) as the template for Step 1.5.
- Step 4 brief's existing presentation structure — just add a row.
- The existing anti-pattern format in `anti-patterns.md` — short rule + brief explanation.

**Checklist**:
- [ ] Insert Step 1.5 with the AskUserQuestion (4 options, multiSelect: false) and a BLOCKING REQUIREMENT line
- [ ] Update Step 1 announce-execution-plan list (Step 0 item 1) to include the platform step
- [ ] Add "Target platform" field to Step 4 brief (top of the synthesis list AND the user-facing brief block)
- [ ] Add hard rule to Step 5 "How to generate" (just before/after the anti-pattern read)
- [ ] Add new anti-pattern to anti-patterns.md
- [ ] Bump plugin.json + marketplace.json to 2.6.7
- [ ] Add CHANGELOG 2.6.7 entry
- [ ] Bump README banner
- [ ] Validate JSON manifests
- [ ] Grep verify: 0 references to "mobile-shaped wrapper" or "centered phone frame" remain that contradict the new rule

**QA**:
1. JSON manifests valid: `python3 -m json.tool .claude-plugin/plugin.json`, `marketplace.json`.
2. Diff review: `git diff skills/dev-prototyping/SKILL.md` — Step 1.5 exists, Step 4 has Target platform, Step 5 has the hard rule.
3. Diff review: `git diff skills/ui-aesthetic-review/references/anti-patterns.md` — new entry under Mobile App Anti-Patterns (2026).
4. Manual reasoning check: trace a hypothetical "responsive web" run through the updated SKILL.md — does Step 1.5 lock the platform? Does Step 4 brief carry it? Does Step 5 enforce the no-mobile-frame rule? All three must answer yes.
5. CHANGELOG, plugin.json, marketplace.json, README all read 2.6.7.

## Risk assessment

- **Risk**: New mandatory question adds friction for users who don't care about platform (e.g., obvious mobile app from context). **Mitigation**: question is one click, has a clear default ("Mobile app" first since most app prototypes are mobile), and only fires once per prototype run. Worth the friction to prevent the bug.
- **Risk**: "Responsive web" vs "Desktop web" distinction confuses users. **Mitigation**: option descriptions are explicit ("Responsive — adapts from desktop down to mobile" vs "Desktop — fixed-width, ≥1024px primary viewport").
- **Risk**: Step 5 hard rule conflicts with cases where a mobile mockup IS appropriate (e.g., user is showing how a mobile app would look during a desktop-website investor pitch). **Mitigation**: rule is conditional on the chosen platform — if "Mobile app" was chosen, the mobile-shaped layout IS allowed. The rule only forbids mixing.
- **Risk**: Anti-pattern text might trigger false positives during self-review if a user legitimately wants a phone-shaped showcase. **Mitigation**: anti-pattern is also conditional — phrased as "when target is responsive or desktop web", so it only fires when the platform is set to those.

## Verification (end-to-end)

After v2.6.7 lands:
1. JSON manifests valid, all four manifest/banner reads `2.6.7`.
2. `dev-prototyping/SKILL.md` has Step 1.5 with target-platform AskUserQuestion, Step 4 brief shows Target platform, Step 5 has the hard rule.
3. `anti-patterns.md` has the "mobile mockup in desktop frame" entry under Mobile App Anti-Patterns (2026).
4. Manual smoke test (deferred to user): run /de:prototype in a fresh project, select "Responsive web" at Step 1.5, verify the storyboard does NOT wrap content in a centered phone frame.

## Questions for user

None — option A approved with all four sub-changes (Step 1.5 question, brief field, Step 5 hard rule, anti-pattern entry). Ready to implement on approval.
