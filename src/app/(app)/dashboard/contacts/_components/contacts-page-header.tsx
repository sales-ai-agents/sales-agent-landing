import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ContactsPageHeaderProps {
  onImport: () => void;
  onAdd: () => void;
}

export function ContactsPageHeader({ onImport, onAdd }: ContactsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Контакти</h1>
        <p className="text-muted-foreground text-sm">
          Керуйте базою контактів для дзвінків ШІ-агента
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="px-6" onClick={onImport}>
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
