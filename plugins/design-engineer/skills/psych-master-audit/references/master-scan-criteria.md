# Master Scan Criteria

Quick-scan checklist for the psychology master audit. For each of the 10 sections, this file lists the top principles most universally applicable to any design, what positive patterns to look for (opportunities), what anti-patterns to detect (violations), and severity classification guidance.

---

## Section 1: Fundamentals of Cognitive Interaction (Laws 1-10)

**Quick-Scan Principles:**

### Law 1: Cognitive Load
- **Look for (positive)**: Complex forms broken into steps, related elements grouped together, familiar design patterns used, visual hierarchy guides scanning, primary and secondary navigation separated
- **Look for (violation)**: Information overload on a single screen, too many unrelated elements competing for attention, no grouping or separation, user must process everything at once, 20+ columns in a table with no prioritization
- **Severity**: HIGH if primary flows require processing excessive information simultaneously

### Law 2: Hick's Law
- **Look for (positive)**: Options limited and grouped into logical categories (5-7 per group), navigation menus concise, registration forms broken into simple steps
- **Look for (violation)**: 50+ items presented at once without grouping, menus with 15+ items at the same level, overwhelming number of simultaneous choices
- **Severity**: HIGH if decision paralysis is likely on a primary conversion path

### Law 4: Miller's Law
- **Look for (positive)**: Important information grouped in chunks of 5-9 elements, phone numbers grouped by digits, process steps limited to a manageable count
- **Look for (violation)**: Lists exceeding 9 items without sub-grouping, navigation with 12+ ungrouped items, dense data without chunking
- **Severity**: MEDIUM -- users can still function but retention and comprehension suffer

### Law 8: Visual Hierarchy
- **Look for (positive)**: Clear size/color/contrast differentiation between primary and secondary elements, main headings and CTAs visually dominant, secondary information visually recessive
- **Look for (violation)**: Everything looks the same importance, CTAs do not stand out, competing visual weights across unrelated elements, no clear entry point for the eye
- **Severity**: HIGH if users cannot identify the primary action or most important content

### Law 10: Discoverability
- **Look for (positive)**: Interactive elements visually distinct from static content, clear affordances, standard interaction patterns, tooltips for new features, user never guesses how to do something
- **Look for (violation)**: Hidden actions, clickable elements that look like static text, gesture-only interactions with no visible cues, important features buried in menus
- **Severity**: HIGH if critical functions are not discoverable

---

## Section 2: Visual Perception and Attention Focus (Laws 11-20)

**Quick-Scan Principles:**

### Law 11: Selective Attention
- **Look for (positive)**: Important elements highlighted at the right time and place, form errors shown next to the problematic field, notifications shown after the user completes their current task
- **Look for (violation)**: Critical information displayed at wrong times (e.g., during another task), error messages far from the relevant field, important alerts competing with primary content
- **Severity**: HIGH if important feedback is missed due to poor timing or placement

### Law 12: Banner Blindness
- **Look for (positive)**: Important system messages integrated into main content flow, subtle visual accents for critical information, avoidance of ad-like formatting for functional content
- **Look for (violation)**: Important information formatted as large colorful banners at the top of the page, system messages that visually resemble ads, critical alerts styled as promotional material
- **Severity**: MEDIUM -- users will miss important information but can still complete tasks

### Law 14: Von Restorff Effect
- **Look for (positive)**: CTAs visually distinct from surrounding elements, recommended pricing plan highlighted, key data points in tables emphasized, important messages stand out
- **Look for (violation)**: No visual differentiation for the most important element, everything highlighted (effect lost), CTAs that blend into surrounding content
- **Severity**: MEDIUM if conversion elements fail to stand out; HIGH on pricing or selection pages

### Law 15: Contrast
- **Look for (positive)**: Sufficient color contrast for readability, action buttons brighter than surrounding elements, clear distinction between interactive and static elements, accessible for visual impairments
- **Look for (violation)**: Low contrast text, buttons that blend into backgrounds, insufficient distinction between active and inactive states, contrast that fails accessibility standards
- **Severity**: HIGH if contrast issues affect readability or accessibility compliance

### Law 19: Serial Position Effect
- **Look for (positive)**: Most important items placed at the beginning or end of lists and navigation, secondary items in the middle, visual pauses in long lists to create multiple anchoring points
- **Look for (violation)**: Critical navigation items buried in the middle, most important option not first or last, long flat lists with no visual breaks
- **Severity**: LOW -- affects optimization, not usability

---

## Section 3: Psychology of Decision-Making (Laws 21-30)

**Quick-Scan Principles:**

### Law 21: Loss Aversion
- **Look for (positive)**: Messaging that highlights what users will lose by not acting (done ethically), urgency communicated for genuine limited offers, benefits framed in terms of what users keep or protect
- **Look for (violation)**: No urgency or motivation on conversion pages, purely feature-based messaging with no loss framing, OR excessive/manipulative scarcity pressure
- **Severity**: MEDIUM -- affects conversion but not usability

### Law 25: Default Bias
- **Look for (positive)**: Smart defaults that match the majority use case, pre-selected options that serve the user's interest, default settings that simplify the experience
- **Look for (violation)**: No defaults provided (forcing unnecessary decisions), defaults that serve the business at the user's expense (dark patterns), pre-checked options for upsells or marketing consent
- **Severity**: HIGH if defaults actively harm user interests; MEDIUM if defaults are simply absent

### Law 27: Social Proof
- **Look for (positive)**: Real reviews, ratings, user counts, activity indicators, testimonials from relevant audience segments, specific numbers rather than vague claims
- **Look for (violation)**: No social proof on decision-critical pages, fake or vague social proof ("thousands of happy customers" with no specifics), social proof from irrelevant audiences
- **Severity**: MEDIUM -- significant on purchase/signup pages, lower elsewhere

### Law 29: Framing
- **Look for (positive)**: Information presented in the most meaningful context, positive framing for benefits ("8 out of 10 users see improvement"), comparisons that help users understand value
- **Look for (violation)**: Confusing or negative framing of positive features, raw data without context, manipulative framing that misrepresents the product
- **Severity**: LOW for missed opportunities; HIGH if current framing actively misleads

### Law 30: Availability Heuristic
- **Look for (positive)**: Familiar metaphors and icons (shopping cart, magnifying glass for search), patterns from real life or common digital products, intuitive associations
- **Look for (violation)**: Unfamiliar icons or terminology, novel interaction patterns without explanation, abstract concepts where familiar analogies exist
- **Severity**: MEDIUM if unfamiliar patterns slow down users on key flows

---

## Section 4: Engagement and Motivation (Laws 31-40)

**Quick-Scan Principles:**

### Law 31: Flow State
- **Look for (positive)**: Smooth transitions between screens and actions, predictable interface behavior, absence of friction points during multi-step processes, no unexpected interruptions during focused tasks
- **Look for (violation)**: Popups that interrupt form filling, unexpected page reloads, forced detours during checkout or onboarding, jarring transitions between states
- **Severity**: HIGH if interruptions occur during primary conversion or creation flows

### Law 33: Goal Gradient Effect
- **Look for (positive)**: Progress bars or step indicators in multi-step processes, clear indication of how far the user has come and how far they have to go, tasks divided into visible smaller steps
- **Look for (violation)**: Multi-step processes with no progress indication, forms with no step count, long processes where users cannot gauge completion
- **Severity**: MEDIUM -- affects completion rates on longer flows

### Law 35: Aha! Moment
- **Look for (positive)**: Quick path to core value in onboarding, first meaningful interaction happens early, the user understands "why this product" within the first few steps
- **Look for (violation)**: Long onboarding before any value is delivered, no clear moment where the product's value clicks, excessive setup before the first meaningful action
- **Severity**: HIGH for products with onboarding flows -- directly impacts activation

### Law 39: Zeigarnik Effect
- **Look for (positive)**: Incomplete tasks are visually indicated, users can see what they have not finished, progress is saved and visible on return, checklists show completion state
- **Look for (violation)**: No indication of incomplete tasks, lost progress when users return, no visual reminder of where they left off
- **Severity**: MEDIUM -- affects return engagement

### Law 40: Feedback Loop
- **Look for (positive)**: Every user action receives clear feedback (visual change, sound, message), loading indicators, error messages appear immediately, button states change on interaction
- **Look for (violation)**: Buttons with no visual response to clicks, no loading indicators, delayed or missing error feedback, actions that complete silently with no confirmation
- **Severity**: HIGH if missing feedback causes user confusion about whether actions succeeded

---

## Section 5: Emotional Design (Laws 41-50)

**Quick-Scan Principles:**

### Law 41: Peak-End Rule
- **Look for (positive)**: Positive peak moments designed into the experience (celebration screens, success animations), strong positive endings (thank-you pages, confirmation experiences), emotional highlights at key milestones
- **Look for (violation)**: Flat, emotionless experiences with no memorable moments, weak endings (generic "Done" text after purchase), negative peaks (frustrating errors) as the most memorable moments
- **Severity**: MEDIUM -- affects brand perception and retention more than immediate usability

### Law 44: Labor Illusion
- **Look for (positive)**: Loading states that show system activity (specific process steps, progress indicators), meaningful messages during wait times, intermediate stages visible during data processing
- **Look for (violation)**: Plain spinners with no context, instant results for complex operations that users may distrust, no feedback during operations longer than 2 seconds
- **Severity**: LOW for most interfaces; MEDIUM for search, comparison, or analysis features

### Law 45: IKEA Effect
- **Look for (positive)**: Customization and personalization options, user-created content or configurations, workspace or profile personalization that increases ownership
- **Look for (violation)**: Rigid, non-customizable experiences where personalization would increase value, no way for users to make the product "theirs"
- **Severity**: LOW -- enhancement opportunity, not a usability issue

### Law 50: Feedforward
- **Look for (positive)**: Previews of action results before committing (hover previews, live previews in editors), clear indication of what will happen when a button is pressed, preview states for destructive actions
- **Look for (violation)**: Destructive actions with no preview or confirmation, buttons with unclear outcomes, settings changes with no preview of effect
- **Severity**: HIGH for destructive or irreversible actions; LOW for general interactions

---

## Section 6: Efficiency Principles (Laws 51-60)

**Quick-Scan Principles:**

### Law 51: Tesler's Law
- **Look for (positive)**: Complexity absorbed by the system (autofill, smart defaults, auto-detection), appropriate balance between automated and manual actions, complex backend work that simplifies the user-facing experience
- **Look for (violation)**: Users forced to handle complexity the system could resolve, manual data entry where autofill is possible, technical details exposed unnecessarily
- **Severity**: MEDIUM -- increases task time and cognitive load

### Law 52: Signifiers
- **Look for (positive)**: Visual cues that indicate interactivity (underlines on links, shadows on buttons, cursor changes on hover), clear affordances on all interactive elements, consistent signifier patterns
- **Look for (violation)**: Interactive elements with no visual cues, flat designs where buttons look like labels, inconsistent signifier patterns (some links underlined, others not)
- **Severity**: HIGH if users cannot distinguish interactive from static elements

### Law 54: Occam's Razor
- **Look for (positive)**: Simplest possible path to goal, minimal steps in flows, no decorative elements without function, forms that ask only necessary data
- **Look for (violation)**: Unnecessary steps in flows, decorative complexity that adds no value, fields in forms that are not needed, overly complex filter systems where simple search would suffice
- **Severity**: MEDIUM -- each unnecessary step reduces completion rates

### Law 56: Exit Points
- **Look for (positive)**: Clear close/cancel/back buttons on every modal and process, ability to exit multi-step flows without losing progress, Escape key support, visible return paths
- **Look for (violation)**: Modals without close buttons, multi-step processes with no back or cancel option, forced completion of processes with no exit, unclear how to return to a previous state
- **Severity**: HIGH if users feel trapped in a process

---

## Section 7: Behavioral Economics (Laws 61-70)

**Quick-Scan Principles:**

### Law 61: Decoy Effect
- **Look for (positive)**: Pricing pages with a strategically positioned middle option that makes the target option look more attractive, option comparison that naturally guides toward the best value
- **Look for (violation)**: Pricing options that are confusingly similar, no clear "best value" option, equal visual weight on all pricing tiers
- **Severity**: LOW -- optimization opportunity, not a usability issue

### Law 65: Pareto Principle
- **Look for (positive)**: The 20% of features that provide 80% of value are prominently accessible, key functions are not buried alongside rarely used features, interface prioritizes frequent actions
- **Look for (violation)**: All features given equal prominence, frequently used actions buried alongside rarely used ones, feature bloat with no prioritization
- **Severity**: MEDIUM -- affects efficiency and discoverability of key functions

### Law 66: Commitment & Consistency
- **Look for (positive)**: Gradual engagement ladder (free trial, then basic, then premium), small commitments before big asks, onboarding that builds investment step by step
- **Look for (violation)**: Asking for large commitments upfront (create account before seeing value), no gradual engagement path, immediate paywall with no trial or preview
- **Severity**: HIGH on signup and conversion flows -- directly impacts activation

### Law 67: Reciprocity
- **Look for (positive)**: Value delivered before asking for commitment (free content, useful tools, helpful information), genuine value in free tier, helpful resources offered before registration gates
- **Look for (violation)**: Asking for personal information before delivering any value, registration wall before any content preview, no free resources or samples
- **Severity**: MEDIUM -- affects conversion and trust

---

## Section 8: Social Influence (Laws 71-80)

**Quick-Scan Principles:**

### Law 71: Bandwagon Effect
- **Look for (positive)**: Popularity indicators (bestseller badges, user counts, trending labels), real usage statistics, current activity indicators
- **Look for (violation)**: No indication of what is popular or widely used, OR exaggerated/fake popularity claims that feel manipulative
- **Severity**: LOW for informational sites; MEDIUM for e-commerce and marketplace products

### Law 73: Group Attractiveness Effect
- **Look for (positive)**: Related elements grouped into meaningful sets that reinforce each other, dashboard metrics grouped by data type, settings divided into logical blocks, spacing/borders/backgrounds creating clear groupings
- **Look for (violation)**: Related items scattered across the interface, no meaningful grouping of related content, elements that should be together are separated
- **Severity**: MEDIUM -- affects comprehension and scanning efficiency

### Law 79: Reactance
- **Look for (positive)**: User always feels in control, opt-out is easy and visible, permission requests explain the benefit clearly, no manipulative copy on decline buttons
- **Look for (violation)**: Aggressive subscription popups, dark pattern decline buttons ("No, I hate saving money"), forced newsletter signups, cookie walls with no explanation, no visible way to dismiss or opt out
- **Severity**: HIGH if users feel coerced or manipulated -- causes distrust and abandonment

### Law 80: Self-Serving Bias
- **Look for (positive)**: Success messages that celebrate the user's achievement, error messages that take responsibility ("We could not process this" instead of "You entered invalid data"), helpful recovery paths after failures
- **Look for (violation)**: Error messages that blame the user, no celebration of successful task completion, system failures presented as user mistakes
- **Severity**: MEDIUM -- affects emotional response and brand perception

---

## Section 9: Cognitive Biases and Self-Perception (Laws 81-90)

**Quick-Scan Principles:**

### Law 81: Curse of Knowledge
- **Look for (positive)**: Simple language accessible to new users, no unexplained jargon, clear instructions that assume no prior product knowledge, tested with fresh eyes
- **Look for (violation)**: Technical jargon in user-facing copy, interface logic that only makes sense to the team that built it, missing labels or explanations for non-obvious features
- **Severity**: HIGH if jargon or insider assumptions block new users from understanding the interface

### Law 84: Cognitive Dissonance
- **Look for (positive)**: Consistent behavior of similarly styled elements, buttons that do what they look like they do, predictable patterns throughout the product, consistent branding and messaging
- **Look for (violation)**: Same-styled buttons doing different things in different contexts, "Back" button in unusual locations, inconsistent branding or contradictory messages, icons that mean different things in different parts of the product
- **Severity**: HIGH if inconsistency causes user errors or confusion on primary flows

### Law 88: Expectations Bias
- **Look for (positive)**: Standard element placement (logo top-left, login top-right, search prominently placed), familiar patterns from widely used products, conventional navigation structures
- **Look for (violation)**: Non-standard placement of common elements, novel navigation patterns without clear affordances, unconventional checkout or signup flows
- **Severity**: MEDIUM -- users adapt but experience initial friction and may miss features

### Law 89: Negativity Bias
- **Look for (positive)**: Auto-save on forms, undo capability for destructive actions, clear error messages with correction options, data preservation during errors, hints at critical interaction moments
- **Look for (violation)**: Lost form data on errors, no undo for destructive actions, vague error messages with no recovery path, no auto-save on long forms
- **Severity**: HIGH -- one negative experience outweighs many positive ones

---

## Section 10: Time and Behavior Management (Laws 91-100)

**Quick-Scan Principles:**

### Law 92: Chronoception (Time Perception)
- **Look for (positive)**: Progress indicators during loading, approximate wait time shown, meaningful messages during long operations, animations that make waits feel shorter, interesting content during necessary delays
- **Look for (violation)**: Blank screens during loading, no progress feedback for operations over 2 seconds, static spinners with no context for long waits
- **Severity**: MEDIUM -- affects perceived performance and user patience

### Law 94: Halo Effect
- **Look for (positive)**: High-quality visual design that creates trust, professional first impression at entry points (homepage, onboarding, landing pages), polished key contact points
- **Look for (violation)**: Poor visual quality on first-impression screens, inconsistent design quality across the product, low-quality images or typography on key pages
- **Severity**: MEDIUM -- first impressions transfer to overall product perception

### Law 96: Familiarity Bias
- **Look for (positive)**: Standard UI components and patterns, terminology and icons consistent with popular products in the same category, familiar interaction models
- **Look for (violation)**: Custom UI components where standard ones would work, invented terminology for common concepts, unfamiliar interaction patterns
- **Severity**: MEDIUM -- increases learning curve and reduces user confidence

### Law 100: Shaping
- **Look for (positive)**: Gradual onboarding with positive reinforcement at each step, small victories celebrated before asking for bigger commitments, progressive complexity introduction
- **Look for (violation)**: Complex tasks presented all at once with no scaffolding, no positive reinforcement during multi-step processes, large asks without building up through smaller successes
- **Severity**: MEDIUM for general interfaces; HIGH for onboarding and habit-formation flows

---

## Severity Classification Summary

| Severity | When to Assign | Impact |
|----------|----------------|--------|
| **HIGH** | Principle violation actively harms usability, causes user errors, blocks goals, or creates distrust. Affects primary flows or first impressions. | Fix immediately. Likely causes measurable drop in conversion, completion, or satisfaction. |
| **MEDIUM** | Principle is underutilized or partially violated. Affects secondary flows, reduces efficiency, or creates friction without blocking goals. | Address in next iteration. Improves experience quality and user confidence. |
| **LOW** | Opportunity to apply a principle that is currently absent. Enhancement rather than fix. Optimization of already functional elements. | Consider when polishing. Differentiates good from great experience. |

## Scan Prioritization

When time is limited, prioritize scanning in this order:

1. **Section 1** (Cognitive Basics) -- affects every screen
2. **Section 6** (Efficiency) -- affects every interaction
3. **Section 9** (Cognitive Biases) -- catches invisible design team blind spots
4. **Section 2** (Visual Perception) -- affects all visual elements
5. **Section 4** (Engagement) -- affects retention flows
6. **Section 3** (Decision-Making) -- affects conversion
7. **Section 8** (Social Influence) -- affects trust and conversion
8. **Section 5** (Emotional Design) -- affects brand and delight
9. **Section 7** (Behavioral Economics) -- affects monetization
10. **Section 10** (Time & Behavior) -- affects habit formation and polish
