"use client";

import { CalendarDays, Package, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AgentTemplate, AgentTemplateIcon } from "@dashboard/types";

const TEMPLATE_ICONS: Record<AgentTemplateIcon, LucideIcon> = {
  calendar: CalendarDays,
  package: Package,
  "trending-up": TrendingUp,
};

interface TemplatePickerProps {
  templates: AgentTemplate[];
  selectedId: string | null;
  onSelect: (template: AgentTemplate) => void;
}

export const TemplatePicker = ({ templates, selectedId, onSelect }: TemplatePickerProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group" aria-label="Шаблони агента">
    {templates.map((template) => {
      const Icon = TEMPLATE_ICONS[template.icon] ?? CalendarDays;
      const isSelected = template.id === selectedId;
      return (
        <button
          key={template.id}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(template)}
          className={cn(
            "flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          )}
        >
          <span className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
            <Icon className="text-primary h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">{template.title}</span>
          <span className="text-muted-foreground text-xs">{template.subtitle}</span>
        </button>
      );
    })}
  </div>
);
