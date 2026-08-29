# AI Voice Agent — Project Overview

## Product Vision

A web platform that enables small business owners (auto repair shops, beauty salons, dental/medical clinics, online stores) to create AI-powered voice agents for automating routine phone calls — appointment confirmations, reminders, lead qualification, follow-ups, and CRM updates.

**Core UX principle:** Visit → Listen → Create an Agent. No technical jargon. No developer required.

**Target users:** Non-technical small business owners who spend hours daily on routine phone calls.

---

## Architecture Decisions

### Rendering Strategy

| Route Group | Strategy | Reason |
|-------------|----------|--------|
| `(marketing)/*` | SSG (Static Site Generation) | SEO/GEO critical, content rarely changes |
| `(app)/dashboard/*` | CSR (Client-Side Rendering) | Authenticated, dynamic data |

### Why Next.js App Router

- Server Components for zero-JS landing page (Core Web Vitals)
- Built-in Metadata API for SEO/GEO (structured data, Open Graph, JSON-LD)
- Route Groups for `(marketing)` and `(app)` separation
- Middleware for auth guards on dashboard routes
- Image optimization out of the box

## SEO & GEO Strategy

**SEO:**
- Server-rendered landing page with semantic HTML
- Next.js Metadata API for title, description, Open Graph, Twitter cards
- JSON-LD structured data (SoftwareApplication, FAQPage)
- Proper heading hierarchy (one h1 per page)
- Optimized Core Web Vitals (LCP, CLS, INP)

**GEO (Generative Engine Optimization):**
- Clear, factual content with direct answers (optimized for AI citation)
- FAQ section with question-answer pairs (structured for LLM extraction)
- Industry-specific content with problem → solution → value framing
- Quantifiable claims (time savings calculator with real math)
- Schema.org markup for all content types

---

## Technology Stack

| Category | Technology | Reason |
|----------|-----------|--------|
| Framework | Next.js 16 (App Router) | SSG/SSR, SEO, Server Components |
| Language | TypeScript 5.x | Type safety |
| UI Library | shadcn/ui (Radix + CVA) | Composable, accessible |
| Styling | Tailwind CSS 4 | Utility-first |
| Icons | Lucide React | Default shadcn icon set |
| Forms | React Hook Form + Zod | Performant validation |
| Tables | TanStack Table 8 | Headless data tables |
| State (server) | TanStack Query 5 | Data fetching/caching |
| State (client) | Zustand 5 | Lightweight UI state |
| Audio | Howler.js 2 | Cross-browser audio |
| Charts | Recharts 3 | Dashboard stats |
| Animations | Framer Motion 12 | Scroll animations |
| Linting | ESLint 9 + Prettier | Code quality |
| Package Manager | pnpm | Fast, disk-efficient |

## Key Design Principles

1. **Server Components by default** — "use client" only when interactivity is needed
2. **All UI from shadcn/ui** — no custom CSS unless absolutely necessary
3. **SEO/GEO first** for marketing pages — semantic HTML, JSON-LD, Metadata API
4. **Mobile-first responsive** (375px → 1440px)
5. **Accessibility**: Radix primitives + ARIA labels + keyboard navigation
6. **Strict TypeScript**: Zod schemas for all data boundaries, types centralized in `src/types/`
7. **Performance**: dynamic imports for heavy components (Recharts, Howler, Framer Motion)
8. **Named exports, one component per file, kebab-case filenames**
9. **Use `cn()` for conditional classNames**
10. **Data fetching via TanStack Query hooks in `src/hooks/`** — not inline in pages

---