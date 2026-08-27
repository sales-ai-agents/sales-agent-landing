import Link from "next/link";
import { Bot } from "lucide-react";
import { buttonVariants } from "@/components/ui";

export default function AgentNotFound() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="bg-primary/5 rounded-full p-3">
        <Bot className="text-primary h-6 w-6" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium">Агента не знайдено</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Можливо, його було видалено або URL некоректний
        </p>
      </div>
      <Link href="/dashboard/agents" className={buttonVariants({ variant: "outline" })}>
        Повернутися до агентів
      </Link>
    </div>
  );
}
