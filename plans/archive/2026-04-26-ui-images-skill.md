# v2.7.0 — Add ui-images skill (stock + AI generation, with hard-wired discovery)

## Context

Tester reported: when prototype/landing pages need images, Claude defaults to gray-gradient + emoji slop, weird SVGs, or low-quality Pexels grabs because the plugin has zero image-handling skills. They linked an image-prompt-engineer reference (msitarzewski/agency-agents), but that one is photography-only and platform-agnostic — useful inspiration, not a 1:1 fit.

User's full feedback shaped the scope:
- **Both stock AND generation**: stock photos are right for lists/avatars/decorative (50 user avatars don't need 50 unique generations); generation is right for hero/marketing/brand placeholders. Skill must decide per image.
- **Improve the stock process**: produce strong search queries and use Playwright CLI to visually rank candidates so Claude doesn't grab low-quality images.
- **Don't overengineer**: one skill, not split primitives. Reasonable references, not a sprawl.
- **Discovery must work**: hard-wire from `dev-prototyping` and `ui-landing-page` (so it auto-fires structurally), plus strong `description` trigger phrases (so it fires on user mention), plus a CLAUDE.md rule (so the model doesn't reach for placeholders first). Three reinforcement points, no PreToolUse hook.

## Architectural decisions

- **Single skill `ui-images`**, not split. Stock and generation share the manifest, the folder layout, the integration points. Splitting them would duplicate that scaffolding.
- **Decision logic per image**: heuristic in the skill. Hero / marketing / brand-specific placeholder → generate. List rows / avatars / decorative / many-of-a-kind → stock. Skill walks the user through the decision per image; user can override.
- **Stock branch uses Playwright CLI**: produce search query → fetch search results page on Unsplash/Pexels → screenshot → Claude visually ranks top candidates → user picks. Falls back to URL list if Playwright unavailable.
- **Generation branch is platform-aware**: ask which generator (Nanobanana / ChatGPT image / Midjourney / DALL·E / Flux). Templates per generator covering the syntax differences. Generator-agnostic core prompt + per-platform optimization layer.
- **Folder convention**: `documents/design/design/images/` (matches existing `documents/design/design/references/` and `documents/design/design/story-panels/` pattern). With subfolders `manifest.md`, `prompts/`, `stock/`, `generated/`. The `documents/design/design/` redundancy is the existing convention; cleanup is out of scope.
- **Hard-wired discovery**: `dev-prototyping/SKILL.md` Step 5 and `ui-landing-page/SKILL.md` Step 4 explicitly call `ui-images` when image slots exist in the brief/sections. No relying on auto-discovery for these flows.
- **Soft-wired discovery**: skill `description` includes trigger phrases for user-initiated calls ("when the user asks about images, photos, illustrations, hero shots, avatars, or how to handle visual assets in a prototype/landing page").
- **CLAUDE.md rule**: short addition under the "Output formatting" or a new short section: "before reaching for gradient placeholders, emoji-stamped SVGs, or random stock-fetch links, invoke `ui-images` skill."
- **MINOR semver bump**: 2.6.7 → 2.7.0 because a new skill warrants MINOR per CLAUDE.md versioning rules.

## Phase 1: Build the skill + integrate

**Objective**: Ship `ui-images` skill, hard-wire from prototype/landing flows, soft-wire via description and CLAUDE.md, bump README skill count, ship v2.7.0.

**Depends on**: none

**Files**:
- Create: `skills/ui-images/SKILL.md` — main skill body (target ≤500 lines per skill compliance rule). Frontmatter: `name: ui-images`, strong `description` with trigger phrases, `disable-model-invocation: true`, `model: opus`, `effort: high`, `license: MIT`, `compatibility:` noting optional Playwright for visual ranking.
- Create: `skills/ui-images/references/prompt-templates.md` — per-generator templates (Nanobanana/Gemini, ChatGPT/DALL·E, Midjourney, Flux/Stable Diffusion). Each template has the syntax cues that generator wants (aspect ratio params, style modifiers, negative prompts, etc.).
- Modify: `skills/dev-prototyping/SKILL.md` — in Step 5 (Visual storyboard) "How to generate" section, add a sub-step: "If any screen has image slots (hero, illustration, avatar, photo background, product mockup, etc.), invoke the `ui-images` skill BEFORE generating placeholders."
- Modify: `skills/ui-landing-page/SKILL.md` — in Step 4 (Generate the landing page) section-by-section block, add: "Each section that needs an image (hero, social proof, testimonials, product shots) MUST go through `ui-images` skill — generate the manifest entry, run the decision (generate vs stock), and have the prompt or stock URL ready before writing the `<img>` tag."
- Modify: `CLAUDE.md` — under the "Output formatting" or a new small section, add: "**Image handling rule**: before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links in any prototype, landing page, or generated HTML, invoke the `ui-images` skill. It decides per-image whether to generate or fetch stock and writes proper prompts/queries."
- Modify: `.claude-plugin/plugin.json` — bump 2.6.7 → 2.7.0.
- Modify: `.claude-plugin/marketplace.json` — bump 2.6.7 → 2.7.0.
- Modify: `CHANGELOG.md` — add 2.7.0 entry under Added.
- Modify: `README.md` — bump banner. Update skill count if mentioned (54 → 55). Add `ui-images` to the UI design skills table.

**Skill structure** (`skills/ui-images/SKILL.md`):
```
1. Why this matters (the slop problem we're solving)
2. When to use (trigger conditions, including hard-wire from dev-prototyping/ui-landing-page)
3. Step 1: Build image manifest (list every image needed: role, slot, aspect ratio, dimensions, where it goes)
4. Step 2: Decide per image — generate vs stock (decision heuristic; user can override)
5. Step 3 (Stock branch): write search query → if Playwright available, fetch Unsplash/Pexels search page, screenshot, visually rank top 3-5 → present to user → save chosen URL/file
6. Step 4 (Generate branch): ask which generator, write detailed prompts using templates from prompt-templates.md, save to documents/design/design/images/prompts/
7. Step 5: Save manifest to documents/design/design/images/manifest.md, lay out destination folders (stock/, generated/)
8. Success criteria
```

**Reuse**:
- `ui-references-moodboard/SKILL.md` as the structural template (frontmatter shape, "Why This Matters", numbered steps, references/ subfolder).
- The folder convention from `documents/design/design/story-panels/` and `documents/design/design/references/` (already established pattern).
- The image-slot anti-pattern in `anti-patterns.md` (Mobile App Anti-Patterns section already flags emoji-as-illustration, AI-slop placeholders).

**Checklist**:
- [ ] Write `skills/ui-images/SKILL.md` with all required frontmatter and 7 sections from above
- [ ] Write `skills/ui-images/references/prompt-templates.md` (per-generator templates: Nanobanana/Gemini, ChatGPT/DALL·E, Midjourney, Flux)
- [ ] Wire into `dev-prototyping/SKILL.md` Step 5 (image-slot detection invokes ui-images)
- [ ] Wire into `ui-landing-page/SKILL.md` Step 4 (each image-bearing section goes through ui-images)
- [ ] Add CLAUDE.md "Image handling rule"
- [ ] Bump plugin.json + marketplace.json to 2.7.0
- [ ] Add CHANGELOG `[2.7.0] – 2026-04-26` entry under Added
- [ ] Bump README banner v2.6.7 → v2.7.0
- [ ] Update README skill count if it shows a number (54 → 55) and add ui-images to the UI design skills table
- [ ] Validate JSON manifests
- [ ] Smoke-check: SKILL.md under 500 lines, frontmatter complete

**QA**:
1. JSON manifests valid: `python3 -m json.tool .claude-plugin/plugin.json` and `marketplace.json`.
2. SKILL.md frontmatter compliance per CLAUDE.md skill checklist: name, description, disable-model-invocation, model, effort, license, compatibility (this skill has external Playwright dep) — all present.
3. SKILL.md under 500 lines: `wc -l skills/ui-images/SKILL.md`.
4. Hard-wire verification: grep `ui-images` in dev-prototyping/SKILL.md and ui-landing-page/SKILL.md returns explicit invocation lines.
5. Soft-wire verification: skill description contains trigger phrases ("images", "photos", "illustrations", "hero shots", "avatars", "visual assets").
6. CLAUDE.md verification: new "Image handling rule" line exists.
7. README skill count updated, ui-images listed.
8. Manual reasoning trace: a hypothetical /de:landing run reaches Step 4 → encounters hero section → invokes ui-images → ui-images decides generate (hero is brand-specific) → writes prompt → user runs prompt in their generator → saves output to documents/design/design/images/generated/hero.png. All steps exist in the SKILL.md.

## Risk assessment

- **Risk**: SKILL.md grows above 500 lines. **Mitigation**: move step-by-step example into a separate `references/example-walkthrough.md` if needed; keep main SKILL.md focused on instructions.
- **Risk**: Playwright is not installed on user's machine. **Mitigation**: stock branch falls back to "list URLs and ask user to pick visually." Skill checks for Playwright availability at Step 3 and branches.
- **Risk**: Hard-wire calls into dev-prototyping/ui-landing-page introduce friction even when user doesn't want to generate images yet. **Mitigation**: skill's Step 1 (build manifest) is fast and lightweight; if user says "no images for now", skill exits cleanly. Don't force a full generation cycle on every prototype run.
- **Risk**: User picks an image generator the templates don't cover. **Mitigation**: prompt-templates.md is a starting point; SKILL.md says "if your generator isn't listed, use the generator-agnostic core prompt and adapt syntax."
- **Risk**: Claude still defaults to slop placeholders despite hard-wire + soft-wire + CLAUDE.md rule. **Mitigation**: if real-world testing shows drift, escalate to a PreToolUse hook in a follow-up patch (deny Write of `<img>` tags in prototype HTML if ui-images wasn't invoked first). Not in scope for v2.7.0 — start with the lighter approach, observe.

## Verification (end-to-end)

After v2.7.0 lands:
1. JSON manifests valid, all read 2.7.0.
2. `skills/ui-images/SKILL.md` exists, frontmatter complete, ≤500 lines, all 7 sections present.
3. `skills/ui-images/references/prompt-templates.md` exists with templates for ≥3 generators.
4. `dev-prototyping/SKILL.md` Step 5 explicitly invokes `ui-images` for image-slot screens.
5. `ui-landing-page/SKILL.md` Step 4 explicitly invokes `ui-images` for image-bearing sections.
6. CLAUDE.md has the Image handling rule.
7. README banner v2.7.0, skill count updated, ui-images in the UI design skills table.
8. Manual smoke test (deferred to user): run /de:prototype, set up a hero screen with image slot, verify ui-images is invoked rather than emitting a gradient placeholder.

## Questions for user

None — option A (single ui-images skill, both stock + generation) approved with refinements (hard-wire + soft-wire + CLAUDE.md rule for discovery; folder is `documents/design/design/images/` consistent with existing convention). Ready to implement on approval.
