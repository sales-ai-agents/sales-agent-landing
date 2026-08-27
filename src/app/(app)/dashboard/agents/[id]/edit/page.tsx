"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Phone } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { PageLoading } from "@/components/dashboard";
import { useAgent, useUpdateAgent, useDeleteAgent, useTestCall, useVoices } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import type { Agent } from "@dashboard/types";
import AgentNotFound from "@/app/(app)/dashboard/agents/[id]/not-found";

interface AgentFormData {
  name: string;
  voice: string;
  instructions: string;
}

const EditAgentPage = () => {
  const { data: agent, isLoading } = useAgent(useParams().id as string);

  if (isLoading) return <PageLoading />;
  if (!agent) return <AgentNotFound />;

  return <EditAgentForm key={agent.id} agent={agent} />;
};

const EditAgentForm = ({ agent }: { agent: Agent }) => {
  const router = useRouter();

  const { data: voices = [] } = useVoices();

  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();
  const testCall = useTestCall();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [formData, setFormData] = useState<AgentFormData>({
    name: agent.name,
    voice: agent.voice,
    instructions: agent.instructions,
  });

  const handleSave = useCallback(() => {
    updateAgent.mutate(
      { id: agent.id, ...formData },
      {
        onSuccess: () => {
          toast.success("Зміни збережено");
          router.push("/dashboard/agents");
        },
        onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
      }
    );
  }, [updateAgent, agent.id, formData, router]);

  const handleDelete = useCallback(() => {
    deleteAgent.mutate(agent.id, {
      onSuccess: () => {
        toast.success("Агента видалено");
        router.push("/dashboard/agents");
      },
      onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
    });
  }, [deleteAgent, agent.id, router]);

  const handleTestCall = useCallback(() => {
    if (!testPhone) return;

    testCall.mutate(
      { agent_id: agent.id, phone: testPhone },
      {
        onSuccess: () => {
          toast.success("Дзвінок ініційовано — очікуйте виклик");
        },
        onError: (err) => handleMutationError(err, AGENT_ERROR_MESSAGES),
      }
    );
  }, [testCall, agent.id, testPhone]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Назад">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">Редагування агента</h1>
          <p className="text-muted-foreground">Оновіть конфігурацію вашого агента</p>
        </div>
      </div>

      <Card className="border-border rounded-2xl">
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Конфігурація агента</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва агента</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Голос</Label>
            <Select
              value={formData.voice}
              onValueChange={(value) => setFormData({ ...formData, voice: value ?? "" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть голос">
                  {voices.find((v) => v.key === formData.voice)?.label ?? formData.voice}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.key} value={v.key}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Інструкції</Label>
            <Textarea
              id="instructions"
              rows={5}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader>
          <h2 className="font-display text-lg font-semibold">Тестовий дзвінок</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              aria-label="Номер телефону для тестового дзвінка"
              placeholder="+380 XX XXX XXXX"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
            <Button
              onClick={handleTestCall}
              disabled={testCall.isPending || !testPhone}
              variant="outline"
            >
              <Phone className="mr-2 h-4 w-4" />
              {testCall.isPending ? "Дзвінок..." : "Тест"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Видалити агента
        </Button>
        <Button onClick={handleSave} disabled={updateAgent.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {updateAgent.isPending ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Видалити агента?</DialogTitle>
            <DialogDescription>
              Цю дію неможливо скасувати. Агент та вся його історія дзвінків будуть видалені
              назавжди.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteAgent.isPending}>
              {deleteAgent.isPending ? "Видалення..." : "Видалити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAgentPage;
