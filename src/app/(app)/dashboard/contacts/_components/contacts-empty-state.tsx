import { Plus, Upload, Users } from "lucide-react";

import { Button } from "@/components/ui";

interface ContactsEmptyStateProps {
  onImport: () => void;
  onAdd: () => void;
}

export function ContactsEmptyState({ onImport, onAdd }: ContactsEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Users className="text-primary h-12 w-12" />
      <h2 className="mt-4 text-lg font-bold">Контактів ще немає</h2>
      <p className="text-muted-foreground mt-1 text-sm">Додайте перший контакт, щоб почати</p>
      <div className="mt-4 flex gap-3">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Імпорт CSV
        </Button>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Додати контакт
        </Button>
      </div>
    </div>
  );
}
