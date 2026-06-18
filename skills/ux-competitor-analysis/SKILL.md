---
name: ux-competitor-analysis
description: Conducts structured competitive analysis identifying direct and indirect competitors, strengths, weaknesses, and market positioning. Use when you need to understand the competitive landscape before making product or business decisions.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Competitor Analysis

> **Opt-in depth.** This skill is off the default discovery spine. The default flow runs problem statement, target audience, MVP requirements, information architecture, prototype, then development. Run competitor analysis only when the user adds depth, either by asking for it directly or by picking it from the optional depth menu.

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_competitor_analysis`. If it indicates the project already has a competitor analysis (in repo, or via an off-repo reference such as Notion / Confluence captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the competitive positioning.
2. Ask via AskUserQuestion: "Your project already has a competitor analysis at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only (e.g., updating specific competitors).
5. If "Re-run anyway" → proceed normally below.

## Why This Matters

Classic competitor analysis can eat up days. AI makes it much faster if you know how to set it up correctly. The key is never just asking AI to "do a competitor analysis" – that produces garbage. The quality depends entirely on the specificity of the prompt and the context provided.

Two critical starting points:

- **Do not skip indirect competitors.** Even if it feels like "there is nothing like my product," similar solutions almost always exist in another form.
- **If stuck, look back at your survey results.** Users often mention tools they already use, which reveals competitors you might not have considered.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand what you already know about competitors, 2) share my initial read on the competitive landscape, 3) ask only the questions I can't infer, 4) conduct deep research on each competitor, 5) draft the competitive analysis, 6) iterate until you approve it, 7) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with competitive analysis and why it matters in product development. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Create a research plan before executing any searches.** Define: what to research, what queries to run, what dimensions to compare, what gaps to look for.

4. **Agent delegation**: Delegate the web research to the **ux-researcher** agent. Use the Agent tool to spawn it with a research plan that specifies: what to research, what queries to run, what dimensions to compare, what gaps to look for. Do not do the research yourself in the main conversation – the ux-researcher agent has specialized instructions for structured competitive analysis.

5. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

5. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Identify Current Knowledge

```
question: "What do you already know about your competitors?"
header: "Competitive Knowledge"
options:
  - label: "I do not know my competitors"
    description: "I have not researched who else is in this space"
  - label: "I know some direct competitors"
    description: "I can name a few products that do something similar"
  - label: "I know direct and indirect competitors"
    description: "I have a list of both similar products and alternative approaches"
  - label: "I have existing research to update"
    description: "I have done competitive analysis before and need to refresh it"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing competitor lists or research, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the competitive landscape based on what you already know about the project. Draw on the user's context from Step 1, any existing project documents (problem statement, persona, survey results where users mentioned tools), and your understanding of the domain.

Flag what is speculation versus what is based on shared context. If you already see obvious competitors or market gaps, mention them. The goal is to give the user starting material for their own thinking – not to follow a rigid template.

---

## Step 3: Ask Strategic Questions

Ask only what you can't infer from Step 1 and any existing documents. Don't ask for what the user already gave you or what you can reasonably draw from context. When you do have gaps, batch the questions (no more than 4 at a time) rather than asking one by one. Draw from these key concepts only for the gaps that matter:

- Do not skip indirect competitors
- Use AI research prompts (Perplexity/Liner) but do not just ask AI to "do a competitor analysis"
- Always click through competitor sites/apps yourself (manual review)
- Look at community feedback, paywall strategies, user complaints

Ask in small batches (no more than 4 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. There is no minimum question count – once you have enough to draft a grounded deliverable, move on.

---

## Step 4: Conduct Deep Research

Run the research in TWO phases. Use the right tool per phase — they are not interchangeable.

### Pacing rule (READ FIRST)

This step is where the model historically does too much work behind the scenes and surfaces only short bullet highlights at the end. Instead:

- **Each phase below is a SEPARATE turn**, not one batch. Phase 4a Step 1 (identify communities) is one turn that ends with `AskUserQuestion`. Phase 4a Step 2 (WebSearch to find threads) is the next turn. Phase 4a Step 3 (Playwright to read them) is the next. Each per-competitor deep dive in Phase 4b is its own turn.
- **Wait for explicit user response** between phases. Never run Phase 4a all the way through and then run Phase 4b without an `AskUserQuestion` checkpoint.
- **Surface ALL the URLs you visited or plan to visit** at every checkpoint, not just at the end. The user is going to want to look at these themselves and form their own opinion.
- **No "I did the research, here are the highlights" turns.** Every research turn ends with a question, not a fait accompli.

### Phase 4a: Community/forum sweep (Playwright-led, NOT WebSearch-only)

Before doing per-competitor deep dives, sweep the communities your target audience actually talks in. This finds competitors users mention organically (not just the ones you know about) and surfaces unfiltered pain points the marketing pages won't tell you.

**Tool routing — read this first to avoid the most common failure mode:**
- **WebSearch** is for URL discovery only. Use queries like `site:reddit.com r/<community> <competitor or category>` or `site:reddit.com "<competitor>" review` to FIND relevant threads.
- **Playwright** (`mcp__playwright__browser_navigate` + `browser_snapshot`) is what you actually use to READ those threads. Snippet results from WebSearch are NOT enough — you need to scroll through the actual discussion, follow links between threads, and read replies in context.
- **WebFetch** is fine for one-shot reads of marketing/blog/article pages but NOT for Reddit/HN/community pages. Those are dynamic and paginated; fetch returns a flat snapshot that misses most of the discussion.
- **Default**: when the user says "look at Reddit" or "check what people discuss," reach for Playwright first, not WebSearch. WebSearch only to find the URL.

Steps:
1. **Identify 2–4 communities** where the target audience hangs out (subreddits, Hacker News, Product Hunt, niche Discord/Slack archives, app-specific forums). Confirm with the user before browsing.
2. **WebSearch to find threads**: run 3–5 targeted `site:<community>.com` queries to discover threads where users discuss this category, alternatives to specific competitors, or recurring pain points.
3. **Playwright to read them**: navigate to each promising thread, scroll through, read the top-N comments. Capture: which competitors users mention spontaneously, which features they praise, which they complain about, what triggers them to switch.
4. **Surface findings to the user**: list the discovered competitors (compare against the user's known list), the most-cited pain points, the most-cited praises. This becomes the seed for Phase 4b.

### Phase 4b: Per-competitor deep dive

For each competitor (the user's known list + the new ones discovered in Phase 4a):
1. **Marketing page** — `WebFetch` is fine here (one-shot read of structured copy). Capture pricing, value prop, target user.
2. **Product UI** — `mcp__playwright__browser_navigate` + `browser_take_screenshot` to capture key screens for visual reference. UI quality is a research dimension.
   - **Auth wall**: most products gate the actual UI behind login/signup. When Playwright redirects to `/login` or `/signup`, you have NOT seen the product — you have seen the auth wall. Never fabricate UX claims based on the marketing page alone. Surface an `AskUserQuestion` per the canonical "Auth wall fallback" protocol in CLAUDE.md: user provides test credentials, user signs up themselves and shares session, user explicitly approves temp-email throwaway-account signup (with ToS warning), or skip with `[AUTH-WALLED]` flag. Re-ask per competitor — consent doesn't transfer.
3. **App Store / Play Store reviews** — Playwright (the listings are paginated; WebFetch misses most reviews).
4. **Strategic gaps** — synthesize what's missing across competitors that this product could address.

Cover these dimensions per competitor (deliverable structure from [competitor-analysis-framework.md](./references/competitor-analysis-framework.md)):
1. Business model and pricing strategy
2. User experience evaluation
3. Feature comparison
4. User feedback from app store reviews, Reddit, and forums (sourced via Phase 4a)
5. Strategic opportunities and gaps

### When the tools aren't available

If Playwright is not connected (the user's setup is missing the bundled MCP), fall back to: WebFetch for any URL the user provides, ask the user to manually browse community threads and paste the relevant excerpts back. Never silently skip community research because Playwright is missing — say so explicitly so the user can fix the setup.

### Bot-block fallback (Cloudflare, captcha, "are you a robot")

Many sites we want to read (Reddit threads, App Store reviews, marketplace pages, some news/content sites) block headless browsers with Cloudflare challenges, captchas, or 403/429 rate limits. When Playwright hits one of these, the snapshot returns "Just a moment…", an empty body, a captcha image, or an Access Denied page — NOT the actual content.

**You MUST stop and ask the user to help. Never silently skip a blocked URL and never silently fall back to WebSearch snippets to fake the read.** The user can almost always unblock the site in 10 seconds (open it in their own browser and paste back what they see, or flip a site-specific blocker setting).

Protocol:
1. **Detect the block.** Signs: empty snapshot, text like "Just a moment…" / "Verify you are human" / "Checking your browser…" / "Access Denied", a captcha image, HTTP 403 or 429, or content that is clearly the block landing rather than the requested page.
2. **Surface immediately** via AskUserQuestion (with spacer):
   - question: `"Hit a bot-block on <URL>. Want to help me get past it?"`
   - options:
     - `"I'll open it in my browser and paste back what I see"` — user reads + summarizes
     - `"I'll turn off the blocker and you retry"` — user flips a setting; you retry once
     - `"Skip this URL — note it as blocked"` — move on, flag in the sources-consulted list
3. **Apply the choice.** If the user provides notes, fold them in. If they retry, retry once. If they skip, log `[BLOCKED — skipped]` next to that URL in the sources-consulted appendix so the deliverable is honest about coverage gaps.
4. **Never pretend** the research is complete when blocked URLs were silently dropped. The deliverable's confidence is lower if community sources weren't read — the user needs to know what's covered and what isn't.

**Important:** AI research alone is not enough. Always encourage the user to click through competitor sites and apps themselves, write down impressions, and share those notes. The combination of AI research and manual review produces the most reliable results.

---

## Step 5: Draft the Competitive Analysis

Based on all gathered information, draft the analysis document following the structure in [competitor-analysis-framework.md](./references/competitor-analysis-framework.md).

### Required sections in the draft

1. The standard analysis sections per the framework (positioning, per-competitor breakdown, gaps, recommended differentiation).
2. **A "Sources consulted" appendix at the end of the deliverable.** A flat bulleted list of every URL the model visited, grouped by phase: Community threads (Phase 4a), Marketing pages (Phase 4b.1), App store / review pages (Phase 4b.3), Other. One URL per line, with a 5–10 word note describing what was extracted from it. The user will use this to re-verify findings or do their own deeper review on the threads they care about.

### Presenting the draft to the user

Present the draft IN CHAT — render the headlines, key bullets, and the sources-consulted list inline so the user can read it without opening the file. Do NOT save the file yet at this step. Saving comes in Step 7.

**Highlights wording rule**: when summarizing findings as bullets, every bullet must be **a complete claim with the supporting evidence**, not a label. Wrong: `"GIA certification is the trust currency of the industry — added as A15"`. Right: `"GIA certification is the trust currency of the high-end jewelry industry — every jeweler-facing competitor surfaces it prominently on product pages and in seller bios; jewelers in r/jewelers tie 'GIA-certified' directly to perceived legitimacy. Surfacing GIA status on share pages would close the trust gap competitors monetize. Captured as new assumption A15 in assumptions.md."` Each bullet has: the claim, the evidence (with source citation if external), the implication for THIS product, and any artifact ID it became.

Ensure the draft itself satisfies:
- Both direct and indirect competitors are covered
- Comparison is based on observable facts, not assumptions (and assumptions are flagged as such)
- Gaps and opportunities are specific and actionable (a paragraph each, not a one-line label)
- The user's differentiation strategy is clearly articulated
- The Sources-consulted appendix is complete (every URL the model visited)

Then `AskUserQuestion` for next-step approval (Step 6 — Iterate, OR proceed to save).

---

## Step 6: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and new information
2. Flag any claims that need verification
3. Update the comparison matrix
4. Refine the positioning strategy based on feedback

Repeat until the user explicitly approves the analysis.

---

## Step 7: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/research` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final competitive analysis to `.design-engineer-plugin/design/research/competitor-analysis.md`. Competitor analysis is research (gathering external evidence about adjacent products) — that's why it lives in `research/`, not `foundation/`. The dependency graph at `skills/meta-setup/assets/dependencies-default.yaml` is the source of truth for canonical paths.

The document MUST follow the complete structure from [competitor-analysis-framework.md](./references/competitor-analysis-framework.md) AND end with a "Sources consulted" appendix containing every URL the model visited during Phase 4 (community threads, marketing pages, app store / review pages, anything else). Format: flat bulleted list grouped by phase, one URL per line, with a 5–10 word note on what was extracted from it. The user uses this to re-verify findings, do their own deeper review on threads they care about, and contribute their own observations on top of the model's analysis.

### Required post-save chat output

After saving, the chat message MUST include:

1. **A descriptive recap, not labels**. Each highlight is a complete claim + evidence + implication for THIS product, NOT a one-line label that needs the file open to be understood. Wrong: `"GIA certification is the trust currency of the industry — added as A15"`. Right: a 2–3 sentence paragraph that states the claim, names the evidence, says why it matters for this product, and references the artifact ID. Pretend the user will not open the file — every important takeaway must be readable in chat.
2. **The full sources-consulted list**, inline in chat (not just in the file). Same flat-bullet format, with notes per URL. The user wants to be able to scan the list and pick threads to read themselves.
3. **An explicit invitation to add their own observations**, e.g.: "Want to do your own pass on any of these threads? Most users have stronger pattern-matching than the model on community discussions. Drop your notes back here and I'll fold them in." The model treats the analysis as a draft until the user has had a chance to add their own observations on top.
4. **AskUserQuestion** for next step (continue to next skill, refine specific competitors, fold in user's own findings, etc.). Never declare "done" with a fait accompli message — always end a turn with a question.

After completing the competitor analysis, check if any new assumptions surfaced during the research. If so, Read `.design-engineer-plugin/design/foundation/assumptions.md` and append the new assumptions with a note: 'Added from competitor analysis on [date].' The assumptions document is a living deliverable that accumulates insights across the pipeline.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing competitor, an unverified claim, a market segment nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No solutions in discovery**: During this activity, do not introduce specific product features or solutions. Stay focused on understanding the competitive landscape – what exists, what gaps remain, how competitors position themselves. Product decisions belong in later pipeline phases.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (survey results where users mentioned tools, prior research) informs analysis
3. **AI suggestions** and web research fill gaps – but always verify claims with the user

---

## What Comes Next

After competitive analysis is finalized, suggest:

1. `ux-business-plan` – Define the business model informed by competitive pricing insights
2. `ux-storybrand` – Craft messaging that differentiates from competitors

---

## Resource Files

- [competitor-analysis-framework.md](./references/competitor-analysis-framework.md) – Analysis structure with comparison matrices and research prompt template


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
