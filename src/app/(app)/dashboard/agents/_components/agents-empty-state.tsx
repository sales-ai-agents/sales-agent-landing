import Link from "next/link";
import { Bot, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AgentsEmptyState() {
  return (
    <div className="border-border bg-background rounded-2xl border p-12 text-center">
      <div className="border-primary/30 bg-primary/5 mx-auto flex h-14 w-14 items-center justify-center rounded-xl border">
        <Bot className="text-primary h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-bold">Агентів ще немає</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Створіть свого першого AI голосового агента, щоб почати
      </p>
      <Link href="/dashboard/agents/create">
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Створити агента
        </Button>
      </Link>
    </div>
  );
}
