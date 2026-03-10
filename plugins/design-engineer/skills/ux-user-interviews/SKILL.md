---
name: ux-user-interviews
description: "Designs, prepares, and analyzes user interviews and surveys using GEQ and Replacing X techniques. Guides dual-analysis methodology combining human and AI insights. Use when validating assumptions, understanding user behavior, or gathering qualitative data."
disable-model-invocation: true
---

# ux-user-interviews Skill

**Purpose:** Help you design effective user research instruments (surveys and interviews), prepare proper scripts, find and motivate participants, and analyze results using a dual-analysis methodology that prevents AI hallucination in research findings.

This skill operates in guided mode only because interviews and surveys require human interaction with real users. AI cannot conduct the research for you, but it can prepare you thoroughly and help you make sense of what you learn.

## Overview

Most designers get anxious just thinking about user interviews. That introversion is actually an advantage: if talking to people feels hard, you prepare better and listen more closely.

You do not always need full interviews to start. A well-crafted survey can already deliver solid insights. This skill covers both formats and teaches you when each is appropriate.

**Key principles this skill enforces:**

- Ask about past behavior, never about hypothetical futures
- Always analyze results yourself before involving AI
- Use General Empathy Questions (GEQs) to understand customers in their real context
- Apply the "Replacing X" technique to understand what users did before your product
- Combine your analysis with AI analysis for the strongest outcome

**Pipeline position:** Phase 1, Step 6 (optional, can run at multiple points throughout the project)

**Reference files:**

- [interview-script-template.md](./references/interview-script-template.md) -- question framework based on GEQs, three empathy questions, and the Replacing X technique
- [analysis-methodology.md](./references/analysis-methodology.md) -- dual-analysis approach with step-by-step instructions

---

<critical_sequence name="user-interviews-workflow" enforce_order="strict">

## 5-Step Process

<step number="1" required="true">
### Step 1: Determine Research Method

Before writing any questions, understand what the user needs to learn.

**AI actions:**

1. Read existing project context (problem statement, user persona, assumptions/hypotheses if available)
2. Share brief suggestions on which research method fits best:
   - **Survey** -- best for early validation, quantitative patterns, large sample sizes (~100 respondents). Lower effort for both you and participants. Use closed questions primarily.
   - **Unmoderated user test** -- best for usability validation of prototypes. Gives both quantitative and qualitative data. Requires a prototype (wireframe or AI-generated).
   - **Moderated interview** -- best for deep qualitative insights, understanding motivations and mental models. Highest effort but richest data.
3. Explain trade-offs from multiple perspectives (time, cost, data quality, sample size)

**Then ask 7-10 strategic questions using AskUserQuestion:**

<ask_user>
I need to understand your research context before preparing the script. Please answer these questions (respond with the number and your answer for each):

1. What specific assumptions or hypotheses are you trying to validate? (If you have a hypotheses document, reference it)
2. Do you already have access to potential participants? If so, how many and through what channel?
3. What research have you already done? (e.g., surveys, competitor analysis, informal conversations)
4. Do you have a prototype or design that participants could interact with?
5. What is your timeline for completing this research?
6. Are you more comfortable with written surveys or live conversations?
7. What does your product replace for users? What were they doing before? (the "Replacing X" question)
8. Have you identified any gaps in your understanding of users that previous research did not cover?
</ask_user>

**Iterate** until the user confirms the chosen research method and scope.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Generate Research Script

Based on the chosen method and user answers, generate the research instrument.

**For surveys:**

- Prioritize closed questions with prepared answer options (people prefer clicking to typing; more will finish the form)
- Limit open-ended questions to 2-3 maximum
- Never ask about hypothetical future behavior ("Would you pay for...?")
- Instead ask about past experiences ("Have you used an app that could...?", "If yes, did you pay for it?", "Was the price worth it? Why?")
- Structure the survey to flow naturally from context to behavior to preferences
- End with a contact-collection question for follow-up testing ("Would you be willing to participate in a short usability test? Leave your email if yes")
- Recommend Google Forms (free, exports to CSV for AI analysis)

**For interviews, use the GEQ framework from** [interview-script-template.md](./references/interview-script-template.md):

- Build the script around General Empathy Questions (GEQs) to understand customers in their real context
- Include the three core empathy questions:
  - **Hope:** "If you had a magic wand and could instantly [get the value], how would that change your life?"
  - **Pain:** "What is your biggest challenge when it comes to [the problem]? And why is it so challenging?"
  - **Barrier:** "Tell me about the last time you tried to [do the action]. What was preventing you from [the goal]?"
- Apply the "Replacing X" technique: understand what users were doing BEFORE your product existed
- These questions turn interviews into stories, revealing emotions that standard research methods miss

**For unmoderated tests:**

- Generate a testing script with clear tasks and success criteria
- Recommend Useberry (better free plan than Maze for early-stage founders)
- Prototype can come from AI tools (v0, Lovable, Bolt, Readdy, Magic Patterns, Figma Make) or a Claude Projects prototype link
- Warn: AI-generated scripts sometimes contain biased tasks and questions; the user must review and edit manually

**Present the draft script and ask:**

<ask_user>
Here is the draft research script. Please review it carefully:

1. Are there any questions that feel leading or biased?
2. Are there assumptions or hypotheses I missed that should be covered?
3. Is the length appropriate for your target participants?
4. Would you like to adjust the order of questions?
5. Are there any sensitive topics I should handle differently?
</ask_user>

**Iterate** on the script until the user approves it.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Participant Recruitment Guidance

Help the user find and motivate the right participants.

**Key guidance:**

- **Target 100 respondents for surveys** -- this gives reliable data with low margin of error
- **Target 5-10 participants for usability tests** -- enough to uncover most usability issues
- **Write personally and politely** -- do not spam random groups or chats
- **Use the right communities** -- target your user persona specifically; there is no point surveying people outside your target audience
- **If you ran a previous survey**, contact people who left their info for follow-up testing
- **Motivate participation** -- explain why their input matters, keep time commitment clear

**Present recruitment plan and ask:**

<ask_user>
Before you start recruiting, let me confirm the plan:

1. Where will you recruit participants? (specific communities, channels, contacts)
2. What will your outreach message look like? (I can help draft one)
3. What is your target number of responses?
4. Do you have a deadline for data collection?
</ask_user>
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Analyze Results (Dual-Analysis Method)

This is the most critical step. Follow the methodology in [analysis-methodology.md](./references/analysis-methodology.md) exactly.

**The dual-analysis process:**

1. **You analyze first:** Watch every test recording or read every response yourself. Take your own notes. Form your own conclusions. Do NOT share them with AI yet.
2. **AI analyzes independently:** Share the raw results with AI WITHOUT your conclusions. Ask AI to:
   - Organize raw data into clean tables and charts
   - Spot patterns in behavior and answers
   - Compare patterns against your assumptions and hypotheses from the Big Idea
   - Identify which assumptions were confirmed and which were not
   - Provide key insights with next-step recommendations
3. **Combine both analyses:** Upload your personal analysis and ask AI to identify what either of you might have missed. Merge the best insights from both versions.

**Why this order matters:** If you share your conclusions first, AI will be biased by your interpretation and confirm what you already think. The independent analysis catches things you missed, and your analysis catches things AI invented.

**Present combined analysis and ask:**

<ask_user>
Here is the combined analysis from both your notes and my independent review. Before we finalize:

1. Are there any insights that surprise you or contradict your expectations?
2. Did the results suggest any changes to your problem statement or user persona?
3. Which assumptions were confirmed? Which need revision?
4. Are there follow-up questions you wish you had asked?
5. Should any new hypotheses be added based on these findings?
</ask_user>
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Update Project Documents

Based on the validated research findings, help the user update their existing deliverables.

**Documents that typically need updates after research:**

- **User persona** -- refine with real data instead of proto-persona assumptions
- **Assumptions document** -- mark confirmed/disproven hypotheses, add new ones
- **Problem statement** -- adjust if research revealed different core problems
- **Parking lot** -- move validated ideas in, move disproven ideas out

**Produce a Research Findings document that includes:**

- Executive summary (3-5 key insights)
- Methodology description (what was done, how many participants, what platform)
- Key findings organized by theme
- Impact on existing hypotheses (confirmed / disproven / needs more data)
- Recommendations for next steps
- Raw data reference (link to spreadsheet or platform)

**Remind the user:** Testing is not just about confirming favorite ideas. It is about finding mistakes and continuously improving. Be ready for surprises -- users will tell you what matters, and sometimes that means rethinking your business model entirely.
</step>

</critical_sequence>

---

## Decision Hierarchy

When interpreting research results:

1. **User's own analysis and judgment** -- highest weight
2. **Raw data from actual participants** -- direct evidence
3. **AI pattern analysis** -- useful but may hallucinate patterns that do not exist

Never let AI override what the data actually shows. When AI makes a claim based on research, ask it to provide specific quotes from the raw data. Then verify those quotes exist.

## Common Mistakes to Avoid

- Asking about the future instead of the past ("Would you pay for...?" vs "Have you paid for...?")
- Trusting AI analysis without doing your own pass first
- Surveying people outside your target audience
- Making the survey too long (completion rates drop dramatically after 10 minutes)
- Skipping the contact-collection question at the end
- Using open-ended questions where closed ones would work better
- Not iterating on the survey itself based on what you learn each round
