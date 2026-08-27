import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui";

export function AddAgentCard() {
  return (
    <div className="border-border bg-background flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
        <Plus className="text-primary h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">Додати нового агента</h3>
      <p className="text-muted-foreground mt-1 text-xs">
        Створіть нового ШІ-агента та налаштуйте його за кілька хвилин
      </p>
      <Link href="/dashboard/agents/create">
        <Button className="mt-4" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Створити агента
        </Button>
      </Link>
    </div>
  );
}
