"use client";

import { RotateCcw } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

interface ResetCallTypeDialogProps {
  callTypeTitle: string;
  onConfirm: () => void;
}

export const ResetCallTypeDialog = ({ callTypeTitle, onConfirm }: ResetCallTypeDialogProps) => (
  <Dialog>
    <DialogTrigger
      render={
        <Button type="button" variant="ghost" size="sm">
          <RotateCcw />
          Скинути до стандартних
        </Button>
      }
    />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Скинути «{callTypeTitle}»?</DialogTitle>
        <DialogDescription>
          Інструкції та поля повернуться до стандартних значень цього типу дзвінка. Поточні зміни
          буде втрачено.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Скасувати</DialogClose>
        <DialogClose render={<Button type="button" variant="destructive" onClick={onConfirm} />}>
          Скинути
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
