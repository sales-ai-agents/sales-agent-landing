"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { EditAgentFormData } from "@/lib/schemas";

interface SectionNumberProps {
  form: UseFormReturn<EditAgentFormData>;
  numbers: string[];
}

export const SectionNumber = ({ form, numbers }: SectionNumberProps) => {
  const { control } = form;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Номер</h2>

      {/* BE not ready: no endpoints list account numbers or bind one to an agent. */}
      <div className="space-y-2">
        <Label htmlFor="connected-number">Підключений номер</Label>
        <Controller
          control={control}
          name="connectedNumber"
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
            >
              <SelectTrigger id="connected-number" className="w-full">
                <SelectValue placeholder="Оберіть номер" />
              </SelectTrigger>
              <SelectContent>
                {numbers.map((number) => (
                  <SelectItem key={number} value={number}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Info className="text-primary h-4 w-4 shrink-0" />
          <span>
            Номер підключено через SIP. Для зміни номера перейдіть у розділ{" "}
            <Link href="/dashboard/integrations" className="font-medium">
              «Номери»
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
};
