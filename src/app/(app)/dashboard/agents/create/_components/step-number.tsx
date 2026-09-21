"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import type { CreateAgentFormData } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";

import { NumberPicker } from "../../_components/number-picker";
import { StepNumberConnect } from "./step-number-connect";

interface StepNumberProps {
  form: UseFormReturn<CreateAgentFormData>;
  numbers: AgentNumber[];
}

export const StepNumber = ({ form, numbers }: StepNumberProps) => {
  const handleConnected = (numberId: number): void => {
    form.setValue("numberId", numberId, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Вибір номера</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть номер, з якого буде телефонувати агент.
        </p>
      </div>

      <Tabs defaultValue="my-numbers">
        <TabsList className="w-full">
          <TabsTrigger value="my-numbers" className="flex-1">
            Мої номера
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex-1">
            Підключити номер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-numbers" className="mt-4">
          {numbers.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
              Ще немає підключених номерів. Підключіть номер на вкладці «Підключити номер».
            </div>
          ) : (
            <Controller
              control={form.control}
              name="numberId"
              render={({ field }) => (
                <NumberPicker numbers={numbers} value={field.value} onChange={field.onChange} />
              )}
            />
          )}
        </TabsContent>

        <TabsContent value="connect" className="mt-4">
          <StepNumberConnect onConnected={handleConnected} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
