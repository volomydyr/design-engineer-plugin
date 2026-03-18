# Frontend Design Anti-Patterns

Every pattern listed here is the fingerprint of AI-generated work from 2024–2025. These are not opinions—they are the specific tells that make an interface look like it was produced by a system running defaults rather than a person making decisions.

## Typography Anti-Patterns

**Overused fonts** — Inter, Roboto, Arial, Open Sans, Lato, Montserrat. These are generic defaults, not design decisions. When every product looks the same, none of them have presence.

**Monospace-as-shorthand** — Reaching for a monospace font to signal "technical" or "developer." It is lazy. The same way stock photography signals "we couldn't think of anything." Choose a typeface because it fits the product, not because it fits a category.

**Rounded-icon-above-heading** — Large icons with rounded corners floating above every section heading. They appear on every marketing page, every landing page, every AI-generated mockup. They rarely add meaning and always add sameness.

**Hierarchy through size alone** — Only varying font size between levels. Real hierarchy uses size, weight, tracking, and opacity together. If headline and body text differ only in size, the system is incomplete.

## Color Anti-Patterns

**The AI color palette** — Cyan on dark backgrounds. Purple-to-blue gradients. Neon accents. These color combinations now signal "generated" the way stock art signals "cheap." They are the new generic.

**Gradient text** — Applying a gradient to headings or metric numbers for "impact." It is decorative rather than meaningful and reads as a lack of real color decisions.

**Default dark mode** — Reaching for dark mode with glowing accents because it looks sophisticated without requiring real design choices. Dark mode requires completely different decisions about depth, hierarchy, and surface—not just a color inversion.

**Gray text on colored backgrounds** — Gray looks washed out and dead next to color. Use a darker shade of the background hue, or transparency, instead.

**Pure black and pure white** — `#000` and `#fff` don't exist in nature. Real shadows and surfaces always carry a color cast. Even a chroma of 0.005–0.01 in OKLCH makes surfaces feel real rather than printed.

## Layout Anti-Patterns

**Cards nested in cards** — Visual noise with no hierarchy signal. If you need structure within a card, use spacing, typography, and subtle dividers—not another card.

**Identical card grids** — Same-sized cards, same icon + heading + body text pattern, repeated down the page. The grid says "I didn't decide anything about what matters more."

**Hero metric layout** — Big number, small label, supporting stats, gradient accent. It appears on every dashboard, every SaaS landing page, every product demo. It signals template, not product.

**Centering everything** — Center-aligned text beyond headlines reads as indecision. Left-aligned text with asymmetric layouts feels designed. Center alignment is the layout equivalent of putting everything in a card.

**Same spacing everywhere** — No rhythm. Same gap between every element. Rhythm requires variety: tight groupings and generous separations, dense sections opening into space. Monotone spacing reads as no one was at the controls.

## Visual Anti-Patterns

**Glassmorphism** — Blur effects, frosted-glass cards, glow borders used as decoration. It was a trend. It is now a tell. Use it only when it serves a specific purpose.

**Single colored border on one side** — Thick colored border on the left or bottom of a card or element. It appeared everywhere as an accent technique. Now it reads as a template.

**Decorative sparklines** — Tiny charts embedded in metrics or cards that look sophisticated but convey no actual information. Data visualization should communicate something, not signal "this is a data product."

**Generic drop shadows** — Rounded rectangles with soft gray drop shadows. Safe, forgettable, interchangeable. The default output when nothing was decided.

## Motion Anti-Patterns

**Bounce and elastic easing** — Real objects decelerate smoothly. They do not bounce at rest. Bounce and elastic easing were trendy in 2015; now they signal "I used the default." Use ease-out-quart, ease-out-quint, or ease-out-expo.

**Animating layout properties** — Animating `width`, `height`, `padding`, or `margin` causes layout recalculation and jank. Animate `transform` and `opacity` only. For height transitions, use `grid-template-rows: 0fr → 1fr`.

**Animating everything** — Motion fatigue is real. Subtle, purposeful motion—one well-orchestrated page load—creates more delight than constant micro-interactions. Animation should earn its presence.

## Interaction Anti-Patterns

**Every button is primary** — When everything competes, nothing wins. Primary buttons mark the single most important action. Use ghost buttons, text links, and secondary styles for everything else.

**Redundant headers** — A page title that says exactly what the heading says. A card that restates the section heading. Redundancy reads as padding, not content.

**Modals for everything** — Modals interrupt flow and are cognitively expensive. Most things that use a modal could use a drawer, an inline expansion, or a new page. Use modals only when the task genuinely requires isolation.

---

## The AI Slop Test

Show this interface to a stranger and say "AI made this."

If they believe you immediately—that is the problem.

A distinctive interface makes someone ask "how was this made?" not "which AI made this?"

Run through the anti-patterns above. Each one you find is a place where the model ran a default instead of making a decision. The goal is not to hide AI assistance—it is to make decisions that no default would produce.

**Pass**: The interface has a point of view. You can point to specific choices—a typeface, a layout, a color palette—that belong to this product and no other.

**Fail**: Swapping any design element for the most common alternative would go unnoticed. That is what a default looks like.
