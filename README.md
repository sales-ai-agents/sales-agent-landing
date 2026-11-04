# AI Voice Agent

A web platform that enables small business owners to create AI-powered voice agents for automating routine phone calls — appointment confirmations, reminders, lead qualification, follow-ups, and CRM updates.

**Core UX principle:** Visit → Listen → Create an Agent. No technical jargon. No developer required.

**Target users:** Non-technical small business owners (auto repair shops, beauty salons, dental/medical clinics, online stores) who spend hours daily on routine phone calls.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5.x |
| UI Library | shadcn/ui (Radix + CVA) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table 8 |
| State (server) | TanStack Query 5 |
| State (client) | Zustand 5 |
| Audio | Howler.js 2 |
| Charts | Recharts 3 |
| Animations | Framer Motion 12 |
| Real-time | LiveKit Client |
| Linting | ESLint 9 + Prettier |
| Package Manager | pnpm |

---

## Architecture

### Rendering Strategy

| Route Group | Strategy | Reason |
|-------------|----------|--------|
| `(site)/(marketing)/*` | SSG (Static Site Generation) | SEO/GEO critical, content rarely changes |
| `(site)/(app)/dashboard/*` | CSR (Client-Side Rendering) | Authenticated, dynamic data |
| `(landing)/landing`, `(landing)/blog/*` | SSG (Static Site Generation) | New landing and blog: own root layout, minimal CSS/JS |

### Project Structure

```
src/
├── app/
│   ├── (site)/                 # Root layout #1: Tailwind, providers, marketing + dashboard + auth
│   │   ├── (app)/dashboard/    # Authenticated dashboard (agents, call-logs, contacts, settings)
│   │   ├── (auth)/             # Sign-in, sign-up, password reset
│   │   └── (marketing)/        # Public marketing pages
│   ├── (landing)/              # Root layout #2: standalone landing + blog (calls4u.css only)
│   ├── globals.css             # Global styles (Tailwind)
│   ├── global-not-found.tsx    # 404 for unmatched URLs (multiple root layouts)
│   ├── llms.txt/               # llms.txt for AI crawlers
│   ├── llms-full.txt/          # Full-text variant for LLMs
│   ├── robots.ts               # SEO robots.txt generation
│   └── sitemap.ts              # SEO sitemap generation
├── components/
│   ├── dashboard/              # Dashboard-specific components (sidebar, header, charts, dialogs)
│   ├── landing/                # New landing sections, motion, dialogs and calls4u.css
│   ├── blog/                   # Blog index/article components
│   ├── marketing/              # Marketing page sections (hero, FAQ, industries, builder, etc.)
│   └── ui/                     # Reusable UI primitives (shadcn-style)
├── content/blog/{uk,ru,en}/    # Blog posts per locale (typed content blocks)
├── lib/                        # Utilities, schemas, constants, API config, shared hooks (lib/hooks), i18n (lib/i18n)
├── types/                      # Centralized TypeScript type definitions
└── fonts/                      # Custom fonts (Actay Wide, Gilroy)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the marketing landing page.

### Build

```bash
pnpm build
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

---

## Development Guidelines

Full coding standards are documented in `.ai-governance/guidelines/developer-guidelines.md`.
---

## License

Private — All rights reserved.
