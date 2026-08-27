"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoading } from "@/components/dashboard/page-states";
import { useAgent, useUpdateAgent, useDeleteAgent, useTestCall } from "@dashboard/hooks/use-agents";
import { useVoices } from "@dashboard/hooks/use-voices";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AGENT_ERROR_MESSAGES } from "@/lib/error-messages";
import type { Agent } from "@dashboard/types";

interface AgentFormData {
  name: string;
  voice: string;
  instructions: string;
}

export default function EditAgentPage() {
  const { data: agent, isLoading } = useAgent(useParams().id as string);

  if (isLoading) return <PageLoading />;
  if (!agent) return <AgentNotFound />;

  return <EditAgentForm key={agent.id} agent={agent} />;
}

function AgentNotFound() {
  const router = useRouter();

  return (
    <div className="text-center">
      <p className="text-muted-foreground">Агента не знайдено</p>
      <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/agents")}>
        Повернутися до агентів
      </Button>
    </div>
  );
}

interface EditAgentFormProps {
  agent: Agent;
}

function EditAgentForm({ agent }: EditAgentFormProps) {
  const router = useRouter();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();
  const testCall = useTestCall();
  const { data: voices = [] } = useVoices();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [formData, setFormData] = useState<AgentFormData>({
    name: agent.name,
    voice: agent.voice,
    instructions: agent.instructions,
  });

  async function handleSave(): Promise<void> {
    updateAgent.mutate(
      { id: agent.id, ...formData },
      {
        onSuccess: () => {
          toast.success("Зміни збережено");
          router.push("/dashboard/agents");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  }

  async function handleDelete(): Promise<void> {
    try {
      await deleteAgent.mutateAsync(agent.id);
      toast.success("Агента видалено");
      router.push("/dashboard/agents");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
      } else {
        toast.error("Щось пішло не так.");
      }
    }
  }

  function handleTestCall(): void {
    if (!testPhone) return;
    testCall.mutate(
      { agent_id: agent.id, phone: testPhone },
      {
        onSuccess: () => {
          toast.success("Дзвінок ініційовано — очікуйте виклик");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AGENT_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  }

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

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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
}
