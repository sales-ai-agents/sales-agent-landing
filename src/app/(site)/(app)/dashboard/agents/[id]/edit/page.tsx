"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { PageHead, PageLoading } from "@/components/dashboard";
import {
  editAgentSchema,
  type EditAgentFormData,
  toAgentApiPayload,
  parseWorkingDays,
  DEFAULT_SCHEDULE_START,
  DEFAULT_SCHEDULE_END,
  DEFAULT_NUMBER_ID,
} from "@/lib/schemas";
import { useAgent, useUpdateAgent, useDeleteAgent, useVoices, useNumbers } from "@dashboard/hooks";
import { handleMutationError, handleMutationErrorWithForm } from "@/lib/mutation-error";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import type { AgentDetail } from "@dashboard/types";
import AgentNotFound from "@/app/(site)/(app)/dashboard/agents/[id]/not-found";
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

const buildDefaultValues = (agent: AgentDetail): EditAgentFormData => ({
  name: agent.name,
  voice: agent.voice,
  callDirection: agent.call_direction === "inbound" ? "inbound" : "outbound",
  contactIds: agent.contact_ids ?? [],
  scheduleStart: agent.schedule_start || DEFAULT_SCHEDULE_START,
  scheduleEnd: agent.schedule_end || DEFAULT_SCHEDULE_END,
  workingDays: parseWorkingDays(agent.working_days),
  callsPerDay: agent.calls_per_day,
  numberId: agent.number_id ?? DEFAULT_NUMBER_ID,
  instructions: agent.instructions,
  reportFields: agent.report_fields ?? "",
  callType: agent.call_type ?? null,
  callFields: agent.call_fields ?? [],
});

const EditAgentForm = ({ agent }: { agent: AgentDetail }) => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();
  const { data: numbers = [] } = useNumbers();

  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const form = useForm<EditAgentFormData>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: buildDefaultValues(agent),
    mode: "onChange",
  });

  const isOutbound = useWatch({ control: form.control, name: "callDirection" }) === "outbound";

  const handleSave = useCallback(
    (data: EditAgentFormData) => {
      updateAgent.mutate(
        { id: agent.id, ...toAgentApiPayload(data) },
        {
          onSuccess: () => {
            toast.success("Зміни збережено");
            router.push("/dashboard/agents");
          },
          onError: (error) =>
            handleMutationErrorWithForm(error, form.setError, AGENT_ERROR_MESSAGES),
        }
      );
    },
    [updateAgent, agent.id, form.setError, router]
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
    <div className="flex flex-col gap-6">
      <PageHead
        word="агент"
        title="Редагувати агента"
        description="Керуйте вашими голосовими ШІ-агентами"
        tone="b"
      />
      <Card className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
        <AgentHeader
          name={agent.name}
          id={agent.id}
          isActive={agent.is_active}
          revision={agent.revision}
        />

        <form onSubmit={form.handleSubmit(handleSave)} noValidate className="space-y-8">
          <SectionBasics form={form} voices={voices} />
          <SectionCalls form={form} />
          {isOutbound && <SectionSchedule form={form} />}
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
                    Агента буде видалено назавжди. Дзвінки, зроблені цим агентом, залишаться в
                    журналі.
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
      </Card>
    </div>
  );
};

export default EditAgentPage;
