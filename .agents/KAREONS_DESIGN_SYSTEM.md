# Kare-Ons Herbal — Design System

## STATUS

This document is the visual design authority for the Kare-Ons Herbal frontend.

Any new frontend UI must follow this system.

Do not introduce a separate visual language for individual pages.

---

# 1. DESIGN NORTH STAR

Kare-Ons should communicate:

Natural
+
Premium
+
Calm
+
Trustworthy
+
Modern
+
Human
+
Effortless

The interface should feel like a premium herbal wellness brand.

The user should subconsciously feel:

"This brand feels trustworthy."

"The products are easy to understand."

"The website feels high quality."

"Buying is easy."

---

# 2. BRAND CHARACTER

The visual personality should be:

- sophisticated
- warm
- natural
- clean
- confident
- understated
- approachable

Avoid:

- childish visuals
- excessive decoration
- excessive gradients
- aggressive animations
- overly technical interfaces
- excessive neon colors
- visual clutter

---

# 3. COLOR SYSTEM

Use semantic design tokens.

Conceptual structure:

--color-primary
--color-primary-hover
--color-primary-active
--color-primary-foreground

--color-secondary
--color-secondary-foreground

--color-background
--color-surface
--color-surface-elevated

--color-text
--color-text-secondary
--color-text-muted

--color-border
--color-border-subtle

--color-success
--color-warning
--color-error
--color-info

Do NOT scatter raw colors throughout components.

---

# 4. COLOR DIRECTION

Preferred visual relationship:

Primary:
Deep herbal/natural green

Secondary:
Muted sage / natural tone

Background:
Warm cream / soft neutral

Surface:
Clean warm white / neutral

Text:
Deep charcoal

Accent:
Restrained earthy/golden tone

Semantic colors:
Accessible success/warning/error colors

---

# 5. COLOR RULES

1. Primary green should be used intentionally.
2. Do not use multiple unrelated greens.
3. Do not use neon green.
4. Do not use color as the only status indicator.
5. Maintain accessible contrast.
6. Product photography should remain visually dominant.
7. Accent colors should be used sparingly.
8. Backgrounds should not compete with product imagery.

---

# 6. TYPOGRAPHY

Typography is a primary design element.

Use a consistent type hierarchy:

Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
Price

Conceptual hierarchy:

Hero:
large and editorial

H1:
strong page identity

H2:
section hierarchy

H3:
component hierarchy

Body:
high readability

Caption:
supporting information only

---

# 7. TYPOGRAPHY RULES

- Avoid excessively small text.
- Avoid excessive font weights.
- Use line-height intentionally.
- Keep body copy readable.
- Keep long paragraphs comfortable to read.
- Do not introduce random fonts per page.
- Use `next/font` where appropriate.
- Follow existing project font tokens if already established.

---

# 8. SPACING SYSTEM

Use a consistent spacing scale.

Conceptually:

space-1
space-2
space-3
space-4
space-5
space-6
space-8
space-10
space-12
space-16
space-20
space-24

Use smaller spacing for:

- icon + label
- metadata
- form controls
- card internals

Use larger spacing for:

- sections
- hero areas
- major page transitions

Avoid arbitrary spacing values.

---

# 9. LAYOUT

Use:

- responsive containers
- predictable page gutters
- consistent alignment
- CSS Grid
- Flexbox
- logical responsive behavior

Avoid primary layouts based on absolute positioning.

---

# 10. CONTAINER SYSTEM

Pages should generally use a consistent maximum content width.

Example conceptual structure:

```text
Full viewport
    ↓
Page container
    ↓
Content grid
```

---

# 11. ICON SYSTEM

Material Symbols Outlined is the current project icon system.

- Implemented via `<Icon name="..." />` (`src/components/ui/Icon.tsx`).
- Decorative icons beside readable text must be marked `aria-hidden="true"`.
- Icon-only interactive controls (buttons, links) must include an accessible label via `aria-label` or visually hidden text.
- Do not import raw external icon libraries directly into individual components.

---

# 12. MOTION & FEEDBACK

CSS and Tailwind transitions are the current standard for interaction feedback:
- `.card-lift`: Subtle elevation on hover for cards.
- `.btn-squish:active`: Immediate physical feedback on press.
- `.hover-electric`: Subtle border glow and lift.
- Transitions must respect `prefers-reduced-motion`.

---

# 13. CORE UI PRIMITIVES

All forms and UI layouts must use centralized design system primitives:
- `Button` / `ButtonLink` (`src/components/ui/Button.tsx`)
- `Input` (`src/components/ui/Input.tsx`)
- `Select` (`src/components/ui/Select.tsx`)
- `Badge` (`src/components/ui/Badge.tsx`)
- `EmptyState` (`src/components/ui/EmptyState.tsx`)
- `Icon` (`src/components/ui/Icon.tsx`)
- `Price` (`src/components/ui/Price.tsx`)
- `StarRating` (`src/components/ui/StarRating.tsx`)
- `QuantityStepper` (`src/components/ui/QuantityStepper.tsx`)
- `Toast` (`src/components/ui/Toast.tsx`)