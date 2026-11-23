"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { CLAUDE_EXAMPLE_PROMPTS } from "../_lib/claude-connector";
import { ClaudeConnectorDialog } from "./claude-connector-dialog";

export const ClaudeConnectorCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="grid gap-6 p-8 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <span className="bg-primary/10 text-primary grid size-12 place-items-center rounded-full">
            <Bot className="size-6" aria-hidden="true" />
          </span>
          <h3 className="font-heading text-2xl">Claude</h3>
        </div>
        <p className="text-muted-foreground">
          Розкажіть Claude про свій бізнес, і він допоможе створити агента: голос, сценарій, ціль. А
          потім відповідатиме на питання про дзвінки звичайними словами. Працює в браузері, на ПК,
          телефоні та в Claude Code
        </p>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Підключити за 2 хвилини
        </Button>
      </div>
      <div
        className="flex flex-col items-start gap-2"
        role="group"
        aria-label="Приклади запитів до Claude"
      >
        <span className="caption text-muted-foreground">Приклади запитів</span>
        {CLAUDE_EXAMPLE_PROMPTS.map((prompt) => (
          <Badge key={prompt} variant="muted" className="h-auto py-1.5 text-left whitespace-normal">
            {prompt}
          </Badge>
        ))}
      </div>
      <ClaudeConnectorDialog open={isOpen} onOpenChange={setIsOpen} />
    </Card>
  );
};
