# Kick-Start Prompt Template

## Principles for Effective Kick-Start Prompts

Kick-start prompts are the starting messages you send to your AI coding tool to set up a new project. They bridge the gap between planning (done in earlier pipeline phases or a separate AI tool) and actual development (done in an IDE with Claude Code, Cursor, or another tool).

### What Makes a Good Kick-Start Prompt

- **High-level references** that point to your context documents – not deep technical details
- **One clear objective per prompt** – never multiple goals
- **Behavioral expectations** – ask questions first, wait for approval before building
- **Document references by file path** – AI should read the actual files, not work from memory
- **No code snippets** – let the AI tool figure out implementation details based on your framework's official documentation

### What to Avoid

- Hardcoded installation commands (frameworks update their setup process frequently)
- Multiple objectives in a single prompt
- Deep technical specifications (the AI tool handles this)
- Over-specification that confuses AI rather than guiding it

---

## Template Structure

### Prompt 1: Project Initialization

```
Read the following project documents:
- [path to MVP Requirements]
- [path to Information Architecture]
- [path to any other planning documents]

Set up the project foundation:
- Create the folder structure based on the Information Architecture document
- Install dependencies using official documentation (look up current installation steps, do not use cached commands)
- Set up configuration files for [your framework]
- Create the development status tracking file at [preferred location, e.g., dev-status/development-context.md]

Before doing anything, share your understanding of the project and ask me 5-7 clarifying questions about the setup.
```

### Prompt 2: Foundation and Navigation

```
Read the Information Architecture document at [path].

Set up the app's navigation structure:
- Create the main navigation based on the IA document
- Set up the entry point and routing
- Create placeholder screens for each main section
- Establish the basic styling foundation (colors, typography, spacing)

Use official documentation to verify you are following current best practices for [your framework]'s navigation patterns. Ask me clarifying questions before implementing.
```

### Prompt 3: First Feature Implementation

```
Read the MVP Requirements document at [path], specifically the section about [highest-priority feature].

Implement [feature name]:
- Reference the design files for visual direction (use the Figma plugin if available, or reference design screenshots at [path])
- Focus on making it functional first – we will polish the visuals later
- Reuse any components or patterns already established in the project
- Ask me clarifying questions before starting implementation

After implementation, update the development status file at [status file path].
```

### Prompt 4: Design System Extraction

```
Review the code from the first feature implementation.

Refactor to extract a reusable design system:
- Identify all hardcoded color values, font sizes, spacing, and other style values
- Create a design token file with base values
- Create semantic alias files that reference the base tokens
- Replace all hardcoded values with semantic aliases
- Establish naming conventions for the project going forward

Document the design system structure in the development status file.
```

### Prompt 5: Second Feature (With Established Patterns)

```
Read the MVP Requirements document at [path], specifically the section about [second-priority feature].
Read the development status file at [status file path] to understand current patterns and components.

Implement [feature name]:
- Reuse components and design system patterns from the first feature
- Reference the design files for visual direction
- Follow the established naming conventions and code structure
- If you need new design tokens, add them following the established pattern

After implementation, update the development status file.
```

---

## Customizing the Template

### By AI Tool

**Claude Code (terminal):**
- Prompts can reference agent files for automated workflows
- Use the agent pipeline after the initial setup prompts
- Add references to CLAUDE.md for persistent rules

**Cursor:**
- Prompts work as individual chat messages
- Reference files by path so Cursor can read them
- Consider using Cursor's rules file for persistent instructions

**Claude Code inside Cursor's terminal:**
- Best of both worlds – use Cursor for IDE features and Claude Code for AI capabilities
- Setup prompts go to Claude Code in the terminal
- Visual editing happens in Cursor's interface

### By Project Type

**Web application:**
- Prompt 1 includes framework setup (React, Vue, Next.js, etc.)
- Prompt 2 focuses on routing and layout components
- Consider adding a prompt for API integration if backend is separate

**Mobile application:**
- Prompt 1 includes platform-specific setup (Xcode, Android Studio, etc.)
- Prompt 2 focuses on navigation patterns specific to mobile (tab bars, navigation stacks)
- Consider adding a prompt for device-specific features (camera, location, etc.)

**Full-stack application:**
- Prompt 1 includes both frontend and backend setup
- Consider splitting Prompt 3 into backend implementation and frontend implementation
- Add a prompt for API contract between frontend and backend

### Number of Prompts

The 5-prompt structure is a starting point. Adapt based on complexity:
- **Simple project (landing page, portfolio):** 2-3 prompts may be enough
- **Medium project (web app, mobile app):** 4-6 prompts
- **Complex project (full-stack with AI, integrations):** 6-8 prompts

The key is keeping each prompt focused on one objective. If a prompt tries to do too much, split it.

---

## After the Kick-Start Phase

Once the initial prompts are complete, you transition from setup mode to development mode:

1. **Set up the agent pipeline** (if using Claude Code) for automated development workflows
2. **Establish commit discipline** – commit after every feature
3. **Continue with feature prompts** that reference existing components and patterns
4. **Update the status file** regularly to maintain context across conversations
