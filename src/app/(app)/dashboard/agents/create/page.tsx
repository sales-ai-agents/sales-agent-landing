"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Play, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWizardStore } from "@/lib/store";
import { useState } from "react";

const STEPS = ["Name", "Voice", "Instructions", "Test"] as const;

interface VoiceOption {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

const VOICES = [
  { id: "sarah", name: "Sarah", type: "Professional Female" },
  { id: "james", name: "James", type: "Professional Male" },
  { id: "emma", name: "Emma", type: "Friendly Female" },
  { id: "michael", name: "Michael", type: "Friendly Male" },
] as const satisfies readonly VoiceOption[];

export default function CreateAgentPage() {
  const router = useRouter();
  const [isCalling, setIsCalling] = useState(false);

  const {
    step,
    name,
    voice,
    instructions,
    testPhone,
    setStep,
    setName,
    setVoice,
    setInstructions,
    setTestPhone,
    reset,
  } = useWizardStore();

  function handleNext(): void {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  }

  function handleBack(): void {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  function handleCreate(): void {
    reset();
    router.push("/dashboard/agents");
  }

  function handleTestCall(): void {
    setIsCalling(true);
    setTimeout(() => setIsCalling(false), 3000);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Agent</h1>
          <p className="text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                index <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("h-0.5 w-8", index < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Name */}
          {step === 0 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Name your agent</CardTitle>
                <CardDescription>
                  Choose a descriptive name for your AI voice agent.
                </CardDescription>
              </CardHeader>
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., Appointment Reminder Bot"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Voice */}
          {step === 1 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Select a voice</CardTitle>
                <CardDescription>
                  Choose the voice your agent will use during calls.
                </CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VOICES.map((voiceOption) => (
                  <div
                    key={voiceOption.id}
                    onClick={() => setVoice(voiceOption.id)}
                    className={cn(
                      "cursor-pointer rounded-lg border p-4 transition-colors",
                      voice === voiceOption.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{voiceOption.name}</p>
                        <p className="text-muted-foreground text-sm">{voiceOption.type}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Instructions */}
          {step === 2 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Write instructions</CardTitle>
                <CardDescription>
                  Tell your agent what to do in plain language. No code needed.
                </CardDescription>
              </CardHeader>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <textarea
                  id="instructions"
                  rows={6}
                  placeholder="Call the customer to remind them about their appointment tomorrow. If they confirm, say 'Great, we'll see you then!' If they want to reschedule, ask for a preferred date and time. Always be polite and professional."
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                />
                <p className="text-muted-foreground text-xs">
                  Write as if you&apos;re explaining to a real person what to say on the call.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Test Call */}
          {step === 3 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Test your agent</CardTitle>
                <CardDescription>
                  Enter your phone number and we&apos;ll call you so you can hear your agent in
                  action.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-phone">Your Phone Number</Label>
                  <Input
                    id="test-phone"
                    placeholder="+1 (555) 000-0000"
                    value={testPhone}
                    onChange={(event) => setTestPhone(event.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleTestCall} disabled={isCalling}>
                  {isCalling ? (
                    <>
                      <Phone className="mr-2 h-4 w-4 animate-pulse" />
                      Calling...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Test Call My Phone
                    </>
                  )}
                </Button>
                {isCalling && (
                  <p className="text-muted-foreground animate-pulse text-center text-sm">
                    Your phone should ring in a few seconds...
                  </p>
                )}

                {/* Review summary */}
                <div className="bg-muted mt-6 space-y-2 rounded-lg p-4">
                  <h4 className="text-sm font-medium">Agent Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {name || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Voice:</span>{" "}
                      {VOICES.find((v) => v.id === voice)?.name || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Instructions:</span>{" "}
                      {instructions ? instructions.slice(0, 60) + "..." : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate}>
            <Check className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        )}
      </div>
    </div>
  );
}
