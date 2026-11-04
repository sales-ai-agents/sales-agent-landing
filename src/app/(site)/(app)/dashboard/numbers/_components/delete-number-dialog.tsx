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
import type { NumberSource } from "@dashboard/types";

interface DeleteNumberDialogProps {
  id: number;
  phone: string;
  source: NumberSource;
  className?: string;
}

const ASSIGNED_CONFIRMATION =
  'Номер повернеться до Calls4U. Дзвінки на нього більше не прийматимуться, людина почує "номер не обслуговується". Отримати саме цей номер знову не вийде.';

const CONNECTED_CONFIRMATION =
  "Відключити номер? Дзвінки з вашої АТС чи переадресації перестануть доходити до агента.";

export const DeleteNumberDialog = ({ id, phone, source, className }: DeleteNumberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteNumber = useDeleteNumber();

  const confirmation = source === "assigned" ? ASSIGNED_CONFIRMATION : CONNECTED_CONFIRMATION;

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
          <DialogTitle>Відв&apos;язати номер {phone}?</DialogTitle>
          <DialogDescription>{confirmation}</DialogDescription>
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
