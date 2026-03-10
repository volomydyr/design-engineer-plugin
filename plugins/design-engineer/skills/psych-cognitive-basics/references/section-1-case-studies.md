# Section 1: Fundamentals of Cognitive Interaction – Case Studies

Adapted case studies showing how cognitive interaction principles are applied in real products.

---

## Case Study 1: Reducing Cognitive Load in a Multi-Step Checkout

### The Problem

An e-commerce platform had a single-page checkout that displayed all fields simultaneously: shipping address (7 fields), billing address (7 fields), payment details (4 fields), delivery options (3 options), gift wrapping (2 options), coupon code, and order summary. The page contained 24 interactive elements visible at once. Cart abandonment at the checkout step was 68%.

### Principles Applied

- **Cognitive Load** – the single page overwhelmed users with too much information at once
- **Progressive Disclosure** – information could be revealed in stages matching the user's progress
- **Chunking** – related fields needed to be grouped into logical steps
- **Miller's Law** – each step needed to stay within the 5-9 element limit

### The Solution

The checkout was redesigned into a 4-step flow:

1. **Shipping** (5 fields) – name, address line 1, address line 2, city, postal code. Country and state pre-filled from account. A checkbox "Same as billing" eliminated 7 duplicate fields for most users.
2. **Delivery** (3 options) – Standard, Express, Next Day. Each option showed price and estimated date. The most popular option was pre-selected (smart default, applying Hick's Law).
3. **Payment** (4 fields) – card number (chunked as 4 groups of 4 digits), expiry, CVV, cardholder name. Saved payment methods shown as recognizable card icons (Recognition Over Recall).
4. **Review** (read-only summary) – all previous selections displayed for confirmation. Edit links next to each section for quick corrections.

A progress bar at the top showed the current step and remaining steps. Each step had a single primary action button ("Continue to Delivery", "Continue to Payment", "Place Order").

### Results

- Cart abandonment at checkout dropped from 68% to 41%
- Average checkout completion time decreased by 35%
- Error rate in address fields dropped by 50% (fewer fields visible meant fewer mistakes)
- Users reported feeling "less overwhelmed" in post-purchase surveys

### Takeaway

Breaking a complex task into steps is not just about visual cleanliness. It reduces the actual cognitive processing required at each decision point. The key was ensuring each step had a clear, singular purpose and no more than 5-7 interactive elements.

---

## Case Study 2: Applying Fitts's Law and Proximity to a Mobile Dashboard

### The Problem

A project management mobile app had its primary actions (Create Task, Search, Notifications) in the top navigation bar. On modern phones with 6+ inch screens, these buttons were in the hardest-to-reach zone for one-handed use. User analytics showed that 72% of users held their phone in their right hand, and the most-used action (Create Task) required a full-thumb stretch or a second hand.

Additionally, the dashboard showed all project metrics in a flat list: tasks completed, tasks overdue, team members, recent activity, upcoming deadlines, budget status, and risk indicators – 7 separate cards with no grouping or hierarchy.

### Principles Applied

- **Fitts's Law** – critical actions were placed far from the natural thumb position, making them slow and difficult to reach
- **Law of Proximity** – the flat dashboard treated all metrics as equally important and unrelated
- **Visual Hierarchy** – no visual differentiation between critical metrics (overdue tasks) and informational metrics (team member count)
- **Chunking** – the 7 metrics needed logical grouping

### The Solution

**Navigation redesign:**
- Moved primary actions to a bottom navigation bar with 4 tabs (Dashboard, Tasks, Team, Settings)
- Added a floating action button (FAB) for "Create Task" centered at the bottom – the highest-frequency action got the easiest-to-reach position
- Search was integrated into each relevant tab (contextual search) rather than being a global button in the top bar
- Notifications became a badge on the Dashboard tab icon, with the notification list accessible via a bottom sheet (swipe up)

**Dashboard redesign:**
- Grouped metrics into two clusters: "Action Required" (overdue tasks, approaching deadlines) and "Status Overview" (completed tasks, team activity)
- "Action Required" used red/orange accent colors and was positioned at the top with larger cards
- "Status Overview" used neutral colors and smaller, more compact cards below
- Budget and risk indicators moved to a dedicated "Insights" section accessible via a tab or swipe

### Results

- "Create Task" usage increased by 40% (easier to reach = used more often)
- Dashboard engagement time increased by 25% (users spent more time reviewing grouped metrics)
- Support tickets about "where is [feature]" decreased by 60%

### Takeaway

Fitts's Law is not theoretical – the physical distance between the user's thumb and an interactive element directly affects usage frequency. When paired with Proximity (grouping related items) and Visual Hierarchy (making urgent items visually dominant), the entire experience becomes more intuitive. The most important action should always be in the easiest-to-reach position.

---

## Case Study 3: Recognition, Discoverability, and Hick's Law in a SaaS Settings Panel

### The Problem

A SaaS application had a settings panel with 35 options displayed in a single scrollable list. Each option was a text label with a text input field – no toggles, no dropdowns, no visual grouping. Users were expected to remember valid values (e.g., type "daily", "weekly", or "monthly" for email frequency). The settings page had the highest support ticket rate of any page in the product.

New features added to the product over 2 years were announced only via email. Once users closed the email, there was no way to discover these features within the product itself.

### Principles Applied

- **Recognition Over Recall** – text input fields required users to remember valid values instead of showing them
- **Hick's Law** – 35 options in a flat list created decision paralysis
- **Discoverability** – new features had no in-product discovery mechanism
- **Chunking** – settings needed logical grouping
- **Progressive Disclosure** – not all settings needed to be visible at once

### The Solution

**Settings restructuring:**
- Organized 35 settings into 6 groups: Account (5), Notifications (4), Privacy (4), Display (3), Integrations (6), and Advanced (13)
- Each group became a collapsible section, with Account and Notifications expanded by default (most frequently changed) and Advanced collapsed
- This applied Hick's Law (6 section choices instead of 35 setting choices) and Progressive Disclosure (Advanced hidden until needed)

**Input controls redesign:**
- Replaced text inputs with appropriate controls: toggles for on/off settings, dropdown menus for multi-choice settings (email frequency: Daily / Weekly / Monthly), sliders for numeric ranges
- Added preview text showing current value even when sections were collapsed
- This applied Recognition Over Recall – users could see and choose from valid options rather than guessing

**Feature discovery:**
- Added a small "New" badge next to recently-added settings, visible for 30 days after release
- Created a "What's New" panel accessible from the settings header, listing recent additions with one-sentence descriptions and direct links
- First-time visitors to a section with new features saw a brief highlight animation on the new item

### Results

- Settings-related support tickets dropped by 78%
- "Invalid value" errors eliminated entirely (no more text input for structured data)
- New feature adoption increased by 3x within the first month of release
- Average time to find and change a setting dropped from 47 seconds to 12 seconds

### Takeaway

The combination of Recognition Over Recall (show options, do not ask users to remember) and chunked Progressive Disclosure (group and hide complexity) transforms a frustrating experience into an efficient one. Discoverability mechanisms ensure that product investments in new features actually reach users, rather than being invisible.
