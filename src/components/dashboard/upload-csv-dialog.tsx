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
          <DialogTitle>Upload CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">Drag & drop your CSV file here</p>
            <p className="text-muted-foreground mt-1 text-xs">or click to browse</p>
            <Button variant="outline" size="sm" className="mt-4">
              Choose File
            </Button>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="mb-1 text-xs font-medium">Expected columns:</p>
            <p className="text-muted-foreground text-xs">name, phone, email</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled>
            <Badge variant="secondary" className="mr-2">
              0 rows
            </Badge>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
