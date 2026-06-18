# Motion

Everything about animation in one place, keyed by the question you're actually asking. Jump to the section that matches your question:

1. [Should this animate at all, and how?](#1-should-this-animate-at-all-and-how) – the decision framework, durations, easing, the two animatable properties
2. [What should it make the user feel?](#2-what-should-it-make-the-user-feel) – emotion-to-animation mapping
3. [How should this specific component animate?](#3-how-should-this-specific-component-animate) – per-component timing for 10 element types
4. [What does this product context demand?](#4-what-does-this-product-context-demand) – industry-specific considerations
5. [How do I build an advanced interaction?](#5-how-do-i-build-an-advanced-interaction) – clip-path, gesture/drag, WAAPI, debugging
6. [It feels wrong – how do I fix it?](#6-it-feels-wrong--how-do-i-fix-it) – symptom-to-fix troubleshooting

---

## 1. Should this animate at all, and how?

### The animation decision framework

Before writing any animation code, answer these in order.

#### Should this animate at all?

How often users will see it determines everything.

| Frequency | Decision |
|-----------|----------|
| 100+ times/day (keyboard shortcuts, command palette) | No animation |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, celebrations) | Can add delight |

**Never animate keyboard-initiated actions.** These fire hundreds of times daily. Animation makes them feel slow and disconnected from user intent. The optimal experience for something used hundreds of times a day is no animation at all.

#### What is the purpose?

Every animation needs a clear "why":

- **Spatial consistency** – toast enters/exits from same direction, making swipe-to-dismiss intuitive
- **State indication** – morphing feedback button shows a state change
- **Preventing jarring changes** – elements disappearing without transition feel broken
- **Feedback** – button scales down on press, confirming the interface heard the user
- **Explanation** – a marketing animation showing how a feature works

If the purpose is "it looks cool" and the user will see it often, don't animate.

#### What easing?

Is the element entering or exiting?
- **Yes** → `ease-out` (starts fast, feels responsive)

Is it moving or morphing on screen?
- **Yes** → `ease-in-out` (natural acceleration/deceleration)

Is it a hover or color change?
- **Yes** → `ease`

Is it constant motion (marquee, progress bar)?
- **Yes** → `linear`

**Never use `ease-in` for UI animations.** It starts slow – the exact moment the user is watching most closely. A dropdown with `ease-in` at 300ms *feels* slower than `ease-out` at the same 300ms.

#### How fast?

UI animations should stay **under 300ms**. A 180ms dropdown feels more responsive than a 400ms one.

| Element | Duration |
|---------|----------|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |

### Duration: the 100/300/500 rule

Timing matters more than easing. These durations feel right for most UI:

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100-150ms** | Instant feedback | Button press, toggle, color change |
| **200-300ms** | State changes | Menu open, tooltip, hover states |
| **300-500ms** | Layout changes | Accordion, modal, drawer |
| **500-800ms** | Entrance animations | Page load, hero reveals |

**Exit animations are faster than entrances** – use ~75% of enter duration.

### Easing: pick the right curve

**Don't use `ease`.** It's a compromise that's rarely optimal. Instead:

| Curve | Use For | CSS |
|-------|---------|-----|
| **ease-out** | Elements entering | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | Elements leaving | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | State toggles (there → back) | `cubic-bezier(0.65, 0, 0.35, 1)` |

**For micro-interactions, use exponential curves** – they feel natural because they mimic real physics (friction, deceleration):

```css
/* Quart out - smooth, refined (recommended default) */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Quint out - slightly more dramatic */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/* Expo out - snappy, confident */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

**Avoid bounce and elastic curves.** They were trendy in 2015 but now feel tacky and amateurish. Real objects don't bounce when they stop – they decelerate smoothly. Overshoot effects draw attention to the animation itself rather than the content.

### Never animate from scale(0)

Nothing in the real world disappears and reappears completely. Elements animating from `scale(0)` look like they appear out of nowhere.

Start from `scale(0.95)` or higher, combined with opacity. Even a barely-visible initial scale makes the entrance feel more natural – like a balloon that has visible shape even when deflated.

```css
/* Bad – appears out of nowhere */
.entering { transform: scale(0); opacity: 0; }

/* Good – has visible shape at start */
.entering { transform: scale(0.95); opacity: 0; }
```

### Popover transform-origin

Popovers should scale in from their trigger, not from center. The default `transform-origin: center` is wrong for almost every popover.

**Exception: modals.** Modals are not anchored to a trigger – they appear centered in the viewport. Keep `transform-origin: center` for modals.

```css
/* Radix UI */
.popover { transform-origin: var(--radix-popover-content-transform-origin); }

/* Base UI */
.popover { transform-origin: var(--transform-origin); }
```

### Blur to mask transitions

When a crossfade between two states feels off despite tuning easing and duration, add subtle `filter: blur(2px)` during the transition.

Without blur, crossfades show two distinct states overlapping – the old state and new state swapping visibly. Blur bridges the gap, tricking the eye into perceiving a single smooth transformation.

```css
.button-content {
  transition: filter 200ms ease, opacity 200ms ease;
}
.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Keep blur under `20px` – heavy blur is expensive, especially in Safari.

### Spring animations

Springs feel more natural than duration-based animations because they simulate real physics. Use springs for:

- Drag interactions with momentum
- Elements that should feel alive (not mechanical)
- Gestures that can be interrupted mid-animation

Springs maintain velocity when interrupted – CSS transitions and keyframes restart from zero.

```js
// Apple's approach (easier to reason about)
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Traditional physics (more control)
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Keep bounce subtle (0.1–0.3). Avoid bounce in most UI contexts – use it for drag-to-dismiss and playful interactions only.

For mouse-tracking effects, use `useSpring` to interpolate value changes rather than updating directly – this adds momentum and prevents the artificial "tied to cursor" feel.

### Asymmetric enter/exit timing

Slow where the user is deciding. Fast where the system is responding.

```css
/* Release: fast */
.overlay { transition: clip-path 200ms ease-out; }

/* Press: slow and deliberate */
.button:active .overlay { transition: clip-path 2s linear; }
```

This pattern applies broadly: a hold-to-delete takes 2s to fill (user controls it), but releases instantly (system responds). Tooltip delays are long (prevents accidents), but subsequent tooltip hovers are instant (system got the message).

### The only two properties you should animate

**transform** and **opacity** only – everything else causes layout recalculation. For height animations (accordions), use `grid-template-rows: 0fr → 1fr` instead of animating `height` directly.

### Interruptible animations

Users change intent mid-interaction. Use **CSS transitions** for interactive state changes – they retarget smoothly mid-animation. Reserve **keyframe animations** for one-shot sequences that run to completion.

| | CSS Transitions | Keyframe Animations |
|--|-----------------|---------------------|
| **Interruptible** | Yes – retargets mid-animation | No – restarts from beginning |
| **Use for** | Hover, toggle, open/close | Enter animations, loading |
| **Duration** | Adapts to remaining distance | Fixed regardless of state |

```css
/* Good – interruptible transition */
.drawer {
  transform: translateX(-100%);
  transition: transform 200ms ease-out;
}
.drawer.open { transform: translateX(0); }
/* Clicking again mid-animation smoothly reverses */

/* Bad – keyframe for interactive element */
.drawer.open { animation: slideIn 200ms ease-out forwards; }
/* Closing mid-animation snaps or restarts */
```

### Contextual icon animations

When icons appear or disappear contextually (on hover, on state change), animate with `opacity`, `scale`, and `blur` rather than toggling visibility. Always use exactly these values – do not deviate:

- `scale`: `0.25` → `1` (never `0.5` or `0.6`)
- `opacity`: `0` → `1`
- `filter`: `blur(4px)` → `blur(0px)`
- Spring: `duration: 0.3, bounce: 0` – **bounce must always be `0`**

```css
/* CSS cross-fade approach (no library dependency) */
/* Keep both icons in DOM – one absolutely positioned */
.icon-enter {
  position: absolute;
  scale: 0.25;
  opacity: 0;
  filter: blur(4px);
  transition: scale 300ms, opacity 300ms, filter 300ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
.icon-enter.active {
  scale: 1;
  opacity: 1;
  filter: blur(0px);
}
```

When to animate icons: state-change icons (play→pause), icons appearing on hover, contextual toolbar icons. Skip: static navigation icons, always-visible decorative icons.

### Scale on press

A subtle scale-down on click gives buttons tactile feedback. **Always use `scale(0.96)`.** Never go below `0.95` – anything smaller feels exaggerated. Use a CSS transition so mid-press release animates smoothly back.

```css
.button {
  transition-property: scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}
.button:active { scale: 0.96; }
```

Not every button needs this. Add a `static` variant that disables the scale when motion would be distracting (e.g., submit buttons in modals).

### @starting-style: CSS entry without JavaScript

The modern CSS way to animate element entry without JavaScript:

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

This replaces the common React pattern of using `useEffect` + `mounted` state just to trigger enter animations. Check browser support for your project; fall back to the `data-mounted` attribute pattern otherwise.

### Skip animation on page load

Use `initial={false}` on `AnimatePresence` to prevent enter animations from firing on first render. Elements already in their default state shouldn't animate in on page load – only on subsequent state changes.

Works well for: icon swaps, toggles, tabs, segmented controls.

**Do not use** when the component relies on its `initial` prop for a first-time entrance (staggered page heroes, loading states) – `initial={false}` would skip the entire entrance.

### Staggered animations

Use CSS custom properties for cleaner stagger: `animation-delay: calc(var(--i, 0) * 50ms)` with `style="--i: 0"` on each item. **Cap total stagger time** – 10 items at 50ms = 500ms total. For many items, reduce per-item delay or cap staggered count.

### Reduced motion

This is not optional. Vestibular disorders affect ~35% of adults over 40.

```css
/* Define animations normally */
.card {
  animation: slide-up 500ms ease-out;
}

/* Provide alternative for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;  /* Crossfade instead of motion */
  }
}

/* Or disable entirely */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**What to preserve**: Functional animations like progress bars, loading spinners (slowed down), and focus indicators should still work – just without spatial movement.

### Perceived performance

**Nobody cares how fast your site is – just how fast it feels.** Perception can be as effective as actual performance.

**The 80ms threshold**: Our brains buffer sensory input for ~80ms to synchronize perception. Anything under 80ms feels instant and simultaneous. This is your target for micro-interactions.

**Active vs passive time**: Passive waiting (staring at a spinner) feels longer than active engagement. Strategies to shift the balance:

- **Preemptive start**: Begin transitions immediately while loading (skeleton UI). Users perceive work happening.
- **Early completion**: Show content progressively – don't wait for everything. Progressive images, streaming HTML.
- **Optimistic UI**: Update the interface immediately, handle failures gracefully. Use for low-stakes actions; avoid for payments or destructive operations.

**Easing affects perceived duration**: Ease-in (accelerating toward completion) makes tasks feel shorter because the peak-end effect weights final moments heavily.

**Caution**: Too-fast responses can decrease perceived value. Users may distrust instant results for complex operations. Sometimes a brief delay signals "real work" is happening.

### Performance

#### Transition specificity

**Never use `transition: all`** – it forces the browser to watch every property for changes, causes unexpected transitions, and prevents optimizations. Always specify exact properties.

```css
/* Good */
.button { transition-property: scale, background-color; transition-duration: 150ms; }

/* Bad */
.button { transition: all 150ms ease-out; }
```

In Tailwind: `transition-[scale,background-color]` not `transition` (which maps to `all`). Note: `transition-transform` covers `transform, translate, scale, rotate` – use it when only animating transforms.

#### `will-change`

Hints the browser to pre-promote an element to its own GPU compositing layer, preventing first-frame stutter. Only useful for `transform`, `opacity`, and `filter` – properties the GPU can composite. Never `will-change: all`.

```css
/* Good */
.animated-card { will-change: transform; }

/* Bad */
.animated-card { will-change: all; }
.animated-card { will-change: background-color; } /* Can't GPU-composite */
```

Only add when you notice first-frame stutter (Safari benefits most). Don't add preemptively – each compositing layer costs memory.

#### Framer Motion hardware acceleration

Framer Motion's shorthand props (`x`, `y`, `scale`) run on the main thread via `requestAnimationFrame` – NOT hardware-accelerated. For GPU acceleration, use the full transform string:

```jsx
// NOT hardware-accelerated (drops frames when main thread is busy)
<motion.div animate={{ x: 100 }} />

// Hardware-accelerated
<motion.div animate={{ transform: "translateX(100px)" }} />
```

This matters when the browser is simultaneously loading content, running scripts, or painting. If you notice dropped frames during page transitions, switching to the full transform string (or pure CSS) will fix it.

#### CSS animations vs. JavaScript under load

CSS animations run off the main thread – they stay smooth even when the browser is busy loading a new page or running scripts. JavaScript-driven animations (Framer Motion `requestAnimationFrame`) drop frames under load.

**Use CSS** for predetermined, non-interactive animations. **Use JS** when you need dynamic values, interruptibility, or spring physics.

For scroll-triggered animations, use Intersection Observer instead of scroll events; unobserve after animating once. Create motion tokens for consistency (durations, easings, common transitions).

**Avoid**: Animating everything (animation fatigue is real). Using >500ms for UI feedback. Ignoring `prefers-reduced-motion`. Using animation to hide slow loading. Using `transition: all`. Adding `will-change` preemptively.

---

## 2. What should it make the user feel?

Every animation communicates an emotion whether you intend it or not. Fast and sharp feels urgent. Slow and smooth feels calm. Bouncy feels playful. The question is not "should we add animation?" but "what should this animation make the user feel?"

Name the target emotion first, then pick parameters to match.

### Quick reference

| Emotion | Timing | Easing | Scale change | Use cases |
|---------|--------|--------|-------------|-----------|
| Calm & trust | 300–500ms | Smooth ease-in-out, symmetrical | 0–5% | Finance, healthcare, legal, settings |
| Professional | 150–250ms | Standard ease-out, no overshoot | None | Enterprise SaaS, dashboards, admin |
| Elegance | 300–500ms | Extended curves, unhurried | 0–3% | Luxury brands, premium tiers |
| Friendly | 250–400ms | Ease-out with gentle landing | 5–10% | Onboarding, community, social |
| Delight | 200–400ms | Overshoot, bouncy ease-out | 10–20% | Rewards, achievements, celebrations |
| Excitement | 100–300ms | Fast ease-out, bouncy follow-through | 15–25% | Sports, streaming, gaming, launches |
| Urgency | 100–200ms | Aggressive ease-out, decisive stop | Sharp, minimal | Time-sensitive, errors, alerts |

### Calm & trust

The user should feel safe and in control. Nothing sudden, nothing surprising. Every transition resolves predictably.

```css
:root {
  --motion-calm-duration: 400ms;
  --motion-calm-easing: cubic-bezier(0.45, 0, 0.55, 1); /* symmetrical ease-in-out */
}

/* Settings panel sliding in */
.settings-panel {
  transform: translateX(-100%);
  transition: transform var(--motion-calm-duration) var(--motion-calm-easing);
}
.settings-panel.open {
  transform: translateX(0);
}
```

**Do**: Keep transitions symmetrical (same speed in and out). Use consistent timing across the product – same action should always feel the same.

**Avoid**: Overshoot, bounce, fast snapping, or anything that could feel jarring. Never surprise a user who is managing money or health data.

### Professional & credible

Efficient, purposeful, invisible. Animation exists to prevent jarring state changes, not to decorate. Users are here to work.

```css
:root {
  --motion-pro-duration: 200ms;
  --motion-pro-easing: cubic-bezier(0.25, 1, 0.5, 1); /* quart out – refined, quick */
}

/* Dashboard card appearing */
.card-enter {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--motion-pro-duration) var(--motion-pro-easing),
              transform var(--motion-pro-duration) var(--motion-pro-easing);
}
.card-enter.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Do**: Keep durations short. Prefer opacity over scale. Let content speak, not motion.

**Avoid**: Any deformation, bounce, or playful easing. Extended durations waste the user's time.

### Elegance & sophistication

Unhurried confidence. The interface has nowhere else to be. Every movement is deliberate, with generous negative space between actions.

```css
:root {
  --motion-elegant-duration: 450ms;
  --motion-elegant-easing: cubic-bezier(0.22, 1, 0.36, 1); /* quint out – dramatic deceleration */
}

/* Premium product reveal */
.product-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--motion-elegant-duration) var(--motion-elegant-easing),
              transform var(--motion-elegant-duration) var(--motion-elegant-easing);
}
.product-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Do**: Use longer durations with dramatic deceleration. Allow moments to land. Restraint is the signal of quality.

**Avoid**: Quick snapping, busy stagger sequences, or anything that feels efficient rather than graceful.

### Friendly & approachable

Warm and welcoming. Slight softness in the motion tells users this product is not intimidating. Good for first-time experiences.

```css
:root {
  --motion-friendly-duration: 300ms;
  --motion-friendly-easing: cubic-bezier(0.34, 1.2, 0.64, 1); /* gentle overshoot */
}

/* Welcome card bouncing in */
.welcome-card {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity var(--motion-friendly-duration) ease-out,
              transform var(--motion-friendly-duration) var(--motion-friendly-easing);
}
.welcome-card.visible {
  opacity: 1;
  transform: scale(1);
}
```

**Do**: Allow a tiny overshoot (1–3%) on entrances. Use scale combined with opacity. Stagger onboarding steps at 50–80ms intervals.

**Avoid**: Mechanical linear timing. Abrupt exits. Anything that feels like a form submission.

### Delight & playfulness

Celebrate moments that deserve it. Rewards, milestones, successful completions. Save this energy for rare events – frequent delight becomes noise.

```css
:root {
  --motion-delight-duration: 350ms;
  --motion-delight-easing: cubic-bezier(0.34, 1.56, 0.64, 1); /* visible overshoot */
}

/* Achievement badge appearing */
.achievement {
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 200ms ease-out,
              transform var(--motion-delight-duration) var(--motion-delight-easing);
}
.achievement.earned {
  opacity: 1;
  transform: scale(1);
}
```

**Do**: Use overshoot on scale. Pair with color transitions (neutral → vibrant). Allow the animation time to breathe – don't rush celebrations.

**Avoid**: Using this for everyday interactions. Bouncing buttons, wiggling icons, or anything that plays every time the user clicks. Delight wears out fast.

### Excitement & energy

Fast, dynamic, forward-moving. The interface feels alive and responsive. Good for moments that should feel electric – live updates, countdowns, launches.

```css
:root {
  --motion-energy-duration: 200ms;
  --motion-energy-easing: cubic-bezier(0.16, 1, 0.3, 1); /* expo out – snappy */
}

/* Live score update */
.score-update {
  transform: scale(1.15);
  transition: transform var(--motion-energy-duration) var(--motion-energy-easing);
}
.score-update.settled {
  transform: scale(1);
}
```

**Do**: Use fast ease-out with follow-through. Scale changes can be larger (up to 1.15). Stagger tightly (20–30ms) for rapid-fire feel.

**Avoid**: Slow ease-in-out (kills momentum). Long durations. Anything that feels deliberate – excitement is spontaneous.

### Urgency & action

Something needs attention now. The animation should feel decisive – fast start, hard stop. No lingering, no settling.

```css
:root {
  --motion-urgent-duration: 150ms;
  --motion-urgent-easing: cubic-bezier(0.25, 1, 0.5, 1); /* quart out – fast */
}

/* Error shake */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.input-error {
  animation: error-shake 300ms var(--motion-urgent-easing);
}
```

**Do**: Keep it under 200ms. Pair with color (red/orange). Shake amplitude should be 3–5px maximum – enough to notice, not enough to feel aggressive.

**Avoid**: Slow easing, bounce, overshoot, or anything that softens the message. Urgency should not be cute.

### Combining emotions in one product

Most products are not one emotion throughout. A banking app is calm during account review, urgent during fraud alerts, and delightful during savings goal completion. Define motion tokens per emotional context and apply them to the right moments.

```css
:root {
  /* Default – calm */
  --motion-duration: 400ms;
  --motion-easing: cubic-bezier(0.45, 0, 0.55, 1);

  /* Override for alerts */
  --motion-alert-duration: 150ms;
  --motion-alert-easing: cubic-bezier(0.25, 1, 0.5, 1);

  /* Override for milestones */
  --motion-celebrate-duration: 350ms;
  --motion-celebrate-easing: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

Every emotion still works with reduced motion – replace spatial movement with opacity crossfades. Calm stays calm. Urgency stays fast (100ms opacity snap). The emotion lives in the timing and easing, not in the distance traveled.

---

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

## 5. How do I build an advanced interaction?

### clip-path for animation

`clip-path` is one of the most powerful animation tools in CSS. It clips what's visible without affecting layout, runs on the GPU, and can be smoothly transitioned.

#### The inset shape

`clip-path: inset(top right bottom left)` defines a rectangular clipping region. Each value "eats" into the element from that side.

```css
.hidden  { clip-path: inset(0 100% 0 0); }  /* fully hidden from right */
.visible { clip-path: inset(0 0 0 0); }      /* fully visible */

/* Reveal from left to right */
.overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms ease-out;
}
.button:active .overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;
}
```

#### Tabs with perfect color transitions

The challenge: transitioning text color between active and inactive tabs creates a moment where both states are visible. The solution: duplicate the tab list. Style the copy as "active." Clip the copy so only the active tab shows. Animate the clip on tab change. This produces a seamless color transition that timing individual color transitions can never achieve.

#### Hold-to-delete pattern

Use `clip-path: inset(0 100% 0 0)` on a colored overlay. On `:active`, transition to `inset(0 0 0 0)` over 2s with linear timing. On release, snap back with 200ms ease-out. Add `scale(0.97)` on the button for press feedback.

```css
.delete-overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms ease-out;
}
.delete-button:active .delete-overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;
}
```

#### Image reveals on scroll

Start with `clip-path: inset(0 0 100% 0)` (hidden from bottom). Animate to `inset(0 0 0 0)` when the element enters the viewport. Use `IntersectionObserver` with `{ once: true, rootMargin: '-100px' }`.

#### Comparison sliders

Overlay two images. Clip the top one with `clip-path: inset(0 50% 0 0)`. Adjust the right inset value based on drag position. No extra DOM elements needed, fully hardware-accelerated.

### Gesture and drag interactions

#### Momentum-based dismissal

Don't require dragging past a distance threshold alone. Calculate velocity: if the drag was fast enough, dismiss regardless of distance.

```js
const timeTaken = Date.now() - dragStartTime;
const velocity = Math.abs(dragDistance) / timeTaken;

if (Math.abs(dragDistance) >= THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

A quick flick should dismiss even if the distance is short. This matches the physical intuition of flicking something away.

#### Damping at boundaries

When a user drags past a natural boundary (e.g., pulling a drawer further than fully open), apply damping – the more they drag, the less the element moves. Things in the real world don't suddenly stop; they slow down first.

```js
const dampenedDistance = Math.pow(rawDistance, 0.7); // progressive resistance
```

#### Pointer capture for drag

Once dragging starts, capture all pointer events on the element. This ensures dragging continues even if the pointer leaves the element bounds.

```js
element.setPointerCapture(event.pointerId);
```

#### Multi-touch protection

Ignore additional touch points after the initial drag begins. Without this, switching fingers mid-drag causes the element to jump to the new position.

```js
function onPointerDown(event) {
  if (isDragging) return;
  isDragging = true;
  // ...
}
```

#### Friction instead of hard stops

Instead of preventing upward drag entirely, allow it with increasing friction. It feels more natural than hitting an invisible wall – the element slows and communicates resistance without snapping.

### Web Animations API (WAAPI)

The Web Animations API gives JavaScript control with CSS-level performance – hardware-accelerated, interruptible, no library needed.

```js
element.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  {
    duration: 1000,
    fill: 'forwards',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
  }
);
```

Use WAAPI when:
- You need programmatic control (start, pause, reverse, cancel)
- The animation responds to dynamic values but needs GPU compositing
- You want CSS animation performance without a predefined stylesheet

### Debugging animations

#### Slow motion testing

Play animations at reduced speed to spot issues invisible at full speed. Temporarily increase duration to 2–5× normal, or use browser DevTools (Animations panel) to slow playback.

Look for:
- Two distinct states overlapping during a crossfade (add blur to mask)
- Easing that starts or stops abruptly (wrong curve)
- Scale origin is off – element scales from wrong point
- Multiple animated properties (opacity, transform) out of sync

#### Frame-by-frame inspection

Step through animations frame by frame in Chrome DevTools Animations panel. This reveals timing mismatches between coordinated properties that are invisible at full speed.

#### Test on real devices

For touch interactions (drawers, swipe gestures), test on physical devices. Connect via USB, use Safari remote devtools. DevTools device emulation misses:
- Real touch gesture behavior
- GPU compositing behavior on lower-end hardware
- Safari-specific rendering differences

Review animations with fresh eyes the next day. Imperfections that were invisible during development become obvious after stepping away.

**Avoid**: Using clip-path on very large elements (expensive). Velocity-only dismissal without distance fallback. `will-change: all` before clip-path animations (use specific properties). Adding WAAPI for simple animations that CSS handles natively.

---

## 6. It feels wrong – how do I fix it?

When animation feels wrong but you can't articulate why, find the symptom below. Each is a diagnosis checklist followed by fixes.

### "Feels robotic"

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

### "Feels sluggish"

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

### "Causes motion sickness"

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

```css
@media (prefers-reduced-motion: reduce) {
  .hero-parallax { transform: none !important; }
  .page-transition {
    animation: none;
    opacity: 1; /* Instant state change */
  }
}
```

### "Emotionally wrong"

The animation technically works but creates the wrong feeling – a banking app that feels playful, a game that feels corporate, a wellness app that feels urgent.

**Diagnosis**:
- [ ] Easing doesn't match the product's emotional register
- [ ] Timing is too fast for calm products or too slow for energetic ones
- [ ] Bounce/overshoot in a context that demands restraint
- [ ] Inconsistent emotional tone across the product

**Fixes**:
- Name the target emotion before choosing parameters (see section 2)
- Match easing to emotion: trust → symmetrical, urgency → fast ease-out, delight → overshoot
- Match timing to context (see section 4)
- Audit the product for emotional consistency – does every screen feel like the same product?

### "Performance drops"

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

### "Inconsistent across product"

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

### "Distracting or overdone"

Users notice the animation instead of the content. The interface feels busy, fidgety, or like it's showing off.

**Diagnosis**:
- [ ] Bounce or elastic easing on interactive elements
- [ ] Scale amplitude over 5% on frequently used elements
- [ ] Multiple elements animating at the same time without stagger
- [ ] Entrance animations on pages the user visits repeatedly
- [ ] Decorative animation with no functional purpose

**Fixes**:
- Apply the frequency test from section 1: how often will the user see this? 100+ times/day = no animation
- Remove all bounce and elastic easing from production UI
- Reduce scale amplitude: hover should be 1.02–1.03, not 1.1
- Skip entrance animations on returning visits (`initial={false}` pattern)
- Ask: "Would this annoy me after 100 uses?" If yes, remove it

### "Missing feedback"

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

### "Accessibility concerns"

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
