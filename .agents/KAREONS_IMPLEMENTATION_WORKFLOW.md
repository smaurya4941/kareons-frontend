# Kare-Ons Herbal — AI Implementation Workflow

## PURPOSE

Every frontend task should follow this workflow.

Do not immediately start coding after reading a feature request.

---

# PHASE 1 — UNDERSTAND

Determine:

- What is the user trying to accomplish?
- Which page is affected?
- Which component is affected?
- What is the primary CTA?
- What states exist?
- Is this desktop, mobile, or both?
- Does existing functionality need to be preserved?

---

# PHASE 2 — INSPECT

Before changing code, inspect:

- relevant page
- parent components
- child components
- existing UI primitives
- design tokens
- styling
- responsive behavior
- state management
- API/query logic
- existing motion utilities

Search the repository before creating anything new.

---

# PHASE 3 — IDENTIFY REUSE

Find whether existing components can be reused.

Check:

- Button
- IconButton
- Card
- ProductCard
- Modal
- Drawer
- Input
- Badge
- Skeleton
- Toast
- Tabs
- Accordion
- Header
- Footer

Also check:

- hooks
- stores
- API clients
- query utilities
- motion variants

---

# PHASE 4 — PLAN

Before implementation, mentally define:

```text
Page hierarchy
↓
Component structure
↓
State
↓
Data flow
↓
Responsive behavior
↓
Motion
↓
Accessibility
↓
Loading/error/empty states