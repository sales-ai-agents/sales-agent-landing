"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUploadContacts } from "@dashboard/hooks/use-upload-contacts";

interface UploadCsvDialogProps {
  onClose: () => void;
}

export function UploadCsvDialog({ onClose }: UploadCsvDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadContacts();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0] ?? null;
    if (dropped && (dropped.name.endsWith(".csv") || dropped.type === "text/csv")) {
      setFile(dropped);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUpload = () => {
    if (!file) return;
    upload(file, {
      onSuccess: (data) => {
        toast.success(
          `Додано ${data.added} контактів${data.duplicates ? `, ${data.duplicates} дублікатів пропущено` : ""}`
        );
        onClose();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Завантажити CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Обрати CSV файл"
          >
            {file ? (
              <>
                <FileText className="text-primary mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground mt-1 text-xs">{file.size.toFixed(1)} КБ</p>
              </>
            ) : (
              <>
                <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-medium">Перетягніть CSV файл сюди</p>
                <p className="text-muted-foreground mt-1 text-xs">або натисніть, щоб обрати</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="bg-muted rounded-md py-3">
            <p className="mb-1 text-xs font-medium">Очікувані колонки:</p>
            <p className="text-muted-foreground text-xs">name, phone, email</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={handleUpload} disabled={!file || isPending}>
            {isPending ? "Завантаження..." : "Імпортувати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
