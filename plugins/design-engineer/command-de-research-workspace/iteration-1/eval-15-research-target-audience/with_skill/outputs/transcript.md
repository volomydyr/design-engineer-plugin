# Design-Engineer Research: Target Audience Transcript

**Date**: 2026-03-10
**Activity**: ux-target-audience
**Product**: B2B invoicing tool
**User context**: Considering accountants at small firms vs business owners as target audience

---

## Step 1: Command Parsing and Skill Routing

Received `/de:research target-audience` with additional context about the product. Parsed the argument `target-audience` and mapped it to the `ux-target-audience` skill. Loaded the skill directly without presenting the research activity menu.

Acknowledged user context:
- Product: B2B invoicing tool
- Hypothesized primary: Accountants at small firms
- Question: Should business owners also be targeted directly?

---

## Step 2: Gather Existing Knowledge

Asked the user what they already know about their target audience:

```
Before we build personas, what do you already know about your users?

1. We have real user data (analytics, interviews, feedback)
2. We have assumptions but no validated data
3. Starting completely fresh -- no user knowledge yet
```

**Simulated user answer**: 2 (We have assumptions but no validated data)

Follow-up questions asked:
- "What assumptions do you have about the accountant persona? (workflow, pain points, how they find tools)"
- "What assumptions do you have about business owners? (do they handle invoicing themselves or delegate?)"

**Simulated user answers**:
- Accountants: "They use multiple tools, want to consolidate. Pain point is manual data entry and reconciliation. They find tools through professional networks and accounting software marketplaces."
- Business owners: "Some handle invoicing themselves, especially very small businesses. They want something simple -- they're not accounting-savvy. They might find us through Google or word of mouth."

---

## Step 3: Develop Persona 1 -- Accountants at Small Firms

Worked through the structured persona development process from ux-target-audience skill:

### Persona: Sarah Chen

**Demographics & Context**
- Age: 34
- Role: Senior Accountant at a 3-person accounting firm
- Clients: 15-25 small businesses
- Tech comfort: High -- uses accounting software daily (Xero, QuickBooks)
- Industry: Professional services (accounting)

**Goals**
1. Reduce time spent on manual invoice data entry
2. Consolidate invoicing across multiple client accounts
3. Minimize errors in invoice processing and reconciliation
4. Provide clients with professional, timely invoicing

**Frustrations**
1. Switching between multiple platforms for different clients
2. Manual reconciliation between invoicing and accounting software
3. Chasing clients for payment -- no automated reminders in current tools
4. Formatting inconsistencies across client invoices

**Jobs To Be Done**
- When I receive a batch of invoices from a client, I want to process them all in one place so I can reconcile faster
- When a client's invoice is overdue, I want automated reminders so I don't have to track and follow up manually
- When onboarding a new client, I want to import their existing invoice history so I have a complete picture

**Day-in-the-Life Scenario**
Sarah starts her morning by checking which invoices are outstanding across her 20 clients. She currently opens 3 different tools to get this view. She spends 45 minutes on data entry that could be automated. By noon she's frustrated because a client called asking about an invoice she sent last week -- she has to dig through email to find the send confirmation.

**Persona presented to user for review and refinement.**

---

## Step 4: Develop Persona 2 -- Business Owners

Worked through the same structured persona development process:

### Persona: Marcus Williams

**Demographics & Context**
- Age: 47
- Role: Owner of a plumbing company (12 employees)
- Invoicing volume: 30-50 invoices per month
- Tech comfort: Low-to-moderate -- uses phone and basic desktop apps
- Industry: Trade services

**Goals**
1. Get paid faster -- reduce time between job completion and payment
2. Spend less time on paperwork and more on the business
3. Look professional to customers
4. Keep track of who owes what without a spreadsheet

**Frustrations**
1. Creating invoices is tedious -- often done at night after a full day of work
2. Existing tools are overly complex with features he doesn't need
3. Hard to invoice from the field (needs mobile-friendly)
4. No easy way to see total outstanding receivables at a glance

**Jobs To Be Done**
- When I finish a job, I want to send an invoice immediately from my phone so the customer pays while the work is fresh
- When I need to check my cash flow, I want a simple dashboard so I can see what's owed without running reports
- When a customer disputes a charge, I want to pull up the invoice with job details so I can resolve it quickly

**Day-in-the-Life Scenario**
Marcus finishes a kitchen remodel at 4pm. He makes a mental note to invoice the customer but doesn't get to it until 9pm at home. He opens his laptop, tries to remember the exact materials used, creates the invoice in Word, converts to PDF, and emails it. Three weeks later he realizes the customer never paid and has to dig through his email to find when he sent it.

**Persona presented to user for review and refinement.**

---

## Step 5: Primary vs Secondary Evaluation

Presented a structured comparison to help the user decide:

### Comparison Matrix

| Factor | Accountants (Sarah) | Business Owners (Marcus) |
|--------|---------------------|-------------------------|
| Frequency of use | Daily -- invoicing is their job | Weekly -- invoicing is a chore |
| Willingness to pay | High -- it's a business expense they can bill to clients | Moderate -- price-sensitive, needs clear ROI |
| Volume per user | High -- manages invoicing for 15-25 clients | Moderate -- 30-50 invoices/month |
| Switching cost | High -- deeply embedded in workflow | Low -- might be using Word/Excel |
| Acquisition channel | Professional networks, accounting marketplaces | Google, word of mouth, trade associations |
| Retention drivers | Integration depth, multi-client management | Simplicity, mobile access, payment speed |
| Feature expectations | Advanced: bulk processing, reconciliation, client management | Basic: easy creation, send, track, get paid |
| Product complexity tolerance | High -- wants power features | Low -- wants simplicity |

### Recommendation Presented to User

```
Based on this analysis, here's the recommendation:

PRIMARY PERSONA: Accountants at small firms (Sarah)
- Higher frequency, higher willingness to pay, higher volume
- More defensible position (switching costs, integration depth)
- Each accountant represents 15-25 underlying businesses (multiplier effect)

SECONDARY PERSONA: Business owners (Marcus)
- Important for market size and growth
- Simpler needs = faster initial product to build
- Risk: if you build for Marcus first, the product may be too simple for Sarah

STRATEGIC CONSIDERATION:
The accountant-first approach means each user acquisition brings multiple
business accounts. However, building for accountants requires more complex
features upfront. Consider: can you build a core that serves Marcus and
layer on multi-client management for Sarah?
```

**Asked user**: "Does this recommendation align with your intuition? Would you like to adjust the primary/secondary designation or explore a different segmentation?"

**Simulated user answer**: "That makes sense. I like the multiplier effect argument for accountants. Let's go with that."

---

## Step 6: Produce Deliverable

Generated `target-audience.md` deliverable with:
- Executive summary (primary and secondary personas identified)
- Full persona profiles for both Sarah and Marcus
- Comparison matrix
- Primary vs secondary recommendation with reasoning
- Design implications for each persona
- Open questions for validation

Saved to `docs/design/research/target-audience.md`.

Updated `.dependencies.yaml` to mark `target-audience` as `complete` with current timestamp. Checked downstream dependencies -- noted that `problem-statement` and `assumptions-log` may reference target audience and should be reviewed if they exist.

---

## Step 7: Next Steps

Presented next steps to the user:

```
Target Audience deliverable complete.

Next steps:
- Run /de:research problem-statement to define the core problem for your primary persona
- Run /de:research assumptions to log and prioritize your assumptions for validation
- Consider user interviews with 3-5 accountants to validate the persona

Deliverable saved: docs/design/research/target-audience.md
Dependencies updated: .dependencies.yaml
```

---

## Questions That Would Be Asked Interactively

In a real session, the following questions would be asked with the user responding before proceeding:

1. "What do you already know about your target audience?" (3 options)
2. "What assumptions do you have about the accountant persona?"
3. "What assumptions do you have about business owners?"
4. Review and refine Persona 1 (Sarah) -- "Does this capture your accountant user accurately?"
5. Review and refine Persona 2 (Marcus) -- "Does this capture your business owner user accurately?"
6. "Does this primary/secondary recommendation align with your intuition?"
7. "Any open questions or aspects you'd like to explore further before we finalize?"

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/design/research/target-audience.md` | Target audience deliverable with dual personas and recommendation |
| `transcript.md` | This file |
