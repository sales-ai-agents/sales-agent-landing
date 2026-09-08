"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import type { AgentLanguage } from "@/lib/types";

interface BusinessProps {
  initialCompany: string;
  initialShortName: string;
  initialWebsite: string;
  initialLanguage: AgentLanguage;
}

const LANGUAGE_OPTIONS = [
  { value: "uk", label: "Українська" },
  { value: "en", label: "English" },
];

export const Business = ({
  initialCompany,
  initialShortName,
  initialWebsite,
  initialLanguage,
}: BusinessProps) => {
  const [company, setCompany] = useState(initialCompany);
  const [shortName, setShortName] = useState(initialShortName);
  const [website, setWebsite] = useState(initialWebsite);
  const [language, setLanguage] = useState<AgentLanguage>(initialLanguage);

  const updateProfile = useUpdateProfile();
  const selectedLabel = LANGUAGE_OPTIONS.find((opt) => opt.value === language)?.label;

  const handleSave = () => {
    updateProfile.mutate(
      { company, short_name: shortName, website, agent_language: language },
      {
        onSuccess: () => toast.success("Дані бізнесу оновлено"),
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  };

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Дані бізнесу</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Інформація про ваш бізнес, яку агент використовує під час дзвінків
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="company-name" className="text-xs">
            Назва компанії (вимовляється агентом)
          </Label>
          <Input
            id="company-name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Calls4U"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="short-name" className="text-xs">
            Коротка назва для відображення
          </Label>
          <Input
            id="short-name"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            placeholder="Calls4U"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="website" className="text-xs">
            Сайт компанії (необов&apos;язково)
          </Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Мова спілкування агентів за замовчуванням</Label>
          <Select value={language} onValueChange={(val) => setLanguage(val as AgentLanguage)}>
            <SelectTrigger className="h-10! w-full rounded-md">
              <SelectValue>{selectedLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button size="sm" className="mt-4" onClick={handleSave} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
      </Button>
    </section>
  );
};
