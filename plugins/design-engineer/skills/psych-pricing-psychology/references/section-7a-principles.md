# Section 7a: Behavioral Economics – Core Patterns (Laws 61-65)

## Law 61: Decoy Effect

**Definition**: When a third, less attractive option is added, it nudges users to choose the more expensive of the two original options.

### UX Application

This effect is a powerful tool for creating persuasive choice scenarios, especially when you need to steer users toward a particular decision.

For example, if pricing plans offer two subscription options – Basic at $10/month and Premium at $20/month – adding a middle option at $17/month can cause most users to choose Premium at $20/month.

This happens because the Premium option appears more beneficial and psychologically attractive. The user realizes that for a small additional payment they receive significantly more features, making this choice seem more rational in their eyes.

### Good Example

A SaaS platform offers three tiers: Starter ($9, 5 projects), Pro ($15, 10 projects), and Business ($19, unlimited projects + priority support). The Pro plan is deliberately close in price to Business but significantly weaker in features. Most users choose Business because the small price difference for unlimited projects makes it feel like the obvious "smart choice."

### Bad Example

A streaming service offers Basic ($5, SD only), Standard ($13, HD), and Premium ($14, 4K + family sharing). The decoy is too close to the target – only $1 difference. Users see through the manipulation because the pricing feels artificial and dishonest.

---

## Law 62: Sunk Cost Effect

**Definition**: People continue using something they have invested time, money, or effort into, even if it no longer serves them or they no longer enjoy it.

### UX Application

This effect has two sides. On one hand, it can create a positive experience by motivating users to complete important actions and remain engaged thanks to the feeling of effort already invested.

On the other hand, there is a risk of creating a feeling of manipulation and loss if users cannot easily abandon a process or service.

Typically this approach is applied through trial periods: users invest effort in learning the product and, not wanting to lose what they have invested, continue using it by subscribing.

This effect should be applied carefully to avoid negative reactions and maintain user trust.

### Good Example

A design tool offers a 14-day free trial during which users create projects, upload assets, build templates, and invite team members. By the end of the trial, switching to another tool means losing all that setup work. The tool makes it easy to export data if users do want to leave, but the accumulated investment naturally encourages staying.

### Bad Example

A subscription service makes cancellation deliberately difficult – hiding the cancel button, requiring a phone call, or showing guilt-inducing messages like "You'll lose 347 days of progress!" This weaponizes sunk cost into a dark pattern that erodes trust and generates negative reviews.

The sunk cost effect (also called sunk cost fallacy) describes our tendency to follow through on something if we have already invested time, effort, or money into it, whether or not the current costs outweigh the benefits.

**Key insight**: The more users invest in your product (data, customizations, social connections, content), the harder it becomes to switch – not because of lock-in, but because of perceived loss of investment.

**UX applications**:

- **Trial periods as investment creators**: Free trials work not because of the free access, but because users invest effort in setup and learning. That investment creates sunk cost attachment.
- **Progress visualization**: Showing users how much they have accomplished ("You've completed 47 lessons!") reinforces the sunk cost and motivates continued engagement.
- **Ethical checkpoint**: Are you making it genuinely valuable to stay, or just painful to leave? Ethical sunk cost creates value through accumulated investment; dark-pattern sunk cost creates artificial switching barriers.

---

## Law 63: Hyperbolic Discounting

**Definition**: People prefer a smaller immediate reward now over a larger reward in the future.

### UX Application

It is important to understand that users are prone to impulsiveness and often choose what appears simpler or more beneficial right now.

In e-commerce, this is often embodied through flash discounts, instant bonuses, and promises of quick results.

This approach is also effective when creating onboarding, loyalty programs, or promotions, since a quick reward stimulates users to take the first step.

### Good Example

A fitness app offers "Complete your first workout today and unlock a bonus stretching routine immediately" rather than "Work out for 30 days to earn a certificate." The immediate reward (bonus content right now) motivates the first action, which then builds into a longer habit loop.

### Bad Example

A savings app promotes "Invest $100 today and get $150 in 5 years." While mathematically sound, this fails because hyperbolic discounting makes the future reward feel abstract and small compared to keeping $100 now. A better approach would combine the long-term benefit with an immediate one: "Invest $100 today, get a $5 bonus instantly, and watch your money grow."

---

## Law 64: Cashless Effect

**Definition**: People spend more money with cashless payments because they do not feel the physical act of parting with money.

### UX Application

Psychologically, physically handing over cash triggers a noticeable "pain" of spending, whereas contactless payment or one-click purchasing significantly reduces this discomfort.

But this can lead to impulse purchases or overspending.

Therefore it is important to account for this effect and create interfaces that help users better understand their spending and make considered financial decisions.

### Good Example

A budgeting app integrates with one-click payment methods but shows a real-time spending summary after each purchase: "You've spent $47 today, $312 this week." It respects the convenience of cashless payment while counteracting the reduced spending awareness with clear, immediate feedback.

### Bad Example

An online marketplace stores payment details and enables one-click purchasing with no friction, no order summary, and no spending visibility. Users discover at the end of the month they spent three times their budget because every purchase felt effortless and painless.

---

## Law 65: Pareto Principle

**Definition**: 20% of a product's features provide 80% of the value for users.

### UX Application

The Pareto Principle indicates that most of the impact on user experience comes from only a small portion of features or content.

Users most frequently interact with the key capabilities of a product, while other features may remain virtually unnoticed.

Therefore, when designing interfaces, focus on perfecting those 20% of features that are used most frequently, rather than developing excess functionality with low value.

### Good Example

A project management tool analyzes usage data and discovers that task creation, status updates, and team mentions account for 85% of all user actions. The redesign puts these three actions front and center with one-click access, while advanced features (Gantt charts, resource allocation, custom fields) are accessible but tucked into secondary menus.

### Bad Example

A note-taking app treats all 40 features as equally important, showing formatting tools, templates, tags, integrations, sharing options, and AI features all at the same level in the interface. Users feel overwhelmed by options they never use, and the three things they actually need (create note, search, organize) are lost in the clutter.

---

## Behavioral Economics Core Checklist

For any interface involving pricing, investment, or value perception, check these five questions:

1. **Decoy Effect**: If presenting multiple options, is there a strategic third option that makes the target choice look more attractive? Is it honest and transparent?
2. **Sunk Cost Effect**: What has the user already invested (time, data, customization)? Are you making that investment genuinely valuable, or just hard to abandon?
3. **Hyperbolic Discounting**: Are you offering an immediate reward alongside long-term benefits? Is the first step rewarding enough to motivate action?
4. **Cashless Effect**: For payment flows, are you reducing friction responsibly? Do users have visibility into their spending?
5. **Pareto Principle**: Have you identified the vital 20% of features? Are they prominently accessible while the rest stays out of the way?

## Principle Interactions

### Pricing Strategy
Combine Decoy Effect + Hyperbolic Discounting when designing pricing pages. The decoy steers choice toward the target plan, while an immediate bonus ("Start today and get your first month at 50% off") triggers the discounting bias to act now.

### Retention Through Investment
Combine Sunk Cost Effect + Pareto Principle. Focus the user's investment on the 20% of features they use most. When their most-used workflows are deeply customized, the sunk cost of switching is both real and valuable – not artificial.

### Responsible Commerce
Combine Cashless Effect + Hyperbolic Discounting awareness. Both principles make spending feel easier. Ethical design counterbalances this by providing spending summaries, purchase confirmations, and cooling-off periods for large transactions.
