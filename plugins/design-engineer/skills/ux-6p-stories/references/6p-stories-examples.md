# 6P Stories -- Examples and Patterns

This reference contains examples of good and bad 6P Stories, adapted from real product case studies. Use these patterns to evaluate and improve 6P Stories.

---

## Example: Airbnb Guest First Arrival Experience

### Context

A product team working on Airbnb's post-booking experience needs to improve the guest's first arrival at a listing. The hero is a traveler arriving at their Airbnb for the first time.

### Bad Example Pattern #1: Too Product-Focused

```
Panel 1: User opens the Airbnb app
Panel 2: User reads the listing details
Panel 3: User checks the address on the map
Panel 4: User follows GPS directions
Panel 5: User finds the lockbox code in messages
Panel 6: User enters the apartment
```

**Why this fails:**
- Every panel describes an app interaction, not a human experience
- There is zero emotion -- no excitement, no anxiety, no relief
- The story is about the PRODUCT, not the CUSTOMER
- You cannot empathize with someone who is just tapping on screens
- No struggles are shown -- it looks like everything goes perfectly
- No improvement opportunities are visible because no friction is depicted

### Bad Example Pattern #2: Too Abstract / No Specifics

```
Panel 1: Person is happy about their trip
Panel 2: Person travels to destination
Panel 3: Person looks for the place
Panel 4: Person has some trouble
Panel 5: Person figures it out
Panel 6: Person is happy they arrived
```

**Why this fails:**
- Vague descriptions that could apply to literally any travel experience
- "Has some trouble" and "figures it out" contain no specific insight
- No emotional specificity -- just generic "happy" and "trouble"
- Impossible to identify concrete improvement opportunities
- The story does not teach you anything about what the customer actually goes through

### Good Example Pattern: Customer-Centered with Emotional Arc

```
Panel 1: Landing at destination
"Whew... that was a long flight..."
[Customer looks tired, dragging luggage through airport]

Panel 2: Getting to Airbnb listing
"Can't wait to arrive and unwind."
[Customer in taxi, looking at phone with anticipation]

Panel 3: Checking in
"Hmm... where's that Airbnb key lockbox again?"
[Customer standing at door, confused, looking around anxiously]

Panel 4: First tour of listing
"Oooh, nice spot! I wonder where I could walk out in the area."
[Customer inside, looking around with pleasant surprise]

Panel 5: Exploring around
"I love this neighborhood!"
[Customer walking around the neighborhood, smiling, discovering local spots]

Panel 6: First night
"Time for bed! I'll visit some more tomorrow!"
[Customer relaxed, settling in contentedly]
```

**Why this works:**
- **Starts with empathy** -- We feel the customer's fatigue, anticipation, confusion, and relief
- **Captures emotions** -- Clear emotional arc: tired > anticipating > confused/anxious > pleasantly surprised > delighted > content
- **Focuses on actions** -- Real-life context (airport, taxi, standing at door, walking neighborhood), not app screens
- **Highlights struggles** -- Panel 3 shows genuine friction (cannot find the lockbox). This is where the emotional dip happens and where improvement opportunities live.
- **Reveals improvement opportunities** -- The transition from Panel 2 to Panel 3 raises obvious questions: Could arrival instructions be clearer? Could there be a photo of the lockbox location? Could check-in be made easier?

---

## Pattern Analysis: What Makes a Story Good or Bad

### Common Mistakes to Avoid

**1. The Screenshot Walkthrough**
Describing what happens on each screen instead of what happens in the customer's life. If every panel could be replaced with a screenshot, the story is too product-focused.

**How to fix:** For each panel, ask "What is the customer DOING and FEELING right now in real life?" not "What screen are they looking at?"

**2. The Flat Emotional Line**
All panels have the same emotional tone (usually neutral or mildly positive). No tension, no struggle, no rollercoaster.

**How to fix:** Identify the lowest emotional point in the real experience and make sure at least one panel captures it honestly. If the customer never struggles in your story, you are not telling the truth.

**3. The Feature Demo**
The story exists to show off the product's features rather than to understand the customer's needs.

**How to fix:** Remove your product from the story entirely. Does the problem and the customer's journey still make sense? The story should work even WITHOUT your product -- that proves it is focused on the customer.

**4. The Happy Path Only**
Everything goes smoothly from start to finish. No obstacles, no confusion, no friction.

**How to fix:** Think about what goes wrong in real life. Ask customer support what the most common complaints are. Look at where users drop off in your analytics. Real journeys are messy.

**5. The Scope Creep**
Trying to cover the entire customer lifecycle in 6 panels, resulting in enormous jumps between panels that lose all emotional detail.

**How to fix:** Narrow the scope. Pick ONE specific experience (first booking, first delivery, first negative review) and tell that story in depth.

### Indicators of a Strong 6P Story

1. **You feel something** when you read it -- empathy, concern, frustration, relief
2. **The struggle is specific** -- not "user has trouble" but "user stands at door in the rain, can't find the lockbox"
3. **At least one clear improvement opportunity** jumps out without needing analysis
4. **A non-designer could understand it** -- the story is accessible to engineers, executives, support staff
5. **The hero is a person**, not a user -- they have a context, a life, emotions beyond your product
6. **The emotional arc has at least one dip** -- things get worse before they get better

---

## Applying Examples During Review

When reviewing a user's 6P Story, compare it against these patterns:

**If the story resembles Bad Pattern #1 (too product-focused):**
- Ask: "What is the customer doing in real life at this moment, outside of the app?"
- Ask: "How does the customer FEEL at this point? Excited? Anxious? Bored?"
- Suggest replacing screen descriptions with real-life context

**If the story resembles Bad Pattern #2 (too abstract):**
- Ask: "Can you be more specific? What EXACTLY goes wrong?"
- Ask: "What would this look like if you were filming a movie of this moment?"
- Suggest adding concrete details from customer research or reasonable assumptions

**If the story matches the Good Pattern:**
- Confirm which best practices it meets
- Focus feedback on the weakest of the 5 best practices (empathy, emotions, actions, struggles, opportunities)
- Ask the user to identify the single biggest improvement opportunity revealed by the story

---

## Adapting for Different Product Types

### B2B / SaaS Products
The hero is still a PERSON, not a company. Pick one specific user (e.g., "the project manager who needs to create a report for Monday's meeting") and tell their story. B2B products often have richer struggle panels because the stakes (job performance, team coordination, deadlines) are higher.

### Consumer Apps
Focus on the moment of need -- what triggers the customer to reach for your product? The context before they even open the app is often the most revealing panel.

### Physical Products / Services
The blend of digital and physical interactions creates natural friction points that make excellent story material. Show the customer in both worlds.

### Developer Tools
The hero is a developer with a specific technical problem. The emotions are real: frustration with broken builds, relief when tests pass, anxiety about deploying to production. Avoid making the story about code -- make it about the developer's experience.
