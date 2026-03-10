# Reference Gathering Guide

## Why References Come Before Design

Before opening Figma, spend time looking at apps in your product's domain to get a sense of common patterns. Nothing complex – just collect references so you are not starting from a blank file. This step matters because:

- It prevents blank-canvas paralysis – you have a starting point instead of staring at an empty artboard
- It ensures your design follows established patterns users already understand
- It gives your AI tools concrete visual examples to work from later
- It reveals what competitors and adjacent products do well (and poorly)

## Recommended Tools

### Mobbin (Primary)

Mobbin is the primary reference tool for this workflow. It catalogs real app screens from thousands of iOS, Android, and web applications, organized by screen type, pattern, and industry.

**How to use Mobbin effectively:**

1. **Search by product domain** – Start with your industry (e.g., "healthcare", "finance", "fitness")
2. **Filter by screen type** – Narrow down to specific screens you need (onboarding, home, profile, etc.)
3. **Filter by platform** – Match your target platform (iOS, Android, Web)
4. **Save to collections** – Create a collection for your project and save relevant screens
5. **Look at full flows** – Do not just look at individual screens; study how screens connect in user flows

**What to look for on Mobbin:**

- Layout patterns (card-based, list-based, grid, hero sections)
- Navigation structures (bottom tabs, hamburger menu, tab bar with floating action)
- Onboarding approaches (multi-step, single page, progressive)
- Data display patterns (how similar products show detail views, lists, dashboards)
- Empty states and error handling
- Interaction patterns (bottom sheets, modals, swipe actions)

### Dribbble and Behance (Supplementary)

Use these for visual inspiration, but with caution:

- Many designs on Dribbble are concepts, not shipped products – they may look beautiful but be impractical
- Focus on designs that show real product screens, not artistic explorations
- Use these for color palette inspiration and typography direction, not for layout decisions
- Filter by "Product Design" or "UI Design" categories

### App Store / Play Store (Direct Research)

Download and use 3-5 competing or adjacent apps directly:

- Experience the actual interaction patterns firsthand
- Notice what feels natural and what feels clunky
- Take screenshots of screens that feel particularly good or particularly bad
- Pay attention to micro-interactions, transitions, and feedback mechanisms

## Reference Collection Process

### For Each Key Screen

1. **Find 3-5 reference examples** from different apps in your domain
2. **Screenshot each reference** or save the Mobbin link
3. **Annotate what you like** – Be specific:
   - "The card layout with subtle shadows and 16px border radius"
   - "Bottom sheet that shows 3 quick actions before expanding"
   - "Typography hierarchy: large bold title, medium subtitle, small body"
4. **Note what you do NOT like** – Anti-patterns are just as useful:
   - "Too many competing colors on the dashboard"
   - "Navigation buried in hamburger menu"
   - "Text too small on the detail view"

### Categories to Cover

For a complete reference set, collect examples across these categories:

**Layout and Structure:**
- Screen layout approach (full-width, padded, card-based)
- Content hierarchy and visual weight distribution
- Scroll behavior (sticky headers, floating buttons, parallax)
- Responsive behavior across screen sizes

**Color and Theme:**
- Primary and accent color usage
- Light mode and dark mode approaches
- Background colors and surface hierarchy
- Status colors (success, error, warning, info)

**Typography:**
- Heading styles and sizes
- Body text treatment
- Label and caption styles
- Font pairing (if multiple typefaces are used)

**Components and Patterns:**
- Button styles (primary, secondary, ghost, icon-only)
- Input field treatments (outlined, filled, underlined)
- Card designs and list item layouts
- Navigation bar and tab bar patterns
- Bottom sheets, modals, and overlays

**Interactions and Feedback:**
- Loading states and skeleton screens
- Success and error feedback
- Transition patterns between screens
- Gesture-based interactions (swipe, pull-to-refresh)

## Organizing Your References

Structure your reference collection by screen, not by source app:

```
References/
  Onboarding/
    - App A onboarding step 1 (like: illustration style, progress indicator)
    - App B onboarding (like: minimal text, single action per step)
    - App C onboarding (dislike: too many steps, small text)
  Home/
    - App A dashboard (like: card layout, clear hierarchy)
    - App D home (like: quick actions, personalized greeting)
  Detail View/
    - App B record detail (like: clean data display, collapsible sections)
    - App E detail (like: action bar at bottom, share functionality)
```

## From References to Design Direction

After collecting references, synthesize them into a clear direction:

1. **Identify patterns that repeat** – If 3 out of 5 healthcare apps use card-based home screens, that is a strong pattern signal
2. **Pick a visual tone** – Combine references to describe the target aesthetic in 2-3 sentences (e.g., "Clean and clinical but warm. White backgrounds with soft blue accents. Large, readable typography with generous spacing.")
3. **Define what makes yours different** – What will you do differently from the references, and why
4. **List specific elements to adopt** – Concrete decisions like "bottom tab navigation", "card-based dashboard", "single-step onboarding with illustration"

## How References Feed Into the Next Steps

These references directly inform the Figma workflow:

- You will design only 5-8 key screens in Figma (not every screen)
- These screens establish the visual direction that AI will extend to other parts of the app
- The references document becomes context you share with AI alongside Figma designs
- During development, when AI generates a new screen, you compare it against both your Figma designs and the original references to catch deviations
