"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { useCreateContactTag } from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";

const TAG_MAX_LENGTH = 40;

interface CreateTagDialogProps {
  existingTags: string[];
  onCreated: (tag: string) => void;
  onClose: () => void;
}

export const CreateTagDialog = ({ existingTags, onCreated, onClose }: CreateTagDialogProps) => {
  const [name, setName] = useState("");
  const createTag = useCreateContactTag();

  const tag = name.trim();
  const isDuplicate = existingTags.some((t) => t.toLowerCase() === tag.toLowerCase());
  const hasComma = tag.includes(",");
  const isInvalid = isDuplicate || hasComma;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!tag || isInvalid) return;

    createTag.mutate(
      { name: tag },
      {
        onSuccess: (data) => {
          toast.success(
            data.created ? `Тег «${data.tag}» створено` : `Тег «${data.tag}» вже існує`
          );
          onCreated(data.tag);
          onClose();
        },
        onError: (err) => handleMutationError(err),
      }
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Створити тег</DialogTitle>
          <DialogDescription>
            Тег буде збережено одразу і з&#39;явиться у фільтрах.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Назва тегу</Label>
            <Input
              id="tag-name"
              value={name}
              maxLength={TAG_MAX_LENGTH}
              placeholder="Наприклад: Повторний"
              onChange={(event) => setName(event.target.value)}
              aria-invalid={isInvalid}
              autoFocus
              disabled={createTag.isPending}
            />
            {isDuplicate && <p className="text-destructive text-sm">Такий тег уже є</p>}
            {hasComma && (
              <p className="text-destructive text-sm">Назва тегу не може містити кому</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createTag.isPending}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={!tag || isInvalid || createTag.isPending}>
              {createTag.isPending ? "Створення..." : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
