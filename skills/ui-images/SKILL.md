---
name: ui-images
description: "Decides per-image whether to generate (hero, marketing, brand-specific) or stock-fetch (avatars, list rows, decorative many-of-a-kind), produces strong search queries or detailed AI-generation prompts, and lays out destination folders. Use when working with images, photos, illustrations, hero shots, avatars, or any visual asset in a prototype, landing page, or generated HTML – before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
compatibility:
  optional:
    - playwright-cli  # used to visually rank stock candidates; skill falls back to URL list if absent
---

# UI Images

Plan, brief, and source images for prototypes and landing pages without slop. Decides per image whether to use stock or AI generation, produces the right artefact (search query or detailed prompt), and organises outputs into the project's deliverables folder.

> **Scope guard**: this skill produces images for the **project's own UI** — the hero shot on a landing page, avatars in a user list, a decorative background photo. It is NOT for generating "approximations" of design references gathered by `ui-references-moodboard`. References are real screenshots of real apps; that's the entire point of references. If you arrived here while running the moodboard skill thinking you should produce image prompts for the references, stop — that's a known autopilot conflation. The moodboard skill captures real UIs via Playwright; it does not generate AI images of them.

## Why This Matters

When a prototype or landing page needs images, AI defaults are slop:

- Gray gradient boxes with emoji "icons" pretending to be illustrations
- SVG circles and rectangles arranged into approximations of objects
- The first low-quality result from a Pexels search, grabbed without looking at it
- "Hero image: [placeholder]" left as plain text

Each of these screams "AI built this and didn't think about images." Real product work decides per image: is this slot worth a unique generation (hero, brand placeholder, marketing visual)? Or is it a slot where stock photography is genuinely the right answer (50 user avatars on a list, a decorative background, a generic photo of a coffee cup)?

This skill makes that decision deliberately and produces the right artefact for each path.

## When to Use

Invoke this skill when:

- A prototype or landing page brief lists image needs (`dev-prototyping` Step 5 and `ui-landing-page` Step 4 invoke this skill explicitly when their flow encounters image slots).
- The user mentions images, photos, illustrations, hero shots, avatars, or asks how to handle visual assets in a prototype/landing page.
- The model is about to write `<img src="...">` in generated HTML and has no clear plan for what that source will be.
- The model is tempted to use a gradient placeholder, emoji as illustration, or generic SVG – STOP and run this skill instead.

## Step 1: Build the image manifest

List every image the current artefact needs. Read upstream design context first:

- `.design-engineer-plugin/design/exploration/references/references.md` (if exists) – visual style direction
- `.design-engineer-plugin/design/foundation/` – brand voice, target audience
- `.design-engineer-plugin/design/exploration/story-panels/` (if exists) – character/scene references
- The current artefact (prototype HTML, landing page sections, IA doc) – every screen/section that has an image slot

Produce a table:

| ID | Slot / role | Aspect ratio | Approx dimensions | Notes |
|----|-------------|--------------|-------------------|-------|
| 1 | Hero illustration (homepage) | 16:9 | 1600×900 | Brand-specific, must match references.md palette |
| 2 | User avatar (list row) | 1:1 | 80×80 | 50 instances, generic but high-quality |
| 3 | Feature card icon | 1:1 | 200×200 | 3 instances, custom illustration style |
| ... | ... | ... | ... | ... |

Save initial draft to `.design-engineer-plugin/design/exploration/images/manifest.md`. Create the folder if it doesn't exist.

## Step 2: Decide per image – generate or stock

For each row, decide:

**Generate** when:
- The image is brand-specific (hero, marketing, key feature illustration)
- One-off and high-visibility (above the fold, in the hero section)
- Stock libraries don't have what the design intent requires (e.g., "warm scrub-teal kitchen" – too specific)
- Style is non-photographic (illustration, abstract, custom)

**Stock** when:
- Many instances of the same kind (avatars, list rows, gallery thumbnails – 50× generations is expensive overkill)
- Decorative or background (the user won't pause on it)
- Generic photographic content (laptop on desk, coffee cup, cityscape) where Unsplash/Pexels has thousands of high-quality options
- Quick prototype iteration – generation has a turnaround cost

Walk the user through the manifest one image at a time. For each, propose generate vs stock with one-sentence reasoning. User can override.

Use `AskUserQuestion` (multiSelect: true if presenting many images at once, multiSelect: false for per-image confirmation). Always include the spacer block (CLAUDE.md rule 6) before the AskUserQuestion call.

Mark each row in the manifest with `Decision: generate` or `Decision: stock`.

## Step 3: Stock branch

For each row marked `stock`:

1. **Write a strong search query** that captures: subject, mood, composition, color hint. Avoid one-word queries; "professional woman laptop coffee shop morning warm" beats "woman".

2. **If Playwright CLI is available** (`compatibility: playwright-cli` was met):
   - Open Unsplash search URL: `https://unsplash.com/s/photos/[query]`
   - Take a screenshot of the search results page (top 5–10 results)
   - Visually rank the results: which ones match the design intent best? Score each on (a) subject relevance, (b) composition, (c) lighting/quality, (d) match with references.md palette.
   - Present the top 3 to the user via AskUserQuestion (with image option labels).
   - Save the chosen image URL or download to `.design-engineer-plugin/design/exploration/images/stock/[image-id]-[short-desc].jpg`.

3. **If Playwright is NOT available**: list the search query and 3–5 candidate URLs from a manual visit; ask the user to pick. Save URL to manifest.

4. **License check**: Unsplash and Pexels are free for commercial use. Note license + photographer in manifest. Do not use sources without clear free-commercial licensing.

## Step 4: Generation branch

For each row marked `generate`:

1. **Ask which generator the user wants to use** (only on the first generation row of the session; remember the answer for the rest):

   ```
   question: "Which image generator are you going to run these prompts in?"
   header: "Generator"
   options:
     - label: "Gemini Nanobanana"
       description: "Google's image model. Good for fast iteration, conversational refinement."
     - label: "ChatGPT image (DALL·E 3)"
       description: "OpenAI's image model. Good for following detailed prompts."
     - label: "Midjourney"
       description: "Best aesthetic quality, parameter-heavy syntax."
     - label: "Other (Flux, Stable Diffusion, Ideogram, etc.)"
       description: "I'll write the prompt platform-agnostic and you adapt."
   ```

   Always include the spacer block before the AskUserQuestion call.

2. **Read the matching template** from [prompt-templates.md](./references/prompt-templates.md). Each template covers the syntax cues that generator wants (aspect ratio params, style modifiers, negative prompts).

3. **Write a detailed prompt per image**. The prompt structure (adapted per generator):
   - **Subject**: what the image shows (concrete, not abstract)
   - **Composition**: framing, focal point, where empty space sits
   - **Style**: photography / illustration / 3D / painted; specific aesthetic references from the design intent
   - **Lighting & mood**: warm/cold, soft/harsh, time of day
   - **Color world**: the palette from `references.md` (e.g., "scrub-teal, warming-lamp amber, parchment cream")
   - **Aspect ratio / dimensions**: per the manifest
   - **Negative prompt** (if generator supports): what to avoid (e.g., "no emoji, no flag avatars, no glassmorphism")

4. **Save each prompt** to `.design-engineer-plugin/design/exploration/images/prompts/[image-id]-[short-desc].md`. One file per image. The user can copy-paste the file content into their generator.

5. **Tell the user where to put the generated output**: `.design-engineer-plugin/design/exploration/images/generated/[image-id]-[short-desc].png` (or .webp/.jpg). Naming convention matches the prompt file.

## Step 5: Save manifest, lay out folders

Final state of `.design-engineer-plugin/design/exploration/images/`:

```
.design-engineer-plugin/design/exploration/images/
├── manifest.md          # Table from Step 1, updated with decisions and final filenames
├── prompts/             # One .md per generated image, ready to paste into generator
├── generated/           # User drops AI-generated outputs here
└── stock/               # Stock images (downloaded or URL list)
```

Update `manifest.md` with:
- Final decision per row
- Filename / URL per row
- License + attribution for stock
- Generator + prompt file path for generated

## Success Criteria

- Every image slot in the prototype/landing page has a manifest entry – no orphan `<img src="placeholder">` tags.
- Decision per image is intentional: generate-vs-stock matches the role (hero ≠ avatar list).
- Stock candidates were visually ranked, not first-result-grabbed.
- Generation prompts are detailed enough to produce on-brand output (subject, composition, style, lighting, palette, dimensions, negatives).
- Manifest tracks license/attribution for stock and generator/prompt path for generated.
- Folders are laid out so the user can drop generated images into `generated/` and they slot into the prototype/landing page automatically by filename.

## Anti-patterns (do not do)

- `<img src="https://via.placeholder.com/...">` in any deliverable
- Gradient div with emoji `🏄` or similar acting as an illustration
- One-word stock search query without ranking ("woman", "office")
- Same generation prompt repeated 50× to fill an avatar list (stock instead)
- Skipping the manifest because "this is just a quick prototype" (the slop habit)
- Using Pexels/Unsplash without recording license + photographer in manifest

## Notes

- **If your generator isn't listed**: write the prompt using the generator-agnostic core (subject + composition + style + lighting + palette + aspect + negatives) and adapt syntax for your tool's parameter format.
- **Iteration**: real product work re-generates images several times. Manifest is the source of truth – update it each iteration with the chosen variant.
- **Cost awareness**: the decision tree in Step 2 exists because generation is slower and (often) costlier than stock. For a list of 50 user avatars, stock wins on cost and consistency.
