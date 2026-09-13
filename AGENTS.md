# Kare-Ons Herbal — Repository AI Instructions

## PURPOSE

You are working on the Kare-Ons Herbal production application.

Kare-Ons Herbal is an herbal/wellness ecommerce platform with:

- Next.js frontend
- Laravel backend/API
- ecommerce functionality
- product discovery
- product detail pages
- cart
- checkout
- customer account functionality
- wishlist
- orders
- informational/brand content

The frontend was migrated from Laravel Blade to Next.js.

Do NOT reintroduce Laravel Blade as the primary frontend implementation unless explicitly requested.

---

# MANDATORY INSTRUCTIONS

Before implementing, modifying, refactoring, or reviewing ANY frontend UI/UX:

1. Read `.agents/KAREONS_DESIGN_SYSTEM.md`
2. Read `.agents/KAREONS_UI_UX.md`
3. Read `.agents/KAREONS_FRONTEND_RULES.md`
4. Follow `.agents/KAREONS_IMPLEMENTATION_WORKFLOW.md`

These documents collectively define the Kare-Ons frontend standards.

---

# SOURCE OF TRUTH PRIORITY

When making frontend decisions, use this priority:

1. Explicit user requirement
2. Existing production behavior that must be preserved
3. Existing Kare-Ons design system
4. Existing reusable components
5. Existing project architecture
6. General best practices

Do not replace existing project conventions with personal preferences without a reason.

---

# CORE DESIGN GOAL

Kare-Ons should feel:

Natural
Premium
Calm
Trustworthy
Modern
Fast
Intuitive
Easy to shop

The website should feel like a premium herbal/wellness brand.

It should NOT look like:

- a generic SaaS dashboard
- a developer portfolio
- a template marketplace
- an overly animated website
- a generic "green organic" template

---

# COMPONENT REUSE

Before creating a component:

1. Search the repository.
2. Check whether an existing component already solves the problem.
3. Check whether an existing component can be extended with a variant.
4. Prefer composition over duplication.

Do not create duplicate:

- buttons
- cards
- dialogs
- drawers
- inputs
- product cards
- badges
- loaders
- toast systems
- animation utilities

unless there is a genuine architectural reason.

---

# ICONS

Use the project's existing icon system.

If no project-specific system exists, prefer Lucide React.

Do not casually introduce multiple icon libraries.

Icon-only controls MUST have accessible labels.

---

# ANIMATION

Use Motion/Framer Motion only when it improves:

- feedback
- hierarchy
- comprehension
- perceived responsiveness
- spatial relationships

Do not add animation merely because it looks impressive.

Respect reduced-motion preferences.

---

# NEXT.JS

Prefer:

Server Components
    ↓
for static/data-rendered UI

Client Components
    ↓
only where interactivity/browser state is actually required

Do not add `"use client"` unnecessarily.

Do not move entire page trees to the client merely to add small interactions.

---

# PERFORMANCE

Frontend quality includes performance.

Always consider:

- image optimization
- bundle size
- unnecessary client JavaScript
- unnecessary dependencies
- unnecessary API calls
- layout shift
- animation performance
- Core Web Vitals

Prefer CSS transform/opacity for animation.

---

# RESPONSIVE DESIGN

Every frontend feature must work across:

- small mobile
- standard mobile
- tablet
- laptop
- desktop
- large desktop

Mobile is not a reduced desktop implementation.

---

# ACCESSIBILITY

Every feature must consider:

- semantic HTML
- keyboard navigation
- focus states
- screen-reader labels
- contrast
- touch targets
- form accessibility
- reduced motion

---

# PRODUCT / BUSINESS DATA

Never invent:

- ingredients
- certifications
- medical claims
- clinical claims
- product benefits
- testing claims
- guarantees
- shipping promises
- return policies

Use only information actually available from the application/business data.

---

# BEFORE FINISHING

Review the implementation for:

- design consistency
- responsive behavior
- loading state
- empty state
- error state
- success feedback
- accessibility
- reduced motion
- performance
- component reuse
- unnecessary dependencies
- unnecessary Client Components

The feature is not complete merely because it technically works.

---

# FINAL PRINCIPLE

Every frontend change should make Kare-Ons feel more coherent.

Do not optimize for:

"more effects"

Optimize for:

"better user experience."