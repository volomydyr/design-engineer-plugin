# Psych Framework -- Complete Reference

## Core Concept: Psych as a Cognitive Resource

Psych is the merging of the Motivation and Ability axes of the Behavior Map into a single, trackable dimension. Instead of thinking about motivation and ability as separate axes on a chart, Psych combines them into a resource that increases and decreases as the user moves through an experience.

**The fundamental equation:**

**Psych = Motivation x Ability**

Every user interaction will either add or subtract Psych. This is the Net Perceived Value:

**NPV = Expected Utility - Expected Interaction Cost**

Or more simply:

**NPV = Motivation - Friction**

According to behavioral economics, the human brain constantly (and sometimes subconsciously) perceives an action's "net value" using this calculation. Every button, every word of copy, every loading screen, every form field, every image, and every micro-interaction contributes to either the Motivation side or the Friction side.

---

## The Video Game Analogy

Think of your customer as the **hero of a video game**, and their Psych Level as their **health bar**.

**Core principles:**

1. **Your job is to help them achieve THEIR quest** -- not just your business goals. If your business goal is "increase sign-ups" but the user's quest is "find a solution to their problem," your design should focus on helping them find the solution. Sign-ups happen as a byproduct of serving the quest.

2. **To keep their Psych up, you need to both motivate them AND minimize friction.** These are two separate actions, and both are equally important. A common mistake is focusing only on removing friction (making things easier) while neglecting motivation (making things feel worthwhile).

3. **If their Psych Level drops too much, it is game over** -- for them AND for you. "Game over" means the user abandons the experience: they close the tab, delete the app, switch to a competitor, or simply give up. There is no "respawn" in most product experiences.

4. **Different heroes have different starting health.** A user who arrives from an enthusiastic word-of-mouth recommendation starts with higher Psych than a user who clicks a random ad. The same screen can have very different Psych impacts depending on who is viewing it.

5. **The quest matters more than any individual battle.** Users will tolerate friction (battles) if they believe the quest (their goal) is worth it. But every battle drains health, so unnecessary battles are dangerous.

---

## Friction: Not Always Bad

**Friction = less ability.** This means that customers have to use MORE Psych to take action. But this is a nuanced point:

**Friction is harmful when:**
- It does not serve the user's goal (unnecessary complexity, confusing navigation, irrelevant questions)
- It appears at a moment when Psych is already low (asking for credit card details during a frustrating error recovery)
- It creates doubt about the product's competence or trustworthiness

**Friction is valuable ("good friction") when:**
- It aligns with the user's motivations (a personalization quiz that helps find the right product)
- It builds investment and commitment (setting up a profile that makes the product more useful)
- It provides a sense of progress or accomplishment (completing steps in a guided setup)
- It increases trust (identity verification that makes the user feel the platform is secure)

**Key insight:** Carefully adding valuable steps in a user experience can sometimes INCREASE the overall conversion rate, despite the slight extra time and effort required. This is because good friction can add more Motivation than the Ability it costs.

---

## Psych Numerical Precision

**Focus on the insights. Not the numbers.**

The goal of the Psych Framework is to put yourself in your customer's mind. Psych variations depend a lot on the Motivation and Ability of each individual user, so trying to calculate exact numbers is a fool's errand.

**What to focus on:**
- **Direction:** Is this element adding or subtracting Psych? (Most important)
- **Relative magnitude:** Is this a small bump/dip or a major spike/crater? (Important)
- **Sequence:** Does this friction come after a motivation boost or after another friction? (Important for running total)
- **Exact number:** Is this a -2 or a -3? (Least important -- do not agonize over this)

**Reference benchmarks are provided below** to help calibrate, but they are guidelines, not rules. Different user segments may experience the same element very differently.

---

## Psych Variation Benchmarks

### Negative Variations (Subtracting Psych)

| Variation | Meaning | Typical Examples |
|-----------|---------|-----------------|
| -1 | Minor friction | Small visual clutter, slightly unclear label, minor loading delay |
| -2 | Noticeable friction | Confusing navigation option, unexpected extra step, ambiguous copy |
| -3 | Significant friction | Required form with many fields, unclear pricing, broken expectation |
| -4 | Major friction | Error without clear recovery path, mandatory account creation for low-value action, misleading information |
| -5 | Severe friction | Data loss, trust violation, major broken feature, feels like a dead end |

### Positive Variations (Adding Psych)

| Variation | Meaning | Typical Examples |
|-----------|---------|-----------------|
| +1 | Minor motivation boost | Clean layout, clear label, subtle animation confirming action |
| +2 | Noticeable motivation | Relevant benefit clearly stated, progress indicator, helpful microcopy |
| +3 | Significant motivation | Strong social proof, compelling value proposition, price lower than expected |
| +4 | Major motivation | Personalized recommendation that feels accurate, "aha moment" where value clicks |
| +5 | Powerful motivation | Transformative benefit clearly demonstrated, emotional connection to the goal, surprise delight |

---

## Applying the Psych Framework: Step-by-Step

### 1. Choose a Screen or Flow to Analyze

Pick one screen or a short flow (3-5 screens maximum). The analysis works best when focused. If you have completed a BMap and/or 6P Story, pick the screen that corresponds to the key moment you identified.

Ideally, choose the screen you analyzed in the Behavior Map so that you have a deeper understanding of the events and context before and after that moment.

### 2. Determine the Customer's Arrival State

Before analyzing the screen itself, assess what state the customer is in when they arrive:

- **How did they get here?** (Search, ad, referral, direct navigation, deep link)
- **What do they already know?** (First-time visitor vs. returning user)
- **What are they expecting?** (Based on what sent them here)
- **What is their emotional state?** (Excited, neutral, frustrated, confused)
- **What is their starting Psych Level?** (This becomes the baseline)

### 3. Mark Key Reaction Points

Scan the screen as the customer would, following natural reading/scanning patterns. For web pages, this is typically an F-shaped pattern: top-left to top-right, then down the left side with occasional scans to the right.

For each element that triggers a psychological reaction, note:
- What the element is (headline, image, button, form field, error message)
- What the customer is likely thinking ("their inner monologue")
- Whether it adds or subtracts Psych

### 4. Assign Psych Variations

Using the benchmarks above as a reference, assign a number to each reaction point. Remember: direction and relative magnitude matter more than the exact number.

### 5. Calculate the Running Psych Level

Track the cumulative total:

```
Arrival Psych: [baseline]
After Step 1: [baseline + variation 1]
After Step 2: [baseline + variation 1 + variation 2]
...
Final Psych: [sum of all]
```

### 6. Identify the Critical Moments

From the running total, identify:

- **The Peak:** The highest Psych point. This is where the experience is strongest.
- **The Pit:** The lowest Psych point. This is where users are most at risk of abandoning.
- **The End:** The final Psych level. Combined with the peak, this determines how users remember the experience (Peak-End Rule).
- **Danger Zones:** Any point where the running total approaches zero or goes negative.

### 7. Generate Improvement Ideas

For each friction point (especially the biggest pit):
- Can the element be removed entirely?
- Can it be simplified?
- Can a motivating element be placed BEFORE it to build up Psych reserves?
- Can the information be delivered differently (progressive disclosure, defaults, visual hierarchy)?

For each motivation point (especially the peak):
- Can it be amplified?
- Can it be moved earlier in the experience to build reserves before friction hits?
- Can similar motivation be added at other points?

---

## Practice Example: Swimply Homepage Analysis

### Context

Swimply is a tech startup -- an "Airbnb for private pools." The team is working on onboarding. The goal is to increase the pool booking rate for new visitors arriving on the homepage.

**Customer research insights (most new visitors):**
- Find Swimply on hot days by searching "rent private swimming pool"
- Are guests (not hosts) who want to rent a pool near them the same day
- Wrongly expect $300+/day, and do not know they can rent hourly ($30+/hour)
- Have used Airbnb in the past but tend to mistrust new brands like Swimply

### Analysis Walkthrough

**Step 1: Arrival State**
The customer arrives from a Google search on a hot day. They are motivated (hot, want a pool) but skeptical (never heard of Swimply, expecting high prices). Starting Psych: moderate positive (motivated by heat, dragged down by unfamiliarity).

**Step 2: Scanning the page**
As the customer scans the homepage, each element they encounter either adds or subtracts Psych:

- **Hero image of a pool:** +2 (matches what they are looking for, creates desire)
- **Brand name "Swimply":** -1 (unfamiliar brand, slight trust concern)
- **Headline/value proposition:** Depends on clarity. A clear "Rent private pools by the hour from $30" would be +3 (addresses price misconception). A vague "Find your perfect swim" would be +1 at best.
- **Pricing visibility:** If hourly pricing is shown upfront: +3 (major positive surprise vs. expected $300/day). If pricing is hidden: -2 (frustration, cannot evaluate value).
- **Social proof / reviews:** +2 to +3 (reduces trust deficit from being an unknown brand)
- **Search/booking CTA:** If clear and simple: +1. If requires account creation first: -3 (major friction at a low-trust moment).

### Key Findings from this Example

1. **The price misconception is the biggest opportunity.** Showing "$30/hour" early dramatically increases Psych because it shatters the expected $300/day mental model.
2. **Trust is the biggest risk.** Users have an Airbnb mental model but mistrust new brands. Social proof, reviews, and familiar design patterns are critical.
3. **Timing matters.** These are same-day, heat-motivated users. Every second of friction reduces the likelihood of booking because the motivation is urgent and time-sensitive.

---

## Using Specific Empathy Questions (SEQs)

When the Psych Framework prompts the question "How do you really know what goes on in your customer's mind?", the answer is **Specific Empathy Questions (SEQs)**.

Unlike the General Empathy Questions (GEQs) used in Behavior Mapping, SEQs target specific screens or interactions:

- "What did you think when you first saw this screen?"
- "What were you looking for when you landed here?"
- "Was there anything confusing or unexpected?"
- "At what point did you feel most confident? Most uncertain?"
- "What would make you trust this page more?"
- "Was there a moment where you considered leaving? What triggered that?"

If SEQ data is available, use customers' actual reactions as the basis for Psych variation assignments rather than estimating.

---

## Connecting Psych to the Bigger Picture

### From BMap to Psych

The Behavior Map analyzes Motivation and Ability as separate axes. The Psych Framework collapses them into a single trackable resource. The BMap tells you WHERE the user stands (which zone, how far from the threshold). The Psych Framework tells you HOW the experience moves them moment by moment.

### From Psych to Journey Mapping

Psych variations at the screen level roll up into journey-level patterns. A sequence of screens each with net-positive Psych creates a rising journey. A sequence with deep Psych pits creates drop-off risk. The journey-level view (covered in Module 3 of the course) identifies the 5-6 moments that define the overall experience.

### From Psych to B.I.A.S.

Friction points identified through Psych analysis become candidates for the B.I.A.S. framework (Block, Interpret, Act, Store). The B.I.A.S. framework provides specific psychological principles for addressing each type of friction.

---

## Ethical Note

The Psych Framework should be used to help customers achieve their goals, not to manipulate them into behaviors that serve only the business. A high Psych Level should reflect genuine value delivery, not psychological tricks that mask a poor product.

If your Psych analysis shows high motivation from deceptive patterns (fake scarcity, hidden fees revealed late, dark patterns), the Psych Level is artificially inflated and will collapse when users discover the deception -- leading to negative reviews, refund requests, and destroyed trust.

Sustainable Psych comes from genuine value alignment: the user's quest and your product's capabilities honestly match.
