"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface UploadCsvDialogProps {
  onClose: () => void;
}

export function UploadCsvDialog({ onClose }: UploadCsvDialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Завантажити CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">Перетягніть CSV файл сюди</p>
            <p className="text-muted-foreground mt-1 text-xs">або натисніть, щоб обрати</p>
            <Button variant="outline" size="sm" className="mt-4">
              Обрати файл
            </Button>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="mb-1 text-xs font-medium">Очікувані колонки:</p>
            <p className="text-muted-foreground text-xs">name, phone, email</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button disabled>
            <Badge variant="secondary" className="mr-2">
              0 рядків
            </Badge>
            Імпортувати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
