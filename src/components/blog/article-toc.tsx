"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ACTIVE_LINE = 0.35;

export interface TocItem {
  readonly id: string;
  readonly label: string;
}

export function ArticleToc({ items }: { items: readonly TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE;
      const current = headings
        .filter((heading) => heading.getBoundingClientRect().top < line)
        .at(-1);
      setActiveId(current?.id ?? items[0]?.id ?? "");
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="Зміст статті">
      <span className="mono">Зміст</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(item.id === activeId && "on")}
          aria-current={item.id === activeId ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
