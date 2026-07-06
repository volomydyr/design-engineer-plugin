# Motion – per-component timing and context

_Sibling motion files: motion-decisions.md, motion-emotion.md, motion-components.md, motion-advanced.md_

## 3. How should this specific component animate?

Each UI component has its own timing personality. A button press needs to feel instant. A modal entrance needs to feel deliberate. Using the same duration for both makes one feel sluggish and the other feel rushed.

Exact timing for 10 component types follows. For general principles (easing selection, performance, springs), see section 1.

### Buttons

Buttons are the most-interacted element. Animation must be instant and tactile – anything over 200ms feels broken.

| State | Duration | Property | Value |
|-------|----------|----------|-------|
| Hover in | 150–200ms | background-color, box-shadow | Darken 8–12%, add 4px shadow |
| Hover out | 200–250ms | background-color, box-shadow | Slightly slower return feels polished |
| Active/press | 50–100ms | scale | 0.95 – tactile compression |
| Release | 150ms | scale | Back to 1.0, ease-out |
| Loading | 200–300ms | width, opacity | Collapse label, show spinner |

```css
.button {
  transition: background-color 150ms ease, box-shadow 150ms ease, scale 100ms ease-out;
}
.button:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
}
.button:active {
  scale: 0.95;
  transition-duration: 50ms;
}
```

**Common mistake**: Animating `transform: scale()` on hover instead of active. Hover lift should use shadow or translateY, not scale. Scale is for press feedback only.

### Modals & dialogs

Modals are multi-step choreography: backdrop, container, then content. Each layer has its own timing.

| Layer | Duration | Easing | Details |
|-------|----------|--------|---------|
| Backdrop fade | 200–250ms | ease-out | Opacity 0 → 0.5–0.7 |
| Modal entrance | 250–350ms | cubic-bezier(0.16, 1, 0.3, 1) | Scale 0.95 → 1 + opacity |
| Content stagger | 30–50ms per item | ease-out | Headers, body, actions in sequence |
| Modal exit | 200ms | ease-in | Faster than entrance |
| Backdrop exit | 150ms | ease-in | Fades after modal disappears |

```css
.backdrop {
  opacity: 0;
  transition: opacity 200ms ease-out;
}
.backdrop.visible { opacity: 0.6; }

.modal {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 300ms ease-out, transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.modal.visible {
  opacity: 1;
  transform: scale(1);
}
```

**Common mistake**: Using `transform-origin: center` for all modals. If the modal was triggered by a button, set `transform-origin` to the button's position so the modal appears to grow from its trigger. Exception: centered confirmation dialogs.

### Cards

Cards serve dual purposes – passive display and interactive selection. Hover animation should be subtle enough for frequent scanning.

| State | Duration | Property | Value |
|-------|----------|----------|-------|
| Hover lift | 200–250ms | box-shadow, translateY | Shadow 8–12px, lift -2px |
| Selection | 150ms | border-color, scale | Outline highlight, scale 1.02 |
| Expansion | 300–400ms | height, opacity | Reveal additional content |
| Anticipation | 50ms | scale | 0.98 before expanding |

```css
.card {
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
}
.card:hover {
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
  transform: translateY(-2px);
}
```

**Common mistake**: Scaling cards on hover. Scale changes the card's footprint and shifts surrounding layout. Use shadow + translateY instead – it creates the same "lift" illusion without affecting neighbors.

### Forms & inputs

Form animations are primarily about feedback – telling users what happened and what to do next.

| State | Duration | Property | Details |
|-------|----------|----------|---------|
| Focus ring | 100–150ms | outline, box-shadow | 2–3px ring, appears instantly |
| Floating label | 200ms | transform, font-size | Translate up + shrink on focus |
| Error shake | 300ms | transform | translateX ±4px, 3 cycles |
| Success check | 250ms | opacity, scale | Fade in + scale from 0.8 |
| Validation | Within 100ms | border-color | Color shift on valid/invalid |

```css
.input {
  transition: border-color 100ms ease, box-shadow 100ms ease;
}
.input:focus {
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.3);
}

/* Floating label */
.label {
  transition: transform 200ms ease-out, font-size 200ms ease-out;
}
.input:focus + .label,
.input:not(:placeholder-shown) + .label {
  transform: translateY(-24px);
  font-size: 0.75rem;
}

/* Error shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.input.error { animation: shake 300ms ease-out; }
```

**Common mistake**: Shaking the input AND turning it red AND showing an error message all at the same time with different durations. Coordinate: shake first (300ms), then show the error message with a fade (200ms) so changes feel sequential, not chaotic.

### Navigation & menus

Navigation animation helps users understand spatial relationships – where they came from and where they're going.

| Element | Duration | Easing | Details |
|---------|----------|--------|---------|
| Dropdown open | 200–250ms | ease-out | Scale from 0.95 + opacity, from trigger |
| Dropdown close | 150ms | ease-in | Faster exit |
| Hover highlight | 100–150ms | ease | Background color shift |
| Per-item stagger | 20–40ms | ease-out | Subtle, not dramatic |
| Active indicator | 200ms | ease-out | Underline or pill slides to active item |
| Chevron rotation | 200ms | ease-out | 180° for open/close |

```css
.dropdown {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
  transform-origin: top;
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
.dropdown.open {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Sliding active indicator */
.nav-indicator {
  transition: transform 200ms ease-out, width 200ms ease-out;
}
```

**Common mistake**: Staggering every menu item on every open. Stagger is for first appearances. On subsequent opens (user is navigating), show all items simultaneously – the stagger becomes annoying by the third click.

### Toasts & notifications

Toasts enter, deliver a message, and leave. The choreography: slide in → display → auto-dismiss.

| Phase | Duration | Easing | Details |
|-------|----------|--------|---------|
| Entrance | 200–300ms | ease-out | translateY from bottom or translateX from right |
| Display | 3000–5000ms | – | Depends on message length |
| Exit | 150–250ms | ease-in | Same direction as entrance |
| Stagger (multiple) | 100ms | ease-out | Stack upward, push existing toasts |

```css
.toast {
  transform: translateY(100%);
  opacity: 0;
  transition: transform 250ms ease-out, opacity 250ms ease-out;
}
.toast.visible {
  transform: translateY(0);
  opacity: 1;
}
.toast.exiting {
  transform: translateY(100%);
  opacity: 0;
  transition-duration: 150ms;
  transition-timing-function: ease-in;
}
```

**Common mistake**: Auto-dismissing error toasts. Only success and info toasts should auto-dismiss. Errors require acknowledgment – the user might not have finished reading.

### Accordions

Accordions reveal and hide content. The challenge: animating height without `height: auto`.

| Phase | Duration | Easing | Details |
|-------|----------|--------|---------|
| Expand | 250–350ms | ease-out | Content reveals downward |
| Collapse | 200–250ms | ease-in | Slightly faster close |
| Chevron rotation | 200ms | ease-out | 180° rotation |
| Content fade | 150–200ms | ease | Opacity in after height settles |
| Internal stagger | 30–50ms | ease-out | If accordion contains a list |

```css
/* Grid approach – preferred over max-height hack */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-out;
}
.accordion.open .accordion-content {
  grid-template-rows: 1fr;
}
.accordion-content > div {
  overflow: hidden;
}

/* Chevron */
.chevron {
  transition: rotate 200ms ease-out;
}
.accordion.open .chevron {
  rotate: 180deg;
}
```

**Common mistake**: Using `max-height: 999px` for accordion animation. It makes the easing wrong (the visible animation is only a fraction of the total transition time). Use `grid-template-rows: 0fr → 1fr` instead.

### Lists & grids

Lists change frequently – items enter, exit, reorder. Each action has different timing.

| Action | Duration | Stagger | Details |
|--------|----------|---------|---------|
| Initial load | 200–300ms | 30–50ms per item | Cap stagger at 500ms total |
| New item enter | 200–250ms | – | Scale 0.95 + opacity from insertion point |
| Item exit | 150–200ms | – | Faster than enter, opacity + scale |
| Reorder | 250–350ms | – | translateY to new position |
| Filter/sort | 200–300ms | 20–30ms | Items crossfade to new positions |

```css
.list-item {
  animation: item-enter 250ms ease-out both;
  animation-delay: calc(var(--i, 0) * 40ms);
}
@keyframes item-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

/* Cap stagger – items beyond index 12 appear simultaneously */
.list-item:nth-child(n+13) {
  animation-delay: 480ms; /* 12 × 40ms */
}
```

**Common mistake**: Staggering all items in a long list. After ~500ms total stagger time, it feels like the interface is struggling, not choreographed. Cap the stagger and let remaining items appear together.

### Loaders & spinners

Loading animation manages perception of waiting time. The key rule: never show a spinner for something that might load instantly.

| Pattern | Duration | Details |
|---------|----------|---------|
| Spinner delay | 200ms | Don't show spinner until 200ms have passed |
| Spinner minimum | 500ms | Once shown, keep for at least 500ms to avoid flash |
| Skeleton shimmer | 1500ms per cycle | Gradient sweep, infinite, subtle |
| Progress bar | Real-time | Map to actual progress, never fake it |

```css
/* Skeleton shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-2) 0%,
    var(--surface-3) 50%,
    var(--surface-2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1500ms ease-in-out infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    opacity: 0.7; /* Static placeholder instead of shimmer */
  }
}
```

**Common mistake**: Showing a spinner for 50ms and then immediately replacing it with content. This creates a visual flash that's worse than no loader at all. Always either delay the spinner or enforce a minimum display time.

### Carousels & sliders

Carousels combine user-driven interaction with optional auto-play. Momentum and settling behavior matter.

| Action | Duration | Easing | Details |
|--------|----------|--------|---------|
| Swipe transition | 300–600ms | ease-out | Duration scales with swipe velocity |
| Snap to position | 200–300ms | ease-out | After momentum settles |
| Auto-play advance | 300–400ms | ease-in-out | Smooth, not snappy |
| Auto-play interval | 4000–6000ms | – | Pause on hover/focus |
| Pagination dot | 150ms | ease | Scale or color change |

```css
.carousel-track {
  transition: transform 400ms cubic-bezier(0.25, 1, 0.5, 1);
}

/* Pause auto-play on interaction */
.carousel:hover .carousel-track,
.carousel:focus-within .carousel-track {
  animation-play-state: paused;
}
```

**Common mistake**: Using the same transition duration regardless of swipe velocity. A fast flick should resolve faster (200ms) than a slow drag release (500ms). Scale duration inversely with swipe speed.

---

## 4. What does this product context demand?

The same button animation that feels perfect in a gaming app feels childish in a banking app. Product context shapes every animation decision – timing, easing, amplitude, and how often animation appears at all.

Six product contexts follow.

### E-commerce & retail

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

### Fintech & banking

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

### Healthcare & wellness

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

### Education & learning

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

### SaaS & productivity

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

### Media & publishing

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

### Choosing the right context

If your product spans multiple contexts (a healthcare SaaS, an e-commerce education platform), default to the more conservative context for shared UI and reserve the other context's animation style for domain-specific moments.

Example: A healthcare SaaS uses healthcare timing (calm, 300–600ms) for patient-facing screens and SaaS timing (efficient, 150–250ms) for admin/back-office screens.

---

