# Journey Case Study: Brave Browser Onboarding

This case study walks through the journey mapping and improvement process using the Brave Browser onboarding experience.

---

## Context

Brave is a privacy-focused web browser that blocks ads and trackers. The onboarding experience takes a new user from discovering Brave on the website to having it set up and running on their device.

The core value proposition: faster browsing, fewer ads, and better privacy. The user's motivation is a desire for a better browsing experience without the annoyances of traditional browsers.

---

## Step 1: Mapping the Journey

The Brave onboarding journey was distilled to its top 5-6 key moments. Instead of documenting every screen and click, the focus was on the moments that represent real emotional shifts.

### The Key Moments

| # | Moment | Element Type | Delight Level | Description |
|---|--------|-------------|---------------|-------------|
| 1 | Landing on Brave website | Transition | Medium | The user arrives, likely from a recommendation or search. Marks the start of the journey. Curiosity is present but commitment is low. |
| 2 | Deciding to download | Transition | Medium | The user makes the first real commitment: going from passive browsing to actively downloading. This is a significant milestone. |
| 3 | Default browser prompt | Drop / Pit | Negative | Immediately after install, Brave asks the user to change their default browser -- before the user has even tried the product. Combined with the perception of needing to manually import bookmarks, psych drops sharply. |
| 4 | Bookmark import completing | Jump | Medium-High | The import happens quickly and automatically. Relief and positive surprise that it was not the painful manual process the user feared. |
| 5 | Homepage with stats | Peak | High | The dashboard shows ads blocked, trackers blocked, and time saved. Concrete, visual proof that Brave delivers on its promise. This is the "aha moment." |
| 6 | First browsing session | Transition | Medium-High | The user starts browsing normally. Marks the transition from "setup" to "daily use." |

### The Emotional Arc

The journey starts at a medium psych level (curiosity), maintains through the download decision, then drops sharply at the default browser prompt (Pit). The import completion provides a Jump back up, and the homepage dashboard delivers the Peak. The journey ends on a positive note with the first browsing session.

---

## Step 2: Identifying Improvement Opportunities

Using the 4 improvement tactics, three specific opportunities were identified:

### Improvement 1: Mark the First Transition

**Tactic applied**: Mark the Transition

**The problem**: Going from browsing a website passively to deciding to download an app is a big commitment. In the original experience, this transition was not acknowledged -- it was just another click.

**The redesign**: The download step was redesigned to explicitly mark this milestone. The user sees clear acknowledgment that they are making a meaningful choice, with a preview of what to expect next. The Transition feels intentional rather than incidental.

**Why it works**: When users cross a threshold of commitment, acknowledging that moment builds psych. It signals "you are making progress" and primes the user for the next steps. An unacknowledged transition feels like the product does not care about the user's decision.

### Improvement 2: Fill the Pit

**Tactic applied**: Fill the Biggest Pit

**The problem**: The Pit occurred at the default browser prompt for two reasons:
1. The user was asked to change their default browser before they could even try Brave -- the commitment was too high for the psych level at that moment
2. The user feared having to manually import hundreds of bookmarks -- a perception of high effort

**The redesign**: The import process was made highly visible and fast. Instead of the user worrying about whether their bookmarks would survive, the redesign showed the import happening in real-time, with clear feedback about what was being imported and how quickly it was completing. The untimely default browser prompt was addressed so the user could first experience value before being asked for that commitment.

**Why it works**: The Pit was caused by asking for too much commitment (change defaults, import bookmarks) at a moment when the user had received zero value from the product. By making the import process visible and fast, the perceived effort dropped dramatically. By moving the default browser question to after the user has experienced value, the request becomes reasonable rather than presumptuous.

### Improvement 3: Reorder to Elevate the Peak

**Tactic applied**: Reorder Important Steps

**The idea**: Bring the powerful homepage dashboard (with ad blocking stats and performance metrics) as the very first step in the onboarding. This way:

1. The user sees concrete benefits right from the start, even before completing setup
2. They get a preview of what those stats look like after extended use (more impressive numbers that build anticipation)
3. They are primed for the next steps (importing bookmarks, adjusting settings) because they have already seen the payoff

**Why it works**: Hyperbolic Discounting tells us that people prefer smaller, immediate rewards. By showing the dashboard first (even with initial data), you deliver an immediate reward that builds psych before asking the user to invest effort in setup steps. The user thinks "this is what I am working toward" rather than "when will this setup end?"

---

## Key Takeaways

### 1. Focus on 5-6 moments, not every screen

The Brave onboarding has many screens. But when distilled to 5-6 key moments, the emotional arc becomes clear and actionable. A cluttered journey map with every screen transition would obscure the critical patterns.

### 2. The Pit is often about timing, not content

The default browser prompt and bookmark import are not inherently bad features. The problem was timing -- they appeared before the user had received any value. The same requests after the user has experienced the dashboard would feel reasonable.

### 3. Reordering can be more powerful than redesigning

The idea of moving the dashboard earlier did not require building anything new. It just required changing the sequence. Sometimes the most impactful improvement is rearranging what already exists.

### 4. The Peak-End Rule drives memory

The Brave onboarding ends on the homepage dashboard -- a strong positive moment. Because of the Peak-End Rule, users remember this ending more than the friction in the middle. If the journey ended on the settings page instead, the overall memory would be significantly worse, even though the actual content is identical.

### 5. Mark what matters

The download decision is a significant milestone, but in many products, milestones like this go unacknowledged. Explicitly marking the Transition builds psych and makes the user feel that the product respects their decision.

---

## Applying This to Your Product

When mapping your own journey:

1. Map what is really happening to your customers right now (not the ideal scenario from your 6P Story)
2. Identify the 5-6 key moments using the 5 element types
3. Look for the same patterns: Where is the Pit? Is it a timing issue? Could reordering fix it?
4. Compare the current journey with the ideal one from your 6P Story to identify the biggest gaps
5. Write down your top 3 improvement ideas, then explore 1 in detail
