# Motion Design

## The Animation Decision Framework

Before writing any animation code, answer these questions in order.

### 1. Should this animate at all?

How often users will see it determines everything.

| Frequency | Decision |
|-----------|----------|
| 100+ times/day (keyboard shortcuts, command palette) | No animation |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, celebrations) | Can add delight |

**Never animate keyboard-initiated actions.** These fire hundreds of times daily. Animation makes them feel slow and disconnected from user intent. The optimal experience for something used hundreds of times a day is no animation at all.

### 2. What is the purpose?

Every animation needs a clear "why":

- **Spatial consistency** – toast enters/exits from same direction, making swipe-to-dismiss intuitive
- **State indication** – morphing feedback button shows a state change
- **Preventing jarring changes** – elements disappearing without transition feel broken
- **Feedback** – button scales down on press, confirming the interface heard the user
- **Explanation** – a marketing animation showing how a feature works

If the purpose is "it looks cool" and the user will see it often, don't animate.

### 3. What easing?

Is the element entering or exiting?
- **Yes** → `ease-out` (starts fast, feels responsive)

Is it moving or morphing on screen?
- **Yes** → `ease-in-out` (natural acceleration/deceleration)

Is it a hover or color change?
- **Yes** → `ease`

Is it constant motion (marquee, progress bar)?
- **Yes** → `linear`

**Never use `ease-in` for UI animations.** It starts slow – the exact moment the user is watching most closely. A dropdown with `ease-in` at 300ms *feels* slower than `ease-out` at the same 300ms.

### 4. How fast?

UI animations should stay **under 300ms**. A 180ms dropdown feels more responsive than a 400ms one.

| Element | Duration |
|---------|----------|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |

## Duration: The 100/300/500 Rule

Timing matters more than easing. These durations feel right for most UI:

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100-150ms** | Instant feedback | Button press, toggle, color change |
| **200-300ms** | State changes | Menu open, tooltip, hover states |
| **300-500ms** | Layout changes | Accordion, modal, drawer |
| **500-800ms** | Entrance animations | Page load, hero reveals |

**Exit animations are faster than entrances**–use ~75% of enter duration.

## Easing: Pick the Right Curve

**Don't use `ease`.** It's a compromise that's rarely optimal. Instead:

| Curve | Use For | CSS |
|-------|---------|-----|
| **ease-out** | Elements entering | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | Elements leaving | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | State toggles (there → back) | `cubic-bezier(0.65, 0, 0.35, 1)` |

**For micro-interactions, use exponential curves**–they feel natural because they mimic real physics (friction, deceleration):

```css
/* Quart out - smooth, refined (recommended default) */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Quint out - slightly more dramatic */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/* Expo out - snappy, confident */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

**Avoid bounce and elastic curves.** They were trendy in 2015 but now feel tacky and amateurish. Real objects don't bounce when they stop–they decelerate smoothly. Overshoot effects draw attention to the animation itself rather than the content.

## Never Animate from scale(0)

Nothing in the real world disappears and reappears completely. Elements animating from `scale(0)` look like they appear out of nowhere.

Start from `scale(0.95)` or higher, combined with opacity. Even a barely-visible initial scale makes the entrance feel more natural – like a balloon that has visible shape even when deflated.

```css
/* Bad – appears out of nowhere */
.entering { transform: scale(0); opacity: 0; }

/* Good – has visible shape at start */
.entering { transform: scale(0.95); opacity: 0; }
```

## Popover transform-origin

Popovers should scale in from their trigger, not from center. The default `transform-origin: center` is wrong for almost every popover.

**Exception: modals.** Modals are not anchored to a trigger – they appear centered in the viewport. Keep `transform-origin: center` for modals.

```css
/* Radix UI */
.popover { transform-origin: var(--radix-popover-content-transform-origin); }

/* Base UI */
.popover { transform-origin: var(--transform-origin); }
```

## Blur to Mask Transitions

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

## Spring Animations

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

## Asymmetric Enter/Exit Timing

Slow where the user is deciding. Fast where the system is responding.

```css
/* Release: fast */
.overlay { transition: clip-path 200ms ease-out; }

/* Press: slow and deliberate */
.button:active .overlay { transition: clip-path 2s linear; }
```

This pattern applies broadly: a hold-to-delete takes 2s to fill (user controls it), but releases instantly (system responds). Tooltip delays are long (prevents accidents), but subsequent tooltip hovers are instant (system got the message).

## The Only Two Properties You Should Animate

**transform** and **opacity** only–everything else causes layout recalculation. For height animations (accordions), use `grid-template-rows: 0fr → 1fr` instead of animating `height` directly.

## Interruptible Animations

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

## Contextual Icon Animations

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

## Scale on Press

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

## @starting-style: CSS Entry Without JavaScript

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

## Skip Animation on Page Load

Use `initial={false}` on `AnimatePresence` to prevent enter animations from firing on first render. Elements already in their default state shouldn't animate in on page load – only on subsequent state changes.

Works well for: icon swaps, toggles, tabs, segmented controls.

**Do not use** when the component relies on its `initial` prop for a first-time entrance (staggered page heroes, loading states) – `initial={false}` would skip the entire entrance.

## Staggered Animations

Use CSS custom properties for cleaner stagger: `animation-delay: calc(var(--i, 0) * 50ms)` with `style="--i: 0"` on each item. **Cap total stagger time**–10 items at 50ms = 500ms total. For many items, reduce per-item delay or cap staggered count.

## Reduced Motion

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

**What to preserve**: Functional animations like progress bars, loading spinners (slowed down), and focus indicators should still work–just without spatial movement.

## Perceived Performance

**Nobody cares how fast your site is–just how fast it feels.** Perception can be as effective as actual performance.

**The 80ms threshold**: Our brains buffer sensory input for ~80ms to synchronize perception. Anything under 80ms feels instant and simultaneous. This is your target for micro-interactions.

**Active vs passive time**: Passive waiting (staring at a spinner) feels longer than active engagement. Strategies to shift the balance:

- **Preemptive start**: Begin transitions immediately while loading (skeleton UI). Users perceive work happening.
- **Early completion**: Show content progressively–don't wait for everything. Progressive images, streaming HTML.
- **Optimistic UI**: Update the interface immediately, handle failures gracefully. Use for low-stakes actions; avoid for payments or destructive operations.

**Easing affects perceived duration**: Ease-in (accelerating toward completion) makes tasks feel shorter because the peak-end effect weights final moments heavily.

**Caution**: Too-fast responses can decrease perceived value. Users may distrust instant results for complex operations. Sometimes a brief delay signals "real work" is happening.

## Performance

### Transition Specificity

**Never use `transition: all`** – it forces the browser to watch every property for changes, causes unexpected transitions, and prevents optimizations. Always specify exact properties.

```css
/* Good */
.button { transition-property: scale, background-color; transition-duration: 150ms; }

/* Bad */
.button { transition: all 150ms ease-out; }
```

In Tailwind: `transition-[scale,background-color]` not `transition` (which maps to `all`). Note: `transition-transform` covers `transform, translate, scale, rotate` – use it when only animating transforms.

### `will-change`

Hints the browser to pre-promote an element to its own GPU compositing layer, preventing first-frame stutter. Only useful for `transform`, `opacity`, and `filter` – properties the GPU can composite. Never `will-change: all`.

```css
/* Good */
.animated-card { will-change: transform; }

/* Bad */
.animated-card { will-change: all; }
.animated-card { will-change: background-color; } /* Can't GPU-composite */
```

Only add when you notice first-frame stutter (Safari benefits most). Don't add preemptively – each compositing layer costs memory.

### Framer Motion Hardware Acceleration

Framer Motion's shorthand props (`x`, `y`, `scale`) run on the main thread via `requestAnimationFrame` – NOT hardware-accelerated. For GPU acceleration, use the full transform string:

```jsx
// NOT hardware-accelerated (drops frames when main thread is busy)
<motion.div animate={{ x: 100 }} />

// Hardware-accelerated
<motion.div animate={{ transform: "translateX(100px)" }} />
```

This matters when the browser is simultaneously loading content, running scripts, or painting. If you notice dropped frames during page transitions, switching to the full transform string (or pure CSS) will fix it.

### CSS Animations vs. JavaScript Under Load

CSS animations run off the main thread – they stay smooth even when the browser is busy loading a new page or running scripts. JavaScript-driven animations (Framer Motion `requestAnimationFrame`) drop frames under load.

**Use CSS** for predetermined, non-interactive animations. **Use JS** when you need dynamic values, interruptibility, or spring physics.

For scroll-triggered animations, use Intersection Observer instead of scroll events; unobserve after animating once. Create motion tokens for consistency (durations, easings, common transitions).

---

**Avoid**: Animating everything (animation fatigue is real). Using >500ms for UI feedback. Ignoring `prefers-reduced-motion`. Using animation to hide slow loading. Using `transition: all`. Adding `will-change` preemptively.
