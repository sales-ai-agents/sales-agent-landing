"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CALL_TYPES, getCallTypeDefinition } from "@/lib/call-config/defaults";
import type { CallTypeId } from "@/lib/call-config/schema";

interface CallTypeSelectProps {
  value: CallTypeId | null;
  onChange: (id: CallTypeId) => void;
}

const SELECT_ID = "call-type-select";
const PLACEHOLDER = "Оберіть тип дзвінка";

const renderCallTypeLabel = (value: CallTypeId | null) =>
  value ? getCallTypeDefinition(value).title : PLACEHOLDER;

export const CallTypeSelect = ({ value, onChange }: CallTypeSelectProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={SELECT_ID}>Тип дзвінка</Label>
    <Select value={value} onValueChange={(next) => next && onChange(next as CallTypeId)}>
      <SelectTrigger id={SELECT_ID} className="w-full sm:w-64">
        <SelectValue placeholder={PLACEHOLDER}>{renderCallTypeLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CALL_TYPES.map((callType) => (
          <SelectItem key={callType.id} value={callType.id}>
            {callType.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {value && (
      <p className="text-muted-foreground text-xs">{getCallTypeDefinition(value).description}</p>
    )}
  </div>
);
