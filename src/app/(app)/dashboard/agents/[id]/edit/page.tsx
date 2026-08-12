"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
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

interface AgentFormData {
  name: string;
  voice: string;
  instructions: string;
}

export default function EditAgentPage() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Agent</h1>
          <p className="text-muted-foreground">Update your agent configuration</p>
        </div>
      </div>

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Agent Configuration</h2>
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
            <Select
              value={formData.voice}
              onValueChange={(value) => setFormData({ ...formData, voice: value ?? "" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Sarah — Professional Female</SelectItem>
                <SelectItem value="james">James — Professional Male</SelectItem>
                <SelectItem value="emma">Emma — Friendly Female</SelectItem>
                <SelectItem value="michael">Michael — Friendly Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              rows={5}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Agent
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The agent and all its call history will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
