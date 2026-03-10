# Accessibility Audit Checklist

## Foundation Principle

Accessibility is a UX improvement, not just a compliance requirement. Fitts's Law states that the farther away and smaller a target is, the longer it takes the user to reach it and the harder it is to hit. This applies to every user – not just those with disabilities. Larger targets are easier to hit, closer targets are faster to reach, and elements placed in natural thumb or cursor zones are more comfortable to interact with.

Similarly, Cognitive Load theory tells us that simpler interfaces reduce mental effort. Breaking complex forms into multiple steps, grouping related elements, and using familiar design patterns all reduce cognitive burden for everyone.

Building accessible products creates better experiences for all users.

---

## 1. Touch and Click Targets

### Minimum Tap Target Size: 56 Points
Based on Fitts's Law, smaller targets require more precision and slow users down. The minimum tap target size is 56 points (defined as `minTapTargetSize` in the design token system).

- [ ] All buttons meet minimum 56-point tap target size
- [ ] All interactive icons have at least 56-point touchable area (even if the visual icon is smaller)
- [ ] All list item rows that are tappable meet minimum height requirements
- [ ] All form controls (checkboxes, radio buttons, toggles) meet minimum target size
- [ ] Touch targets extend beyond visible boundaries where needed for small visual elements

### Spacing Between Interactive Elements
Adequate spacing prevents accidental taps on adjacent elements.

- [ ] Minimum 8 points of spacing between adjacent interactive elements
- [ ] No overlapping touch targets
- [ ] Grouped interactive elements have clear visual and touchable separation

### Target Placement
In mobile interfaces, key elements should be placed in the comfort zone of the thumb.

- [ ] Primary actions are positioned in natural thumb reach zones
- [ ] Frequently used controls are larger than infrequent ones
- [ ] Menus and toolbars are placed at screen edges where they are easier to tap precisely
- [ ] Destructive actions are not placed where accidental taps are likely

---

## 2. Color and Contrast

### Text Contrast (WCAG AA)
- [ ] Normal text (under 18pt or under 14pt bold): contrast ratio of at least 4.5:1
- [ ] Large text (18pt+ or 14pt+ bold): contrast ratio of at least 3:1
- [ ] Placeholder text in input fields meets minimum contrast requirements

### Non-Text Contrast
- [ ] UI components (buttons, inputs, form controls): contrast ratio of at least 3:1 against adjacent colors
- [ ] Graphical objects (icons, charts, infographics): contrast ratio of at least 3:1
- [ ] Focus indicators: contrast ratio of at least 3:1 against the background

### Color Independence
- [ ] Color is never the only means of conveying information
- [ ] Error states use icons or text labels in addition to red color
- [ ] Success states use icons or text labels in addition to green color
- [ ] Links are distinguishable from body text by more than color alone (underline, weight, or icon)
- [ ] Charts and data visualizations use patterns, labels, or shapes in addition to color
- [ ] Form validation messages include text explanations, not just color changes

---

## 3. Typography and Readability

### Font Sizing
- [ ] Base font size of at least 16 points for body text
- [ ] No text smaller than 12 points anywhere in the interface
- [ ] Heading sizes create a clear visual hierarchy (h1 > h2 > h3)

### Line Height and Spacing
- [ ] Body text line height is at least 1.5x the font size
- [ ] Paragraph spacing is at least 1.5x the line spacing
- [ ] Sufficient spacing between text blocks for visual separation

### Dynamic Type Support
- [ ] Interface supports user-defined text scaling (Dynamic Type on iOS, font scaling on Android/web)
- [ ] Layout does not break when text size is increased to 200%
- [ ] Truncation is handled gracefully (ellipsis, expand/collapse) when text scales up
- [ ] Fixed-height containers expand or scroll when text size increases

### Text Alignment
- [ ] No justified text alignment (use left-aligned for languages that read left-to-right)
- [ ] Text alignment is consistent within sections
- [ ] Centered text is used sparingly and only for short content (headings, labels)

---

## 4. Screen Reader Support

### Accessibility Labels
- [ ] All interactive elements (buttons, links, controls) have descriptive accessibility labels
- [ ] Labels describe the action or purpose, not the visual appearance (e.g., "Submit form" not "Blue button")
- [ ] Labels are concise but informative
- [ ] Decorative elements are hidden from screen readers (marked as not accessible)

### Images and Media
- [ ] Informative images have meaningful alt text describing their content
- [ ] Decorative images are marked as decorative (empty alt text or accessibility hidden)
- [ ] Complex images (charts, diagrams) have detailed descriptions
- [ ] Video content has captions or transcripts

### Heading Structure
- [ ] Heading hierarchy is logical and sequential (h1, then h2, then h3 – no skipping levels)
- [ ] Each screen or page has exactly one h1
- [ ] Headings accurately describe the content that follows them
- [ ] Screen reader navigation by headings produces a meaningful outline

### Forms
- [ ] All form inputs have associated labels (not just placeholder text)
- [ ] Required fields are indicated in a screen-reader-accessible way
- [ ] Error messages are associated with the specific field that has the error
- [ ] Form submission results (success or error) are announced to assistive technology

### Dynamic Content
- [ ] Content changes (loading states, updates, errors) are announced to assistive technology
- [ ] Modal dialogs trap focus and announce their appearance
- [ ] Dismissal of modals returns focus to the triggering element
- [ ] Live regions are used appropriately for real-time updates

---

## 5. Keyboard and Navigation

### Keyboard Access
- [ ] All interactive elements are reachable via keyboard (Tab key) or assistive technology
- [ ] All actions can be triggered via keyboard (Enter or Space)
- [ ] Custom components implement expected keyboard interactions
- [ ] Keyboard shortcuts do not conflict with screen reader commands

### Focus Order
- [ ] Focus order follows a logical reading sequence (top to bottom, left to right for LTR languages)
- [ ] Focus does not jump unexpectedly when interacting with elements
- [ ] Focus is managed correctly when content appears or disappears
- [ ] Modal focus is trapped within the modal until dismissed

### Focus Indicators
- [ ] Focus indicators are visible and clear on all interactive elements
- [ ] Focus style has sufficient contrast (at least 3:1) against the background
- [ ] Focus indicators are not removed or hidden by CSS/styling
- [ ] Custom focus styles are provided when default browser styles are insufficient

### Navigation Traps
- [ ] No keyboard traps – users can always navigate away from any element
- [ ] Custom widgets (dropdowns, date pickers) allow keyboard escape
- [ ] Infinite scroll does not trap keyboard focus
- [ ] Auto-playing media does not trap focus

---

## 6. Motion and Animation

### Reduce Motion
- [ ] All animations respect the system "reduce motion" preference (prefers-reduced-motion on web, UIAccessibility.isReduceMotionEnabled on iOS)
- [ ] When reduce motion is enabled, transitions use simple cuts or fades instead of complex animations
- [ ] Parallax effects are disabled when reduce motion is on
- [ ] Auto-scrolling and auto-advancing content stops when reduce motion is on

### Flash and Flicker
- [ ] No content flashes more than 3 times per second
- [ ] No strobing or rapid color changes
- [ ] Loading indicators use smooth, subtle animations

### Auto-Playing Content
- [ ] Auto-playing media (video, audio, carousels) can be paused or stopped
- [ ] Auto-playing content has visible controls for pause/stop
- [ ] Animated transitions have static fallbacks
- [ ] Background animations do not distract from primary content

---

## 7. Design Token Integration

Accessibility constants should be part of the design token system to ensure consistent enforcement:

- [ ] `minTapTargetSize` (56 points) is defined as a design token
- [ ] Minimum contrast ratios are documented alongside color tokens
- [ ] Minimum font sizes are enforced through typography tokens
- [ ] Spacing between interactive elements uses spacing tokens
- [ ] Animation durations reference token constants that can be zeroed out for reduce motion

---

## Severity Levels

When reporting accessibility issues, categorize by severity:

### Critical (Blocks Access)
- Interactive elements with no accessibility labels
- Zero contrast text (invisible to some users)
- Keyboard traps that prevent navigation
- Missing form labels that make input impossible with screen readers

### Major (Significant Barrier)
- Tap targets below 56-point minimum
- Text contrast below 4.5:1 for normal text
- Missing focus indicators
- Color used as the only means of conveying information
- No support for dynamic type / text scaling

### Minor (Inconvenience)
- Suboptimal heading structure (not blocking, but confusing)
- Decorative images not hidden from screen readers
- Focus order slightly illogical but navigable
- Missing reduce motion support for non-essential animations

---

## Audit Report Format

For each issue found, document:

- **Severity**: Critical, Major, or Minor
- **Criterion**: which WCAG guideline or design principle is violated
- **Location**: specific screen, component, or code file
- **Issue**: what the problem is
- **Fix**: recommended solution with implementation guidance
