# Design-Engineer Research: Competitive Analysis Transcript

**Date**: 2026-03-10
**Activity**: ux-competitor-analysis
**Product**: Not specified (bare command)
**User context**: No product context provided with the command

---

## Step 1: Command Parsing and Skill Routing

Received `/de:research competitive-analysis`. Parsed the argument `competitive-analysis` and mapped it to the `ux-competitor-analysis` skill. Loaded the skill directly without presenting the research activity menu.

Since no product context was provided, checked for existing deliverables in `docs/design/` to gather context from prior research. Found no existing deliverables.

Asked the user: "What product or project are we analyzing competitors for? Give me a brief description so I can focus the analysis."

**Simulated user answer**: "We're building an AI-powered resume builder that helps job seekers create tailored resumes for specific job postings."

---

## Step 2: Assess Current Competitive Knowledge

Asked the user about their existing competitive knowledge:

```
Competitive Knowledge
What do you already know about competitors in this space?

1. I've done research -- I know the landscape well
2. I know some names but haven't done deep analysis
3. Starting fresh -- I don't know the competitive landscape
```

**Simulated user answer**: 2 (I know some names but haven't done deep analysis)

Follow-up: "Which competitors are you aware of?"

**Simulated user answer**: "I know about Resumebuilder.io and there's also Teal. I've heard of Jobscan too but not sure if it's the same thing."

---

## Step 3: Identify Direct and Indirect Competitors

### Research Process
Used the user's known competitors as a starting point. Expanded the landscape by considering:
- Direct competitors: Other AI resume builders
- Indirect competitors: Alternative ways job seekers solve the same problem

### Direct Competitors Identified

1. **Teal** -- AI resume builder with job tracking and tailoring
2. **Resumebuilder.io** -- Template-based resume builder with AI writing assistance
3. **Kickresume** -- AI resume and cover letter builder
4. **Rezi** -- AI-optimized resumes for ATS systems
5. **Resume.io** -- Popular template-based builder with some AI features

### Indirect Competitors Identified

1. **ChatGPT / Claude** -- General AI used to write and refine resumes manually
2. **LinkedIn profile** -- Increasingly used as a resume substitute
3. **Professional resume writers** -- Human service, $200-500 per resume
4. **Jobscan** -- Not a builder but an ATS optimization scanner (complementary)
5. **Canva** -- Design-focused resume templates (no AI tailoring)

---

## Step 4: Deep Analysis -- Strengths and Weaknesses

Presented structured analysis for each direct competitor:

| Competitor | Strengths | Weaknesses | Opportunity |
|-----------|-----------|------------|-------------|
| **Teal** | Full job search suite (tracking, tailoring, matching). Strong AI tailoring per job posting. Free tier available. | Complex -- trying to do everything. Can feel overwhelming. Premium pricing ($29/mo). | Focus on doing one thing exceptionally well vs their swiss-army-knife approach |
| **Resumebuilder.io** | Simple, fast, well-marketed. Good SEO presence. Low price point. | AI is surface-level (mostly template fill). Limited tailoring per job. Templates feel generic. | Deeper AI that actually understands role requirements |
| **Kickresume** | Clean templates, cover letter included. Good international support. | AI quality inconsistent. Limited ATS optimization. Student-focused branding. | Professional positioning with better AI quality |
| **Rezi** | Strong ATS focus, keyword optimization. Developer-friendly. | Narrow focus on ATS, not overall quality. UI feels dated. | Balance ATS optimization with human-readable quality |
| **Resume.io** | Largest template library. Easy to use. Multi-language. | Minimal AI -- mostly manual. No job-specific tailoring. Subscription fatigue (charges for PDF export). | AI-first approach vs their template-first approach |

### Indirect Competitor Analysis

| Competitor | Why People Use It | Limitation | Our Advantage |
|-----------|------------------|-----------|---------------|
| **ChatGPT/Claude** | Free, flexible, good writing quality | No formatting, no templates, requires prompt skill, no ATS awareness | Structured output + ATS optimization + templates |
| **LinkedIn** | Already created, recruiters search it | Not a resume, can't tailor per application | Job-specific tailoring is our core value |
| **Professional writers** | High quality, personalized | Expensive ($200-500), slow (days), not scalable per application | Same quality at scale, instantly, affordably |
| **Canva** | Beautiful designs, creative control | No AI, no ATS optimization, manual content | AI content + ATS-safe formatting |

---

## Step 5: Strategic Positioning

Presented positioning analysis:

```
Competitive Positioning Map

                    AI-Powered
                        |
                   Rezi | Teal
                        |
    Simple ─────────────┼───────────── Full Suite
                        |
           Resume.io    | Kickresume
          Resumebuilder |
                        |
                   Template-Based

Your opportunity: Upper-left quadrant
AI-Powered + Focused (not full suite)
= Deep AI tailoring without complexity
```

### Key Differentiiation Opportunities
1. **Job-specific AI tailoring** -- analyze the job posting and rewrite the resume to match, not just keyword-stuff
2. **Quality over quantity** -- fewer templates but each one is ATS-optimized and professionally designed
3. **Transparent AI** -- show the user what was changed and why (vs black-box rewriting)
4. **One-shot pricing** -- per resume or per job application vs monthly subscription

---

## Step 6: Produce Deliverable

Generated `competitor-analysis.md` deliverable with:
- Executive summary of the competitive landscape
- Direct competitor profiles (5) with detailed strengths/weaknesses
- Indirect competitor analysis (5) with displacement opportunities
- Competitive positioning map
- Strategic differentiation recommendations
- Pricing landscape comparison
- Open questions for further research

Saved to `docs/design/research/competitor-analysis.md`.

Updated `.dependencies.yaml` to mark `competitor-analysis` as `complete` with current timestamp.

---

## Step 7: Next Steps

Presented next steps to the user:

```
Competitive Analysis deliverable complete.

Key finding: The market is crowded but most competitors are either
template-first (weak AI) or trying to be a full job-search suite
(complex). There's a clear opening for an AI-first, focused resume
tailor.

Next steps:
- Run /de:research target-audience to define who exactly you're building for
- Run /de:research problem-statement to articulate the core problem
- Consider signing up for free tiers of Teal and Rezi to experience
  their AI firsthand

Deliverable saved: docs/design/research/competitor-analysis.md
Dependencies updated: .dependencies.yaml
```

---

## Questions That Would Be Asked Interactively

In a real session, the following questions would be asked with the user responding before proceeding:

1. "What product are we analyzing competitors for?" (since no context provided)
2. "What do you already know about competitors in this space?" (3 options)
3. "Which competitors are you aware of?" (open-ended)
4. "Are there any competitors I've identified that you want to go deeper on?"
5. Review of the strengths/weaknesses analysis -- "Does this match your experience with these tools?"
6. "Does the positioning map reflect where you want to be?"
7. "Any competitors I missed that you've encountered?"

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/design/research/competitor-analysis.md` | Full competitive landscape analysis with positioning |
| `transcript.md` | This file |
