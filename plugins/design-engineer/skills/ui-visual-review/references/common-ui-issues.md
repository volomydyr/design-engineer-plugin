# Common UI Issues in AI-Generated Implementations

## Overview

AI-generated UI frequently contains specific, predictable issues. The most common violations are hardcoded values (AI writes specific color values instead of reusing established tokens) and redundant components (AI creates new components from scratch instead of reusing existing ones every time new designs are shared). Catching these early prevents accumulated visual debt.

---

## 1. Typography Issues

### Title Case vs. Sentence Case
AI frequently uses title case where sentence case was intended. This is one of the most common issues in AI-generated UI.

**What to check**:
- Button labels, navigation titles, and headings match the design's casing style
- Placeholder text follows the correct capitalization pattern
- Menu items and tab labels use the intended case style

### Incorrect Font Weights and Sizes
AI may use different font weights or sizes than what the design specifies, especially when translating from Figma's font naming to code equivalents.

**What to check**:
- Font weights match the design exactly (not approximated)
- Font sizes reference semantic aliases, not hardcoded values
- Line heights are explicitly set, not left at framework defaults

### Missing Letter Spacing and Line Height
AI often ignores letter spacing and line height adjustments that are specified in the design, producing text that feels different even when the font and size are correct.

**What to check**:
- Letter spacing (tracking) matches design specifications
- Line height (leading) is explicitly set for multi-line text
- Paragraph spacing is consistent with the design

### Generic Fonts
AI may use system default fonts instead of the project's chosen typeface.

**What to check**:
- All text elements use the project's font family
- No fallback to system fonts where custom fonts should be used
- Font loading and registration is properly implemented

---

## 2. Spacing and Layout Issues

### Inconsistent Padding and Margins
AI generates spacing values that are close to the design but not exact, leading to subtle inconsistencies across screens.

**What to check**:
- Horizontal page padding is consistent across all screens
- Vertical spacing between sections follows the design system spacing scale
- Component internal padding matches design specifications
- No hardcoded spacing values – all should reference design tokens

### Alignment Problems
Elements that should align across screens or within containers may be slightly off.

**What to check**:
- Text baselines align where expected
- Icons and text are vertically centered correctly
- Grid alignment is consistent across all cards and list items
- Content edges align across different sections of the same screen

### Responsive Behavior
Incorrect responsive behavior is especially common when auto-layouts were missing in Figma frames.

**What to check**:
- Elements resize correctly when screen width changes
- Text wraps appropriately without breaking layout
- Spacing adjusts proportionally on different screen sizes
- No content overflow or clipping on smaller screens

### Bottom Safe Area
Mobile implementations frequently fail to handle the bottom safe area properly.

**What to check**:
- Content does not overlap with system navigation bars
- Bottom spacing accounts for device-specific safe areas
- Scroll content extends behind the safe area with proper insets
- Fixed bottom buttons respect the safe area

---

## 3. Design System Violations

### Hardcoded Color Values
This is the most common AI violation. AI writes specific color values (RGB, hex) instead of referencing established semantic tokens.

**What to check**:
- No `Color(red:green:blue:)` or `Color(hex:)` calls in view code
- No system color references (`Color.blue`) where semantic colors should be used
- All colors reference semantic aliases from the design system
- New colors are added to the design system, not used inline

### Hardcoded Font Sizes
Similar to color violations, AI hardcodes font sizes instead of using typography aliases.

**What to check**:
- No `.font(.system(size: N))` calls in view code
- No hardcoded font weight declarations
- All typography references semantic aliases
- New typography styles are added to the design system first

### Magic Numbers for Spacing
AI uses literal numbers for padding and margins instead of spacing constants.

**What to check**:
- No `.padding(16)` or equivalent with literal values
- No hardcoded frame sizes for standard components
- All spacing values reference design system tokens
- Spacing is consistent with the established spacing scale

### Inline Styles
AI writes styling code directly in views instead of using reusable modifiers or components.

**What to check**:
- No repeated style combinations that should be view modifiers
- No styling logic in view bodies that belongs in the design system
- Style definitions are centralized and reusable

---

## 4. Component Issues

### Redundant Components
AI creates new components from scratch instead of reusing existing ones every time new designs are shared. This is the second most common AI violation after hardcoded values.

**What to check**:
- New components are not duplicates of existing ones with different names
- Button implementations use the established button component and its variants
- Input fields use the established input component
- Container patterns reuse existing container components

### Naming Convention Mismatches
AI-generated components may not follow the project's established naming patterns.

**What to check**:
- Component names follow the project's naming convention
- File names match the component naming pattern
- Method and property names are consistent with existing code

### Monolithic Views
AI generates large, monolithic views instead of breaking them into smaller subviews.

**What to check**:
- No view body exceeds 50 lines
- Complex layouts are broken into logical subviews
- Each subview has a single, clear responsibility
- Subviews are reusable where applicable

### Duplicated Logic
AI duplicates logic across views instead of extracting shared functionality.

**What to check**:
- No repeated data fetching logic across multiple views
- No duplicated validation logic
- Shared state management is centralized
- Common calculations are extracted into utility functions

---

## 5. Visual Fidelity Issues

### Creative Interpretations
AI sometimes adds elements not present in the design or interprets design intent differently than intended.

**What to check**:
- No extra decorative elements added that were not in the design
- No rearranged element ordering
- No added or removed sections
- Layout structure matches the design exactly

### Missing Visual Details
AI may omit subtle visual details that contribute to the polished look of the design.

**What to check**:
- Shadows are present where the design specifies them
- Borders and dividers match design specifications
- Gradients are implemented correctly (direction, stops, colors)
- Corner radii match the design for each component

### Incorrect Icon Usage
AI may use different icons or miss icons entirely.

**What to check**:
- Correct icons from the project's icon system are used
- Icon sizes match design specifications and token constants
- Icon colors use semantic aliases
- No system icons used where project-specific icons should be

### Animation and Transition Differences
AI may implement different animations or timings than what the design intent suggests.

**What to check**:
- Transition types match the intended behavior
- Animation durations reference design tokens
- Easing curves are correct
- Animations respect the system "reduce motion" preference

---

## Review Report Format

For each issue found during visual review, document:

- **What**: specific description of the issue
- **Where**: file path and line reference
- **Expected**: what the design specifies
- **Actual**: what was implemented
- **Fix**: recommended correction with code example
- **Priority**: design system violations first, then typography, then component reuse, then visual fidelity
