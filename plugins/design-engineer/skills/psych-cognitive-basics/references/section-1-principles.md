# Section 1: Fundamentals of Cognitive Interaction -- Principles

All 10 principles covering how to simplify information, reduce brain load, and make interaction intuitive.

---

## 1. Cognitive Load

**Definition**: The brain can only process a limited amount of information at once; overload causes fatigue, errors, and abandonment.

### UX Application

When designing interfaces, it is essential to dose information and simplify how users interact with the system. In practice this means:

- **Break complex forms into steps** -- instead of one long form with 20 fields, create a multi-step wizard that shows 3-5 fields per step
- **Group related elements** -- cluster similar items visually so the brain processes them as single units rather than individual pieces
- **Use familiar design patterns** -- rely on conventions users already know (hamburger menus, search bars at the top, shopping cart icons) rather than inventing novel interactions
- **Limit visible data** -- instead of a table with 20 columns, show 5-6 key columns and let users expand or filter for the rest
- **Split navigation** -- separate primary navigation (main features) from secondary navigation (settings, help, account)
- **Structure text content** -- use headings, subheadings, and visual hierarchy so users can scan rather than read every word

There are three types of cognitive load to consider:

1. **Intrinsic load** -- the inherent complexity of the task itself. You cannot eliminate this, but you can break it into manageable chunks.
2. **Extraneous load** -- unnecessary complexity added by poor design. This is what you should aggressively reduce. Confusing layouts, unclear labels, and inconsistent patterns all add extraneous load.
3. **Germane load** -- the productive mental effort of learning and creating mental models. Good design supports this by using progressive disclosure and consistent patterns.

### Good Example

A checkout flow that splits the process into clear steps: Shipping Address, Payment Method, Review Order. Each step shows only the relevant fields. A progress bar shows where the user is. Previously entered information is summarized but not editable on each step unless the user explicitly goes back.

### Bad Example

A single-page checkout that shows shipping fields, billing fields, payment fields, coupon codes, gift wrapping options, delivery preferences, and order summary all at once. The user must scroll through everything, and it is unclear which fields are required vs. optional. No progress indication exists.

---

## 2. Hick's Law

**Definition**: The more options presented, the longer a person takes to decide and the more they hesitate. Decision time increases logarithmically with the number of choices.

### UX Application

In interfaces, it is important to limit the number of options and group them so users can make choices more easily:

- **Category-based reduction** -- instead of showing all 50 products at once, organize them into 5-7 categories that users can browse one at a time
- **Navigation limits** -- keep main navigation menus to 5-7 items. If you have more sections, use a hierarchy (primary nav with dropdowns or secondary nav)
- **Step-by-step forms** -- break registration into multiple simple steps instead of one long page with many fields
- **Smart defaults** -- pre-select the most common option so users only need to change it if their preference differs
- **Progressive filtering** -- let users narrow down options gradually (first by category, then by price range, then by features) rather than presenting all filter options simultaneously

The mathematical relationship is: decision time = a + b * log2(n), where n is the number of equally probable choices. This means that going from 2 options to 4 options adds less decision time than going from 20 to 40. But in practice, even small increases in choice count can cause hesitation when the options are similar or complex.

### Good Example

A restaurant ordering app that first shows 5-7 food categories (Appetizers, Main Courses, Salads, Desserts, Drinks, Specials). Tapping a category reveals 6-8 items with clear photos and short descriptions. Each item has a simple "Add to Order" button with a quantity selector.

### Bad Example

A restaurant app that shows all 80 menu items in a single scrollable list with no categories, no filters, and tiny text. Each item has 5 customization options visible immediately (size, extras, sauce, sides, cooking preference), creating a combinatorial explosion of choices at every scroll position.

---

## 3. Fitts's Law

**Definition**: The farther away and smaller the interaction target, the longer it takes the user to reach it and the harder it is to hit accurately. Acquisition time is a function of distance to and size of the target.

### UX Application

When designing interfaces, place elements that are frequently used closer to where the user's cursor or finger naturally rests, and size them proportionally to their importance:

- **Proportional sizing** -- important action buttons should be larger than secondary controls. A "Submit" button should be bigger than a "Cancel" link
- **Natural zones** -- place frequently-used elements near the natural resting position of the cursor (center-right on desktop) or finger (bottom half of screen on mobile)
- **Mobile thumb zones** -- on mobile, key interactive elements should be in the comfortable thumb reach area (the bottom 40% of the screen). Avoid placing critical actions in the top corners
- **Edge targeting** -- menus and toolbars benefit from being at screen edges because the edge acts as an infinite boundary, making it easier to click without precise aiming
- **Touch target minimums** -- interactive elements on touch devices should be at least 44x44 points (Apple) or 48x48 dp (Material Design) to prevent mis-taps
- **Spacing between targets** -- small, closely-spaced targets increase error rates. Add adequate padding between interactive elements, especially on touch devices

### Good Example

A mobile app with a bottom navigation bar containing 4-5 main tabs. The primary action (e.g., "New Post" or "Add Item") uses a larger, centered floating action button. Destructive actions like "Delete" are placed in menus or require confirmation, reducing accidental activation.

### Bad Example

A mobile app where the main action buttons are in the top-left corner of the screen, requiring users to stretch their thumb to the farthest point. Small icon buttons (24x24) are placed close together in a toolbar with no padding between them. The "Delete" button is the same size and proximity as the "Save" button.

---

## 4. Miller's Law

**Definition**: A person can simultaneously hold 7 plus or minus 2 items in short-term memory. This defines the optimal number of elements a user can effectively work with at one time.

### UX Application

Interfaces that contain important information should break it into small, meaningful groups of 5-9 elements maximum:

- **Navigation items** -- keep main navigation to 5-7 items. If you have more, use grouping (mega menus) or hierarchy (primary/secondary navigation)
- **Process steps** -- if a wizard or onboarding flow has more than 7 steps, group them into phases (e.g., "Setup", "Customization", "Verification")
- **List items** -- when displaying lists of options, preferences, or features, keep each visible group to 5-9 items before introducing a category break or pagination
- **Form fields** -- group form fields into logical sections of no more than 7 related fields each
- **Tab bars** -- mobile tab bars should have 3-5 tabs maximum. More than 5 becomes difficult to distinguish and remember

When the number of items exceeds 9, group them into logical categories or subdivisions so users can process the information without cognitive overload. The "magic number 7" is a guideline, not a hard rule -- the actual capacity varies by the complexity of the items being remembered.

### Good Example

A project management tool that shows tasks grouped into columns by status (To Do, In Progress, Review, Done). Each column shows 5-7 tasks at a time with a "Show more" button. The sidebar navigation has 6 main sections with clear icons.

### Bad Example

A dashboard that displays 15 equally-weighted metrics in a single row of cards, with a sidebar containing 12 ungrouped navigation items and a notification panel showing 20 unfiltered alerts simultaneously.

---

## 5. Recognition Over Recall

**Definition**: It is easier for people to recognize something familiar than to recall it from memory without cues. Recognition requires only a stimulus to trigger memory; recall requires generating information from scratch.

### UX Application

This principle is rooted in how our memory and cognitive processes work. In interfaces, it is always better to show users available options rather than forcing them to remember:

- **Date selection** -- instead of asking users to type a date in a specific format (DD/MM/YYYY), show a calendar picker where they can visually select the date
- **Search with suggestions** -- provide autocomplete, search history, and suggested queries so users do not need to formulate exact search terms from memory
- **Settings as controls** -- use toggles, sliders, and dropdown menus instead of text fields that require users to know and type valid values
- **Recent items** -- show recently accessed files, documents, or pages so users can click to return rather than remembering paths or names
- **Visual previews** -- show thumbnails of files, templates, or options rather than just text names
- **Contextual menus** -- display available actions near the item being acted upon, rather than expecting users to remember keyboard shortcuts or menu locations

### Good Example

A design tool that shows a panel of recently opened files with visual thumbnails, displays available fonts in a dropdown with visual previews of each typeface, and offers a color picker with recently used colors prominently displayed. Keyboard shortcuts are shown next to menu items so users learn them through recognition.

### Bad Example

A design tool where the user must type exact font names into a text field, remember hex color codes without any picker, navigate files by typing full paths, and use keyboard shortcuts that are never shown in the interface.

---

## 6. Progressive Disclosure

**Definition**: Gradually reveal detailed information as needed, so the user is not overwhelmed with everything at once. Show the most essential content first and provide paths to deeper detail.

### UX Application

Instead of overloading the interface with all possible options and details, reveal additional information sequentially, matching the user's context and needs:

- **Product listings** -- show name, photo, and price first. Reveal detailed specifications, reviews, and comparisons only when the user clicks through to the product detail page
- **Application settings** -- make simple, frequently-used options immediately accessible. Hide advanced configuration in an "Advanced Settings" section that users can expand
- **Registration forms** -- ask for basic information first (name, email, password). Show additional fields (profile photo, preferences, integrations) in subsequent steps or after initial setup
- **Help content** -- show a brief answer first with a "Learn more" link that expands to the full explanation
- **Feature onboarding** -- introduce features one at a time as users encounter them naturally, rather than showing a 10-slide tutorial upfront

The key insight is matching information complexity to user expertise level. Novice users need simplicity; expert users need access to power. Progressive disclosure serves both by layering the experience.

### Good Example

A cloud storage app that shows files with name, icon, and date modified in the default view. Clicking a file opens a preview. A "Details" panel reveals size, sharing permissions, version history, and activity log. Advanced sharing options (link expiration, password protection, download limits) are behind an "Advanced" toggle within the sharing dialog.

### Bad Example

A cloud storage app where every file in the list immediately shows its name, size, type, date created, date modified, date last accessed, owner, sharing status, 5 permission levels, version count, and a full activity log, making each file entry span multiple lines and requiring horizontal scrolling.

---

## 7. Chunking

**Definition**: Grouping information into logical blocks of 3-5 elements helps users better perceive, process, and remember content.

### UX Application

Chunking is a method of organizing content by breaking information into smaller pieces that are easier to understand and remember:

- **Form organization** -- group personal data fields together (name, date of birth), contact information together (email, phone, address), and profile settings together (avatar, bio, notifications). Use visual separators or section headers between groups
- **Text content** -- split instructions and documentation into short paragraphs with descriptive subheadings. Avoid walls of text
- **Menu structure** -- break menu options into categories with dividers. A settings menu with 20 items should be divided into groups like "Account", "Privacy", "Notifications", "Display"
- **Number formatting** -- display phone numbers as (555) 123-4567 rather than 5551234567. Show credit card numbers as 4242 4242 4242 4242 rather than 4242424242424242
- **Content cards** -- group related information into visual cards (e.g., a user card showing avatar + name + role as one chunk)
- **Step indicators** -- group multi-step processes into phases of 3-4 steps each, with phase labels

### Good Example

A phone settings screen organized into clearly labeled sections: "Connectivity" (Wi-Fi, Bluetooth, Mobile Data), "Display" (Brightness, Night Mode, Font Size), "Sound" (Volume, Ringtone, Vibration), "Privacy" (Lock Screen, App Permissions, Location). Each section has 3-4 items with a clear heading and visual separator.

### Bad Example

A settings screen with 25 options listed in a single flat list with no grouping, no section headers, and no visual separation. Wi-Fi settings sit next to font size, which sits next to notification preferences, which sits next to storage management.

---

## 8. Visual Hierarchy

**Definition**: Important interface elements should visually stand out through size, color, contrast, or whitespace so users instantly understand the relative importance of different elements.

### UX Application

Use size, color, contrast, spacing, and typography strategically so users immediately grasp the importance and structure of the interface:

- **Typography scale** -- establish clear heading levels. H1 should be notably larger and bolder than H2, which should be notably larger than body text. This creates a scannable structure
- **Primary vs. secondary actions** -- primary action buttons (Save, Submit, Buy) should be visually dominant (filled, high-contrast color). Secondary actions (Cancel, Back) should be visually subdued (outlined, gray, smaller)
- **Whitespace as hierarchy** -- more whitespace around an element signals greater importance. Section breaks use more spacing than element breaks within a section
- **Color for meaning** -- use color consistently to signal status (red for errors, green for success, yellow for warnings) and importance (brand color for primary actions, neutral colors for secondary)
- **Content scanning** -- users scan in F-patterns (left-to-right, top-to-bottom with decreasing attention). Place the most important content at the top-left. Use bold text for key phrases within paragraphs

Visual hierarchy is one of the areas where cognitive science intersects with Gestalt principles. The brain automatically assigns importance based on visual weight, and designers must align visual weight with actual importance.

### Good Example

A landing page where the headline is 48px bold, the subheading is 24px regular, body text is 16px, and the CTA button is a large, high-contrast rectangle with bold text. Supporting information (testimonials, features) uses consistent but visually lighter treatment. Whitespace separates major sections clearly.

### Bad Example

A landing page where all text is the same size and weight, the primary CTA button looks identical to navigation links, there is no whitespace between sections, and a secondary "Terms of Service" link is styled the same as the main "Sign Up" button.

---

## 9. Law of Proximity

**Definition**: Elements placed close together are perceived as related to each other, while elements farther apart are perceived as belonging to different groups.

### UX Application

In interfaces, it is important to group related elements together and separate different groups using distance:

- **Form labels and fields** -- a label should be closer to its corresponding input field than to any adjacent field. The spacing between a label and its field should be smaller than the spacing between one field group and the next
- **Product cards** -- group the product name, price, and "Add to Cart" button close together as a unit. Separate this purchasing cluster from the product specifications or reviews section with more whitespace
- **Navigation grouping** -- items within the same section of a menu should be closer to each other than to items in a different section. Use visual dividers or spacing to reinforce section boundaries
- **Dashboard widgets** -- related metrics should be grouped in the same card or section. Unrelated metrics should be in separate visual containers
- **Button groups** -- related actions (Edit, Duplicate, Delete) should be grouped together and separated from unrelated actions (Share, Print)

The key rule: **internal spacing must be tighter than external spacing.** The gap between elements within a group should always be smaller than the gap between groups.

### Good Example

A form where each field group (label + input + helper text) has 4px internal spacing, and there is 24px spacing between field groups. Section headers have 32px spacing above them. The "Submit" and "Cancel" buttons are grouped together at the bottom with 12px between them, separated from the last field group by 40px.

### Bad Example

A form where all labels, inputs, and helper texts are evenly spaced at 16px apart regardless of grouping. The label for "Email" is equidistant from the Email input and the "Name" input above it. There is no visual distinction between where one field ends and another begins.

---

## 10. Discoverability

**Definition**: The interface should clearly show users what actions are possible and how to perform them, without requiring instructions, guesswork, or prior knowledge.

### UX Application

This principle ensures that users can easily find and understand the functionality of the interface without additional instructions:

- **Visual cues** -- use clear visual affordances (buttons that look clickable, text fields that look editable, links that look tappable). Interactive elements must be visually distinct from static content
- **Standard patterns** -- leverage interaction patterns users already know (swipe to delete, pull to refresh, long-press for context menu). Novel interactions need explicit guidance
- **Meaningful icons** -- icons should be universally recognizable or paired with text labels. Avoid abstract icons without labels, as they force users to guess their meaning
- **Feedback on actions** -- every user action should produce visible feedback (button press animation, loading indicator, success/error message). Silent interactions leave users uncertain whether anything happened
- **Onboarding for new features** -- when introducing new capabilities, show contextual tooltips, coach marks, or subtle animations that draw attention to the new element. The user should never wonder "how do I do X?"
- **Visible state** -- make the current state of the system visible (selected tab highlighted, active filters shown, undo available). Users should always know where they are and what is happening

The core principle: users should never have to guess how to do something -- it should be obvious from the interface itself.

### Good Example

A collaborative document editor where the toolbar buttons use universally recognized icons with tooltip labels on hover. The cursor changes shape to indicate different modes (text editing, drawing, selecting). A subtle blue dot appears on new features with a brief explanation on first hover. Unsaved changes show a dot indicator in the tab title.

### Bad Example

A document editor where toolbar buttons are unlabeled abstract shapes, there is no visual difference between editing and viewing modes, new features appear without any indication, and there is no feedback when the user saves a document -- they must check the file system to confirm the save worked.
