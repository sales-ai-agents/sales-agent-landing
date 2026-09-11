"use client";

import { useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Info, Upload } from "lucide-react";

import { Button } from "@/components/ui";

const ACCEPTED_FILE_EXTENSIONS = ".csv,.xlsx";
const BYTES_IN_KILOBYTE = 1024;

interface FileUploadPanelProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const isSupportedFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return name.endsWith(".csv") || name.endsWith(".xlsx");
};

const formatFileSize = (bytes: number): string => {
  const kilobytes = bytes / BYTES_IN_KILOBYTE;
  return `${kilobytes.toFixed(1)} КБ`;
};

export const FileUploadPanel = ({ file, onFileChange }: FileUploadPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onFileChange(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    const dropped = event.dataTransfer.files[0] ?? null;
    if (dropped && isSupportedFile(dropped)) onFileChange(dropped);
  };

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Обрати файл контактів"
        className="border-border hover:border-primary/50 flex flex-col items-center rounded-lg border-2 border-dashed p-8 text-center transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <Upload className="text-primary h-5 w-5" />
        </div>
        {file ? (
          <>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground mt-1 text-xs">{formatFileSize(file.size)}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium">Перетягніть файл сюди</p>
            <p className="text-muted-foreground mt-1 text-xs">або натисніть, щоб вибрати</p>
          </>
        )}
        <Button
          type="button"
          size="lg"
          className="mt-4 w-2xs"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Вибрати файл
        </Button>
        <p className="text-muted-foreground mt-4 text-xs">Підтримувані формати: CSV, XLSX</p>
        <p className="text-muted-foreground text-xs">Максимальний розмір файлу: 10 МБ</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="bg-primary/5 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Info className="text-primary h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">Вимоги до файлу</p>
        </div>
        <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-9 text-xs">
          <li>Рекомендовані колонки: Ім&apos;я, Телефон</li>
          <li>Допустимі формати телефону: +380 67 123 45 67, 0671234567</li>
          <li>Перший рядок може бути заголовком</li>
          <li>Максимум 50 000 контактів за один імпорт</li>
        </ul>
      </div>
    </div>
  );
};
