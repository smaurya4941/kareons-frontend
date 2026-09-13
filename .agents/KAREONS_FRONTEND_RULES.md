# Kare-Ons Herbal — Frontend Engineering Rules

## 1. FRAMEWORK

Frontend:

Next.js
React
TypeScript

Backend:

Laravel/API

Do not mix frontend responsibilities into Laravel Blade unless explicitly requested.

---

# 2. SERVER VS CLIENT

Default to Server Components.

Use Client Components only when required for:

- state
- event handlers
- browser APIs
- interactive widgets
- client-side animation requiring it
- client-only libraries

Do not add:

"use client"

to large component trees unnecessarily.

---

# 3. COMPONENT DESIGN

Prefer:

small
focused
reusable
composable

components.

Avoid:

massive components
duplicated markup
page-specific copies of shared UI

---

# 4. COMPONENT REUSE

Before creating:

Button
Modal
Drawer
ProductCard
Badge
Input
Skeleton
Toast
Tabs
Accordion
IconButton

search the repository first.

---

# 5. TYPESCRIPT

Prefer strong typing.

Avoid:

`any`

unless there is a documented reason.

Define clear interfaces/types for:

- products
- cart items
- users
- orders
- API responses
- component props

---

# 6. STYLING

Use the project's established styling solution.

If Tailwind is already used:

- use existing tokens
- use reusable class patterns
- avoid arbitrary values when tokens exist
- avoid giant class strings when a component abstraction is more appropriate

Do not introduce another styling framework unnecessarily.

---

# 7. ICONS

Material Symbols Outlined is the current project icon system, encapsulated in the `<Icon>` component (`src/components/ui/Icon.tsx`).

Always use the `<Icon>` component for rendering icons.

Icon-only controls MUST have an accessible name (e.g. `aria-label` or visually hidden text). Decorative icons alongside visible text should be marked `aria-hidden="true"`.

Do not introduce additional icon libraries unless explicitly authorized.

---

# 8. MOTION

CSS and Tailwind transitions are the current motion system for Kare-Ons (`transition-colors`, `transition-transform`, `.card-lift`, `.btn-squish`, `.hover-electric`).

Prefer CSS `transform` and `opacity` for smooth hardware-accelerated animations.

Avoid animating expensive layout properties (width, height, top, left, margins) unnecessarily.

Always respect user `prefers-reduced-motion` settings.

---

# 9. ANIMATION PERFORMANCE

Prefer:

transform
opacity

Avoid animating expensive layout properties unnecessarily.

Do not animate:

large layout changes
width/height
top/left

when transform can achieve the same visual result.

---

# 10. DATA FETCHING

Follow the existing project's API/query architecture.

Do not create a second data-fetching pattern for a single feature.

Reuse existing:

API clients
query hooks
server fetch utilities
cache strategy

where appropriate.

---

# 11. STATE

State management follows a clear tier:
- Server State: Authoritative data from the Laravel REST API fetched inside Server Components, revalidated with `revalidatePath()`.
- Client UI State: React Context for lightweight shared cross-component state (`CountsProvider` for cart/wishlist badge counts, `ToastProvider` for notifications).
- Local State: Standard React `useState` / `useTransition` within interactive Client Components.

Do not introduce external global state libraries (Zustand, Redux, Jotai) unless explicitly approved.

---

# 12. FORMS

Forms use standard HTML elements (`<form>`, `<input>`, `<select>`, `<button>`) and React Server Actions (`src/lib/actions/*`) with native `FormData` handling or controlled component state where required.

Use reusable UI primitives (`Input`, `Select`, `Button`) to maintain consistent styling and accessible label associations.

Do not introduce client-side form libraries (React Hook Form, Formik, Zod) unless specifically authorized.

Validation feedback should be:

clear
predictable
accessible

---

# 13. ERROR HANDLING

Never expose internal server errors directly to users.

Map technical errors to understandable UI messages.

Log/debug technical details appropriately without exposing them.

---

# 14. IMAGES

Use Next.js image optimization where applicable.

Provide:

alt text
appropriate sizing
responsive behavior
stable dimensions

Avoid huge source images when smaller assets are available.

---

# 15. SEO

For public pages, consider:

metadata
title
description
canonical URLs where appropriate
structured data where appropriate
semantic headings

Do not sacrifice UX for SEO.

---

# 16. ACCESSIBILITY

Use:

semantic HTML
button for actions
anchor for navigation
labels for inputs
aria-label where required
focus states

Do not use:

<div onClick>

when a button is appropriate.

---

# 17. RESPONSIVE IMPLEMENTATION

Do not design only for one viewport.

Test:

mobile
tablet
desktop

Pay particular attention to:

- product grids
- navbar
- cart drawer
- modals
- filters
- product galleries
- sticky CTAs

---

# 18. DEPENDENCIES

Before installing a new package:

1. Check package.json.
2. Check whether the functionality already exists.
3. Check whether it can be implemented with existing tools.
4. Only add a dependency when it provides meaningful value.

Avoid dependency sprawl.

---

# 19. PERFORMANCE

Check:

- unnecessary re-renders
- unnecessary client components
- image sizes
- API request duplication
- bundle size
- third-party scripts

Do not optimize blindly.

Optimize meaningful bottlenecks.

---

# 20. CODE QUALITY

Prefer readable code over clever code.

A future developer should understand the implementation quickly.

Do not compress complex logic merely to reduce line count.

---

# 21. BACKWARD COMPATIBILITY

Before changing shared components, inspect their consumers.

A visual change to a shared component can affect many pages.

Do not make a breaking change without checking usage.

---

# 22. UI STATES

Interactive components should account for:

default
hover
focus
active
disabled
loading
success
error
empty

where applicable.

---

# 23. FINAL CHECK

Before finishing:

Run the relevant lint/type/build/test checks available in the repository.

Inspect the affected UI on mobile and desktop.

Check browser console for obvious errors.

Check accessibility basics.

Check loading and error states.