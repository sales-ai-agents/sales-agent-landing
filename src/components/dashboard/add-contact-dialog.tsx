"use client";

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

interface AddContactDialogProps {
  onSubmit: (data: ContactFormData) => void;
  onClose: () => void;
}

export const AddContactDialog = ({ onSubmit, onClose }: AddContactDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Додати контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Ім&apos;я</Label>
            <Input id="contact-name" placeholder="Повне ім'я" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Телефон</Label>
            <Input id="contact-phone" placeholder="+380 XX XXX XXXX" {...register("phone")} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Пошта</Label>
            <Input id="contact-email" placeholder="email@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
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
