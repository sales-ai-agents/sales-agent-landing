# Developer Guidelines — VoiceAgent

## 🚨 Most Critical Rules (Prevent Common Issues)

1. **Use `const` over `let`** — Prevents accidental reassignment
2. **Use `===` instead of `==`** — Prevents type coercion bugs
3. **Functions under 20 lines** — Keeps complexity manageable
4. **Type everything explicitly** — Prevents runtime type errors
5. **Use `async/await` over Promises** — Cleaner error handling
6. **Try-catch for async operations** — Proper error handling
7. **Early returns** — Reduces nesting and complexity
8. **Meaningful names** — No abbreviations or single letters
9. **Max 4 levels of nesting** — Prevents cognitive overload
10. **Files under 300 lines** — Prevents file complexity issues
11. **Organized imports** — External → internal → relative
12. **"use client" only when needed** — Keep components server-side by default

---

## Table of Contents

1. [Function Patterns](#function-patterns)
2. [Variable and Constant Patterns](#variable-and-constant-patterns)
3. [TypeScript Typing Patterns](#typescript-typing-patterns)
4. [Code Organization and Complexity](#code-organization-and-complexity)
5. [React and Next.js Patterns](#react-and-nextjs-patterns)
6. [Quick Reference Checklist](#quick-reference-checklist)

---

## Function Patterns

### Naming and Typing

```typescript
// ❌ Bad - no types, unclear name
function calc(x, y) {
  return x + y;
}

// ✅ Good - camelCase, typed parameters and return
const calculateTotal = (price: number, tax: number) => {
  return price + tax;
}
```

**Quick Reference**:

- Functions: camelCase (calculateTotal, getUserData)
- Parameters: explicit types (price: number)
- Return types: always specify (: number, : void, : Promise<T>)

### Length and Complexity

```typescript
// ❌ Bad - too long, nested
function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.permissions) {
        /* 25+ lines */
      }
    }
  }
}

// ✅ Good - under 20 lines, early returns
const processActiveUser = (user: User) => {
  if (!user?.active) return;
  if (!user.permissions) return;
  updateUserStatus(user);
}
```

### Async Patterns

```typescript
// ❌ Bad - Promise chains, no error handling
function fetchData() {
  return fetch('/api').then(res => res.json());
}

// ✅ Good - async/await, typed, error handling
const fetchData = async () => {
  const response = await fetch('/api');
  return response.json();
}
```

---

## Variable and Constant Patterns

### Variable Declaration Rules

```typescript
// ❌ Bad - let when const works, abbreviations
let usr = 'john';
let cfg = { timeout: 5000 };

// ✅ Good - const preference, meaningful names
const userName = 'john';
const configuration = { timeout: 5000 };
```

**Quick Reference**:

- Prefer `const` over `let`
- Use `let` only when reassignment is needed
- Never use `var`
- Full words, no abbreviations

### Constants and Magic Numbers

```typescript
// ❌ Bad - magic numbers
if (status === 'pending') return;
const timeout = 5000;

// ✅ Good - named constants, UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT_MS = 5000;
const STATUS_PENDING = 'pending' as const;

if (status === STATUS_PENDING) return;
```

---

## TypeScript Typing Patterns

### Interface vs Type

```typescript
// ✅ Use interface for object shapes
interface User {
  name: string;
  email: string;
}

// ✅ Use type for unions and intersections
type Status = 'loading' | 'success' | 'error';
type ApiResponse = User & { timestamp: number };
```

### Generic Constraints

```typescript
// ❌ Bad - unconstrained generic
function process<T>(item: T): T {
  return item;
}

// ✅ Good - constrained with meaningful name
const processEntity<TEntity extends BaseEntity> = (entity: TEntity): TEntity => {
  return { ...entity, updatedAt: new Date() };
}
```

### Utility Types

```typescript
// ✅ Use built-in utilities over manual type manipulation
type PartialUser = Partial<User>;
type UserName = Pick<User, 'name'>;
type PublicUser = Omit<User, 'password'>;
type Handler = Parameters<typeof handleClick>[0];
type Result = ReturnType<typeof processData>;
```

### Const Assertions

```typescript
// ✅ Use as const for immutable data and literal types
const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number]; // 'light' | 'dark'

const CONFIG = { apiUrl: '/api', timeout: 5000 } as const;
```

---

## Code Organization and Complexity

### File Organization

```typescript
// ✅ Import order: external → internal → relative
import { useState } from "react";                    // 1. External packages
import { Button } from "@/components/ui/button";     // 2. Internal (path alias)
import { formatDate } from "./utils";                // 3. Relative imports
```

**Rules**:

- Files under 300 lines
- One component per file
- Import order: external → `@/` internal → `./` relative
- Group imports with blank lines between categories

### Error Handling

```typescript
// ❌ Bad - swallowing errors
async function saveUser(user: User) {
  try {
    await userRepository.save(user);
  } catch (e) { /* Silent failure */ }
}

// ✅ Good - proper error handling with context
const saveUser = async (user: User) => {
  try {
    const savedUser = await userRepository.save(user);
    return { success: true, data: savedUser };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to save user: ${message}` };
  }
}
```

### Nesting and Complexity

```typescript
// ❌ Bad - exceeds 4 levels
function processOrder(order: Order): void {
  if (order) {
    if (order.items) {
      for (const item of order.items) {
        if (item.valid) {
          if (item.inStock) { processItem(item); }
        }
      }
    }
  }
}

// ✅ Good - max 4 levels, early returns
const processOrder = (order: Order) => {
  if (!order?.items) return;
  for (const item of order.items) {
    if (!item.valid) continue;
    if (item.inStock) processItem(item);
  }
}
```

### Switch Over If-Else Chains

```typescript
// ❌ Bad - long if-else chain
if (status === 'loading') return 'Loading...';
else if (status === 'success') return 'Done!';
else if (status === 'error') return 'Error!';

// ✅ Good - switch statement
switch (status) {
  case 'loading': return 'Loading...';
  case 'success': return 'Done!';
  case 'error': return 'Error!';
  default: return 'Unknown';
}
```

---

## React and Next.js Patterns

### Server vs Client Components

```typescript
// ✅ Server component (default) — no directive needed
// Use for: data fetching, metadata, static content, SEO-critical pages
// ALL marketing pages should be Server Components unless they need interactivity
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = () => {
  return <h1>Dashboard</h1>;
}

export default DashboardPage

// ✅ Client component — only when you need interactivity
// Use for: useState, useEffect, event handlers, browser APIs, audio, animations
"use client";

import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

export default Counter
```

**Rendering Strategy:**

| Route Group | Strategy | "use client" |
|-------------|----------|--------------|
| `(marketing)/*` | SSG (Static) | Only in interactive sections (calculator, audio, navbar scroll) |
| `(app)/dashboard/*` | CSR (Dynamic) | Yes — all dashboard pages are client-rendered |

**Rules**:

- Default to server components (no "use client" directive)
- Add "use client" only when you need: hooks, event handlers, browser APIs
- Keep "use client" boundary as low in the tree as possible
- Page components should be server components when possible
- Marketing section components that are purely presentational should NOT have "use client"

### Component Structure

```typescript
// ✅ Good component pattern for this project
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentCardProps {
  agent: Agent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AgentCard = ({ agent, onEdit, onDelete }: AgentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(): Promise<void> {
    setIsDeleting(true);
    try {
      await onDelete(agent.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {agent.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(agent.id)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AgentCard
```

### Form Patterns (React Hook Form + Zod)

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  greeting: z.string().min(10, "Greeting must be at least 10 characters"),
  voice: z.enum(["male", "female", "neutral"]),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface AgentFormProps {
  onSubmit: (data: AgentFormData) => Promise<void>;
  defaultValues?: Partial<AgentFormData>;
}

const AgentForm = ({ onSubmit, defaultValues }: AgentFormProps)=> {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Agent"}
      </Button>
    </form>
  );
}

export default AgentForm
```

### State Management Patterns

```typescript
// ✅ Zustand store — for client-side UI state
import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));
```

```typescript
// ✅ React Query — for server state (API data)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      const response = await fetch('/api/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
  });
}

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAgentData): Promise<Agent> => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create agent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
```

### API Route Patterns

```typescript
// ✅ Next.js App Router API route
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createAgentSchema = z.object({
  name: z.string().min(1),
  greeting: z.string().min(10),
  voice: z.enum(['male', 'female', 'neutral']),
});

export const POST = (request: NextRequest) => {
  try {
    const body = await request.json();
    const validated = createAgentSchema.parse(body);

    // Create agent logic here
    const agent = { id: crypto.randomUUID(), ...validated };

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

### Styling Patterns

```typescript
// ✅ Use Tailwind utilities directly
<div className="flex items-center gap-4 rounded-lg border p-4">

// ✅ Use cn() helper for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "rounded-lg border p-4",
  isActive && "border-primary bg-primary/5",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// ✅ Use CVA for component variants
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

### SEO/GEO Patterns (Marketing Pages)

```typescript
// ✅ Use Next.js Metadata API for every marketing page
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Name — VoiceAgent",
  description: "Clear, factual description optimized for AI citation.",
  openGraph: {
    title: "Feature Name — VoiceAgent",
    description: "Concise OG description.",
    type: "website",
  },
};

// ✅ Add JSON-LD structured data where appropriate
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }),
  }}
/>
```

**SEO/GEO Rules:**

- Proper heading hierarchy (one h1 per page, h2 → h3 → h4)
- Semantic HTML elements (section, article, nav, main, aside)
- Clear, factual content with direct answers (optimized for AI citation)
- FAQ section with question-answer pairs (structured for LLM extraction)
- Quantifiable claims (time savings calculator, success rates)
- Problem → Solution → Value structure for industry content
- All images with descriptive alt text

---

## Quick Reference Checklist

### Essential (Check Every Time)

- [ ] Use `const` over `let` for variables
- [ ] Use `===` instead of `==` for comparisons
- [ ] Functions under 20 lines with meaningful names
- [ ] Explicit types for parameters and returns
- [ ] Try-catch for all async operations
- [ ] No `any` types

### React/Next.js (Check Every Component)

- [ ] Server component by default (no "use client" unless needed)
- [ ] "use client" boundary as low as possible
- [ ] Props interface defined with explicit types
- [ ] Loading and error states handled
- [ ] Accessible — proper labels, ARIA attributes, keyboard support

### Code Structure (Daily Habits)

- [ ] Early returns to reduce nesting
- [ ] Max 4 levels of nesting depth
- [ ] Meaningful names without abbreviations
- [ ] Named constants instead of magic numbers
- [ ] Files under 300 lines
- [ ] Import order: external → @/ internal → ./ relative
- [ ] Code formatted with Prettier (`pnpm format`)

### State and Data

- [ ] Zustand for client UI state
- [ ] React Query for server/API state
- [ ] Zod schemas for all form validation
- [ ] Proper error handling in API routes
