"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import { Label } from "@/components/ui";
import type { EditAgentFormData } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";
import { NumberSelect } from "../../../_components/number-select";

interface SectionNumberProps {
  form: UseFormReturn<EditAgentFormData>;
  numbers: AgentNumber[];
}

export const SectionNumber = ({ form, numbers }: SectionNumberProps) => {
  const { control } = form;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Номер</h2>

      <div className="space-y-2">
        <Label htmlFor="connected-number">Підключений номер</Label>
        <Controller
          control={control}
          name="numberId"
          render={({ field }) => (
            <NumberSelect
              id="connected-number"
              value={field.value}
              numbers={numbers}
              onChange={field.onChange}
            />
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
