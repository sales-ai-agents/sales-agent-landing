"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentFormData {
  name: string;
  voice: string;
  instructions: string;
}

export default function EditAgentPage() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock data — in real app would fetch based on params.id
  const [formData, setFormData] = useState<AgentFormData>({
    name: "Appointment Reminder Bot",
    voice: "sarah",
    instructions:
      "Call the customer to remind them about their appointment tomorrow. If they confirm, say 'Great, we'll see you then!' If they want to reschedule, ask for a preferred date and time.",
  });

  const handleSave = (): void => {
    router.push("/dashboard/agents");
  };

  const handleDelete = (): void => {
    router.push("/dashboard/agents");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Agent</h1>
          <p className="text-muted-foreground">Update your agent configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <select
              id="voice"
              value={formData.voice}
              onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
              className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="sarah">Sarah — Professional Female</option>
              <option value="james">James — Professional Male</option>
              <option value="emma">Emma — Friendly Female</option>
              <option value="michael">Michael — Friendly Male</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <textarea
              id="instructions"
              rows={5}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Agent
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Agent?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                This action cannot be undone. The agent and all its call history will be permanently
                deleted.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
