"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import { TagPicker } from "./tag-picker";

interface AddContactDialogProps {
  tagOptions: string[];
  onSubmit: (data: ContactFormData, tags: string[]) => void;
  onClose: () => void;
}

export const AddContactDialog = ({ tagOptions, onSubmit, onClose }: AddContactDialogProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.stopPropagation();
    void handleSubmit((data) => onSubmit(data, tags))(event);
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Ім&apos;я</Label>
            <Input id="contact-name" placeholder="Повне ім'я" {...register("name")} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Телефон</Label>
            <Input id="contact-phone" placeholder="+380 XX XXX XXXX" {...register("phone")} />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Пошта</Label>
            <Input id="contact-email" placeholder="email@example.com" {...register("email")} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Теги</Label>
            <TagPicker options={tagOptions} value={tags} onChange={setTags} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit">Додати контакт</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
