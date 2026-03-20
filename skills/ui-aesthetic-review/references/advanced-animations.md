# Advanced Animation Techniques

## clip-path for Animation

`clip-path` is one of the most powerful animation tools in CSS. It clips what's visible without affecting layout, runs on the GPU, and can be smoothly transitioned.

### The inset Shape

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

### Tabs with Perfect Color Transitions

The challenge: transitioning text color between active and inactive tabs creates a moment where both states are visible. The solution: duplicate the tab list. Style the copy as "active." Clip the copy so only the active tab shows. Animate the clip on tab change. This produces a seamless color transition that timing individual color transitions can never achieve.

### Hold-to-Delete Pattern

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

### Image Reveals on Scroll

Start with `clip-path: inset(0 0 100% 0)` (hidden from bottom). Animate to `inset(0 0 0 0)` when the element enters the viewport. Use `IntersectionObserver` with `{ once: true, rootMargin: '-100px' }`.

### Comparison Sliders

Overlay two images. Clip the top one with `clip-path: inset(0 50% 0 0)`. Adjust the right inset value based on drag position. No extra DOM elements needed, fully hardware-accelerated.

---

## Gesture and Drag Interactions

### Momentum-Based Dismissal

Don't require dragging past a distance threshold alone. Calculate velocity: if the drag was fast enough, dismiss regardless of distance.

```js
const timeTaken = Date.now() - dragStartTime;
const velocity = Math.abs(dragDistance) / timeTaken;

if (Math.abs(dragDistance) >= THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

A quick flick should dismiss even if the distance is short. This matches the physical intuition of flicking something away.

### Damping at Boundaries

When a user drags past a natural boundary (e.g., pulling a drawer further than fully open), apply damping — the more they drag, the less the element moves. Things in the real world don't suddenly stop; they slow down first.

```js
const dampenedDistance = Math.pow(rawDistance, 0.7); // progressive resistance
```

### Pointer Capture for Drag

Once dragging starts, capture all pointer events on the element. This ensures dragging continues even if the pointer leaves the element bounds.

```js
element.setPointerCapture(event.pointerId);
```

### Multi-Touch Protection

Ignore additional touch points after the initial drag begins. Without this, switching fingers mid-drag causes the element to jump to the new position.

```js
function onPointerDown(event) {
  if (isDragging) return;
  isDragging = true;
  // ...
}
```

### Friction Instead of Hard Stops

Instead of preventing upward drag entirely, allow it with increasing friction. It feels more natural than hitting an invisible wall — the element slows and communicates resistance without snapping.

---

## Web Animations API (WAAPI)

The Web Animations API gives JavaScript control with CSS-level performance — hardware-accelerated, interruptible, no library needed.

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

---

## Debugging Animations

### Slow Motion Testing

Play animations at reduced speed to spot issues invisible at full speed. Temporarily increase duration to 2–5× normal, or use browser DevTools (Animations panel) to slow playback.

Look for:
- Two distinct states overlapping during a crossfade (add blur to mask)
- Easing that starts or stops abruptly (wrong curve)
- Scale origin is off — element scales from wrong point
- Multiple animated properties (opacity, transform) out of sync

### Frame-by-Frame Inspection

Step through animations frame by frame in Chrome DevTools Animations panel. This reveals timing mismatches between coordinated properties that are invisible at full speed.

### Test on Real Devices

For touch interactions (drawers, swipe gestures), test on physical devices. Connect via USB, use Safari remote devtools. DevTools device emulation misses:
- Real touch gesture behavior
- GPU compositing behavior on lower-end hardware
- Safari-specific rendering differences

Review animations with fresh eyes the next day. Imperfections that were invisible during development become obvious after stepping away.

---

**Avoid**: Using clip-path on very large elements (expensive). Velocity-only dismissal without distance fallback. `will-change: all` before clip-path animations (use specific properties). Adding WAAPI for simple animations that CSS handles natively.
