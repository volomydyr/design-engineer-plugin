# CLAUDE.md Template

Use this template to generate a comprehensive CLAUDE.md file for any project. Replace bracketed placeholders with project-specific values. Every section below is important -- do not skip sections, but adapt the content to fit the project's needs.

---

```markdown
# [Project Name] Project Rules - Development Approach

## CRITICAL: Read Project Knowledge Documents First

**BEFORE implementing anything, read these documents in full:**

- [List all project planning documents, e.g.:]
- Information Architecture Document
- MVP Requirements Document
- [Any additional project-specific documents]

**These documents contain ALL feature specifications, requirements, and implementation details.**

## REUSE EXISTING DEVELOPMENT (CRITICAL)

**BEFORE creating ANY new component, layout, or style:**

1. **AUDIT existing codebase** -- check existing views, components, and design system files
2. **IDENTIFY reusable patterns** -- existing layouts, components, styles
3. **EXTEND existing systems** -- do not recreate what already works
4. **MAINTAIN consistency** -- follow established naming and structure patterns

**Example:** If one section has card layouts, reuse the card component for similar sections elsewhere.

**Key:** Always build upon what exists rather than creating duplicate components.

## SOURCE HIERARCHY & REFERENCES

### Mandatory Sources of Truth (Hierarchy):

1. **User's direct instructions** (highest authority -- never override)
2. **Development status file** (current project status, guidelines, warnings)
3. **Design files** (pixel-perfect UI implementation required)
4. **Project knowledge documents** (complete feature specifications)
5. **Reference prototypes** (content/text reference when no design exists)
6. **These rules** (implementation process guidelines)

### Documentation Files:

- **MVP Requirements document**: Feature specifications (ask for clarification before big implementations)
- **Information Architecture document**: UI flows, navigation structure (ask for clarification before big implementations)
- [Add any additional project-specific documents here]

## TECH STACK & CURRENT STATUS

### Correct Tech Stack (Use Only These):

- **Frontend**: [Your frontend framework -- e.g., React, Vue, SwiftUI, Flutter]
- **Backend**: [Your backend solution -- e.g., Node.js, Django, Firebase, Supabase]
- **AI** (if applicable): [Your AI integration approach]
- **Data**: [Your data storage approach -- e.g., PostgreSQL, MongoDB, Core Data]
- **Styling**: [Your styling approach -- e.g., Tailwind CSS, styled-components, native styles]

### Implementation Patterns:

- **Icons**: [Your icon approach -- e.g., icon library name, custom SVGs, asset catalog]
- **Colors**: [Your color system -- e.g., CSS custom properties, design tokens, semantic aliases]
- **Typography**: [Your typography system -- e.g., font scale, semantic type styles]
- **Spacing**: [Your spacing system -- e.g., spacing scale, semantic constants]

## PROJECT STATUS & STRUCTURE

### IMPLEMENTED & COMPLETE:

- [List completed features and components]

### IN PROGRESS:

- [List features currently being developed]

### PLANNED (Future):

- [List features planned for later phases]

### Current Project Structure:

```
/[project-root]
├── [source-directory]/     # Main application code
├── [components-directory]/ # Reusable components
├── [styles-directory]/     # Design system and styles
├── [services-directory]/   # Business logic and API calls
├── [assets-directory]/     # Images, icons, fonts
├── [docs-directory]/       # Project documentation
└── [status-directory]/     # Development status tracking
```

### Development Context File:

- **Complete project status and guidelines** in a single consolidated file
- **Read at the start of every new task** for complete context
- **Reference for implementation patterns** and established naming conventions
- **Check current status** before planning new features

## IMPLEMENTATION REQUIREMENTS

### Development Process:

1. **ALWAYS start by fetching up-to-date documentation** for any framework or library being used
2. **READ development status file FIRST** -- contains critical warnings and current status
3. **AUDIT existing components** before creating new ones (reuse what exists)
4. **Check existing design system** before creating new styles
5. **Use semantic naming** following the established token/alias pattern
6. **Ask for clarification** when uncertain about anything

### Code Quality Requirements:

- Use semantic aliases and design tokens, not hardcoded values
- Create reusable components instead of inline styles
- Separate views into smaller, focused components
- Follow framework best practices and modern API patterns
- Consider authentication, user roles, and backend before implementing complex features

### Design System Architecture:

```
[design-system-directory]/
├── tokens.[ext]          # Base values (colors, spacing, typography)
├── [semantic-file].[ext] # Semantic aliases for specific contexts
├── buttons.[ext]         # Button styles and variants
├── typography.[ext]      # Typography scale and modifiers
└── animations.[ext]      # Animation configurations
```

### Non-Negotiable Requirements:

- **ALWAYS cite specific sections** from project documents when implementing features
- **NEVER modify, interpret, or be creative** with documented requirements -- follow exactly
- **NEVER guess, assume, or hallucinate** -- use only specified technologies and approaches
- **NEVER invent new features** not documented in project knowledge documents
- **ALWAYS use the designated tool for clarification** when uncertain

## SPECIALIZED DEVELOPMENT AGENTS & MANDATORY PIPELINE

**For ANY implementation task, follow this pipeline STRICTLY in order:**

### MANDATORY PIPELINE (Follow Exactly)

```
PHASE 1: RESEARCH & ANALYSIS
1. context-analyzer -> Understand patterns, raise questions
2. Fetch up-to-date documentation for decisions
3. Ask user for designs + resolve questions
4. Process responses, make informed decisions

PHASE 2: PLANNING (WAIT FOR APPROVAL)
5. Create detailed implementation plan
6. Wait for user approval -> Do NOT proceed without it

PHASE 3: IMPLEMENTATION (Only After Approval)
7. backend-implementer -> Verify/refine data layer (ALWAYS run)
8. frontend-implementer -> Implement UI (after designs + approval)
9. design-system-auditor -> Verify compliance

PHASE 4: WRAP UP
10. Integration testing -> Test full user flow
```

### Pipeline Violations to Avoid

- Skipping to frontend implementation without asking for designs
- Skipping plan creation step
- Proceeding with implementation before user approves the plan
- Marking backend as "complete" without actually running it
- Making architectural decisions without checking documentation
- Guessing or assuming -- always ask for clarification

## REQUIREMENT CONFLICT RESOLUTION

**When design files conflict with project document requirements:**

```
"CONFLICT DETECTED:
- Project document requirement: [exact quote]
- Design shows: [description]
- Document source: [cite specific document and section]
How should I proceed?"
```

**Wait for user decision before implementing.**

## REMEMBER FOR EVERY PROMPT

1. **READ development status file FIRST** -- critical warnings, status, guidelines
2. **AUDIT existing codebase FIRST** -- reuse components, layouts, styles before creating new ones
3. **CHECK existing components** -- previously built components are ready for reuse across the app
4. **CHECK existing assets** -- verify available icons and images before referencing new ones
5. **Follow established design system patterns** -- use the token/alias pattern consistently
6. **Use only the specified tech stack** -- ignore outdated or alternative technology references
7. **Maintain pixel-perfect implementation** from designs
8. **Update development status** when features are complete
9. **WARN USER when approaching token limit** -- allow user to manually compact conversation with specific instructions instead of auto-compacting (prevents information loss and hallucination)
```

---

## How to Use This Template

1. **Replace all bracketed placeholders** with your project's actual values
2. **Remove sections that do not apply** (e.g., the AI section if your project has no AI features)
3. **Add project-specific warnings** as you discover approaches that do not work
4. **Update regularly** -- this file evolves throughout development

### When to Update CLAUDE.md

- After every major development phase
- When new patterns or components are established
- When warnings about failed approaches need to be recorded
- When the tech stack evolves
- When the project structure changes significantly

### Key Principles

- **Start simple, grow over time**: Your first version will be basic -- that is fine. Add rules as you learn what AI gets wrong.
- **Be specific**: Vague rules like "write good code" do not help. Specific rules like "use Color.primaryText instead of hardcoded color values" do.
- **Record failures**: When AI uses an outdated API or deprecated pattern, add a warning to prevent it from happening again.
- **Separate concerns**: Keep the detailed project status in a separate file. CLAUDE.md should contain rules and structure, not a changelog of every completed task.
