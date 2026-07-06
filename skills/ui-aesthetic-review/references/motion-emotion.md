# Motion – emotion to animation mapping

_Sibling motion files: motion-decisions.md, motion-emotion.md, motion-components.md, motion-advanced.md_

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

