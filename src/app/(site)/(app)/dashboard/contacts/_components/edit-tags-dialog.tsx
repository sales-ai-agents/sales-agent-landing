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
} from "@/components/ui";
import { TagPicker } from "@/components/dashboard/tag-picker";
import type { Contact } from "@dashboard/types";

interface EditTagsDialogProps {
  contact: Contact;
  tagOptions: string[];
  isSaving: boolean;
  onSave: (tags: string[]) => void;
  onClose: () => void;
}

export const EditTagsDialog = ({
  contact,
  tagOptions,
  isSaving,
  onSave,
  onClose,
}: EditTagsDialogProps) => {
  const [tags, setTags] = useState<string[]>(contact.tags ?? []);
  const options = [...new Set([...tagOptions, ...tags])];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Теги контакту</DialogTitle>
          <DialogDescription>{contact.name || contact.phone}</DialogDescription>
        </DialogHeader>
        <TagPicker options={options} value={tags} onChange={setTags} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="button" onClick={() => onSave(tags)} disabled={isSaving}>
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
