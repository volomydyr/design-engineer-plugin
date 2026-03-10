# Big Idea Validation Transcript (With Skill)

**Date**: 2026-03-10
**Project**: Coworking-friendly cafe finder for remote workers
**Skill loaded**: ux-big-idea

---

## Step 1: Determine Starting Point

Asked the user where they are with this idea using the skill's starting-point assessment. User has a formed concept but uncertainty about whether the problem is real. Classified as "Has an idea, needs validation."

---

## Step 2: Structured Validation Questions

Walked through the skill's validation question set:

1. **Who exactly feels this pain?** Remote workers who split time between home and cafes -- specifically digital nomads, freelancers, and hybrid employees on their non-office days.
2. **How do they solve it today?** Google Maps reviews (unreliable for real-time data), word of mouth, trial and error, dedicated coworking spaces (expensive).
3. **What's the frequency?** 3-5 times per week for regular cafe workers. High-frequency problem.
4. **What's the cost of the current solution?** Time wasted arriving at unsuitable cafes (avg 20-30 min), paying for coworking spaces ($200-500/month to avoid the hassle), lost productivity.
5. **Would they pay to solve it?** Likely yes if price is below coworking space cost. Even $5-10/month removes friction.

---

## Step 3: Viability Assessment

Applied the skill's viability criteria:
- **Problem severity**: Medium-high. It is a real inconvenience but not life-critical.
- **Market size**: Large. Remote work is growing; 35%+ of knowledge workers are hybrid/remote.
- **Competition**: Google Maps covers basic cafe info but lacks real-time workspace data. No dominant player in the "cafe as workspace" niche.
- **Data moat**: The real-time data (WiFi speed, seat availability, noise) is hard to collect and creates a competitive advantage if solved.

---

## Step 4: Risk Identification

Identified key risks using the skill's risk framework:
1. **Data collection chicken-and-egg**: Need users to report data, but users need data to find value. Cold start problem.
2. **Google Maps competition**: Google could add workspace-specific filters at any time.
3. **Real-time accuracy**: Seat availability changes by the minute. How stale can data be before it's useless?
4. **Cafe owner resistance**: Some cafes actively discourage remote workers (buy one coffee, sit for 8 hours).

---

## Step 5: Concept Refinement

Refined the concept based on validation findings:
- **Pivot suggestion**: Focus on "cafe-office scores" rather than real-time data initially. A curated rating system is more achievable than real-time tracking.
- **Niche down**: Target freelancers in top 10 remote-work cities first rather than going global.
- **Revenue angle**: Partner with cafe-friendly spaces for featured listings.

---

## Step 6: Deliverable Creation

Created `docs/design/foundation/big-idea.md` with:
- One-line concept statement
- Problem validation summary
- Viability scorecard
- Risk register with mitigation strategies
- Refined concept description
- Next steps (proceed to Problem Statement)

Updated `.dependencies.yaml` to mark `big-idea` as `completed`.

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/design/foundation/big-idea.md` | Structured Big Idea validation deliverable |
| `.dependencies.yaml` | Updated dependency status |
