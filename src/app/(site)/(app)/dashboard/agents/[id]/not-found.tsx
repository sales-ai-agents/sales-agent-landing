import Link from "next/link";
import { Bot } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import React from "react";

const AgentNotFound = () => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4">
      <Bot className="text-primary h-10 w-10" />
      <div className="text-center">
        <h3 className="text-2xl font-medium">Агента не знайдено</h3>
        <p className="text-muted-foreground mt-1 text-lg">
          Можливо, його було видалено або URL некоректний
        </p>
      </div>
      <Link href="/dashboard/agents" className={buttonVariants({ variant: "outline" })}>
        Повернутися до агентів
      </Link>
    </div>
  );
};

export default AgentNotFound;
