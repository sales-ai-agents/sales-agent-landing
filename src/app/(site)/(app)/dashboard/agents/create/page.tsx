"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { PageHead } from "@/components/dashboard";
import {
  createAgentSchema,
  type CreateAgentFormData,
  toAgentApiPayload,
  DEFAULT_SCHEDULE_START,
  DEFAULT_SCHEDULE_END,
  DEFAULT_NUMBER_ID,
} from "@/lib/schemas";
import { useCreateAgent, useTestCall, useVoices, useNumbers } from "@dashboard/hooks";
import { toApiCallFields } from "@/lib/call-config/schema";
import { handleMutationError, handleMutationErrorWithForm } from "@/lib/mutation-error";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import { StepIndicator } from "./_components/step-indicator";
import { StepBasics } from "./_components/step-basics";
import { StepCallType } from "./_components/step-call-type";
import { StepSchedule } from "./_components/step-schedule";
import { StepNumber } from "./_components/step-number";
import { StepInstructions } from "./_components/step-instructions";
import { getStepFields, getWizardSteps, isStepValid, type WizardStep } from "./_components/wizard";
import { normalizeUaPhone } from "@/app/(site)/(app)/dashboard/agents/_components/connect-number/constants";

const DEFAULT_VALUES: CreateAgentFormData = {
  name: "",
  voice: "",
  callDirection: "outbound",
  contactIds: [],
  scheduleStart: DEFAULT_SCHEDULE_START,
  scheduleEnd: DEFAULT_SCHEDULE_END,
  workingDays: ["mon", "tue", "wed", "thu", "fri"],
  callsPerDay: 20,
  numberId: DEFAULT_NUMBER_ID,
  instructions: "",
  reportFields: "",
  callType: null,
  callFields: [],
  testPhone: "",
};

const CreateAgentPage = () => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();
  const { data: numbers = [] } = useNumbers();

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
  const callDirection = values.callDirection ?? DEFAULT_VALUES.callDirection;

  const steps = useMemo(() => getWizardSteps(callDirection), [callDirection]);
  const totalSteps = steps.length;
  const currentStep = Math.min(step, totalSteps - 1);
  const currentStepKey: WizardStep = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const stepValid = isStepValid(currentStepKey, values);

  const createAgentFromForm = useCallback(() => {
    createAgent.mutate(toAgentApiPayload(getValues()), {
      onSuccess: () => {
        toast.success("Агента створено");
        router.push("/dashboard/agents");
      },
      onError: (error) => handleMutationErrorWithForm(error, form.setError, AGENT_ERROR_MESSAGES),
    });
  }, [getValues, createAgent, form.setError, router]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const valid = await trigger(getStepFields(currentStepKey));
      if (!valid) return;

      if (isLastStep) {
        createAgentFromForm();
        return;
      }

      setStep(currentStep + 1);
    },
    [trigger, currentStepKey, currentStep, isLastStep, createAgentFromForm]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) setStep(currentStep - 1);
    else router.back();
  }, [currentStep, router]);

  const handleTestCall = useCallback(() => {
    const data = getValues();
    if (!data.testPhone) return;

    testCall.mutate(
      {
        phone: normalizeUaPhone(data.testPhone),
        name: data.name,
        voice: data.voice,
        instructions: data.instructions,
        ...(data.reportFields && { report_fields: data.reportFields }),
        ...(data.callType && { call_type: data.callType }),
        call_fields: toApiCallFields(data.callFields),
      },
      {
        onSuccess: () => toast.success("Дзвінок ініційовано — очікуйте виклик"),
        onError: (error) => handleMutationError(error, AGENT_ERROR_MESSAGES),
      }
    );
  }, [getValues, testCall]);

  const renderStep = () => {
    switch (currentStepKey) {
      case "basics":
        return <StepBasics form={form} voices={voices} />;
      case "callType":
        return <StepCallType form={form} />;
      case "schedule":
        return <StepSchedule form={form} />;
      case "number":
        return <StepNumber form={form} numbers={numbers} />;
      case "instructions":
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
    <div className="flex flex-col gap-6">
      <PageHead
        word="агент"
        title="Створити нового агента"
        description={`Крок ${currentStep + 1} з ${totalSteps}`}
        actions={<StepIndicator currentStep={currentStep} totalSteps={totalSteps} />}
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-3xl flex-col gap-4"
      >
        <Card className="p-6">{renderStep()}</Card>
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={handleBack}>
            <ArrowLeft aria-hidden="true" />
            Назад
          </Button>
          <Button type="submit" disabled={createAgent.isPending || !stepValid}>
            {createAgent.isPending ? "Створення..." : submitLabel}
            {!isLastStep && <ArrowRight aria-hidden="true" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAgentPage;
