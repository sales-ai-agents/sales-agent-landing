import Link from "next/link";
import { Bot, Play, Pause, Edit, PhoneCall } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "@dashboard/types";

export interface AgentCardProps {
  agent: Agent;
  onToggle: () => void;
  onTest: () => void;
}

export function AgentCard({ agent, onToggle, onTest }: AgentCardProps) {
  const isActive = !!agent.is_active;

  return (
    <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Bot className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">{agent.name}</CardTitle>
          </div>
          <Badge variant={isActive ? "success" : "warning"}>
            {isActive ? "Активний" : "Призупинено"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-muted-foreground text-xs">Голос</p>
          <p className="text-sm font-medium">{agent.voice}</p>
        </div>
        <p className="text-muted-foreground mb-4 text-xs">
          Створено: {new Date(agent.created_at).toLocaleDateString("uk-UA")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/agents/${agent.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Edit className="mr-1 h-3 w-3" />
            Змінити
          </Link>
          <Button variant="outline" size="sm" onClick={onTest}>
            <PhoneCall className="mr-1 h-3 w-3" />
            Тест
          </Button>
          <Button variant="outline" size="sm" onClick={onToggle}>
            {isActive ? (
              <>
                <Pause className="mr-1 h-3 w-3" /> Пауза
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" /> Запуск
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
