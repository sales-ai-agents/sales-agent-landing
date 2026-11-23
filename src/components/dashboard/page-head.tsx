import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeadProps {
  word: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  tone?: "a" | "b";
}

const TONES = {
  a: "bg-linear-to-br from-card via-primary/5 to-primary/15",
  b: "bg-linear-to-b from-card to-muted",
} as const;

export const PageHead = ({ word, title, description, actions, tone = "a" }: PageHeadProps) => (
  <header
    data-word={word}
    className={cn(
      "relative isolate min-h-60 overflow-hidden rounded-4xl px-8 py-9",
      "after:font-heading after:text-card/50 after:pointer-events-none after:absolute after:right-2 after:-bottom-15 after:-z-10 after:text-[200px] after:leading-none after:content-[attr(data-word)] after:select-none",
      TONES[tone]
    )}
  >
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="font-heading text-4xl md:text-7xl">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  </header>
);
