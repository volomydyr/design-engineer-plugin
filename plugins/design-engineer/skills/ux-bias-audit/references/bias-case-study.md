# Bias Audit Case Study: DoorDash DashPass Prompt Redesign

This case study walks through a complete bias audit application on a real product screen – the DoorDash DashPass subscription prompt. It demonstrates how each step builds on the previous one, transforming a screen that the brain filters almost entirely into one that guides users smoothly toward a decision.

---

## Context

DoorDash is a food delivery service. A user opens the app to order food and receives a prompt encouraging them to try DashPass, the company's subscription delivery service.

**The problem**: The user's brain filtered most of the original screen. The prompt failed to communicate its value and felt like an interruption rather than a helpful offer.

**The approach**: Apply each bias audit step sequentially, improving one layer at a time, to demonstrate how the process transforms a single screen from being ignored to being effective.

---

## Step 1: Identify Redesign

### What was wrong with the original

The original DashPass prompt triggered multiple filtering mechanisms:
- **High-Effort**: The title was long and hard to scan. Sentences were dense and required careful reading. The overall visual density made the screen feel like work.
- **Attention-Grabbing Color Overuse**: Alarming colors (bright red/orange) were used heavily, which paradoxically made important elements compete with each other instead of standing out.

### What changed

The Identify redesign focused purely on making the screen passable by the brain's initial filters:

1. **Shorter title for better scanning** – The title was reduced to fewer words so the brain could process it in a single glance (reducing high-effort filtering).
2. **Smaller sentences for better reading** – Long explanatory paragraphs were broken into shorter, scannable sentences (reducing cognitive effort).
3. **Less alarming color** – The aggressive color scheme was toned down to reduce attention-grabbing noise, allowing the important elements to stand out through contrast rather than volume.

### Key insight

This first step is not about making the screen "persuasive" – it is about making it *visible*. A screen that gets filtered never gets a chance to persuade. The Identify redesign simply ensures the brain does not dismiss the content before processing it.

**Note**: This is just the first step of the process. The screen will go through 3 more iterations. It is not a final redesign.

---

## Step 2: Analyze Redesign

### What was wrong after Identify

After the Identify redesign, the screen was no longer dismissed outright. But the information presented did not help users quickly understand the value proposition. The message was about the DashPass product rather than about the user's benefit.

### What changed

The Analyze redesign was a significant shift from the original prompt. The objective was to show upfront the biggest benefit of trying DashPass:

1. **Led with benefits** – Instead of describing what DashPass is, the redesign showed what the user gets: saving money. The primary message became about the user's benefit, not the product's features.
2. **Reframed the value proposition** – Rather than "Try DashPass, our delivery subscription," the message was reframed around what users actually care about: how much money they save on delivery fees.
3. **Anchoring** – By showing the amount already saved or the potential savings, users have a concrete reference point that makes the subscription cost feel small in comparison.

### Key insight

The power of re-framing cannot be overstated. The exact same product (DashPass subscription) can feel like an unwanted upsell or a money-saving opportunity depending entirely on how the message is framed. Different interpretations of a screen can drastically influence conversions or behaviors – even just a few words of re-framing can make a massive difference.

**Alternative approaches**: Other Analyze principles could also work here. For example, Loss Aversion – showing how much money the user has *lost* in delivery fees over the past month – could be equally or more effective.

---

## Step 3: Design Redesign

### The challenge

Since this is a single screen (not a multi-step flow), there was limited opportunity to "reduce friction" in the traditional sense (removing steps, splitting forms, etc.). The friction-reduction approach would involve splitting the prompt into multiple steps and using Commitment & Consistency – but for this exercise, the focus was on nudges.

### What changed

The Design redesign added a single, carefully placed nudge:

1. **Social Proof** – A simple statement showing that the user is not the only one benefiting from DashPass. Something like showing the number of active subscribers or savings achieved by other users.

### What did NOT change

Importantly, very little was added. The redesign resisted the temptation to pile on multiple nudges.

### Key insight

Nudges must be used carefully to avoid Reactance. In this case, only Social Proof was used – a single, subtle reassurance that others have made the same choice and benefited from it.

This restraint is critical. Adding Social Proof AND Scarcity AND a Curiosity Gap to the same screen would feel manipulative and trigger the exact Reactance that destroys trust. The best nudges feel like helpful information, not pressure.

---

## Step 4: Document Redesign

### What happens after the action

The Document step considers what happens *after* someone taps "Try DashPass for 1 month." What should the user experience once they have committed?

### What changed

The Document redesign combined two principles to maximize positive storage after the subscription action:

1. **Reassurance** – The confirmation screen was designed to make people feel like they made a good decision. Rather than a generic "Success!" message, the screen reinforced the specific benefits the user just secured, validating their choice.
2. **Caring** – The redesign offered free monthly reports to ensure the user always knows if they are getting the most out of the service. This demonstrates that DoorDash cares about the user's ongoing experience, not just the initial conversion.

### Key insight

These two principles combined are crucial to making the user realize this was a "no-brainer" decision (and it genuinely is, if used properly). Reassurance eliminates post-decision doubt, while the caring element (monthly reports) creates an ongoing relationship that stores positive motivation over time.

The Document step transforms a one-time conversion into the beginning of a positive habit loop. Each monthly report reinforces the value, which makes the user more receptive in future audit cycles.

---

## Full Transformation Summary

| Step | Focus | Primary Change | Principle Used |
|------|-------|---------------|----------------|
| **Identify** | Make it visible | Reduced visual noise, shorter text, calmer colors | Hick's Law, reduce high-effort |
| **Analyze** | Make it understandable | Led with savings benefit, reframed value | Benefits, Anchoring |
| **Design** | Make them decide | Added social proof for hesitating users | Social Proof |
| **Document** | Make it memorable | Reassured decision, offered ongoing value | Reassurance, Caring |

---

## Lessons from This Case Study

### 1. Each step builds on the previous one
You cannot Analyze what you have filtered out in Identify. You cannot Design on what you have not Analyzed. And you cannot Document what you did not Design on. The sequence matters.

### 2. Restraint is a feature
At every step, the redesign did the minimum necessary. Not every principle needs to be applied to every screen. Choose the one or two that address the biggest gap.

### 3. Small changes, big impact
The final redesign looks dramatically different from the original, but each individual step was a modest change. The cumulative effect of four focused improvements is much greater than one dramatic overhaul.

### 4. There are hundreds of good answers
The solutions shown here are not the only correct ones. Different Analyze principles (Loss Aversion instead of Benefits), different nudges (Curiosity Gap instead of Social Proof), or different Document tactics (Delighters instead of Caring) could all produce effective results. The process provides structure, not a single right answer.

### 5. Real-world testing matters
The redesigns look promising, but real validation happens through testing with actual users. The process gives you informed hypotheses, not guaranteed outcomes. "It is when you start testing in the real world that the magic happens."

---

## Applying This to Your Own Product

To run the same process on your own product:

1. **Choose one screen** that needs improvement the most
2. **Identify**: Put yourself in the user's shoes. What do you see first? What gets filtered? Why?
3. **Analyze**: Is the message framed around user benefits? Is there a clear reference point?
4. **Design**: How many decisions does the screen require? Can you reduce friction? Does a single nudge help?
5. **Document**: What happens after the action? Does the user feel reassured, cared for, and confident?
6. **Test**: Validate your redesign with real users

The bias audit process can literally be used for any experience – digital or in real life. The brain works the same way regardless of the medium.
