# Section 5a: Emotional Design Foundations (Laws 41-45)

## Law 41: Peak-End Rule

**Definition**: People judge an experience based on its most intense moment (the peak) and how it ends, rather than on the average of every moment.

### UX Application

Users remember how the system affected their emotions at key moments: during peak interaction (for example, solving a problem) and at the ending (final screen or completion of onboarding).

It is important to ensure the peak creates positive emotions and the finale leaves a feeling of satisfaction and completeness.

For example, during order checkout you can create a "victory" moment through confirmation of a successful purchase with a gratitude or celebratory message, and ensure a clear finale through an informative confirmation email or clear delivery information.

### Good Example

A food delivery app confirms the order with a playful animation of a chef preparing the meal, shows a real-time map of the delivery, and ends with a "Your meal has arrived! Enjoy!" screen with a one-tap rating option. Both the peak (watching delivery approach) and end (cheerful arrival confirmation) are emotionally positive.

### Bad Example

A checkout flow processes the payment successfully but shows only "Order #38291 confirmed" in plain text, then redirects to the homepage. No celebration at the peak, no satisfying ending. The user is left wondering "Did everything actually go through?"

### From 106 Cognitive Biases: Peak-End Rule

We judge an experience largely based on how we felt at its peak and at its end, rather than the sum or average of every moment.

**Key research**: Daniel Kahneman's cold water experiment -- participants preferred a trial of 60 seconds in painfully cold water followed by 30 seconds of slightly warmer water over just 60 seconds of cold water. The improved ending made the longer, objectively worse experience seem better.

**UX applications from 106 Biases**:

- **Provide Exit Points**: Well-designed exit moments (save confirmations, summary screens, "come back soon" messages) dramatically improve how the experience is remembered
- **Peak-End Rule in onboarding**: A confusing 10-step onboarding that ends with a satisfying Aha! Moment will be remembered more positively than a smooth 5-step onboarding with a flat ending
- **Error recovery as peak**: When a user encounters an error and the system helps them recover gracefully, that recovery can become a positive peak -- better than if no error had occurred

**Design strategy**: Map your user journey and identify (1) where the peak is, (2) how the experience ends. Invest disproportionate design effort in these two moments.

---

## Law 42: Delighters

**Definition**: Unexpected micro-interactions that go beyond the user's basic expectations and create an emotional "wow effect."

### UX Application

From practice, pleasant surprises often become viral moments that users share with friends and colleagues. They function as emotional hooks for retention and loyalty building, and their implementation is usually cheaper than traditional retention methods.

For example: a fun animation when completing a task, a humorous message during loading, or a pleasant sound effect on a successful action.

Use them moderately and appropriately -- too many can be annoying. They should be unobtrusive and not interfere with core tasks.

### Good Example

A task management app plays a subtle confetti animation when all tasks for the day are completed. It is brief, delightful, and only appears when the user achieves something meaningful. Users screenshot it and share it on social media.

### Bad Example

A banking app adds cartoon animations to every transaction confirmation. While the intent is delight, adding playful animations to serious financial operations undermines the app's credibility and annoys users making multiple transfers.

### From 106 Cognitive Biases: Delighters

Delighters create disproportionate emotional impact because they exceed expectations. The Kano Model classifies features into:

- **Basic** (expected): If missing, users are dissatisfied; if present, neutral
- **Performance** (desired): More is better, linearly
- **Delighters** (unexpected): Not expected, so even small ones create outsized positive reactions

The key insight: delighters have the highest emotional ROI because they start from zero expectation. A $0.02 animation can create more positive sentiment than a $200,000 feature improvement.

---

## Law 43: Sensory Appeal

**Definition**: An interface should pleasantly affect the user's senses through visual, auditory, and tactile elements.

### UX Application

Create a feeling of real interaction through micro-animations, sounds, and visual effects. For example, when dragging elements, the user can feel their "weight" through movement smoothness.

In mobile apps, haptic vibration when pressing a button adds a sense of completion, and well-chosen confirmation sounds reinforce confidence in actions.

In practice, this principle is often used to create "satisfaction from use."

### Good Example

In a notes app, pressing the button to create a new note produces a gentle pulse, and on screen the old page smoothly rolls up, revealing a new one. A subtle paper rustling sound can also be added for greater appeal.

### Bad Example

A user presses the button to create a new note, and this triggers only a mechanical action -- a dry, blank page opens. The absence of animation, vibration, or sound effect makes the interaction dry and devoid of emotional content.

---

## Law 44: Labor Illusion

**Definition**: Users value results more when they see the process of the system working, even if it is artificially slowed down.

### UX Application

This principle is especially important for fast operations that users may perceive as insufficiently reliable due to their instantness.

For example, when searching for tickets, analyzing data, or processing payments, show intermediate stages of the system's work. Instead of a simple loading indicator, display specific process steps: "checking availability," "calculating the best price," "generating results."

This creates a sense of complex work and increases trust in the result. Be careful not to overdo the duration -- the process should look natural.

### Good Example

A travel booking site searching for flights shows: "Searching 500+ airlines... Comparing prices... Finding the best connections... Checking seat availability." Each step takes 1-2 seconds with a smooth progress animation. Users feel the system is doing thorough work on their behalf.

### Bad Example

An instant search returns results in 0.1 seconds. Users distrust the completeness of results because the search "couldn't have checked everything that fast." Paradoxically, the faster technology makes users less confident.

### From 106 Cognitive Biases: Labor Illusion

Research by Ryan Buell at Harvard Business School found that people valued a travel site's results more when they could see the site "working" -- even when the results were identical to an instant version.

**UX applications from 106 Biases**:

- **Show the work**: When your system does complex processing, make it visible. AI tools that show "Analyzing your data... Comparing patterns... Generating insights..." feel more thorough than instant results.
- **Transparency theater**: The key is showing genuine steps the system actually performs, not fabricating fake ones. Users appreciate seeing what happens behind the scenes.
- **Calibrate duration**: Too fast feels cheap; too slow feels broken. 2-5 seconds for "complex" operations hits the sweet spot.

---

## Law 45: IKEA Effect

**Definition**: Users value products and solutions more when they personally participated in creating or customizing them.

### UX Application

Use this principle by involving users in customization and personalization of the product. For example, let them customize their workspace, create their own templates or filters, choose color schemes.

This works especially effectively in creative apps where users can create their own content.

It is important to find a balance between ready-made solutions and self-customization -- overly complex customization can repel users. Additional features should be accessible but not mandatory.

### Good Example

A dashboard tool lets users drag-and-drop widgets, choose which metrics to display, and customize the color theme. After 10 minutes of setup, the dashboard feels uniquely "theirs" -- they are far more likely to use it daily and far less likely to switch to a competitor.

### Bad Example

A productivity app requires users to build their entire workflow from scratch before they can use any feature. There are no templates, no defaults, no guided setup. The IKEA Effect requires some effort, not overwhelming effort -- the furniture comes with instructions and pre-drilled holes.

### IKEA Effect + Endowment Effect Connection

The IKEA Effect creates ownership through effort. Once users feel ownership, the Endowment Effect (Law 46) kicks in -- they overvalue what they "own" and resist switching. This combination is one of the strongest ethical retention mechanisms in product design.

---

## Emotional Design Checklist

For any interface or flow, check these five questions:

1. **Peak-End Rule**: Where is the peak moment? How does the experience end? Are both emotionally positive?
2. **Delighters**: Is there at least one unexpected pleasant moment? Is it proportional and non-intrusive?
3. **Sensory Appeal**: Does the interface engage multiple senses? Do interactions feel tactile and responsive?
4. **Labor Illusion**: For any processing or loading, does the user see the work being done? Is the duration calibrated?
5. **IKEA Effect**: Has the user invested personal effort that makes the product feel uniquely theirs?

## Principle Interactions

### Peak Placement Strategy
Combine Delighters + Sensory Appeal at the peak moment. A celebratory animation (Delighter) with satisfying sound (Sensory Appeal) at the moment of completing a purchase creates a memorable positive peak.

### Ending Strategy
Combine Peak-End Rule + Labor Illusion at the conclusion. Show the system working to generate a final summary or receipt (Labor Illusion), then present a clear, satisfying completion screen (Peak-End Rule).

### Ownership Strategy
Combine IKEA Effect + Sensory Appeal during customization. Make the customization process itself pleasurable through smooth drag-and-drop, satisfying snap-to-grid, and visual confirmation of each change.
