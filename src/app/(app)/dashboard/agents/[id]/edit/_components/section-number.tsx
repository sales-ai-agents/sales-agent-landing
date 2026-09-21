"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button, Label } from "@/components/ui";
import type { EditAgentFormData } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";

import { NumberSelect } from "../../../_components/number-select";
import { ConnectNumberDialog } from "../../../_components/connect-number";

interface SectionNumberProps {
  form: UseFormReturn<EditAgentFormData>;
  numbers: AgentNumber[];
}

export const SectionNumber = ({ form, numbers }: SectionNumberProps) => {
  const { control, setValue } = form;

  const handleConnected = (numberId: number): void => {
    setValue("numberId", numberId, { shouldValidate: true, shouldDirty: true });
  };

  const connectTrigger = (
    <Button type="button" variant="outline" size="sm">
      <Plus className="mr-2 h-4 w-4" />
      Підключити номер
    </Button>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Номер</h2>
        <ConnectNumberDialog onConnected={handleConnected} trigger={connectTrigger} />
      </div>

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
      </div>
    </section>
  );
};
