# Image Generation Prompt Templates

Per-generator templates plus a generator-agnostic core. Use the template that matches the generator the user picked in Step 4 of the SKILL.md. If their generator isn't listed, use the agnostic core and adapt syntax.

---

## Generator-agnostic core (use as the spine for any platform)

Every prompt builds these six components in order:

1. **Subject (concrete)** – one specific thing happening, not "a person" but "a barista pouring milk into a cortado".
2. **Composition** – framing (wide / medium / close-up), focal point, empty space placement (for headline/CTA overlay).
3. **Style** – photography / illustration / 3D-render / painted; reference an aesthetic ("editorial fashion photo", "Studio Ghibli watercolor", "Bauhaus poster"). Avoid "modern, clean" – meaningless.
4. **Lighting & mood** – directional (soft window light from left), color temperature (warm 3200K / cool 5600K), time of day, mood word (calm, urgent, intimate, ceremonial).
5. **Color world** – pull from the project's `references.md` palette. Name colors using the project's tokens ("scrub-teal accent, warming-lamp amber, parchment cream") rather than generic ("blue, orange, beige").
6. **Negative / avoid** – what NOT to do. Always exclude AI-slop tells: emoji, flag avatars, neon gradients, gloss/glassmorphism, generic stock-photo people, watermark, text overlay (unless intentional).

---

## Gemini Nanobanana (Google)

Conversational and iterative. Long natural-language prompts work well; the model handles context across messages so refining via "make it warmer" or "swap the kitchen for a balcony" is fluid.

Template:

```
[Subject paragraph: one specific moment, two sentences max.]

Composition: [framing]. Focal point on [what]. Leave [empty-space description, e.g., "the upper third blank for headline overlay"].

Style: [photographic style or illustration aesthetic]. Inspired by [reference 1], [reference 2].

Lighting: [direction], [temperature], [mood word].

Color world: [3-5 named colors from references.md].

Aspect ratio: [WxH or ratio].

Avoid: [negative list].
```

Tips:
- No special parameter syntax. Plain English.
- Iteration: send a follow-up message ("the lighting is too cool – warmer, late afternoon golden hour") rather than rewriting the whole prompt.
- For aspect ratio, state it in the prompt body. Some Nanobanana surfaces also accept a separate ratio control.

---

## ChatGPT image (DALL·E 3 via ChatGPT)

Detailed prompt-following. Responds well to structured prompts; ChatGPT will sometimes auto-revise the prompt — append "use my prompt verbatim, do not add stylistic additions" if it does.

Template:

```
A [aspect ratio, e.g., "16:9 horizontal"] [photo / illustration / 3D render]: [subject paragraph].

Composition: [framing], [focal point], [empty space placement].

Style: [aesthetic + 1-2 named references].

Lighting: [direction], [temperature], [mood].

Color palette: [3-5 named colors].

Avoid: [negative list].

Use the prompt verbatim. Do not add stylistic embellishments.
```

Tips:
- DALL·E 3 in ChatGPT does NOT support `--ar` or `--no` flags. Express aspect ratio and avoidances in plain English.
- If the result drifts from style, prepend "in the style of [specific artist/movement]" rather than vague style words.
- Use the "I want a slight variation of this" follow-up prompt instead of starting over for refinement.

---

## Midjourney (v6+)

Parameter-heavy. Prompts are typically shorter than Nanobanana / ChatGPT and rely on parameter flags.

Template:

```
[Subject (concise, comma-separated)], [composition keywords], [style keyword + reference], [lighting + mood], [palette colors], [aesthetic descriptors] --ar [W:H] --style raw --no [negative comma list]
```

Concrete example:

```
barista pouring milk into ceramic cortado cup, close-up overhead, editorial food photography, soft window light from left morning, scrub-teal apron amber latte parchment counter, warm intimate cafe atmosphere --ar 4:5 --style raw --no emoji watermark glossy
```

Tips:
- `--ar W:H` for aspect ratio. Common: `--ar 16:9` (hero), `--ar 4:5` (vertical card), `--ar 1:1` (square).
- `--style raw` for less Midjourney-default-aesthetic, more direct interpretation.
- `--no [list]` for negatives.
- `--cref [URL]` for character consistency across multiple prompts (use when you need the same person across a story-panels set).
- `--sref [URL]` for style consistency across a set.

---

## Flux / Stable Diffusion (Replicate, ComfyUI, etc.)

Variable depending on UI. Most surfaces accept long prompts and a separate negative-prompt field.

Template (positive prompt):

```
[Subject paragraph], [composition], [style + reference], [lighting + mood], [palette], [quality keywords: highly detailed, sharp focus, professional photography]
```

Template (negative prompt — separate field):

```
emoji, flag, glossy, glassmorphism, neon, watermark, text overlay, low quality, blurry, distorted, generic stock photo
```

Tips:
- Stable Diffusion variants benefit from "quality keywords" appended to the positive prompt – Midjourney/DALL·E typically don't need them.
- For aspect ratio, set in the UI (1024×1024 default for SD; pick 1792×1024 for 16:9 etc.).
- Negative prompt is a SEPARATE field, not inline. Don't put `--no` flags in the positive prompt.

---

## Ideogram

Strong at typography-in-image (book covers, posters). If the image needs legible text rendered as part of the image (signage, headline-as-art), Ideogram is the best fit.

Template:

```
[Subject paragraph]. [Composition]. [Style + reference]. [Lighting + mood]. [Palette]. The text "[exact text]" appears [where] in [font style description].

Avoid: [negative list].
```

Tips:
- Be EXPLICIT about the text content and where it sits. "The word 'Paddle' appears in the lower-left corner in a tall serif font."
- Aspect ratio set in the UI.

---

## Quality keywords to use sparingly (NOT a substitute for real description)

- `highly detailed`, `professional photography`, `editorial quality`, `award-winning`, `8k`

These help marginal cases on Stable Diffusion/Flux. They DO NOT help on DALL·E / Midjourney / Nanobanana, where they can actually push the result toward generic stock-photo aesthetics. Skip them unless the generator's known to need them.

---

## Anti-pattern phrases (NEVER include)

- "Modern and clean" — meaningless, pushes to default flat aesthetic
- "Vibrant colors" — pushes to neon
- "Beautiful" — vague
- "Professional" without qualification — pushes to generic stock
- "Trending on ArtStation" — old SD trope, generic now
- Just an emoji as the prompt
