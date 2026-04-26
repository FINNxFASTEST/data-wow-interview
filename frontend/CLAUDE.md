# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js 15, port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint via next lint
```

No test suite is configured yet.

## Architecture

**NestNext-cleanArch** is a boilerplate app built with Next.js 15 App Router, TypeScript, and Tailwind CSS.

### Pages (App Router)

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Home: hero, featured campsites, destinations, testimonials |
| `/campsites/[id]` | `src/app/campsites/[id]/page.tsx` | Campsite detail: gallery, amenities, seasonal calendar, pitches, reviews, booking sidebar |
| `/booking` | `src/app/booking/page.tsx` | Multi-step checkout: contact, guests, add-ons, payment |
| `/admin` | `src/app/admin/page.tsx` | Admin panel with sidebar navigation and swappable views |
| `/login` | `src/app/login/page.tsx` | Login form |
| `/register` | `src/app/register/page.tsx` | Registration form |

Pages are wired to the live backend via `src/services/`. The `/admin` page is the main host/admin dashboard connected to real API calls.

### Component Organization

```
src/components/
  common/     # Shared: Nav, Footer, Scene, Icons, Stars, Badge, Button, StatusPill
  home/       # FeatureCard, SearchBar, TestimonialCard, DestinationCard
  detail/     # Gallery, SeasonalCalendar, CampPitchList, BookingSidebar
  booking/    # FormCard, Field, StepHeader
  admin/      # AdminSidebar, Panel, StatCard, views/{Dashboard,Camps,Bookings,Users,Coupons,Settings}View
  ui/         # shadcn/ui primitives (pre-generated; edit sparingly)
```

`src/lib/utils.ts` exports the `cn()` helper (clsx + tailwind-merge). Path alias `@/*` maps to `src/*`.

### Forms

Forms use **react-hook-form** with **Zod** schemas for validation (via `@hookform/resolvers/zod`). The `src/components/booking/Field.tsx` wrapper handles label + error display for form fields.

### Design System

**Colors** are defined as CSS variables in `src/app/globals.css` (`:root`) and mirrored in `tailwind.config.ts`. Always use CSS variables (`var(--ink)`, `var(--paper)`, `var(--ember)`, etc.) or the corresponding Tailwind tokens (`forest-900`, `sage-500`, `cream-100`, etc.) — never raw hex values.

Key tokens: `--ink` (near-black), `--paper` (warm white background), `--ember` (primary CTA orange), `--forest-*` (dark greens), `--sage-*` (mid greens), `--cream-*` (light warm fills), `--line` / `--line-strong` (borders).

**Typography**: Bai Jamjuree is the only font, loaded via `@font-face` in globals.css from `/public/fonts/`. Tailwind utilities `font-sans`, `font-serif`, and `font-thai` all resolve to Bai Jamjuree. Use `font-thai` for Thai text, `font-serif` for headings, `font-sans` for eyebrow labels (uppercase tracking).

**Styling approach**: Mix of Tailwind utility classes and inline `style` props with CSS variables. Use the `cn()` helper from `src/lib/utils.ts` (clsx + tailwind-merge) when composing conditional classes.

### Scene Component

`src/components/common/Scene.tsx` renders an SVG illustrated landscape background used throughout the app (hero sections, cards, avatars, etc.). It accepts a `variant` prop: `"hero" | "dusk" | "forest" | "lake" | "meadow" | "cabin" | "night"`. Each variant has its own color palette. Typically used with `position: absolute; inset: 0` inside a `position: relative` container.

### Icons

All icons are inline SVG components exported from `src/components/common/Icons.tsx`. Add new icons there following the same pattern — use the `base` spread for consistent stroke settings.

### UX Source Files

`frontend/ux/` contains the original design exports used as reference:
- `components/` — JSX versions of each page (Home, Booking, Detail, Admin, Scene, Shared)
- `design-canvas.jsx` — a pan/zoom Figma-like canvas wrapper used for design review (not part of the app)

When implementing new UI, cross-reference the corresponding file in `frontend/ux/components/` for the intended design.
