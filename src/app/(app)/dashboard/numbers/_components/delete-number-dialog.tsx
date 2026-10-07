"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { NUMBER_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { cn } from "@/lib/utils";
import { useDeleteNumber } from "@dashboard/hooks";

interface DeleteNumberDialogProps {
  id: number;
  phone: string;
  className?: string;
}

export const DeleteNumberDialog = ({ id, phone, className }: DeleteNumberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteNumber = useDeleteNumber();

  const handleDelete = (): void => {
    deleteNumber.mutate(id, {
      onSuccess: () => {
        toast.success("Номер відв'язано");
        setIsOpen(false);
      },
      onError: (error) => handleMutationError(error, NUMBER_ERROR_MESSAGES),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("text-muted-foreground hover:text-destructive", className)}
            aria-label={`Відв'язати номер ${phone}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Відв&apos;язати номер?</DialogTitle>
          <DialogDescription>
            {`Номер ${phone} буде відвʼязано від акаунта. Вхідні та вихідні дзвінки через нього
            припиняться. Цю дію неможливо скасувати.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Скасувати</DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteNumber.isPending}>
            {deleteNumber.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deleteNumber.isPending ? "Видалення..." : "Відв'язати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
