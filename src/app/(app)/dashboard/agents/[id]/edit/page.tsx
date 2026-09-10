"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { PageLoading } from "@/components/dashboard";
import { editAgentSchema, type EditAgentFormData } from "@/lib/schemas";
import { useAgent, useUpdateAgent, useDeleteAgent, useVoices } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import type { Agent } from "@dashboard/types";
import AgentNotFound from "@/app/(app)/dashboard/agents/[id]/not-found";
import { AgentHeader } from "./_components/agent-header";
import { SectionBasics } from "./_components/section-basics";
import { SectionCalls } from "./_components/section-calls";
import { SectionSchedule } from "./_components/section-schedule";
import { SectionNumber } from "./_components/section-number";
import { SectionInstructions } from "./_components/section-instructions";

const DEFAULT_SCHEDULE_START = "09:00";
const DEFAULT_SCHEDULE_END = "18:00";

// BE not ready: no endpoints list account numbers, so the connected number is
// derived from the agent when available and otherwise offered as a single option.
const FALLBACK_NUMBER = "+380 67 214 88 03";

const EditAgentPage = () => {
  const { data: agent, isLoading } = useAgent(useParams().id as string);

  if (isLoading) return <PageLoading />;
  if (!agent) return <AgentNotFound />;

  return <EditAgentForm key={agent.id} agent={agent} />;
};

const buildDefaultValues = (agent: Agent): EditAgentFormData => ({
  name: agent.name,
  voice: agent.voice,
  callDirection: "outbound",
  contactBase: "google_sheets",
  scheduleStart: DEFAULT_SCHEDULE_START,
  scheduleEnd: DEFAULT_SCHEDULE_END,
  workingDays: ["mon", "tue", "wed", "thu", "fri"],
  callsPerDay: 20,
  connectedNumber: FALLBACK_NUMBER,
  instructions: agent.instructions,
});

const EditAgentForm = ({ agent }: { agent: Agent }) => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();

  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const form = useForm<EditAgentFormData>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: buildDefaultValues(agent),
    mode: "onChange",
  });

  const numbers = [FALLBACK_NUMBER];

  const handleSave = useCallback(
    (data: EditAgentFormData) => {
      // BE not ready: PATCH /app/agents/:id accepts only name/voice/instructions.
      updateAgent.mutate(
        {
          id: agent.id,
          name: data.name,
          voice: data.voice,
          instructions: data.instructions,
        },
        {
          onSuccess: () => {
            toast.success("Зміни збережено");
            router.push("/dashboard/agents");
          },
          onError: (error) => handleMutationError(error, AGENT_ERROR_MESSAGES),
        }
      );
    },
    [updateAgent, agent.id, router]
  );

  const handleDelete = useCallback(() => {
    deleteAgent.mutate(agent.id, {
      onSuccess: () => {
        toast.success("Агента видалено");
        router.push("/dashboard/agents");
      },
      onError: (error) => handleMutationError(error, AGENT_ERROR_MESSAGES),
    });
  }, [deleteAgent, agent.id, router]);

  return (
    <div className="border-border bg-background mx-auto max-w-4xl space-y-8 rounded-2xl border p-6 sm:p-8">
      <header className="space-y-1">
        <h1 className="text-xl font-bold">Редагувати агента</h1>
        <p className="text-muted-foreground text-sm">Керуйте вашими голосовими ШІ-агентами</p>
      </header>

      <AgentHeader name={agent.name} id={agent.id} isActive={agent.is_active} />

      <form onSubmit={form.handleSubmit(handleSave)} noValidate className="space-y-8">
        <SectionBasics form={form} voices={voices} />
        <SectionCalls form={form} />
        <SectionSchedule form={form} />
        <SectionNumber form={form} numbers={numbers} />
        <SectionInstructions form={form} />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Dialog>
            <DialogTrigger
              render={
                <Button type="button" variant="ghost" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Видалити агента
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Видалити агента?</DialogTitle>
                <DialogDescription>
                  Цю дію неможливо скасувати. Агент та вся його історія дзвінків будуть видалені
                  назавжди.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Скасувати</DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteAgent.isPending}
                >
                  {deleteAgent.isPending ? "Видалення..." : "Видалити"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Скасувати
            </Button>
            <Button type="submit" disabled={updateAgent.isPending}>
              {updateAgent.isPending ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAgentPage;
