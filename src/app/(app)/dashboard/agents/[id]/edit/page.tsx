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
import {
  editAgentSchema,
  type EditAgentFormData,
  toAgentApiPayload,
  parseWorkingDays,
  DEFAULT_SCHEDULE_START,
  DEFAULT_SCHEDULE_END,
  UNSET_CONTACT_BASE_ID,
  DEFAULT_NUMBER_ID,
} from "@/lib/schemas";
import {
  useAgent,
  useUpdateAgent,
  useDeleteAgent,
  useVoices,
  useContactBases,
  useNumbers,
} from "@dashboard/hooks";
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

const EditAgentPage = () => {
  const { data: agent, isLoading } = useAgent(useParams().id as string);

  if (isLoading) return <PageLoading />;
  if (!agent) return <AgentNotFound />;

  return <EditAgentForm key={agent.id} agent={agent} />;
};

const buildDefaultValues = (agent: Agent): EditAgentFormData => ({
  name: agent.name,
  voice: agent.voice,
  callDirection: agent.call_direction === "inbound" ? "inbound" : "outbound",
  contactBaseId: agent.contact_base_id >= 0 ? agent.contact_base_id : UNSET_CONTACT_BASE_ID,
  scheduleStart: agent.schedule_start || DEFAULT_SCHEDULE_START,
  scheduleEnd: agent.schedule_end || DEFAULT_SCHEDULE_END,
  workingDays: parseWorkingDays(agent.working_days),
  callsPerDay: agent.calls_per_day,
  numberId: agent.number_id ?? DEFAULT_NUMBER_ID,
  instructions: agent.instructions,
});

const EditAgentForm = ({ agent }: { agent: Agent }) => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();
  const { data: contactBases = [] } = useContactBases();
  const { data: numbers = [] } = useNumbers();

  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const form = useForm<EditAgentFormData>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: buildDefaultValues(agent),
    mode: "onChange",
  });

  const handleSave = useCallback(
    (data: EditAgentFormData) => {
      updateAgent.mutate(
        { id: agent.id, ...toAgentApiPayload(data) },
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
        <SectionCalls form={form} contactBases={contactBases} />
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
