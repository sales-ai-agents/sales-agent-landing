"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const NO_COLUMN_VALUE = "-1";

interface ColumnMappingProps {
  header: string[];
  phoneColumn: number;
  nameColumn: number;
  onPhoneColumnChange: (value: number) => void;
  onNameColumnChange: (value: number) => void;
}

const buildColumnLabel = (title: string, index: number): string => {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : `Колонка ${index + 1}`;
};

export const ColumnMapping = ({
  header,
  phoneColumn,
  nameColumn,
  onPhoneColumnChange,
  onNameColumnChange,
}: ColumnMappingProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="phone-column">Колонка з телефоном</Label>
        <Select
          value={phoneColumn >= 0 ? String(phoneColumn) : undefined}
          onValueChange={(value) => value !== null && onPhoneColumnChange(Number(value))}
        >
          <SelectTrigger id="phone-column" className="w-full">
            <SelectValue placeholder="Оберіть колонку" />
          </SelectTrigger>
          <SelectContent>
            {header.map((title, index) => (
              <SelectItem key={index} value={String(index)}>
                {buildColumnLabel(title, index)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name-column">Колонка з іменем</Label>
        <Select
          value={String(nameColumn)}
          onValueChange={(value) => value !== null && onNameColumnChange(Number(value))}
        >
          <SelectTrigger id="name-column" className="w-full">
            <SelectValue placeholder="Не імпортувати" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_COLUMN_VALUE}>Не імпортувати</SelectItem>
            {header.map((title, index) => (
              <SelectItem key={index} value={String(index)}>
                {buildColumnLabel(title, index)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
