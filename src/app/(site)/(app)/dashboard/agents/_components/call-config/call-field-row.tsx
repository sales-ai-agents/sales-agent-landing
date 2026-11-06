"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui";
import { CALL_FIELD_TYPE_LABELS } from "@/lib/call-config/defaults";
import {
  CALL_FIELD_LABEL_MAX_LENGTH,
  CALL_FIELD_TYPES,
  type CallField,
  type CallFieldType,
} from "@/lib/call-config/schema";

export type MoveDirection = "up" | "down";

interface CallFieldRowProps {
  field: CallField;
  index: number;
  total: number;
  onChange: (patch: Partial<CallField>) => void;
  onRemove: () => void;
  onMove: (direction: MoveDirection) => void;
}

const renderTypeLabel = (value: CallFieldType | null) =>
  value ? CALL_FIELD_TYPE_LABELS[value] : null;

export const CallFieldRow = ({
  field,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: CallFieldRowProps) => {
  const position = index + 1;
  const hasError = field.label.trim().length === 0;
  const errorId = `call-field-error-${field.id}`;

  return (
    <li className="border-border bg-background flex flex-col gap-3 rounded-lg border p-3 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-1">
        <Input
          className="h-8"
          value={field.label}
          maxLength={CALL_FIELD_LABEL_MAX_LENGTH}
          placeholder="Назва поля"
          aria-label={`Назва поля ${position}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onChange={(event) => onChange({ label: event.target.value })}
        />
        {hasError && (
          <p id={errorId} className="text-destructive text-xs">
            Вкажіть назву поля
          </p>
        )}
      </div>

      <Select
        value={field.type}
        onValueChange={(value) => value && onChange({ type: value as CallFieldType })}
      >
        <SelectTrigger className="w-full lg:w-40" aria-label={`Тип поля ${position}`}>
          <SelectValue>{renderTypeLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CALL_FIELD_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {CALL_FIELD_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <label className="flex h-8 shrink-0 items-center gap-2 text-xs">
          <Switch
            size="sm"
            checked={field.required}
            onCheckedChange={(checked) => onChange({ required: checked })}
          />
          Обов&apos;язкове
        </label>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === 0}
            aria-label={`Перемістити поле ${position} вгору`}
            onClick={() => onMove("up")}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === total - 1}
            aria-label={`Перемістити поле ${position} вниз`}
            onClick={() => onMove("down")}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive"
            aria-label={`Видалити поле ${position}`}
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  );
};
