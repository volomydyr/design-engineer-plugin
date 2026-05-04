---
name: ux-user-interviews
description: "Designs, prepares, and analyzes user interviews and surveys using empathy questions and Replacing X techniques. Guides dual-analysis methodology combining human and AI insights. Use when validating assumptions, understanding user behavior, or gathering qualitative data."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# ux-user-interviews Skill

## Existing-context augmentation

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.off_repo_references`. This skill enriches existing user research rather than writing a single canonical deliverable, so the pattern is **input augmentation, not skip-check**:

1. If the user has off-repo references to prior user research (Notion findings, recorded interviews, survey results in Linear/Jira tickets, etc.), ask them to share what they have OR point this skill at the source.
2. Treat the existing research as the **starting context** – the new instruments / scripts / analyses should build on it, not start blank. Reference what's already known about users when designing new interview questions, so you're not asking what's already been answered.
3. If no existing research is referenced, proceed normally – design new instruments from scratch using the framework below.

**Purpose:** Help you design effective user research instruments (surveys and interviews), prepare proper scripts, find and motivate participants, and analyze results using a dual-analysis methodology that prevents AI hallucination in research findings.

This skill operates in guided mode only because interviews and surveys require human interaction with real users. AI cannot conduct the research for you, but it can prepare you thoroughly and help you make sense of what you learn.

## Overview

Most designers get anxious just thinking about user interviews. That introversion is actually an advantage: if talking to people feels hard, you prepare better and listen more closely.

You do not always need full interviews to start. A well-crafted survey can already deliver solid insights. This skill covers both formats and teaches you when each is appropriate.

**Key principles this skill enforces:**

- Ask about past behavior, never about hypothetical futures
- Always analyze results yourself before involving AI
- Use empathy questions to understand customers in their real context
- Apply the "Replacing X" technique to understand what users did before your product
- Combine your analysis with AI analysis for the strongest outcome

**Pipeline position:** Phase 1, Step 6 (optional, can run at multiple points throughout the project)

**Reference files:**

- [interview-script-template.md](./references/interview-script-template.md) – question framework based on three empathy questions and the Replacing X technique
- [analysis-methodology.md](./references/analysis-methodology.md) – dual-analysis approach with step-by-step instructions

---

<critical_sequence name="user-interviews-workflow" enforce_order="strict">

## 5-Step Process

<step number="1" required="true">
### Step 1: Determine Research Method

Before writing any questions, understand what the user needs to learn.

**AI actions:**

1. Read existing project context (problem statement, user persona, assumptions/hypotheses if available)
2. Share your brief initial thoughts about which research method fits best based on what you already know about the project. Draw on the user's context, existing documents, and your understanding of the domain. Be honest about trade-offs – the goal is to give the user starting material for their own thinking, not to follow a rigid template.

**Then ask 7-10 context-based strategic questions using AskUserQuestion.** Adapt your questions to what you already know about the project from the context read above and any existing documents. Make sure your questions cover these key concepts:

- Surveys: use closed questions, Google Forms, ~100 respondents, improve each round
- Past-not-future rule: do not ask about the future, ask about the past
- 3 empathy questions (Hope, Pain, Barrier)
- "Replacing X" technique: what were users doing before your product?
- Dual-analysis: analyze yourself first, then AI independently, then combine
- Contact collection at end of survey

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

**For interviews, use the empathy questions from** [interview-script-template.md](./references/interview-script-template.md):

- Build the script around empathy questions to understand customers in their real context
- Include the three core empathy questions:
  - **Hope:** "If you had a magic wand and could instantly [get the value], how would that change your life?"
  - **Pain:** "What is your biggest challenge when it comes to [the problem]? And why is it so challenging?"
  - **Barrier:** "Tell me about the last time you tried to [do the action]. What was preventing you from [the goal]?"
- Apply the "Replacing X" technique: understand what users were doing BEFORE your product existed
- These questions turn interviews into stories, revealing emotions that standard research methods miss

**For unmoderated tests:**

- Generate a testing script with clear tasks and success criteria
- Recommend Useberry (better free plan than Maze for early-stage founders)
- Prototype can come from AI tools (v0, Lovable, Bolt, Readdy, Magic Patterns, Figma Make) or an HTML prototype file
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

- **Target 100 respondents for surveys** – this gives reliable data with low margin of error
- **Target 5-10 participants for usability tests** – enough to uncover most usability issues
- **Write personally and politely** – do not spam random groups or chats
- **Use the right communities** – target your user persona specifically; there is no point surveying people outside your target audience
- **If you ran a previous survey**, contact people who left their info for follow-up testing
- **Motivate participation** – explain why their input matters, keep time commitment clear

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

- **User persona** – refine with real data instead of proto-persona assumptions
- **Assumptions document** – mark confirmed/disproven hypotheses, add new ones
- **Problem statement** – adjust if research revealed different core problems
- **Parking lot** – move validated ideas in, move disproven ideas out

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/research` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront. Save the document to `.design-engineer-plugin/design/research/research-findings.md`.

**Produce a Research Findings document that includes:**

- Executive summary (3-5 key insights)
- Methodology description (what was done, how many participants, what platform)
- Key findings organized by theme
- Impact on existing hypotheses (confirmed / disproven / needs more data)
- Recommendations for next steps
- Raw data reference (link to spreadsheet or platform)

**Remind the user:** Testing is not just about confirming favorite ideas. It is about finding mistakes and continuously improving. Be ready for surprises – users will tell you what matters, and sometimes that means rethinking your business model entirely.
</step>

</critical_sequence>

---

## Decision Hierarchy

When interpreting research results:

1. **User's own analysis and judgment** – highest weight
2. **Raw data from actual participants** – direct evidence
3. **AI pattern analysis** – useful but may hallucinate patterns that do not exist

Never let AI override what the data actually shows. When AI makes a claim based on research, ask it to provide specific quotes from the raw data. Then verify those quotes exist.

## Common Mistakes to Avoid

- Asking about the future instead of the past ("Would you pay for...?" vs "Have you paid for...?")
- Trusting AI analysis without doing your own pass first
- Surveying people outside your target audience
- Making the survey too long (completion rates drop dramatically after 10 minutes)
- Skipping the contact-collection question at the end
- Using open-ended questions where closed ones would work better
- Not iterating on the survey itself based on what you learn each round


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
