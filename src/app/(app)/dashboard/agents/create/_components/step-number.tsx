"use client";

import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import type { CallDirection, CreateAgentFormData } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";

import { NumberPicker } from "../../_components/number-picker";
import { StepNumberConnect } from "./step-number-connect";

interface StepNumberProps {
  form: UseFormReturn<CreateAgentFormData>;
  numbers: AgentNumber[];
}

interface StepCopy {
  title: string;
  subtitle: string;
}

const STEP_COPY: Record<CallDirection, StepCopy> = {
  inbound: {
    title: "Номер для вхідних дзвінків",
    subtitle: "Оберіть номер, на який дзвонитимуть клієнти. На нього відповідатиме цей агент.",
  },
  outbound: {
    title: "Номер для дзвінків",
    subtitle: "Оберіть номер, з якого дзвонитиме агент.",
  },
};

const matchesDirection = (number: AgentNumber, callDirection: CallDirection): boolean => {
  if (number.direction === "both") return true;
  if (number.direction === callDirection) return true;
  return callDirection === "inbound" && number.source === "sip";
};

export const StepNumber = ({ form, numbers }: StepNumberProps) => {
  const callDirection = form.watch("callDirection");
  const selectedNumberId = form.watch("numberId");

  const availableNumbers = useMemo(
    () => numbers.filter((number) => matchesDirection(number, callDirection)),
    [numbers, callDirection]
  );

  const showRequiredHint = availableNumbers.length > 0 && !selectedNumberId;
  const copy = STEP_COPY[callDirection];

  const handleConnected = (numberId: number): void => {
    form.setValue("numberId", numberId, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">{copy.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{copy.subtitle}</p>
      </div>

      <Tabs defaultValue="my-numbers">
        <TabsList className="w-full">
          <TabsTrigger value="my-numbers" className="flex-1">
            Мої номери
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex-1">
            Підключити номер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-numbers" className="mt-4">
          {availableNumbers.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
              Ще немає підходящих номерів. Підключіть номер на вкладці «Підключити номер».
            </div>
          ) : (
            <Controller
              control={form.control}
              name="numberId"
              render={({ field }) => (
                <NumberPicker
                  numbers={availableNumbers}
                  value={field.value}
                  onChange={field.onChange}
                  showCallerId={callDirection === "outbound"}
                />
              )}
            />
          )}
          {showRequiredHint && (
            <p className="text-muted-foreground mt-3 text-sm">
              Оберіть щонайменше один номер, щоб продовжити.
            </p>
          )}
        </TabsContent>

        <TabsContent value="connect" className="mt-4">
          <StepNumberConnect onConnected={handleConnected} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
