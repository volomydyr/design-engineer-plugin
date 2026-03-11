# Prototyping Workflow

## The Principle: Functional First, Beautiful Later

Starting in Figma for the first iteration does not make sense unless you are working with an uncommon design idea or a non-typical layout. For regular web and mobile apps with standard patterns, you can generate prototypes with AI tools like Claude Code. With proper context and the right design process beforehand, AI produces great results.

There is also a practical reason: when you spend days in Figma designing a first iteration, you risk creating a UI that looks great but is technically painful to implement. On the other hand, if AI generates components and provides their code, it means the development will be relatively easy.

## Prerequisites

Before generating a prototype, you should have at minimum:
- **MVP Requirements** – a prioritized list of features to build first
- **Information Architecture** – screen inventory, navigation structure, and user flow details

These documents become the foundation for the prototype. Without them, AI generates generic UIs that do not reflect your specific product decisions.

## The Iteration Process

### Step 1: Set the Stage (Do Not Build Immediately)

When you ask AI to create a prototype, do not tell it to build immediately. Instead:

1. Ask AI to share its thoughts about the prototype based on your documents
2. Ask it to raise clarifying questions about interactions, flows, and edge cases
3. Have it create a detailed development plan for the prototype
4. Wait for your explicit approval before any building begins

This upfront investment prevents misaligned prototypes that waste iteration cycles.

### Step 2: Iterate Extensively

Expect many rounds of refinement. Each round of feedback gets the prototype closer to the idea in your head. This is normal – the process is not about getting it right the first time, but about progressively shaping the prototype through specific feedback.

**Effective feedback looks like:**
- "The navigation bar should have 5 tabs, not 4 – add a Settings tab"
- "Move the call-to-action button to the bottom of the screen, fixed position"
- "The card layout should show a thumbnail image on the left and text on the right"

**Ineffective feedback looks like:**
- "Make it look better" (too vague)
- "Fix everything" (no specific direction)
- "I do not like it" (no actionable information)

### Step 3: Focus on Functionality

The prototype should:
- Cover all key user flows from the Information Architecture
- Include all interactive elements (navigation, buttons, forms)
- Handle main scenarios and edge cases
- Feel like a real product when clicking through

The prototype should NOT:
- Look polished or production-ready
- Include final brand styling
- Cover every possible state (loading, error, empty)
- Be responsive across all screen sizes

Functionality first. Visual polish comes later in Figma (for key screens) and during actual development.

### Step 4: Know When to Stop Iterating

Stop iterating on the prototype when:
- All key user flows are functional and testable
- The prototype accurately represents the product concept
- It is good enough to test with real users
- Further refinement would be about visual polish rather than functionality

## Testing the Prototype

### Setting Up Tests

Host the prototype locally (`python3 -m http.server`) or deploy to static hosting. When the prototype is ready for testing:

1. Open the prototype URL in a browser (e.g., `http://localhost:8000/prototype.html`)
2. Paste it into a user testing tool (Useberry, Maze, or similar)
3. Create a test script with specific tasks for users to complete

If you have never used the testing tool before, ask AI for help navigating the interface. If AI's guidance does not match what you see (tools update their interfaces regularly), take a screenshot and share it with AI for personalized guidance.

### Writing a Test Script

A test script defines what tasks users should perform during the test. Good tasks are:
- Specific enough to be measurable ("Find and open a medical record")
- Realistic enough to reflect actual usage
- Ordered to follow a natural user journey
- Written without leading language that hints at the correct answer

Ask AI to help create the test script based on your MVP Requirements and user personas.

## What Comes After Testing

After user testing, you move to analysis (see the testing-analysis-guide). Based on the results:

- **Adjust the prototype** for another round of testing if significant issues were found
- **Update planning documents** (requirements, architecture) based on what was validated or invalidated
- **Move to high-fidelity design** in Figma for the key screens that passed validation
- **Cut features** that tested poorly from the MVP scope

## The Figma Phase (After Prototyping)

Once the prototype is validated:

1. **Collect design references** – if not already gathered upstream (via `ui-design-references`), look at similar products on platforms like Mobbin to understand common patterns
2. **Design key screens only** – not every screen, just the building blocks that set the visual style (typically 5-10 screens)
3. **Let AI develop the rest** – give Claude Code your key Figma screens along with requirements and architecture documents, and it will develop additional screens to match the established UI
4. **Design corrections for mistakes** – when AI's implementation of non-designed screens looks off, design corrections only for those specific frames, share them via the Figma plugin, and let AI adjust

This approach results in fewer Figma screens than traditional design workflows, because AI handles the visual extension of your design language to screens you did not explicitly design.

### Figma Best Practices for AI Implementation

- **Use auto-layouts**: AI needs them to understand responsive behavior. Skip auto-layouts and AI will not know how elements should behave across screen sizes
- **Do not worry about naming layers**: Modern Figma has AI features that name layers automatically
- **Skip components and tokens in Figma**: Let AI create the design system in code. You can give AI a design frame, develop the first iteration, then ask it to refactor the code – creating reusable components, color tokens, and spacing scales programmatically
- **Focus on the visual direction**: Your Figma file is about setting the look and feel, not about documenting every possible state
