# Changelog

All notable changes to the design-engineer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [4.1.1] – 2026-04-26

Replacement of the v4.1.0 sound files. The user auditioned all 52 Kenney UI Audio sounds during testing and found them too high-pitched and clicky for this use case. We collaborated on synth alternatives — short, futuristic, low-frequency, with a bit of mid for clarity — and converged on these.

### Changed

- **Replaced `de-complete.wav` and `de-attention.wav`** with original synthesized tones generated via ffmpeg's lavfi sine source plus lowpass, echo, and loudness normalization. No third-party samples. Public domain (CC0) — use, modify, redistribute freely. Recipes for full reproducibility are in `assets/sounds/LICENSE.md`.
  - **`de-complete.wav`** — ascending fourth G3→C4 (196→261 Hz) with octave-up harmonics (×0.35) for warmth and clarity. Fade envelope, lowpass at 4500 Hz, subtle echo, loudnorm to -9 LUFS. Plays when Claude finishes responding.
  - **`de-attention.wav`** — double-tap at A3 (220 Hz) with octave-up harmonics. Two short pulses with a silence between, brighter envelope. Plays when Claude waits for permission or AskUserQuestion answer.
- **`LICENSE.md` rewritten** to reflect the new origin (synthesized originals, not Kenney CC0). Recipes documented for reproducibility.

## [4.1.0] – 2026-04-26

Beta tester feature request: audio cues when Claude finishes responding or needs user action. They linked an example using `afplay` (macOS-only). User refined the scope: hybrid opt-in install, same bundled sounds for everyone (not OS system sounds), suggest a specific sound source.

### Added

- **Optional sound notifications** during setup. New question in `meta-setup/SKILL.md` (between status-line install and finalization) asking the user whether to enable sound on Claude's `Stop` (finished responding) and `Notification` (waiting for your input — permission requests, AskUserQuestion) events. Opt-in only; skipped by default if the user picks "No" or doesn't run setup.
- **Bundled CC0 sounds at `assets/sounds/`** — `de-complete.wav` (Stop, warm "task done" chime) and `de-attention.wav` (Notification, alerting tone, distinct from completion). Sourced from [Kenney UI Audio](https://kenney.nl/assets/ui-audio), CC0 public domain — no attribution required, irrevocable license, redistributable. License note at `assets/sounds/LICENSE.md`.
- **Cross-platform playback shim** at `hooks/de-play-sound.sh`. Detects OS and uses platform-native player: macOS `afplay`, Linux `paplay`/`aplay`/`play` (in that fallback order), native Windows shells PowerShell `System.Media.SoundPlayer`. Silent on WSL (Windows Subsystem for Linux doesn't expose Windows audio by default). Fail-silent (`exit 0`) so a missing player never blocks Claude Code; backgrounded so playback doesn't delay the calling hook.

### Notes on hook event choice

- **Stop** (Claude finished responding) and **Notification** (Claude waiting for permission/AskUserQuestion answer) are the right events per Anthropic docs.
- The user's reference snippet also wired `SessionStart` and `UserPromptSubmit` — we skipped both. SessionStart fires every session open (annoying chime on each start). UserPromptSubmit fires when the *user* submits — irrelevant to "Claude needs me" or "Claude finished".
- Hook entries are written to user-level `~/.claude/settings.json` (not plugin-level) so they fire across all Claude Code work, not just plugin commands. Same scope pattern as the existing status-line install. Existing user settings are preserved (read-merge-write, never overwrite).

### Uninstall and mute

- **Uninstall**: re-run `/design-engineer:start` and pick "Uninstall" on the sound install question, or manually remove the Stop/Notification hook entries from `~/.claude/settings.json`.
- **Temporary mute**: run `/design-engineer:mute-unmute-sound` to silence sounds without uninstalling. Run again to unmute. Useful for meetings, libraries, or anywhere you want temporary silence. State persists across Claude Code restarts (flag file at `~/.claude/de-sound-muted`).

### Also in this release

- **New `/design-engineer:mute-unmute-sound` command** that toggles sound notifications via a flag file at `~/.claude/de-sound-muted`. The playback shim checks for this file on every invocation and exits silently if present. First call mutes, second call unmutes. Idempotent and safe to run repeatedly. Command count goes from 8 to 9.
- **"Already installed" detection** in the status-line and sound install questions. When `/design-engineer:start` runs and detects existing plugin config in `~/.claude/settings.json`, the question now offers three options instead of two: `Skip – already installed` (default for re-runs), `Reinstall (replace)`, or `Uninstall`. Eliminates the awkward "do I really want to reinstall?" friction when re-running setup.

## [4.0.0] – 2026-04-26 — BREAKING

Beta tester reported that typing `/de:` triggered Claude Code's session-naming logic to interpret `de` as the German language code, producing chat titles like "Start German language feature". Real UX papercut for every chat using this plugin.

This release renames the command prefix from `/de:` to `/design-engineer:` to eliminate the language-code collision.

### Changed (BREAKING)

- **Command prefix renamed**: `/de:` → `/design-engineer:`. All 8 commands now use the longer prefix:
  - `/de:start` → `/design-engineer:start`
  - `/de:design` → `/design-engineer:design`
  - `/de:dev` → `/design-engineer:dev`
  - `/de:review` → `/design-engineer:review`
  - `/de:prototype` → `/design-engineer:prototype`
  - `/de:document` → `/design-engineer:document`
  - `/de:stop` → `/design-engineer:stop`
  - `/de:help` → `/design-engineer:help`
- **Command directory moved**: `commands/de/` → `commands/design-engineer/` (slash-command resolution is directory-based — the directory move IS the prefix rename).
- **Command frontmatter `name:` fields updated** in all 8 command files to match the new prefix.
- **All references migrated** across ~42 active plugin files (commands, agents, skills, hooks, scripts, CLAUDE.md, README, evals).

### Migration

No file moves needed in your project. Just type the new prefix:

```
/design-engineer:start
```

Tab-completion in Claude Code makes the longer prefix manageable: `/de` + Tab no longer auto-completes to `/de:` (because that prefix no longer exists); type a few more characters for `/design-engineer:` to autocomplete.

### Notes

- **Internal hook filenames retain `de-` prefix** (`de-start-state.sh`, `de-tdd-hook.js`, `de-design-grounding-hook.js`, etc.) — these are file paths inside the plugin, never invoked as slash commands. Renaming them would require updates to `hooks.json` plus more file moves with no user-visible benefit. Out of scope for this release.

## [3.0.0] – 2026-04-26 — BREAKING

Beta tester reported three structural complaints about the deliverables folder layout:
1. `documents/` is a redundant wrapper — it only ever contains `design/`, so the extra level adds zero information.
2. `design/design/` is a confusing double-word path — both depths used the same word.
3. `prototype/` doesn't belong inside `documents/` because (a) a prototype isn't really a document, (b) it's the most-viewed artefact and burying it makes it hard to find.

This release restructures the artefact folder layout to address all three. **Breaking change for existing projects**: paths are different. One-time migration command below.

### Changed (BREAKING)

- **Dropped `documents/` wrapper.** Top-level project structure is now `design/`, `prototype/`, `plans/`, `.claude/`, `.design-engineer-plugin/` — no `documents/` parent.
- **Renamed inner `design/` to `craft/`.** What was `documents/design/design/` (containing references, story panels, journey, bias audit, ethics, behavior map) is now `design/craft/`. Captures "design-craft work" without the double-word path confusion.
- **Moved `prototype/` to project root.** What was `documents/design/prototype/` is now just `prototype/` — sibling of `design/` and `plans/`. A prototype isn't a document; it's the artefact users open.
- **`init-project-structure.sh`** rewritten for the new layout. Default `DELIVERABLES_PATH` is now `design` (was `documents/design`). Idempotent: re-runs are safe.
- **All ~40 plugin files migrated**: commands, agents, skills, hooks, scripts, README, CLAUDE.md updated to reference new paths. CHANGELOG entries from prior versions retain old paths for historical accuracy.

### Migration (one-time, run from project root)

If you have an existing project on v2.x, run this once to migrate:

```bash
mv documents/design/design design/craft && \
mv documents/design/prototype prototype && \
mv documents/design design && \
rmdir documents
```

Adjust if you customised the deliverables path. After running, all v3.0.0 plugin commands will find content at the new locations.

### Final shape

```
project-root/
├── .claude/
├── .design-engineer-plugin/
│   └── memory/                 # plugin-local memory (project-map.md, debug-solutions.md)
├── design/
│   ├── foundation/
│   ├── research/
│   ├── planning/
│   ├── craft/                  # was documents/design/design/
│   │   ├── references/
│   │   └── story-panels/
│   ├── psych/
│   ├── reviews/
│   └── dev/
├── prototype/                  # was documents/design/prototype/
└── plans/
    └── archive/
```

### Also in this release

- **Process-recall hook now lists all steps, not just the current one.** The previous v2.6.3 nudge made Claude announce "Process X, Step N" at the top of responses but didn't force it to list the other steps — so Claude would forget what comes next mid-process. Updated `hooks/de-process-recall-hook.sh` to require a numbered list of EVERY step with a `← current` marker on the active one, re-listed on every response while the process is active.
- **`de-design-grounding-hook.js` legacy prototype path corrected.** The fallback `'design/prototype.html'` (which never matched any real layout) was replaced with `'documents/design/prototype/prototype.html'` for v2.x backwards compatibility during migration. New primary path is `'prototype/prototype.html'`.

## [2.7.0] – 2026-04-26

Beta tester feature request: a skill that produces detailed image-generation instructions to feed into Nanobanana / ChatGPT / Midjourney / etc. (referenced msitarzewski's design-image-prompt-engineer agent). Confirmed pain: when prototype/landing pages need images, Claude defaults to gray-gradient + emoji slop, weird SVGs, or low-quality Pexels grabs because the plugin had zero image-handling skills. User clarified scope: handle BOTH stock photos (right for lists/avatars/decorative — 50 user avatars don't need 50 unique generations) AND AI generation (right for hero/marketing/brand-specific placeholders), and ensure the skill actually fires when needed (hard-wire from prototype/landing flows, soft-wire via description, plus a CLAUDE.md rule).

### Added

- **New `ui-images` skill** (`skills/ui-images/`) — single skill that handles both stock-photo selection and AI-generation prompt writing. Walks the user through an image manifest, decides per image whether to generate or stock-fetch (heuristic: hero/marketing/brand → generate; avatars/list rows/decorative many-of-a-kind → stock; user can override), and produces the right artefact for each path. For stock: writes a strong search query and uses Playwright CLI (when available) to visually rank top results so Claude doesn't grab low-quality images; falls back to URL list when Playwright isn't installed. For generation: asks which generator the user wants (Nanobanana / ChatGPT / Midjourney / Flux / etc.) and writes detailed prompts using per-generator templates that cover syntax differences (aspect-ratio params, style modifiers, negative prompts). Saves manifest + prompts to `documents/design/design/images/` with subfolders for `prompts/`, `generated/`, `stock/`.
- **`skills/ui-images/references/prompt-templates.md`** — per-generator templates for Gemini Nanobanana, ChatGPT/DALL·E, Midjourney, Flux/Stable Diffusion, Ideogram, plus a generator-agnostic core that covers subject + composition + style + lighting + palette + aspect ratio + negatives.

### Changed

- **`dev-prototyping/SKILL.md` Step 5** — added a hard image-slot rule: BEFORE generating any `<img>` tag, gradient placeholder, or emoji-stamped SVG, invoke `ui-images`. This is what prevents the gray-gradient + emoji slop default.
- **`ui-landing-page/SKILL.md` Step 4** — added the same hard rule for landing page sections (hero, social proof, testimonial avatars, product shots, feature illustrations).
- **`CLAUDE.md`** — new "Image handling" section: before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links, invoke `ui-images`. Applies to every `<img>` tag — no exceptions, no "the user will replace it later" shortcuts.
- **`README.md`** — banner v2.7.0, added `ui-images` to the UI design skills table, skill count updated.

## [2.6.7] – 2026-04-26

Beta tester reported: asked for a responsive website, plugin generated a desktop browser page with a mobile-phone-shaped mockup floating in the center surrounded by cream space. Root cause: `dev-prototyping/SKILL.md` never asked the user what target platform to design for, so when planning docs lacked an explicit signal Claude defaulted to mobile-shaped layouts wrapped in a desktop chrome.

### Fixed

- **Responsive-web prototypes no longer render as mobile-mockup-in-desktop-frame.** A new mandatory question (Step 1.5: Target platform) locks in Mobile app / Responsive web / Desktop web / Both at the start of the prototype flow, before any HTML is generated.

### Added

- **Step 1.5: Target platform** in `skills/dev-prototyping/SKILL.md` — AskUserQuestion with four options. The choice is binding and feeds into the Step 4 brief.
- **Target platform field** in the Step 4 prototype brief — surfaces the platform choice as the first row of the brief (above Design intent), so the user reviews and confirms it before any storyboard work.
- **Step 5 target-platform layout rule (HARD)** — for Responsive/Desktop web targets, layouts MUST fill the viewport. NEVER wrap content in a centered phone-shaped container, NEVER apply `max-width: 414px` / `375px` page-body constraints, NEVER add a fake-iphone CSS chrome around the UI. For Mobile app targets, design at mobile viewport without desktop wrapping. For Both, generate two separate sets of screens, never mixed in one layout.
- **Anti-pattern: "Mobile mockup floating in desktop frame"** added to `skills/ui-aesthetic-review/references/anti-patterns.md` under the Mobile App Anti-Patterns (2026) section. The Step 5 self-review now flags this case explicitly when target is Responsive or Desktop web.

## [2.6.6] – 2026-04-26

Beta tester reported a confusing red error during /de:start on a brand-new Windows project: `File does not exist: C:\Users\Admin\.claude\projects\D--Coding-projects-mexico-2/memory/MEMORY.md`. The path was not mangled — that's the standard Claude Code auto-memory slug. The actual problem: Claude Code creates the auto-memory dir lazily when it first writes there, but the plugin was instructing Claude to Read `MEMORY.md` via the Read tool — redundant (per Anthropic docs, MEMORY.md auto-loads first 200 lines every session) and broken for fresh projects.

### Fixed

- **No more "File does not exist" red error on /de:start for fresh projects.** Plugin no longer issues `Read MEMORY.md` calls — auto-memory MEMORY.md is owned by Claude Code itself and auto-loads every session per Anthropic docs.

### Changed

- **Plugin-defined memory files moved to `.design-engineer-plugin/memory/`** — `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log) now live in the plugin-local config dir, seeded by `init-project-structure.sh` during meta-setup. Avoids needing to mirror Claude Code's auto-memory slug encoding (which is brittle cross-platform: Mac, Windows, git-root vs working-dir derivation).
- **`init-project-structure.sh` extended** to seed `.design-engineer-plugin/memory/{project-map.md,debug-solutions.md}` skeletons idempotently. If files exist, skip; if not, create with starter content from the prior `meta-setup/SKILL.md` block.
- **CLAUDE.md memory section rewritten** — clearly separates the two memory layers (Claude Code auto-memory MEMORY.md, owned by Claude Code; plugin-local memory at `.design-engineer-plugin/memory/`, owned by the plugin). Adds a defensive read pattern: verify existence with Bash `test -f` or Glob before Read; skip silently if absent. Removes redundant "Read MEMORY.md" instructions.
- **`meta-setup/SKILL.md` "Initialize Auto-Memory" section** replaced with a short pointer noting the seeding is now done by the script.
- **`meta-orchestrator/SKILL.md`, `dev-agent-setup/SKILL.md`, `ux-story-panels/SKILL.md`, README FAQ** updated to reference the new plugin-local paths.

### Migration note

If you have existing notes in `~/.claude/projects/<slug>/memory/project-map.md` or `~/.claude/projects/<slug>/memory/debug-solutions.md` from a prior plugin version, copy them to `.design-engineer-plugin/memory/` in your project — the plugin no longer reads from auto-memory for these files. Auto-memory MEMORY.md is unaffected; Claude Code continues managing it.

## [2.6.5] – 2026-04-26

### Changed

- **Clarified spacer scope in CLAUDE.md rule 6** — added an explicit "Do NOT add the spacer to" list (regular chat messages, plain-text questions, end-of-turn summaries) so future sessions don't apply the spacer to messages that aren't followed by an actual `AskUserQuestion` tool call. The spacer exists only to defeat the question-panel overlay; without a panel, no spacer is needed.

## [2.6.4] – 2026-04-26

### Changed

- **AskUserQuestion spacer reduced from 8 lines to 3** (CLAUDE.md rule 6) — eight horizontal-rule lines was excessive in practice; three is enough vertical space to keep the panel overlay off the substantive content above it without dominating the chat.

## [2.6.3] – 2026-04-26

Process-discipline fix from beta tester feedback (and from observing the assistant repeatedly drift mid-session). Across long sessions, Claude was forgetting to follow agreed processes — the prototype-as-baseline rule, multi-step plugin workflows, the iterative-feedback workflow — until the user manually re-anchored with "you forgot the process". This release automates that re-anchor.

### Added

- **Process-recall metacognitive nudge hook** (`hooks/de-process-recall-hook.sh`, wired as a `UserPromptSubmit` hook) — fires on every user prompt and injects ~3 lines of `additionalContext` asking Claude to check whether a process is active (CLAUDE.md, an active skill/command/agent, or what the user established earlier) before responding. If a process IS active, Claude must briefly state at the top of its response which process and which step. If no process is active, Claude must respond normally without mentioning anything about process. The nudge is fully generic – it never names a specific process, so future processes added to the plugin (or stated mid-conversation by users) automatically benefit. Survives compaction and long sessions because UserPromptSubmit re-fires every turn, unlike CLAUDE.md rules which fade behind newer context.

## [2.6.2] – 2026-04-25

Two UX fixes from tester feedback — users could not pick alternative recommendations during a guided review, and the AskUserQuestion panel overlay was hiding the message above it (especially the finding context).

### Added

- **Spacer rule for AskUserQuestion calls (CLAUDE.md rule 6)** — on most clients the panel overlays the bottom of the chat and hides whatever was written just above it. Every AskUserQuestion call must now be preceded by a vertical spacer (eight horizontal-rule lines, more if the message ended on important content) so the overlay covers the spacer instead of substantive content. Applies to every command, skill, and agent.

### Changed

- **`/de:review` guided mode now puts the recommendations themselves on the action buttons.** Previously the post-finding question offered "Fix it now / Note and continue / Skip / Explain", and "Fix it now" implicitly applied the agent's recommended pick — alternative recommendations were unreachable via buttons. The new flow shows up to 3 recommendations as the primary AskUserQuestion options (recommended one first, marked clearly), with a 4th "Skip or explain" slot that branches to a tiny follow-up question only when needed. The auto-added "Other" slot lets users describe a custom approach in free text. The fix-execution plan in Step 5 implements whichever recommendation (or custom approach) the user actually picked, never silently substituting.
- **Collapsed "Fix it now" and "Note and continue"** — both previously fed the same Step 5 batch plan, so the distinction was cosmetic. Picking any recommendation now means "include this in the fix plan", and the batch executes after all findings are reviewed. One click per finding instead of two.
- **Recommendations now require a short title (3–5 words)** so they can fit on AskUserQuestion button labels. The full what / why / tradeoff is shown in the option description. Cap at 3 recommendations per finding so the question fits cleanly into 4 buttons.

## [2.6.1] – 2026-04-25

Closes the four remaining items from Round B's critical-bug audit (H1 already fixed in 2.6.0). Consistency and honesty pass — no new features.

### Changed

- **Memory-management language softened in CLAUDE.md** (H3) — auto-memory writes (`MEMORY.md`, `project-map.md`, `debug-solutions.md`) are now explicitly described as advisory, not contracts. Claude Code does not structurally enforce these writes; the docs now match. Pointed users at the structurally enforced layer (compound-documenter agent's project-local memory at `.claude/agent-memory/compound-documenter/`).
- **Hardcoded `documents/design/` everywhere** (M1) — replaced 24 instances of the `{deliverables_path}/` template token with the actual path across all skill, agent, command, and hook files. The `deliverables_path` config field was advertised as configurable but no code ever read it from `config.yaml`, so the configurability was fiction. Marked the field as reserved-for-future-use in CLAUDE.md.
- **Hedged Figma plugin function references** (L2) — `commands/de/review.md` and `agents/frontend-implementer.md` now explicitly say "if Figma plugin is connected" before invoking `get_design_context` etc., matching the optional-tool reality.
- **CLAUDE.md "Living Documents" section rewritten** to describe both layers (static graph + agent memory) honestly, replacing the old "tracked via .dependencies.yaml" framing that was tied to the dead subsystem.

### Removed

- Root `.mcp.json` (L1) — duplicated `plugin.json mcpServers.context7`. The plugin manifest is the authoritative declaration; the root `.mcp.json` was redundant for a self-installing plugin.

### Verified

- H2 (project-state.md / status.md confusion) verified clean — remaining mentions are intentional (user-side dev-status guidance examples, the "don't write here" warning in compound-documenter, and the legitimate `project-status` deliverable name).

## [2.6.0] – 2026-04-25

Major fix to the "living documents" subsystem from Round B critical-bug audit. The dependency tracking system was dead since launch — nothing wrote `status: complete` or `last_updated` to `dependencies.yaml`, so the entire feature was advertised but non-functional. Re-architected around the documented Anthropic primitive (agent `memory: project`).

### Added

- **Agent-memory progress tracking** — `compound-documenter` agent gains `memory: project` frontmatter, writing structured state to `.claude/agent-memory/compound-documenter/`: `pipeline-state.md` (current phase, last completed skill, recent deliverables), `key-decisions.md` (append-only log of cross-cutting decisions affecting 2+ deliverables), `stale-dependents.md` (downstream deliverables not refreshed since upstream change). Uses Anthropic's documented agent-memory mechanism, which Claude Code wires up structurally rather than by prose instruction.

### Changed

- **`dependencies.yaml` is now a static reference graph.** Removed `status:` and `last_updated:` fields from every entry — they were never written. The file documents which deliverables inform which downstream ones; runtime progress is now in agent memory. File header rewritten to make the static-only role explicit.
- **`check_deliverable_deps.py`** simplified to print only the static "You edited X. Downstream deliverables that may need review: …" relationship. Removed the dead 90-day staleness check (relied on `last_updated`).
- **`session_dep_summary.py`** simplified — removed the false "deliverables updated this session" claim and the dead `derive_resume_state` / `write_resume_state` machinery (all relied on `last_updated` which was never set). Now prints a clean session-end reminder pointing at `/de:document` for state writes.
- **`de-postcompact-hook.sh`** removed the dead "Deliverables completed: N" count (always 0). Now points the model at the compound-documenter agent's pipeline-state.md for live state recovery after compaction.
- **`compound-documenter` agent** rewritten to write to its agent-memory directory using the documented schema, instead of an ambiguous `status.md`.
- **`meta-document/SKILL.md`** now invokes compound-documenter to handle state writes instead of trying to write `status.md` directly.
- **`meta-orchestrator/SKILL.md`** Step 0 now reads `.claude/agent-memory/compound-documenter/pipeline-state.md` (not the never-written `documents/design/project-state.md`).
- **`meta-orchestrator/references/project-state-schema.md`** rewritten as a deprecation redirect note pointing to compound-documenter as the new owner of pipeline state.
- **`meta-document/references/context-engineering-guide.md`** updated to reference the agent-memory pipeline-state.md instead of the old `status.md` convention.
- **README FAQs #14 + #15** rewritten to honestly describe both layers (static graph + agent memory). No more "the plugin flags downstream dependents when upstream changes" promise — the plugin surfaces stale candidates; the user decides what's worth refreshing.

### Removed

- Dead `status:` / `last_updated:` fields from `dependencies-default.yaml` seed (every deliverable entry).
- 90-day staleness detection (relied on `last_updated`, dead since launch).
- The `derive_resume_state` and `write_resume_state` functions in `session_dep_summary.py` and the supporting YAML parser / `is_recent` helper (all built on `last_updated`).
- `status.md` references from `meta-document` and `compound-documenter` (the file was never the right primitive — split into three specific agent-memory files instead).
- `project-state.md` references from `meta-orchestrator` (file was never created or written).

## [2.5.1] – 2026-04-25

### Fixed

- **Stale "guided/god" mode reference** in `commands/de/prototype.md` — updated to "guided/autopilot" (leftover from before v2.0.0 renamed God mode → Autopilot).
- **Resume-state routing was dead** — `hooks/de-start-state.sh` now emits `returning_with_resume` or `returning_no_resume` based on whether `.design-engineer-plugin/config.yaml` has a `resume:` section, matching `commands/de/start.md`'s expected vocabulary. Previously the hook only emitted two states (`new_to_plugin`, `existing_project`), so the resume-where-you-left-off routing in start.md never fired since v2.0.0.
- **Stale `/de:start install` and `/de:start uninstall` references** in `skills/meta-statusline/SKILL.md` — replaced with the current invocation (re-run `/de:start` and select from the status-line question). Old syntax was from v1.4.0's removed `/de:statusline install` command.
- **Folder scaffold doc out of sync with reality** — `skills/meta-setup/SKILL.md` Step 4 documented a v1.x folder layout (`foundation/ research/ design/ psych/ dev/ solutions/`) but `init-project-structure.sh` actually creates the v2.4.0+ structure (`foundation/ research/ research/archive/ planning/ design/ design/references/ design/story-panels/ prototype/ psych/ reviews/ dev/`). Doc rewritten to match the script.
- **Dependency-file path inconsistency** — standardized all docs on `.design-engineer-plugin/dependencies.yaml` (the canonical path the init script creates). Removed legacy `documents/design/.dependencies.yaml` and `{deliverables_path}/.dependencies.yaml` references from `skills/meta-setup/SKILL.md` (3 places) and `skills/meta-orchestrator/SKILL.md` (1 place). The dual-path readers in `session_dep_summary.py` and `de-postcompact-hook.sh` stay for v1.x backwards-compat.
- **README skill counts didn't match anything** — headline claimed `54 skills` (3 places); public-facing tables summed to 49; actual SKILL.md file count is 53 (3 of those are hook-driven internal helpers). Added `ui-landing-page` to the UI design table (UI design (7) → UI design (8)) and updated headline `54 skills` → `50 skills` everywhere — that's the public-table sum: 4 Meta + 9 UX research + 8 UX design + 14 Psychology + 8 UI design + 7 Development.

## [2.5.0] – 2026-04-25

Major fix targeting the AI-slop problem from beta testing — every fingerprint of generic AI-generated UI was appearing in tester output (cream/beige + orange CTA, 3D Apple-emoji as illustration, flag-emoji avatars, pill-chips-with-emoji, generic "Join this event" CTA copy). Root cause: the plugin's design knowledge was treated as reference material rather than mandatory operating procedure, and `/de:dev` + `frontend-implementer` never read any of it. Fix uses Anthropic's documented `PreToolUse` hard-block primitive plus inlined operating rules in the agent/skill/command prompts.

### Added
- **Design grounding hook** (`hooks/de-design-grounding-hook.js`) — new PreToolUse hook that hard-denies UI Writes/Edits/MultiEdits (.tsx .jsx .html .svelte .vue .css .scss) until required design knowledge has been Read this session and `references.md` exists in the project. If `prototype.html` exists, denies Writes that don't Read it first. Uses the documented `permissionDecision: "deny"` primitive — this is real enforcement, not advisory context.
- **Mobile App Anti-Patterns (2026)** section added to `anti-patterns.md` — cream/beige + orange CTA, 3D emoji as illustration, emoji avatars, pill chips with emoji, generic CTA copy. Plus a Hard Bans section listing typefaces (Inter/SF Pro/Roboto/Lato/Montserrat/Open Sans), token names (`--gray-N`/`--surface-N`/`--primary`), and emoji as avatars/illustrations as choices that ALWAYS require user-stated WHY.
- **Curated reference apps** (`skills/ui-references-moodboard/references/curated-references.md`) — 8 product-type categories with 3–5 distinctive-design reference apps each and a specific quality to study, so users skipping moodboard still have aesthetic anchors against AI defaults.
- **Aesthetic audit pass** in `design-system-auditor` agent — extended from token-compliance only to also run the 4 lenses (Composition / Craft / Content / Structure) + 4 named tests (Swap / Squint / Signature / Token) + AI Slop Test from `critique-framework.md`, with structured PASS/FAIL output per test.

### Changed
- **Inlined the WHY Checkpoint, anti-pattern self-check, and Signature Test** into `agents/frontend-implementer.md`, `skills/dev-prototyping/SKILL.md`, and `commands/de/dev.md` — the operating procedure is now in the prompts that actually load (agent system prompt + skill content), not in reference files the model may not Read. The reference files remain canonical for deep dives.
- **Tight prototype-to-dev coupling** — `/de:dev` and `frontend-implementer` now treat `prototype.html` as the visual baseline when it exists; no creative deviation. Enforced by the new hook.

### Removed
- **Phase indicator from status line** — the segment had been dead since launch (nothing in the plugin ever wrote `status: complete` to `dependencies.yaml`, so the count was permanently zero). Removed `buildPipelineSegment()`, `findDepsPath()`, `parseDependenciesYaml()`, and the `PHASE_NAMES` lookup from `de-statusline.js`. Updated `meta-statusline` skill docs to reflect the new (smaller, more honest) status line: model + dir + context bar + 5h/7d usage.

### Fixed
- **Status-line lag during long tool calls** — documented as Claude Code's update model (the line refreshes at the end of each model turn), not a plugin bug. Added a Common Issues entry to `meta-statusline` skill.
- **Expo "training" question from beta tester** — confirmed not a bug. The plugin has zero Expo-specific training; Claude proposes Expo when product type is "mobile app" because it's a reasonable React Native framework. No code change needed.

## [2.4.1] – 2026-04-25

### Fixed

- **Plugin install failure for some users** – replaced bare relative source (`"./"`) in `marketplace.json` with explicit GitHub source (`{source: "github", repo: "volomydyr/design-engineer-plugin"}`). Aligns with the documented Anthropic plugin-source patterns and removes a path-resolution edge case reported by one beta tester (`/plugin install design-engineer@design-engineer-plugin` returned "Plugin not found in any marketplace" even though the marketplace had been added successfully).

## [2.4.0] – 2026-04-04

66 issues identified and fixed from end-to-end main flow testing (new product from scratch). Grouped into 12 root causes, implemented across 6 phases.

### Added
- **`/de:stop` command** – save and pause mid-activity with automatic progress tracking and compact message suggestion
- **`ui-landing-page` skill** – single-file HTML landing page with 9-section structure, StoryBrand integration, and copy frameworks (PAS, AIDA, StoryBrand)
- **Anti-slop writing reference** (`skills/shared-references/anti-slop-writing.md`) – 29+ AI writing pattern categories to avoid, applied across all skills
- **Compact message template** (`skills/shared-references/compact-template.md`) – fixed format for consistent compaction across sessions
- **PostCompact hook** – re-injects pipeline state from config.yaml after compaction
- **Pipeline overview** – presented to the user before Phase 1 with all phases, descriptions, and stop/resume instructions
- **Two compaction breakpoints** – after Phase 3 (before prototyping) and after Phase 4 (before development)
- **Figma design checkpoint** – explicit pause after Figma push for user to design before psychology review
- **Smart psychology skill selection** – all 14 psych skills presented with dynamic recommendations via multiSelect
- **Pipeline conclusion** – personalized, dynamic ending after development completes
- **Build target detection** – identifies multiple build targets (e.g., macOS app + landing page) and asks which to build first
- **Cross-agent review** at three handoff points: test-writer reviews plan, frontend reviews backend API, design-system-auditor reviews both
- **Progress indication** throughout the pipeline ("Phase N, step X of Y")

### Changed
- **Step 0 added to all 24 pipeline skills** – execution plan announcement, conditional teaching, incremental output rule, contrarian behavior
- **Content Integrity rule added to all skills** – no fabrication, no solutions in discovery, read before reference
- **BLOCKING REQUIREMENT tags** on all interactive steps – model must wait for user input
- **Prototyping rewritten** – two-step approach (visual storyboard then interactive prototype), no git/simplify/TDD, screen inventory from IA, anti-pattern self-check, copy rule (ask user to write after first rejection)
- **ux-full-review changed from optional to required** – comprehensive review before development
- **TDD hook** now recognizes `.spec.js`, `.spec.ts`, `.test.js`, `.test.ts` in addition to `.sh`
- **/simplify enforcement** strengthened to "MANDATORY NEXT ACTION" with blocking language
- **Statusline pipeline state** fixed to show progress based on completed deliverables, not just in_progress
- **Plan template** updated with explicit agent names (test-writer, backend-implementer, frontend-implementer, design-system-auditor) and /simplify as blocking step
- **Agent invocation instructions** added to 4 skills (competitor-analysis, full-review, meta-document, meta-orchestrator)
- **Folder structure redesigned** – new `planning/`, `design/references/`, `design/story-panels/`, `research/archive/`, `reviews/` folders; `solutions/` removed
- **Plan copy hook** now creates timestamped filenames and archives old plans
- **Staleness detection** for research deliverables older than 90 days
- **All hardcoded paths fixed** – zero `design-docs/`, `project-docs/`, `journeys/` references remain
- **Dependency wiring** – bias audit explicitly feeds prototyping, assumptions updated by 4 downstream skills
- **Repo visibility** question added (default private)
- **Figma intent** question added before Figma operations
- **Scope vs execution** fidelity nuance added to CLAUDE.md
- **Synthesize from previous answers** rule added – no re-asking what the user already said
- **Behavior mapping** rewritten to walk through concepts one at a time
- **Story panel examples** auto-open on macOS via `open` command
- **Reference collection** reordered earlier in moodboard skill; aesthetic direction rule added
- **multiSelect guidance** added – when to use true vs false

### Removed
- `/simplify` and TDD references from prototyping skill (prototypes are throwaway visual artifacts)
- `solutions/` folder (merged into `dev/`)
- Stale "Prompt cleanup" hook reference from README (hook was removed previously)

---

## [2.3.0] – 2026-04-01

### Added

- **Plan auto-copy hook**: NEW PostToolUse hook (`de-plan-copy-hook.js`) automatically copies plan files from `~/.claude/plans/` to the project's `plans/` directory. This activates TDD hooks, fidelity checks, /simplify reminders, and git branch matching — all of which gate on `plans/` having active plan files. The model cannot skip this — it's automatic.
- **Plugin root path injection**: The UserPromptSubmit hook now injects `DESIGN_ENGINEER_PLUGIN_ROOT` in ALL cases (not just onboarding). Every command can resolve skill reference file paths using this absolute path.
- **Plan template execution rules**: Added "Execution rules" section to `plan-template.md` covering TDD, /simplify, Playwright verification, approval gates, design-system-auditor, meta-document, and git workflow. These rules travel WITH the plan.

### Changed

- **Combined AskUserQuestion calls**: Review command now asks core + additional review areas in ONE AskUserQuestion call (2 questions on same screen, not 2 separate calls). Onboarding batches goal + mode into one call.
- **Reference file paths use PLUGIN_ROOT**: Review command's reference table uses `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/...` instead of relative paths that resolve in the wrong directory.

## [2.2.0] – 2026-04-01

### Added

- **`/de:help` command**: Shows all available commands, current project status, and mode. Works in any project without setup.
- **Plan template reference file**: `skills/meta-setup/references/plan-template.md` — standalone template for implementation plans. Dev command instructs model to Read it before EnterPlanMode.

### Changed

- **Agent presentation rule**: Reverted agent ban in Guided mode. Agents now run normally in both modes. In Guided mode, the main model parses agent output and presents findings step by step with AskUserQuestion — never dumps raw output.
- **Fidelity hook – /simplify reminder**: Every source code write during plan execution now includes a reminder to run /simplify.
- **Fidelity hook – git branch check**: Warns if current branch doesn't match the active plan name. Catches: on main/master, or on a mismatched feature branch.
- **Plan copy rule (CRITICAL)**: Added prominent call-out in CLAUDE.md — plan MUST be copied to `plans/` before implementation, otherwise TDD/fidelity/git hooks can't activate.
- **Review command overhaul**: 2 sequential multiSelect questions (7 areas across 2 groups), direct Read paths to skill reference files, minimum 3 structured recommendations per finding (what/why/tradeoff), always AskUserQuestion at transitions.
- **Dev command overhaul**: Plan Mode mandatory (Read template → EnterPlanMode → ExitPlanMode → copy to plans/), TDD before code, phase-by-phase with /simplify, Playwright visual verification for UI changes.
- **Feature-scoped deliverables**: Existing projects create feature subfolders (`documents/design/features/[name]/`) to prevent naming collisions.
- **Orchestrator agent rule**: Agents run in Guided mode but output presented step by step.
- **No personalization for existing projects**: Hook Case 2 now explicitly prohibits memory-based greetings.
- **Compound documenter**: Option for existing projects (user decides), auto for new products at phase completions.

## [2.1.0] – 2026-03-31

### Changed

- **Existing project feature flow**: `/de:design` now differentiates between `project_type: new` (full 4-phase pipeline) and `project_type: existing` (abbreviated feature flow: understand → plan → optional depth → implement). Existing projects skip discovery and strategy phases.
- **Agent delegation reinforced everywhere**: Added explicit "do NOT delegate to agents" in design command Guided mode section, meta-orchestrator Guided mode section, and dev command implementation section. Listed all agent names to prevent ambiguity.
- **Problem statement minimum 7 questions**: Added bold mandatory note and reinforced that forcing questions are not optional.
- **Plan Mode mandatory for implementation**: Dev command now explicitly says "You MUST use EnterPlanMode. Do NOT present the plan as chat text." Links to CLAUDE.md structured format.
- **Component architecture enforcement**: Added CLAUDE.md rule requiring implementation to follow project's existing architecture. Never create monolithic files.
- **Implementation workflow**: Dev command rewritten with explicit read-patterns → plan → TDD → phase-by-phase → /simplify → audit → git → document sequence. Guided mode: main model implements, no agent delegation.
- **Output formatting examples**: Added sentence case examples for deliverable names, em dash → en dash examples.

## [2.0.0] – 2026-03-31

### Breaking

- **Folder restructure**: Config moved from `.design-engineer.yaml` (root) to `.design-engineer-plugin/config.yaml`. Deliverables moved from `docs/design/` to `documents/design/`. Dependencies tracking moved to `.design-engineer-plugin/dependencies.yaml`. Technical files separated from user deliverables.
- **"God mode" renamed to "Autopilot"**: All references updated across skills, commands, README, CLAUDE.md.

### Changed

- **Status line rewrite**: Reads 5h/7d usage from stdin `rate_limits` (automatic, no monitor needed). Removed watch mode and credential access. Shows model with context window "(1M)", keeps directory, compact bars.
- **Review command**: MultiSelect for review areas, scoping question (whole app / specific page / recent changes), loads actual skills for reference knowledge, shows finding count upfront, structured recommendations with 3–4 options and "(Recommended)" marker, collects all fixes then ONE plan via Plan Mode.
- **AskUserQuestion labels**: Specific and action-oriented. "New product" / "Existing project", "Review my project" / "Implement from Figma", "Guided mode" / "Autopilot".
- **Double hyphens forbidden**: `--` added to output formatting rule 1.
- **CLAUDE_PLUGIN_ROOT resolved**: Hook script resolves its own absolute path instead of using unresolvable variable in additionalContext.
- **Status line explanation**: Brief description of what it does before asking the user to install.
- **Returning flow**: Hook checks `project_type` in config. Existing projects get AskUserQuestion with goal options, not pipeline resume state.

## [1.27.0] – 2026-03-30

### Changed

- **Guided mode: no autonomous agents**: Added agent delegation rule — in Guided mode, the main model does all work step by step. Agents are for God mode only. Review command updated with explicit per-finding interaction flow.
- **Setup: no bloat**: Hook now explicitly forbids Explore agents during setup. Only detect-environment.sh runs. Results show only goal-relevant info, no Git/CLAUDE.md jargon.
- **Status line: use our script, not built-in**: Hook explicitly tells model to copy our de-statusline.js instead of using the built-in statusline-setup agent.
- **Returning flow: check project_type**: Hook now injects context for existing projects (project_type: existing) telling the model to show capabilities via AskUserQuestion. meta-setup checks project_type before showing pipeline state.

## [1.26.0] – 2026-03-30

### Changed

- **All commands follow PLAN → EXECUTE → PRESENT → FEEDBACK**: `/de:design`, `/de:dev`, `/de:prototype`, `/de:document` all rewritten to read mode from config, plan before executing, and present results step by step in Guided mode or as structured summaries in God mode.
- **Context-aware planning**: Commands scan the project before presenting options — only suggest what's relevant for the current tech stack and project state.
- **Mode from config**: All commands read mode from `.design-engineer.yaml` instead of asking. No more redundant mode questions.
- **Removed redundant mode selection**: `/de:design` no longer asks mode (already set during onboarding). Uses config value.

## [1.25.1] – 2026-03-30

### Changed

- **Review command rewrite**: Replaced 7 fixed review options with context-aware planning. The command reads project context, builds a review plan based on what's relevant, and follows PLAN → EXECUTE → PRESENT → FEEDBACK. Guided mode reviews step by step with feedback per finding. God mode executes all and shows structured summary.
- **Status line compact**: Halved progress bar width (5 segments), "context" not "ctx", removed "used"/"left" text, stripped "(1M context)" from model name.

## [1.25.0] – 2026-03-30

### Changed

- **Hook-driven onboarding**: Moved entire onboarding flow into the UserPromptSubmit hook injection. The hook injects the complete 4-step sequence (welcome+goal → mode → setup+status line → auto-run) as context before the model processes anything. Skills no longer attempt to chain to each other — a pattern that was never supported.
- **Removed broken skill chains**: Cleaned up 5 instances of skills trying to load other skills (meta-setup-welcome → meta-setup, meta-setup → meta-setup-existing, meta-setup-existing → meta-setup-configure). Commands can load skills (works), but skills cannot load skills (never worked).

### Known issues

- `meta-orchestrator` uses "invoke the skill" / "proceed to the next skill" pattern which is also broken. Affects `/de:design` pipeline. Fix requires the same hook-driven approach — tracked for a future session.

## [1.24.2] – 2026-03-30

### Fixed

- **Batch welcome + goal into single AskUserQuestion**: The model ignored skill-to-skill routing from existing → configure because it had enough context (goal) to act directly. By batching welcome and goal into one call, the model gets both answers at once and MUST load configure for mode selection — it has no alternative.

## [1.24.1] – 2026-03-30

### Fixed

- **Chained single-task skills**: Split existing-project onboarding into `meta-setup-existing` (goal only, ~30 lines) → `meta-setup-configure` (mode + setup + status line, ~60 lines). Each skill has one main question. Setup is sandwiched between mode and status line questions so it can't be skipped.

## [1.24.0] – 2026-03-30

### Changed

- **Existing-project flow streamlined**: Replaced 3 diagnostic questions (project type, current state, goal) with single goal question + mode selection. Auto-setup runs silently (env detection, config, scaffold). Status line question. Then auto-runs the chosen command.
- **Mode selection for existing projects**: Guided vs God mode now asked during existing-project onboarding, saved to config, affects all subsequent commands.
- **Command execution philosophy**: Added CLAUDE.md rule requiring all commands to follow PLAN → EXECUTE → PRESENT → FEEDBACK pattern in both Guided and God modes. Neither mode should skip planning or dump raw output.

## [1.23.2] – 2026-03-30

### Changed

- **Existing-project flow split**: Extracted into `meta-setup-existing` skill (~130 lines). Model gets a focused file with one flow instead of a 400+ line multi-path skill. Follows the same approach that fixed the welcome prompt.
- **Goal options**: Replaced generic options with 4 specific goals: review what I have, implement from Figma, design a new feature, set up the dev workflow.
- **Removed Step 6 from meta-setup**: Capability guide and existing-project setup now live in `meta-setup-existing`. Returning users who choose "Browse" are routed there.

## [1.23.1] – 2026-03-30

### Changed

- **Skill split**: New-to-plugin welcome prompt moved to separate `meta-setup-welcome` skill (~30 lines). The model for new projects gets a tiny, focused file with one job instead of a 470-line multi-path skill.
- **Hook directive**: State injection hook now includes the exact AskUserQuestion spec as a first-action directive — the earliest context the model sees.
- **Command simplification**: `/de:start` command reduced to pure routing (load welcome skill or meta-setup based on state).

## [1.23.0] – 2026-03-30

### Changed

- **Hook scoping**: All command hooks now gate on `.design-engineer.yaml` — silent in projects that haven't run `/de:start`. The state injection hook uses inverse logic (only fires when config is absent). Plugin installed globally but hooks only activate per-project after setup.
- **Plan drift review**: Replaced Haiku prompt hook (fired on every Write/Edit globally) with deterministic keyword scan + background Agent review trigger in the fidelity command hook. Zero LLM overhead, only fires on plan file writes in configured projects.

## [1.22.3] – 2026-03-30

### Fixed

- **Hook output format**: State injection hook now outputs JSON with `hookSpecificOutput` (matching other command hooks) instead of plain text. Plain text caused "UserPromptSubmit hook error" in all projects.
- **Global PostToolUse:Edit error**: Removed Sonnet content preservation hook that fired on every Edit across all projects, causing errors globally. Will be reimplemented with proper gating later.

## [1.22.2] – 2026-03-30

### Fixed

- **UserPromptSubmit hook error**: Removed invalid Haiku prompt cleaner from UserPromptSubmit – it errored on slash commands with empty input and likely blocked the state injection hook from running. Only the command-based state injection hook remains.
- **Hook audit**: Verified all PreToolUse, PostToolUse, and Stop hooks are correctly configured.

### Removed

- **Prompt cleaner hook**: The Haiku-based prompt improvement hook was removed from UserPromptSubmit. It was causing errors on every slash command invocation. Will be reimplemented as a command-based solution later.

## [1.22.1] – 2026-03-30

### Fixed

- **Architectural state injection**: Replaced prompt-based state detection (failed 3 times) with a UserPromptSubmit command hook that injects project state as immutable context before the model processes `/de:start`. The model now reads pre-computed state instead of making its own judgment call.
- **Existing project setup flow**: Added mandatory transition guards between Step 6 sub-steps (6a→6b→6c→6d) so the model can't skip diagnostic questions or setup. Added status line question to Step 6d for existing projects.
- **Model upgrade**: `meta-setup` upgraded from `sonnet/medium` to `opus/high` for more reliable instruction following alongside the architectural fix.

## [1.22.0] – 2026-03-29

### Added

- **Content preservation hook**: New Sonnet PostToolUse prompt hook reviews substantial edits for unintended content loss. Fires on `Edit|MultiEdit`, bails out on small/trivial changes, blocks when important content appears to have been removed.
- **Plan completeness checklist**: Plan format now requires a `**Checklist:**` field per phase with discrete deliverable items. Post-phase workflow includes a mandatory completeness review step before presenting to the user.
- **Content-loss detection in fidelity hook**: Existing `de-fidelity-hook.js` now warns when an edit removes more than 30% of the replaced content during plan execution.

## [1.21.3] – 2026-03-29

### Fixed

- **Architectural state detection**: Moved project state check from LLM judgment to a shell script (`detect-state.sh`). The model now follows the script output instead of deciding on its own whether a project is new or returning.
- **No-jargon output rule**: Added output formatting rule 3 to CLAUDE.md – no config file names, internal skill IDs, hook names, or detection logic in user-facing messages. Rewrote meta-setup templates (resume state, environment detection, setup summary) to use plain language.
- **Path B memory leak**: Strengthened guards to block auto-memory from influencing any part of the new-to-plugin flow – routing, greeting, status, and question selection.
- **Diagnostic questions skipped**: Added explicit "do not skip" instruction to prevent the model from inventing custom options based on memory.
- **Hook error on slash commands**: `UserPromptSubmit` prompt cleaner errored on empty slash command input. Added early bail-out for empty and `/`-prefixed inputs.

## [1.21.2] – 2026-03-29

### Fixed

- **Project state detection**: `/de:start` could misidentify an existing project (never used with the plugin) as a "returning project" when Claude's auto-memory contained rich context from previous sessions. Added hard gate in `meta-setup` – only `.design-engineer.yaml` determines plugin usage, not memory or project history.

## [1.21.1] – 2026-03-27

### Changed

- **Scope drift detection**: Fidelity hook now warns when Claude writes files not listed in any phase of the approved plan. Catches unplanned file creation during implementation.
- **Forcing questions**: `ux-problem-statement` Step 3 enriched with 6 pointed questions (demand reality, status quo, narrowest wedge, surprising observations, failure mode, existing alternatives) for cutting through vague product thinking.

## [1.21.0] – 2026-03-27

### Changed

- **Git workflow automation**: `dev-github-workflow` transformed from a teaching skill into a working automation tool. Handles commits, branches, PRs, and merges in two modes – automatic (during plan execution) and manual (user invokes directly). Conventional Commits format with plugin attribution footer.
- **Plan workflow git integration**: CLAUDE.md plan execution now creates a feature branch at plan start, commits after each approved phase, and creates a PR when the plan completes.
- **Dev pipeline git step**: `/de:dev` feature cycle now includes a commit step after each feature is built and audited.

## [1.20.2] – 2026-03-27

### Changed

- **Component reuse enforcement**: Plan template `Reuse` field now requires specific component-level decisions (use as-is / extend with variants / create new). Frontend implementer has a mandatory component audit step before writing code. Fidelity hook warns when creating new component files in component directories.

## [1.20.1] – 2026-03-26

### Added

- **Figma design intake hooks**: PreToolUse hook on screenshot tools blocks screenshot-only implementation/review – requires `get_design_context` first. PostToolUse hook on `get_design_context` prompts AI to ask clarifying questions about interactions, animations, state changes, and anything not visible in static designs.
- **Frontend implementer update**: Agent now requires `get_design_context` (never screenshots alone) and must ask clarifying questions before implementing designs.

## [1.20.0] – 2026-03-26

### Changed

- **Incremental plan implementation**: Plan mode now requires phased execution with user review between each phase. Every phase must have `Depends on` (dependencies) and `QA` (review instructions) fields. Claude creates tasks for each phase, implements one at a time, presents QA instructions, and waits for feedback before proceeding.
- **Phase ordering enforcement**: `de-fidelity-hook.js` extended to parse plan phases and warn when Claude writes files from a later phase before completing earlier ones.

## [1.19.1] – 2026-03-24

### Changed

- **Figma MCP routing**: New `figma-mcp-routing.md` reference with decision guide, capability matrix, and workflow recipes for choosing between "Figma Plugin" and "Figma Console MCP".
- **Dual-MCP support**: `ui-figma-handoff` no longer requires "Figma Console MCP" exclusively – works with "Figma Plugin"'s `use_figma` as fallback. "Figma Console MCP" recommended for variables, linting, and batch operations.
- **New capabilities**: `ui-figma-guide` updated with web capture (`generate_figma_design`) and design system rules generation (`create_design_system_rules`) from the "Figma Plugin" update.

## [1.19.0] – 2026-03-24

### Added

- **Prompt improvement hook**: `UserPromptSubmit` hook runs every message through Haiku for light cleanup – fixes grammar, removes filler words, numbers multiple requests, slightly tightens conversational tone. Preserves all context and meaning. Short confirmations are skipped.

## [1.18.1] – 2026-03-24

### Added

- **Animation reference enrichment**: 4 new reference files in ui-aesthetic-review – animation-by-emotion (7 emotions mapped to timing/easing/scale), animation-by-component (10 UI element timing specs), animation-by-context (6 industry-specific animation philosophies), animation-troubleshooting (9 problem-diagnosis patterns with fixes).

## [1.18.0] – 2026-03-23

### Added

- **Effort configuration**: Every skill and agent now has an explicit `effort:` frontmatter field. 5 max (broadest scans and reviews), 30 high (default for most skills), 14 medium (structured/mechanical tasks). No low effort used. CLAUDE.md updated with effort assignment principles.

## [1.17.3] – 2026-03-21

### Added

- **Output formatting rules**: CLAUDE.md now enforces en dashes (–) and sentence case in all Claude output – chat, deliverables, UI copy, code comments. Three agents (deliverable-writer, compound-documenter, frontend-implementer) have formatting reminders.

## [1.17.2] – 2026-03-20

### Changed

- **En dash cleanup**: Replaced 503 em dashes with en dashes (–) across 45 files. The plugin now uses en dashes consistently everywhere.
- **README humanized**: Rewrote for beginners – removed promotional language, title case headers, jargon ("dependency graph", "deliverables tracked by"), and AI writing patterns. Sentence case throughout. Simpler descriptions in all tables.

## [1.17.1] – 2026-03-20

### Added

- **Swiss knife branding**: Logo (`logo.svg`) added to repo and README header. Philosophy section rewritten with swiss knife identity and 6 methodology points (restored "Teach while working" and "Tool-agnostic" from v1.11.0). Branded welcome line in `/de:start`.

## [1.17.0] – 2026-03-20

### Added

- **Eval overhaul**: 222 new evals (196 trigger tests, 6 functional for uncovered skills, 20 error/edge cases). Added `type` field to all evals (`functional`, `trigger_positive`, `trigger_negative`, `error`). Total coverage: 341 evals across all 49 skills and 6 commands.
- **Negative triggers in descriptions**: 22 skills now include "Do NOT use for..." phrases to prevent cross-triggering, especially among the 14 psychology skill pairs.
- **Error handling sections**: 6 MCP-dependent skills now have "Common Issues" troubleshooting guides per Anthropic's skill guide.
- **Optional frontmatter**: `license: MIT` on all 49 skills. `compatibility` on 6 skills with external dependencies.

### Changed

- **CLAUDE.md Skill Compliance Checklist**: Updated to include `license` and `compatibility` (when applicable) as frontmatter fields.

## [1.16.1] – 2026-03-20

### Changed

- **README rewrite for newcomers**: Prerequisites with install links, getting started guide, how-it-works overview, recommended tools table, collapsible skill reference. Written for someone who may have never used Claude Code before.

## [1.16.0] – 2026-03-20

### Changed

- **Flattened directory structure**: Plugin root is now the repo root per Anthropic's official plugin spec. Removed the unnecessary `plugins/design-engineer/` nesting layer.

### Removed

- 54 eval workspace directories (unused, not referenced by evals.json)
- Root-level duplicate files: README.md (pointer), CHANGELOG.md (subset), AUDIT-REPORT.md (one-time v1.10.1 artifact)
- `.claude-plugin/marketplace.json` (stale marketplace wrapper)

## [1.15.0] – 2026-03-20

### Changed

- **Skill name clarity**: Renamed 20 skills for clear, unambiguous names that are impossible to confuse with each other
- UI skills: `ui-craft-review` → `ui-aesthetic-review`, `ui-implementation-review` → `ui-design-to-code-qa`, `ui-design-references` → `ui-references-moodboard`, `ui-figma-workflow` → `ui-figma-guide`
- Dev skills: `dev-context-management` → `dev-status-tracking`, `dev-agent-pipeline` → `dev-agent-setup`, `dev-kickstart-prompts` → `dev-starter-prompts`
- UX skills: `ux-product-assessment` → `ux-full-review`, `ux-motivation-levels` → `ux-motivation-audit`
- Psych skills: `psych-master-audit` → `psych-full-scan`, `psych-cognitive-basics` → `psych-cognitive-load`, `psych-engagement-motivation` → `psych-engagement-patterns`, `psych-efficiency` → `psych-simplification`, `psych-time-behavior` → `psych-time-perception`
- Psych econ/decision/emotion pairs: `psych-behavioral-economics-core` → `psych-pricing-psychology`, `psych-behavioral-economics-habits` → `psych-habit-formation`, `psych-decision-making-core` → `psych-decision-fundamentals`, `psych-decision-making-advanced` → `psych-decision-persuasion`, `psych-emotional-design-core` → `psych-delight-design`, `psych-emotional-design-advanced` → `psych-emotional-retention`
- Updated all cross-references: pipeline-sequence, commands, agents, evals.json, README, CHANGELOG, AUDIT-REPORT
- Renamed 17 eval workspace directories to match new skill names
- Eval workspace content (transcripts, grading) left as frozen historical artifacts

## [1.14.0] – 2026-03-20

### Changed

- Renamed 2 skills for clarity: `ux-story-panels`, `ux-motivation-audit`
- Standardized framework terminology across all skills and references

## [1.13.1] – 2026-03-19

### Added

- Complete persona example in `persona-framework.md`
- Consolidated StoryBrand canvas view in `storybrand-canvas-template.md`
- Lean Canvas section in `business-plan-template.md` (Ash Maurya)
- TAM/SAM/SOM structured explanation in `business-plan-template.md`

## [1.13.0] – 2026-03-19

### Added

- Story Panels image-generation workflow with example images
- Statusline `--watch` mode for usage limit tracking
- Usage monitor instructions in /de:start setup flow

### Removed

- 3 redundant reference files consolidated into existing ones

### Changed

- 12 UX reference files trimmed and improved
- Corrected tap target size to 44pt (WCAG 2.2 standard)
- Statusline credential access restricted to user-initiated `--watch` mode only

### Security

- Statusline no longer accesses macOS Keychain or credentials when triggered by Claude

## [1.12.0] – 2026-03-19

### Added

- Auto-memory integration: CLAUDE.md now includes a Memory Management section guiding Claude on when to read/write auto-memory across sessions
- Project Map (`memory/project-map.md`): living file tree with descriptions and "when to read" triggers – replaces ad-hoc filesystem exploration
- Debug Solutions (`memory/debug-solutions.md`): preserves hard-won debugging fixes (3+ attempts) so they survive session boundaries
- Memory initialization in `/de:start`: seeds MEMORY.md, project-map.md, and debug-solutions.md for new and existing projects
- Memory checkpoints in `meta-orchestrator`: reads memory at startup, updates pipeline position and project map after each phase
- Memory checkpoints in `dev-agent-setup`: reads project map and debug solutions before development, saves new fixes during the loop
- Stop hook memory reminder: prints a reminder to update memory at every session end

### Changed

- `meta-orchestrator` Step 0 now reads auto-memory (MEMORY.md + project-map.md) before checking resume state
- `dev-agent-setup` steps renumbered (3→6) to accommodate new memory read step

## [1.11.0] – 2026-03-18

### Added

- Smart entry point: `/de:setup` now detects project state and routes to three paths – returning projects resume, new products get full setup, existing projects get a capability guide with filtered recommendations
- Capability guide: existing project users see all plugin capabilities in plain language, answer diagnostic questions, and get filtered recommendations
- Iterative build enforcement: dev pipeline explicitly requires one-feature-at-a-time development with compound documentation after each cycle
- `/de:document` command: renamed from `/de:compound`, now includes stakeholder communication option (promotes `ux-communicating-decisions`)
- Psychology audit merged into `/de:review`: expanded psychology option with master audit, section deep-dive, and god mode

### Removed

- `/de:research` command (subset of `/de:design` – use design with phase jumping or direct access)
- `/de:statusline` command (status line install handled by `/de:setup`)
- `/de:psych` command (merged into `/de:review` as expanded psychology option)
- Agent templates from `dev-agent-setup` (users copy actual agents from `agents/` directory instead)

### Renamed

- `ui-design-critique` → `ui-aesthetic-review` (distinguishes from implementation review)
- `ui-visual-review` → `ui-design-to-code-qa` (clarifies focus on implementation fidelity)
- `ux-psych-framework` → `ux-motivation-audit` (matches the specific technique: Motivation Levels + Experience Value)
- `meta-compound` → `meta-document` (self-explanatory name)
- `ux-bias-framework` → `ux-bias-audit` (action-oriented: performs a bias audit)

### Changed

- Pipeline Phase 1: removed `ux-big-idea` (was a misinterpretation of the article's concept), pipeline now starts with `ux-problem-statement`
- Pipeline Phase 2: reordered to `ux-behavior-mapping` → `ux-storybrand` → `ux-story-panels` → `ux-business-plan` (behavior mapping is foundational, informs everything after)
- Pipeline Phase 4: moved `ux-psych-framework` here from Phase 2 (needs actual designs to analyze Motivation Levels)
- All UX skills: replaced rigid "4-angle perspectives" and predefined question lists with context-based approach – AI shares brief thoughts based on project knowledge, then asks 7-10 context-adapted questions with source-specific concept guidance
- `/de:setup` description updated to reflect smart entry point behavior
- `/de:design` prerequisite check now uses `.design-engineer.yaml` (was `design-engineer.local.md`)
- Documentation fixes: root README counts, plugin README model counts, CLAUDE.md directory listing, stale eval references

### Removed

- `ux-big-idea` skill (directory, references, all cross-references)
- Parallel group 2a (behavior-mapping and psych-framework no longer parallel)
- Rigid "Share Initial Perspectives" pattern with fixed 4-angle templates across all skills
- Predefined strategic question lists across all skills (replaced with context-based guidance)

## [1.10.1] – 2026-03-18

### Added

- `de-fidelity-hook.js` PostToolUse command hook – injects requirement fidelity reminders after source code writes during active implementation
- Haiku prompt hook for plan files – reviews plans for requirement drift (added features, modified copy, scope expansion) and warns Claude to revert or ask the user
- Requirement Fidelity section in CLAUDE.md defining drift vs. acceptable implementation details

## [1.10.0] – 2026-03-18

### Added

- `de-prompt-injection-hook.js` PostToolUse hook – scans tool outputs for indirect prompt injection attempts across 5 categories (instruction override, role-playing/DAN, encoding/obfuscation, context manipulation, instruction smuggling). 55+ patterns ported from lasso-security/claude-hooks to JavaScript. Warns Claude without blocking. Fail-open design.

## [1.9.3] – 2026-03-18

### Added

- testing-anti-patterns.md reference in dev-agent-setup (5 anti-patterns with code examples, gate functions, common rationalizations, red flags)

### Changed

- test-writer agent: Iron Law, verify RED/GREEN checklists, When Stuck table, Good Tests table, anti-patterns reference link
- CLAUDE.md TDD section: Iron Law, Red Flags list, detailed verify steps, anti-patterns reference

## [1.9.2] – 2026-03-18

### Added

- advanced-animations.md: clip-path patterns, gesture/drag, WAAPI, debugging

### Changed

- motion-design.md: animation decision framework, never scale(0), popover transform-origin, blur masking, @starting-style, spring configuration, asymmetric timing, Framer Motion/CSS-vs-JS performance
- ui-design-critique/skill.md: craft philosophy ("taste is trained", Paul Graham quote)

## [1.9.1] – 2026-03-18

### Changed

- typography.md: added text wrapping (balance/pretty), font smoothing, tabular-nums when-to-use guide
- spatial-design.md: added concentric border radius, expanded optical alignment, shadows as borders, image outlines
- motion-design.md: added interruptible animations, contextual icon animations (exact values), scale on press, skip-animation-on-load, expanded performance section
- interaction-design.md: added minimum hit area with pseudo-element pattern and collision rule

## [1.9.0] – 2026-03-18

### Added

- 8 frontend design reference files in ui-design-critique (typography, color-and-contrast, spatial-design, motion-design, interaction-design, responsive-design, ux-writing, anti-patterns)
- AI Slop Test as 5th named test in ui-design-critique – checks against documented common AI aesthetic patterns
- Cross-references from ui-visual-review to shared design domain references

## [1.8.0] – 2026-03-16

### Added

- Explicit model configuration for all 9 agents and 50 skills
- Model Configuration section in CLAUDE.md with assignment principles
- Model guidance in agent templates for user project customization

### Changed

- 6 agents set to `model: opus`, 3 to `model: sonnet` (was: all `inherit`)
- 36 skills set to `model: opus`, 14 to `model: sonnet` (was: no model field)
- Skill Compliance Checklist updated to require `model:` field

## [1.7.0] – 2026-03-12

### Added

- TDD with Playwright CLI – mandatory test-first development for all code-producing steps
- New `test-writer` agent – writes failing Playwright CLI test scripts before implementation (context-isolated)
- New `de-tdd-hook.js` PreToolUse hook – blocks source code writes when no test scripts exist in `tests/`
- Test archival pattern: active tests in `tests/`, archived to `tests/archive/` after feature completion
- New agent template `test-writer.md` for user project customization

### Changed

- Dev pipeline Phase 3 expanded: test-writer → Red → implementation → Green (was: implementation only)
- Pipeline steps renumbered: 13 → 17 steps across 5 phases
- Pipeline Violations expanded with TDD-specific violations
- REMEMBER FOR EVERY PROMPT expanded to 12 items
- Agent count 8 → 9

## [1.6.1] – 2026-03-12

### Added

- `/simplify` integration – mandatory code quality pass after every code-producing step
- Runs after backend-implementer, after frontend-implementer, and as a final pass before design-system-auditor
- Runs after prototype generation and final iteration in dev-prototyping
- Code quality rule added to CLAUDE.md and CLAUDE.md template

### Changed

- Dev pipeline renumbered: Phase 3 includes /simplify steps, old Phase 4 (Wrap Up) split into Phase 4 (Quality Audit) + Phase 5 (Wrap Up)
- Pipeline Violations updated to include skipping /simplify
- REMEMBER FOR EVERY PROMPT expanded to 11 items

## [1.6.0] – 2026-03-12

### Added

- Plan Mode integration – Claude now uses EnterPlanMode for all non-trivial planning instead of text-based plans
- Project-local plan storage in `plans/` with date-prefixed filenames
- Plan archival to `plans/archive/` when implementation completes
- Structured plan template (summary, architectural decisions, phased breakdown, risk assessment) embedded in CLAUDE.md

### Changed

- Merged `plan-creator` agent into Plan Mode flow – planning now happens in the main conversation with full context, not a sub-agent
- `dev-agent-setup` Phase 2 uses Plan Mode instead of plan-creator sub-agent
- Pipeline development loop updated across orchestrator, commands, and agent references
- Agent count 9 → 8, version 1.5.2 → 1.6.0

### Removed

- `plan-creator` agent (replaced by Plan Mode with structured template)

## [1.5.2] – 2026-03-12

### Changed

- Context monitoring now includes a ready-to-use compact message proactively in the warning – no extra round-trip needed
- Updated compaction guidance in context-engineering-guide, context-survival-guide, meta-compound skill, and CLAUDE.md template to match the proactive pattern

## [1.5.1] – 2026-03-12

### Changed

- Renamed Context7, Figma (official), and Playwright from "MCP" to "plugin" across all skills, commands, and references
- `detect-environment.sh` now reads `enabledPlugins` from `~/.claude/settings.json` and separates output into `Plugins found:` / `MCPs found:`
- Simplified fragile Figma plugin detection logic
- `.design-engineer.yaml` template: split `mcps:` block into `plugins:` and `mcps:` sections, `figma_mcp:` → `figma:`
- `setup-checklist.md`: `Context7 MCP` → `Context7 plugin`, `Playwright MCP` → `Playwright plugin`, `Figma with MCP` → `Figma with plugin`
- `mcp-catalog.md`: section headers updated, `Essential MCPs` → `Essential Plugins`, `Recommended MCPs` → `Recommended`

### Removed

- Remotion MCP from `dev-mcp-setup` skill and `mcp-catalog.md` (unrelated to design engineering)
- "Specialized MCPs" category from catalog

## [1.5.0] – 2026-03-12

### Added

- New `de-safety-hook.js` PreToolUse hook – context-aware protection against destructive Bash commands
  - Filesystem: blocks `rm -rf`, `chmod 777`
  - Git: blocks force push, `reset --hard`, `clean -f`, `checkout --`, `branch -D`, `stash drop/clear`
  - Database: blocks `DROP TABLE/DATABASE/SCHEMA`, `TRUNCATE`, `DELETE` without `WHERE`
  - Environment: warns on `git add .env` (staging secrets)
  - Context-aware: allows patterns in data context (grep, echo, cat, etc.)
  - Shows safer alternatives alongside every block
  - Fail-open design with debug logging to `~/.claude/cache/de-safety.log`

### Changed

- Updated hooks description to include safety

## [1.4.0] – 2026-03-12

### Added

- New `de-statusline.js` hook – status line showing model, usage limits (5h/7d with reset times), context bar, and pipeline progress
- New `meta-statusline` skill – manages status line installation, uninstallation, and status checking
- New `/de:statusline` command with install | uninstall | status subcommands
- Status line question added to `/de:setup` flow (new Step 6)
- Bridge file compatibility with GSD context monitor (`/tmp/claude-ctx-{session}.json`)
- Background API fetch for Anthropic usage data with 60s cache

### Changed

- `meta-setup` now includes status line installation option (Steps 6-8 renumbered from 5-7)
- Skill count 49 → 50, command count 8 → 9

## [1.3.0] – 2026-03-11

### Added

- New `ui-figma-handoff` skill – automates Figma design structuring (components, tokens, variables, styles) and dev handoff preparation (annotations, sections, connectors, dev status) using Figma Console MCP
- Three new reference files: `figma-structuring-guide.md` (7-phase methodology), `figma-handoff-guide.md` (handoff preparation process), `figma-console-helpers.md` (code snippets for Figma Console MCP)
- Code-to-Figma import guidance in `dev-prototyping` and `ui-figma-guide`
- `figma-handoff` deliverable in dependency graph with upstream/downstream tracking

### Changed

- Rewrote `figma-for-ai-dev.md` – no longer says "skip components and tokens"; now recommends automating with Figma Console MCP when available, with minimal approach as fallback
- Updated `figma-mcp-guide.md` – renamed to Figma Integration Guide, added code-to-Figma import capability and `ui-figma-handoff` reference
- `ui-figma-guide` Step 3 updated: conditional guidance based on Figma Console MCP availability
- Phase 4 pipeline: `ui-figma-handoff` added as optional step after `ui-figma-guide`
- Standardized Figma tool names across all files: "Figma plugin" (official) and "Figma Console MCP"
- Skill count 48 → 49, UI Design category 6 → 7

## [1.2.0] – 2026-03-11

### Added

- New `/de:prototype` command – 8th top-level command for standalone HTML prototype generation (new products, features, or redesigns)
- Rewrote `dev-prototyping`: question-based context gathering (planning docs, existing codebase, Figma designs, or just an idea), generates single-file HTML prototypes in Claude Code, applies design intent and starter values
- Added `prototype` deliverable to dependency graph with full upstream/downstream tracking
- Added "HTML prototype" as review target in `ui-design-critique`, `ui-visual-review`, and `ui-accessibility`
- Added `references/multi-session-workflow.md` to `dev-status-tracking` with tool-agnostic session management rules

### Changed

- Phase 4 pipeline restructured: `dev-prototyping` now runs sequentially AFTER `ui-references-moodboard` and BEFORE `ui-figma-guide` (was parallel with figma-workflow)
- `ui-figma-guide` now depends on prototype deliverable (prototype informs which key screens to design in Figma)
- `dev-prototyping` removed from `/de:dev` command (now accessed via `/de:prototype` or pipeline)
- Cleaned up ~17 "Claude Projects" references across 12 files to be tool-agnostic or Claude Code-specific

### Removed

- Removed `dev-claude-projects` skill (content merged into `dev-status-tracking` and `meta-compound`)
- Removed parallel-group 4a from pipeline sequence
- Skill count 49 → 48, Development category 8 → 7, Command count 7 → 8

## [1.1.1] – 2026-03-11

### Added

- Session pause/resume – Stop hook now writes resume state to `.design-engineer.yaml`; orchestrator detects it on startup and offers to continue where you left off
- Progress routing – orchestrator shows phase completion summary from `.dependencies.yaml` before asking project state
- Parallel group annotations in pipeline sequence for 4 skill groups (Phases 2, 4, 5) with execution guidance for god/guided modes
- AskUserQuestion preview mockups in `ui-references-moodboard` (design feel), `ui-design-system` (depth strategy), and `ux-information-architecture` (navigation model)
- Context monitoring instruction in CLAUDE.md – suggests compaction at ~90% usage with state-preserving compact message
- Model recommendations in orchestrator – suggests Opus for planning phases, asks user preference (Sonnet default) at Phase 5 transition
- Preview usage rule added to Skill Compliance Checklist

### Changed

- `meta-orchestrator` startup sequence now checks for resume state (Step 0) before asking mode/project state
- `meta-orchestrator` reads `.dependencies.yaml` for automatic progress summary, skipping redundant project state question
- `meta-orchestrator` handles parallel groups during pipeline execution (god mode: simultaneous agents; guided mode: user choice)
- `session_dep_summary.py` enhanced to write resume state in addition to printing dependency summary

## [1.1.0] – 2026-03-10

### Added

- New `ui-design-critique` skill with 4-lens craft critique framework (Composition, Craft, Content, Structure) and 4 named tests (Swap, Squint, Signature, Token)
- Design intent guide reference for `ui-references-moodboard` with "Where Defaults Hide" philosophy, Intent-First framework, Product Domain Exploration, and WHY checkpoint
- Starter values reference for `ui-design-system` with spacing, typography, text hierarchy, border progression, surface elevation, depth strategies, and shadow scales
- Prompt templates reference for `ui-design-system` with 6 curated task-specific prompts
- Design system persistence mechanism (`.design-system/system.md` save/load)
- UX non-negotiables check in `ui-visual-review` (6 fundamental usability principles)
- UX pattern issues section in `ui-visual-review` common issues catalog

### Changed

- `ui-references-moodboard` expanded from reference collection to full design thinking skill
- `ui-visual-review` adds UX non-negotiables check before visual audit
- `ui-design-system` checks for saved decisions on startup and offers persistence on completion
- Skill count 48 → 49, UI Design category 5 → 6

## [1.0.0] – 2026-03-10

### Added

- Initial plugin scaffold with marketplace and plugin manifests
- 7 entry point commands using `de:` namespace (`de:setup`, `de:design`, `de:research`, `de:psych`, `de:dev`, `de:review`, `de:compound`)
- 48 hidden skills across 6 categories:
  - 3 meta skills (setup, orchestrator, compound)
  - 10 UX research skills (big-idea through information-architecture)
  - 8 UX design skills (story-panels, behavior-mapping, bias-audit, journey-mapping, ethics-review, product-assessment, and more)
  - 14 psychology skills covering 100 UX laws across 10 sections (cognitive basics, visual perception, decision-making, engagement, emotional design, efficiency, behavioral economics, social influence, cognitive biases, time and behavior)
  - 5 UI design skills (design-references, figma-workflow, design-system, visual-review, accessibility)
  - 8 development skills (claude-projects, claude-md, kickstart-prompts, agent-pipeline, context-management, mcp-setup, github-workflow, prototyping)
- 9 specialized agents (context-analyzer, plan-creator, backend-implementer, frontend-implementer, design-system-auditor, psych-scanner, ux-researcher, deliverable-writer, compound-documenter)
- 80 reference files with full adapted content from source materials
- 2 hook scripts for deliverable dependency tracking (PostToolUse and Stop hooks)
- Context7 MCP server integration (bundled)
- Dependency graph system with `.dependencies.yaml` tracking
- God mode and Guided mode for commands
- Eval test suite with realistic test prompts
