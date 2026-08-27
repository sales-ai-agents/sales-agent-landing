"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Play, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createAgentSchema, type CreateAgentFormData } from "@/lib/schemas";
import { useCreateAgent, useTestCall, useVoices } from "@dashboard/hooks";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AGENT_ERROR_MESSAGES } from "@/lib/error-messages";

const TOTAL_STEPS = 4;

export default function CreateAgentPage() {
  const router = useRouter();
  const createAgent = useCreateAgent();
  const testCall = useTestCall();
  const { data: voices = [] } = useVoices();
  const [step, setStep] = useState(0);

  const {
    register,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: { name: "", voice: "", instructions: "", testPhone: "" },
    mode: "onChange",
  });

  const name = watch("name");
  const voice = watch("voice");
  const instructions = watch("instructions");

  const STEP_FIELDS: (keyof CreateAgentFormData)[][] = [
    ["name"],
    ["voice"],
    ["instructions"],
    ["testPhone"],
  ];

  async function handleNext(): Promise<void> {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;

    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      await handleCreate();
    }
  }

  function handleBack(): void {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  }

  async function handleCreate(): Promise<void> {
    const valid = await trigger(["name", "voice", "instructions"]);
    if (!valid) return;

    const data = getValues();
    try {
      await createAgent.mutateAsync({
        name: data.name,
        voice: data.voice,
        instructions: data.instructions,
      });
      toast.success("Агента створено");
      router.push("/dashboard/agents");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
      } else {
        toast.error("Щось пішло не так.");
      }
    }
  }

  async function handleTestCall(): Promise<void> {
    const data = getValues();
    if (!data.testPhone) return;

    try {
      await testCall.mutateAsync({
        phone: data.testPhone,
        name: data.name,
        voice: data.voice,
        instructions: data.instructions,
      });
      toast.success("Дзвінок ініційовано — очікуйте виклик");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
      } else {
        toast.error("Щось пішло не так.");
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Назад">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Створити нового агента</h1>
          <p className="text-muted-foreground text-sm">
            Крок {step + 1} з {TOTAL_STEPS}
          </p>
        </div>
      </div>

      <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="border-border bg-background rounded-2xl border p-6">
        {step === 0 && <StepName register={register} errors={errors} />}
        {step === 1 && (
          <StepVoice
            voices={voices}
            selectedVoice={voice}
            onSelect={(key) => setValue("voice", key, { shouldValidate: true })}
            error={errors.voice?.message}
          />
        )}
        {step === 2 && <StepInstructions register={register} errors={errors} />}
        {step === 3 && (
          <StepTest
            register={register}
            name={name}
            voice={voices.find((v) => v.key === voice)?.name ?? "—"}
            instructions={instructions}
            onTestCall={handleTestCall}
            isTestPending={testCall.isPending}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Назад
        </Button>
        <Button size="sm" onClick={handleNext} disabled={createAgent.isPending}>
          {createAgent.isPending ? "Створення..." : "Далі"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Stepper({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary text-primary-foreground",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn("mx-1 h-0.5 w-10", index < currentStep ? "bg-primary" : "bg-muted")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepName({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CreateAgentFormData>>["register"];
  errors: ReturnType<typeof useForm<CreateAgentFormData>>["formState"]["errors"];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Назвіть свого агента</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть описову назву для вашого AI голосового агента
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="agent-name">Назва агента</Label>
        <Input
          id="agent-name"
          placeholder="напр., Бот нагадування про зустріч"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
    </div>
  );
}

interface StepVoiceProps {
  voices: { key: string; name: string; label: string }[];
  selectedVoice: string;
  onSelect: (key: string) => void;
  error?: string;
}

function StepVoice({ voices, selectedVoice, onSelect, error }: StepVoiceProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Оберіть голос</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть голос, який ваш агент використовуватиме під час дзвінків.
        </p>
      </div>
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Оберіть голос"
      >
        {voices.map((voiceOption) => (
          <button
            key={voiceOption.key}
            type="button"
            role="radio"
            aria-checked={selectedVoice === voiceOption.key}
            onClick={() => onSelect(voiceOption.key)}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
              selectedVoice === voiceOption.key
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div>
              <p className="text-sm font-medium">{voiceOption.name}</p>
              <p className="text-muted-foreground text-xs">{voiceOption.label}</p>
            </div>
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              <Play className="text-muted-foreground h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function StepInstructions({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CreateAgentFormData>>["register"];
  errors: ReturnType<typeof useForm<CreateAgentFormData>>["formState"]["errors"];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Напишіть інструкції</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Розкажіть агенту, що робити, звичайною мовою. Код не потрібен
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructions">Інструкції</Label>
        <Textarea
          id="instructions"
          rows={5}
          placeholder="Зателефонуйте клієнту, щоб нагадати про зустріч завтра. Якщо підтвердить — скажіть: «Чудово, чекаємо на вас!». Якщо хоче перенести — запитайте бажану дату і час. Завжди будьте ввічливі та професійні."
          {...register("instructions")}
        />
        {errors.instructions && (
          <p className="text-sm text-red-600">{errors.instructions.message}</p>
        )}
        <p className="text-muted-foreground text-xs">
          Пишіть так, ніби пояснюєте реальній людині, що говорити під час дзвінка.
        </p>
      </div>
    </div>
  );
}

interface StepTestProps {
  register: ReturnType<typeof useForm<CreateAgentFormData>>["register"];
  name: string;
  voice: string;
  instructions: string;
  onTestCall: () => void;
  isTestPending: boolean;
}

function StepTest({
  register,
  name,
  voice,
  instructions,
  onTestCall,
  isTestPending,
}: StepTestProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Протестуйте агента</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Введіть номер телефону - ми зателефонуємо вам, щоб ви могли почути агента в дії
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="test-phone">Ваш номер телефону</Label>
        <Input id="test-phone" placeholder="+380 XX XXX XXXX" {...register("testPhone")} />
      </div>

      <Button className="w-full" onClick={onTestCall} disabled={isTestPending}>
        <Phone className="mr-2 h-4 w-4" />
        {isTestPending ? "Дзвінок..." : "Тестовий дзвінок"}
      </Button>

      <div className="border-border space-y-2 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Підсумок агента</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Назва:</span> {name || "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Голос:</span> {voice}
          </p>
          <p>
            <span className="text-muted-foreground">Інструкція:</span>{" "}
            {instructions
              ? instructions.length > 50
                ? instructions.slice(0, 50) + "..."
                : instructions
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
