"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import {
  createAgentSchema,
  type CreateAgentFormData,
  DEFAULT_SCHEDULE_START,
  DEFAULT_SCHEDULE_END,
} from "@/lib/schemas";
import { useCreateAgent, useTestCall, useVoices } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { StepIndicator } from "./_components/step-indicator";
import { StepBasics } from "./_components/step-basics";
import { StepCallType } from "./_components/step-call-type";
import { StepSchedule } from "./_components/step-schedule";
import { StepNumber } from "./_components/step-number";
import { StepInstructions } from "./_components/step-instructions";
import { TOTAL_STEPS, STEP_FIELDS, isStepValid } from "./_components/wizard";

const DEFAULT_VALUES: CreateAgentFormData = {
  name: "",
  voice: "",
  callDirection: "outbound",
  contactBase: "",
  scheduleStart: DEFAULT_SCHEDULE_START,
  scheduleEnd: DEFAULT_SCHEDULE_END,
  workingDays: ["mon", "tue", "wed", "thu", "fri"],
  callsPerDay: 20,
  phoneNumber: "",
  instructions: "",
  testPhone: "",
};

const CreateAgentPage = () => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();
  const createAgent = useCreateAgent();
  const testCall = useTestCall();

  const [step, setStep] = useState(0);

  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { control, trigger, getValues } = form;

  const values = useWatch({ control });
  const isLastStep = step === TOTAL_STEPS - 1;
  const stepValid = isStepValid(step, values);

  const createAgentFromForm = useCallback(() => {
    const data = getValues();

    // BE not ready: POST /app/agents accepts only name/voice/instructions.
    // Call direction, contact base, schedule and number are UI-only for now.
    createAgent.mutate(
      { name: data.name, voice: data.voice, instructions: data.instructions },
      {
        onSuccess: () => {
          toast.success("Агента створено");
          router.push("/dashboard/agents");
        },
        onError: (error) => handleMutationError(error, AGENT_ERROR_MESSAGES),
      }
    );
  }, [getValues, createAgent, router]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const valid = await trigger(STEP_FIELDS[step]);
      if (!valid) return;

      if (isLastStep) {
        createAgentFromForm();
        return;
      }

      setStep((current) => current + 1);
    },
    [trigger, step, isLastStep, createAgentFromForm]
  );

  const handleBack = useCallback(() => {
    if (step > 0) setStep((current) => current - 1);
    else router.back();
  }, [step, router]);

  const handleTestCall = useCallback(() => {
    const data = getValues();
    if (!data.testPhone) return;

    testCall.mutate(
      {
        phone: data.testPhone,
        name: data.name,
        voice: data.voice,
        instructions: data.instructions,
      },
      {
        onSuccess: () => toast.success("Дзвінок ініційовано — очікуйте виклик"),
        onError: (error) => handleMutationError(error, AGENT_ERROR_MESSAGES),
      }
    );
  }, [getValues, testCall]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasics form={form} voices={voices} />;
      case 1:
        return <StepCallType form={form} />;
      case 2:
        return <StepSchedule form={form} />;
      case 3:
        return <StepNumber />;
      case 4:
        return (
          <StepInstructions
            form={form}
            isTesting={testCall.isPending}
            onTestCall={handleTestCall}
          />
        );
      default:
        return null;
    }
  };

  const submitLabel = isLastStep ? "Створити агента" : "Далі";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Назад">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">Створити нового агента</h1>
          <p className="text-muted-foreground text-sm">
            Крок {step + 1} з {TOTAL_STEPS}
          </p>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="border-border bg-background rounded-2xl border p-6">{renderStep()}</div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Назад
          </Button>
          <Button type="submit" size="sm" disabled={createAgent.isPending || !stepValid}>
            {createAgent.isPending ? "Створення..." : submitLabel}
            {!isLastStep && <ArrowRight className="ml-1.5 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAgentPage;
