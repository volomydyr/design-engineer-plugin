# Research Analysis Methodology

This document describes the dual-analysis approach for interpreting user research results. The core principle: always analyze results yourself first, then let AI analyze independently, then combine both. This prevents AI from hallucinating patterns that do not exist and prevents you from missing patterns you are blind to.

---

## Why Dual Analysis

AI is excellent at spotting patterns across large datasets in minutes rather than hours. But it has a critical flaw: it confidently fills in gaps with made-up information when given room to do so. If you share your conclusions first, AI will confirm them -- even when the data does not support them.

Your human analysis catches context and nuance that AI misses. AI analysis catches volume-based patterns that humans overlook. Neither is sufficient alone. Combined, they produce the most reliable insights.

---

## Phase 1: Your Independent Analysis

Complete this before sharing anything with AI.

### For Survey Results

1. **Read every response.** Do not skim. Even with 100+ responses, read them all at least once.
2. **Take notes in your own words.** Write down what surprises you, what confirms expectations, and what confuses you.
3. **Look for repetition.** When multiple people independently say similar things, that is a signal.
4. **Note outliers.** Unusual responses sometimes reveal insights that averages hide.
5. **Check open-ended responses carefully.** These often contain the richest insights but are easy to dismiss.
6. **Form your own conclusions.** Write down 3-5 key findings before touching any analysis tool.

### For Usability Test Results

1. **Watch every recording.** All of them, start to finish.
2. **Note moments of confusion.** Where do participants pause, backtrack, or express frustration?
3. **Track task completion.** Which tasks were completed easily? Which caused problems?
4. **Listen to verbal feedback.** What participants say while doing tasks often reveals more than task metrics.
5. **Document your impressions.** Write what you think the main issues are before consulting AI.

### For Interview Transcripts

1. **Review each transcript or recording individually.**
2. **Highlight emotional moments.** Where did the participant's tone or energy change?
3. **Extract direct quotes** that capture key insights. These are more powerful than your paraphrasing.
4. **Identify themes.** Group similar responses across participants.
5. **Note contradictions.** When participants say one thing but describe doing another, that is valuable data.

### Output: Your Analysis Document

Write a document that includes:

- **Your top 3-5 key findings** (in order of importance to you)
- **Supporting evidence** for each finding (specific responses or behaviors)
- **Surprises** -- things you did not expect
- **Concerns** -- findings that worry you or challenge your assumptions
- **Questions** -- new questions that emerged from the data

**Do NOT share this document with AI yet.**

---

## Phase 2: AI Independent Analysis

Now share the raw data with AI, but NOT your conclusions.

### What to Share with AI

- Raw survey results (CSV export from Google Forms, or copy-pasted response data)
- Raw usability test metrics (completion rates, time on task, error counts)
- Raw test recordings transcripts (if available)
- Your existing assumptions and hypotheses document (so AI can compare findings against them)

### What NOT to Share

- Your Phase 1 analysis
- Your personal conclusions
- Your opinions about what the data means

### What to Ask AI to Do

Present these instructions to AI:

1. **Organize the raw data** into clean, readable tables and charts
2. **Identify patterns** in participant behavior and responses
3. **Compare findings against the project's assumptions and hypotheses** -- determine which were confirmed, which were disproven, which need more data
4. **Flag any concerning patterns** -- things that suggest the product idea may need significant changes
5. **Provide key insights** with specific next-step recommendations
6. **Cite specific data points** for every claim -- no generalizations without evidence

### Verification Step

When AI makes a claim, ask it to provide the specific quotes or data points that support it. Then search for those exact data points in your raw results. If you cannot find them, AI probably invented them.

This verification is essential. AI will confidently state things like "research proves users prefer quarterly payments" when the data only shows "users dislike monthly subscriptions" -- which is not the same claim at all.

---

## Phase 3: Combined Analysis

Now bring both analyses together.

### Process

1. **Share your Phase 1 analysis with AI.**
2. **Ask AI to compare both analyses:** "Here is my independent analysis of the same data. Compare it with your analysis. What did I catch that you missed? What did you catch that I missed? Where do we disagree?"
3. **Review disagreements carefully.** When your analysis and AI's analysis conflict, go back to the raw data. The data resolves the disagreement, not either analysis.
4. **Merge the strongest insights** from both versions into a final combined document.

### Final Research Findings Document

The merged output should include:

**Executive Summary**
- 3-5 key insights (the most important things you learned)
- Impact level: how significantly these findings affect your product direction

**Methodology**
- What research method was used (survey, usability test, interview)
- Number of participants
- Platform used (Google Forms, Useberry, etc.)
- Date range of data collection
- Any known limitations (sample bias, small sample size, etc.)

**Key Findings**
Organized by theme, each finding includes:
- The finding stated clearly
- Supporting evidence (specific data points, quotes, metrics)
- Which assumption or hypothesis this relates to
- Confidence level (strong evidence, moderate evidence, suggestive only)

**Impact on Hypotheses**
A table mapping each existing hypothesis to its status:

| Hypothesis | Status | Evidence | Next Action |
|---|---|---|---|
| "Users prefer quarterly payments" | Needs more data | Data shows dislike of monthly, but no evidence for quarterly preference | Test quarterly pricing in next round |
| "Users will share links in-app" | Confirmed | 78% of respondents said they share learning resources with colleagues | Prioritize sharing feature in MVP |

**Recommendations**
- What to do next based on findings
- Which hypotheses to test in the next research round
- Suggested changes to problem statement, persona, or product direction

**Raw Data Reference**
- Link to spreadsheet or testing platform results
- Instructions for accessing the data if needed later

---

## When to Re-Run Research

Research is not a one-time activity. Plan to revisit it when:

- You have made significant changes to the product concept
- You are moving from one phase to another (e.g., from discovery to MVP planning)
- New assumptions have accumulated that need validation
- Your user persona has shifted based on new information
- You are preparing for a major development investment

Each round of research should improve not just your product but also the quality of your research process itself. Use what you learn about survey design and participant recruitment to make the next round easier for respondents and more useful for you.

---

## Common Analysis Mistakes

- **Confirmation bias:** Looking only for data that supports what you already believe. Force yourself to document findings that challenge your assumptions.
- **Over-relying on AI analysis:** AI analysis is a complement, not a replacement. Your judgment matters more.
- **Ignoring small sample signals:** Even with 5 participants in a usability test, if 4 of them struggle with the same task, that is a real finding.
- **Averaging away outliers:** Sometimes the most valuable insight comes from the one person who had a completely different experience.
- **Skipping the verification step:** Always check whether AI's cited evidence actually exists in the raw data.
- **Not updating documents:** Research findings are useless if they do not flow back into your problem statement, persona, assumptions, and MVP requirements.
