# Animation Troubleshooting

When animation feels wrong but you can't articulate why, start here. Each section is a symptom, followed by a diagnosis checklist and fixes.

---

## "Feels robotic"

The animation technically works but feels lifeless, mechanical, like a PowerPoint slide transition.

**Diagnosis**:
- [ ] Using `linear` easing anywhere in UI (linear = no physics = robot)
- [ ] Every element has the same duration
- [ ] No anticipation – elements start moving at full speed
- [ ] No follow-through – elements stop abruptly at their destination
- [ ] All transitions are symmetrical (same speed in and out)

**Fixes**:
- Replace all `linear` with `ease-out` for entrances, `ease-in` for exits
- Vary timing: primary action at 200ms, secondary elements at 250–300ms
- Add 10–20ms of subtle anticipation (translateY 2px in opposite direction before the move)
- Let elements settle – a tiny overshoot (1–2%) on scale or position makes motion feel alive
- Make exits 20–30% faster than entrances

```css
/* Before – robotic */
.panel { transition: transform 300ms linear; }

/* After – alive */
.panel {
  transition: transform 250ms cubic-bezier(0.25, 1, 0.5, 1);
}
```

---

## "Feels sluggish"

The interface works but everything feels slow, heavy, like wading through molasses.

**Diagnosis**:
- [ ] Durations over 300ms for interactive elements
- [ ] Using `ease-in-out` where `ease-out` would work
- [ ] Exit animations as long as entrance animations
- [ ] Using `transition: all` (animates properties you don't intend to)
- [ ] Stagger delay too long (items appearing one by one slowly)

**Fixes**:
- Reduce all interactive durations by 30%
- Switch from `ease-in-out` to `ease-out` for anything entering the screen
- Make exits 75% of entrance duration
- Replace `transition: all` with specific properties
- Cap total stagger time at 500ms regardless of item count

```css
/* Before – sluggish */
.dropdown {
  transition: all 400ms ease-in-out;
}

/* After – snappy */
.dropdown {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
```

---

## "Causes motion sickness"

Users report discomfort, dizziness, or nausea. This is a serious accessibility issue affecting ~35% of adults over 40.

**Diagnosis**:
- [ ] Large-scale movement (elements crossing >50% of viewport)
- [ ] Parallax scrolling effects
- [ ] Zoom transitions (scale changes larger than 20%)
- [ ] Rapid direction changes (elements bouncing or ping-ponging)
- [ ] Continuous background animation
- [ ] No `prefers-reduced-motion` support

**Fixes**:
- Audit every animation with `prefers-reduced-motion: reduce`
- Replace spatial motion with opacity crossfades for reduced-motion users
- Limit scale changes to 5–10% for standard motion
- Remove parallax entirely or gate it behind motion preference
- No autoplay on any animation that involves spatial movement
- Add `pause` controls to any continuous animation

```css
@media (prefers-reduced-motion: reduce) {
  .hero-parallax { transform: none !important; }
  .page-transition {
    animation: none;
    opacity: 1; /* Instant state change */
  }
}
```

---

## "Emotionally wrong"

The animation technically works but creates the wrong feeling – a banking app that feels playful, a game that feels corporate, a wellness app that feels urgent.

**Diagnosis**:
- [ ] Easing doesn't match the product's emotional register
- [ ] Timing is too fast for calm products or too slow for energetic ones
- [ ] Bounce/overshoot in a context that demands restraint
- [ ] Inconsistent emotional tone across the product

**Fixes**:
- Name the target emotion before choosing parameters (see [animation-by-emotion.md](./animation-by-emotion.md))
- Match easing to emotion: trust → symmetrical, urgency → fast ease-out, delight → overshoot
- Match timing to context (see [animation-by-context.md](./animation-by-context.md))
- Audit the product for emotional consistency – does every screen feel like the same product?

---

## "Performance drops"

Animations stutter, drop frames, or cause visible jank. Especially common on mid-range devices.

**Diagnosis**:
- [ ] Animating properties other than `transform` and `opacity`
- [ ] More than 3–4 elements animating simultaneously
- [ ] Using JavaScript animation when CSS would work
- [ ] `will-change: all` instead of specific properties
- [ ] Animating `box-shadow` directly (expensive)
- [ ] Large `filter: blur()` values (>10px)
- [ ] `transition: all` forcing browser to watch every property

**Fixes**:
- Only animate `transform` and `opacity` – everything else triggers layout recalculation
- Stagger animations by 50ms so fewer elements animate at once
- Use CSS transitions for predetermined animations, JS only for dynamic values
- Replace `box-shadow` animation with `::after` pseudo-element at target shadow + opacity transition
- Reduce blur to under 10px, especially for Safari
- Use `will-change: transform` only when you notice first-frame stutter, not preemptively

```css
/* Before – janky shadow animation */
.card:hover {
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
  transition: box-shadow 200ms ease;
}

/* After – smooth pseudo-element approach */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
  opacity: 0;
  transition: opacity 200ms ease;
}
.card:hover::after { opacity: 1; }
```

---

## "Inconsistent across product"

Some screens feel polished, others feel like a different product. Animation quality varies wildly.

**Diagnosis**:
- [ ] No shared motion tokens (CSS custom properties)
- [ ] Different developers used different timing values
- [ ] Same interaction type (e.g., dropdown) animates differently across pages
- [ ] Mix of animation libraries with different default easings
- [ ] No motion style guide

**Fixes**:
- Define motion tokens and use them everywhere:

```css
:root {
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 400ms;
  --ease-out: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
}
```

- Document which token applies to which interaction type
- Same action must always use the same animation – a dropdown in the nav should feel identical to a dropdown in a form
- Consolidate to one animation approach (CSS transitions for interactive, keyframes for one-shot)

---

## "Distracting or overdone"

Users notice the animation instead of the content. The interface feels busy, fidgety, or like it's showing off.

**Diagnosis**:
- [ ] Bounce or elastic easing on interactive elements
- [ ] Scale amplitude over 5% on frequently used elements
- [ ] Multiple elements animating at the same time without stagger
- [ ] Entrance animations on pages the user visits repeatedly
- [ ] Decorative animation with no functional purpose

**Fixes**:
- Apply the frequency test from [motion-design.md](./motion-design.md): how often will the user see this? 100+ times/day = no animation
- Remove all bounce and elastic easing from production UI
- Reduce scale amplitude: hover should be 1.02–1.03, not 1.1
- Skip entrance animations on returning visits (`initial={false}` pattern)
- Ask: "Would this annoy me after 100 uses?" If yes, remove it

---

## "Missing feedback"

The interface feels dead. Clicks produce no response. Users wonder if their action registered.

**Diagnosis**:
- [ ] No hover state on clickable elements
- [ ] No active/press state on buttons
- [ ] Form submission with no visual confirmation
- [ ] Toggle switches that change state without transition
- [ ] Loading actions with no progress indicator

**Fixes**:
- Every interactive element needs at minimum: hover state + active/press state
- Acknowledge user action within 100ms (even if the result takes longer)
- Form submissions: disable button + show spinner + confirm success
- Toggle switches: 200ms transition between states, not instant swap
- Long actions: show a spinner after 200ms, keep it for minimum 500ms

---

## "Accessibility concerns"

Animation works for most users but causes issues for some. This is not an edge case – it affects a significant percentage of users.

**Audit checklist**:
- [ ] `prefers-reduced-motion: reduce` tested for every animation
- [ ] No autoplay animations (or pause controls provided)
- [ ] No flashing or strobing (WCAG 2.3.1)
- [ ] Animated content has ARIA live regions for screen readers
- [ ] Focus indicators are not animated away
- [ ] Loading states have text alternatives ("Loading..." not just spinner)
- [ ] Continuous animations (spinners, breathing effects) are subtle and can be paused
- [ ] No content depends on animation to be understood – motion enhances, never replaces
- [ ] Keyboard navigation does not trigger spatial animations

**Reduced-motion strategy**: Replace spatial movement with opacity crossfades. Keep functional indicators (progress bars, focus rings). Reduce durations to near-instant (50ms) rather than removing entirely – this preserves the state-change signal without the motion.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
