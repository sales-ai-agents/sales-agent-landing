"use client";

import { useState } from "react";

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

const TAG_MAX_LENGTH = 40;

interface CreateTagDialogProps {
  existingTags: string[];
  onCreate: (tag: string) => void;
  onClose: () => void;
}

export const CreateTagDialog = ({ existingTags, onCreate, onClose }: CreateTagDialogProps) => {
  const [name, setName] = useState("");
  const tag = name.trim();
  const isDuplicate = existingTags.some((item) => item.toLowerCase() === tag.toLowerCase());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!tag || isDuplicate) return;
    onCreate(tag);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Створити тег</DialogTitle>
          <DialogDescription>
            Тег збережеться, щойно ви призначите його хоча б одному контакту.
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
              aria-invalid={isDuplicate}
              autoFocus
            />
            {isDuplicate && <p className="text-destructive text-sm">Такий тег уже є</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit" disabled={!tag || isDuplicate}>
              Створити
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
