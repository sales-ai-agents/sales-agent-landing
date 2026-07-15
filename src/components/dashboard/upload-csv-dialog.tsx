"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadCsvDialogProps {
  onClose: () => void;
}

export function UploadCsvDialog({ onClose }: UploadCsvDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled>
              <Badge variant="secondary" className="mr-2">
                0 rows
              </Badge>
              Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
