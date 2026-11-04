"use client";

import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button, Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import { AddContactDialog, ImportContactsDialog } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import {
  CALL_DIRECTION_OPTIONS,
  type ContactFormData,
  type CreateAgentFormData,
  type CallDirection,
} from "@/lib/schemas";
import { useCreateContact } from "@dashboard/hooks";
import { DIRECTION_ICONS } from "../../_components/direction-icons";
import { ContactPicker } from "../../_components/contact-picker";

interface StepCallTypeProps {
  form: UseFormReturn<CreateAgentFormData>;
}

export const StepCallType = ({ form }: StepCallTypeProps) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const [showAddContact, setShowAddContact] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const createContact = useCreateContact();

  const isOutbound = watch("callDirection") === "outbound";

  const handleCreateContact = (data: ContactFormData): void => {
    createContact.mutate(data, {
      onSuccess: () => {
        toast.success("Контакт додано");
        setShowAddContact(false);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Тип дзвінка та база контактів</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть, які дзвінки буде здійснювати агент.
        </p>
      </div>

      <Controller
        control={control}
        name="callDirection"
        render={({ field }) => (
          <RadioGroup
            aria-label="Тип дзвінка"
            value={field.value}
            onValueChange={(value) => field.onChange(value as CallDirection)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {CALL_DIRECTION_OPTIONS.map((option) => {
              const isSelected = field.value === option.value;
              const Icon = DIRECTION_ICONS[option.value];

              return (
                <Label
                  key={option.value}
                  htmlFor={`direction-${option.value}`}
                  className={cn(
                    "flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-5 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <Icon className="h-6 w-6" />
                    <RadioGroupItem
                      id={`direction-${option.value}`}
                      value={option.value}
                      className="h-5 w-5"
                    />
                  </div>
                  <p className="text-sm font-semibold">{option.title}</p>
                  <p className="text-muted-foreground text-xs">{option.description}</p>
                </Label>
              );
            })}
          </RadioGroup>
        )}
      />

      {isOutbound && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">База контактів</h3>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowImport(true)}>
                <Upload className="mr-1.5 h-4 w-4" />
                Імпорт контактів
              </Button>
              <Button type="button" size="sm" onClick={() => setShowAddContact(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Додати контакт
              </Button>
            </div>
          </div>

          <Controller
            control={control}
            name="contactIds"
            render={({ field }) => (
              <ContactPicker selectedIds={field.value} onChange={field.onChange} />
            )}
          />
          {errors.contactIds && (
            <p className="text-destructive text-sm">{errors.contactIds.message}</p>
          )}
        </div>
      )}

      {showAddContact && (
        <AddContactDialog onSubmit={handleCreateContact} onClose={() => setShowAddContact(false)} />
      )}
      {showImport && <ImportContactsDialog onClose={() => setShowImport(false)} />}
    </div>
  );
};
