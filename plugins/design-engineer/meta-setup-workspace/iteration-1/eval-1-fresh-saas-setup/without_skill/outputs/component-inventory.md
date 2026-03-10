# DesignFlow - Component Inventory

## Primitives
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Button | P0 | default, hover, active, disabled, loading | Primary, secondary, ghost, danger variants |
| Input | P0 | default, focus, error, disabled | Text, email, password, search |
| Badge | P0 | - | Status colors: success, warning, error, info, neutral |
| Avatar | P0 | - | Image, initials fallback; sm, md, lg sizes |
| Icon | P0 | - | SVG wrapper component |
| Text | P1 | - | Typography component with preset styles |
| Link | P1 | default, hover, active, visited | Internal and external variants |

## Forms
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| FormField | P0 | - | Label + input + error wrapper |
| Select | P0 | default, open, disabled | Single select with search |
| Checkbox | P1 | checked, unchecked, indeterminate | - |
| Radio | P1 | selected, unselected | Radio group |
| Toggle | P1 | on, off | - |
| DatePicker | P1 | - | For project deadlines, invoice dates |
| Textarea | P1 | default, focus, error | - |
| FileUpload | P2 | idle, dragging, uploading, complete | For design file uploads |

## Navigation
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Sidebar | P0 | expanded, collapsed | Main app navigation |
| SidebarItem | P0 | default, active, hover | Nav item with icon + label |
| Breadcrumb | P1 | - | Page hierarchy |
| Tabs | P1 | - | Content tabs within pages |
| Pagination | P2 | - | For lists/tables |

## Layout
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Card | P0 | - | Content container with header/body/footer |
| Container | P0 | - | Max-width wrapper |
| Stack | P0 | - | Vertical/horizontal flex layout |
| Grid | P1 | - | CSS grid wrapper |
| Divider | P1 | - | Horizontal/vertical separator |
| PageHeader | P0 | - | Page title + actions area |

## Feedback
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Toast | P0 | success, error, warning, info | Notification system |
| Alert | P1 | success, error, warning, info | Inline alerts |
| Spinner | P0 | - | Loading indicator |
| Progress | P2 | - | Progress bar for uploads, project completion |
| EmptyState | P1 | - | No data placeholder with illustration |
| Skeleton | P2 | - | Loading placeholder |

## Data Display
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Table | P0 | - | Sortable, with row actions |
| StatCard | P0 | - | Dashboard metric display |
| List | P1 | - | Styled list with items |
| Timeline | P2 | - | Project activity timeline |
| Chart | P2 | - | Simple bar/line charts for dashboard |

## Overlays
| Component | Priority | States | Notes |
|-----------|----------|--------|-------|
| Modal | P0 | open, closed | Dialog with backdrop |
| Dropdown | P0 | open, closed | Action menu |
| Tooltip | P1 | - | Hover information |
| Popover | P2 | open, closed | Rich content popup |
| CommandPalette | P2 | open, closed | Quick action search (Cmd+K) |

## DesignFlow-Specific Components
| Component | Priority | Notes |
|-----------|----------|-------|
| ProjectCard | P0 | Project summary with status, deadline, client |
| ClientCard | P0 | Client info with contact details |
| InvoiceRow | P0 | Invoice line item in table |
| TimeEntry | P1 | Time tracking entry display |
| ProjectStatusBadge | P0 | Visual status: active, paused, completed, overdue |
| DeadlineIndicator | P1 | Shows days remaining with color coding |
| RevenueChart | P2 | Monthly revenue visualization |
| ActivityFeed | P2 | Recent project activity stream |

## Implementation Priority
1. **P0 (Week 1-2)**: Core primitives + layout + key feature components
2. **P1 (Week 3-4)**: Extended form controls + navigation + feedback
3. **P2 (Week 5+)**: Data visualization + advanced overlays + polish
