# New Claude Project Setup Prompt

Copy and send the following prompt to the first chat in your new Claude Project. It will generate all foundational documents in one session.

---

**I want to set up a systematic, multi-chat project workflow for a new project I'm starting. I need you to help me create the foundational documents and approach that will ensure consistent, high-quality work across multiple chat sessions.**

**Here's what I need you to understand about my working style and requirements:**

**MY WORKING APPROACH:**

- I work through complex projects using **one dedicated chat per step** to avoid context limitations and hallucinations
- Each chat focuses on completing exactly one step with its deliverable before moving to the next
- I want a systematic approach with clear global rules, project tracking, and documentation standards
- I have full decision authority for all project choices
- My experience and thoughts should outweigh web research when conflicts arise
- You should share your initial thoughts about that step's deliverable first (brief, based on project knowledge), then ask me 7-10 strategic questions per step
- Each step must stay focused on its specific scope -- never jump to solutions during discovery phases, never discuss positioning during discovery, never ask about implementation during early phases

**MULTI-CHAT WORKFLOW DETAILS:**

- **Why one step per chat**: Prevents context degradation, reduces hallucinations, maintains laser focus on current step objectives
- **Between chats**: I upload deliverables to project knowledge so next chat has full context
- **Starting new chats**: You will provide me a brief prompt for each next chat that includes: instruction to check status tracker, follow complete global rules, review project knowledge, then start with your assumptions + 7-10 questions for that specific step
- **Step completion**: Only when we have a final deliverable and I explicitly say the step is complete
- **Step scope discipline**: NEVER ask about moving to the next step -- stay in the current step until the final deliverable is ready. CAN revisit and update previous step deliverables based on new knowledge, but NEVER work on future steps

**WHAT I WANT YOU TO CREATE:**

1. **Global Rules Document** -- Complete workflow rules that will guide every chat session
2. **Project Status Tracker** -- Phase and step breakdown appropriate for my project type
3. **Project Assumptions Document** -- Track assumptions throughout the project

**DOCUMENT REQUIREMENTS:**

- All documents in markdown format
- Simple, natural language (8th grade reading level, no jargon)
- Executive summaries with specific key points, not vague descriptions
- Detailed content that can be used as context for other AI tools
- Exact artifact naming consistency across all chats (no variations ever)

**PROCESS REQUIREMENTS:**

- Always check project status tracker first in each new chat
- Always follow global rules completely -- do not ignore any parts
- Update project assumptions document at each step when new assumptions emerge
- When step is complete, provide brief prompt for next chat that includes: check tracker, follow global rules, review knowledge, start with your initial thoughts about that step's deliverable + 7-10 questions
- Decision hierarchy: My experience (highest weight) > Project knowledge > Your thoughts (lowest weight, most likely to hallucinate)

**SUGGESTED STEP SEQUENCE** (adapt as needed for your project type):

**Phase 1: Discovery & Foundation**
1. Problem Statement -> Problem Statement Document
2. Target Audience -> Target Audience Document
3. Assumptions -> Project Assumptions Document
4. Deep Web Research -> Research Findings Document

**Phase 2: Strategy & Positioning**
5. Positioning or Storytelling Framework -> Positioning Document
6. Business Plan -> Business Plan Document

**Phase 3: Product Planning**
7. MVP Requirements -> MVP Requirements Document
8. Information Architecture -> Information Architecture Document

**Phase 4: Design & Validation**
9. MVP Prototyping -> MVP Prototype
10. User Testing -> Test Results and Insights
11. Design References (user independently)
12. High-Fidelity Designs (user independently)

**Phase 5: Implementation**
13. Implementation Guide -> Implementation Guide Document
14. Development & Deployment (user independently)

**Now, to customize this approach for my specific project, please ask me strategic questions about:**

1. **Project Type & Context** -- What kind of project, industry, scope, timeline expectations
2. **My Role & Authority** -- My background, decision-making authority, team involvement
3. **Project Goals & Deliverables** -- What success looks like, key outputs needed
4. **Client/Stakeholder Context** -- Who I'm working with/for, their expectations
5. **Research & Validation Needs** -- What research approaches make sense for this project
6. **Unique Project Requirements** -- Any special considerations, constraints, or opportunities
7. **Step Sequence Preferences** -- Which suggested steps fit your project, what should be modified/added/removed

**After understanding my project context, please:**

1. Create the three foundational documents customized for my specific project
2. Begin the first step of the workflow in this same chat
3. Follow the systematic approach you've established throughout

**Ask me 7-10 strategic questions now to gather the context needed to set up this systematic workflow for my project.**

---

## What This Prompt Produces

When you send this prompt to a blank Claude Project, AI will:

1. Ask you strategic questions to understand your project
2. Create a **Global Rules Document** with workflow rules for every future chat
3. Create a **Project Status Tracker** with phases and steps tailored to your project
4. Create a **Project Assumptions Document** to track beliefs throughout the project
5. Begin the first step (typically Problem Statement) in the same chat

After the first chat, save all three documents to your project's knowledge base. Every future chat will have access to them automatically.

## Adapting the Step Sequence

The suggested sequence above is based on a product development workflow. Adapt it to your project type:

- **Client project**: You may already have a brief or requirements -- skip or shorten Phase 1
- **Side project / pet project**: Follow the full sequence for thorough preparation
- **Design-only project**: Remove Phase 5 and focus on Phases 1-4
- **Research project**: Expand Phase 1, reduce or remove Phases 4-5
- **Development-only project**: If planning is done, start at Phase 5 and reference existing documents

The prompt instructs AI to ask about your sequence preferences, so it will adapt based on your answers.
