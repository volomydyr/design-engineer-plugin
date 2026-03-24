# Animation by Context

The same button animation that feels perfect in a gaming app feels childish in a banking app. Product context shapes every animation decision – timing, easing, amplitude, and how often animation appears at all.

This file covers 6 product contexts. For component-specific timing, see [animation-by-component.md](./animation-by-component.md). For emotion-specific guidance, see [animation-by-emotion.md](./animation-by-emotion.md).

---

## E-commerce & retail

**Philosophy**: Animation serves the purchase path. Every transition should move the user closer to checkout, never further away. Cart interactions are the most important animations in the entire product.

**Timing range**: 150–400ms

| Action | Duration | Notes |
|--------|----------|-------|
| Add to cart | 150–200ms | Must feel instant – the most critical interaction |
| Cart count update | 200ms | Scale pulse from 1.0 → 1.2 → 1.0 |
| Quick view open | 250–300ms | Faster than a full modal – users are browsing |
| Product image zoom | 200ms | Direct manipulation feel, follows cursor |
| Checkout steps | 300–400ms | Slightly slower – confidence, not speed |
| Order confirmation | 400–600ms | Celebratory moment, allow it to breathe |

**Emphasize**: Snappy cart interactions, smooth image transitions, confidence in checkout flow. Use delight sparingly – order confirmation is the one place to celebrate.

**Avoid**: Slow product card animations (users scan dozens), entrance stagger on product grids (feels sluggish at scale), anything that adds time between "I want this" and "It's in my cart."

---

## Fintech & banking

**Philosophy**: Every animation should reinforce trust and security. Consistency is paramount – the same action must always produce the same animation. Users managing money need predictability.

**Timing range**: 250–500ms

| Action | Duration | Notes |
|--------|----------|-------|
| Account balance update | 250–300ms | Smooth number transition, no flash |
| Transaction list | 200–250ms | Fade in, minimal stagger |
| Transfer confirmation | 400–500ms | Deliberate – user should feel the weight |
| Security verification | 400–500ms | Slower pace signals "we're checking carefully" |
| Error/decline | 200ms | Fast, clear, no ambiguity |
| Success | 300ms | Restrained – a check mark, not confetti |

**Emphasize**: Symmetrical easing (ease-in-out). Consistent timing across all similar actions. Smooth number transitions for balance changes. Loading states that feel secure, not anxious.

**Avoid**: Bounce, overshoot, playful easing. Any deformation. Celebrations that feel frivolous. Inconsistency – if transfers animate at 400ms, all transfers must animate at 400ms.

---

## Healthcare & wellness

**Philosophy**: Calm, accessible, non-threatening. Many users have anxiety about health information. Animation should soothe, never startle. Reduced motion support is not optional – it's the primary concern.

**Timing range**: 300–600ms

| Action | Duration | Notes |
|--------|----------|-------|
| Screen transitions | 400–500ms | Gentle crossfade, no spatial movement |
| Data display | 300–400ms | Progressive reveal, never all at once |
| Appointment confirmation | 400ms | Calm, reassuring |
| Alert/reminder | 300ms | Firm but not aggressive |
| Progress tracking | 500–600ms | Smooth, encouraging |
| Breathing exercises | 4000–8000ms | Match physiological rhythm |

**Emphasize**: Opacity transitions over spatial movement. Gentle easing. Generous transition time. Accessible alternatives for every animated element. Prefers-reduced-motion must be tested thoroughly.

**Avoid**: Sudden movements, flashing, red-colored animations (anxiety trigger), fast stagger sequences, autoplay, parallax. Any animation that could trigger vestibular discomfort.

---

## Education & learning

**Philosophy**: Animation is a teaching tool. Quick feedback encourages continued effort. Extended celebrations reinforce achievement. Gentle error handling prevents discouragement.

**Timing range**: 150–800ms

| Action | Duration | Notes |
|--------|----------|-------|
| Answer feedback | 150–200ms | Instant – user needs to know immediately |
| Correct answer | 500–800ms | Extended celebration, scale + color |
| Wrong answer | 200ms | Gentle shake (3px), encouraging, not punishing |
| Progress advance | 300–400ms | Bar fill or step completion |
| Lesson transition | 300ms | Clean, maintains focus |
| Achievement unlock | 600–800ms | Special moment – badge + pulse + glow |

**Emphasize**: Reward-driven engagement. Make success feel bigger than failure. Quick feedback loops. Use delight intentionally for milestones (completing a chapter, streak maintenance, level-up).

**Avoid**: Punishing error animations. Slow transitions between questions (kills momentum). Identical celebration for every correct answer (becomes meaningless by the third one). Vary rewards by significance.

---

## SaaS & productivity

**Philosophy**: Get out of the way. Users are here to accomplish tasks, not admire transitions. Animation exists to prevent jarring state changes and provide feedback, nothing more.

**Timing range**: 150–250ms

| Action | Duration | Notes |
|--------|----------|-------|
| Panel open/close | 200ms | Instant feel, minimal motion |
| Tab switch | 150ms | Crossfade, no sliding |
| Dropdown | 150–200ms | Fast, functional |
| Save confirmation | 200ms | Subtle check or flash, then gone |
| Inline edit | 100–150ms | Expand on click, contract on blur |
| Bulk actions | 150ms per item | Fast stagger, cap at 300ms total |

**Emphasize**: Speed. Functional feedback. Keyboard-first interactions (no animation on keyboard nav). Respecting that users perform these actions hundreds of times daily.

**Avoid**: Entrance animations on frequently-viewed screens. Stagger on data tables. Any animation over 300ms. Celebratory animations for routine actions (saving a document is not an achievement).

---

## Media & publishing

**Philosophy**: Content is king. All animation exists to enhance readability and content discovery, never to compete with the content itself.

**Timing range**: 200–400ms

| Action | Duration | Notes |
|--------|----------|-------|
| Article transition | 300ms | Clean crossfade, preserve reading position |
| Image reveal | 250ms | Opacity + subtle scale from 0.98 |
| Infinite scroll load | 200ms | Fade in new items, no stagger |
| Video player controls | 150ms | Show/hide on hover/tap |
| Share action | 200ms | Quick confirmation, then dismiss |
| Reading progress | Real-time | Smooth bar fill, no animation needed |

**Emphasize**: Smooth image loading (avoid layout shift). Clean transitions between articles/pages. Preserving the reader's mental position during navigation. Lazy-loaded content appearing naturally.

**Avoid**: Parallax (distracts from reading). Heavy entrance animations on articles (user came to read, not watch). Autoplay video. Animation on text content (never animate paragraph opacity or position on scroll).

---

## Choosing the right context

If your product spans multiple contexts (a healthcare SaaS, an e-commerce education platform), default to the more conservative context for shared UI and reserve the other context's animation style for domain-specific moments.

Example: A healthcare SaaS uses healthcare timing (calm, 300–600ms) for patient-facing screens and SaaS timing (efficient, 150–250ms) for admin/back-office screens.
