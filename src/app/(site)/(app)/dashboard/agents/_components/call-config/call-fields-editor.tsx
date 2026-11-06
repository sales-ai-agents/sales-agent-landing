"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { CALL_FIELDS_MAX_COUNT, createCallField, type CallField } from "@/lib/call-config/schema";
import { CallFieldRow, type MoveDirection } from "./call-field-row";

interface CallFieldsEditorProps {
  fields: CallField[];
  onChange: (fields: CallField[]) => void;
}

const moveItem = (fields: CallField[], index: number, direction: MoveDirection): CallField[] => {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= fields.length) return fields;

  const next = [...fields];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
};

export const CallFieldsEditor = ({ fields, onChange }: CallFieldsEditorProps) => {
  const canAdd = fields.length < CALL_FIELDS_MAX_COUNT;

  const handleChange = (id: string, patch: Partial<CallField>) =>
    onChange(fields.map((field) => (field.id === id ? { ...field, ...patch } : field)));

  const handleRemove = (id: string) => onChange(fields.filter((field) => field.id !== id));

  const handleAdd = () => onChange([...fields, createCallField()]);

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed p-4 text-center text-sm">
          Полів поки немає. Додайте перше поле, щоб агент знав, що збирати під час дзвінка.
        </p>
      ) : (
        <ul className="space-y-2" aria-label="Поля, які збирає агент">
          {fields.map((field, index) => (
            <CallFieldRow
              key={field.id}
              field={field}
              index={index}
              total={fields.length}
              onChange={(patch) => handleChange(field.id, patch)}
              onRemove={() => handleRemove(field.id)}
              onMove={(direction) => onChange(moveItem(fields, index, direction))}
            />
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="sm" disabled={!canAdd} onClick={handleAdd}>
          <Plus />
          Додати поле
        </Button>
        <span className="text-muted-foreground text-xs">
          {fields.length}/{CALL_FIELDS_MAX_COUNT}
        </span>
      </div>
    </div>
  );
};
