# Design Review Transcript: Figma Checkout Flow (With Skill)

**Date**: 2026-03-10
**Review type**: Figma designs
**Project**: E-commerce checkout flow (4 screens)
**Skills loaded**: ui-visual-review, ui-accessibility, psych-master-audit

---

## Step 1: Route to Figma Review Workflow

Recognized the `figma` argument from `/de:review figma`. Activated the Figma designs workflow (Option 1) from the review command. This workflow runs 3 sequential skill reviews and compiles a structured report.

---

## Step 2: Request Design Assets

Asked the user to share their designs:

```
Figma Review -- Checkout Flow

I'll review your 4 checkout screens across three dimensions:
visual quality, accessibility, and psychology.

To get started, please share one of the following:

1. Figma frame link (preferred) -- I'll use Figma MCP to read design data directly
2. Screenshots of each screen -- paste or describe them

Which would you like to share?
```

**Simulated user answer**: Shared a Figma frame link to a page containing all 4 screens: Cart Summary, Shipping Info, Payment, and Order Confirmation.

**Simulated Figma MCP response**: Returned structured design data for each frame including layout hierarchy, text content, colors, spacing values, font sizes, component instances, and auto-layout configurations.

---

## Step 3: Visual Review (ui-visual-review)

Loaded `ui-visual-review` skill. Evaluated each screen against structured visual quality criteria.

### Cart Summary Screen
- **Layout**: Clean single-column layout with clear item rows. Consistent 16px padding. Product images left-aligned with text details right.
- **Typography hierarchy**: H1 "Your Cart" (24px/bold), item names (16px/medium), prices (16px/semibold), total (20px/bold). Hierarchy is clear.
- **Color**: Primary CTA (checkout button) uses brand blue (#2563EB). Sufficient contrast. Remove/edit links in neutral gray.
- **Spacing**: Consistent 12px between items, 24px section separation. Rhythm is good.
- **Issue found**: Quantity selector uses very small +/- buttons (28x28px). Should be at least 36px for comfortable tapping.

### Shipping Info Screen
- **Layout**: Standard form layout. Labels above inputs. Two-column for city/state on desktop, single column on mobile.
- **Typography**: Form labels (14px/medium), input text (16px/regular), section headers (18px/semibold). Appropriate scale.
- **Color**: Input borders use #D1D5DB (gray-300), focus state uses brand blue outline. Good distinction.
- **Spacing**: 16px between form fields, 24px between sections. Adequate breathing room.
- **Issue found**: No visual progress indicator showing which step the user is on. Progress bar or step indicators recommended.

### Payment Screen
- **Layout**: Card number, expiry, CVV in a compact group. Payment method selector above. Order summary sidebar on desktop.
- **Typography**: Consistent with shipping screen. Card input uses monospace for number entry.
- **Color**: Security badge and lock icon present. Trust indicators in green (#059669).
- **Spacing**: Payment fields slightly cramped (8px gap between expiry and CVV). Increase to 12px.
- **Issue found**: Expiry date format placeholder shows "MM/YY" but the input field width suggests it might get cut off on smaller screens.

### Order Confirmation Screen
- **Layout**: Success state with check icon, order number, summary, and next-steps CTAs.
- **Typography**: "Order Confirmed!" (28px/bold), order number (16px/mono), summary details (14px/regular).
- **Color**: Green success icon and header. Consistent with positive feedback patterns.
- **Spacing**: Generous spacing throughout. Feels celebratory and uncluttered.
- **No major issues**: Clean confirmation screen.

### Cross-Screen Visual Findings
- Consistent color palette across all 4 screens
- Typography scale is cohesive
- CTA button styling consistent (blue, rounded-lg, 48px height)
- Minor inconsistency: Cart uses 12px item spacing while shipping uses 16px field spacing -- consider harmonizing

---

## Step 4: Accessibility Review (ui-accessibility)

Loaded `ui-accessibility` skill. Audited each screen for WCAG compliance.

### Cart Summary
- **Contrast**: Pass -- all text meets 4.5:1 ratio against backgrounds
- **Touch targets**: Fail -- quantity +/- buttons are 28x28px (minimum 44x44px per WCAG 2.5.5)
- **Screen reader**: Item descriptions need more context (e.g., "Remove Wireless Headphones" not just "Remove")
- **Focus order**: Logical tab order through items, quantity controls, then checkout CTA

### Shipping Info
- **Contrast**: Pass -- form labels and input text meet AA standards
- **Form labels**: Pass -- all inputs have visible labels. `<label>` elements properly associated.
- **Error states**: Need improvement -- no visible error styling shown in the designs. Add red border + error message pattern.
- **Autocomplete**: Ensure `autocomplete` attributes on address fields (name, street-address, postal-code, etc.)

### Payment
- **Contrast**: Pass
- **Touch targets**: Pass -- payment method radio buttons are 48px tap area
- **Sensitive fields**: Card number input should not allow autocomplete for security
- **Error states**: Same gap as shipping -- no error state designs provided
- **Focus management**: After payment method selection, focus should move to the relevant input fields

### Order Confirmation
- **Contrast**: Pass
- **Focus management**: On page load, focus should announce success state to screen readers via `aria-live="polite"`
- **Print**: Confirmation should be printable -- check that print styles preserve essential info

### Cross-Screen Accessibility Findings
- Missing: Skip-to-content link on all screens
- Missing: Error state designs across the flow
- Missing: Loading/processing states for payment submission
- Touch target issue on cart screen needs immediate attention

---

## Step 5: Psychology Review (psych-master-audit)

Loaded `psych-master-audit` skill. Scanned checkout flow for psychological patterns.

### Cognitive Load
- Cart summary effectively reduces cognitive load by showing a clear total and limited action options
- Shipping form could benefit from address autocomplete to reduce friction
- Payment screen keeps the order summary visible -- good anchoring

### Trust & Security
- Lock icon and "Secure checkout" badge present on payment screen -- good trust signals
- Missing: Trust badges or security logos (e.g., SSL, payment processor logos) on shipping and cart screens
- Missing: Privacy reassurance near email field on shipping ("We won't share your email")

### Progress & Commitment
- No progress indicator across the 4-step flow -- users don't know how many steps remain
- Recommendation: Add a step indicator (1. Cart > 2. Shipping > 3. Payment > 4. Confirmation) to leverage the goal gradient effect
- The confirmation screen provides closure but could reinforce the purchase decision with "You saved $X" or delivery timeline

### Loss Aversion
- Cart shows individual item prices but doesn't emphasize savings or value
- Consider showing original price crossed out if items are discounted
- Shipping screen could show "Free shipping" prominently if applicable -- removing a cost feels like a gain

### Social Proof
- No social proof elements in the checkout flow (ratings, review counts, "X people bought this")
- Cart summary could show "Popular item" badges
- Confirmation could show "Join 10,000+ happy customers"

### Urgency & Scarcity (Ethical)
- No artificial urgency detected -- good ethical practice
- If items have limited stock, showing "Only 3 left" on the cart screen is honest and helpful

### Friction Points
- Requiring account creation before checkout would be a major friction point -- ensure guest checkout is available
- Number of form fields on shipping screen is reasonable (7 fields)
- Single CTA per screen reduces decision paralysis

---

## Step 6: Compiled Review Report

### Executive Summary

The checkout flow is well-designed with strong visual consistency and a clean layout. Three areas need attention before launch:

1. **Critical**: Touch target sizes on cart quantity controls (accessibility violation)
2. **High**: Missing error state designs across all form screens
3. **High**: No progress indicator across the 4-step flow

### Per-Screen Summary

| Screen | Visual | Accessibility | Psychology | Priority Items |
|--------|--------|--------------|------------|----------------|
| Cart Summary | Good | 1 fail (touch targets) | Needs social proof, savings emphasis | Fix touch targets |
| Shipping Info | Good | Needs error states | Add privacy reassurance | Design error states |
| Payment | Minor spacing | Needs error states | Strong trust signals | Fix field spacing, add error states |
| Confirmation | Excellent | Needs aria-live | Add reinforcement | Add delivery timeline |

### Top Recommendations (Prioritized)

1. **Fix quantity button touch targets** -- Increase to 44x44px minimum (accessibility critical)
2. **Design error states** -- Red border + inline error message for all form fields
3. **Add step progress indicator** -- "Step 2 of 4" bar across all screens
4. **Add skip-to-content link** -- Global accessibility improvement
5. **Add trust badges to cart and shipping** -- Increase security perception earlier in flow
6. **Show savings/value messaging** -- Leverage loss aversion on cart summary
7. **Add privacy reassurance** -- "We won't share your email" near the email field
8. **Add loading/processing state** -- For payment submission button

### Post-Review Options

Presented to user:

```
Review complete. What would you like to do?

1. Address findings -- work through the issues identified
2. Share with stakeholders -- prepare a presentation of findings
3. Document -- save findings via /de:compound
4. Run another review type -- choose a different dimension
```

---

## Skills Loaded

| Skill | Purpose | Key Findings |
|-------|---------|--------------|
| `ui-visual-review` | Visual design quality | Minor spacing and sizing issues, strong overall consistency |
| `ui-accessibility` | WCAG compliance | Touch targets, missing error states, skip-to-content link |
| `psych-master-audit` | Psychology principles | Missing progress indicator, trust signals, social proof |
